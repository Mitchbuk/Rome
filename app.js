/* =====================================================================
   app.js — Logique de l'application "Rome en famille"
   ---------------------------------------------------------------------
   Modules (dans l'ordre) :
     1. Constantes et état global
     2. Utilitaires (distance, formats, HTML)
     3. Mémoire "déjà vu" (localStorage)
     4. Liste "Autour de moi" (tri temps réel par distance + filtres)
     5. Carte Leaflet (marqueurs, point bleu GPS, mini-fiche)
     6. Fiche détail (bottom sheet) et actions
     7. Synthèse vocale (Web Speech API, hors-ligne)
     8. Géolocalisation
     9. Préchargement des tuiles pour le mode hors-ligne
    10. Onglets, toast, Service Worker, initialisation
   Tout est en JavaScript "vanilla", sans dépendance autre que Leaflet.
   ===================================================================== */

(function () {
  'use strict';

  /* ===================================================================
     1. CONSTANTES ET ÉTAT
     =================================================================== */

  /** URL des tuiles OpenStreetMap (sans sous-domaines, conformément à la politique OSM). */
  const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  /** Nom du cache des tuiles : DOIT être identique à celui de sw.js. */
  const TILE_CACHE = 'rome-tiles-v1';
  /** Centre par défaut (Piazza Venezia) et zoom initial. */
  const ROME_CENTER = [41.8955, 12.4823];
  const ZOOM_INITIAL = 14;
  /** Zone préchargée pour le hors-ligne : centre historique + Vatican + début de la Via Appia. */
  const PRELOAD_BOUNDS = { north: 41.925, south: 41.850, west: 12.430, east: 12.535 };
  const PRELOAD_ZOOMS = [12, 13, 14, 15, 16];
  const TAILLE_TUILE_KO = 25; // estimation moyenne pour l'affichage

  const LS_VISITED = 'rome.visited';
  const LS_TAB = 'rome.tab';

  const state = {
    position: null,        // { lat, lon } ou null
    accuracy: null,        // précision GPS en mètres
    watchId: null,         // identifiant de watchPosition
    userMovedMap: false,   // l'utilisateur a déplacé la carte : ne plus recentrer automatiquement
    filter: 'tous',        // filtre de catégorie actif
    visited: new Set(),    // identifiants des lieux marqués "vu"
    current: null,         // lieu affiché dans la fiche
    miniLieu: null,        // lieu affiché dans la mini-fiche de la carte
    map: null,
    markers: {},           // id -> L.marker
    userMarker: null,
    accuracyCircle: null,
    // synthèse vocale
    speaking: false,
    paused: false,
    queue: [],
    queueIndex: 0,
    wakeLock: null,
    // préchargement
    preloading: false,
    // rendu de liste (throttle)
    listTimer: null,
    lastListRender: 0,
    swRegistration: null
  };

  /** Raccourci de sélection DOM. */
  const $ = (sel) => document.querySelector(sel);
  const el = {};

  /* ===================================================================
     2. UTILITAIRES
     =================================================================== */

  /** Distance en mètres entre deux points GPS (formule de Haversine). */
  function distanceM(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  /** "350 m" sous 1 km, sinon "1,2 km". */
  function formatDistance(m) {
    if (m == null || !isFinite(m)) return '—';
    if (m < 1000) return `${Math.max(10, Math.round(m / 10) * 10)} m`;
    return `${(m / 1000).toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`;
  }

  /** Temps de marche approximatif (4,5 km/h, soit 75 m/min). */
  function formatMarche(m) {
    if (m == null || !isFinite(m)) return '';
    const min = Math.round(m / 75);
    if (min < 1) return 'vous y êtes';
    if (min < 60) return `${min} min à pied`;
    return `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')} à pied`;
  }

  /** 45 -> "45 min", 90 -> "1 h 30", 120 -> "2 h". */
  function formatDuree(min) {
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const r = min % 60;
    return r ? `${h} h ${String(r).padStart(2, '0')}` : `${h} h`;
  }

  /** Échappe le HTML pour injecter du texte en toute sécurité. */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  /** Distance entre la position actuelle et un lieu (null si pas de GPS). */
  function distanceVers(m) {
    if (!state.position) return null;
    return distanceM(state.position.lat, state.position.lon, m.lat, m.lon);
  }

  function lieuParId(id) {
    return MONUMENTS.find((m) => m.id === id) || null;
  }

  /* ===================================================================
     3. MÉMOIRE "DÉJÀ VU"
     =================================================================== */

  function chargerVisites() {
    try {
      const raw = localStorage.getItem(LS_VISITED);
      if (raw) state.visited = new Set(JSON.parse(raw));
    } catch (e) { /* stockage indisponible (navigation privée) : on ignore */ }
  }

  function sauverVisites() {
    try {
      localStorage.setItem(LS_VISITED, JSON.stringify([...state.visited]));
    } catch (e) { /* ignore */ }
  }

  function basculerVisite(id) {
    if (state.visited.has(id)) state.visited.delete(id);
    else state.visited.add(id);
    sauverVisites();
    // Met à jour le marqueur, la liste et le bouton de la fiche
    const m = lieuParId(id);
    if (m && state.markers[id]) state.markers[id].setIcon(makeIcon(m));
    renderListe();
    updateVisitedBtn();
  }

  /* ===================================================================
     4. LISTE "AUTOUR DE MOI"
     =================================================================== */

  /** Lieux filtrés puis triés du plus proche au plus lointain (si GPS). */
  function lieuxTries() {
    let arr = MONUMENTS.map((m) => ({ m, d: distanceVers(m) }));
    if (state.filter !== 'tous') arr = arr.filter((x) => x.m.categorie === state.filter);
    if (state.position) arr.sort((a, b) => a.d - b.d);
    return arr;
  }

  function renderListe() {
    state.lastListRender = Date.now();
    const items = lieuxTries();
    el.liste.innerHTML = items.map(({ m, d }) => {
      const vu = state.visited.has(m.id);
      const cat = CATEGORIES[m.categorie];
      return `
        <li>
          <button class="lieu${vu ? ' is-visited' : ''}" type="button" data-id="${m.id}">
            <span class="lieu-emoji" aria-hidden="true">${m.emoji}</span>
            <span class="lieu-texte">
              <span class="lieu-nom">${escapeHtml(m.nom)}</span>
              <span class="lieu-meta">${cat.label} · ${formatDuree(m.duree)}${vu ? ' · ✓ vu' : ''}</span>
            </span>
            <span class="lieu-dist">
              <span class="lieu-dist-val">${formatDistance(d)}</span>
              ${d != null ? `<span class="lieu-dist-sub">${formatMarche(d)}</span>` : ''}
            </span>
            <span class="lieu-chevron" aria-hidden="true">›</span>
          </button>
        </li>`;
    }).join('');
    el.listeHint.hidden = !!state.position;
  }

  /** Re-rendu de la liste au plus toutes les 1,5 s (le GPS envoie des positions très souvent). */
  function scheduleListRender() {
    const delay = Math.max(0, 1500 - (Date.now() - state.lastListRender));
    clearTimeout(state.listTimer);
    state.listTimer = setTimeout(renderListe, delay);
  }

  function renderChips() {
    const chips = [{ id: 'tous', label: 'Tous' }].concat(
      Object.entries(CATEGORIES).map(([id, c]) => ({ id, label: `${c.emoji} ${c.label}` }))
    );
    el.chips.innerHTML = chips.map((c) =>
      `<button class="chip${c.id === state.filter ? ' is-active' : ''}" type="button" role="tab"
               aria-selected="${c.id === state.filter}" data-filter="${c.id}">${c.label}</button>`
    ).join('');
  }

  /* ===================================================================
     5. CARTE LEAFLET
     =================================================================== */

  /** Icône HTML d'un lieu (emoji dans un cercle). */
  function makeIcon(m, selected) {
    const classes = ['marker-lieu'];
    if (state.visited.has(m.id)) classes.push('is-visited');
    if (selected) classes.push('is-selected');
    return L.divIcon({
      className: classes.join(' '),
      html: `<span aria-hidden="true">${m.emoji}</span>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
  }

  function initMap() {
    const map = L.map('map', {
      zoomControl: false,          // le pincement suffit sur iPhone
      attributionControl: true,
      zoomSnap: 0.5,
      inertia: true
    });

    L.tileLayer(TILE_URL, {
      minZoom: 10,
      maxZoom: 19,
      crossOrigin: true,           // réponses CORS "propres" -> mises en cache sans surcoût
      detectRetina: false,         // 4x moins de tuiles à télécharger et stocker
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    map.setView(ROME_CENTER, ZOOM_INITIAL);

    MONUMENTS.forEach((m) => {
      const marker = L.marker([m.lat, m.lon], { icon: makeIcon(m), title: m.nom, riseOnHover: true });
      marker.on('click', () => showMini(m));
      marker.addTo(map);
      state.markers[m.id] = marker;
    });

    map.on('click', hideMini);
    map.on('dragstart', () => { state.userMovedMap = true; });
    state.map = map;
  }

  /** Crée ou déplace le point bleu et son cercle de précision. */
  function updateUserMarker() {
    if (!state.map || !state.position) return;
    const ll = [state.position.lat, state.position.lon];
    const radius = Math.min(state.accuracy || 0, 500);
    if (!state.userMarker) {
      state.accuracyCircle = L.circle(ll, {
        radius, color: '#007AFF', weight: 1, fillColor: '#007AFF', fillOpacity: 0.12, interactive: false
      }).addTo(state.map);
      state.userMarker = L.marker(ll, {
        icon: L.divIcon({ className: 'user-dot-wrap', html: '<div class="user-dot"></div>', iconSize: [24, 24], iconAnchor: [12, 12] }),
        interactive: false,
        zIndexOffset: 1000
      }).addTo(state.map);
      // Premier point GPS : on centre la carte si l'utilisateur ne l'a pas déjà déplacée
      if (!state.userMovedMap) state.map.setView(ll, 15);
    } else {
      state.userMarker.setLatLng(ll);
      state.accuracyCircle.setLatLng(ll).setRadius(radius);
    }
  }

  function centrerSurMoi() {
    if (!state.map) return;
    if (state.position) {
      state.map.setView([state.position.lat, state.position.lon], Math.max(state.map.getZoom(), 16), { animate: true });
    } else {
      toast('Position GPS pas encore disponible…');
      rafraichirGps();
    }
  }

  /** Mini-fiche en bas de la carte (au tap sur un marqueur). */
  function showMini(m) {
    if (state.miniLieu && state.markers[state.miniLieu.id]) {
      state.markers[state.miniLieu.id].setIcon(makeIcon(state.miniLieu, false));
    }
    state.miniLieu = m;
    state.markers[m.id].setIcon(makeIcon(m, true));
    el.miniEmoji.textContent = m.emoji;
    el.miniNom.textContent = m.nom;
    updateMiniMeta();
    el.mapMini.classList.add('is-visible');
    el.viewCarte.classList.add('has-mini');
    state.map.panTo([m.lat, m.lon], { animate: true });
  }

  function updateMiniMeta() {
    if (!state.miniLieu) return;
    const d = distanceVers(state.miniLieu);
    const parts = [formatDuree(state.miniLieu.duree)];
    if (d != null) parts.push(`${formatDistance(d)} · ${formatMarche(d)}`);
    el.miniMeta.textContent = parts.join(' · ');
  }

  function hideMini() {
    if (state.miniLieu && state.markers[state.miniLieu.id]) {
      state.markers[state.miniLieu.id].setIcon(makeIcon(state.miniLieu, false));
    }
    state.miniLieu = null;
    el.mapMini.classList.remove('is-visible');
    el.viewCarte.classList.remove('has-mini');
  }

  /* ===================================================================
     6. FICHE DÉTAIL
     =================================================================== */

  function openSheet(id) {
    const m = lieuParId(id);
    if (!m) return;
    stopSpeech();
    state.current = m;
    const cat = CATEGORIES[m.categorie];
    const d = distanceVers(m);
    el.sheetBody.innerHTML = `
      <header class="fiche-head">
        <span class="fiche-emoji" aria-hidden="true">${m.emoji}</span>
        <h2 id="fiche-titre">${escapeHtml(m.nom)}</h2>
      </header>
      <div class="fiche-meta">
        <span class="meta">⏱ ${formatDuree(m.duree)}</span>
        <span class="meta meta-dist" id="fiche-dist">${d != null ? `📍 ${formatDistance(d)} · ${formatMarche(d)}` : '📍 distance inconnue'}</span>
        <span class="meta">${cat.emoji} ${cat.label}</span>
      </div>
      <section class="fiche-section">
        <h3>L'essentiel</h3>
        <p>${escapeHtml(m.description)}</p>
      </section>
      <section class="fiche-section fiche-enfants">
        <h3>🧒 Pour les enfants (9–12 ans)</h3>
        <p>${escapeHtml(m.enfants)}</p>
      </section>
      <section class="fiche-section fiche-conseil">
        <h3>💡 Conseil pratique</h3>
        <p>${escapeHtml(m.conseil)}</p>
      </section>`;
    el.sheetBody.scrollTop = 0;
    updateVisitedBtn();
    updateAudioBtn();
    el.sheet.classList.add('is-open');
    el.sheet.setAttribute('aria-hidden', 'false');
  }

  function closeSheet() {
    stopSpeech();
    el.sheet.classList.remove('is-open');
    el.sheet.setAttribute('aria-hidden', 'true');
    state.current = null;
  }

  function updateVisitedBtn() {
    const on = !!(state.current && state.visited.has(state.current.id));
    el.btnVisited.classList.toggle('is-on', on);
    el.btnVisited.setAttribute('aria-pressed', String(on));
    el.btnVisited.innerHTML = on ? '<span aria-hidden="true">✓</span> Vu !' : '<span aria-hidden="true">✓</span> Vu';
  }

  /** Met à jour la distance affichée dans la fiche ouverte (appelé à chaque position GPS). */
  function updateSheetDistance() {
    if (!state.current) return;
    const node = $('#fiche-dist');
    const d = distanceVers(state.current);
    if (node && d != null) node.textContent = `📍 ${formatDistance(d)} · ${formatMarche(d)}`;
  }

  /** Ouvre Plans (Apple) ou Google Maps en mode piéton vers le lieu. */
  function ouvrirItineraire() {
    if (!state.current) return;
    const { lat, lon, nom } = state.current;
    const url = `https://maps.apple.com/?daddr=${lat},${lon}&dirflg=w&q=${encodeURIComponent(nom)}`;
    window.open(url, '_blank', 'noopener');
  }

  function voirSurCarte() {
    if (!state.current) return;
    const m = state.current;
    closeSheet();
    showTab('carte');
    state.userMovedMap = true; // ne pas recentrer sur le GPS ensuite
    setTimeout(() => {
      state.map.invalidateSize();
      state.map.setView([m.lat, m.lon], 17, { animate: false });
      showMini(m);
    }, 260);
  }

  /* ===================================================================
     7. SYNTHÈSE VOCALE (Web Speech API — 100 % locale, sans réseau)
     =================================================================== */

  const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
  let voixFr = null;

  /** Choisit la meilleure voix française disponible sur l'appareil. */
  function choisirVoix() {
    if (!synth) return;
    const voices = synth.getVoices();
    if (!voices || !voices.length) return;
    const fr = voices.filter((v) => /^fr/i.test(v.lang));
    if (!fr.length) { voixFr = null; return; }
    const score = (v) =>
      (/fr[-_]FR/i.test(v.lang) ? 4 : 0) +
      (v.localService ? 2 : 0) +
      (/thomas|audrey|am[ée]lie|aur[ée]lie|marie|daniel|premium|enhanced|am[ée]lior/i.test(v.name) ? 1 : 0) +
      (v.default ? 0.5 : 0);
    fr.sort((a, b) => score(b) - score(a));
    voixFr = fr[0];
  }

  /** Adapte le texte écrit pour une lecture naturelle (abréviations, nombres). */
  function texteParle(t) {
    return t
      .replace(/av\.\s?J\.-C\./g, 'avant Jésus-Christ')
      .replace(/apr\.\s?J\.-C\./g, 'après Jésus-Christ')
      .replace(/(\d)\s(\d{3})\b/g, '$1$2')          // "1 462" -> "1462"
      .replace(/(\d)\s?km\b/g, '$1 kilomètres')
      .replace(/(\d)\s?m\b(?![²³])/g, '$1 mètres')
      .replace(/(\d)\s?m²/g, '$1 mètres carrés')
      .replace(/(\d)\s?h\s?(\d{2})\b/g, '$1 heures $2')
      .replace(/(\d)\s?h\b/g, '$1 heures')
      .replace(/\bJ\.-C\./g, 'Jésus-Christ');
  }

  /** Découpe le texte en morceaux de ~220 caractères, coupés en fin de phrase. */
  function construireMorceaux(m) {
    const texte = texteParle(`${m.nom}. ${m.description} Et maintenant, la partie pour les enfants. ${m.enfants}`);
    const phrases = texte.match(/[^.!?…]+[.!?…]+[»"”)]?\s*|[^.!?…]+$/g) || [texte];
    const morceaux = [];
    let cur = '';
    for (const p of phrases) {
      if (cur && (cur + p).length > 220) { morceaux.push(cur.trim()); cur = p; }
      else cur += p;
    }
    if (cur.trim()) morceaux.push(cur.trim());
    return morceaux;
  }

  function updateAudioBtn() {
    if (!synth) {
      el.btnAudioLabel.textContent = 'Audio indisponible';
      el.btnAudio.disabled = true;
      return;
    }
    el.btnAudio.disabled = false;
    if (state.speaking && !state.paused) {
      el.btnAudioLabel.textContent = 'Pause';
      el.btnAudio.querySelector('.btn-audio-icon').textContent = '⏸';
    } else if (state.speaking && state.paused) {
      el.btnAudioLabel.textContent = 'Reprendre';
      el.btnAudio.querySelector('.btn-audio-icon').textContent = '▶️';
    } else {
      el.btnAudioLabel.textContent = 'Écouter le guide';
      el.btnAudio.querySelector('.btn-audio-icon').textContent = '🔊';
    }
    el.btnAudio.classList.toggle('is-playing', state.speaking);
    el.btnStop.hidden = !state.speaking;
    if (!state.speaking) el.audioFill.style.transform = 'scaleX(0)';
  }

  /** Bouton principal : lance, met en pause ou reprend la lecture. */
  function basculerLecture() {
    if (!synth) { toast("La synthèse vocale n'est pas disponible sur cet appareil."); return; }
    if (!state.current) return;

    if (state.speaking && !state.paused) {
      synth.pause();
      state.paused = true;
      updateAudioBtn();
      return;
    }
    if (state.speaking && state.paused) {
      synth.resume();
      state.paused = false;
      updateAudioBtn();
      return;
    }
    // Démarrage
    choisirVoix();
    synth.cancel();
    state.queue = construireMorceaux(state.current);
    state.queueIndex = 0;
    state.speaking = true;
    state.paused = false;
    updateAudioBtn();
    demanderWakeLock();
    // Petit délai : Safari iOS ignore parfois un speak() immédiatement après cancel()
    setTimeout(lireSuivant, 80);
  }

  function lireSuivant() {
    if (!state.speaking) return;
    if (state.queueIndex >= state.queue.length) { stopSpeech(); return; }

    const texte = state.queue[state.queueIndex++];
    const u = new SpeechSynthesisUtterance(texte);
    u.lang = 'fr-FR';
    if (voixFr) u.voice = voixFr;
    u.rate = 0.95;
    u.pitch = 1;
    u.volume = 1;
    u.onstart = () => {
      el.audioFill.style.transform = `scaleX(${(state.queueIndex - 1) / state.queue.length})`;
    };
    u.onend = () => { lireSuivant(); };
    u.onerror = (e) => {
      // "interrupted" / "canceled" surviennent après un cancel() volontaire : on ignore
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      console.warn('Erreur de synthèse vocale :', e.error);
      stopSpeech();
    };
    synth.speak(u);
  }

  function stopSpeech() {
    // L'état est réinitialisé AVANT cancel() : sur certains navigateurs, cancel()
    // déclenche onend de façon synchrone, ce qui relancerait la lecture.
    state.speaking = false;
    state.paused = false;
    state.queue = [];
    state.queueIndex = 0;
    if (synth) { try { synth.cancel(); } catch (e) { /* ignore */ } }
    libererWakeLock();
    if (el.btnAudio) updateAudioBtn();
  }

  /** Garde l'écran allumé pendant la lecture (iOS 16.4+), sans bloquer si non supporté. */
  async function demanderWakeLock() {
    try {
      if ('wakeLock' in navigator && !state.wakeLock) {
        state.wakeLock = await navigator.wakeLock.request('screen');
        state.wakeLock.addEventListener('release', () => { state.wakeLock = null; });
      }
    } catch (e) { /* refusé ou non supporté */ }
  }

  function libererWakeLock() {
    if (state.wakeLock) { state.wakeLock.release().catch(() => {}); state.wakeLock = null; }
  }

  /* ===================================================================
     8. GÉOLOCALISATION
     =================================================================== */

  function setGps(texte) {
    const prefix = navigator.onLine ? '' : 'Hors-ligne · ';
    el.gps.textContent = prefix + texte;
  }

  function demarrerGeoloc() {
    if (!('geolocation' in navigator)) { setGps('Localisation non disponible sur cet appareil'); return; }
    if (state.watchId != null) return;
    setGps('Recherche du signal GPS…');
    state.watchId = navigator.geolocation.watchPosition(onPosition, onGeoError, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 20000
    });
  }

  function onPosition(pos) {
    state.position = { lat: pos.coords.latitude, lon: pos.coords.longitude };
    state.accuracy = pos.coords.accuracy;
    setGps(`GPS actif · précision ${Math.round(pos.coords.accuracy)} m`);
    updateUserMarker();
    updateMiniMeta();
    updateSheetDistance();
    scheduleListRender();
  }

  function onGeoError(err) {
    const messages = {
      1: 'Localisation refusée : Réglages > Confidentialité > Service de localisation',
      2: 'Position indisponible pour le moment',
      3: 'Signal GPS trop faible, nouvelle tentative…'
    };
    setGps(messages[err.code] || 'Erreur de localisation');
    if (err.code === 1) el.listeHint.hidden = false;
  }

  /** Bouton GPS : force une nouvelle mesure précise et recentre la carte. */
  function rafraichirGps() {
    if (!('geolocation' in navigator)) { toast('Localisation non disponible'); return; }
    demarrerGeoloc();
    el.btnGps.classList.add('is-busy');
    navigator.geolocation.getCurrentPosition((pos) => {
      el.btnGps.classList.remove('is-busy');
      onPosition(pos);
      renderListe();
      if (el.viewCarte.classList.contains('is-active') && state.map) {
        state.map.setView([pos.coords.latitude, pos.coords.longitude], Math.max(state.map.getZoom(), 16), { animate: true });
      } else {
        toast('Position mise à jour ✓');
      }
    }, (err) => {
      el.btnGps.classList.remove('is-busy');
      onGeoError(err);
      toast(err.code === 1 ? 'Autorisez la localisation dans les Réglages' : 'Pas de signal GPS pour le moment');
    }, { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 });
  }

  /* ===================================================================
     9. PRÉCHARGEMENT DES TUILES (carte hors-ligne)
     =================================================================== */

  function lon2tile(lon, z) { return Math.floor(((lon + 180) / 360) * Math.pow(2, z)); }
  function lat2tile(lat, z) {
    const r = (lat * Math.PI) / 180;
    return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * Math.pow(2, z));
  }

  /** Liste des URLs de tuiles couvrant PRELOAD_BOUNDS aux zooms choisis. */
  function listeTuiles() {
    const urls = [];
    const b = PRELOAD_BOUNDS;
    for (const z of PRELOAD_ZOOMS) {
      const x0 = lon2tile(b.west, z), x1 = lon2tile(b.east, z);
      const y0 = lat2tile(b.north, z), y1 = lat2tile(b.south, z);
      for (let x = x0; x <= x1; x++) {
        for (let y = y0; y <= y1; y++) {
          urls.push(TILE_URL.replace('{z}', z).replace('{x}', x).replace('{y}', y));
        }
      }
    }
    return urls;
  }

  function afficherProgression(fait, total) {
    el.preload.hidden = false;
    el.preloadFill.style.transform = `scaleX(${total ? fait / total : 0})`;
    el.preloadLabel.textContent = `Carte hors-ligne : ${fait} / ${total} tuiles`;
  }

  async function prechargerTuiles() {
    if (state.preloading) return;
    if (!('caches' in window)) { toast('Le stockage hors-ligne n\'est pas disponible ici.'); return; }
    if (!navigator.onLine) { toast('Connectez-vous à internet pour télécharger la carte.'); return; }

    const urls = listeTuiles();
    const mo = Math.round((urls.length * TAILLE_TUILE_KO) / 1024);
    const ok = window.confirm(
      `Télécharger la carte du centre de Rome et du Vatican pour le mode hors-ligne ?\n\n` +
      `${urls.length} tuiles, environ ${mo} Mo. À faire une seule fois, de préférence en Wi-Fi.`
    );
    if (!ok) return;

    state.preloading = true;
    el.btnPreload.classList.add('is-busy');
    const cache = await caches.open(TILE_CACHE);
    let fait = 0, erreurs = 0;
    afficherProgression(0, urls.length);

    // 4 téléchargements en parallèle : rapide mais respectueux des serveurs OSM
    const file = urls.slice();
    const worker = async () => {
      while (file.length) {
        const url = file.shift();
        try {
          const deja = await cache.match(url);
          if (!deja) {
            const res = await fetch(url, { mode: 'cors' });
            if (res.ok) await cache.put(url, res);
            else erreurs++;
          }
        } catch (e) { erreurs++; }
        fait++;
        if (fait % 5 === 0 || fait === urls.length) afficherProgression(fait, urls.length);
      }
    };
    await Promise.all([worker(), worker(), worker(), worker()]);

    state.preloading = false;
    el.btnPreload.classList.remove('is-busy');
    el.preload.hidden = true;
    toast(erreurs ? `Carte téléchargée (${erreurs} tuiles manquantes, réessayez plus tard)` : 'Carte du centre de Rome disponible hors-ligne ✓');
  }

  /* ===================================================================
     10. ONGLETS, TOAST, SERVICE WORKER, INITIALISATION
     =================================================================== */

  function showTab(name) {
    document.querySelectorAll('.view').forEach((v) => v.classList.toggle('is-active', v.dataset.view === name));
    document.querySelectorAll('.tab[data-tab]').forEach((t) => t.classList.toggle('is-active', t.dataset.tab === name));
    try { localStorage.setItem(LS_TAB, name); } catch (e) { /* ignore */ }
    if (name === 'carte' && state.map) {
      // Leaflet doit recalculer sa taille une fois la vue visible
      setTimeout(() => state.map.invalidateSize(), 250);
    }
    if (name === 'liste') renderListe();
  }

  let toastTimer = null;
  /** Affiche un message éphémère ; action optionnelle { label, onClick }. */
  function toast(texte, action, duree) {
    el.toastText.textContent = texte;
    if (action) {
      el.toastAction.hidden = false;
      el.toastAction.textContent = action.label;
      el.toastAction.onclick = () => { hideToast(); action.onClick(); };
    } else {
      el.toastAction.hidden = true;
      el.toastAction.onclick = null;
    }
    el.toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    if (duree !== 0) toastTimer = setTimeout(hideToast, duree || 3500);
  }
  function hideToast() { el.toast.classList.remove('is-visible'); }

  /** Enregistre le Service Worker et gère les mises à jour (cache busting). */
  function enregistrerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', async () => {
      try {
        const reg = await navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' });
        state.swRegistration = reg;

        // Une nouvelle version est déjà en attente (l'app a été ouverte après un déploiement)
        if (reg.waiting && navigator.serviceWorker.controller) proposerMiseAJour(reg);

        reg.addEventListener('updatefound', () => {
          const nw = reg.installing;
          if (!nw) return;
          nw.addEventListener('statechange', () => {
            if (nw.state === 'installed' && navigator.serviceWorker.controller) proposerMiseAJour(reg);
          });
        });

        // Quand le nouveau SW prend le contrôle, on recharge pour utiliser les nouveaux fichiers
        let rechargement = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (rechargement) return;
          rechargement = true;
          window.location.reload();
        });

        // À chaque retour au premier plan, on vérifie s'il y a une mise à jour
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') reg.update().catch(() => {});
        });
      } catch (e) {
        console.warn('Service Worker non enregistré :', e);
      }
    });
  }

  function proposerMiseAJour(reg) {
    toast('Nouvelle version disponible', {
      label: 'Mettre à jour',
      onClick: () => { if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' }); }
    }, 0);
  }

  function lierEvenements() {
    // Onglets
    document.querySelectorAll('.tab[data-tab]').forEach((t) => t.addEventListener('click', () => showTab(t.dataset.tab)));
    el.btnGps.addEventListener('click', rafraichirGps);

    // Carte
    el.btnCenter.addEventListener('click', centrerSurMoi);
    el.btnPreload.addEventListener('click', prechargerTuiles);
    el.miniOpen.addEventListener('click', () => { if (state.miniLieu) openSheet(state.miniLieu.id); });
    el.miniClose.addEventListener('click', hideMini);

    // Liste (délégation d'événements)
    el.liste.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.lieu');
      if (btn) openSheet(btn.dataset.id);
    });
    el.chips.addEventListener('click', (ev) => {
      const chip = ev.target.closest('.chip');
      if (!chip) return;
      state.filter = chip.dataset.filter;
      renderChips();
      renderListe();
      el.listeScroll.scrollTo({ top: 0 });
    });
    el.btnHintGps.addEventListener('click', rafraichirGps);

    // Fiche
    el.btnAudio.addEventListener('click', basculerLecture);
    el.btnStop.addEventListener('click', stopSpeech);
    el.btnRoute.addEventListener('click', ouvrirItineraire);
    el.btnVisited.addEventListener('click', () => { if (state.current) basculerVisite(state.current.id); });
    el.btnClose.addEventListener('click', closeSheet);
    el.btnMap.addEventListener('click', voirSurCarte);
    el.sheetBackdrop.addEventListener('click', closeSheet);

    // Cycle de vie : sécurité pour la synthèse vocale et l'affichage
    window.addEventListener('pagehide', stopSpeech);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // Si iOS a coupé la lecture pendant que l'écran était verrouillé, on resynchronise l'état
        if (state.speaking && synth && !synth.speaking && !synth.pending) stopSpeech();
        if (state.map) state.map.invalidateSize();
      }
    });
    window.addEventListener('online', () => { setGps(el.gps.textContent.replace(/^Hors-ligne · /, '')); });
    window.addEventListener('offline', () => { setGps(el.gps.textContent.replace(/^Hors-ligne · /, '')); toast('Hors-ligne : la carte reste disponible sur les zones déjà vues'); });
    window.addEventListener('orientationchange', () => { if (state.map) setTimeout(() => state.map.invalidateSize(), 300); });
  }

  function init() {
    // Références DOM
    Object.assign(el, {
      gps: $('#gps-status'),
      viewCarte: $('#view-carte'),
      liste: $('#liste'),
      listeScroll: $('.liste-scroll'),
      listeHint: $('#liste-hint'),
      btnHintGps: $('#btn-hint-gps'),
      chips: $('#chips'),
      btnGps: $('#btn-gps'),
      btnCenter: $('#btn-center'),
      btnPreload: $('#btn-preload'),
      preload: $('#preload-progress'),
      preloadFill: $('#preload-bar-fill'),
      preloadLabel: $('#preload-label'),
      mapMini: $('#map-mini'),
      miniOpen: $('#mini-open'),
      miniClose: $('#mini-close'),
      miniEmoji: $('#mini-emoji'),
      miniNom: $('#mini-nom'),
      miniMeta: $('#mini-meta'),
      sheet: $('#sheet'),
      sheetBackdrop: $('#sheet-backdrop'),
      sheetBody: $('#sheet-body'),
      btnAudio: $('#btn-audio'),
      btnAudioLabel: $('#btn-audio-label'),
      btnStop: $('#btn-stop'),
      btnRoute: $('#btn-route'),
      btnVisited: $('#btn-visited'),
      btnClose: $('#btn-close'),
      btnMap: $('#btn-map'),
      audioFill: $('#audio-progress-fill'),
      toast: $('#toast'),
      toastText: $('#toast-text'),
      toastAction: $('#toast-action')
    });

    chargerVisites();
    renderChips();
    renderListe();
    initMap();
    lierEvenements();

    if (synth) {
      choisirVoix();
      synth.addEventListener('voiceschanged', choisirVoix);
    }

    // Onglet mémorisé
    let tab = 'carte';
    try { tab = localStorage.getItem(LS_TAB) || 'carte'; } catch (e) { /* ignore */ }
    showTab(tab);

    // Demande de stockage persistant (évite la purge du cache hors-ligne)
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

    demarrerGeoloc();
    enregistrerServiceWorker();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
