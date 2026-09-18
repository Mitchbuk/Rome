/* =====================================================================
   sw.js — Service Worker "Rome en famille"
   ---------------------------------------------------------------------
   Trois caches distincts :
   1. SHELL  (versionné) : les fichiers de l'application + vignettes des
      lieux. À chaque déploiement, GitHub Actions remplace __VERSION__ par
      l'identifiant du commit : le nom du cache change, les anciens sont
      supprimés, l'app se met à jour proprement (cache busting).
   2. TUILES (non versionné) : les tuiles OpenStreetMap déjà affichées ou
      préchargées, limitées en nombre (MAX_TILES).
   3. MÉDIAS (non versionné) : photos grand format et audios MP3, mis en
      cache à la demande ou via le bouton "Audios et photos". Les requêtes
      partielles (Range) de Safari sont servies depuis le cache.
   ===================================================================== */

'use strict';

const VERSION = '__VERSION__';                // remplacé automatiquement au déploiement
const SHELL_CACHE = `rome-shell-${VERSION}`;
const TILE_CACHE = 'rome-tiles-v1';           // DOIT être identique à app.js
const MEDIA_CACHE = 'rome-media-v1';          // DOIT être identique à app.js
const MAX_TILES = 3000;                       // ~60-75 Mo maximum de tuiles
const TILE_HOST = 'tile.openstreetmap.org';

/* La liste des lieux sert à précacher leurs vignettes (photo de chaque marqueur). */
importScripts('./monuments.js');

/** Fichiers indispensables au fonctionnement hors-ligne (chemins relatifs = compatibles GitHub Pages). */
const SHELL_FILES = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './monuments.js',
  './manifest.json',
  './img/credits.json',
  './audio/manifest.json',
  './lib/leaflet/leaflet.js',
  './lib/leaflet/leaflet.css',
  './lib/leaflet/images/marker-icon.png',
  './lib/leaflet/images/marker-icon-2x.png',
  './lib/leaflet/images/marker-shadow.png',
  './lib/leaflet/images/layers.png',
  './lib/leaflet/images/layers-2x.png',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/favicon-32.png'
].concat(MONUMENTS.map((m) => `./img/${m.id}-thumb.jpg`));

/* ---------- Installation : mise en cache de l'app ---------- */
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    // Chaque fichier est ajouté individuellement : un fichier facultatif manquant
    // (ex. audio/manifest.json avant la première génération) ne bloque pas l'installation.
    await Promise.all(SHELL_FILES.map(async (f) => {
      try { await cache.add(f); } catch (e) { console.warn('[SW] non précaché :', f); }
    }));
  })());
});

/* ---------- Activation : nettoyage des anciens caches de l'app ---------- */
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const noms = await caches.keys();
    await Promise.all(
      noms.filter((n) => n.startsWith('rome-shell-') && n !== SHELL_CACHE).map((n) => caches.delete(n))
    );
    await self.clients.claim();
  })());
});

/* ---------- Message depuis la page : activer la nouvelle version ---------- */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

/* ---------- Interception des requêtes ---------- */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // 1) Tuiles de carte
  if (url.hostname === TILE_HOST) { event.respondWith(servirTuile(req)); return; }

  if (url.origin === self.location.origin) {
    // 2) Médias lourds (MP3, photos grand format) : cache média + gestion des requêtes Range
    if (/\/audio\/.+\.mp3$/.test(url.pathname) || (/\/img\/.+\.jpg$/.test(url.pathname) && !url.pathname.endsWith('-thumb.jpg'))) {
      event.respondWith(servirMedia(req));
      return;
    }
    // 3) Fichiers de l'application : cache d'abord
    event.respondWith(servirShell(req));
    return;
  }

  // 4) Autres ressources externes : réseau, cache en secours
  event.respondWith(fetch(req).catch(() => caches.match(req).then((r) => r || Response.error())));
});

/** Tuiles OSM : cache d'abord, réseau sinon, puis mise en cache limitée. */
async function servirTuile(req) {
  const cache = await caches.open(TILE_CACHE);
  const enCache = await cache.match(req.url);
  if (enCache) return enCache;
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req.url, res.clone()).then(() => limiterTuiles(cache)).catch(() => {});
    return res;
  } catch (e) {
    return new Response(TUILE_VIDE, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' } });
  }
}

let compteurPut = 0;
async function limiterTuiles(cache) {
  compteurPut = (compteurPut + 1) % 25;
  if (compteurPut !== 0) return;
  const cles = await cache.keys();
  if (cles.length <= MAX_TILES) return;
  const aSupprimer = cles.slice(0, cles.length - MAX_TILES + 200);
  await Promise.all(aSupprimer.map((k) => cache.delete(k)));
}

/**
 * Médias (MP3, photos) : cache d'abord. Safari demande les fichiers audio par
 * morceaux (en-tête Range) ; une réponse complète depuis le cache ne suffit pas,
 * il faut renvoyer un 206 avec la tranche demandée.
 * Si le fichier n'est pas en cache, on télécharge la version COMPLÈTE (sans Range)
 * pour pouvoir la stocker, puis on sert la tranche.
 */
async function servirMedia(req) {
  const cache = await caches.open(MEDIA_CACHE);
  const url = req.url.split('#')[0];
  let complet = await cache.match(url);

  if (!complet) {
    try {
      const res = await fetch(url, { headers: {} });   // requête neuve, sans Range
      if (!res.ok) return res;
      await cache.put(url, res.clone());
      complet = res;
    } catch (e) {
      return new Response('', { status: 503, statusText: 'Hors-ligne, média non téléchargé' });
    }
  }

  const range = req.headers.get('range');
  if (!range) return complet;

  const buffer = await complet.arrayBuffer();
  const taille = buffer.byteLength;
  const m = /bytes=(\d*)-(\d*)/.exec(range);
  let debut = m && m[1] ? parseInt(m[1], 10) : 0;
  let fin = m && m[2] ? parseInt(m[2], 10) : taille - 1;
  if (m && !m[1] && m[2]) { debut = Math.max(0, taille - parseInt(m[2], 10)); fin = taille - 1; }
  fin = Math.min(fin, taille - 1);
  if (debut > fin || debut >= taille) {
    return new Response('', { status: 416, headers: { 'Content-Range': `bytes */${taille}` } });
  }
  return new Response(buffer.slice(debut, fin + 1), {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': complet.headers.get('Content-Type') || (url.endsWith('.mp3') ? 'audio/mpeg' : 'image/jpeg'),
      'Content-Range': `bytes ${debut}-${fin}/${taille}`,
      'Content-Length': String(fin - debut + 1),
      'Accept-Ranges': 'bytes'
    }
  });
}

/** Fichiers de l'application : cache d'abord, réseau sinon ; index.html en secours hors-ligne. */
async function servirShell(req) {
  const enCache = await caches.match(req, { ignoreSearch: true });
  if (enCache) return enCache;
  try {
    const res = await fetch(req);
    if (res && res.ok) {
      const cache = await caches.open(SHELL_CACHE);
      cache.put(req, res.clone()).catch(() => {});
    }
    return res;
  } catch (e) {
    if (req.mode === 'navigate') {
      const index = await caches.match('./index.html');
      if (index) return index;
    }
    return Response.error();
  }
}

/** PNG transparent 1x1 (tuile de secours hors-ligne). */
const TUILE_VIDE = Uint8Array.from(atob(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
), (c) => c.charCodeAt(0));
