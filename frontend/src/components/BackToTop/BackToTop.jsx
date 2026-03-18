import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import { ScrollTrigger, ScrollSmoother } from "gsap/all";
import { useFooterBounds } from "../../hooks/useFooterBounds";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

/* ─────────────────────────────────────────────────────────────────
 *  Ring geometry
 *  SVG canvas: 64 × 64   Ring centre: 32 32   Radius: 27
 *  Stroke 2.5 → outer edge lands at 28.75 px — comfortably inside
 * ───────────────────────────────────────────────────────────────── */
const R          = 27;
const CIRCUM     = 2 * Math.PI * R;        // ≈ 169.6
const SCROLL_THR = 400;                     // px before button appears

/* ─────────────────────────────────────────────────────────────────
 *  BackToTop
 *  Fixed bottom-right, stays clear of the bottom-center nav pill.
 *  Layout:
 *    [container 64×64]
 *      [svg: progress ring, absolute inset-0]
 *      [glass pill 48×48, z-10, overflow-hidden]
 *        [glow pulse layer]
 *        [arrow icon — warp animates through overflow clip]
 * ───────────────────────────────────────────────────────────────── */
const BackToTop = () => {
    const containerRef = useRef(null);
    const btnRef       = useRef(null);
    const arrowRef     = useRef(null);
    const glowRef      = useRef(null);

    const [progress, setProgress] = useState(0);
    const [visible,  setVisible]  = useState(false);
    const prevVisible              = useRef(false);
    const bottomPx                 = useFooterBounds();

    /* ── 1. Scroll position tracker ───────────────────────────── */
    useEffect(() => {
        const onScroll = () => {
            const y   = window.scrollY;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const p   = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;

            setProgress(p);

            const shouldShow = y > SCROLL_THR;
            if (shouldShow !== prevVisible.current) {
                prevVisible.current = shouldShow;
                setVisible(shouldShow);
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* ── 2. Pin to scale(0) before first paint ─────────────────── */
    useGSAP(() => {
        gsap.set(containerRef.current, { scale: 0, opacity: 0 });
    }, []);

    /* ── 3. Show / hide — elastic spring entrance ─────────────── */
    useGSAP(() => {
        const el = containerRef.current;
        if (!el) return;
        gsap.killTweensOf(el);

        if (visible) {
            gsap.fromTo(
                el,
                { scale: 0, opacity: 0, rotate: -20 },
                {
                    scale:    1,
                    opacity:  1,
                    rotate:   0,
                    duration: 0.8,
                    ease:     "elastic.out(1, 0.52)",
                }
            );
        } else {
            gsap.to(el, {
                scale:    0,
                opacity:  0,
                rotate:   15,
                duration: 0.3,
                ease:     "back.in(2)",
            });
        }
    }, [visible]);

    /* ── 4. Inner glow — continuous pulse ─────────────────────── */
    useGSAP(() => {
        if (!glowRef.current) return;
        gsap.to(glowRef.current, {
            opacity:  1,
            scale:    1.25,
            duration: 1.6,
            ease:     "sine.inOut",
            yoyo:     true,
            repeat:   -1,
        });
    }, []);

    /* ── 5. Magnetic hover + glitch on mouseenter ─────────────── */
    useEffect(() => {
        const btn = btnRef.current;
        if (!btn) return;

        /* glitch: rapid skew / translate burst */
        const onEnter = () => {
            gsap.timeline({ defaults: { ease: "none" } })
                .to(btn, { skewX: -6,  x: -3,  duration: 0.05 })
                .to(btn, { skewX:  5,  x:  4,  duration: 0.05 })
                .to(btn, { skewX: -2,  x: -2,  duration: 0.04 })
                .to(btn, { skewX:  1,  x:  1,  duration: 0.04 })
                .to(btn, { skewX:  0,  x:  0,  duration: 0.08, ease: "power1.out" });
        };

        /* magnetic: cursor pulls the button slightly */
        const onMove = (e) => {
            const r = btn.getBoundingClientRect();
            gsap.to(btn, {
                x:        (e.clientX - r.left - r.width  / 2) * 0.28,
                y:        (e.clientY - r.top  - r.height / 2) * 0.28,
                duration: 0.35,
                ease:     "power2.out",
            });
        };

        /* elastic snap back */
        const onLeave = () => {
            gsap.to(btn, {
                x: 0, y: 0, skewX: 0,
                duration: 0.7,
                ease:     "elastic.out(1, 0.35)",
            });
        };

        btn.addEventListener("mouseenter", onEnter);
        btn.addEventListener("mousemove",  onMove);
        btn.addEventListener("mouseleave", onLeave);
        return () => {
            btn.removeEventListener("mouseenter", onEnter);
            btn.removeEventListener("mousemove",  onMove);
            btn.removeEventListener("mouseleave", onLeave);
        };
    }, []);

    /* ── 6. Click: warp arrow + smooth scroll to top ──────────── */
    const handleClick = () => {
        const arrow = arrowRef.current;
        if (!arrow) return;

        /* Warp:  shoot up  →  teleport below  →  fly back in */
        gsap.timeline()
            .to(arrow,  { y: -44, opacity: 0, duration: 0.22, ease: "power3.in"  })
            .set(arrow, { y:  44 })
            .to(arrow,  { y:   0, opacity: 1, duration: 0.32, ease: "power3.out" });

        /* ScrollSmoother for buttery scroll — fallback to native */
        const smoother = ScrollSmoother.get();
        if (smoother) {
            smoother.scrollTo(0, true);
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    /* Derived ring value — dashoffset decreases as user scrolls */
    const dashOffset = CIRCUM * (1 - progress);

    /* ── Render ────────────────────────────────────────────────── */
    return (
        <div
            ref={containerRef}
            className="fixed right-8 z-[200] will-change-transform"
            style={{ opacity: 0, bottom: `${bottomPx}px`, transition: "bottom 0.35s ease" }}
        >
            {/* ── Outer hit-target & layout box (64 × 64) ── */}
            <button
                ref={btnRef}
                onClick={handleClick}
                aria-label="Back to top"
                className="
                    relative flex items-center justify-center
                    w-16 h-16 cursor-pointer will-change-transform
                    focus:outline-none focus-visible:ring-2
                    focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2
                    focus-visible:ring-offset-[var(--bg-void)]
                "
                style={{ background: "none", border: "none" }}
            >

                {/* ──────────── SVG Progress Ring ──────────── */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 64 64"
                    aria-hidden="true"
                    style={{ transform: "rotate(-90deg)" }}
                >
                    {/* Dim track */}
                    <circle
                        cx="32" cy="32" r={R}
                        fill="none"
                        stroke="transparent"
                        strokeWidth="1.5"
                    />
                    {/* Glowing progress arc */}
                    <circle
                        cx="32" cy="32" r={R}
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray={CIRCUM}
                        strokeDashoffset={dashOffset}
                        style={{
                            filter:     "drop-shadow(0 0 3px rgba(184,146,74,0.9)) drop-shadow(0 0 8px rgba(184,146,74,0.5)) drop-shadow(0 0 16px rgba(184,146,74,0.25))",
                            transition: "stroke-dashoffset 0.08s linear",
                        }}
                    />
                    {/* Bright leading dot at arc tip */}
                    {progress > 0.01 && (
                        <circle
                            cx={32 + R * Math.cos(progress * 2 * Math.PI)}
                            cy={32 + R * Math.sin(progress * 2 * Math.PI)}
                            r="2.5"
                            fill="var(--accent)"
                            style={{ filter: "drop-shadow(0 0 5px rgba(184,146,74,0.9))" }}
                        />
                    )}
                </svg>

                {/* ──────── Glassmorphism button body (48 × 48) ──────── */}
                <div
                    className="
                        relative z-10 w-12 h-12 rounded-full
                        flex items-center justify-center overflow-hidden
                    "
                    style={{
                        background: "linear-gradient(145deg, rgba(184,146,74,0.10) 0%, rgba(11,11,11,0.93) 52%)",
                        backdropFilter:       "blur(20px) saturate(1.9)",
                        WebkitBackdropFilter: "blur(20px) saturate(1.9)",
                        border:    "1px solid rgba(184,146,74,0.40)",
                        boxShadow: [
                            "0 0  18px rgba(184,146,74,0.18)",
                            "0 0  40px rgba(184,146,74,0.08)",
                            "inset 0 1px 0 rgba(255,255,255,0.07)",
                            "inset 0 -1px 0 rgba(184,146,74,0.06)",
                            "0 8px 28px rgba(0,0,0,0.55)",
                        ].join(", "),
                    }}
                >
                    {/* Radial glow pulse — reacts to scroll  */}
                    <div
                        ref={glowRef}
                        className="absolute inset-0 rounded-full pointer-events-none"
                        aria-hidden="true"
                        style={{
                            background: "radial-gradient(circle at 50% 38%, rgba(184,146,74,0.22) 0%, transparent 68%)",
                            opacity:    0.35,
                        }}
                    />

                    {/* Top edge specular highlight */}
                    <div
                        className="absolute top-0 left-0 right-0 h-px rounded-t-full pointer-events-none"
                        aria-hidden="true"
                        style={{
                            background: "linear-gradient(90deg, transparent 10%, rgba(184,146,74,0.50) 50%, transparent 90%)",
                        }}
                    />

                    {/* ── Arrow icon — warp travels through overflow clip ── */}
                    <div
                        ref={arrowRef}
                        className="relative z-10 flex items-center justify-center w-5 h-5"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--accent)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="20"
                            height="20"
                            aria-hidden="true"
                            style={{
                                filter: [
                                    "drop-shadow(0 0 3px rgba(184,146,74,0.95))",
                                    "drop-shadow(0 0 7px rgba(184,146,74,0.6))",
                                ].join(" "),
                            }}
                        >
                            <path d="M12 19V5"    />
                            <path d="M5 12l7-7 7 7" />
                        </svg>
                    </div>
                </div>
            </button>
        </div>
    );
};

export default BackToTop;
