# Cristi Labs — Footer Mobile Background Video Generation Brief

> **Asset target**: `frontend/src/assets/Pages Media/Cristi Labs Footer Mobile.mp4` (replacement)
> **Engine**: Google **Veo 3** (preferred) · or Veo 2 · or Runway Gen-3 Alpha
> **Status**: OPTIONAL — current implementation already letterboxes the desktop master cinematically on mobile (no hack, no awkward crop). Generate this asset ONLY if a true edge-to-edge portrait fill is desired.

---

## 1 · Hard Specs (non-negotiable)

| Field            | Value                                                            |
|------------------|------------------------------------------------------------------|
| Aspect ratio     | **9:16** (1080 × 1920) vertical portrait                         |
| Duration         | **8 s** seamless loop (first frame ≡ last frame)                 |
| Frame rate       | 24 fps (cinematic) — never 30/60                                 |
| Color space      | Rec.709, deep blacks crushed to `#0B0B0B`                        |
| Bitrate          | ≥ 8 Mbps H.264 high profile · mp4 container                      |
| Audio            | None (muted background)                                          |
| Motion blur      | Slow-motion 0.25× — every frame intentional                      |

## 2 · Veo 3 Master Prompt (paste verbatim)

```
Cinematic vertical 9:16 slow-motion macro shot, 24fps, ultra-luxurious abstract
tech aesthetic for a Tier-1 venture studio brand. The frame is dominated by deep
obsidian black void (#0B0B0B) with a slow vertical drift of refined liquid gold
filaments — molten 24-carat gold ribbons flowing downward like a Bloomberg
terminal of liquid wealth, captured on a RED Komodo with a 100mm macro probe
lens at T1.4. Subtle anamorphic flares (warm amber, never blue). In the deep
background, out-of-focus silhouettes of global trade infrastructure: cargo ship
hulls passing horizontally, container stack edges, the curved lattice of a
fiber-optic submarine cable — all rendered as soft 3-second-long bokeh shifts.
A single razor-thin gold particle drifts from top-right to bottom-left across
the entire shot, its path traced by a 1px gold filament. The composition
breathes: a slow 12% zoom-in over 8 seconds, ending exactly where it began for
a perfect seamless loop. Lighting is single-source, top-left, warm 2700K
practical, with deep crushed shadows. Color palette: 92% obsidian black, 6%
refined gold (#B8924A → #F0C96B), 2% champagne highlight. Texture: subtle
35mm film grain, zero digital noise. The mood is restrained sovereignty — the
opening shot of a Christopher Nolan / Denis Villeneuve film about global
finance. NO particles floating randomly, NO glowing tech grids, NO blue or
purple, NO stock-footage data streams, NO holograms, NO cliché "cyber" look.
Pure cinematic luxury infrastructure.
```

## 3 · Negative Prompt (Veo 3 supports it)

```
generic floating particles, blue glow, purple neon, cyberpunk, holographic UI,
data visualization overlays, lens flares from below, glitch effects, motion
graphics, low budget, stock footage, fast motion, cuts, transitions, text,
typography, watermark, logo, faces, people, hands, plastic look, CGI sheen,
oversaturation, HDR, vignette burn-in, chromatic aberration, fisheye,
shallow gimmick zoom, particles converging to a center point
```

## 4 · Reference Mood Board (for human reviewer)

- Apollo cinematic intro — black & gold mineral textures
- Apple "Shot on iPhone — Liquid Gold" b-roll
- Maersk corporate teaser — slow shipyard parallax
- Bloomberg Originals open titles — vertical capital flow

## 5 · Acceptance Criteria — REJECT IF ANY FAIL

- [ ] Looks like a multi-million-dollar cinematic production at first glance
- [ ] First and last frame are pixel-identical (true seamless loop)
- [ ] Zero "AI tell" — no morphing artifacts, no warping, no shimmer
- [ ] No identifiable faces, logos, or copyrighted infrastructure
- [ ] Plays beautifully BEHIND white & gold text without competing
- [ ] Mobile Safari iOS — autoplays muted inline at < 200 KB/s sustained

---

## 6 · Drop-in Integration

Once the asset is approved, place it at:
```
frontend/src/assets/Pages Media/Cristi Labs Footer Mobile.mp4
```

Then update `Footer.jsx`:

```jsx
import footerVideo        from "../../assets/Pages Media/Cristi Labs Official Footer 1.mp4";
import footerVideoMobile  from "../../assets/Pages Media/Cristi Labs Footer Mobile.mp4";

// ...inside the component...
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches
  );
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return isMobile;
};

const isMobile = useIsMobile();

<video
  key={isMobile ? "m" : "d"}        // forces clean remount on breakpoint flip
  src={isMobile ? footerVideoMobile : footerVideo}
  autoPlay loop muted playsInline preload="auto" disablePictureInPicture
  className="footer-video-bg absolute inset-0 w-full h-full object-cover -z-20 pointer-events-none"
/>
```

And in `footer.css`, **delete** the `.footer-video-bg` mobile override block
(the letterbox geometry) since the new 9:16 asset will fill natively via
`object-cover`. Keep the `.footer-video-mask` rules — they remain a subtle
luxury frame that softens the top/bottom seam.

---

**Engineered by Cristi Labs Engineering · Sheridan, WY**
