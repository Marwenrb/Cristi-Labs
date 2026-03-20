import { useState, useEffect } from "react";

const DEFAULT_BOTTOM = 32; // bottom-8 = 2rem = 32px
const GAP = 12;            // breathing room above the footer row
const MIN_BOTTOM_MOBILE = 72; // extra clearance so menu btn never overlaps footer text

/**
 * Returns a `bottomPx` value that pushes fixed buttons up
 * whenever the #footer-copyright section enters the viewport.
 *
 * Works with GSAP ScrollSmoother — reads getBoundingClientRect()
 * inside a requestAnimationFrame so the smoothed transform is
 * already applied before we sample the position.
 */
export function useFooterBounds() {
    const [bottomPx, setBottomPx] = useState(DEFAULT_BOTTOM);

    useEffect(() => {
        let rafId = null;
        const isMobile = () => window.innerWidth < 768;

        const readRect = () => {
            const base = isMobile() ? MIN_BOTTOM_MOBILE : DEFAULT_BOTTOM;
            const el = document.getElementById("footer-copyright");
            if (!el) {
                setBottomPx(base);
                return;
            }
            const { top } = el.getBoundingClientRect();
            const overlap = window.innerHeight - top;
            setBottomPx(
                overlap > 0
                    ? base + overlap + GAP
                    : base
            );
        };

        const onScroll = () => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(readRect);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", readRect,  { passive: true });
        readRect();

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", readRect);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    return bottomPx;
}
