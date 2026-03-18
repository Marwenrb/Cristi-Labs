import { useLayoutEffect, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollSmoother } from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    // Prevent browser from restoring scroll position automatically
    useEffect(() => {
        if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
    }, []);

    // Force top before paint on every route change
    useLayoutEffect(() => {
        const smoother = ScrollSmoother.get();

        if (smoother) {
            // Jump to the very top with no inertia
            smoother.scrollTo(0, false);
            // Make sure internal measurements update
            smoother.refresh();
        } else {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }

        // In the next frame, refresh ScrollTrigger to pin to the new top
        requestAnimationFrame(() => {
            ScrollTrigger.refresh();
        });
    }, [pathname]);

    return null;
}
