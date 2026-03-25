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

                    // Pre-compute path lengths for dual-stroke dash animation
                    let sigBodyLen = 0, sigFlourishLen = 0;
                    if (sigBody) {
                        sigBodyLen = sigBody.getTotalLength() || 420;
                        gsap.set(sigBody, { strokeDasharray: sigBodyLen, strokeDashoffset: sigBodyLen });
                    }
                    if (sigFlourish) {
                        sigFlourishLen = sigFlourish.getTotalLength() || 280;
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

                    // typewriterEnd + 0.12s — Body draws (cursive monogram), then flourish sweeps
                    if (sigEl && (sigBodyLen > 0 || sigFlourishLen > 0)) {
                        tl.set(sigEl, { opacity: 1 }, typewriterEnd + 0.12);
                        if (sigBody && sigBodyLen > 0) {
                            tl.to(sigBody, {
                                strokeDashoffset: 0,
                                duration: 0.9,
                                ease: "power3.inOut",
                            }, typewriterEnd + 0.12);
                        }
                        if (sigFlourish && sigFlourishLen > 0) {
                            // Flourish starts as body is near its end (0.7s offset)
                            tl.to(sigFlourish, {
                                strokeDashoffset: 0,
                                duration: 0.45,
                                ease: "expo.out",
                            }, typewriterEnd + 0.12 + 0.7);
                            // Wet-ink shimmer — gold flare then fades as ink dries
                            tl.to(sigEl, {
                                filter: "brightness(1.5) drop-shadow(0 0 6px rgba(240,201,107,0.50))",
                                duration: 0.2,
                                ease: "power2.out",
                            }, typewriterEnd + 0.12 + 0.7 + 0.42);
                            tl.to(sigEl, {
                                filter: "brightness(1) drop-shadow(0 0 0px transparent)",
                                duration: 0.65,
                                ease: "sine.inOut",
                            }, ">");
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

                {/* Founder signature — body (cursive monogram) + sweeping flourish */}
                <svg
                    ref={sigRef}
                    className="footer-brand-signature"
                    viewBox="0 0 240 48"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                >
                    <defs>
                        <linearGradient id="fbsig-gold" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stopColor="#FFEEA0" stopOpacity="1.0" />
                            <stop offset="30%"  stopColor="#F0C96B" stopOpacity="0.90" />
                            <stop offset="65%"  stopColor="#C9A84C" stopOpacity="0.70" />
                            <stop offset="100%" stopColor="#9A7530" stopOpacity="0.10" />
                        </linearGradient>
                        <linearGradient id="fbsig-flourish" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stopColor="#C9A84C" stopOpacity="0.55" />
                            <stop offset="70%"  stopColor="#9A7530" stopOpacity="0.28" />
                            <stop offset="100%" stopColor="#7A5C28" stopOpacity="0.04" />
                        </linearGradient>
                    </defs>
                    {/* Body: expressive cursive monogram — looping initial + connecting strokes */}
                    <path
                        className="footer-brand-signature-body"
                        d="M 8,34 C 4,20 5,7 18,6 C 29,5 36,17 31,28 C 28,35 20,40 14,34 C 11,31 13,26 18,22 C 24,17 40,11 58,14 C 68,15 76,10 90,8 C 102,6 110,18 104,28 C 101,34 95,36 90,33 C 88,31 90,27 95,25 C 102,22 114,19 128,20 C 138,21 146,30 142,36"
                        fill="none"
                        stroke="url(#fbsig-gold)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Flourish: sweeping underline that lifts off — pen leaving paper */}
                    <path
                        className="footer-brand-signature-flourish"
                        d="M 6,43 C 50,41 110,39 160,39 C 186,39 212,37 228,32 C 236,29 240,24 238,20"
                        fill="none"
                        stroke="url(#fbsig-flourish)"
                        strokeWidth="1.0"
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
