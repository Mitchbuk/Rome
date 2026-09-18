# Rome en famille — PWA guide touristique (Rome & Vatican)

Application web progressive (PWA) 100 % côté client, pensée pour iPhone (13 Pro et 16 Pro Max),
utilisable hors-ligne dans la rue avec deux enfants de 9 et 12 ans.

## Fonctionnalités

- **34 lieux** (monuments, places, rues, Vatican) avec description, section « Pour les enfants (9–12 ans) », conseil pratique, temps de visite et coordonnées GPS.
- **Écouter le guide** : lecture à voix haute via la synthèse vocale native de l'iPhone (aucune donnée réseau).
- **Carte** Leaflet + OpenStreetMap, point bleu GPS, marqueurs, mini-fiche, bouton « carte hors-ligne » (préchargement du centre de Rome).
- **Autour de moi** : liste triée en temps réel par distance, temps de marche, filtres par catégorie.
- **Fiche détail** en panneau coulissant : audio, itinéraire piéton (Plans), « Vu ✓ », voir sur la carte.
- **Hors-ligne** : Service Worker (app précachée + tuiles de carte déjà vues), mise à jour automatique à chaque déploiement.
- **iOS** : mode standalone plein écran, zones sûres (encoche / Dynamic Island / barre de balayage), mode sombre automatique, transitions GPU 120 Hz, actions dans le tiers inférieur de l'écran.

## Structure

```
index.html            Interface (balises Apple, viewport-fit=cover)
style.css             Design iOS clair/sombre, safe-area, transitions transform/opacity
app.js                Carte, liste, fiche, audio, GPS, préchargement, Service Worker
monuments.js          Base de données des lieux (à enrichir librement)
sw.js                 Service Worker : cache versionné de l'app + cache des tuiles
manifest.json         Manifeste PWA
icons/                Icônes (apple-touch-icon, 192, 512, maskable)
lib/leaflet/          Leaflet 1.9.4 en local (pas de CDN, fonctionne hors-ligne)
.github/workflows/    Déploiement GitHub Pages avec injection de version
```

## Tester en local

```bash
python -m http.server 8080
```

Puis ouvrir <http://localhost:8080>. La géolocalisation et le Service Worker exigent HTTPS **ou** `localhost`.

## Déployer sur GitHub Pages (recommandé)

1. Créer un dépôt GitHub (par ex. `rome-en-famille`), puis :

   ```bash
   git init
   git add .
   git commit -m "PWA Rome en famille"
   git branch -M main
   git remote add origin https://github.com/VOTRE-COMPTE/rome-en-famille.git
   git push -u origin main
   ```

2. Sur GitHub : **Settings → Pages → Source : « GitHub Actions »**.
3. Chaque `git push` sur `main` déclenche le workflow : il remplace `__VERSION__` par l'identifiant du commit dans `sw.js` et `index.html`, puis publie le site. Les iPhones affichent un toast « Nouvelle version disponible → Mettre à jour » à la prochaine ouverture (ou se mettent à jour seuls au lancement suivant).
4. URL : `https://VOTRE-COMPTE.github.io/rome-en-famille/`.

## Installer sur l'iPhone

1. Ouvrir l'URL dans **Safari** (obligatoire pour les PWA iOS).
2. Bouton **Partager** → **Sur l'écran d'accueil** → **Ajouter**.
3. Lancer l'app depuis l'icône : plein écran, sans barre Safari.
4. Autoriser la **localisation** à la première demande.
5. Sur l'onglet Carte, toucher le bouton **⬇** pour télécharger la carte du centre de Rome (≈ 10–15 Mo, une seule fois, en Wi-Fi).
6. Ouvrir une fiche et toucher **Écouter le guide** une première fois : la voix française d'iOS est chargée.

Conseil : dans Réglages → Accessibilité → Contenu énoncé → Voix, télécharger une voix française « améliorée » (ex. Thomas ou Audrey) pour une lecture plus naturelle.

## Modifier les lieux

Éditer `monuments.js` (structure documentée en tête de fichier). Après un `git push`, l'app se met à jour toute seule.

## Cartes

Tuiles © [OpenStreetMap](https://www.openstreetmap.org/copyright). Le préchargement est volontairement limité au centre de Rome (zooms 12–16, ≈ 500 tuiles) pour respecter la politique d'usage des serveurs OSM.
