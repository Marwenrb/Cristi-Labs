#!/usr/bin/env python3
"""
download-fonts.py — Cristi Labs Font Self-Hosting Tool
================================================================
Downloads all Google Fonts used on cristilabs.net as woff2 files
and generates the @font-face CSS for self-hosting.

Usage (run from project root):
    python download-fonts.py

What it does:
  1. Downloads all woff2 font files → frontend/public/fonts/
  2. Prints the @font-face CSS block to add to frontend/src/index.css
  3. Prints the preload links to add to frontend/index.html

After running this script:
  - Paste the @font-face block into the TOP of frontend/src/index.css
    (before the first @import)
  - Replace the Google Fonts CDN links in frontend/index.html with
    the preload links printed by this script
  - Deploy — fonts now load from your own CDN (Netlify), zero external requests
================================================================
"""

import os
import re
import sys
import urllib.request
import urllib.error

# ── Config ────────────────────────────────────────────────────────────────────

FONTS_DIR = os.path.join("frontend", "public", "fonts")

GOOGLE_FONTS_URL = (
    "https://fonts.googleapis.com/css2"
    "?family=Bebas+Neue"
    "&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400"
    "&family=Sora:wght@200;300;400;500"
    "&family=Geist+Mono:wght@400;500"
    "&display=swap"
)

# Chrome 120 user-agent to get woff2 format (not woff/ttf)
CHROME_UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0.0.0 Safari/537.36"
)

# ── Helpers ───────────────────────────────────────────────────────────────────

def fetch_url(url, headers=None):
    req = urllib.request.Request(url, headers=headers or {})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read()


def slug(family, weight, style):
    """Generate a consistent filename slug."""
    f = family.lower().replace(" ", "-")
    s = "italic" if style == "italic" else "regular"
    return f"{f}-{weight}-{s}"


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print("\n╔══════════════════════════════════════════╗")
    print("║  Cristi Labs — Font Self-Hosting Tool    ║")
    print("╚══════════════════════════════════════════╝\n")

    # 1. Create fonts directory
    os.makedirs(FONTS_DIR, exist_ok=True)
    print(f"→ Output directory: {FONTS_DIR}\n")

    # 2. Fetch Google Fonts CSS
    print("→ Fetching Google Fonts CSS...")
    try:
        css_bytes = fetch_url(GOOGLE_FONTS_URL, {"User-Agent": CHROME_UA})
        css = css_bytes.decode("utf-8")
    except Exception as e:
        print(f"  ERROR: Could not fetch fonts CSS: {e}")
        sys.exit(1)

    # 3. Parse all @font-face blocks
    block_pattern = re.compile(
        r"@font-face\s*\{([^}]+)\}", re.DOTALL
    )
    blocks = block_pattern.findall(css)
    print(f"  Found {len(blocks)} @font-face blocks\n")

    font_face_lines = []
    preload_lines = []
    downloaded = []

    for block in blocks:
        # Extract properties
        def extract(prop):
            m = re.search(rf"{prop}\s*:\s*([^;]+);", block)
            return m.group(1).strip() if m else ""

        family = extract("font-family").strip("'\"")
        weight = extract("font-weight")
        style  = extract("font-style") or "normal"
        src    = extract("src")

        # Get woff2 URL
        url_match = re.search(r"url\(([^)]+)\)\s*format\('woff2'\)", src)
        if not url_match:
            continue
        woff2_url = url_match.group(1).strip("'\"")

        name = slug(family, weight, style)
        filename = f"{name}.woff2"
        filepath = os.path.join(FONTS_DIR, filename)

        # 4. Download woff2
        if os.path.exists(filepath):
            print(f"  ✓ {filename} (cached)")
        else:
            print(f"  ↓ Downloading {filename}...")
            try:
                data = fetch_url(woff2_url, {"User-Agent": CHROME_UA})
                with open(filepath, "wb") as f:
                    f.write(data)
                size_kb = len(data) // 1024
                print(f"    {size_kb} KB saved")
            except Exception as e:
                print(f"    ERROR: {e}")
                continue

        downloaded.append((family, weight, style, filename))

        # 5. Build @font-face CSS
        font_face_lines.append(f"""@font-face {{
  font-family: '{family}';
  font-style: {style};
  font-weight: {weight};
  font-display: swap;
  src: url('/fonts/{filename}') format('woff2');
}}""")

        # 6. Preload for critical fonts only
        if (family in ("Bebas Neue", "Sora") and
                style == "normal" and weight in ("400", "300")):
            preload_lines.append(
                f'  <link rel="preload" href="/fonts/{filename}" '
                f'as="font" type="font/woff2" crossorigin>'
            )

    # ── Output instructions ────────────────────────────────────────────────────
    print(f"\n✓ Downloaded {len(downloaded)} font files to {FONTS_DIR}/\n")

    print("=" * 66)
    print("STEP 1 — Add this block to the TOP of frontend/src/index.css")
    print("         (insert BEFORE the @import 'tailwindcss' line)")
    print("=" * 66)
    print("\n".join(font_face_lines))

    print("\n" + "=" * 66)
    print("STEP 2 — Replace Google Fonts CDN block in frontend/index.html")
    print("         with these self-hosted preload links:")
    print("=" * 66)
    print("  <!-- Self-hosted fonts (woff2) — zero external network requests -->")
    for line in preload_lines:
        print(line)
    print("  <!-- Remove the preconnect + CDN <link> tags that were here -->")

    print("\n✓ Done. Run `npm run build` and deploy to Netlify.\n")


if __name__ == "__main__":
    main()
