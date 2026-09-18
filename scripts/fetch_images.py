"""
fetch_images.py — Récupère une photo libre de droits (Wikimedia Commons) pour
chaque lieu, la redimensionne et enregistre les crédits.

Sorties :
  img/<id>.jpg         image de la fiche (largeur max 900 px, JPEG qualité 78)
  img/<id>-thumb.jpg   vignette carrée 240x240 (liste + marqueurs de la carte)
  img/credits.json     auteur, licence et lien de chaque photo

Usage :  python scripts/fetch_images.py [id ...]   (sans argument : tous les lieux)
"""
import io
import json
import time
import os
import re
import sys
import urllib.parse
import urllib.request

from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT, "img")
UA = "RomeEnFamillePWA/1.0 (guide touristique familial; contact via GitHub Mitchbuk/Rome)"

# id du lieu -> titres Wikipédia (fr) candidats, du plus précis au plus général.
# On peut aussi indiquer directement un fichier Commons avec "File:...".
PAGES = {
    "colisee": ["Colisée"],
    "arc-constantin": ["Arc de Constantin"],
    "forum-romain": ["en:Roman Forum", "it:Foro Romano"],
    "palatin": ["search:Palatino Domus Augustana rovine", "search:Palatine Hill ruins Rome"],
    "colonne-trajane": ["search:Colonna Traiana Roma", "search:Trajan's Column Rome"],
    "circus-maximus": ["search:Circo Massimo veduta Palatino", "search:Circus Maximus Palatine view"],
    "thermes-caracalla": ["Thermes de Caracalla"],
    "via-appia": ["Via Appia"],
    "catacombes": ["search:Catacombe di San Callisto cripta", "search:Catacombs of Callixtus Rome"],
    "pyramide-cestius": ["Pyramide de Cestius"],
    "pantheon": ["Panthéon (Rome)"],
    "fontaine-trevi": ["Fontaine de Trevi"],
    "place-espagne": ["Place d'Espagne (Rome)", "Escalier de la Trinité-des-Monts"],
    "piazza-navona": ["Place Navone"],
    "campo-de-fiori": ["Campo de' Fiori"],
    "largo-argentina": ["Largo di Torre Argentina"],
    "via-del-corso": ["Via del Corso", "search:Via del Corso Roma"],
    "piazza-del-popolo": ["en:Piazza del Popolo", "File:Piazza del Popolo, Rome.jpg"],
    "piazza-venezia": ["Monument à Victor-Emmanuel II"],
    "capitole": ["Place du Capitole", "Piazza del Campidoglio", "search:Piazza del Campidoglio Roma"],
    "bocca-verita": ["Bocca della Verità"],
    "aventin": ["search:Giardino degli Aranci Roma panorama", "search:Buco della serratura Aventino"],
    "saint-jean-latran": ["Basilique Saint-Jean-de-Latran"],
    "saint-clement": ["Basilique Saint-Clément-du-Latran"],
    "sainte-marie-majeure": ["Basilique Sainte-Marie-Majeure"],
    "ghetto": ["Portique d'Octavie"],
    "ile-tiberine": ["Île Tibérine"],
    "trastevere": ["Trastevere"],
    "janicule": ["search:Gianicolo terrazza panorama Roma", "search:Fontana dell'Acqua Paola"],
    "villa-borghese": ["Villa Borghèse"],
    "chateau-saint-ange": ["Château Saint-Ange"],
    "place-saint-pierre": ["Place Saint-Pierre"],
    "basilique-saint-pierre": ["Basilique Saint-Pierre"],
    "musees-vatican": ["search:Scala elicoidale Musei Vaticani Momo", "search:Vatican Museums spiral staircase"],
}


def api(url, params):
    """Appel API avec délai de politesse et nouvelle tentative en cas de limitation (429)."""
    q = urllib.parse.urlencode(params)
    req = urllib.request.Request(f"{url}?{q}", headers={"User-Agent": UA})
    for tentative in range(4):
        try:
            time.sleep(1.2)
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 429 and tentative < 3:
                time.sleep(15 * (tentative + 1))
                continue
            raise


def fichier_principal(titre):
    """Nom du fichier Commons de l'image principale d'une page Wikipédia fr."""
    if titre.startswith("File:"):
        return titre
    if titre.startswith("search:"):
        data = api("https://commons.wikimedia.org/w/api.php", {
            "action": "query", "list": "search", "srnamespace": 6, "srlimit": 5,
            "srsearch": titre[7:] + " filetype:bitmap", "format": "json"
        })
        for hit in data.get("query", {}).get("search", []):
            if hit["title"].lower().endswith((".jpg", ".jpeg")):
                return hit["title"]
        return None
    lang = "fr"
    if titre.startswith("en:"):
        lang, titre = "en", titre[3:]
    data = api(f"https://{lang}.wikipedia.org/w/api.php", {
        "action": "query", "prop": "pageimages", "piprop": "name",
        "titles": titre, "redirects": 1, "format": "json"
    })
    for page in data.get("query", {}).get("pages", {}).values():
        if "pageimage" in page:
            return "File:" + page["pageimage"]
    return None


def infos_image(fichier, largeur=1200):
    """URL d'une version redimensionnée + métadonnées de licence (Commons)."""
    data = api("https://commons.wikimedia.org/w/api.php", {
        "action": "query", "prop": "imageinfo", "iiprop": "url|extmetadata",
        "iiurlwidth": largeur, "titles": fichier, "format": "json"
    })
    for page in data.get("query", {}).get("pages", {}).values():
        info = (page.get("imageinfo") or [None])[0]
        if not info:
            continue
        meta = info.get("extmetadata", {})
        artiste = re.sub(r"<[^>]+>", "", meta.get("Artist", {}).get("value", "")).strip()
        return {
            "url": info.get("thumburl") or info.get("url"),
            "page": info.get("descriptionurl"),
            "auteur": artiste or "Wikimedia Commons",
            "licence": meta.get("LicenseShortName", {}).get("value", "").strip(),
            "fichier": fichier,
        }
    return None


def telecharger(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def traiter(lieu_id, credits):
    for titre in PAGES[lieu_id]:
        try:
            fichier = fichier_principal(titre)
            if not fichier:
                continue
            info = infos_image(fichier)
            if not info or not info["url"]:
                continue
            brut = telecharger(info["url"])
            im = Image.open(io.BytesIO(brut))
            im = ImageOps.exif_transpose(im).convert("RGB")

            # Image de la fiche : 900 px de large max
            grande = im.copy()
            grande.thumbnail((900, 900))
            grande.save(os.path.join(IMG_DIR, f"{lieu_id}.jpg"), "JPEG", quality=78, optimize=True, progressive=True)

            # Vignette carrée recadrée au centre
            vignette = ImageOps.fit(im, (240, 240), Image.LANCZOS, centering=(0.5, 0.45))
            vignette.save(os.path.join(IMG_DIR, f"{lieu_id}-thumb.jpg"), "JPEG", quality=80, optimize=True)

            credits[lieu_id] = {k: info[k] for k in ("auteur", "licence", "fichier", "page")}
            print(f"OK  {lieu_id:24s} <- {fichier}  [{info['licence']}] {im.size[0]}x{im.size[1]}")
            return True
        except Exception as e:  # noqa: BLE001
            print(f"..  {lieu_id}: échec avec « {titre} » : {e}")
    print(f"!!  {lieu_id}: AUCUNE IMAGE")
    return False


def main():
    os.makedirs(IMG_DIR, exist_ok=True)
    chemin_credits = os.path.join(IMG_DIR, "credits.json")
    credits = {}
    if os.path.exists(chemin_credits):
        with open(chemin_credits, encoding="utf-8") as f:
            credits = json.load(f)
    ids = sys.argv[1:] or list(PAGES)
    for lieu_id in ids:
        traiter(lieu_id, credits)
    with open(chemin_credits, "w", encoding="utf-8") as f:
        json.dump(credits, f, ensure_ascii=False, indent=2)
    print(f"\n{len(credits)} crédits enregistrés dans img/credits.json")


if __name__ == "__main__":
    main()
