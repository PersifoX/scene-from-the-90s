"""Reproduce the selected CC0 Poly Haven downloads without temporary metadata."""
import hashlib
import json
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]

def fetch(url):
    with urlopen(Request(url, headers={"User-Agent": "OrgRoomStudyPrototype/1.0"}), timeout=30) as response:
        return response.read()

def save(entry, target):
    if target.exists() and hashlib.md5(target.read_bytes()).hexdigest() == entry.get("md5"):
        return
    data = fetch(entry["url"])
    if entry.get("md5") and hashlib.md5(data).hexdigest() != entry["md5"]:
        raise ValueError("Checksum mismatch: " + target.name)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)

for slug in ["television_02", "painted_wooden_chair_02", "book_encyclopedia_set_01", "painted_wooden_stool"]:
    files = json.loads(fetch("https://api.polyhaven.com/files/" + slug))
    entry = files["gltf"]["1k"]["gltf"]
    folder = ROOT / "public/models" / slug
    save(entry, folder / "model.gltf")
    for relative, value in entry.get("include", {}).items():
        target = (folder / relative).resolve()
        if not target.is_relative_to(folder.resolve()):
            raise ValueError(relative)
        save(value, target)
    print("Downloaded", slug)

for short, slug, diffuse in [("fabric", "fabric_pattern_05", "col_01"), ("linen", "rough_linen", "Diffuse"), ("carpet", "dirty_carpet", "Diffuse")]:
    files = json.loads(fetch("https://api.polyhaven.com/files/" + slug))
    for channel, key in [("color", diffuse), ("normal", "nor_gl"), ("roughness", "Rough")]:
        save(files[key]["1k"]["jpg"], ROOT / "public/textures/fabric" / f"{short}-{channel}.jpg")
    print("Downloaded", slug)
