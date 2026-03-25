import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import { waitForFonts } from "../../lib/fontLoader";

gsap.registerPlugin(ScrollTrigger, SplitText);

const FooterBrand = () => {
    const brandRef = useRef(null);
    const titleRef = useRef(null);
    const cursorRef = useRef(null);
    const taglineRef = useRef(null);
    const sigRef = useRef(null);
    const hasAnimatedRef = useRef(false);

    useEffect(() => {
        const el = brandRef.current;
        if (!el) return;

        const cardEl = el.querySelector('.footer-brand-card');
        const titleEl = titleRef.current;
        const cursorEl = cursorRef.current;
        const taglineEl = taglineRef.current;
        if (!cardEl || !titleEl || !taglineEl) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // ScrollTrigger fires reliably inside GSAP ScrollSmoother
        // (IntersectionObserver is unreliable inside pinned sections)
        const st = ScrollTrigger.create({
            trigger: cardEl,
            start: "top 92%",
            once: true,
            onEnter: () => {
                if (hasAnimatedRef.current) return;
                hasAnimatedRef.current = true;

                waitForFonts().then(() => {
                    let titleSplit;
                    let taglineSplit;

                    try {
                        titleSplit = new SplitText(titleEl, {
                            type: "chars",
                            charsClass: "footer-brand-char",
                        });
                        taglineSplit = new SplitText(taglineEl, {
                            type: "words",
                            wordsClass: "footer-brand-word",
                        });
                    } catch { return; }

                    const chars = titleSplit.chars;
                    const words = taglineSplit.words;
                    const watermark = cardEl.querySelector('.footer-brand-watermark');
                    const tier = cardEl.querySelector('.footer-brand-tier');
                    const accent = cardEl.querySelector('.footer-brand-accent');
                    const sigEl = sigRef.current;

                    const sigBody = sigEl?.querySelector('.footer-brand-signature-body');
                    const sigFlourish = sigEl?.querySelector('.footer-brand-signature-flourish');

                    // Pre-compute path lengths for signature animation
                    let sigBodyLen = 0, sigFlourishLen = 0;
                    if (sigBody) {
                        sigBodyLen = sigBody.getTotalLength() || 550;
                        gsap.set(sigBody, { strokeDasharray: sigBodyLen, strokeDashoffset: sigBodyLen });
                    }
                    if (sigFlourish) {
                        sigFlourishLen = sigFlourish.getTotalLength() || 380;
                        gsap.set(sigFlourish, { strokeDasharray: sigFlourishLen, strokeDashoffset: sigFlourishLen });
                    }

                    // Reduced motion — instant reveal
                    if (prefersReduced) {
                        chars.forEach(c => gsap.set(c, { opacity: 1 }));
                        gsap.set(words, { opacity: 1, y: 0 });
                        if (cursorEl) {
                            cursorEl.style.opacity = '1';
                            cursorEl.style.animationPlayState = 'running';
                        }
                        watermark && gsap.set(watermark, { opacity: 0.045 });
                        tier && gsap.set(tier, { opacity: 1 });
                        accent && gsap.set(accent, { scaleX: 1 });
                        if (sigEl) {
                            gsap.set(sigEl, { opacity: 1 });
                            sigBody && gsap.set(sigBody, { strokeDashoffset: 0 });
                            sigFlourish && gsap.set(sigFlourish, { strokeDashoffset: 0 });
                        }
                        cardEl.classList.add('is-revealed');
                        return;
                    }

                    // ── Initial states ──
                    // chars start opacity:0 via CSS (.footer-brand-char { opacity: 0 })
                    gsap.set(words, { opacity: 0, y: 8 });
                    watermark && gsap.set(watermark, { opacity: 0 });
                    tier && gsap.set(tier, { opacity: 0 });
                    accent && gsap.set(accent, { scaleX: 0 });
                    cursorEl && gsap.set(cursorEl, { opacity: 0 });

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

                    // 0.3s — TYPEWRITER: each character snaps on one by one
                    // duration 0.01 = effectively instant (true typewriter, not a fade)
                    tl.to(chars, {
                        opacity: 1,
                        duration: 0.01,
                        stagger: {
                            each: 0.055,
                            from: "start",
                        },
                    }, 0.3);

                    // After last char — cursor blinks on
                    const typewriterEnd = 0.3 + (chars.length * 0.055);

                    if (cursorEl) {
                        tl.call(() => {
                            cursorEl.style.opacity = '1';
                            cursorEl.style.animationPlayState = 'running';
                        }, null, typewriterEnd + 0.05);
                    }

                    // typewriterEnd + 0.12s — Signature draws in pen-stroke animation
                    if (sigEl && (sigBodyLen > 0 || sigFlourishLen > 0)) {
                        tl.set(sigEl, { opacity: 1 }, typewriterEnd + 0.12);
                        if (sigBody && sigBodyLen > 0) {
                            // Main signature body — realistic cursive "Cristi"
                            tl.to(sigBody, {
                                strokeDashoffset: 0,
                                duration: 1.4,
                                ease: "power2.inOut",
                            }, typewriterEnd + 0.12);
                        }
                        if (sigFlourish && sigFlourishLen > 0) {
                            // Flourish underline sweeps in as signature completes
                            tl.to(sigFlourish, {
                                strokeDashoffset: 0,
                                duration: 0.7,
                                ease: "power3.out",
                            }, typewriterEnd + 0.12 + 1.15);
                            // Wet-ink shimmer — gold flare as pen lifts, then ink dries
                            tl.to(sigEl, {
                                filter: "brightness(1.4) drop-shadow(0 0 8px rgba(248,228,165,0.55))",
                                duration: 0.25,
                                ease: "power2.out",
                            }, typewriterEnd + 0.12 + 1.7);
                            tl.to(sigEl, {
                                filter: "brightness(1) drop-shadow(0 0 2px rgba(201,168,76,0.15))",
                                duration: 0.7,
                                ease: "sine.inOut",
                            }, ">"
                            );
                        }
                    }
                    // typewriterEnd + 0.2s — Tagline words drift up into place
                    tl.to(words, {
                        opacity: 1,
                        y: 0,
                        duration: 0.55,
                        ease: "power3.out",
                        stagger: 0.09,
                    }, typewriterEnd + 0.2);

                    // typewriterEnd + 0.4s — Accent line sweeps left to right
                    if (accent) {
                        tl.to(accent, {
                            scaleX: 1,
                            duration: 1,
                            ease: "power3.inOut",
                        }, typewriterEnd + 0.4);
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

                <div className="footer-brand-title-row">
                    <h2 ref={titleRef} className="footer-brand-title" aria-label="CRISTI LABS">
                        CRISTI <span className="footer-brand-title-accent">LABS</span>
                    </h2>
                    <span
                        ref={cursorRef}
                        className="footer-brand-cursor"
                        aria-hidden="true"
                    />
                </div>

                {/* Founder signature — Realistic "Cristi" handwritten signature directly under brand name */}
                <svg
                    ref={sigRef}
                    className="footer-brand-signature"
                    viewBox="0 0 380 85"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                >
                    <defs>
                        <linearGradient id="fbsig-ink" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stopColor="#F8E4A5" stopOpacity="0.95" />
                            <stop offset="25%"  stopColor="#F0C96B" stopOpacity="0.92" />
                            <stop offset="60%"  stopColor="#C9A84C" stopOpacity="0.85" />
                            <stop offset="85%"  stopColor="#9A7530" stopOpacity="0.65" />
                            <stop offset="100%" stopColor="#6B4E1A" stopOpacity="0.28" />
                        </linearGradient>
                        <linearGradient id="fbsig-flourish" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stopColor="#C9A84C" stopOpacity="0.75" />
                            <stop offset="65%"  stopColor="#9A7530" stopOpacity="0.38" />
                            <stop offset="100%" stopColor="#6B4E1A" stopOpacity="0.06" />
                        </linearGradient>
                    </defs>

                    {/* Body: Realistic cursive "Cristi" — flowing, legible handwriting */}
                    <path
                        className="footer-brand-signature-body"
                        d="M 42,35 C 35,28 32,18 38,12 C 44,6 55,8 60,15 C 63,20 62,28 56,32 C 52,35 45,34 43,30 M 58,28 L 68,28 C 72,28 74,25 74,22 L 74,16 C 74,12 76,10 80,12 L 85,22 C 86,25 88,26 90,26 C 92,26 93,25 93,23 L 93,22 M 98,26 C 102,22 108,20 113,22 C 117,24 118,28 116,32 C 114,36 108,38 103,35 M 115,28 L 115,16 C 115,12 117,10 121,12 L 133,40 C 135,44 138,46 142,45 C 145,44 147,41 147,37 L 147,16 C 147,12 149,10 153,12 L 158,22 C 159,25 161,26 163,26 C 165,26 166,25 166,23 L 166,22 M 163,26 L 163,38 C 163,42 165,44 169,44 C 172,44 175,42 177,38 C 180,33 180,26 177,21 M 183,38 C 185,42 188,44 192,44 C 195,44 198,42 200,38 C 203,33 203,26 200,21 M 200,28 L 210,28 C 214,28 216,25 216,22 L 216,16 C 216,12 218,10 222,12 L 227,22 C 228,25 230,26 232,26 C 234,26 235,25 235,23"
                        fill="none"
                        stroke="url(#fbsig-ink)"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Dots for the two i's in "Cristi" */}
                    <circle cx="87" cy="8" r="1.8" fill="url(#fbsig-ink)" opacity="0.88" className="footer-brand-signature-body" />
                    <circle cx="160" cy="8" r="1.8" fill="url(#fbsig-ink)" opacity="0.88" className="footer-brand-signature-body" />

                    {/* Flourish: elegant underline sweep — signature authenticity mark */}
                    <path
                        className="footer-brand-signature-flourish"
                        d="M 35,52 C 90,50 145,49 200,49 C 245,49 285,48 315,44 C 335,41 350,36 357,28 C 360,24 361,19 359,14"
                        fill="none"
                        stroke="url(#fbsig-flourish)"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
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
