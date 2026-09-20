# Brief de relecture — Rome en famille

Tu relis et corriges un fichier `content/partX.json` (guide touristique familial de Rome, en français, lu à l'écran ET à voix haute par une synthèse vocale, pour des parents et des enfants de 9 et 12 ans).

Le premier retour du client : « J'ai lu "Elle menace ruine", ce n'est pas du français, personne ne parle comme ça. » Objectif : que CHAQUE phrase soit naturelle, claire, agréable à écouter, comme si un bon guide la disait de vive voix.

## Ce qu'il faut corriger (en réécrivant la phrase)
- Tournures littéraires, archaïques ou ampoulées : « menacer ruine », « il n'est pas jusqu'à… », « force est de… », « d'aucuns », « nonobstant », « sis », « pour l'heure », « en ces lieux », « moult », « idoine », participes présents en cascade, inversions du sujet, subjonctifs imparfaits, passé simple à la première personne, etc.
- Phrases trop longues (plus de 30 mots) ou à tiroirs : les couper en deux.
- Mots rares ou jargon sans explication (« spolia », « opus caementicium », « hypogée », « lanterneau », « travertin »…) : garder le mot si utile mais l'expliquer en trois ou quatre mots simples, surtout dans les textes enfants.
- Ambiguïtés, répétitions de mots proches, pléonasmes, anglicismes, fautes d'accord, de conjugaison, d'orthographe, de typographie (espaces avant « : » et « ; » et « ? » et « ! » : mettre une espace insécable ou au moins une espace ; guillemets « » ; apostrophes).
- Ce qui se lit mal à voix haute : sigles, chiffres romains isolés (écrire « le pape Paul IV » est OK, mais « XVIe siècle » doit devenir « seizième siècle »), abréviations, parenthèses, tirets d'incise à répétition, listes.
- Textes enfants : vérifier que le tutoiement est constant, que le ton est vivant sans être bébé, qu'aucune phrase n'est trop abstraite pour un enfant de 9 ans.

## Ce qu'il ne faut PAS faire
- Ne change ni les faits, ni les chiffres, ni les dates, ni les noms, ni l'ordre des sections, ni les titres (sauf faute), ni la structure JSON.
- Ne raccourcis pas le contenu : le nombre de mots doit rester à ±10 % (adultes 450-600, enfants 350-500).
- N'ajoute pas de markdown, d'astérisques, de listes, de parenthèses.

## Méthode
1. Lis le fichier en entier, section par section, en te demandant pour chaque phrase : « est-ce qu'un guide dirait ça à voix haute ? ».
2. Réécris directement dans le fichier JSON (garde l'encodage UTF-8 et un JSON strict).
3. Vérifie le JSON : `node -e "JSON.parse(require('fs').readFileSync('content/partX.json','utf8'))"`.
4. Dans ton rapport final, donne le nombre de phrases modifiées par lieu et 10 exemples représentatifs « avant → après ».
