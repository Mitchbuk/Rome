"""
generate_audio.py — Génère les fichiers audio MP3 des fiches avec les voix
neuronales Microsoft, par deux moteurs au choix :

  * edge-tts (gratuit, sans clé, non officiel) : moteur par défaut.
  * Azure Speech (officiel, SSML) : avec --moteur azure et une clé AZURE_SPEECH_KEY
    dans l'environnement ou dans un fichier tts-lab/.env (cherché en remontant
    depuis le dossier du projet). Palier gratuit F0 : 500 000 caractères/mois.
    Le SSML apporte les respirations entre phrases et sections, un débit
    différent par public, et la prononciation italienne des noms de lieux
    (uniquement avec les voix « Multilingual »).

Pour chaque lieu de monuments.js, deux fichiers :
  audio/<id>-adultes.mp3   texte adultes
  audio/<id>-enfants.mp3   texte enfants
et un index audio/manifest.json (durée, taille, empreinte du texte) que
l'application lit pour savoir quels audios existent.

Seuls les textes modifiés depuis la dernière génération sont recalculés
(comparaison d'empreinte SHA-1 : texte + voix + moteur + réglages), donc le
script peut être relancé souvent.

Prérequis :  pip install edge-tts      (ffmpeg facultatif, pour la durée exacte)
Usage     :  python scripts/generate_audio.py [id ...]
Options   :  --force  régénère tout      --voix-adultes NOM  --voix-enfants NOM
             --moteur azure|edge         moteur (défaut : edge)
Voix françaises conseillées : fr-FR-DeniseNeural, fr-FR-HenriNeural,
fr-FR-VivienneMultilingualNeural, fr-FR-RemyMultilingualNeural, fr-FR-EloiseNeural (enfant).
Liste complète : python -m edge_tts --list-voices | findstr fr-FR
"""
import asyncio
import hashlib
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from xml.sax.saxutils import escape

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(ROOT, "audio")
MANIFEST = os.path.join(AUDIO_DIR, "manifest.json")

VOIX = {
    "adultes": "fr-FR-HenriNeural",
    "enfants": "fr-FR-DeniseNeural",
}
DEBIT = {"adultes": "+0%", "enfants": "+0%"}   # vitesse de lecture (ex. "-5%" pour ralentir)
PAUSES = {"phrase": 250, "titre": 500, "section": 900}  # ms, Azure uniquement (en plus des pauses naturelles)
PAUSE_SECTION = " ... "  # respiration entre les sections (edge-tts)
FORMAT_AZURE = "audio-24khz-48kbitrate-mono-mp3"  # même format que edge-tts

# Graphies forcées dans le texte lu (jamais affichées) : liaisons, abréviations…
GRAPHIES = [
    (r"av\.\s?J\.-C\.", "avant Jésus-Christ"),
    (r"apr\.\s?J\.-C\.", "après Jésus-Christ"),
    (r"Moyen Âge", "Moyen-Âge"),  # force la liaison « moyen-nâge »
]

# Noms lus avec la prononciation italienne (Azure + voix Multilingual seulement).
ITALIEN = [
    "Santa Maria in Trastevere", "Santa Maria in Cosmedin", "Largo di Torre Argentina",
    "Campo de' Fiori", "Piazza del Popolo", "Piazza Navona", "Piazza Venezia", "Piazza Colonna",
    "Piazza Farnese", "Palazzo Venezia", "Via del Corso", "Via Appia Antica", "Via Appia",
    "Via Condotti", "Via dei Cappellari", "Via dei Giubbonari", "Via dei Baullari", "Via dei Chiavari",
    "Via di Grotta Pinta", "Porta San Sebastiano", "Porta San Paolo", "Galleria Alberto Sordi",
    "Galleria Colonna", "Monte Testaccio", "Santa Sabina", "Scala Santa", "Ponte Rotto",
    "Bocca della Verità", "Trastevere", "Testaccio", "Pincio", "Vittoriano", "pizza bianca",
]


def charger_monuments():
    """Lit monuments.js via Node pour obtenir les données en JSON."""
    code = "const {MONUMENTS}=require(process.argv[1]);process.stdout.write(JSON.stringify(MONUMENTS))"
    out = subprocess.run(["node", "-e", code, os.path.join(ROOT, "monuments.js")],
                         capture_output=True, check=True)
    return json.loads(out.stdout.decode("utf-8"))


def prononciation(texte):
    """Aide à la prononciation, commune aux deux moteurs."""
    for motif, remplacement in GRAPHIES:
        texte = re.sub(motif, remplacement, texte)
    return texte


def sections_lues(m, public):
    """Liste de (titre, texte) à lire, titre None pour le nom du lieu."""
    sections = m.get(public) or []
    out = [(None, prononciation(m["nom"] + "."))]
    if isinstance(sections, str):
        out.append((None, prononciation(sections)))
    else:
        for s in sections:
            out.append((prononciation(s["titre"] + "."), prononciation(s["texte"])))
    return out


def texte_lu(m, public):
    """Texte brut complet (edge-tts, et base de l'empreinte)."""
    parts = []
    for titre, texte in sections_lues(m, public):
        parts.append(f"{titre}{PAUSE_SECTION}{texte}" if titre else texte)
    return PAUSE_SECTION.join(parts)


# ---------------------------------------------------------------- Azure / SSML

def config_azure():
    """Clé et région : variables d'environnement, sinon un tts-lab/.env en remontant depuis ROOT."""
    cle, region = os.environ.get("AZURE_SPEECH_KEY"), os.environ.get("AZURE_SPEECH_REGION")
    d = ROOT
    while not cle and d:
        env = os.path.join(d, "tts-lab", ".env")
        if os.path.exists(env):
            for l in open(env, encoding="utf-8"):
                if l.startswith("AZURE_SPEECH_KEY="):
                    cle = l.split("=", 1)[1].strip()
                if l.startswith("AZURE_SPEECH_REGION="):
                    region = l.split("=", 1)[1].strip()
        parent = os.path.dirname(d)
        d = parent if parent != d else None
    return (cle, region or "francecentral") if cle else (None, None)


def phrases(texte):
    return [p for p in re.split(r"(?<=[.!?…])\s+(?=[A-ZÀ-ÝÉ«\d])", texte.strip()) if p]


def ssml_texte(texte, voix):
    """Texte échappé, avec <lang> italien si la voix le permet."""
    t = escape(texte)
    if "Multilingual" in voix:
        for nom in ITALIEN:
            t = re.sub(r"\b" + re.escape(escape(nom)) + r"\b",
                       f'<lang xml:lang="it-IT">{escape(nom)}</lang>', t)
    return t


def ssml(m, public, voix):
    b = lambda ms: f'<break time="{ms}ms"/>'  # noqa: E731
    corps = []
    for titre, texte in sections_lues(m, public):
        if titre:
            corps.append(f"<s>{ssml_texte(titre, voix)}</s>{b(PAUSES['titre'])}")
        corps.append(b(PAUSES["phrase"]).join(f"<s>{ssml_texte(p, voix)}</s>" for p in phrases(texte)))
        corps.append(b(PAUSES["section"]))
    return ('<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" '
            'xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="fr-FR">'
            f'<voice name="{voix}"><prosody rate="{DEBIT[public]}"><p>{"".join(corps)}</p></prosody></voice></speak>')


def generer_azure(xml, chemin, cle, region):
    req = urllib.request.Request(
        f"https://{region}.tts.speech.microsoft.com/cognitiveservices/v1", data=xml.encode("utf-8"),
        headers={"Ocp-Apim-Subscription-Key": cle, "Content-Type": "application/ssml+xml",
                 "X-Microsoft-OutputFormat": FORMAT_AZURE, "User-Agent": "rome-famille"})
    for tentative in range(4):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                data = r.read()
            if len(data) < 1000:
                raise RuntimeError("réponse audio vide")
            with open(chemin, "wb") as f:
                f.write(data)
            return
        except urllib.error.HTTPError as e:
            if e.code == 429 and tentative < 3:  # quota F0 : on patiente
                time.sleep(10 * (tentative + 1))
                continue
            raise RuntimeError(f"HTTP {e.code} : {e.read().decode('utf-8', 'replace')[:300]}") from e


# ---------------------------------------------------------------- commun

def empreinte(texte, voix, moteur, public):
    reglages = DEBIT[public] if moteur == "edge" else f"azure|{DEBIT[public]}|{PAUSES}"
    return hashlib.sha1((voix + "|" + reglages + "|" + texte).encode("utf-8")).hexdigest()[:16]


def duree_mp3(chemin):
    """Durée en secondes via ffprobe si disponible, sinon estimation (48 kbit/s)."""
    try:
        out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                              "-of", "csv=p=0", chemin], capture_output=True, check=True)
        return round(float(out.stdout.decode().strip()))
    except Exception:  # noqa: BLE001
        return round(os.path.getsize(chemin) / 6000)


async def generer_edge(texte, voix, public, chemin):
    import edge_tts
    communicate = edge_tts.Communicate(texte, voix, rate=DEBIT[public])
    await communicate.save(chemin)


async def generer_tout(taches, manifest, moteur, azure, parallele):
    """Génère les fichiers en parallèle et met le manifeste à jour après chacun."""
    sem = asyncio.Semaphore(parallele)
    total = 0

    async def une(nom, chemin, m, public, texte, voix, h):
        nonlocal total
        async with sem:
            print(f"...  {nom}  [{voix}, {moteur}] {len(texte)} caractères", flush=True)
            for tentative in range(3):
                try:
                    if moteur == "azure":
                        await asyncio.to_thread(generer_azure, ssml(m, public, voix), chemin, *azure)
                    else:
                        await generer_edge(texte, voix, public, chemin)
                    break
                except Exception as e:  # noqa: BLE001
                    print(f"!!  {nom} : {e} (tentative {tentative + 1})")
                    await asyncio.sleep(5)
            else:
                return
            manifest[nom] = {"hash": h, "voix": voix, "moteur": moteur,
                             "duree": duree_mp3(chemin), "taille": os.path.getsize(chemin)}
            total += 1
            with open(MANIFEST, "w", encoding="utf-8") as f:
                json.dump(manifest, f, ensure_ascii=False, indent=2)
            print(f"OK   {nom}  {manifest[nom]['duree']} s", flush=True)

    await asyncio.gather(*(une(*t) for t in taches))
    return total


def main():
    force = "--force" in sys.argv
    moteur = None
    options = set()
    for i, a in enumerate(sys.argv):
        if a == "--voix-adultes":
            VOIX["adultes"] = sys.argv[i + 1]
        if a == "--voix-enfants":
            VOIX["enfants"] = sys.argv[i + 1]
        if a == "--moteur":
            moteur = sys.argv[i + 1]
        if a in ("--voix-adultes", "--voix-enfants", "--moteur"):
            options.add(i + 1)
    args = [a for i, a in enumerate(sys.argv) if i > 0 and not a.startswith("--") and i not in options]

    azure = config_azure()
    if moteur is None:
        moteur = "edge"
    if moteur == "azure" and not azure[0]:
        sys.exit("Moteur azure demandé mais AZURE_SPEECH_KEY introuvable (environnement ou tts-lab/.env).")
    print(f"Moteur : {moteur}" + (f" ({azure[1]})" if moteur == "azure" else ""))

    os.makedirs(AUDIO_DIR, exist_ok=True)
    manifest = {}
    if os.path.exists(MANIFEST):
        with open(MANIFEST, encoding="utf-8") as f:
            manifest = json.load(f)

    monuments = charger_monuments()
    if args:
        monuments = [m for m in monuments if m["id"] in args]

    # Tâches à générer (on saute les fichiers dont le texte n'a pas changé)
    taches = []
    for m in monuments:
        if m.get("categorie") == "manger":
            continue  # les fiches "Où manger" n'ont pas d'audio (lues par la voix du téléphone)
        for public in ("adultes", "enfants"):
            if not m.get(public):
                continue
            texte = texte_lu(m, public)
            voix = VOIX[public]
            nom = f"{m['id']}-{public}.mp3"
            chemin = os.path.join(AUDIO_DIR, nom)
            h = empreinte(texte, voix, moteur, public)
            if not force and os.path.exists(chemin) and manifest.get(nom, {}).get("hash") == h:
                print(f"=   {nom} (inchangé)")
                continue
            taches.append((nom, chemin, m, public, texte, voix, h))

    total = asyncio.run(generer_tout(taches, manifest, moteur, azure, parallele=2 if moteur == "azure" else 4))
    poids = sum(v["taille"] for v in manifest.values()) / 1024 / 1024
    print(f"\n{total} fichier(s) généré(s). {len(manifest)} audios au total, {poids:.1f} Mo.")


if __name__ == "__main__":
    main()
