"""
fetch_resto_images.py — Récupère une image pour chaque adresse "Où manger".

Ordre d'essai, pour chaque adresse de content/restos.json :
  1. logo du site officiel : <link rel="apple-touch-icon"> ou balise og:image de la page d'accueil
  2. photo du lieu sur Wikimedia Commons (recherche par nom)
  3. rien : l'app affiche une icône générique selon le type

Sorties :
  img/resto/<id>.jpg         image de la fiche (largeur max 900 px)
  img/resto/<id>-thumb.jpg   vignette carrée 240x240 (liste, marqueurs)
  img/resto/manifest.json    source de chaque image (logo | commons | aucune)

Usage :  python scripts/fetch_resto_images.py [id ...]
Pour forcer une image précise : ajouter "image": "https://…" dans content/restos.json.
"""
import io
import json
import os
import re
import ssl
import sys
import time
import urllib.parse
import urllib.request

from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "img", "resto")
UA = ("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 "
      "(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1")

# Requêtes Commons de secours (quand le site n'a pas de logo exploitable)
COMMONS = {
    "armando-pantheon": "Armando al Pantheon Roma",
    "da-enzo-al-29": "Da Enzo al 29 Trastevere",
    "flavio-velavevodetto": "Velavevodetto Testaccio",
    "trattoria-monti": "Via di San Vito Roma Esquilino",
    "cesare-al-casaletto": "Cesare al Casaletto",
    "trattoria-pennestri": "Trattoria Pennestri",
    "supplizio": "Supplizio Roma supplì",
    "antico-forno-roscioli": "Roscioli Roma pizza bianca",
    "pizzarium-bonci": "Pizzarium Bonci",
    "trapizzino-trastevere": "Trapizzino",
    "pizzeria-da-remo": "Piazza Santa Maria Liberatrice Testaccio",
    "mordi-e-vai": "Nuovo Mercato di Testaccio",
    "bar-del-fico": "Bar del Fico Roma",
    "freni-e-frizioni": "Freni e Frizioni Trastevere",
    "necci-dal-1924": "Necci Pigneto",
}


def get(url, timeout=25, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*", "Accept-Language": "it-IT,it;q=0.9,fr;q=0.8"})
    # Certains petits sites ont une chaîne de certificats incomplète : on tente d'abord
    # en vérifiant le certificat, puis sans vérification (il ne s'agit que de télécharger une image).
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            data = r.read()
    except urllib.error.URLError as e:
        if "CERTIFICATE_VERIFY_FAILED" not in str(e):
            raise
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as r:
            data = r.read()
    return data if binary else data.decode("utf-8", "replace")


def logo_du_site(site):
    """Cherche le logo dans la page d'accueil : apple-touch-icon, puis og:image, puis icône PNG."""
    try:
        html = get(site)
    except Exception as e:  # noqa: BLE001
        print(f"     site injoignable ({e})")
        return []
    candidats = []
    for m in re.finditer(r'<link[^>]+rel=["\']([^"\']*apple-touch-icon[^"\']*)["\'][^>]*>', html, re.I):
        href = re.search(r'href=["\']([^"\']+)["\']', m.group(0))
        if href:
            candidats.append(("logo", urllib.parse.urljoin(site, href.group(1))))
    for m in re.finditer(r'<meta[^>]+property=["\']og:image["\'][^>]*>', html, re.I):
        c = re.search(r'content=["\']([^"\']+)["\']', m.group(0))
        if c:
            candidats.append(("og", urllib.parse.urljoin(site, c.group(1))))
    for m in re.finditer(r'<link[^>]+rel=["\'](?:shortcut )?icon["\'][^>]*>', html, re.I):
        href = re.search(r'href=["\']([^"\']+)["\']', m.group(0))
        if href and re.search(r'\.(png|jpe?g|webp)(\?|$)', href.group(1), re.I):
            candidats.append(("icone", urllib.parse.urljoin(site, href.group(1))))
    return candidats


def photo_commons(requete):
    try:
        q = urllib.parse.urlencode({"action": "query", "list": "search", "srnamespace": 6, "srlimit": 5,
                                    "srsearch": requete + " filetype:bitmap", "format": "json"})
        time.sleep(1.2)
        data = json.loads(get("https://commons.wikimedia.org/w/api.php?" + q))
        for hit in data.get("query", {}).get("search", []):
            if hit["title"].lower().endswith((".jpg", ".jpeg")):
                q2 = urllib.parse.urlencode({"action": "query", "prop": "imageinfo", "iiprop": "url|extmetadata",
                                             "iiurlwidth": 1200, "titles": hit["title"], "format": "json"})
                time.sleep(1.2)
                d2 = json.loads(get("https://commons.wikimedia.org/w/api.php?" + q2))
                for page in d2.get("query", {}).get("pages", {}).values():
                    info = (page.get("imageinfo") or [None])[0]
                    if info:
                        meta = info.get("extmetadata", {})
                        auteur = re.sub(r"<[^>]+>", "", meta.get("Artist", {}).get("value", "")).strip()
                        return {"url": info.get("thumburl") or info["url"], "fichier": hit["title"],
                                "auteur": auteur or "Wikimedia Commons",
                                "licence": meta.get("LicenseShortName", {}).get("value", "")}
    except Exception as e:  # noqa: BLE001
        print(f"     commons : {e}")
    return None


def enregistrer(lieu_id, brut):
    im = Image.open(io.BytesIO(brut))
    im = ImageOps.exif_transpose(im)
    if im.mode in ("RGBA", "LA", "P"):
        fond = Image.new("RGB", im.size, (255, 255, 255))
        fond.paste(im.convert("RGBA"), mask=im.convert("RGBA").split()[-1])
        im = fond
    im = im.convert("RGB")
    if min(im.size) < 96:
        raise ValueError(f"image trop petite {im.size}")
    grande = im.copy()
    grande.thumbnail((900, 900))
    grande.save(os.path.join(OUT, f"{lieu_id}.jpg"), "JPEG", quality=80, optimize=True, progressive=True)
    ImageOps.fit(im, (240, 240), Image.LANCZOS, centering=(0.5, 0.5)).save(
        os.path.join(OUT, f"{lieu_id}-thumb.jpg"), "JPEG", quality=82, optimize=True)
    return im.size


def traiter(r, manifest):
    lieu_id = r["id"]
    print(f"\n{lieu_id}")
    essais = []
    if r.get("image"):
        essais.append(("manuel", r["image"]))
    site = (r.get("pratique") or {}).get("site")
    if site:
        essais += logo_du_site(site)
        hote = urllib.parse.urlparse(site).netloc
        essais.append(("favicon-google", f"https://www.google.com/s2/favicons?domain={hote}&sz=256"))
    for source, url in essais:
        try:
            taille = enregistrer(lieu_id, get(url, binary=True))
            manifest[lieu_id] = {"source": source, "url": url}
            print(f"  OK {source} {taille[0]}x{taille[1]}  {url}")
            return
        except Exception as e:  # noqa: BLE001
            print(f"  .. {source} échec : {e}")
    photo = photo_commons(COMMONS.get(lieu_id, r["nom"]))
    if photo:
        try:
            taille = enregistrer(lieu_id, get(photo["url"], binary=True))
            manifest[lieu_id] = {"source": "commons", "fichier": photo["fichier"], "auteur": photo["auteur"], "licence": photo["licence"]}
            print(f"  OK commons {taille[0]}x{taille[1]}  {photo['fichier']}")
            return
        except Exception as e:  # noqa: BLE001
            print(f"  .. commons échec : {e}")
    manifest[lieu_id] = {"source": "aucune"}
    print("  !! aucune image")


def main():
    os.makedirs(OUT, exist_ok=True)
    chemin = os.path.join(OUT, "manifest.json")
    manifest = json.load(open(chemin, encoding="utf-8")) if os.path.exists(chemin) else {}
    restos = json.load(open(os.path.join(ROOT, "content", "restos.json"), encoding="utf-8"))
    ids = sys.argv[1:]
    for r in restos:
        if ids and r["id"] not in ids:
            continue
        traiter(r, manifest)
        json.dump(manifest, open(chemin, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"\n{sum(1 for v in manifest.values() if v['source'] != 'aucune')} / {len(manifest)} adresses avec image.")


if __name__ == "__main__":
    main()
