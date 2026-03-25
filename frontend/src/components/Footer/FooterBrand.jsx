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
                        sigBodyLen = sigBody.getTotalLength() || 680;
                        gsap.set(sigBody, { strokeDasharray: sigBodyLen, strokeDashoffset: sigBodyLen });
                    }
                    if (sigFlourish) {
                        sigFlourishLen = sigFlourish.getTotalLength() || 420;
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

                {/* Founder signature — Realistic "Cristi" handwritten signature */}

                <svg
                    ref={sigRef}
                    className="footer-brand-signature"
                    viewBox="0 0 480 72"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                >
                    <defs>
                        <linearGradient id="fbsig-ink" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stopColor="#F8E4A5" stopOpacity="0.98" />
                            <stop offset="18%"  stopColor="#F0C96B" stopOpacity="0.95" />
                            <stop offset="48%"  stopColor="#C9A84C" stopOpacity="0.88" />
                            <stop offset="75%"  stopColor="#9A7530" stopOpacity="0.72" />
                            <stop offset="100%" stopColor="#6B4E1A" stopOpacity="0.35" />
                        </linearGradient>
                        <linearGradient id="fbsig-flourish" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stopColor="#C9A84C" stopOpacity="0.68" />
                            <stop offset="60%"  stopColor="#9A7530" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#6B4E1A" stopOpacity="0.05" />
                        </linearGradient>
                    </defs>

                    {/* Body: Realistic cursive "Cristi" with natural pen pressure variation */}
                    <path
                        className="footer-brand-signature-body"
                        d="M 35,42 C 25,20 32,8 52,10 C 68,11 76,28 68,42 C 63,50 50,54 42,46 C 38,41 42,34 51,31 C 55,29 62,29 68,32 C 72,34 74,36 74,38 L 78,38 C 82,38 85,36 85,33 C 85,29 82,27 78,28 C 75,29 74,32 76,34 C 78,36 82,35 84,32 L 88,52 C 90,56 92,58 96,58 C 98,58 100,57 101,55 L 104,38 C 105,32 108,28 114,28 C 118,28 120,30 120,34 C 120,36 119,38 117,40 C 115,42 112,43 110,42 L 108,38 L 112,38 C 114,38 116,36 116,34 C 116,32 114,30 112,30 L 115,47 C 116,51 118,54 122,55 C 125,55 128,53 130,49 L 134,38 L 136,38 L 138,46 C 140,52 144,56 150,56 C 155,56 160,52 164,46 C 167,42 168,37 166,32 L 172,32 C 176,32 179,34 180,37 L 182,44 C 184,50 188,54 194,54 C 200,54 206,50 210,44 C 214,38 216,31 214,24 L 220,38 C 222,44 226,48 232,48 C 237,48 242,44 246,38 C 250,32 252,25 250,18 C 260,28 272,36 286,40 C 298,43 310,42 320,36 C 328,31 334,22 335,12"
                        fill="none"
                        stroke="url(#fbsig-ink)"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Flourish: elegant underline sweep with slight upward lift at end */}
                    <path
                        className="footer-brand-signature-flourish"
                        d="M 28,58 C 95,57 168,56 242,56 C 288,56 334,55 368,50 C 392,46 408,39 418,29 C 422,25 424,20 423,15"
                        fill="none"
                        stroke="url(#fbsig-flourish)"
                        strokeWidth="1.3"
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
