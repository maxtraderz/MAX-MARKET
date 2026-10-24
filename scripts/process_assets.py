"""Import only permanently redacted, metadata-free copies. Requires Pillow."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps
import argparse, hashlib, json

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument("--source", type=Path, required=True, help="Private source directory outside the project")
args = parser.parse_args()
source = args.source.resolve()
if source.is_relative_to(ROOT):
    raise SystemExit("Keep unredacted source images outside the project.")
out = ROOT / "public/images/certificates"
out.mkdir(parents=True, exist_ok=True)
# Normalized, opaque masks: each certificate was reviewed individually.
masks = {
  1: (.47,.45,.90,.58), 2: (.30,.36,.67,.46),
  3: (.33,.385,.68,.48), 4: (.33,.39,.68,.48),
  5: (.33,.39,.68,.48), 6: (.39,.31,.61,.42),
  7: (.10,.33,.26,.39), 8: (.40,.38,.62,.46),
  9: (.306,.676,.696,.793)
}
manifest = []
thumbs = []
for number, mask in masks.items():
    path = source / f"certificates ({number}).png"
    with Image.open(path) as original:
        im = ImageOps.exif_transpose(original).convert("RGB")
    w,h = im.size
    rect = tuple(round(value * (w if i % 2 == 0 else h)) for i,value in enumerate(mask))
    fill = (250,251,253) if number in (1,9) else (15,17,19)
    ImageDraw.Draw(im).rectangle(rect, fill=fill)
    im.thumbnail((2200,2200), Image.Resampling.LANCZOS)
    # Copy pixels to a fresh image, discarding all inherited metadata.
    clean = Image.new("RGB", im.size)
    clean.paste(im)
    dest = out / f"proof-{number:02d}.webp"
    clean.save(dest, "WEBP", quality=94, method=6, exif=b"", icc_profile=None)
    check = Image.open(dest)
    assert not any(k in check.info for k in ("exif","icc_profile","xmp"))
    manifest.append({"source":path.name,"output":str(dest.relative_to(ROOT)).replace("\\","/"),
                     "redaction":list(mask),"width":clean.width,"height":clean.height,
                     "sha256":hashlib.sha256(dest.read_bytes()).hexdigest()})
    tile = Image.new("RGB",(580,440),"#e9eef5")
    preview = clean.copy(); preview.thumbnail((560,400))
    tile.paste(preview,((580-preview.width)//2,20))
    ImageDraw.Draw(tile).text((16,420),f"proof-{number:02d}",fill="#111111")
    thumbs.append(tile)
perfout = ROOT / "public/images/performance"
perfout.mkdir(parents=True, exist_ok=True)
with Image.open(source / "WhatsApp Image 2026-10-24 at 9.57.22 AM.png") as original:
    im = ImageOps.exif_transpose(original).convert("RGB")
clean = Image.new("RGB",im.size); clean.paste(im)
clean.save(perfout / "agent-jin-report.webp","WEBP",lossless=True,method=6,exif=b"")
manifest.append({"source":"WhatsApp Image 2026-10-24 at 9.57.22 AM.png",
                 "output":"public/images/performance/agent-jin-report.webp","width":clean.width,"height":clean.height,"processing":"Lossless, original figures preserved; metadata removed"})
manifest_path = ROOT / "asset-manifest.json"
if manifest_path.exists():
    previous = json.loads(manifest_path.read_text(encoding="utf-8-sig"))
    manifest.extend(entry for entry in previous if entry.get("output", "").startswith("public/videos/"))
manifest_path.write_text(json.dumps(manifest,indent=2),encoding="utf-8")
sheet = Image.new("RGB",(1740,1320),"white")
for i,tile in enumerate(thumbs): sheet.paste(tile,((i%3)*580,(i//3)*440))
(ROOT / ".local").mkdir(exist_ok=True)
sheet.save(ROOT / ".local/redaction-review.jpg")
print("Processed 9 anonymous certificates and 1 lossless historical report.")
