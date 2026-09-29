"""Готовит ассеты сайта из исходников в fonts/ и certificate/ (исходники не меняются).

- шрифты: zip -> сабсет (Latin + Cyrillic + пунктуация) -> WOFF2 в public/fonts/
- сертификаты: PDF -> PNG высокого разрешения в src/assets/certificates/ (Astro <Image> делает AVIF/WebP)
               + копия PDF в public/certificates/
- вордмарк «Яндекс Лицей»: альфа-маска встроенного в certificate.pdf изображения -> public/brand/

Запуск: python tools/prepare_assets.py   (нужны: pip install pymupdf brotli fonttools pillow)
"""

from __future__ import annotations

import io
import shutil
import zipfile
from pathlib import Path

import pymupdf
from fontTools import subset
from fontTools.ttLib import TTFont
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
FONTS_ZIP = ROOT / "fonts" / "Dela_Gothic_One,Moderustic.zip"
CERT_DIR = ROOT / "certificate"

PUBLIC_FONTS = ROOT / "public" / "fonts"
PUBLIC_CERTS = ROOT / "public" / "certificates"
PUBLIC_BRAND = ROOT / "public" / "brand"
ASSET_CERTS = ROOT / "src" / "assets" / "certificates"

UNICODES = [
    *range(0x0020, 0x007F),  # Basic Latin
    *range(0x00A0, 0x0100),  # Latin-1: nbsp, «», ©, ×, ·
    *range(0x0400, 0x0460),  # Cyrillic
    *range(0x2010, 0x2028),  # dashes, quotes, bullet, ellipsis
    *range(0x2030, 0x203B),
    0x2116,  # №
    *range(0x2190, 0x219A),  # arrows
    0x2212, 0x2227, 0x2248, 0x2260, 0x2264, 0x2265, 0x2022, 0x25CF,
]

FONTS = {
    "Dela_Gothic_One/DelaGothicOne-Regular.ttf": "dela-gothic-one.woff2",
    "Moderustic/Moderustic-VariableFont_wght.ttf": "moderustic-var.woff2",
}

# (исходный PDF, имя в проекте)
CERTS = {
    "certificate.pdf": "go-1-yandex-lyceum",
    "1579844.pdf": "python-kod-budushchego",
}


def build_fonts() -> None:
    PUBLIC_FONTS.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(FONTS_ZIP) as z:
        for src, out in FONTS.items():
            font = TTFont(io.BytesIO(z.read(src)))
            opts = subset.Options()
            opts.flavor = "woff2"
            opts.layout_features = ["*"]
            opts.name_IDs = ["*"]
            opts.notdef_outline = True
            opts.hinting = False
            sub = subset.Subsetter(options=opts)
            sub.populate(unicodes=UNICODES)
            sub.subset(font)
            target = PUBLIC_FONTS / out
            font.flavor = "woff2"
            font.save(target)
            print(f"font  {out:28s} {target.stat().st_size / 1024:6.1f} KB")


def build_certificates() -> None:
    ASSET_CERTS.mkdir(parents=True, exist_ok=True)
    PUBLIC_CERTS.mkdir(parents=True, exist_ok=True)
    for src, name in CERTS.items():
        pdf = CERT_DIR / src
        doc = pymupdf.open(pdf)
        page = doc[0]
        long_side = max(page.rect.width, page.rect.height)
        zoom = 2000 / long_side
        pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
        png = ASSET_CERTS / f"{name}.png"
        pix.save(png)
        shutil.copyfile(pdf, PUBLIC_CERTS / f"{name}.pdf")
        print(f"cert  {name:28s} {pix.width}x{pix.height}")


def build_lyceum_wordmark() -> None:
    """Вордмарк лежит в certificate.pdf как JPEG + SMask; берём маску как альфу."""
    PUBLIC_BRAND.mkdir(parents=True, exist_ok=True)
    doc = pymupdf.open(CERT_DIR / "certificate.pdf")
    page = doc[0]
    xref = next(
        im[0] for im in page.get_images(full=True)
        if im[2] > 2000 and im[3] < 1000  # широкое изображение внизу справа
    )
    smask_xref = doc.extract_image(xref)["smask"]
    alpha = Image.open(io.BytesIO(doc.extract_image(smask_xref)["image"])).convert("L")
    bbox = alpha.point(lambda v: 255 if v > 24 else 0).getbbox()
    alpha = alpha.crop(bbox)
    height = 120
    alpha = alpha.resize((round(alpha.width * height / alpha.height), height), Image.LANCZOS)
    mask = Image.new("RGBA", alpha.size, (0, 0, 0, 0))
    mask.putalpha(alpha)
    out = PUBLIC_BRAND / "yandex-lyceum.png"
    mask.save(out, optimize=True)
    print(f"brand yandex-lyceum.png {alpha.width}x{alpha.height} {out.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    build_fonts()
    build_certificates()
    build_lyceum_wordmark()
