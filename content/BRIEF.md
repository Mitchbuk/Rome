# Brief de rédaction — Rome en famille

Tu rédiges le contenu d'un guide touristique familial de Rome, en **français**, pour une famille avec deux enfants de 9 et 12 ans. Le contenu sera lu à l'écran ET lu à voix haute par une synthèse vocale : écris des phrases complètes, fluides, sans listes à puces, sans parenthèses lourdes, sans abréviations (écris « avant Jésus-Christ », « mètres », « kilomètres »). Pas d'astérisques ni de markdown dans les textes.

Le fichier `monuments.js` (à la racine du projet) contient pour chaque lieu un texte court `description` et `enfants` : sers-t'en comme base, mais développe BEAUCOUP plus.

## Pour chaque lieu, produire deux textes

### 1. `adultes` : au moins 500 mots, souvent 600 à 900, 4 à 7 sections titrées
Un vrai guide historique et culturel, précis, vivant, structuré. Sections possibles (adapter selon le lieu) :
- Histoire (origines, construction, grandes dates, transformations, redécouverte)
- Architecture et chiffres (dimensions, matériaux, techniques, ce qui a disparu)
- À voir sur place (parcours conseillé, détails à ne pas manquer)
- La vie à l'époque (à quoi servait le lieu, qui le fréquentait, anecdotes)
- Petites histoires et légendes (faits marquants, personnages, films, curiosités)

### 2. `enfants` : au moins 400 mots, souvent 450 à 700, 4 à 7 sections titrées
Tutoiement, ton complice et vivant, sans être bébé (9-12 ans). Insister sur l'Empire romain, les gladiateurs, la vie quotidienne, les secrets du Vatican, les légendes. Structure conseillée :
- Une section d'ouverture qui plante le décor, de forme variée d'un lieu à l'autre (scène au présent, question, chiffre étonnant, personnage, invitation à regarder ; « Imagine » rarement)
- Deux ou trois sections d'anecdotes / mystères / « Le savais-tu ? »
- Une section « Défi » : un jeu d'observation à faire sur place (cherche…, compte…, trouve…)
- Une section « Quiz » : une question, puis la réponse dans la même section (« Réponse : … »)

## Exigences
- Exactitude historique : n'invente rien. Si un chiffre est incertain, reste approximatif (« environ », « près de ») plutôt que d'inventer une précision.
- Chaque section a un `titre` court (2 à 6 mots, sans deux-points) et un `texte` d'un ou deux paragraphes.
- Pas de doublon entre les sections adultes et enfants : les anecdotes enfants doivent être racontées autrement.
- Ne pas mentionner de prix ni d'horaires (ils changent) sauf ce qui est déjà dans `conseil`.

## Format de sortie (JSON strict, UTF-8)
```json
{
  "colisee": {
    "adultes": [ { "titre": "…", "texte": "…" }, … ],
    "enfants": [ { "titre": "…", "texte": "…" }, … ]
  },
  "arc-constantin": { … }
}
```
Vérifie que le JSON est valide (`node -e "JSON.parse(require('fs').readFileSync('content/partX.json','utf8'))"`) avant de terminer.
