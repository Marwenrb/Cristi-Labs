import { useState, useEffect } from "react";

/**
 * Returns true when the footer-reveal-wrapper enters the viewport,
 * signaling fixed UI elements (Logo, Connect btn) to fade out.
 *
 * Uses IntersectionObserver for zero scroll-listener overhead.
 */
export function useHideNearFooter() {
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        const footer = document.querySelector(".footer-reveal-wrapper");
        if (!footer) return;

        const observer = new IntersectionObserver(
            ([entry]) => setHidden(entry.isIntersecting),
            { threshold: 0.05 }
        );

        observer.observe(footer);
        return () => observer.disconnect();
    }, []);

    return hidden;
}
