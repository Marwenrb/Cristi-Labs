import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import { waitForFonts } from "../../lib/fontLoader";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ═══════════════════════════════════════════════════════════════
 *  FooterBrand — SOVEREIGN SIGNATURE CARD v6
 *  Ambient particle field, scroll-parallax layers,
 *  ink-bleed draw-on, pulsing glow, interactive tilt, live shimmer
 * ═══════════════════════════════════════════════════════════════ */

const PARTICLE_COUNT = 18;
const CHAR_GRADIENT = {
    background: 'linear-gradient(170deg, #C9A84C 0%, #B8924A 30%, #9A7A3E 65%, #7A5F2E 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
};

const FooterBrand = () => {
    const brandRef       = useRef(null);
    const taglineRef     = useRef(null);
    const sigRef         = useRef(null);
    const cardRef        = useRef(null);
    const particleCanvasRef = useRef(null);
    const hasAnimatedRef = useRef(false);
    const tiltRAF        = useRef(null);
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
            canvas.width  = rect.width  * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            canvas.style.width  = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        resize();

        const w = () => canvas.width  / window.devicePixelRatio;
        const h = () => canvas.height / window.devicePixelRatio;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * 600, y: Math.random() * 300,
                r: Math.random() * 1.2 + 0.3,
                vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.1,
                alpha: Math.random() * 0.35 + 0.05,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.008 + 0.004,
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, w(), h());
            particles.forEach((p) => {
                p.x += p.vx; p.y += p.vy; p.pulse += p.pulseSpeed;
                if (p.x < -5) p.x = w() + 5;
                if (p.x > w() + 5) p.x = -5;
                if (p.y < -5) p.y = h() + 5;
                if (p.y > h() + 5) p.y = -5;
                const a = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(201, 168, 76, ${a})`;
                ctx.fill();
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
        return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
    }, []);

    /* ── Interactive 3D tilt on hover ───────────────────────── */
    useEffect(() => {
        const card = cardRef.current;
        if (!card || window.matchMedia("(pointer: coarse)").matches) return;

        const handleMove = (e) => {
            const rect = card.getBoundingClientRect();
            const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
            const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
            cancelAnimationFrame(tiltRAF.current);
            tiltRAF.current = requestAnimationFrame(() => {
                card.style.transform = `perspective(800px) rotateY(${dx * 2.5}deg) rotateX(${-dy * 2}deg)`;
            });
        };

        const handleLeave = () => {
            cancelAnimationFrame(tiltRAF.current);
            card.style.transition = "transform 0.6s cubic-bezier(0.16,1,0.3,1)";
            card.style.transform  = "perspective(800px) rotateY(0deg) rotateX(0deg)";
            setTimeout(() => { card.style.transition = ""; }, 600);
        };

        card.addEventListener("mousemove",  handleMove);
        card.addEventListener("mouseleave", handleLeave);
        return () => {
            card.removeEventListener("mousemove",  handleMove);
            card.removeEventListener("mouseleave", handleLeave);
            cancelAnimationFrame(tiltRAF.current);
        };
    }, []);

    /* ── GSAP scroll-triggered signature animation ──────────── */
    useEffect(() => {
        const el       = brandRef.current;
        const cardEl   = cardRef.current;
        const taglineEl = taglineRef.current;
        if (!el || !cardEl || !taglineEl) return;

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
                        taglineSplit = new SplitText(taglineEl, { type: "words", wordsClass: "footer-brand-word" });
                    } catch { return; }

                    const words     = taglineSplit.words;
                    const watermark = cardEl.querySelector(".footer-brand-watermark");
                    const tier      = cardEl.querySelector(".footer-brand-tier");
                    const accent    = cardEl.querySelector(".footer-brand-accent");
                    const sigEl     = sigRef.current;
                    const shimmer   = cardEl.querySelector(".footer-brand-shimmer");
                    const pulseRing = cardEl.querySelector(".footer-brand-pulse-ring");

                    const sigBody    = sigEl ? Array.from(sigEl.querySelectorAll(".footer-brand-signature-body"))    : [];
                    const sigFlourish= sigEl ? Array.from(sigEl.querySelectorAll(".footer-brand-signature-flourish")) : [];
                    const sigText    = sigEl ? Array.from(sigEl.querySelectorAll(".footer-brand-sig-text"))           : [];

                    // Pre-compute path lengths for draw-on animation
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
                        tier      && gsap.set(tier,      { opacity: 1 });
                        accent    && gsap.set(accent,    { scaleX: 1 });
                        if (sigEl) {
                            sigBody.forEach((p)    => gsap.set(p, { strokeDashoffset: 0 }));
                            sigFlourish.forEach((p) => gsap.set(p, { strokeDashoffset: 0 }));
                            sigText.forEach((el)    => gsap.set(el, { opacity: 1 }));
                        }
                        shimmer   && gsap.set(shimmer,   { opacity: 1 });
                        pulseRing && gsap.set(pulseRing,  { opacity: 1 });
                        cardEl.classList.add("is-revealed");
                        return;
                    }

                    // ── Initial states ──
                    gsap.set(words, { opacity: 0, y: 8 });
                    watermark && gsap.set(watermark, { opacity: 0 });
                    tier      && gsap.set(tier,      { opacity: 0 });
                    accent    && gsap.set(accent,    { scaleX: 0 });

                    const tl = gsap.timeline();

                    // 0.0s — Card structure reveal
                    tl.call(() => { cardEl.classList.add("is-revealed"); }, null, 0);

                    // 0.0s — Watermark drifts in
                    watermark && tl.to(watermark, { opacity: 0.045, duration: 1.6, ease: "power2.out" }, 0);

                    // 0.2s — Tier label
                    tier && tl.to(tier, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0.2);

                    // 0.4s — CL monogram body draws
                    const hasSig = sigEl && (sigBody.length > 0 || sigFlourish.length > 0);
                    if (hasSig) {
                        if (sigBody.length > 0) {
                            tl.to(sigBody, { strokeDashoffset: 0, duration: 1.8, ease: "power3.inOut" }, 0.4);
                        }
                        // 0.9s — Flourish sweeps right
                        if (sigFlourish.length > 0) {
                            tl.to(sigFlourish, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, 0.9);
                        }
                        // 1.6s — CRISTI LABS text + divider fade in
                        if (sigText.length > 0) {
                            tl.to(sigText, { opacity: 1, duration: 0.7, ease: "power2.out" }, 1.6);
                        }
                        // Wet-ink shimmer flash
                        if (sigFlourish.length > 0) {
                            tl.to(sigEl, {
                                filter: "brightness(1.6) drop-shadow(0 0 12px rgba(248,228,165,0.65))",
                                duration: 0.3, ease: "power2.out",
                            }, 2.2);
                            tl.to(sigEl, {
                                filter: "brightness(1) drop-shadow(0 0 2px rgba(201,168,76,0.15))",
                                duration: 0.9, ease: "sine.inOut",
                            }, ">");
                        }
                    }

                    // 1.8s — shimmer sweep
                    shimmer && tl.to(shimmer, { opacity: 1, duration: 0.01 }, 1.8);

                    // 2.8s — pulse ring
                    pulseRing && tl.to(pulseRing, { opacity: 1, duration: 0.5, ease: "power2.out" }, 2.8);

                    // 1.9s — Tagline drift up
                    tl.to(words, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.09 }, 1.9);

                    // 2.1s — Accent line sweep
                    accent && tl.to(accent, { scaleX: 1, duration: 1, ease: "power3.inOut" }, 2.1);
                });
            },
        });

        return () => { st && st.kill(); };
    }, []);

    /* ── Scroll-driven parallax for signature layers ────────── */
    useEffect(() => {
        const cardEl = cardRef.current;
        const sigEl  = sigRef.current;
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
                sigEl.style.transform = `translateY(${(p - 0.5) * -6}px)`;
            },
        });

        return () => parallaxST.kill();
    }, []);

    return (
        <div ref={brandRef} className="footer-brand">
            <div ref={cardRef} className="footer-brand-card">
                {/* Ambient particle canvas */}
                <canvas ref={particleCanvasRef} className="footer-brand-particles" aria-hidden="true" />

                {/* Shimmer sweep — diagonal light on reveal */}
                <div className="footer-brand-shimmer" aria-hidden="true" />

                {/* Pulsing perimeter ring */}
                <div className="footer-brand-pulse-ring" aria-hidden="true" />

                {/* Sovereign watermark */}
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

                {/* ── TASK 1: CRISTI LABS brand title — commanding gold typography ── */}
                <h2 className="footer-brand-title" aria-label="CRISTI LABS">
                    {['C','R','I','S','T','I'].map((char, i) => (
                        <div key={i} className="footer-brand-char" aria-hidden="true"
                            style={{ position: 'relative', display: 'inline-block', ...CHAR_GRADIENT }}
                        >{char}</div>
                    ))}
                    {/* Explicit space — fixes CRISTI/LABS overlap */}
                    <span style={{ display: 'inline-block', width: '0.22em' }} aria-hidden="true" />
                    <span className="footer-brand-title-accent" style={{ display: 'inline-block' }}>
                        {['L','A','B','S'].map((char, i) => (
                            <div key={i} className="footer-brand-char" aria-hidden="true"
                                style={{ position: 'relative', display: 'inline-block', ...CHAR_GRADIENT }}
                            >{char}</div>
                        ))}
                    </span>
                    {/* Teal cursor blink */}
                    <span className="footer-brand-cursor" aria-hidden="true" style={{
                        background: '#14b8a6',
                        boxShadow: '0 0 10px rgba(20,184,166,0.65)',
                        width: '3px', height: '0.85em',
                        display: 'inline-block', borderRadius: '1px',
                        verticalAlign: 'middle', marginLeft: '6px',
                        border: 'none',
                    }} />
                </h2>

                {/* ── TASK 2: Clean CL monogram + CRISTI LABS signature SVG ── */}
                <svg
                    ref={sigRef}
                    className="footer-brand-signature"
                    viewBox="0 0 400 85"
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
                        {/* Monogram ink — gold, no white stops (always legible on dark) */}
                        <linearGradient id="sig-gold" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stopColor="#F0C96B" stopOpacity="0.95" />
                            <stop offset="35%"  stopColor="#C9A84C" stopOpacity="0.88" />
                            <stop offset="70%"  stopColor="#B8924A" stopOpacity="0.75" />
                            <stop offset="100%" stopColor="#9A7A3E" stopOpacity="0.55" />
                        </linearGradient>

                        {/* Flourish — fades right */}
                        <linearGradient id="sig-fade" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stopColor="#C9A84C" stopOpacity="0.72" />
                            <stop offset="60%"  stopColor="#9A7530" stopOpacity="0.32" />
                            <stop offset="100%" stopColor="#7A6230" stopOpacity="0.05" />
                        </linearGradient>

                        {/* Text — warm gold, always readable on dark bg */}
                        <linearGradient id="sig-text" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stopColor="#E8C060" stopOpacity="0.92" />
                            <stop offset="50%"  stopColor="#C9A84C" stopOpacity="0.84" />
                            <stop offset="100%" stopColor="#9A7A3E" stopOpacity="0.62" />
                        </linearGradient>
                    </defs>

                    {/* ── CL MONOGRAM ─────────────────────────────────── */}
                    {/* C — main arc */}
                    <path
                        className="footer-brand-signature-body"
                        d="M 54,14 C 48,12 40,12 34,17 C 24,23 19,34 20,46 C 21,58 29,67 40,70 C 50,73 59,68 64,61"
                        fill="none" stroke="url(#sig-gold)"
                        strokeWidth="2.6" strokeLinecap="round"
                    />
                    {/* C — top serif */}
                    <path
                        className="footer-brand-signature-body"
                        d="M 48,13 L 57,13"
                        fill="none" stroke="url(#sig-gold)"
                        strokeWidth="1.3" strokeLinecap="round" opacity="0.65"
                    />
                    {/* L — vertical stem */}
                    <path
                        className="footer-brand-signature-body"
                        d="M 78,12 L 78,70"
                        fill="none" stroke="url(#sig-gold)"
                        strokeWidth="2.6" strokeLinecap="round"
                    />
                    {/* L — horizontal foot */}
                    <path
                        className="footer-brand-signature-body"
                        d="M 78,70 L 104,70"
                        fill="none" stroke="url(#sig-gold)"
                        strokeWidth="2.6" strokeLinecap="round"
                    />
                    {/* L — top serif */}
                    <path
                        className="footer-brand-signature-body"
                        d="M 73,12 L 83,12"
                        fill="none" stroke="url(#sig-gold)"
                        strokeWidth="1.3" strokeLinecap="round" opacity="0.65"
                    />

                    {/* ── VERTICAL DIVIDER ────────────────────────────── */}
                    <line
                        className="footer-brand-sig-text"
                        x1="114" y1="18" x2="114" y2="72"
                        stroke="rgba(184,146,74,0.22)" strokeWidth="0.8"
                        style={{ opacity: 0 }}
                    />

                    {/* ── "CRISTI LABS" — gold text, legible on dark ─── */}
                    <text
                        className="footer-brand-sig-text"
                        x="126" y="44"
                        fontFamily="'Bebas Neue', sans-serif"
                        fontSize="26" letterSpacing="7"
                        fill="url(#sig-text)"
                        dominantBaseline="middle"
                        style={{ opacity: 0 }}
                    >CRISTI LABS</text>

                    {/* ── UNDERLINE FLOURISH ──────────────────────────── */}
                    <path
                        className="footer-brand-signature-flourish"
                        d="M 8,80 Q 65,78 125,77 Q 180,76 225,74 Q 262,72 282,66 C 295,60 301,50 298,39 C 295,28 290,20 293,11 Q 295,7 299,5"
                        fill="none" stroke="url(#sig-fade)"
                        strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
                    />
                    {/* Terminal hook */}
                    <path
                        className="footer-brand-signature-flourish"
                        d="M 299,5 C 302,2 306,3 307,6"
                        fill="none" stroke="url(#sig-fade)"
                        strokeWidth="1.4" strokeLinecap="round" opacity="0.40"
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
