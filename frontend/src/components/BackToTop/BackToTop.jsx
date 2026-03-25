import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/all";
import { useFooterBounds } from "../../hooks/useFooterBounds";

/* ─────────────────────────────────────────────────────────────────
 *  BackToTop
 *  Vertical ticker-tape — fixed bottom-right, above footer/nav.
 *  Progress line + rotated "RETURN" label + brass dot.
 *  Appears after 40 % of the page has been scrolled.
 *  Works on both desktop (ScrollSmoother) and mobile (Lenis/native).
 * ───────────────────────────────────────────────────────────────── */
const BackToTop = () => {
    const containerRef = useRef(null);
    const [visible,    setVisible]    = useState(false);
    const [nearBottom, setNearBottom] = useState(false);
    const [progress, setProgress] = useState(0);
    const bottomPx = useFooterBounds();

    /* ── 1. Scroll tracker (desktop + mobile unified) ───────────── */
    useEffect(() => {
        const update = () => {
            const smoother = window.__smoother;
            const scrollY  = smoother ? smoother.scrollTop() : window.scrollY;
            const contentEl = document.querySelector("#smooth-content");
            const totalHeight = smoother && contentEl
                ? contentEl.scrollHeight - window.innerHeight
                : document.documentElement.scrollHeight - window.innerHeight;
            const total = Math.max(totalHeight, 1);
            const pct   = Math.min(1, scrollY / total);

            setProgress(pct);
            setVisible(scrollY > window.innerHeight * 0.4);
        };

        // Native scroll event (fires on both desktop + mobile)
        window.addEventListener("scroll", update, { passive: true });

        // Also hook into GSAP ticker for ScrollSmoother sync
        gsap.ticker.add(update);
        update();

        return () => {
            window.removeEventListener("scroll", update);
            gsap.ticker.remove(update);
        };
    }, []);

    /* ── 2. Hide when within 180px of the page bottom ──────────── */
    useEffect(() => {
        const checkScroll = () => {
            const scrolled = window.scrollY;
            const total    = document.documentElement.scrollHeight;
            const viewH    = window.innerHeight;
            setNearBottom(total - scrolled - viewH < 180);
        };
        window.addEventListener('scroll', checkScroll, { passive: true });
        checkScroll();
        return () => window.removeEventListener('scroll', checkScroll);
    }, []);

    /* ── 3. Fade in / out ──────────────────────────────────────── */
    useEffect(() => {
        if (!containerRef.current) return;
        const show = visible && !nearBottom;
        gsap.to(containerRef.current, {
            opacity:  show ? 1 : 0,
            duration: 0.4,
            ease:     "power3.out",
        });
    }, [visible, nearBottom]);

    /* ── 4. Click — scroll to top ──────────────────────────────── */
    const handleClick = () => {
        const smoother = ScrollSmoother.get();
        if (smoother) {
            smoother.scrollTo(0, true);
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div
            ref={containerRef}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            aria-label="Back to top"
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
            style={{
                position:      "fixed",
                right:         "clamp(16px, 4vw, 40px)",
                bottom:        "16px",
                transform:     `translateY(${-(bottomPx)}px)`,
                transition:    "transform 0.35s ease",
                zIndex:        90,
                opacity:       0,
                cursor:        "pointer",
                display:       "flex",
                flexDirection: "column",
                alignItems:    "center",
                gap:           "10px",
                userSelect:    "none",
            }}
        >
            {/* Progress track — vertical 1 px line */}
            <div style={{
                width:    "1px",
                height:   "44px",
                background: "var(--border)",
                position: "relative",
                overflow: "hidden",
            }}>
                <div style={{
                    position:   "absolute",
                    bottom:     0,
                    left:       0,
                    width:      "100%",
                    height:     "100%",
                    background: "var(--accent)",
                    transform:  `scaleY(${progress})`,
                    transformOrigin: "bottom",
                    transition: "transform 0.1s linear",
                }} />
            </div>

            {/* Label — vertical monospace, reads bottom-up */}
            <div
                style={{
                    fontFamily:  "var(--font-mono)",
                    fontSize:    "7px",
                    letterSpacing: "3px",
                    color:       "var(--text-secondary)",
                    textTransform: "uppercase",
                    writingMode: "vertical-rl",
                    transform:   "rotate(180deg)",
                    height:      "52px",
                    display:     "flex",
                    alignItems:  "center",
                    transition:  "color var(--duration-mid) var(--ease-out-expo)",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; }}
            >
                RETURN
            </div>

            {/* Brass dot */}
            <div
                style={{
                    width:        "5px",
                    height:       "5px",
                    borderRadius: "50%",
                    background:   "var(--accent)",
                    boxShadow:    "0 0 8px var(--accent-glow)",
                    transition:   "transform var(--duration-fast)",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.8)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
            />
        </div>
    );
};

export default BackToTop;
