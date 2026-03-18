import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const initLenis = () => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: true,
        touchMultiplier: 1.5,
    });

    // Keep GSAP ScrollTrigger in sync with Lenis scroll position
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis via GSAP ticker for perfect animation sync
    const gsapRaf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(gsapRaf);
    gsap.ticker.lagSmoothing(0);

    lenis._cleanup = () => gsap.ticker.remove(gsapRaf);

    return lenis;
};
