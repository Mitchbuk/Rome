# Brief « nouvelle ville » — à coller dans la conversation d'une autre ville

Tu produis le CONTENU d'une ville pour l'application « en famille » (guide touristique familial, enfants de 9 et 12 ans, hors-ligne, iPhone). Tu ne codes PAS d'application : le moteur existe déjà (dépôt GitHub `Mitchbuk/Rome`, dossier `E:\Perso Mika\Application Tourisme Rome`). Tu livres des fichiers JSON au format ci-dessous, que le moteur intègre tels quels. Tout est en français.

## Palier de la ville

| Palier | Exemples | Lieux | Adresses « Où manger » | Rayon « sur place » | Quartiers |
|---|---|---|---|---|---|
| Petite ville | Venise, Bruges, Séville | 15 à 25 | 6 à 8 | 5 km | 3 à 5 |
| Grande ville | Rome, Lyon, Barcelone | 30 à 40 | 12 à 15 | 12 à 15 km | 6 à 10 |
| Très grande ville | Paris, Londres, New York, Tokyo | 60 à 80 | 20 à 25 | 20 km | 10 à 14 |

Pour une très grande ville, ajoute un champ `"incontournable": true` sur 15 à 20 lieux : l'app proposera un filtre « Incontournables » pour ne pas noyer la famille sous 80 fiches. Les quartiers sont obligatoires pour tous les paliers : ils structurent le mode « Préparer la visite » (liste groupée par quartier quand on est loin de la ville ou sans GPS).

## Livrable 1 : `ville.json`

```json
{
  "id": "paris",
  "nom": "Paris",
  "palier": "tres-grande",
  "centre": [48.8566, 2.3522],
  "rayon": 20000,
  "quartiers": [
    { "id": "ile-cite", "label": "Île de la Cité et Saint-Louis", "centre": [48.853, 2.349] },
    { "id": "louvre", "label": "Louvre, Tuileries et Palais-Royal", "centre": [48.862, 2.336] }
  ],
  "categories": {
    "monument": { "label": "Monuments", "emoji": "🏛️" },
    "musee":    { "label": "Musées", "emoji": "🖼️" },
    "place":    { "label": "Places et rues", "emoji": "⛲" },
    "eglise":   { "label": "Églises", "emoji": "⛪" },
    "quartier": { "label": "Quartiers et vues", "emoji": "🌳" }
  }
}
```

Les quartiers sont listés dans l'ordre géographique de visite (du cœur historique vers la périphérie). Adapte les catégories à la ville (4 à 6 maximum).

## Livrable 2 : `lieux.json` (les monuments)

Un tableau. Pour chaque lieu :

```json
{
  "id": "tour-eiffel",
  "nom": "Tour Eiffel",
  "categorie": "monument",
  "quartier": "trocadero",
  "incontournable": true,
  "lat": 48.8584, "lon": 2.2945,
  "duree": 120,
  "conseil": "Billet pour le sommet à réserver plusieurs semaines à l'avance. Escaliers jusqu'au 2e étage : moins d'attente et les enfants adorent.",
  "adultes": [ { "titre": "…", "texte": "…" } ],
  "enfants": [ { "titre": "…", "texte": "…" } ]
}
```

Règles de rédaction (celles qui ont été validées sur Rome après relecture) :

- `adultes` : 450 à 600 mots, 4 à 6 sections titrées (histoire, architecture et chiffres, vie à l'époque, à voir sur place, petites histoires et légendes).
- `enfants` : 350 à 500 mots, 4 à 6 sections, tutoiement, ton complice sans être bébé : une accroche « Imagine… », deux ou trois anecdotes ou « Le savais-tu ? », une section « Défi sur place » (jeu d'observation), une section « Le quiz » avec la réponse dans le même paragraphe.
- Les textes sont LUS À VOIX HAUTE par une synthèse vocale : phrases de moins de 30 mots, passé composé plutôt que passé simple, aucune tournure livresque (« menace ruine », « d'aucuns », inversions du sujet), jargon expliqué en trois mots, siècles et unités en toutes lettres (« seizième siècle », « mètres », « avant Jésus-Christ »), aucune abréviation, parenthèse, liste ou markdown.
- Exactitude : rien d'inventé ; chiffres incertains laissés approximatifs ; légendes signalées comme telles. Pas de prix ni d'horaires dans les textes (ils vont dans `conseil`, et changent).
- Titres de sections : 2 à 6 mots, sans deux-points.
- Après rédaction, relis TOUT une seconde fois avec la seule question : « un guide dirait-il cette phrase à voix haute ? » Sur Rome, cette relecture a réécrit 40 % des phrases.

## Livrable 3 : `restos.json` (Où manger)

Un tableau. Trattorias / bistrots, street food, bars-apéritivo où les enfants sont bienvenus ; institutions et pépites récentes ; jamais de gastronomique, jamais d'adresse centrée sur les abats. Réparties par quartier, y compris hors centre.

```json
{
  "id": "bouillon-chartier",
  "nom": "Bouillon Chartier",
  "type": "trattoria",
  "quartier": "grands-boulevards",
  "budget": "€",
  "prix": "15 à 20 € par personne",
  "lat": 48.8721, "lon": 2.3432,
  "duree": 60,
  "resume": "Une phrase qui donne envie.",
  "pourquoi": "Un paragraphe : histoire, ambiance, ce qui rend l'adresse unique.",
  "commander": "Un paragraphe : les plats à prendre, dont une valeur sûre pour les enfants.",
  "enfants": "Un paragraphe : pourquoi ça marche avec des enfants, à quelle heure venir.",
  "pratique": {
    "adresse": "7 rue du Faubourg-Montmartre, 75009 Paris",
    "horaires": "Tous les jours 11 h 30 à minuit",
    "fermeture": "Aucune",
    "reservation": "Pas de réservation, file d'attente rapide.",
    "tel": "+33 1 47 70 86 29",
    "site": "https://www.bouillon-chartier.com",
    "instagram": "https://www.instagram.com/bouillonchartier/"
  },
  "conseil": "Une astuce concrète (heure creuse, métro, que combiner à côté)."
}
```

- `type` : `trattoria` (restaurant assis), `street` (à emporter, comptoir), `bar` (apéritif). Le moteur affiche un badge couverts ou verre à pied.
- Téléphones TOUJOURS au format international (`+33 …`, `+39 …`) : vérifiés sur le site officiel ou deux annuaires concordants. Un numéro national « 06 … » est composé comme un mobile français.
- `site` : le site officiel ; s'il n'existe pas, mettre la page Instagram dans `instagram` et laisser `site` vide.
- Horaires et fermetures relevés à la date du jour, avec une source ; le moteur ajoute l'astérisque « à revérifier » et le lien Google Maps.
- Le moteur récupère lui-même le logo (icône du site) ou une photo, et ne génère PAS d'audio pour ces fiches.

## Livrable 4 : photos

Pour chaque lieu de `lieux.json`, indique un titre de page Wikipédia (fr ou en) ou un fichier Wikimedia Commons (`File:…`) dont l'image principale montre bien le lieu : `"photo": "Tour Eiffel"` ou `"photo": "File:Tour_Eiffel_Wikimedia_Commons.jpg"`. Le moteur télécharge, redimensionne et affiche les crédits.

## Ce que tu ne fais PAS

- Pas d'app, pas de HTML, pas de Service Worker, pas de choix de voix : le moteur Rome gère tout (audio edge-tts Henri/Denise, hors-ligne, carte, sélecteur Adultes/Enfants, fiche pleine page, mode « Préparer la visite »).
- Pas de textes courts : le client a jugé 120 mots par lieu « ras les pâquerettes ».
- Pas d'emojis comme icônes de lieux.

## Vérification avant livraison

```bash
node -e "JSON.parse(require('fs').readFileSync('lieux.json','utf8'))"
```

Compte les mots par lieu et par public, vérifie que chaque `quartier` existe dans `ville.json`, que chaque `id` est unique, en minuscules, sans accent ni espace.
