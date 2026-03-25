#!/usr/bin/env python3
"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRISTI LABS — Presidential Favicon Generator v2.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generates all favicon formats from the source favicon.svg:
  • Multi-resolution .ico (16x16, 32x32, 48x48)
  • PNG rasterizations (16, 32, 192, 512)
  • WebP & AVIF modern formats
  • Dark mode adaptive SVG
  • Favicon test/debug page

Usage:
  python generate-favicons.py

  Or with custom source:
  python generate-favicons.py --source path/to/logo.svg
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

import os
import sys
import argparse
from pathlib import Path

try:
    from PIL import Image
    import cairosvg
except ImportError:
    print("\n❌ Missing dependencies. Install with:\n")
    print("   pip install Pillow cairosvg\n")
    sys.exit(1)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Configuration
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SIZES_PNG = [16, 32, 192, 512]  # Standard favicon sizes
ICO_SIZES = [16, 32, 48]        # Sizes to embed in .ico
OUTPUT_DIR = Path(__file__).parent / "frontend" / "public"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SVG → PNG Conversion
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def svg_to_png(svg_path: Path, output_path: Path, size: int):
    """Convert SVG to PNG at specified size with high quality."""
    print(f"  🎨 Generating {size}x{size} PNG...")

    cairosvg.svg2png(
        url=str(svg_path),
        write_to=str(output_path),
        output_width=size,
        output_height=size,
        background_color="#0B0B0B"  # Match your brand bg
    )

    # Post-process: optimize with Pillow
    img = Image.open(output_path)
    img = img.convert("RGBA")
    img.save(output_path, "PNG", optimize=True, compress_level=9)

    size_kb = output_path.stat().st_size / 1024
    print(f"     ✓ {output_path.name} ({size_kb:.1f} KB)")


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Multi-Resolution .ICO Generator
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def create_ico(png_paths: list[Path], output_path: Path):
    """Create multi-resolution .ico from PNG files."""
    print(f"\n  💎 Creating multi-resolution .ico...")

    images = []
    for png_path in png_paths:
        img = Image.open(png_path)
        images.append(img)

    # Save as .ico with multiple resolutions embedded
    images[0].save(
        output_path,
        format="ICO",
        sizes=[(img.width, img.height) for img in images],
        append_images=images[1:]
    )

    size_kb = output_path.stat().st_size / 1024
    print(f"     ✓ favicon.ico ({size_kb:.1f} KB) — contains {len(images)} sizes")


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Modern Format Conversion (WebP, AVIF)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def create_modern_formats(png_path: Path, output_dir: Path):
    """Generate WebP and AVIF versions for modern browsers."""
    print(f"\n  🚀 Creating modern formats from {png_path.name}...")

    img = Image.open(png_path)

    # WebP (Chrome, Edge, Firefox, Safari 14+)
    webp_path = output_dir / f"favicon-{img.width}.webp"
    img.save(webp_path, "WebP", quality=85, method=6)
    print(f"     ✓ {webp_path.name} ({webp_path.stat().st_size / 1024:.1f} KB)")

    # AVIF (Chrome 85+, Firefox 93+) — Best compression
    try:
        avif_path = output_dir / f"favicon-{img.width}.avif"
        img.save(avif_path, "AVIF", quality=80)
        print(f"     ✓ {avif_path.name} ({avif_path.stat().st_size / 1024:.1f} KB)")
    except Exception:
        print(f"     ⚠ AVIF encoding not available (requires Pillow 8.2+ with libavif)")


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Dark Mode Adaptive SVG
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def create_dark_mode_svg(source_svg: Path, output_dir: Path):
    """Create a light-mode variant of the favicon for adaptive display."""
    print(f"\n  🌓 Creating dark mode adaptive SVG...")

    svg_content = source_svg.read_text(encoding="utf-8")

    # Create light mode variant (inverted colors for light system theme)
    svg_light = svg_content.replace(
        '<rect width="512" height="512" fill="#0B0B0B"/>',
        '<rect width="512" height="512" fill="#F5F5F0"/>'
    ).replace(
        'fill="url(#gold)"',
        'fill="#2A2A2A"'
    )

    light_svg_path = output_dir / "favicon-light.svg"
    light_svg_path.write_text(svg_light, encoding="utf-8")
    print(f"     ✓ favicon-light.svg (for light mode systems)")

    # Add prefers-color-scheme support to main SVG
    adaptive_svg = f'''<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <style>
    @media (prefers-color-scheme: dark) {{
      .bg-adaptive {{ fill: #0B0B0B !important; }}
      .text-adaptive {{ fill: url(#gold) !important; }}
    }}
    @media (prefers-color-scheme: light) {{
      .bg-adaptive {{ fill: #F5F5F0 !important; }}
      .text-adaptive {{ fill: #2A2A2A !important; }}
    }}
  </style>
{svg_content.replace('<rect width="512" height="512" fill="#0B0B0B"/>', '<rect class="bg-adaptive" width="512" height="512" fill="#0B0B0B"/>').replace('fill="url(#gold)"', 'class="text-adaptive" fill="url(#gold)"')}
</svg>'''

    adaptive_path = output_dir / "favicon-adaptive.svg"
    adaptive_path.write_text(adaptive_svg, encoding="utf-8")
    print(f"     ✓ favicon-adaptive.svg (auto-switches on system theme)")


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Favicon Test Page Generator
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def create_test_page(output_dir: Path):
    """Generate an HTML test page to verify all favicon formats."""
    print(f"\n  🧪 Creating favicon test page...")

    html = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cristi Labs — Favicon Test Suite</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: #0A0A0F;
      color: #F2EDE4;
      padding: 3rem;
      line-height: 1.6;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: #C9A84C;
    }
    h2 {
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: #B8924A;
      font-size: 1.25rem;
      border-bottom: 1px solid #2A2A2A;
      padding-bottom: 0.5rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-top: 1rem;
    }
    .card {
      background: #141420;
      border: 1px solid #2A2A2A;
      border-radius: 8px;
      padding: 1.5rem;
      text-align: center;
    }
    .card img {
      image-rendering: auto;
      image-rendering: crisp-edges;
      image-rendering: pixelated;
    }
    .card h3 {
      font-size: 0.875rem;
      color: #C9A84C;
      margin-top: 0.75rem;
      font-weight: 500;
    }
    .card p {
      font-size: 0.75rem;
      color: #888;
      margin-top: 0.25rem;
    }
    .status { color: #5EEAD4; font-weight: 600; }
    .error { color: #EF4444; }
    code {
      background: #0A0A0F;
      padding: 0.125rem 0.375rem;
      border-radius: 3px;
      font-size: 0.875rem;
      color: #5EEAD4;
    }
  </style>
</head>
<body>
  <h1>🎯 Cristi Labs Favicon Test Suite</h1>
  <p>Verify all favicon formats are loading correctly. Check browser tab, bookmarks, and PWA icons.</p>

  <h2>Standard Formats</h2>
  <div class="grid">
    <div class="card">
      <img src="/favicon.ico" alt="ICO" width="48" height="48">
      <h3>favicon.ico</h3>
      <p>Legacy format (IE, old browsers)</p>
      <p class="status">Multi-resolution: 16/32/48px</p>
    </div>
    <div class="card">
      <img src="/favicon-16x16.png" alt="16x16" width="48" height="48">
      <h3>favicon-16x16.png</h3>
      <p>Browser tab (standard DPI)</p>
    </div>
    <div class="card">
      <img src="/favicon-32x32.png" alt="32x32" width="48" height="48">
      <h3>favicon-32x32.png</h3>
      <p>Browser tab (HiDPI)</p>
    </div>
    <div class="card">
      <img src="/favicon.svg" alt="SVG" width="48" height="48">
      <h3>favicon.svg</h3>
      <p>Modern browsers (scalable)</p>
      <p class="status">Best quality ✓</p>
    </div>
  </div>

  <h2>Apple / iOS</h2>
  <div class="grid">
    <div class="card">
      <img src="/apple-touch-icon.png" alt="Apple" width="90" height="90">
      <h3>apple-touch-icon.png</h3>
      <p>iOS Home Screen, Safari tabs</p>
      <p>180×180 (automatically rounded by iOS)</p>
    </div>
  </div>

  <h2>PWA / Android</h2>
  <div class="grid">
    <div class="card">
      <img src="/logo-192.png" alt="192" width="96" height="96">
      <h3>logo-192.png</h3>
      <p>PWA icon (standard res)</p>
    </div>
    <div class="card">
      <img src="/logo-512.png" alt="512" width="96" height="96">
      <h3>logo-512.png</h3>
      <p>PWA icon (splash screen)</p>
    </div>
  </div>

  <h2>Modern Formats (Performance)</h2>
  <div class="grid">
    <div class="card">
      <img src="/favicon-32.webp" alt="WebP" width="48" height="48" onerror="this.parentElement.classList.add('error')">
      <h3>favicon-32.webp</h3>
      <p>WebP format (smaller file size)</p>
      <p class="status">Chrome, Edge, Firefox, Safari 14+</p>
    </div>
    <div class="card">
      <img src="/favicon-32.avif" alt="AVIF" width="48" height="48" onerror="this.parentElement.classList.add('error')">
      <h3>favicon-32.avif</h3>
      <p>AVIF format (best compression)</p>
      <p class="status">Chrome 85+, Firefox 93+</p>
    </div>
  </div>

  <h2>Adaptive Dark Mode</h2>
  <div class="grid">
    <div class="card">
      <img src="/favicon-adaptive.svg" alt="Adaptive" width="64" height="64">
      <h3>favicon-adaptive.svg</h3>
      <p>Auto-switches based on system theme</p>
      <p class="status">Try: Settings → Dark/Light Mode</p>
    </div>
  </div>

  <h2>Browser Tab Preview</h2>
  <p style="margin-top: 1rem;">
    Check the browser tab for this page. You should see the <strong style="color: #C9A84C;">CL monogram</strong>
    favicon in the tab. If you see a generic globe icon, run: <code>Ctrl + Shift + R</code> (hard refresh).
  </p>

  <h2>Debug Info</h2>
  <pre style="background: #0A0A0F; padding: 1rem; border-radius: 8px; overflow-x: auto; font-size: 0.75rem; color: #888;">
User Agent: <span id="ua" style="color: #5EEAD4;"></span>
Screen DPI: <span id="dpi" style="color: #5EEAD4;"></span>
Color Scheme: <span id="theme" style="color: #5EEAD4;"></span>
  </pre>

  <script>
    document.getElementById('ua').textContent = navigator.userAgent;
    document.getElementById('dpi').textContent = window.devicePixelRatio + 'x';
    document.getElementById('theme').textContent =
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark Mode' : 'Light Mode';
  </script>
</body>
</html>'''

    test_page_path = output_dir / "favicon-test.html"
    test_page_path.write_text(html, encoding="utf-8")
    print(f"     ✓ favicon-test.html")
    print(f"     → Open http://localhost:5173/favicon-test.html to verify")


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Main Execution
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def main():
    parser = argparse.ArgumentParser(description="Generate all favicon formats from SVG")
    parser.add_argument("--source", type=Path, default=OUTPUT_DIR / "favicon.svg",
                        help="Source SVG file (default: frontend/public/favicon.svg)")
    args = parser.parse_args()

    source_svg = args.source
    if not source_svg.exists():
        print(f"\n❌ Source SVG not found: {source_svg}")
        sys.exit(1)

    print("\n" + "═" * 70)
    print(" 🎨 CRISTI LABS — Presidential Favicon Generator v2.0")
    print("═" * 70)
    print(f"\n📂 Source: {source_svg}")
    print(f"📂 Output: {OUTPUT_DIR}\n")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Generate PNGs
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    print("━━━ PNG Generation ━━━")
    png_paths = {}
    for size in SIZES_PNG:
        output_name = f"favicon-{size}x{size}.png" if size in [16, 32] else f"logo-{size}.png"
        output_path = OUTPUT_DIR / output_name
        svg_to_png(source_svg, output_path, size)
        png_paths[size] = output_path

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Generate .ICO
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    print("\n━━━ ICO Generation ━━━")
    ico_pngs = [png_paths[size] for size in ICO_SIZES if size in png_paths]
    create_ico(ico_pngs, OUTPUT_DIR / "favicon.ico")

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Generate Modern Formats
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    print("\n━━━ Modern Format Generation ━━━")
    create_modern_formats(png_paths[32], OUTPUT_DIR)

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Dark Mode Adaptive SVG
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    create_dark_mode_svg(source_svg, OUTPUT_DIR)

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Test Page
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    create_test_page(OUTPUT_DIR)

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Summary
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    print("\n" + "═" * 70)
    print(" ✅ Generation Complete")
    print("═" * 70)
    print("\n📦 Generated files:")

    generated = [
        "favicon.ico",
        "favicon-16x16.png",
        "favicon-32x32.png",
        "logo-192.png",
        "logo-512.png",
        "favicon-32.webp",
        "favicon-adaptive.svg",
        "favicon-test.html",
    ]

    for filename in generated:
        filepath = OUTPUT_DIR / filename
        if filepath.exists():
            size = filepath.stat().st_size / 1024
            print(f"   ✓ {filename:30} ({size:>6.1f} KB)")

    print("\n🔧 Next steps:")
    print("   1. Run: npm run dev")
    print("   2. Open: http://localhost:5173/favicon-test.html")
    print("   3. Hard refresh: Ctrl + Shift + R (or Cmd + Shift + R)")
    print("   4. Check browser tab for CL monogram icon")
    print("\n")


if __name__ == "__main__":
    main()
