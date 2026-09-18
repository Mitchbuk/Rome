/* =====================================================================
   sw.js — Service Worker "Rome en famille"
   ---------------------------------------------------------------------
   Deux caches distincts :
   1. SHELL  (versionné) : les fichiers de l'application. À chaque
      déploiement, GitHub Actions remplace __VERSION__ par l'identifiant
      du commit : le nom du cache change, les anciens sont supprimés,
      l'app se met à jour proprement (cache busting).
   2. TUILES (non versionné) : les tuiles OpenStreetMap déjà affichées
      ou préchargées. Elles survivent aux mises à jour de l'app et sont
      limitées en nombre (MAX_TILES) pour ne pas saturer le stockage.
   ===================================================================== */

'use strict';

const VERSION = '__VERSION__';                // remplacé automatiquement au déploiement
const SHELL_CACHE = `rome-shell-${VERSION}`;
const TILE_CACHE = 'rome-tiles-v1';           // DOIT être identique à app.js
const MAX_TILES = 3000;                       // ~60-75 Mo maximum de tuiles
const TILE_HOST = 'tile.openstreetmap.org';

/** Fichiers indispensables au fonctionnement hors-ligne (chemins relatifs = compatibles GitHub Pages). */
const SHELL_FILES = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './monuments.js',
  './manifest.json',
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
];

/* ---------- Installation : mise en cache de l'app ---------- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_FILES))
    // Pas de skipWaiting() automatique : la page propose "Mettre à jour" (voir app.js),
    // et la nouvelle version s'active de toute façon au prochain lancement de l'app.
  );
});

/* ---------- Activation : nettoyage des anciens caches de l'app ---------- */
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const noms = await caches.keys();
    await Promise.all(
      noms
        .filter((n) => n.startsWith('rome-shell-') && n !== SHELL_CACHE)
        .map((n) => caches.delete(n))
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

  // 1) Tuiles de carte : cache d'abord, réseau sinon, puis mise en cache
  if (url.hostname === TILE_HOST) {
    event.respondWith(servirTuile(req));
    return;
  }

  // 2) Fichiers de l'application (même origine) : cache d'abord
  if (url.origin === self.location.origin) {
    event.respondWith(servirShell(req));
    return;
  }

  // 3) Autres ressources externes : réseau, cache en secours
  event.respondWith(
    fetch(req).catch(() => caches.match(req).then((r) => r || Response.error()))
  );
});

/**
 * Stratégie "cache-first" pour les tuiles OSM.
 * Une tuile déjà vue est servie instantanément (et hors-ligne). Une tuile
 * inconnue est téléchargée puis stockée, avec limitation du nombre d'entrées.
 */
async function servirTuile(req) {
  const cache = await caches.open(TILE_CACHE);
  const enCache = await cache.match(req.url);
  if (enCache) return enCache;

  try {
    const res = await fetch(req);
    if (res && res.ok) {
      // put() en tâche de fond pour ne pas retarder l'affichage
      cache.put(req.url, res.clone()).then(() => limiterTuiles(cache)).catch(() => {});
    }
    return res;
  } catch (e) {
    // Hors-ligne et tuile absente : image transparente 1x1 pour éviter les icônes "cassées"
    return new Response(TUILE_VIDE, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' } });
  }
}

/** Supprime les tuiles les plus anciennes quand on dépasse MAX_TILES (vérification 1 fois sur 25). */
let compteurPut = 0;
async function limiterTuiles(cache) {
  compteurPut = (compteurPut + 1) % 25;
  if (compteurPut !== 0) return;
  const cles = await cache.keys();
  if (cles.length <= MAX_TILES) return;
  // Les clés sont renvoyées dans l'ordre d'insertion : on retire les plus anciennes
  const aSupprimer = cles.slice(0, cles.length - MAX_TILES + 200);
  await Promise.all(aSupprimer.map((k) => cache.delete(k)));
}

/**
 * Stratégie "cache-first" pour l'application.
 * Les fichiers précachés sont servis depuis le cache versionné ; tout autre
 * fichier de même origine est récupéré sur le réseau puis mis en cache.
 * En navigation hors-ligne, index.html est renvoyé en secours.
 */
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
