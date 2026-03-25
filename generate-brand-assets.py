"""
Cristi Labs - Brand Asset Generator  v2
Generates logo-512.png (512x512) and og-image.png (1200x630)
"""
import sys
import os
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# ── Paths ──────────────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
PUBLIC_DIR  = SCRIPT_DIR / "frontend" / "public"
FONT_CACHE  = SCRIPT_DIR / ".font-cache"
PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
FONT_CACHE.mkdir(exist_ok=True)

# ── Design Tokens ──────────────────────────────────────────────────────────
BG       = (5, 5, 7)
GOLD     = (201, 168, 76)    # #C9A84C
GOLD_MID = (184, 146, 74)    # #B8924A
GOLD_DIM = (110, 84, 36)
WHITE    = (255, 255, 255)
GRAY     = (165, 158, 145)   # warm gray for body text


# ── Font Loader ────────────────────────────────────────────────────────────
import urllib.request

FONT_URLS = {
    "bebas": ("BebasNeue-Regular.ttf",
              "https://github.com/google/fonts/raw/main/ofl/bebasneue/BebasNeue-Regular.ttf"),
    "sora":  ("Sora-Variable.ttf",
              "https://github.com/google/fonts/raw/refs/heads/main/ofl/sora/Sora%5Bwght%5D.ttf"),
}
SYS_FALLBACK = {
    "sora":  r"C:\Windows\Fonts\ARIALN.TTF",
    "bebas": r"C:\Windows\Fonts\arial.ttf",
}

def get_font(key: str, size: int) -> ImageFont.FreeTypeFont:
    name, url = FONT_URLS[key]
    path = FONT_CACHE / name
    if not path.exists():
        print(f"  v Downloading {name}...")
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=20) as r:
                path.write_bytes(r.read())
            print(f"  + OK {name}")
        except Exception as e:
            print(f"  ! {e} — using system fallback")
            fb = SYS_FALLBACK.get(key, "")
            if fb and Path(fb).exists():
                return ImageFont.truetype(fb, size)
            return ImageFont.load_default(size=size)
    return ImageFont.truetype(str(path), size)


# ── Primitive helpers ──────────────────────────────────────────────────────
def tsize(draw, text, font):
    bb = draw.textbbox((0, 0), text, font=font)
    return bb[2] - bb[0], bb[3] - bb[1]

def tpos_center(draw, text, font, canvas_w, canvas_h, offset_y=0):
    """Return (x, y) to render text perfectly centered, accounting for bbox bearing."""
    bb = draw.textbbox((0, 0), text, font=font)
    tw = bb[2] - bb[0]
    th = bb[3] - bb[1]
    x  = (canvas_w - tw) // 2 - bb[0]
    y  = (canvas_h - th) // 2 - bb[1] + offset_y
    return x, y

def smooth_glow(base: Image.Image, cx, cy, radius, color, alpha_pct=0.55) -> Image.Image:
    """
    Gaussian-blurred radial glow — perfectly smooth, no ring artifacts.
    alpha_pct: 0–1, peak opacity of the glow core.
    """
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    core_a = int(alpha_pct * 255)
    # Filled solid ellipse, then blur to feather it
    d.ellipse([cx - radius, cy - radius, cx + radius, cy + radius],
              fill=(*color, core_a))
    blurred = layer.filter(ImageFilter.GaussianBlur(radius=radius * 0.55))
    return Image.alpha_composite(base.convert("RGBA"), blurred).convert("RGBA")

def h_gradient_line(draw, y, x0, x1, color, peak_alpha=110, height=1):
    """Fade-in/fade-out horizontal rule."""
    w = x1 - x0
    for xi in range(w):
        t = xi / max(w - 1, 1)
        dist = abs(t - 0.5) * 2          # 0 at centre, 1 at edges
        a = int(peak_alpha * (1 - dist ** 1.8))
        draw.line([(x0 + xi, y), (x0 + xi, y + height - 1)],
                  fill=(*color, max(0, a)))

def corners(draw, rect, arm=20, gap=0, alpha=95, thick=1):
    x0, y0, x1, y1 = rect
    x0 += gap; y0 += gap; x1 -= gap; y1 -= gap
    c = (*GOLD_MID, alpha)
    for px, py, dx, dy in [
        (x0, y0,  arm, 0), (x0, y0, 0,  arm),
        (x1 - arm, y0, arm, 0), (x1, y0, 0,  arm),
        (x0, y1,  arm, 0), (x0, y1 - arm, 0, arm),
        (x1 - arm, y1, arm, 0), (x1, y1 - arm, 0, arm),
    ]:
        draw.line([(px, py), (px + dx, py + dy)], fill=c, width=thick)

def noise_overlay(size, seed=42, intensity=5) -> Image.Image:
    import random
    random.seed(seed)
    n = Image.new("L", size)
    px = n.load()
    for y in range(size[1]):
        for x in range(size[0]):
            px[x, y] = random.randint(0, intensity)
    rgba = n.convert("RGBA")
    r, g, b, _ = rgba.split()
    rgba = Image.merge("RGBA", (r, g, b, n.point(lambda p: p // 3)))
    return rgba


# ══════════════════════════════════════════════════════════════════════════════
#  LOGO — 512 x 512
# ══════════════════════════════════════════════════════════════════════════════
def build_logo():
    print("\n-- Building logo-512.png --")
    W = H = 512
    img = Image.new("RGBA", (W, H), (*BG, 255))

    # Subtle vignette background (darker toward corners)
    vgn = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    vd  = ImageDraw.Draw(vgn)
    for step in range(0, 120, 4):
        t = step / 120
        a = int(60 * (1 - t) ** 2)
        vd.rectangle([step, step, W - step, H - step], outline=(0, 0, 0, a))
    img = Image.alpha_composite(img, vgn)

    # Single smooth glow behind monogram — tight, gold
    cx, cy = W // 2, H // 2
    img = smooth_glow(img, cx, cy, radius=155, color=GOLD, alpha_pct=0.14)
    img = smooth_glow(img, cx, cy, radius=80,  color=GOLD, alpha_pct=0.10)

    draw = ImageDraw.Draw(img, "RGBA")

    # Outer frame
    m = 14
    draw.rectangle([m, m, W - m, H - m], outline=(*GOLD_MID, 55), width=1)
    draw.rectangle([m + 7, m + 7, W - m - 7, H - m - 7],
                   outline=(*GOLD_DIM, 30), width=1)

    # Corner marks
    corners(draw, [m + 2, m + 2, W - m - 2, H - m - 2], arm=20, alpha=100)

    # EST label top-center
    f_est = get_font("sora", 13)
    est   = "EST.  2026"
    ew, _ = tsize(draw, est, f_est)
    draw.text(((W - ew) // 2, m + 20), est, font=f_est,
              fill=(*GOLD_DIM, 100))

    # Hairline below EST
    draw.line([(W // 2 - 30, m + 38), (W // 2 + 30, m + 38)],
              fill=(*GOLD_DIM, 45), width=1)

    # "CL" monogram — Bebas Neue, bbox-corrected centering
    f_cl    = get_font("bebas", 256)
    tx, ty  = tpos_center(draw, "CL", f_cl, W, H, offset_y=-10)
    _, th   = tsize(draw, "CL", f_cl)

    # Subtle drop shadow
    draw.text((tx + 2, ty + 3), "CL", font=f_cl, fill=(*BG, 180))
    # Main gold
    draw.text((tx, ty), "CL", font=f_cl, fill=(*GOLD, 255))

    # Fine rule below monogram
    rule_y = ty + th + 18
    h_gradient_line(draw, rule_y, W // 2 - 55, W // 2 + 55, GOLD_MID, peak_alpha=90)

    # Sub-label "CRISTI LABS"
    f_sub = get_font("bebas", 26)
    sub   = "CRISTI  LABS"
    sw, _ = tsize(draw, sub, f_sub)
    draw.text(((W - sw) // 2, rule_y + 11), sub, font=f_sub,
              fill=(*GOLD_MID, 100))

    # Noise texture
    img = Image.alpha_composite(img, noise_overlay((W, H)))

    out = PUBLIC_DIR / "logo-512.png"
    img.convert("RGB").save(out, "PNG", optimize=True)
    print(f"  + logo-512.png  ({out.stat().st_size // 1024} KB)")


# ══════════════════════════════════════════════════════════════════════════════
#  OG IMAGE — 1200 x 630
# ══════════════════════════════════════════════════════════════════════════════
def build_og():
    print("\n-- Building og-image.png --")
    W, H = 1200, 630
    img = Image.new("RGBA", (W, H), (*BG, 255))

    # ── Very faint diagonal grid (architectural texture) ──
    grid = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd   = ImageDraw.Draw(grid)
    step = 90
    for i in range(-H // step, (W + H) // step + 1):
        x = i * step
        gd.line([(x, 0), (x + H, H)], fill=(*GOLD_DIM, 8), width=1)
    img = Image.alpha_composite(img, grid)

    # ── Background glows — left pool (subtle), right shadow ──
    img = smooth_glow(img, -30, H // 2, radius=320, color=GOLD, alpha_pct=0.09)
    img = smooth_glow(img, W + 30, H // 2, radius=200, color=(5, 5, 20), alpha_pct=0.5)

    draw = ImageDraw.Draw(img, "RGBA")

    # ── Outer / inner frame ──
    pad = 30
    draw.rectangle([pad, pad, W - pad, H - pad],
                   outline=(*GOLD_MID, 45), width=1)
    draw.rectangle([pad + 9, pad + 9, W - pad - 9, H - pad - 9],
                   outline=(*GOLD_DIM, 22), width=1)

    # Corner marks
    corners(draw, [pad + 2, pad + 2, W - pad - 2, H - pad - 2],
            arm=28, alpha=90)

    # ── LEFT COLUMN ───────────────────────────────────────────────────────
    lx, top = 72, 90

    # Eyebrow
    f_eyebrow = get_font("bebas", 15)
    ey = "VENTURE STUDIO   ·   EST. 2026   ·   SHERIDAN, WY"
    draw.text((lx, top), ey, font=f_eyebrow, fill=(*GOLD_DIM, 155))
    draw.line([(lx, top + 22), (lx + 400, top + 22)],
              fill=(*GOLD_DIM, 35), width=1)

    # "CRISTI" — main hero word
    f_cristi = get_font("bebas", 175)
    cw, ch   = tsize(draw, "CRISTI", f_cristi)
    cy_pos   = top + 28
    # Soft gold aura behind letters (blurred)
    aura = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ad   = ImageDraw.Draw(aura)
    ad.text((lx + 2, cy_pos + 4), "CRISTI", font=f_cristi, fill=(*GOLD, 40))
    aura = aura.filter(ImageFilter.GaussianBlur(radius=18))
    img  = Image.alpha_composite(img, aura)
    draw = ImageDraw.Draw(img, "RGBA")  # refresh draw after composite
    draw.text((lx, cy_pos), "CRISTI", font=f_cristi, fill=(*GOLD, 245))

    # "LABS" — secondary, slightly smaller and dimmer
    f_labs = get_font("bebas", 120)
    lw, lh = tsize(draw, "LABS", f_labs)
    ly_pos = cy_pos + ch - 8
    aura2  = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ad2    = ImageDraw.Draw(aura2)
    ad2.text((lx + 2, ly_pos + 3), "LABS", font=f_labs, fill=(*GOLD_MID, 35))
    aura2  = aura2.filter(ImageFilter.GaussianBlur(radius=12))
    img    = Image.alpha_composite(img, aura2)
    draw   = ImageDraw.Draw(img, "RGBA")
    draw.text((lx, ly_pos), "LABS", font=f_labs, fill=(*GOLD_MID, 215))

    # Gold accent bar
    bar_y = ly_pos + lh + 18
    h_gradient_line(draw, bar_y, lx, lx + 340, GOLD, peak_alpha=170)

    # Tagline
    f_tag = get_font("bebas", 19)
    tag   = "CODE THE IMPOSSIBLE.  TRADE THE WORLD."
    draw.text((lx, bar_y + 13), tag, font=f_tag,
              fill=(*GOLD_MID, 140))

    # URL
    f_url = get_font("sora", 14)
    draw.text((lx, bar_y + 44), "cristilabs.net", font=f_url,
              fill=(*GOLD_DIM, 120))

    # ── VERTICAL DIVIDER ──────────────────────────────────────────────────
    sep_x = 638
    h_gradient_line(draw, H // 2, sep_x, sep_x + 1, GOLD_MID,
                    peak_alpha=40, height=340)
    # Vertically: draw it properly as vertical line
    for yi in range(H // 2 - 170, H // 2 + 170):
        t  = abs(yi - H // 2) / 170
        a  = int(42 * (1 - t ** 1.5))
        draw.point((sep_x, yi), fill=(*GOLD_MID, a))

    # ── RIGHT COLUMN ──────────────────────────────────────────────────────
    rx = sep_x + 58

    # "ABOUT" label
    f_label = get_font("bebas", 12)
    draw.text((rx, 128), "ABOUT", font=f_label, fill=(*GOLD_DIM, 110))
    draw.line([(rx, 146), (rx + 160, 146)], fill=(*GOLD_DIM, 35), width=1)

    # Description
    f_desc = get_font("sora", 19)
    lines  = [
        "Venture studio operating",
        "at the intersection of",
        "global trade infrastructure",
        "and immersive digital",
        "technology.",
    ]
    yd = 162
    for ln in lines:
        draw.text((rx, yd), ln, font=f_desc, fill=(*GRAY, 185))
        yd += 32

    # Metric rows
    f_val = get_font("bebas", 34)
    f_lbl = get_font("bebas", 11)
    metrics = [
        ("3",    "ACTIVE DIVISIONS"),
        ("$1T+", "ADDRESSABLE MARKET"),
        ("WY",   "USA  HQ"),
    ]
    ym = 375
    for val, label in metrics:
        vw, _ = tsize(draw, val, f_val)
        draw.text((rx, ym), val, font=f_val, fill=(*GOLD, 215))
        draw.text((rx + vw + 8, ym + 13), label, font=f_lbl,
                  fill=(*GOLD_DIM, 145))
        ym += 52

    # Bottom contact
    f_contact = get_font("sora", 12)
    draw.text((rx, H - pad - 52), "access@cristilabs.net", font=f_contact,
              fill=(*GOLD_DIM, 95))

    # ── Noise texture ──
    img = Image.alpha_composite(img, noise_overlay((W, H)))

    out = PUBLIC_DIR / "og-image.png"
    img.convert("RGB").save(out, "PNG", optimize=True)
    print(f"  + og-image.png  ({out.stat().st_size // 1024} KB)")


# ── Entry ──────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("Cristi Labs - Brand Asset Generator v2")
    print("=" * 42)
    build_logo()
    build_og()
    build_favicons()


# ══════════════════════════════════════════════════════════════════════════════
#  FAVICONS — All required icon sizes for browsers, PWA, iOS
# ══════════════════════════════════════════════════════════════════════════════
def build_favicons():
    print("\n-- Building favicons --")
    src = Image.open(PUBLIC_DIR / "logo-512.png").convert("RGBA")
    
    sizes = {
        "favicon-16x16.png":    (16, 16),
        "favicon-32x32.png":    (32, 32),
        "apple-touch-icon.png": (180, 180),
        "logo-192.png":         (192, 192),
    }
    for name, size in sizes.items():
        img = src.resize(size, Image.LANCZOS)
        img.save(PUBLIC_DIR / name, "PNG", optimize=True)
        print(f"  + {name}  {size[0]}×{size[1]}")
    
    # ICO: embed 16, 32, 48
    ico_sizes = [(16,16),(32,32),(48,48)]
    ico_frames = [src.resize(s, Image.LANCZOS) for s in ico_sizes]
    ico_frames[0].save(
        PUBLIC_DIR / "favicon.ico",
        format="ICO",
        sizes=ico_sizes,
        append_images=ico_frames[1:]
    )
    print("  + favicon.ico  (16, 32, 48)")
    print("\nAll assets generated.")
