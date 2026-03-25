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

                {/* Founder signature — Premium luxury signature "Cristi" */}
                <svg
                    ref={sigRef}
                    className="footer-brand-signature"
                    viewBox="0 0 200 70"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                >
                    <defs>
                        {/* Premium ink gradient with natural pressure variation */}
                        <linearGradient id="fbsig-ink" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stopColor="#F8E4A5" stopOpacity="0.92" />
                            <stop offset="18%"  stopColor="#F0C96B" stopOpacity="0.88" />
                            <stop offset="42%"  stopColor="#C9A84C" stopOpacity="0.82" />
                            <stop offset="68%"  stopColor="#B8924A" stopOpacity="0.65" />
                            <stop offset="88%"  stopColor="#9A7530" stopOpacity="0.42" />
                            <stop offset="100%" stopColor="#7A6230" stopOpacity="0.22" />
                        </linearGradient>
                        <linearGradient id="fbsig-flourish" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stopColor="#C9A84C" stopOpacity="0.70" />
                            <stop offset="55%"  stopColor="#9A7530" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#7A6230" stopOpacity="0.08" />
                        </linearGradient>
                    </defs>

                    {/*
                        Luxury signature "Cristi" — bold capital C, flowing connected script
                        Designed with the elegance of haute couture signatures
                    */}

                    {/* Capital "C" — bold, confident opening with luxury flair */}
                    <path
                        className="footer-brand-signature-body"
                        d="M 35,25 C 32,22 30,18 32,14 C 35,9 42,6 50,8 C 57,10 62,16 63,23 C 64,30 60,37 53,40 C 46,43 38,41 34,36 C 31,32 30,28 33,25 C 35,23 39,23 42,25 C 44,27 45,30 43,33"
                        fill="none"
                        stroke="url(#fbsig-ink)"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* "r" — connected flowing stroke from C */}
                    <path
                        className="footer-brand-signature-body"
                        d="M 58,35 C 60,33 63,32 66,33 C 69,34 71,36 71,39 C 71,41 70,43 68,44 L 68,48 C 68,49 69,50 70,50"
                        fill="none"
                        stroke="url(#fbsig-ink)"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* "i" — elegant vertical with slight curve */}
                    <path
                        className="footer-brand-signature-body"
                        d="M 74,48 C 75,46 76,44 77,42 C 78,40 79,38 80,37 C 81,36 82,36 83,37 L 83,48 C 83,49 84,50 85,50"
                        fill="none"
                        stroke="url(#fbsig-ink)"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <circle cx="81" cy="30" r="1.8" fill="url(#fbsig-ink)" opacity="0.82" className="footer-brand-signature-body" />

                    {/* "s" — flowing serpentine curve */}
                    <path
                        className="footer-brand-signature-body"
                        d="M 88,42 C 90,40 93,39 96,40 C 99,41 101,44 100,47 C 99,50 96,52 93,52 C 90,52 88,50 88,48 C 88,46 90,45 92,45 C 94,45 96,46 97,48"
                        fill="none"
                        stroke="url(#fbsig-ink)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* "t" — tall ascender with confidence */}
                    <path
                        className="footer-brand-signature-body"
                        d="M 102,48 C 103,46 104,44 105,42 C 106,38 107,34 108,30 C 109,26 110,22 111,20 C 112,18 113,17 114,18 L 114,48 C 114,49 115,50 116,50"
                        fill="none"
                        stroke="url(#fbsig-ink)"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* "t" crossbar — stylish stroke */}
                    <path
                        className="footer-brand-signature-body"
                        d="M 107,32 L 120,32"
                        fill="none"
                        stroke="url(#fbsig-ink)"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                    />

                    {/* "i" final — graceful ending */}
                    <path
                        className="footer-brand-signature-body"
                        d="M 123,48 C 124,46 125,44 126,42 C 127,40 128,38 129,37 C 130,36 131,36 132,37 L 132,48 C 132,49 133,50 134,50"
                        fill="none"
                        stroke="url(#fbsig-ink)"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <circle cx="130" cy="30" r="1.8" fill="url(#fbsig-ink)" opacity="0.82" className="footer-brand-signature-body" />

                    {/* Luxury flourish — confident underline sweep with presidential authority */}
                    <path
                        className="footer-brand-signature-flourish"
                        d="M 30,52 C 50,51 70,50 90,50 C 110,50 130,50 148,48 C 160,47 170,45 178,41 C 184,38 188,34 189,29 C 190,26 189,23 187,21"
                        fill="none"
                        stroke="url(#fbsig-flourish)"
                        strokeWidth="1.8"
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
