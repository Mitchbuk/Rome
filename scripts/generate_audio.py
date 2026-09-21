"""
generate_audio.py — Génère les fichiers audio MP3 des fiches avec des voix
neuronales (Microsoft Edge TTS, gratuit, via le paquet Python edge-tts).

Pour chaque lieu de monuments.js, deux fichiers :
  audio/<id>-adultes.mp3   texte adultes
  audio/<id>-enfants.mp3   texte enfants
et un index audio/manifest.json (durée, taille, empreinte du texte) que
l'application lit pour savoir quels audios existent.

Seuls les textes modifiés depuis la dernière génération sont recalculés
(comparaison d'empreinte SHA-1), donc le script peut être relancé souvent.

Prérequis :  pip install edge-tts      (ffmpeg facultatif, pour la durée exacte)
Usage     :  python scripts/generate_audio.py [id ...]
Options   :  --force  régénère tout      --voix-adultes NOM  --voix-enfants NOM
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

import edge_tts

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(ROOT, "audio")
MANIFEST = os.path.join(AUDIO_DIR, "manifest.json")

VOIX = {
    "adultes": "fr-FR-HenriNeural",
    "enfants": "fr-FR-DeniseNeural",
}
DEBIT = "+0%"      # vitesse de lecture (ex. "-5%" pour ralentir)
PAUSE_SECTION = " ... "  # respiration entre les sections


def charger_monuments():
    """Lit monuments.js via Node pour obtenir les données en JSON."""
    code = "const {MONUMENTS}=require(process.argv[1]);process.stdout.write(JSON.stringify(MONUMENTS))"
    out = subprocess.run(["node", "-e", code, os.path.join(ROOT, "monuments.js")],
                         capture_output=True, check=True)
    return json.loads(out.stdout.decode("utf-8"))


def texte_lu(m, public):
    """Assemble le texte complet à lire : nom, puis chaque section (titre + texte)."""
    sections = m.get(public) or []
    parts = [m["nom"] + "."]
    if isinstance(sections, str):
        parts.append(sections)
    else:
        for s in sections:
            parts.append(f"{s['titre']}.{PAUSE_SECTION}{s['texte']}")
    texte = PAUSE_SECTION.join(parts)
    # Aide à la prononciation
    texte = re.sub(r"av\.\s?J\.-C\.", "avant Jésus-Christ", texte)
    texte = re.sub(r"apr\.\s?J\.-C\.", "après Jésus-Christ", texte)
    return texte


def empreinte(texte, voix):
    return hashlib.sha1((voix + "|" + DEBIT + "|" + texte).encode("utf-8")).hexdigest()[:16]


def duree_mp3(chemin):
    """Durée en secondes via ffprobe si disponible, sinon estimation (48 kbit/s)."""
    try:
        out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                              "-of", "csv=p=0", chemin], capture_output=True, check=True)
        return round(float(out.stdout.decode().strip()))
    except Exception:  # noqa: BLE001
        return round(os.path.getsize(chemin) / 6000)


async def generer(texte, voix, chemin):
    communicate = edge_tts.Communicate(texte, voix, rate=DEBIT)
    await communicate.save(chemin)


async def generer_tout(taches, manifest, parallele=4):
    """Génère les fichiers 4 par 4 et met le manifeste à jour après chacun."""
    sem = asyncio.Semaphore(parallele)
    total = 0

    async def une(nom, chemin, texte, voix, h):
        nonlocal total
        async with sem:
            print(f"...  {nom}  [{voix}] {len(texte)} caractères", flush=True)
            for tentative in range(3):
                try:
                    await generer(texte, voix, chemin)
                    break
                except Exception as e:  # noqa: BLE001
                    print(f"!!  {nom} : {e} (tentative {tentative + 1})")
                    await asyncio.sleep(5)
            else:
                return
            manifest[nom] = {"hash": h, "voix": voix, "duree": duree_mp3(chemin), "taille": os.path.getsize(chemin)}
            total += 1
            with open(MANIFEST, "w", encoding="utf-8") as f:
                json.dump(manifest, f, ensure_ascii=False, indent=2)
            print(f"OK   {nom}  {manifest[nom]['duree']} s", flush=True)

    await asyncio.gather(*(une(*t) for t in taches))
    return total


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    force = "--force" in sys.argv
    for i, a in enumerate(sys.argv):
        if a == "--voix-adultes":
            VOIX["adultes"] = sys.argv[i + 1]
        if a == "--voix-enfants":
            VOIX["enfants"] = sys.argv[i + 1]

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
            h = empreinte(texte, voix)
            if not force and os.path.exists(chemin) and manifest.get(nom, {}).get("hash") == h:
                print(f"=   {nom} (inchangé)")
                continue
            taches.append((nom, chemin, texte, voix, h))

    total = asyncio.run(generer_tout(taches, manifest))
    poids = sum(v["taille"] for v in manifest.values()) / 1024 / 1024
    print(f"\n{total} fichier(s) généré(s). {len(manifest)} audios au total, {poids:.1f} Mo.")


if __name__ == "__main__":
    main()
