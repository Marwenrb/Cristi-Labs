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

                {/* Founder signature — Iconic luxury signature "Cristi" */}
                <svg
                    ref={sigRef}
                    className="footer-brand-signature"
                    viewBox="0 0 320 90"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                >
                    <defs>
                        {/* Luxury wet ink with natural pen pressure fade */}
                        <linearGradient id="fbsig-ink" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stopColor="#F8E4A5" stopOpacity="0.96" />
                            <stop offset="8%"   stopColor="#F0C96B" stopOpacity="0.92" />
                            <stop offset="22%"  stopColor="#C9A84C" stopOpacity="0.86" />
                            <stop offset="45%"  stopColor="#B8924A" stopOpacity="0.74" />
                            <stop offset="70%"  stopColor="#9A7530" stopOpacity="0.52" />
                            <stop offset="90%"  stopColor="#7A6230" stopOpacity="0.30" />
                            <stop offset="100%" stopColor="#6B4E1A" stopOpacity="0.16" />
                        </linearGradient>
                        <linearGradient id="fbsig-flourish" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stopColor="#C9A84C" stopOpacity="0.78" />
                            <stop offset="55%"  stopColor="#9A7530" stopOpacity="0.45" />
                            <stop offset="100%" stopColor="#7A6230" stopOpacity="0.12" />
                        </linearGradient>
                    </defs>

                    {/*
                        ONE flowing signature — "Cristi" in continuous cursive
                        Inspired by: Coco Chanel (iconic C curves), Christian Dior (fluid elegance),
                        Yves Saint Laurent (confident slant), Giorgio Armani (refined simplicity)
                    */}
                    <path
                        className="footer-brand-signature-body"
                        d="
                        M 22,45
                        Q 18,40 19,34
                        Q 20,27 26,22
                        Q 34,16 46,17
                        Q 56,18 64,24
                        Q 71,30 73,39
                        Q 75,48 70,56
                        Q 65,64 56,67
                        Q 47,70 38,66
                        Q 32,63 29,58
                        Q 27,54 29,50
                        Q 31,47 36,47
                        Q 40,47 44,50
                        Q 47,53 48,57

                        M 62,55
                        Q 66,52 71,51
                        Q 76,50 80,52
                        Q 84,54 86,58
                        Q 87,61 86,64
                        L 86,69
                        Q 86,72 89,72

                        M 92,69
                        Q 93,66 94,63
                        Q 95,58 96,53
                        Q 97,48 98,44
                        Q 99,41 101,40
                        Q 103,39 104,41
                        L 104,69
                        Q 104,72 107,72

                        M 112,69
                        Q 114,66 117,64
                        Q 121,62 126,63
                        Q 131,64 135,68
                        Q 138,72 137,76
                        Q 136,80 132,82
                        Q 128,84 124,82
                        Q 121,80 121,77
                        Q 121,75 123,74
                        Q 125,73 128,74
                        Q 130,75 132,77

                        M 145,69
                        Q 146,66 147,63
                        Q 148,58 149,53
                        Q 150,48 151,43
                        Q 152,36 153,30
                        Q 154,24 155,20
                        Q 156,17 158,16
                        Q 160,15 161,17
                        L 161,69
                        Q 161,72 164,72

                        M 172,69
                        Q 173,66 174,63
                        Q 175,58 176,53
                        Q 177,48 178,44
                        Q 179,41 181,40
                        Q 183,39 184,41
                        L 184,69
                        Q 184,72 187,72
                        Q 190,72 193,70
                        "
                        fill="none"
                        stroke="url(#fbsig-ink)"
                        strokeWidth="3.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* First "i" dot — natural placement */}
                    <circle cx="101" cy="31" r="2.4" fill="url(#fbsig-ink)" opacity="0.86" className="footer-brand-signature-body" />

                    {/* "t" crossbar — elegant sweeping stroke */}
                    <path
                        className="footer-brand-signature-body"
                        d="M 152,28 L 169,28"
                        fill="none"
                        stroke="url(#fbsig-ink)"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                    />

                    {/* Second "i" dot — signature character */}
                    <circle cx="181" cy="31" r="2.4" fill="url(#fbsig-ink)" opacity="0.86" className="footer-brand-signature-body" />

                    {/* Luxury underline flourish — sweeping presidential confidence */}
                    <path
                        className="footer-brand-signature-flourish"
                        d="
                        M 18,66
                        Q 50,64 82,63
                        Q 114,62 146,62
                        Q 178,62 208,60
                        Q 235,58 258,54
                        Q 278,50 290,43
                        Q 300,37 304,28
                        Q 307,21 306,14
                        "
                        fill="none"
                        stroke="url(#fbsig-flourish)"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Exit flourish — confident final sweep (haute couture signature mark) */}
                    <path
                        className="footer-brand-signature-flourish"
                        d="M 306,14 Q 308,10 311,8 Q 314,6 317,7"
                        fill="none"
                        stroke="url(#fbsig-flourish)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.68"
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
