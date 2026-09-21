/* =====================================================================
   build_monuments.js — Fusionne les contenus rédigés (content/part*.json)
   avec les données de base (coordonnées, durée, conseil) et régénère
   monuments.js.
   ---------------------------------------------------------------------
   Usage : node scripts/build_monuments.js
   Les fichiers content/part*.json contiennent, par identifiant de lieu :
     { "adultes": [{ "titre", "texte" }, …], "enfants": [{ "titre", "texte" }, …] }
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const { MONUMENTS: TOUS, CATEGORIES: CATS_EXISTANTES } = require(path.join(ROOT, 'monuments.js'));
// Les restaurants (categorie 'manger') viennent de content/restos.json, pas des part*.json
const MONUMENTS = TOUS.filter((m) => m.categorie !== 'manger');
const CATEGORIES = Object.assign({}, CATS_EXISTANTES, { manger: { label: 'Où manger', emoji: '🍝' } });
const RESTOS = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'restos.json'), 'utf8'))
  .map((r) => Object.assign({ categorie: 'manger' }, r));

// 1. Charger tous les contenus rédigés
const contenus = {};
for (const f of fs.readdirSync(path.join(ROOT, 'content'))) {
  if (!/^part.*\.json$/i.test(f)) continue;
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', f), 'utf8'));
  Object.assign(contenus, data);
}

// 2. Contrôles
const mots = (sections) => sections.reduce((n, s) => n + s.texte.split(/\s+/).length, 0);
let erreurs = 0;
const lignes = [];
for (const m of MONUMENTS) {
  const c = contenus[m.id];
  if (!c || !Array.isArray(c.adultes) || !Array.isArray(c.enfants)) {
    console.error(`!! contenu manquant pour ${m.id}`);
    erreurs++;
    continue;
  }
  for (const pub of ['adultes', 'enfants']) {
    for (const s of c[pub]) {
      if (!s.titre || !s.texte) { console.error(`!! section incomplète ${m.id}/${pub}`); erreurs++; }
    }
  }
  lignes.push(`${m.id.padEnd(24)} adultes ${String(mots(c.adultes)).padStart(4)} mots / enfants ${String(mots(c.enfants)).padStart(4)} mots`);
}
console.log(lignes.join('\n'));
if (erreurs) { console.error(`\n${erreurs} erreur(s), monuments.js non modifié.`); process.exit(1); }

// 3. Sérialisation lisible (chaînes entre guillemets doubles, échappées)
const q = (s) => JSON.stringify(s);
const sections = (arr, indent) => arr.map((s) =>
  `${indent}{ titre: ${q(s.titre)},\n${indent}  texte: ${q(s.texte)} }`
).join(',\n');

const blocs = MONUMENTS.map((m) => {
  const c = contenus[m.id];
  return `  {
    id: ${q(m.id)},
    nom: ${q(m.nom)},
    categorie: ${q(m.categorie)},
    lat: ${m.lat}, lon: ${m.lon},
    duree: ${m.duree},
    conseil: ${q(m.conseil)},
    adultes: [
${sections(c.adultes, '      ')}
    ],
    enfants: [
${sections(c.enfants, '      ')}
    ]
  }`;
});

const sortie = `/* =====================================================================
   monuments.js — Base de données des lieux (Rome & Vatican)
   ---------------------------------------------------------------------
   FICHIER GÉNÉRÉ par scripts/build_monuments.js à partir de content/part*.json.
   Pour modifier un texte : éditer le JSON correspondant dans content/, puis
   relancer  node scripts/build_monuments.js  (et  python scripts/generate_audio.py
   pour régénérer les MP3 des textes modifiés).

   Chaque lieu contient :
     id          : identifiant unique (photos img/<id>.jpg, audios audio/<id>-*.mp3)
     nom         : nom affiché
     categorie   : 'antique' | 'vatican' | 'place' | 'eglise' | 'quartier'
     lat / lon   : coordonnées GPS (WGS84)
     duree       : temps de visite estimé, en minutes
     conseil     : astuce pratique (non lue à voix haute)
     adultes     : sections { titre, texte } du guide adultes
     enfants     : sections { titre, texte } du guide enfants (9-12 ans)
   Les adresses "Où manger" (categorie 'manger') ont une structure propre :
     type ('trattoria' | 'street' | 'bar'), quartier, budget, prix, resume,
     pourquoi, commander, enfants (texte), pratique { adresse, horaires,
     fermeture, reservation, tel, site }, conseil. Pas d'audio MP3 : la fiche
     est lue par la voix du téléphone.
   ===================================================================== */

const CATEGORIES = ${JSON.stringify(CATEGORIES, null, 2).replace(/"(\w+)":/g, '$1:')};

const MONUMENTS = [
${blocs.join(',\n')},

  /* ------------------------------------------------------------------
     OÙ MANGER — restaurants, street food, bars (source : content/restos.json)
     ------------------------------------------------------------------ */
${RESTOS.map((r) => '  ' + JSON.stringify(r, null, 2).replace(/\n/g, '\n  ')).join(',\n')}
];

/* Export pour un éventuel usage en module (scripts Node) ; sans effet dans le navigateur. */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MONUMENTS, CATEGORIES };
}
`;

fs.writeFileSync(path.join(ROOT, 'monuments.js'), sortie, 'utf8');
console.log(`\nmonuments.js régénéré : ${MONUMENTS.length} lieux + ${RESTOS.length} adresses où manger.`);
