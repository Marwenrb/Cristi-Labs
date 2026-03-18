import { useState, useEffect } from "react";

const DEFAULT_BOTTOM = 32; // bottom-8 = 2rem = 32px
const GAP = 12;            // breathing room above the footer row

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

        const readRect = () => {
            const el = document.getElementById("footer-copyright");
            if (!el) {
                setBottomPx(DEFAULT_BOTTOM);
                return;
            }
            const { top } = el.getBoundingClientRect();
            const overlap = window.innerHeight - top;
            setBottomPx(
                overlap > 0
                    ? DEFAULT_BOTTOM + overlap + GAP
                    : DEFAULT_BOTTOM
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
