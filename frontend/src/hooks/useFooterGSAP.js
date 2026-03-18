/**
 * useFooterGSAP — GSAP animation logic for the Cristi Labs immersive footer.
 * Handles: pinned reveal, magnetic link interactions, and ScrollTrigger cleanup.
 *
 * Fluid Interface: Animations are scrub-linked to scroll and pointer position,
 * creating a continuous, responsive feel that responds to user intent rather
 * than discrete state changes.
 */
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const MAGNETIC_STRENGTH = 0.12;
const MAGNETIC_RADIUS = 50;

export function useFooterGSAP() {
    const footerRevealRef = useRef(null);
    const footerInnerRef = useRef(null);
    const linkRefs = useRef([]);


    useGSAP(
        () => {
            const triggerEl = footerRevealRef.current;
            const footerEl = footerInnerRef.current;
            if (!triggerEl || !footerEl) return;

            // 1. Kinetic Footer Reveal — pinned section where footer slides in from below
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: triggerEl,
                    start: "top bottom",
                    end: "bottom bottom",
                    scrub: 1.2,
                    pin: true,
                    anticipatePin: 1,
                },
            });

            tl.fromTo(
                footerEl,
                { yPercent: 100 },
                { yPercent: 0, ease: "power3.out" }
            );

            const scrollTriggerInstance = tl.scrollTrigger;

            // 2. Magnetic hover for footer links
            const links = linkRefs.current.filter(Boolean);
            const listenerCleanups = [];

            links.forEach((link) => {
                if (!link) return;

                const xTo = gsap.quickTo(link, "x", {
                    duration: 0.4,
                    ease: "power2.out",
                });
                const yTo = gsap.quickTo(link, "y", {
                    duration: 0.4,
                    ease: "power2.out",
                });

                const handleMouseMove = (e) => {
                    const rect = link.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const dx = e.clientX - centerX;
                    const dy = e.clientY - centerY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < MAGNETIC_RADIUS) {
                        const strength =
                            (1 - distance / MAGNETIC_RADIUS) * MAGNETIC_STRENGTH;
                        xTo(dx * strength);
                        yTo(dy * strength);
                    } else {
                        xTo(0);
                        yTo(0);
                    }
                };

                const handleMouseLeave = () => {
                    xTo(0);
                    yTo(0);
                };

                link.addEventListener("mousemove", handleMouseMove);
                link.addEventListener("mouseleave", handleMouseLeave);
                listenerCleanups.push(() => {
                    link.removeEventListener("mousemove", handleMouseMove);
                    link.removeEventListener("mouseleave", handleMouseLeave);
                });
            });

            // Cleanup: kill ScrollTrigger and remove magnetic listeners
            return () => {
                scrollTriggerInstance.kill();
                listenerCleanups.forEach((cleanup) => cleanup());
            };
        },
        { scope: footerRevealRef, dependencies: [] }
    );

    return {
        footerRevealRef,
        footerInnerRef,
        linkRefs,
    };
}
