/* =====================================================================
   app.js — Logique de l'application "Rome en famille"
   ---------------------------------------------------------------------
   Modules (dans l'ordre) :
     1. Constantes et état global
     2. Utilitaires (distance, formats, HTML)
     3. Mémoire "déjà vu" et préférences (localStorage)
     4. Liste "Autour de moi" (tri temps réel par distance + filtres)
     5. Carte Leaflet (marqueurs photo, point bleu GPS, mini-fiche)
     6. Fiche détail (photo, sélecteur Adultes / Enfants, sections)
     7. Audio : lecteur MP3 (voix neuronales) avec secours synthèse vocale
     8. Géolocalisation
     9. Hors-ligne : tuiles de carte, audios et photos
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
  /** Noms des caches : DOIVENT être identiques à ceux de sw.js. */
  const TILE_CACHE = 'rome-tiles-v1';
  const MEDIA_CACHE = 'rome-media-v1';
  /** Centre par défaut (Piazza Venezia) et zoom initial. */
  const ROME_CENTER = [41.8955, 12.4823];
  const ZOOM_INITIAL = 14;
  /** Zone préchargée pour le hors-ligne : centre historique + Vatican + début de la Via Appia. */
  const PRELOAD_BOUNDS = { north: 41.925, south: 41.850, west: 12.430, east: 12.535 };
  const PRELOAD_ZOOMS = [12, 13, 14, 15, 16];
  const TAILLE_TUILE_KO = 25; // estimation moyenne pour l'affichage
  const SAUT_SECONDES = 15;   // boutons ⏪ / ⏩ du lecteur

  const LS_VISITED = 'rome.visited';
  const LS_TAB = 'rome.tab';
  const LS_PUBLIC = 'rome.public';

  const state = {
    position: null,        // { lat, lon } ou null
    accuracy: null,        // précision GPS en mètres
    watchId: null,         // identifiant de watchPosition
    userMovedMap: false,   // l'utilisateur a déplacé la carte : ne plus recentrer automatiquement
    filter: 'tous',        // filtre de catégorie actif
    visited: new Set(),    // identifiants des lieux marqués "vu"
    public: 'adultes',     // guide sélectionné : 'adultes' | 'enfants'
    current: null,         // lieu affiché dans la fiche
    miniLieu: null,        // lieu affiché dans la mini-fiche de la carte
    map: null,
    markers: {},           // id -> L.marker
    userMarker: null,
    accuracyCircle: null,
    credits: {},           // img/credits.json
    audioManifest: {},     // audio/manifest.json
    // lecture audio
    audioMode: null,       // 'mp3' | 'tts' | null
    audioLieu: null,       // lieu en cours de lecture
    audioPublic: null,     // guide en cours de lecture
    speaking: false,       // (mode tts) lecture en cours
    paused: false,
    queue: [],
    queueIndex: 0,
    wakeLock: null,
    // téléchargements
    preloading: false,
    mediaLoading: false,
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

  /** 125 s -> "2:05". */
  function formatTemps(s) {
    if (!isFinite(s) || s < 0) s = 0;
    const m = Math.floor(s / 60);
    return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
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

  /* Adresses "Où manger" : pas de photo, un emoji par type, pas de MP3 */
  const estResto = (m) => m.categorie === 'manger';
  const EMOJI_RESTO = { trattoria: '🍝', street: '🍕', bar: '🍹' };
  const TYPES_RESTO = { trattoria: 'Trattoria', street: 'Pizza & street food', bar: 'Bar & apéritivo' };
  const emojiResto = (m) => EMOJI_RESTO[m.type] || '🍴';
  const typeResto = (m) => TYPES_RESTO[m.type] || 'Restaurant';

  const thumbUrl = (m) => `./img/${m.id}-thumb.jpg`;
  const photoUrl = (m) => `./img/${m.id}.jpg`;
  const audioNom = (m, pub) => `${m.id}-${pub}.mp3`;
  const audioUrl = (m, pub) => `./audio/${audioNom(m, pub)}`;
  const audioDispo = (m, pub) => !!state.audioManifest[audioNom(m, pub)];

  /* ===================================================================
     3. MÉMOIRE "DÉJÀ VU" ET PRÉFÉRENCES
     =================================================================== */

  function lsGet(cle, defaut) {
    try { const v = localStorage.getItem(cle); return v == null ? defaut : v; } catch (e) { return defaut; }
  }
  function lsSet(cle, valeur) {
    try { localStorage.setItem(cle, valeur); } catch (e) { /* stockage indisponible : on ignore */ }
  }

  function chargerVisites() {
    try { state.visited = new Set(JSON.parse(lsGet(LS_VISITED, '[]'))); } catch (e) { /* ignore */ }
  }

  function basculerVisite(id) {
    if (state.visited.has(id)) state.visited.delete(id);
    else state.visited.add(id);
    lsSet(LS_VISITED, JSON.stringify([...state.visited]));
    const m = lieuParId(id);
    if (m && state.markers[id]) state.markers[id].setIcon(makeIcon(m, state.miniLieu === m));
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
            ${estResto(m)
              ? `<span class="lieu-emoji lieu-emoji-resto" aria-hidden="true">${emojiResto(m)}</span>`
              : `<img class="lieu-photo" src="${thumbUrl(m)}" alt="" width="56" height="56" loading="lazy" decoding="async">`}
            <span class="lieu-texte">
              <span class="lieu-nom">${escapeHtml(m.nom)}</span>
              <span class="lieu-meta">${estResto(m)
                ? `${typeResto(m)} · ${escapeHtml(m.quartier)} · ${m.budget}`
                : `${cat.label} · ${formatDuree(m.duree)}`}${vu ? ' · ✓ vu' : ''}</span>
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

  /** Icône d'un lieu : sa photo dans un cercle. */
  function makeIcon(m, selected) {
    if (estResto(m)) {
      const cls = ['marker-lieu', 'marker-manger'];
      if (state.visited.has(m.id)) cls.push('is-visited');
      if (selected) cls.push('is-selected');
      return L.divIcon({
        className: cls.join(' '),
        html: `<span aria-hidden="true">${emojiResto(m)}</span>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });
    }
    const classes = ['marker-photo'];
    if (state.visited.has(m.id)) classes.push('is-visited');
    if (selected) classes.push('is-selected');
    return L.divIcon({
      className: classes.join(' '),
      html: `<img src="${thumbUrl(m)}" alt="" draggable="false">`,
      iconSize: [46, 46],
      iconAnchor: [23, 23]
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
    if (estResto(m)) {
      el.miniImg.hidden = true;
      el.miniEmoji.hidden = false;
      el.miniEmoji.textContent = emojiResto(m);
    } else {
      el.miniEmoji.hidden = true;
      el.miniImg.hidden = false;
      el.miniImg.src = thumbUrl(m);
    }
    el.miniNom.textContent = m.nom;
    updateMiniMeta();
    el.mapMini.classList.add('is-visible');
    el.viewCarte.classList.add('has-mini');
    state.map.panTo([m.lat, m.lon], { animate: true });
  }

  function updateMiniMeta() {
    if (!state.miniLieu) return;
    const d = distanceVers(state.miniLieu);
    const parts = [estResto(state.miniLieu)
      ? `${typeResto(state.miniLieu)} · ${state.miniLieu.budget}`
      : formatDuree(state.miniLieu.duree)];
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
    // On garde la lecture en cours si c'est le même lieu (retour sur la fiche), sinon on arrête
    if (state.audioLieu && state.audioLieu.id !== id) stopAudio();
    state.current = m;
    renderFiche();
    el.sheetBody.scrollTop = 0;
    updateVisitedBtn();
    updateSegments();
    updateAudioBtn();
    el.sheet.classList.add('is-open');
    el.sheet.setAttribute('aria-hidden', 'false');
  }

  function closeSheet() {
    el.sheet.classList.remove('is-open');
    el.sheet.setAttribute('aria-hidden', 'true');
    state.current = null;
    // La lecture MP3 continue en arrière-plan (pratique en marchant) ; la synthèse vocale s'arrête
    if (state.audioMode === 'tts') stopAudio();
  }

  /** Construit le HTML de la fiche pour le lieu courant et le guide sélectionné. */
  function renderFiche() {
    const m = state.current;
    if (!m) return;
    el.sheetActions.classList.toggle('is-resto', estResto(m));
    if (estResto(m)) { renderFicheResto(m); return; }
    const cat = CATEGORIES[m.categorie];
    const d = distanceVers(m);
    const credit = state.credits[m.id];
    const sections = m[state.public] || [];
    const estEnfants = state.public === 'enfants';

    el.sheetBody.innerHTML = `
      <figure class="fiche-hero">
        <img src="${photoUrl(m)}" alt="${escapeHtml(m.nom)}" decoding="async">
        ${credit ? `<figcaption class="fiche-credit">Photo : ${escapeHtml(credit.auteur)} · ${escapeHtml(credit.licence)} · Wikimedia Commons</figcaption>` : ''}
      </figure>
      <header class="fiche-head">
        <h2 id="fiche-titre">${escapeHtml(m.nom)}</h2>
      </header>
      <div class="fiche-meta">
        <span class="meta">⏱ ${formatDuree(m.duree)}</span>
        <span class="meta meta-dist" id="fiche-dist">${d != null ? `📍 ${formatDistance(d)} · ${formatMarche(d)}` : '📍 distance inconnue'}</span>
        <span class="meta">${cat.emoji} ${cat.label}</span>
      </div>
      <p class="fiche-public">${estEnfants ? '🧒 Guide des enfants (9–12 ans)' : '👨‍👩‍👧 Guide des adultes'}</p>
      ${sections.map((s) => `
        <section class="fiche-section ${estEnfants ? 'is-enfants' : 'is-adultes'}">
          <h3>${escapeHtml(s.titre)}</h3>
          ${s.texte.split(/\n+/).map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
        </section>`).join('')}
      <section class="fiche-section fiche-conseil">
        <h3>💡 Conseil pratique</h3>
        <p>${escapeHtml(m.conseil)}</p>
      </section>`;
  }

  /** Un ou plusieurs paragraphes HTML à partir d'un texte (sauts de ligne = paragraphes). */
  const paragraphes = (t) => String(t || '').split(/\n+/).filter(Boolean).map((x) => `<p>${escapeHtml(x)}</p>`).join('');

  /** Fiche d'une adresse "Où manger" : pas de photo ni de sélecteur, une fiche courte et pratique. */
  function renderFicheResto(m) {
    const d = distanceVers(m);
    const p = m.pratique || {};
    const ligne = (label, html) => html
      ? `<div class="pratique-ligne"><span class="pratique-label">${label}</span><span class="pratique-val">${html}</span></div>`
      : '';
    const tel = p.tel ? `<a href="tel:${p.tel.replace(/\s/g, '')}">${escapeHtml(p.tel)}</a>` : '';
    const site = p.site ? `<a href="${escapeHtml(p.site)}" target="_blank" rel="noopener">${escapeHtml(p.site.replace(/^https?:\/\/(www\.)?/, ''))}</a>` : '';
    const maps = `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.nom + ', ' + (p.adresse || 'Roma'))}" target="_blank" rel="noopener">Horaires et avis du jour sur Google Maps</a>`;

    el.sheetBody.innerHTML = `
      <header class="fiche-head">
        <span class="fiche-emoji" aria-hidden="true">${emojiResto(m)}</span>
        <h2 id="fiche-titre">${escapeHtml(m.nom)}</h2>
      </header>
      <div class="fiche-meta">
        <span class="meta">${typeResto(m)}</span>
        <span class="meta">📍 ${escapeHtml(m.quartier)}</span>
        <span class="meta">${m.budget} · ${escapeHtml(m.prix)}</span>
        <span class="meta meta-dist" id="fiche-dist">${d != null ? `🚶 ${formatDistance(d)} · ${formatMarche(d)}` : '🚶 distance inconnue'}</span>
      </div>
      <p class="fiche-resume">${escapeHtml(m.resume)}</p>
      <section class="fiche-section is-adultes"><h3>Pourquoi on aime</h3>${paragraphes(m.pourquoi)}</section>
      <section class="fiche-section is-adultes"><h3>Quoi commander</h3>${paragraphes(m.commander)}</section>
      <section class="fiche-section is-enfants"><h3>🧒 Avec les enfants</h3>${paragraphes(m.enfants)}</section>
      <section class="fiche-section fiche-pratique">
        <h3>Infos pratiques</h3>
        ${ligne('Adresse', escapeHtml(p.adresse))}
        ${ligne('Horaires *', escapeHtml(p.horaires))}
        ${ligne('Fermé', escapeHtml(p.fermeture))}
        ${ligne('Réservation', escapeHtml(p.reservation))}
        ${ligne('Téléphone', tel)}
        ${ligne('Site', site)}
        ${ligne('Vérifier', maps)}
        <p class="pratique-note">* Horaires habituels relevés en septembre 2026. Toujours revérifier sur le site du lieu ou sa page Google Maps avant d'y aller : les horaires et les jours de fermeture changent souvent.</p>
      </section>
      <section class="fiche-section fiche-conseil"><h3>💡 Conseil pratique</h3><p>${escapeHtml(m.conseil)}</p></section>`;
  }

  /** Change le guide (Adultes / Enfants) : texte affiché ET audio à écouter. */
  function choisirPublic(pub) {
    if (pub === state.public) return;
    state.public = pub;
    lsSet(LS_PUBLIC, pub);
    updateSegments();
    if (state.current) {
      const top = el.sheetBody.scrollTop;
      renderFiche();
      // On reste à la hauteur de la photo pour ne pas perdre le contexte
      el.sheetBody.scrollTop = Math.min(top, 0);
    }
    updateAudioBtn();
  }

  function updateSegments() {
    [el.segAdultes, el.segEnfants].forEach((b) => {
      const on = b.dataset.public === state.public;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-checked', String(on));
    });
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
    window.open(`https://maps.apple.com/?daddr=${lat},${lon}&dirflg=w&q=${encodeURIComponent(nom)}`, '_blank', 'noopener');
  }

  function voirSurCarte() {
    if (!state.current) return;
    const m = state.current;
    closeSheet();
    showTab('carte');
    state.userMovedMap = true;
    setTimeout(() => {
      state.map.invalidateSize();
      state.map.setView([m.lat, m.lon], 17, { animate: false });
      showMini(m);
    }, 260);
  }

  /* ===================================================================
     7. AUDIO — lecteur MP3 (voix neuronales pré-générées) + secours TTS
     -------------------------------------------------------------------
     Priorité : fichier audio/<id>-<public>.mp3 (naturel, généré sur PC).
     Si le fichier n'est pas disponible (pas encore généré, ou hors-ligne
     sans l'avoir téléchargé), on bascule sur la synthèse vocale de l'iPhone.
     =================================================================== */

  const player = new Audio();
  player.preload = 'none';

  const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
  let voixFr = null;

  /** Texte complet d'un guide (pour la synthèse vocale de secours). */
  function texteGuide(m, pub) {
    if (estResto(m)) {
      return `${m.nom}. ${m.resume} Pourquoi on aime. ${m.pourquoi} Quoi commander. ${m.commander} Avec les enfants. ${m.enfants}`;
    }
    const sections = m[pub] || [];
    return [m.nom + '.'].concat(sections.map((s) => `${s.titre}. ${s.texte}`)).join(' ');
  }

  /** Le lecteur joue-t-il actuellement (MP3 ou TTS) ? */
  const enLecture = () => state.audioMode === 'mp3' ? (!player.paused && !player.ended) : (state.speaking && !state.paused);
  const enPause = () => state.audioMode === 'mp3' ? (player.paused && player.currentTime > 0 && !player.ended) : (state.speaking && state.paused);

  /** Bouton principal : lance, met en pause ou reprend la lecture du guide sélectionné. */
  function basculerLecture() {
    if (!state.current) return;
    const m = state.current;
    const memeLecture = state.audioLieu === m && state.audioPublic === state.public && state.audioMode;

    if (memeLecture && enLecture()) {            // -> pause
      if (state.audioMode === 'mp3') player.pause();
      else { synth.pause(); state.paused = true; }
      updateAudioBtn();
      return;
    }
    if (memeLecture && enPause()) {              // -> reprise
      if (state.audioMode === 'mp3') player.play().catch(() => {});
      else { synth.resume(); state.paused = false; }
      updateAudioBtn();
      return;
    }

    // Nouvelle lecture
    stopAudio();
    state.audioLieu = m;
    state.audioPublic = state.public;
    if (audioDispo(m, state.public)) lireMp3(m, state.public);
    else lireTts(m, state.public);
  }

  /* ---- Mode MP3 ---- */
  function lireMp3(m, pub) {
    state.audioMode = 'mp3';
    player.src = audioUrl(m, pub);
    player.currentTime = 0;
    // play() est appelé dans le geste utilisateur : indispensable sur iOS
    const p = player.play();
    if (p && p.catch) p.catch((err) => {
      console.warn('Lecture MP3 impossible, secours synthèse vocale :', err && err.name);
      basculerVersTts(m, pub);
    });
    majMediaSession(m, pub);
    demanderWakeLock();
    updateAudioBtn();
  }

  function basculerVersTts(m, pub) {
    if (state.audioMode !== 'mp3' || state.audioLieu !== m) return;
    player.removeAttribute('src');
    player.load();
    toast('Audio non téléchargé : lecture avec la voix du téléphone');
    lireTts(m, pub);
  }

  player.addEventListener('error', () => {
    if (state.audioMode === 'mp3' && state.audioLieu) basculerVersTts(state.audioLieu, state.audioPublic);
  });
  player.addEventListener('timeupdate', () => {
    if (state.audioMode !== 'mp3') return;
    const p = player.duration ? player.currentTime / player.duration : 0;
    el.audioFill.style.transform = `scaleX(${p})`;
    el.audioProgress.setAttribute('aria-valuenow', String(Math.round(p * 100)));
    el.playerTime.textContent = `${formatTemps(player.currentTime)} / ${formatTemps(player.duration)}`;
  });
  player.addEventListener('play', updateAudioBtn);
  player.addEventListener('pause', updateAudioBtn);
  player.addEventListener('ended', () => { stopAudio(); });

  function sauter(delta) {
    if (state.audioMode !== 'mp3' || !player.duration) return;
    player.currentTime = Math.max(0, Math.min(player.duration, player.currentTime + delta));
  }

  /** Contrôles sur l'écran verrouillé / centre de contrôle iOS. */
  function majMediaSession(m, pub) {
    if (!('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: m.nom,
        artist: pub === 'enfants' ? 'Guide des enfants' : 'Guide des adultes',
        album: 'Rome en famille',
        artwork: [{ src: new URL(thumbUrl(m), location.href).href, sizes: '240x240', type: 'image/jpeg' }]
      });
      navigator.mediaSession.setActionHandler('play', () => player.play());
      navigator.mediaSession.setActionHandler('pause', () => player.pause());
      navigator.mediaSession.setActionHandler('seekbackward', () => sauter(-SAUT_SECONDES));
      navigator.mediaSession.setActionHandler('seekforward', () => sauter(SAUT_SECONDES));
    } catch (e) { /* non supporté */ }
  }

  /* ---- Mode synthèse vocale (secours) ---- */
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
      .replace(/(\d)\s(\d{3})\b/g, '$1$2')
      .replace(/(\d)\s?km\b/g, '$1 kilomètres')
      .replace(/(\d)\s?m\b(?![²³])/g, '$1 mètres')
      .replace(/(\d)\s?m²/g, '$1 mètres carrés')
      .replace(/(\d)\s?h\s?(\d{2})\b/g, '$1 heures $2')
      .replace(/(\d)\s?h\b/g, '$1 heures');
  }

  /** Découpe le texte en morceaux de ~220 caractères, coupés en fin de phrase. */
  function construireMorceaux(texte) {
    const t = texteParle(texte);
    const phrases = t.match(/[^.!?…]+[.!?…]+[»"”)]?\s*|[^.!?…]+$/g) || [t];
    const morceaux = [];
    let cur = '';
    for (const p of phrases) {
      if (cur && (cur + p).length > 220) { morceaux.push(cur.trim()); cur = p; }
      else cur += p;
    }
    if (cur.trim()) morceaux.push(cur.trim());
    return morceaux;
  }

  function lireTts(m, pub) {
    if (!synth) { toast("Aucune voix disponible sur cet appareil."); stopAudio(); return; }
    state.audioMode = 'tts';
    choisirVoix();
    synth.cancel();
    state.queue = construireMorceaux(texteGuide(m, pub));
    state.queueIndex = 0;
    state.speaking = true;
    state.paused = false;
    demanderWakeLock();
    updateAudioBtn();
    setTimeout(lireSuivant, 80); // Safari iOS ignore parfois un speak() immédiatement après cancel()
  }

  function lireSuivant() {
    if (!state.speaking) return;
    if (state.queueIndex >= state.queue.length) { stopAudio(); return; }
    const u = new SpeechSynthesisUtterance(state.queue[state.queueIndex++]);
    u.lang = 'fr-FR';
    if (voixFr) u.voice = voixFr;
    u.rate = 0.95;
    u.onstart = () => {
      el.audioFill.style.transform = `scaleX(${(state.queueIndex - 1) / state.queue.length})`;
      el.playerTime.textContent = `Voix du téléphone · ${state.queueIndex} / ${state.queue.length}`;
    };
    u.onend = () => { lireSuivant(); };
    u.onerror = (e) => {
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      console.warn('Erreur de synthèse vocale :', e.error);
      stopAudio();
    };
    synth.speak(u);
  }

  /* ---- Commun ---- */
  function stopAudio() {
    // L'état est réinitialisé AVANT cancel()/pause() : certains navigateurs déclenchent
    // les événements de fin de façon synchrone, ce qui relancerait la lecture.
    state.speaking = false;
    state.paused = false;
    state.queue = [];
    state.queueIndex = 0;
    const mode = state.audioMode;
    state.audioMode = null;
    state.audioLieu = null;
    state.audioPublic = null;
    if (mode === 'mp3') {
      try { player.pause(); player.removeAttribute('src'); player.load(); } catch (e) { /* ignore */ }
    }
    if (synth) { try { synth.cancel(); } catch (e) { /* ignore */ } }
    libererWakeLock();
    if (el.btnAudio) updateAudioBtn();
  }

  function updateAudioBtn() {
    if (!el.btnAudio) return;
    const m = state.current;
    const label = m && estResto(m) ? 'la fiche' : (state.public === 'enfants' ? 'Enfants' : 'Adultes');
    const memeLecture = m && state.audioLieu === m && state.audioPublic === state.public && state.audioMode;
    const icone = el.btnAudio.querySelector('.btn-audio-icon');

    if (memeLecture && enLecture()) {
      icone.textContent = '⏸';
      el.btnAudioLabel.textContent = 'Pause';
    } else if (memeLecture && enPause()) {
      icone.textContent = '▶️';
      el.btnAudioLabel.textContent = 'Reprendre';
    } else {
      icone.textContent = '🔊';
      el.btnAudioLabel.textContent = `Écouter · ${label}`;
    }
    el.btnAudio.classList.toggle('is-playing', !!memeLecture);
    el.btnAudio.classList.toggle('is-fallback', !!(m && !audioDispo(m, state.public)));
    el.btnStop.hidden = !memeLecture;
    const mp3 = !!memeLecture && state.audioMode === 'mp3';
    el.btnBack.hidden = !mp3;
    el.btnFwd.hidden = !mp3;
    if (!memeLecture) {
      el.audioFill.style.transform = 'scaleX(0)';
      el.playerTime.textContent = m && estResto(m)
        ? 'Lecture avec la voix du téléphone'
        : m && !audioDispo(m, state.public)
        ? 'Voix du téléphone (audio non généré)'
        : (m && state.audioManifest[audioNom(m, state.public)] ? `Durée : ${formatTemps(state.audioManifest[audioNom(m, state.public)].duree)}` : '');
    }
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
    el.gps.textContent = (navigator.onLine ? '' : 'Hors-ligne · ') + texte;
  }

  function demarrerGeoloc() {
    if (!('geolocation' in navigator)) { setGps('Localisation non disponible sur cet appareil'); return; }
    if (state.watchId != null) return;
    setGps('Recherche du signal GPS…');
    state.watchId = navigator.geolocation.watchPosition(onPosition, onGeoError, {
      enableHighAccuracy: true, maximumAge: 5000, timeout: 20000
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
     9. HORS-LIGNE : tuiles de carte, audios et photos
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

  /**
   * Télécharge une liste d'URLs dans un cache (4 en parallèle), en sautant celles
   * déjà présentes. `onProgress(fait, total)` est appelé régulièrement.
   */
  async function remplirCache(nomCache, urls, onProgress, options) {
    const cache = await caches.open(nomCache);
    let fait = 0, erreurs = 0;
    const file = urls.slice();
    const worker = async () => {
      while (file.length) {
        const url = file.shift();
        try {
          if (!(await cache.match(url))) {
            const res = await fetch(url, options || {});
            if (res.ok) await cache.put(url, res);
            else erreurs++;
          }
        } catch (e) { erreurs++; }
        fait++;
        if (fait % 3 === 0 || fait === urls.length) onProgress(fait, urls.length);
      }
    };
    await Promise.all([worker(), worker(), worker(), worker()]);
    return erreurs;
  }

  async function prechargerTuiles() {
    if (state.preloading) return;
    if (!('caches' in window)) { toast("Le stockage hors-ligne n'est pas disponible ici."); return; }
    if (!navigator.onLine) { toast('Connectez-vous à internet pour télécharger la carte.'); return; }

    const urls = listeTuiles();
    const mo = Math.round((urls.length * TAILLE_TUILE_KO) / 1024);
    if (!window.confirm(`Télécharger la carte du centre de Rome et du Vatican pour le mode hors-ligne ?\n\n${urls.length} tuiles, environ ${mo} Mo. À faire une seule fois, de préférence en Wi-Fi.`)) return;

    state.preloading = true;
    el.btnPreload.classList.add('is-busy');
    el.preload.hidden = false;
    const erreurs = await remplirCache(TILE_CACHE, urls, (fait, total) => {
      el.preloadFill.style.transform = `scaleX(${fait / total})`;
      el.preloadLabel.textContent = `Carte hors-ligne : ${fait} / ${total} tuiles`;
    }, { mode: 'cors' });
    state.preloading = false;
    el.btnPreload.classList.remove('is-busy');
    el.preload.hidden = true;
    toast(erreurs ? `Carte téléchargée (${erreurs} tuiles manquantes, réessayez plus tard)` : 'Carte du centre de Rome disponible hors-ligne ✓');
  }

  /** Télécharge tous les MP3 et toutes les photos dans le cache média. */
  async function telechargerMedias() {
    if (state.mediaLoading) return;
    if (!('caches' in window)) { toast("Le stockage hors-ligne n'est pas disponible ici."); return; }
    if (!navigator.onLine) { toast('Connectez-vous à internet pour télécharger les audios.'); return; }

    const audios = Object.keys(state.audioManifest).map((f) => `./audio/${f}`);
    const photos = MONUMENTS.flatMap((m) => [photoUrl(m), thumbUrl(m)]);
    const urls = audios.concat(photos).map((u) => new URL(u, location.href).href);
    const mo = Math.round(Object.values(state.audioManifest).reduce((s, a) => s + (a.taille || 0), 0) / 1024 / 1024 + 5);
    if (!window.confirm(`Télécharger ${audios.length} audios et ${photos.length} photos pour le mode hors-ligne ?\n\nEnviron ${mo} Mo, à faire une seule fois en Wi-Fi.`)) return;

    state.mediaLoading = true;
    el.btnMedia.disabled = true;
    el.mediaProgress.hidden = false;
    const erreurs = await remplirCache(MEDIA_CACHE, urls, (fait, total) => {
      el.mediaFill.style.transform = `scaleX(${fait / total})`;
      el.mediaLabel.textContent = `${fait} / ${total} fichiers`;
    });
    state.mediaLoading = false;
    el.btnMedia.disabled = false;
    el.mediaProgress.hidden = true;
    el.mediaStatus.textContent = erreurs ? `Terminé avec ${erreurs} fichier(s) manquant(s), relancez plus tard.` : '✓ Audios et photos disponibles hors-ligne';
    verifierMediasHorsLigne();
  }

  /** Affiche l'état du cache média (combien d'audios déjà disponibles hors-ligne). */
  async function verifierMediasHorsLigne() {
    if (!('caches' in window)) return;
    try {
      const cache = await caches.open(MEDIA_CACHE);
      const cles = await cache.keys();
      const nbAudio = cles.filter((r) => r.url.includes('/audio/')).length;
      const total = Object.keys(state.audioManifest).length;
      if (total && nbAudio >= total) el.mediaStatus.textContent = `✓ ${nbAudio} audios disponibles hors-ligne`;
      else if (nbAudio) el.mediaStatus.textContent = `${nbAudio} / ${total} audios hors-ligne (téléchargement incomplet)`;
    } catch (e) { /* ignore */ }
  }

  /** Charge les index (crédits photos, audios disponibles). */
  async function chargerIndex() {
    try {
      const r = await fetch('./img/credits.json');
      if (r.ok) state.credits = await r.json();
    } catch (e) { /* pas bloquant */ }
    try {
      const r = await fetch('./audio/manifest.json');
      if (r.ok) state.audioManifest = await r.json();
    } catch (e) { /* pas bloquant */ }
    updateAudioBtn();
    verifierMediasHorsLigne();
  }

  /* ===================================================================
     10. ONGLETS, TOAST, SERVICE WORKER, INITIALISATION
     =================================================================== */

  function showTab(name) {
    document.querySelectorAll('.view').forEach((v) => v.classList.toggle('is-active', v.dataset.view === name));
    document.querySelectorAll('.tab[data-tab]').forEach((t) => t.classList.toggle('is-active', t.dataset.tab === name));
    lsSet(LS_TAB, name);
    if (name === 'carte' && state.map) setTimeout(() => state.map.invalidateSize(), 250);
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
        if (reg.waiting && navigator.serviceWorker.controller) proposerMiseAJour(reg);
        reg.addEventListener('updatefound', () => {
          const nw = reg.installing;
          if (!nw) return;
          nw.addEventListener('statechange', () => {
            if (nw.state === 'installed' && navigator.serviceWorker.controller) proposerMiseAJour(reg);
          });
        });
        let rechargement = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (rechargement) return;
          rechargement = true;
          window.location.reload();
        });
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
    el.btnPreload2.addEventListener('click', prechargerTuiles);
    el.miniOpen.addEventListener('click', () => { if (state.miniLieu) openSheet(state.miniLieu.id); });
    el.miniClose.addEventListener('click', hideMini);

    // Liste
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
    el.btnMedia.addEventListener('click', telechargerMedias);

    // Fiche
    el.segAdultes.addEventListener('click', () => choisirPublic('adultes'));
    el.segEnfants.addEventListener('click', () => choisirPublic('enfants'));
    el.btnAudio.addEventListener('click', basculerLecture);
    el.btnStop.addEventListener('click', stopAudio);
    el.btnBack.addEventListener('click', () => sauter(-SAUT_SECONDES));
    el.btnFwd.addEventListener('click', () => sauter(SAUT_SECONDES));
    el.btnRoute.addEventListener('click', ouvrirItineraire);
    el.btnVisited.addEventListener('click', () => { if (state.current) basculerVisite(state.current.id); });
    el.btnClose.addEventListener('click', closeSheet);
    el.btnMap.addEventListener('click', voirSurCarte);
    el.sheetBackdrop.addEventListener('click', closeSheet);

    // Cycle de vie
    window.addEventListener('pagehide', () => { if (state.audioMode === 'tts') stopAudio(); });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        if (state.audioMode === 'tts' && synth && !synth.speaking && !synth.pending) stopAudio();
        if (state.map) state.map.invalidateSize();
        updateAudioBtn();
      }
    });
    window.addEventListener('online', () => setGps(el.gps.textContent.replace(/^Hors-ligne · /, '')));
    window.addEventListener('offline', () => { setGps(el.gps.textContent.replace(/^Hors-ligne · /, '')); toast('Hors-ligne : carte, audios et photos déjà téléchargés restent disponibles'); });
    window.addEventListener('orientationchange', () => { if (state.map) setTimeout(() => state.map.invalidateSize(), 300); });
  }

  function init() {
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
      btnPreload2: $('#btn-preload-2'),
      preload: $('#preload-progress'),
      preloadFill: $('#preload-bar-fill'),
      preloadLabel: $('#preload-label'),
      btnMedia: $('#btn-media'),
      mediaProgress: $('#media-progress'),
      mediaFill: $('#media-bar-fill'),
      mediaLabel: $('#media-label'),
      mediaStatus: $('#media-status'),
      mapMini: $('#map-mini'),
      miniOpen: $('#mini-open'),
      miniClose: $('#mini-close'),
      miniImg: $('#mini-img'),
      miniEmoji: $('#mini-emoji'),
      sheetActions: $('.sheet-actions'),
      miniNom: $('#mini-nom'),
      miniMeta: $('#mini-meta'),
      sheet: $('#sheet'),
      sheetBackdrop: $('#sheet-backdrop'),
      sheetBody: $('#sheet-body'),
      segAdultes: $('#seg-adultes'),
      segEnfants: $('#seg-enfants'),
      btnAudio: $('#btn-audio'),
      btnAudioLabel: $('#btn-audio-label'),
      btnStop: $('#btn-stop'),
      btnBack: $('#btn-back'),
      btnFwd: $('#btn-fwd'),
      audioProgress: $('#audio-progress'),
      audioFill: $('#audio-progress-fill'),
      playerTime: $('#player-time'),
      btnRoute: $('#btn-route'),
      btnVisited: $('#btn-visited'),
      btnClose: $('#btn-close'),
      btnMap: $('#btn-map'),
      toast: $('#toast'),
      toastText: $('#toast-text'),
      toastAction: $('#toast-action')
    });

    chargerVisites();
    state.public = lsGet(LS_PUBLIC, 'adultes') === 'enfants' ? 'enfants' : 'adultes';
    updateSegments();
    renderChips();
    renderListe();
    initMap();
    lierEvenements();
    chargerIndex();

    if (synth) {
      choisirVoix();
      synth.addEventListener('voiceschanged', choisirVoix);
    }

    showTab(lsGet(LS_TAB, 'carte'));

    // Demande de stockage persistant (évite la purge du cache hors-ligne)
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

    demarrerGeoloc();
    enregistrerServiceWorker();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
