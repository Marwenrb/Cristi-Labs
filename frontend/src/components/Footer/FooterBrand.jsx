import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import { waitForFonts } from "../../lib/fontLoader";

gsap.registerPlugin(ScrollTrigger, SplitText);

const FooterBrand = () => {
    const brandRef = useRef(null);
    const taglineRef = useRef(null);
    const sigRef = useRef(null);
    const hasAnimatedRef = useRef(false);

    useEffect(() => {
        const el = brandRef.current;
        if (!el) return;

        const cardEl = el.querySelector('.footer-brand-card');
        const taglineEl = taglineRef.current;
        if (!cardEl || !taglineEl) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
                    const watermark = cardEl.querySelector('.footer-brand-watermark');
                    const tier = cardEl.querySelector('.footer-brand-tier');
                    const accent = cardEl.querySelector('.footer-brand-accent');
                    const sigEl = sigRef.current;

                    const sigBody = sigEl ? Array.from(sigEl.querySelectorAll('.footer-brand-signature-body')) : [];
                    const sigC = sigEl ? Array.from(sigEl.querySelectorAll('.footer-brand-sig-c')) : [];
                    const sigCEcho = sigEl ? Array.from(sigEl.querySelectorAll('.footer-brand-sig-c-echo')) : [];
                    const sigCGlow = sigEl ? sigEl.querySelector('.footer-brand-sig-c-glow') : null;
                    const sigCDot = sigEl ? sigEl.querySelector('.footer-brand-sig-c-dot') : null;
                    const sigFlourish = sigEl ? Array.from(sigEl.querySelectorAll('.footer-brand-signature-flourish')) : [];
                    const sigText = sigEl ? Array.from(sigEl.querySelectorAll('.footer-brand-sig-text')) : [];
                    const sigR = sigEl ? Array.from(sigEl.querySelectorAll('.footer-brand-sig-r')) : [];
                    const sigRGlow = sigEl ? sigEl.querySelector('.footer-brand-sig-r-glow') : null;

                    // Pre-compute path lengths for signature animation
                    // C paths (separate from L)
                    sigC.forEach(path => {
                        const len = path.getTotalLength?.() || 120;
                        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
                    });
                    sigCEcho.forEach(path => {
                        const len = path.getTotalLength?.() || 110;
                        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
                    });
                    // "r" path
                    sigR.forEach(path => {
                        const len = path.getTotalLength?.() || 80;
                        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
                    });
                    // L paths
                    sigBody.forEach(path => {
                        const len = path.getTotalLength?.() || 60;
                        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
                    });
                    sigFlourish.forEach(path => {
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
                            sigC.forEach(p => gsap.set(p, { strokeDashoffset: 0 }));
                            sigCEcho.forEach(p => gsap.set(p, { strokeDashoffset: 0 }));
                            sigCGlow && gsap.set(sigCGlow, { opacity: 1 });
                            sigCDot && gsap.set(sigCDot, { opacity: 1 });
                            sigR.forEach(p => gsap.set(p, { strokeDashoffset: 0 }));
                            sigRGlow && gsap.set(sigRGlow, { opacity: 1 });
                            sigBody.forEach(p => gsap.set(p, { strokeDashoffset: 0 }));
                            sigFlourish.forEach(p => gsap.set(p, { strokeDashoffset: 0 }));
                            sigText.forEach(el => gsap.set(el, { opacity: 1 }));
                        }
                        cardEl.classList.add('is-revealed');
                        return;
                    }

                    // ── Initial states ──
                    gsap.set(words, { opacity: 0, y: 8 });
                    watermark && gsap.set(watermark, { opacity: 0 });
                    tier && gsap.set(tier, { opacity: 0 });
                    accent && gsap.set(accent, { scaleX: 0 });

                    const tl = gsap.timeline();

                    // 0.0s — Card structure (corners + top rule via CSS transition)
                    tl.call(() => { cardEl.classList.add('is-revealed'); }, null, 0);

                    // 0.0s — Watermark drifts in
                    if (watermark) {
                        tl.to(watermark, {
                            opacity: 0.045,
                            duration: 1.6,
                            ease: "power2.out",
                        }, 0);
                    }

                    // 0.2s — Tier label appears
                    if (tier) {
                        tl.to(tier, {
                            opacity: 1,
                            duration: 0.5,
                            ease: "power2.out",
                        }, 0.2);
                    }

                    // 0.4s — Signature draws in (staged: C first, then L)
                    const hasSig = sigEl && (sigC.length > 0 || sigBody.length > 0 || sigFlourish.length > 0);
                    if (hasSig) {
                        tl.set(sigEl, { opacity: 1 }, 0.4);

                        // ── STAGE 1: "C" draws dramatically (0.4s → 1.6s) ──
                        if (sigC.length > 0) {
                            tl.to(sigC, {
                                strokeDashoffset: 0,
                                duration: 1.2,
                                ease: "power4.inOut",
                            }, 0.4);
                        }
                        // C inner echo draws slightly later (depth)
                        if (sigCEcho.length > 0) {
                            tl.to(sigCEcho, {
                                strokeDashoffset: 0,
                                duration: 1.0,
                                ease: "power3.inOut",
                            }, 0.65);
                        }
                        // C glow halo blooms as arc approaches midpoint
                        if (sigCGlow) {
                            tl.to(sigCGlow, {
                                opacity: 1,
                                duration: 0.8,
                                ease: "power2.out",
                            }, 0.8);
                        }
                        // C dot accent appears at end of draw
                        if (sigCDot) {
                            tl.to(sigCDot, {
                                opacity: 0.9,
                                duration: 0.3,
                                ease: "power2.out",
                            }, 1.5);
                        }

                        // ── STAGE 1.5: "r" draws in (1.3s → 2.2s) ──
                        if (sigR.length > 0) {
                            tl.to(sigR, {
                                strokeDashoffset: 0,
                                duration: 0.9,
                                ease: "power3.inOut",
                            }, 1.3);
                        }
                        // r glow blooms
                        if (sigRGlow) {
                            tl.to(sigRGlow, {
                                opacity: 1,
                                duration: 0.7,
                                ease: "power2.out",
                            }, 1.4);
                        }

                        // ── STAGE 2: "L" draws after C + r (1.8s → 2.8s) ──
                        if (sigBody.length > 0) {
                            tl.to(sigBody, {
                                strokeDashoffset: 0,
                                duration: 1.0,
                                ease: "power3.inOut",
                            }, 1.8);
                        }

                        // ── STAGE 3: Text + flourish (2.5s+) ──
                        if (sigText.length > 0) {
                            tl.to(sigText, {
                                opacity: 1,
                                duration: 0.7,
                                ease: "power2.out",
                            }, 2.5);
                        }
                        if (sigFlourish.length > 0) {
                            tl.to(sigFlourish, {
                                strokeDashoffset: 0,
                                duration: 1.2,
                                ease: "power2.inOut",
                            }, 2.1);
                            // Wet-ink shimmer after everything
                            tl.to(sigEl, {
                                filter: "brightness(1.4) drop-shadow(0 0 8px rgba(248,228,165,0.55))",
                                duration: 0.25,
                                ease: "power2.out",
                            }, 3.1);
                            tl.to(sigEl, {
                                filter: "brightness(1) drop-shadow(0 0 2px rgba(201,168,76,0.15))",
                                duration: 0.7,
                                ease: "sine.inOut",
                            }, ">");
                        }
                    }

                    // 1.9s — Tagline words drift up (starts as L is drawing)
                    tl.to(words, {
                        opacity: 1,
                        y: 0,
                        duration: 0.55,
                        ease: "power3.out",
                        stagger: 0.09,
                    }, 1.9);

                    // 2.1s — Accent line sweeps
                    if (accent) {
                        tl.to(accent, {
                            scaleX: 1,
                            duration: 1,
                            ease: "power3.inOut",
                        }, 2.1);
                    }
                }); // end waitForFonts
            },
        });

        return () => { st && st.kill(); };
    }, []);

    return (
        <div ref={brandRef} className="footer-brand">
            <div className="footer-brand-card">
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
                    viewBox="0 0 320 100"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
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
                        {/* Premium C gradient — ULTRA LUMINEUX */}
                        <linearGradient id="fbsig-c-main" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%"   stopColor="#FFFAF0" stopOpacity="1.0" />
                            <stop offset="15%"  stopColor="#FFE8A0" stopOpacity="0.98" />
                            <stop offset="45%"  stopColor="#F0C96B" stopOpacity="0.95" />
                            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.85" />
                        </linearGradient>
                        {/* C inner echo — brighter depth */}
                        <linearGradient id="fbsig-c-echo" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%"   stopColor="#FFE8A0" stopOpacity="0.50" />
                            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.20" />
                        </linearGradient>
                        {/* Radial glow behind C — ULTRA LUMINEUX */}
                        <radialGradient id="fbsig-c-glow" cx="42" cy="44" r="36" gradientUnits="userSpaceOnUse">
                            <stop offset="0%"   stopColor="#FFE8A0" stopOpacity="0.30" />
                            <stop offset="40%"  stopColor="#F0C96B" stopOpacity="0.12" />
                            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
                        </radialGradient>
                        {/* Radial glow behind r — white luminance */}
                        <radialGradient id="fbsig-r-glow" cx="75" cy="44" r="30" gradientUnits="userSpaceOnUse">
                            <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.18" />
                            <stop offset="50%"  stopColor="#F8F0E0" stopOpacity="0.06" />
                            <stop offset="100%" stopColor="#F8F0E0" stopOpacity="0" />
                        </radialGradient>
                        {/* Blur filter for r glow */}
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
                        {/* SVG filter for C glow blur */}
                        <filter id="fbsig-c-blur" x="-40%" y="-40%" width="180%" height="180%">
                            <feGaussianBlur stdDeviation="5" />
                        </filter>
                        {/* "r" white gradient — pure white fading to warm gold */}
                        <linearGradient id="fbsig-r" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="1.0" />
                            <stop offset="40%"  stopColor="#FFFFFF" stopOpacity="0.95" />
                            <stop offset="70%"  stopColor="#F5ECD5" stopOpacity="0.88" />
                            <stop offset="100%" stopColor="#E0C880" stopOpacity="0.72" />
                        </linearGradient>
                        {/* CRISTI — premium white-to-gold gradient */}
                        <linearGradient id="fbsig-cristi" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="1.0" />
                            <stop offset="25%"  stopColor="#FFF8E8" stopOpacity="0.98" />
                            <stop offset="50%"  stopColor="#FFE8A0" stopOpacity="0.95" />
                            <stop offset="80%"  stopColor="#F0C96B" stopOpacity="0.90" />
                            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.85" />
                        </linearGradient>
                    </defs>

                    {/*
                      ── NEXT-GEN "C" ─────────────────────────────────────
                      Three layers: glow halo → main stroke → inner echo
                      Each animates independently for staged reveal depth.
                    */}

                    {/* C — Layer 0: Glow halo (brighter, larger) */}
                    <circle
                        className="footer-brand-sig-c-glow"
                        cx="42"
                        cy="44"
                        r="34"
                        fill="url(#fbsig-c-glow)"
                        filter="url(#fbsig-c-blur)"
                        opacity="0"
                    />

                    {/* C — Layer 1: Main arc (COMPACT — shifted 4px right) */}
                    <path
                        className="footer-brand-sig-c"
                        d="M 56,16 C 50,14 42,14 36,18 C 26,24 21,35 22,47 C 23,59 31,68 42,71 C 52,74 61,70 66,63"
                        fill="none"
                        stroke="url(#fbsig-c-main)"
                        strokeWidth="3.4"
                        strokeLinecap="round"
                        style={{ strokeDasharray: '120px', strokeDashoffset: '0px' }}
                    />

                    {/* C — Layer 2: Inner echo arc (shifted + brighter) */}
                    <path
                        className="footer-brand-sig-c-echo"
                        d="M 54,19 C 49,17 42,17 37,21 C 29,26 25,36 26,46 C 27,56 33,64 42,67 C 50,69 57,66 61,61"
                        fill="none"
                        stroke="url(#fbsig-c-echo)"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        style={{ strokeDasharray: '110px', strokeDashoffset: '0px' }}
                    />

                    {/* C — Dot accent at opening */}
                    <circle
                        className="footer-brand-sig-c-dot"
                        cx="57"
                        cy="15"
                        r="2.0"
                        fill="url(#fbsig-c-main)"
                        opacity="0"
                    />

                    {/* C — Fine serif on top entry */}
                    <path
                        className="footer-brand-sig-c"
                        d="M 50,14 L 60,14"
                        fill="none"
                        stroke="url(#fbsig-c-main)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.75"
                        style={{ strokeDasharray: '12px', strokeDashoffset: '0px' }}
                    />

                    {/*
                      ── PETITE "r" ─────────────────────────────────────
                      One continuous pen stroke — full height, wide arm.
                      Stem up → shoulder → arm RIGHT → demi-tour back down.
                    */}

                    {/* r — White glow halo behind */}
                    <circle
                        className="footer-brand-sig-r-glow"
                        cx="75"
                        cy="44"
                        r="28"
                        fill="url(#fbsig-r-glow)"
                        filter="url(#fbsig-r-blur)"
                        opacity="0"
                    />

                    {/* r — Full height stem + wide arm + demi-tour + signature finish + pen loop */}
                    <path
                        className="footer-brand-sig-r"
                        d="M 62,72 L 62,22 C 62,16 66,12 72,12 C 78,12 82,15 85,20 C 88,25 89,32 88,38 C 87,44 84,48 80,50 C 76,52 74,56 75,61 C 76,66 80,68 86,67 C 90,66 93,63 95,59 C 97,55 100,53 101,56 C 102,60 100,64 96,65 C 92,66 90,63 92,60"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="3.0"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.95"
                    />

                    {/* r — Signature slash: from loop intersection, elegant sweep with end flick */}
                    <path
                        className="footer-brand-sig-r"
                        d="M 93,62 C 100,58 110,53 122,50 C 130,48 136,48 138,50 C 140,52 139,54 136,55"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        opacity="0.65"
                    />

                    {/* r — Signature underline: simple pen line beneath */}
                    <path
                        className="footer-brand-sig-r"
                        d="M 58,76 C 66,75 78,74 90,73 C 96,72.5 100,72 103,71"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        opacity="0.55"
                    />

                    {/* L vertical stroke (shifted right: 75 → 92) */}
                    <path
                        className="footer-brand-signature-body"
                        d="M 92,14 L 92,72"
                        fill="none"
                        stroke="url(#fbsig-mark)"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        style={{ strokeDasharray: '60px', strokeDashoffset: '0px' }}
                    />

                    {/* L horizontal stroke */}
                    <path
                        className="footer-brand-signature-body"
                        d="M 92,72 L 115,72"
                        fill="none"
                        stroke="url(#fbsig-mark)"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        style={{ strokeDasharray: '25px', strokeDashoffset: '0px' }}
                    />

                    {/* Fine serif on L — top entry */}
                    <path
                        className="footer-brand-signature-body"
                        d="M 87,14 L 97,14"
                        fill="none"
                        stroke="url(#fbsig-mark)"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        opacity="0.70"
                        style={{ strokeDasharray: '12px', strokeDashoffset: '0px' }}
                    />

                    {/* "CRISTI" — premium white-gold gradient */}
                    <text
                        className="footer-brand-sig-text"
                        x="130"
                        y="52"
                        fontFamily="'Bebas Neue', sans-serif"
                        fontSize="22"
                        letterSpacing="5"
                        fill="url(#fbsig-cristi)"
                        opacity="0"
                    >
                        CRISTI
                    </text>

                    {/* "LABS" — premium white-gold gradient (matching CRISTI) */}
                    <text
                        className="footer-brand-sig-text"
                        x="222"
                        y="52"
                        fontFamily="'Bebas Neue', sans-serif"
                        fontSize="22"
                        letterSpacing="5"
                        fill="url(#fbsig-cristi)"
                        opacity="0"
                    >
                        LABS
                    </text>

                    {/* Vertical divider between monogram and text */}
                    <line
                        className="footer-brand-sig-text"
                        x1="123"
                        y1="30"
                        x2="123"
                        y2="70"
                        stroke="rgba(184,146,74,0.30)"
                        strokeWidth="0.8"
                        opacity="0"
                    />

                    {/* Underline flourish — sweeps full width */}
                    <path
                        className="footer-brand-signature-flourish"
                        d="M 10,82 Q 70,80 130,79 Q 185,78 230,76 Q 265,74 285,68 C 298,62 305,52 302,40 C 299,29 294,21 297,12 Q 299,7 303,5"
                        fill="none"
                        stroke="url(#fbsig-flourish)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ strokeDasharray: '340px', strokeDashoffset: '0px' }}
                    />

                    {/* Terminal hook */}
                    <path
                        className="footer-brand-signature-flourish"
                        d="M 303,5 C 306,2 310,3 311,6"
                        fill="none"
                        stroke="url(#fbsig-flourish)"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        opacity="0.45"
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
