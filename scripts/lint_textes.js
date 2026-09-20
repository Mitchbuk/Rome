/* =====================================================================
   lint_textes.js — Contrôle automatique des textes (content/part*.json)
   ---------------------------------------------------------------------
   Signale ce qui se lit mal à l'écran ou à voix haute :
   - siècles en chiffres romains (XVIe), abréviations (av. J.-C., env., m²…)
   - tournures livresques ou archaïques
   - phrases de plus de 35 mots
   - markdown, parenthèses, tirets d'incise, doubles espaces
   - textes hors fourchette de longueur
   Usage : node scripts/lint_textes.js [--verbose]
   ===================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const verbose = process.argv.includes('--verbose');

const REGLES = [
  { nom: 'siècle en chiffres romains', re: /\b[IVX]{1,5}(e|er|ème)\b\s*siècle/g },
  { nom: 'abréviation', re: /\b(av\.|apr\.|env\.|etc\.|cf\.|n°|km\/h|m²|m³)\s?/g },
  { nom: 'unité abrégée', re: /\d\s?(m|km|kg|t|h|min)(?![A-Za-zÀ-ÿ])/g },
  { nom: 'tournure livresque', re: /\b(menace ruine|menaçait ruine|d'aucuns|nonobstant|moult|idoine|sis à|sise à|force est de|il n'est pas jusqu'|en ces lieux|pour l'heure|à l'envi|de par|ledit|ladite|lesdits|icelui|naguère|jadis encore|point n'est besoin|il appert|il sied|séant|derechef|sitôt que|ores|maints|maintes)\b/gi },
  { nom: 'subjonctif imparfait / passé simple 1re pers.', re: /\b(fussent|eussent|fût-ce|fût-il|eût-il|eût été|qu'il fît|qu'il eût)\b/g },
  { nom: 'markdown ou liste', re: /(\*\*|__|^#|^\s*[-•]\s)/gm },
  { nom: 'parenthèse', re: /[()]/g },
  { nom: 'tiret d\'incise', re: /\s[–—]\s/g },
  { nom: 'double espace', re: /\S {2,}\S/g },
  { nom: 'ponctuation collée (: ; ? !)', re: /\S[;?!]/g },
  { nom: 'espace manquante après ponctuation', re: /[.,;:!?][A-Za-zÀ-ÿ]/g }
];

const mots = (t) => t.split(/\s+/).filter(Boolean).length;
let total = 0;

for (const f of fs.readdirSync(path.join(ROOT, 'content')).filter((n) => /^part.*\.json$/i.test(n))) {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', f), 'utf8'));
  for (const [id, lieu] of Object.entries(data)) {
    for (const pub of ['adultes', 'enfants']) {
      const sections = lieu[pub] || [];
      const nbMots = sections.reduce((n, s) => n + mots(s.texte), 0);
      const [min, max] = pub === 'adultes' ? [430, 640] : [330, 540];
      const problemes = [];
      if (nbMots < min || nbMots > max) problemes.push(`longueur ${nbMots} mots (attendu ${min}-${max})`);

      for (const s of sections) {
        const texte = `${s.titre}. ${s.texte}`;
        for (const r of REGLES) {
          const hits = texte.match(r.re);
          if (hits) problemes.push(`${r.nom} : ${[...new Set(hits)].slice(0, 4).map((h) => JSON.stringify(h.trim())).join(', ')}`);
        }
        if (pub === 'enfants' && /\bvous\b/.test(s.texte) && !/vous y êtes/.test(s.texte)) problemes.push(`vouvoiement dans un texte enfants : « ${s.titre} »`);
        const phrases = s.texte.split(/(?<=[.!?…])\s+/);
        for (const p of phrases) {
          if (mots(p) > 35) problemes.push(`phrase de ${mots(p)} mots : « ${p.slice(0, 70)}… »`);
        }
        if (s.titre.includes(':')) problemes.push(`deux-points dans le titre « ${s.titre} »`);
      }

      if (problemes.length) {
        total += problemes.length;
        console.log(`\n${id} / ${pub}`);
        for (const p of problemes) console.log('  - ' + p);
      } else if (verbose) {
        console.log(`${id} / ${pub} : OK (${nbMots} mots)`);
      }
    }
  }
}
console.log(`\n${total} signalement(s).`);
