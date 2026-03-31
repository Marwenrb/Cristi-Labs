import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import { waitForFonts } from "../../lib/fontLoader";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ═══════════════════════════════════════════════════════════════
 *  FooterBrand — SOVEREIGN SIGNATURE CARD v5
 *  Next-level: ambient particle field, scroll-parallax layers,
 *  ink-bleed draw-on, pulsing glow, interactive tilt, live shimmer
 * ═══════════════════════════════════════════════════════════════ */

const PARTICLE_COUNT = 18;

const FooterBrand = () => {
    const brandRef = useRef(null);
    const taglineRef = useRef(null);
    const sigRef = useRef(null);
    const cardRef = useRef(null);
    const particleCanvasRef = useRef(null);
    const hasAnimatedRef = useRef(false);
    const tiltRAF = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    /* ── Ambient particle field — gold dust ─────────────────── */
    useEffect(() => {
        const canvas = particleCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animId;
        let particles = [];

        const resize = () => {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        resize();

        // Seed particles
        const w = () => canvas.width / window.devicePixelRatio;
        const h = () => canvas.height / window.devicePixelRatio;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * 600,
                y: Math.random() * 300,
                r: Math.random() * 1.2 + 0.3,
                vx: (Math.random() - 0.5) * 0.15,
                vy: (Math.random() - 0.5) * 0.1,
                alpha: Math.random() * 0.35 + 0.05,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.008 + 0.004,
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, w(), h());
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.pulse += p.pulseSpeed;

                // Wrap
                if (p.x < -5) p.x = w() + 5;
                if (p.x > w() + 5) p.x = -5;
                if (p.y < -5) p.y = h() + 5;
                if (p.y > h() + 5) p.y = -5;

                const a = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(201, 168, 76, ${a})`;
                ctx.fill();

                // Glow halo
                if (p.r > 0.8) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(240, 201, 107, ${a * 0.15})`;
                    ctx.fill();
                }
            });
            animId = requestAnimationFrame(draw);
        };

        draw();
        window.addEventListener("resize", resize);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    /* ── Interactive 3D tilt on hover ───────────────────────── */
    useEffect(() => {
        const card = cardRef.current;
        if (!card || window.matchMedia("(pointer: coarse)").matches) return;

        const handleMove = (e) => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);

            cancelAnimationFrame(tiltRAF.current);
            tiltRAF.current = requestAnimationFrame(() => {
                card.style.transform = `perspective(800px) rotateY(${dx * 2.5}deg) rotateX(${-dy * 2}deg)`;
            });
        };

        const handleLeave = () => {
            cancelAnimationFrame(tiltRAF.current);
            card.style.transition = "transform 0.6s cubic-bezier(0.16,1,0.3,1)";
            card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg)";
            setTimeout(() => { card.style.transition = ""; }, 600);
        };

        card.addEventListener("mousemove", handleMove);
        card.addEventListener("mouseleave", handleLeave);
        return () => {
            card.removeEventListener("mousemove", handleMove);
            card.removeEventListener("mouseleave", handleLeave);
            cancelAnimationFrame(tiltRAF.current);
        };
    }, []);

    /* ── GSAP scroll-triggered signature animation ──────────── */
    useEffect(() => {
        const el = brandRef.current;
        if (!el) return;

        const cardEl = cardRef.current;
        const taglineEl = taglineRef.current;
        if (!cardEl || !taglineEl) return;

        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const st = ScrollTrigger.create({
            trigger: cardEl,
            start: "top 92%",
            once: true,
            onEnter: () => {
                if (hasAnimatedRef.current) return;
                hasAnimatedRef.current = true;

                waitForFonts().then(() => {
                    let taglineSplit;
                    try {
                        taglineSplit = new SplitText(taglineEl, {
                            type: "words",
                            wordsClass: "footer-brand-word",
                        });
                    } catch { return; }

                    const words = taglineSplit.words;
                    const watermark = cardEl.querySelector(".footer-brand-watermark");
                    const tier = cardEl.querySelector(".footer-brand-tier");
                    const accent = cardEl.querySelector(".footer-brand-accent");
                    const sigEl = sigRef.current;
                    const shimmer = cardEl.querySelector(".footer-brand-shimmer");
                    const pulseRing = cardEl.querySelector(".footer-brand-pulse-ring");

                    const sigBody = sigEl ? Array.from(sigEl.querySelectorAll(".footer-brand-signature-body")) : [];
                    const sigC = sigEl ? Array.from(sigEl.querySelectorAll(".footer-brand-sig-c")) : [];
                    const sigCEcho = sigEl ? Array.from(sigEl.querySelectorAll(".footer-brand-sig-c-echo")) : [];
                    const sigCGlow = sigEl ? sigEl.querySelector(".footer-brand-sig-c-glow") : null;
                    const sigCDot = sigEl ? sigEl.querySelector(".footer-brand-sig-c-dot") : null;
                    const sigFlourish = sigEl ? Array.from(sigEl.querySelectorAll(".footer-brand-signature-flourish")) : [];
                    const sigText = sigEl ? Array.from(sigEl.querySelectorAll(".footer-brand-sig-text")) : [];
                    const sigR = sigEl ? Array.from(sigEl.querySelectorAll(".footer-brand-sig-r")) : [];
                    const sigRGlow = sigEl ? sigEl.querySelector(".footer-brand-sig-r-glow") : null;

                    // Pre-compute path lengths
                    sigC.forEach((path) => {
                        const len = path.getTotalLength?.() || 120;
                        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
                    });
                    sigCEcho.forEach((path) => {
                        const len = path.getTotalLength?.() || 110;
                        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
                    });
                    sigR.forEach((path) => {
                        const len = path.getTotalLength?.() || 80;
                        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
                    });
                    sigBody.forEach((path) => {
                        const len = path.getTotalLength?.() || 60;
                        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
                    });
                    sigFlourish.forEach((path) => {
                        const len = path.getTotalLength?.() || 340;
                        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
                    });

                    // Reduced motion — instant reveal
                    if (prefersReduced) {
                        gsap.set(words, { opacity: 1, y: 0 });
                        watermark && gsap.set(watermark, { opacity: 0.045 });
                        tier && gsap.set(tier, { opacity: 1 });
                        accent && gsap.set(accent, { scaleX: 1 });
                        if (sigEl) {
                            gsap.set(sigEl, { opacity: 1 });
                            sigC.forEach((p) => gsap.set(p, { strokeDashoffset: 0 }));
                            sigCEcho.forEach((p) => gsap.set(p, { strokeDashoffset: 0 }));
                            sigCGlow && gsap.set(sigCGlow, { opacity: 1 });
                            sigCDot && gsap.set(sigCDot, { opacity: 1 });
                            sigR.forEach((p) => gsap.set(p, { strokeDashoffset: 0 }));
                            sigRGlow && gsap.set(sigRGlow, { opacity: 1 });
                            sigBody.forEach((p) => gsap.set(p, { strokeDashoffset: 0 }));
                            sigFlourish.forEach((p) => gsap.set(p, { strokeDashoffset: 0 }));
                            sigText.forEach((el) => gsap.set(el, { opacity: 1 }));
                        }
                        shimmer && gsap.set(shimmer, { opacity: 1 });
                        pulseRing && gsap.set(pulseRing, { opacity: 1 });
                        cardEl.classList.add("is-revealed");
                        return;
                    }

                    // ── Initial states ──
                    gsap.set(words, { opacity: 0, y: 8 });
                    watermark && gsap.set(watermark, { opacity: 0 });
                    tier && gsap.set(tier, { opacity: 0 });
                    accent && gsap.set(accent, { scaleX: 0 });

                    const tl = gsap.timeline();

                    // 0.0s — Card structure reveal
                    tl.call(() => { cardEl.classList.add("is-revealed"); }, null, 0);

                    // 0.0s — Watermark drifts in
                    if (watermark) {
                        tl.to(watermark, { opacity: 0.045, duration: 1.6, ease: "power2.out" }, 0);
                    }

                    // 0.2s — Tier label appears
                    if (tier) {
                        tl.to(tier, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0.2);
                    }

                    // 0.4s — Signature draw (staged: C → r → L)
                    const hasSig = sigEl && (sigC.length > 0 || sigBody.length > 0 || sigFlourish.length > 0);
                    if (hasSig) {
                        tl.set(sigEl, { opacity: 1 }, 0.4);

                        // STAGE 1: "C" draws
                        if (sigC.length > 0) {
                            tl.to(sigC, { strokeDashoffset: 0, duration: 1.2, ease: "power4.inOut" }, 0.4);
                        }
                        if (sigCEcho.length > 0) {
                            tl.to(sigCEcho, { strokeDashoffset: 0, duration: 1.0, ease: "power3.inOut" }, 0.65);
                        }
                        if (sigCGlow) {
                            tl.to(sigCGlow, { opacity: 1, duration: 0.8, ease: "power2.out" }, 0.8);
                        }
                        if (sigCDot) {
                            tl.to(sigCDot, { opacity: 0.9, duration: 0.3, ease: "power2.out" }, 1.5);
                        }

                        // STAGE 1.5: "r" draws
                        if (sigR.length > 0) {
                            tl.to(sigR, { strokeDashoffset: 0, duration: 0.9, ease: "power3.inOut" }, 1.3);
                        }
                        if (sigRGlow) {
                            tl.to(sigRGlow, { opacity: 1, duration: 0.7, ease: "power2.out" }, 1.4);
                        }

                        // STAGE 2: "L" draws
                        if (sigBody.length > 0) {
                            tl.to(sigBody, { strokeDashoffset: 0, duration: 1.0, ease: "power3.inOut" }, 1.8);
                        }

                        // STAGE 3: Text + flourish
                        if (sigText.length > 0) {
                            tl.to(sigText, { opacity: 1, duration: 0.7, ease: "power2.out" }, 2.5);
                        }
                        if (sigFlourish.length > 0) {
                            tl.to(sigFlourish, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, 2.1);

                            // Wet-ink shimmer flash
                            tl.to(sigEl, {
                                filter: "brightness(1.6) drop-shadow(0 0 12px rgba(248,228,165,0.65))",
                                duration: 0.3, ease: "power2.out",
                            }, 3.1);
                            tl.to(sigEl, {
                                filter: "brightness(1) drop-shadow(0 0 2px rgba(201,168,76,0.15))",
                                duration: 0.9, ease: "sine.inOut",
                            }, ">");
                        }
                    }

                    // 1.8s — shimmer sweep activates
                    if (shimmer) {
                        tl.to(shimmer, { opacity: 1, duration: 0.01 }, 1.8);
                    }

                    // 2.0s — pulse ring activates
                    if (pulseRing) {
                        tl.to(pulseRing, { opacity: 1, duration: 0.5, ease: "power2.out" }, 2.8);
                    }

                    // 1.9s — Tagline words drift up
                    tl.to(words, {
                        opacity: 1, y: 0, duration: 0.55,
                        ease: "power3.out", stagger: 0.09,
                    }, 1.9);

                    // 2.1s — Accent line sweeps
                    if (accent) {
                        tl.to(accent, { scaleX: 1, duration: 1, ease: "power3.inOut" }, 2.1);
                    }
                }); // end waitForFonts
            },
        });

        return () => { st && st.kill(); };
    }, []);

    /* ── Scroll-driven parallax for signature layers ────────── */
    useEffect(() => {
        const cardEl = cardRef.current;
        const sigEl = sigRef.current;
        if (!cardEl || !sigEl || window.innerWidth < 768) return;

        const parallaxST = ScrollTrigger.create({
            trigger: cardEl,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
            onUpdate: (self) => {
                const p = self.progress;
                const watermark = cardEl.querySelector(".footer-brand-watermark");
                if (watermark) {
                    watermark.style.transform = `translateY(${-50 + (p - 0.5) * 15}%) translateX(${(p - 0.5) * 8}px)`;
                }
                // Subtle signature drift
                sigEl.style.transform = `translateY(${(p - 0.5) * -6}px)`;
            },
        });

        return () => parallaxST.kill();
    }, []);

    return (
        <div ref={brandRef} className="footer-brand">
            <div ref={cardRef} className="footer-brand-card">
                {/* Ambient particle canvas */}
                <canvas
                    ref={particleCanvasRef}
                    className="footer-brand-particles"
                    aria-hidden="true"
                />

                {/* Shimmer sweep — diagonal light sweep on reveal */}
                <div className="footer-brand-shimmer" aria-hidden="true" />

                {/* Pulsing perimeter ring */}
                <div className="footer-brand-pulse-ring" aria-hidden="true" />

                {/* Sovereign watermark — faint CL monogram */}
                <div className="footer-brand-watermark" aria-hidden="true">CL</div>

                {/* Classification tier badge */}
                <div className="footer-brand-tier" aria-hidden="true">
                    <span className="footer-brand-tier-dot" />
                    <span>EST. 2026</span>
                    <span style={{ opacity: 0.3 }}>&middot;</span>
                    <span>SHERIDAN, WYOMING</span>
                    <span style={{ opacity: 0.3 }}>&middot;</span>
                    <span>USA</span>
                </div>

                {/* CL monogram + CRISTI LABS text — the brand signature */}
                <svg
                    ref={sigRef}
                    className="footer-brand-signature"
                    viewBox="0 0 430 100"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                        filter: isHovered
                            ? "brightness(1.25) drop-shadow(0 0 18px rgba(248,228,165,0.45))"
                            : undefined,
                    }}
                >
                    <defs>
                        <linearGradient id="fbsig-ink" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%"   stopColor="#F8E4A5" stopOpacity="0.98" />
                            <stop offset="25%"  stopColor="#C9A84C" stopOpacity="0.92" />
                            <stop offset="60%"  stopColor="#B8924A" stopOpacity="0.78" />
                            <stop offset="100%" stopColor="#7A5F2E" stopOpacity="0.55" />
                        </linearGradient>
                        <linearGradient id="fbsig-mark" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%"   stopColor="#F0C96B" stopOpacity="0.95" />
                            <stop offset="50%"  stopColor="#C9A84C" stopOpacity="0.85" />
                            <stop offset="100%" stopColor="#9A7A3E" stopOpacity="0.65" />
                        </linearGradient>
                        <linearGradient id="fbsig-c-main" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%"   stopColor="#FFFAF0" stopOpacity="1.0" />
                            <stop offset="15%"  stopColor="#FFE8A0" stopOpacity="0.98" />
                            <stop offset="45%"  stopColor="#F0C96B" stopOpacity="0.95" />
                            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.85" />
                        </linearGradient>
                        <linearGradient id="fbsig-c-echo" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%"   stopColor="#FFE8A0" stopOpacity="0.50" />
                            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.20" />
                        </linearGradient>
                        <radialGradient id="fbsig-c-glow" cx="42" cy="44" r="36" gradientUnits="userSpaceOnUse">
                            <stop offset="0%"   stopColor="#FFE8A0" stopOpacity="0.30" />
                            <stop offset="40%"  stopColor="#F0C96B" stopOpacity="0.12" />
                            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient id="fbsig-r-glow" cx="75" cy="44" r="30" gradientUnits="userSpaceOnUse">
                            <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.18" />
                            <stop offset="50%"  stopColor="#F8F0E0" stopOpacity="0.06" />
                            <stop offset="100%" stopColor="#F8F0E0" stopOpacity="0" />
                        </radialGradient>
                        <filter id="fbsig-r-blur" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" />
                        </filter>
                        <linearGradient id="fbsig-flourish" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stopColor="#C9A84C" stopOpacity="0.80" />
                            <stop offset="55%"  stopColor="#9A7530" stopOpacity="0.38" />
                            <stop offset="100%" stopColor="#7A6230" stopOpacity="0.06" />
                        </linearGradient>
                        <linearGradient id="fbsig-text" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stopColor="#F0D080" stopOpacity="0.90" />
                            <stop offset="40%"  stopColor="#C9A84C" stopOpacity="0.80" />
                            <stop offset="100%" stopColor="#9A7A3E" stopOpacity="0.55" />
                        </linearGradient>
                        <filter id="fbsig-c-blur" x="-40%" y="-40%" width="180%" height="180%">
                            <feGaussianBlur stdDeviation="5" />
                        </filter>
                        <linearGradient id="fbsig-r" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="1.0" />
                            <stop offset="40%"  stopColor="#FFFFFF" stopOpacity="0.95" />
                            <stop offset="70%"  stopColor="#F5ECD5" stopOpacity="0.88" />
                            <stop offset="100%" stopColor="#E0C880" stopOpacity="0.72" />
                        </linearGradient>
                        <linearGradient id="fbsig-cristi" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="1.0" />
                            <stop offset="25%"  stopColor="#FFF8E8" stopOpacity="0.98" />
                            <stop offset="50%"  stopColor="#FFE8A0" stopOpacity="0.95" />
                            <stop offset="80%"  stopColor="#F0C96B" stopOpacity="0.90" />
                            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.85" />
                        </linearGradient>
                    </defs>

                    {/* C — Layer 0: Glow halo */}
                    <circle
                        className="footer-brand-sig-c-glow"
                        cx="42" cy="44" r="34"
                        fill="url(#fbsig-c-glow)"
                        filter="url(#fbsig-c-blur)"
                        opacity="0"
                    />

                    {/* C — Layer 1: Main arc */}
                    <path
                        className="footer-brand-sig-c"
                        d="M 56,16 C 50,14 42,14 36,18 C 26,24 21,35 22,47 C 23,59 31,68 42,71 C 52,74 61,70 66,63"
                        fill="none" stroke="url(#fbsig-c-main)"
                        strokeWidth="3.4" strokeLinecap="round"
                        style={{ strokeDasharray: "120px", strokeDashoffset: "0px" }}
                    />

                    {/* C — Layer 2: Inner echo arc */}
                    <path
                        className="footer-brand-sig-c-echo"
                        d="M 54,19 C 49,17 42,17 37,21 C 29,26 25,36 26,46 C 27,56 33,64 42,67 C 50,69 57,66 61,61"
                        fill="none" stroke="url(#fbsig-c-echo)"
                        strokeWidth="1.2" strokeLinecap="round"
                        style={{ strokeDasharray: "110px", strokeDashoffset: "0px" }}
                    />

                    {/* C — Dot accent */}
                    <circle
                        className="footer-brand-sig-c-dot"
                        cx="57" cy="15" r="2.0"
                        fill="url(#fbsig-c-main)" opacity="0"
                    />

                    {/* C — Fine serif */}
                    <path
                        className="footer-brand-sig-c"
                        d="M 50,14 L 60,14"
                        fill="none" stroke="url(#fbsig-c-main)"
                        strokeWidth="1.5" strokeLinecap="round" opacity="0.75"
                        style={{ strokeDasharray: "12px", strokeDashoffset: "0px" }}
                    />

                    {/* r — White glow halo */}
                    <circle
                        className="footer-brand-sig-r-glow"
                        cx="75" cy="44" r="28"
                        fill="url(#fbsig-r-glow)"
                        filter="url(#fbsig-r-blur)"
                        opacity="0"
                    />

                    {/* r — Full stem + arm + pen loop */}
                    <path
                        className="footer-brand-sig-r"
                        d="M 62,72 L 62,22 C 62,16 66,12 72,12 C 78,12 82,15 85,20 C 88,25 89,32 88,38 C 87,44 84,48 80,50 C 76,52 74,56 75,61 C 76,66 80,68 86,67 C 90,66 93,63 95,59 C 97,55 100,53 101,56 C 102,60 100,64 96,65 C 92,66 90,63 92,60"
                        fill="none" stroke="#FFFFFF"
                        strokeWidth="3.0" strokeLinecap="round" strokeLinejoin="round" opacity="0.95"
                    />

                    {/* r — Signature slash */}
                    <path
                        className="footer-brand-sig-r"
                        d="M 93,62 C 100,58 110,53 122,50 C 130,48 136,48 138,50 C 140,52 139,54 136,55"
                        fill="none" stroke="#FFFFFF"
                        strokeWidth="1.6" strokeLinecap="round" opacity="0.65"
                    />

                    {/* r — Signature underline */}
                    <path
                        className="footer-brand-sig-r"
                        d="M 58,76 C 66,75 78,74 90,73 C 96,72.5 100,72 103,71"
                        fill="none" stroke="#FFFFFF"
                        strokeWidth="1.6" strokeLinecap="round" opacity="0.55"
                    />

                    {/* L vertical */}
                    <path
                        className="footer-brand-signature-body"
                        d="M 92,14 L 92,72"
                        fill="none" stroke="url(#fbsig-mark)"
                        strokeWidth="2.8" strokeLinecap="round"
                        style={{ strokeDasharray: "60px", strokeDashoffset: "0px" }}
                    />

                    {/* L horizontal */}
                    <path
                        className="footer-brand-signature-body"
                        d="M 92,72 L 115,72"
                        fill="none" stroke="url(#fbsig-mark)"
                        strokeWidth="2.8" strokeLinecap="round"
                        style={{ strokeDasharray: "25px", strokeDashoffset: "0px" }}
                    />

                    {/* L serif */}
                    <path
                        className="footer-brand-signature-body"
                        d="M 87,14 L 97,14"
                        fill="none" stroke="url(#fbsig-mark)"
                        strokeWidth="1.4" strokeLinecap="round" opacity="0.70"
                        style={{ strokeDasharray: "12px", strokeDashoffset: "0px" }}
                    />

                    {/* "CRISTI" */}
                    <text
                        className="footer-brand-sig-text"
                        x="125" y="62"
                        fontFamily="'Bebas Neue', sans-serif" fontSize="44"
                        letterSpacing="10" fill="url(#fbsig-cristi)" opacity="0"
                    >CRISTI</text>

                    {/* "LABS" */}
                    <text
                        className="footer-brand-sig-text"
                        x="295" y="62"
                        fontFamily="'Bebas Neue', sans-serif" fontSize="44"
                        letterSpacing="10" fill="url(#fbsig-cristi)" opacity="0"
                    >LABS</text>

                    {/* Vertical divider */}
                    <line
                        className="footer-brand-sig-text"
                        x1="116" y1="22" x2="116" y2="78"
                        stroke="rgba(184,146,74,0.30)" strokeWidth="1" opacity="0"
                    />

                    {/* Underline flourish */}
                    <path
                        className="footer-brand-signature-flourish"
                        d="M 10,82 Q 70,80 130,79 Q 185,78 230,76 Q 265,74 285,68 C 298,62 305,52 302,40 C 299,29 294,21 297,12 Q 299,7 303,5"
                        fill="none" stroke="url(#fbsig-flourish)"
                        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                        style={{ strokeDasharray: "340px", strokeDashoffset: "0px" }}
                    />

                    {/* Terminal hook */}
                    <path
                        className="footer-brand-signature-flourish"
                        d="M 303,5 C 306,2 310,3 311,6"
                        fill="none" stroke="url(#fbsig-flourish)"
                        strokeWidth="1.4" strokeLinecap="round" opacity="0.45"
                    />
                </svg>

                <p ref={taglineRef} className="footer-brand-tagline" aria-label="Code the Impossible. Trade the World.">
                    Code the Impossible. Trade the World.
                </p>

                {/* Bottom accent strip */}
                <div className="footer-brand-accent" />

                {/* Corner marks */}
                <div className="footer-brand-corner" aria-hidden="true" />
            </div>
        </div>
    );
};

export default FooterBrand;
