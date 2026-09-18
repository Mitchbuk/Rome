# Rome en famille — PWA guide touristique (Rome & Vatican)

Application web progressive (PWA) 100 % côté client, pensée pour iPhone (13 Pro et 16 Pro Max),
utilisable hors-ligne dans la rue avec deux enfants de 9 et 12 ans.

En ligne : <https://mitchbuk.github.io/Rome/>

## Fonctionnalités

- **34 lieux** (monuments, places, rues, Vatican), chacun avec une **photo**, un **guide adultes** (450–600 mots, sections titrées : histoire, architecture, à voir, anecdotes) et un **guide enfants 9–12 ans** (350–500 mots : « Imagine… », « Le savais-tu ? », défi d'observation, quiz), plus un conseil pratique, le temps de visite et les coordonnées GPS.
- **Sélecteur Adultes / Enfants** dans chaque fiche : il change le texte affiché et le texte lu. Le choix est mémorisé sur chaque téléphone.
- **Écouter le guide** : lecture avec des **voix neuronales naturelles** (MP3 pré-générés sur PC, voir plus bas), contrôles sur l'écran verrouillé, avance/recul de 15 s. Si un MP3 n'est pas disponible, la synthèse vocale de l'iPhone prend le relais.
- **Carte** Leaflet + OpenStreetMap, marqueurs photo, point bleu GPS, mini-fiche, préchargement du centre de Rome.
- **Autour de moi** : liste triée en temps réel par distance, temps de marche, filtres par catégorie.
- **Hors-ligne** : Service Worker (app + vignettes précachées, tuiles vues, audios et photos téléchargeables en un bouton), mise à jour automatique à chaque déploiement.
- **iOS** : mode standalone plein écran, zones sûres (encoche / Dynamic Island / barre de balayage), mode sombre automatique, transitions GPU, actions dans le tiers inférieur de l'écran.

## Structure

```
index.html            Interface (balises Apple, viewport-fit=cover)
style.css             Design iOS clair/sombre, safe-area, transitions transform/opacity
app.js                Carte, liste, fiche, lecteur audio, GPS, hors-ligne, Service Worker
monuments.js          Base de données des lieux — GÉNÉRÉ par scripts/build_monuments.js
sw.js                 Service Worker : cache versionné de l'app + tuiles + médias (Range)
manifest.json         Manifeste PWA
content/part*.json    Textes rédigés (adultes / enfants) par lieu — la source à éditer
img/                  Photos (900 px) et vignettes (240 px) + credits.json
audio/                MP3 des guides (<id>-adultes.mp3, <id>-enfants.mp3) + manifest.json
scripts/              build_monuments.js, fetch_images.py, generate_audio.py
icons/                Icônes (apple-touch-icon, 192, 512, maskable)
lib/leaflet/          Leaflet 1.9.4 en local (pas de CDN, fonctionne hors-ligne)
.github/workflows/    Déploiement GitHub Pages avec injection de version
```

## Modifier un texte

1. Éditer le lieu dans `content/partA.json` … `partD.json` (sections `adultes` / `enfants`, chacune `{ "titre", "texte" }`).
2. Régénérer la base : `node scripts/build_monuments.js`
3. Régénérer les audios des textes modifiés (seuls les textes changés sont recalculés) : `python scripts/generate_audio.py`
4. `git add . && git commit -m "..." && git push` : l'app se met à jour toute seule.

## Voix naturelles (audio)

Les modèles de synthèse vocale de Hugging Face (Kokoro, Piper, XTTS…) sont trop lourds pour tourner dans Safari sur iPhone de façon fiable et hors-ligne. La solution retenue : **pré-générer les MP3 sur le PC** avec les voix neuronales Microsoft (paquet `edge-tts`, gratuit, sans clé) et les livrer avec l'app.

```bash
pip install edge-tts
python scripts/generate_audio.py            # tous les lieux (≈ 70 fichiers, ≈ 80 Mo)
python scripts/generate_audio.py colisee    # un seul lieu
python scripts/generate_audio.py --voix-adultes fr-FR-DeniseNeural --voix-enfants fr-FR-EloiseNeural --force
```

Voix françaises disponibles : `fr-FR-DeniseNeural`, `fr-FR-HenriNeural`, `fr-FR-EloiseNeural`, `fr-FR-VivienneMultilingualNeural`, `fr-FR-RemyMultilingualNeural`.
Par défaut : Henri pour les adultes, Denise pour les enfants (modifiable en tête de `scripts/generate_audio.py`).

Sur l'iPhone, les MP3 sont lus en streaming quand il y a du réseau et mis en cache au passage. Le bouton **« Audios et photos »** (onglet Autour de moi, en bas) télécharge tout d'un coup pour le hors-ligne.

## Photos

`python scripts/fetch_images.py` récupère pour chaque lieu l'image principale de Wikipédia / Wikimedia Commons (licences libres), la redimensionne et enregistre auteur et licence dans `img/credits.json`, affichés sur chaque fiche. Pour changer une photo : modifier l'entrée du lieu dans `PAGES` (titre Wikipédia, `File:…` Commons, ou `search:…`) puis relancer le script avec l'identifiant du lieu.

## Tester en local

```bash
python -m http.server 8080
```

Puis ouvrir <http://localhost:8080>. La géolocalisation et le Service Worker exigent HTTPS **ou** `localhost`.

## Déploiement (GitHub Pages)

Chaque `git push` sur `main` déclenche `.github/workflows/deploy.yml` : il remplace `__VERSION__` par l'identifiant du commit dans `sw.js` et `index.html`, puis publie le site. Les iPhones affichent « Nouvelle version disponible → Mettre à jour » à l'ouverture suivante (ou se mettent à jour seuls au lancement d'après). Le dépôt doit être public (GitHub Pages gratuit).

## Installer sur l'iPhone

1. Ouvrir l'URL dans **Safari** (obligatoire pour les PWA iOS).
2. Bouton **Partager** → **Sur l'écran d'accueil** → **Ajouter**.
3. Lancer l'app depuis l'icône, autoriser la **localisation**.
4. En Wi-Fi : onglet Autour de moi → **« Audios et photos »**, puis **« Carte »** (ou le bouton ⬇ sur la carte).

## Cartes

Tuiles © [OpenStreetMap](https://www.openstreetmap.org/copyright). Le préchargement est volontairement limité au centre de Rome (zooms 12–16, ≈ 500 tuiles) pour respecter la politique d'usage des serveurs OSM.
