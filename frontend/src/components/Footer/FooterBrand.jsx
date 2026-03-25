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
                                duration: 1.1,
                                ease: "power3.inOut",
                            }, typewriterEnd + 0.12);
                        }
                        if (sigFlourish && sigFlourishLen > 0) {
                            // Flourish starts as body is near its end (0.85s offset)
                            tl.to(sigFlourish, {
                                strokeDashoffset: 0,
                                duration: 0.6,
                                ease: "expo.out",
                            }, typewriterEnd + 0.12 + 0.85);
                            // Wet-ink shimmer — gold flare then fades as ink dries
                            tl.to(sigEl, {
                                filter: "brightness(1.5) drop-shadow(0 0 6px rgba(240,201,107,0.50))",
                                duration: 0.2,
                                ease: "power2.out",
                            }, typewriterEnd + 0.12 + 0.85 + 0.58);
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
                    viewBox="0 0 312 52"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                >
                    <defs>
                        <linearGradient id="fbsig-gold" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stopColor="#FFF4C0" stopOpacity="1.0" />
                            <stop offset="20%"  stopColor="#F0C96B" stopOpacity="0.95" />
                            <stop offset="55%"  stopColor="#C9A84C" stopOpacity="0.75" />
                            <stop offset="85%"  stopColor="#9A7530" stopOpacity="0.40" />
                            <stop offset="100%" stopColor="#7A5C28" stopOpacity="0.08" />
                        </linearGradient>
                        <linearGradient id="fbsig-flourish" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stopColor="#C9A84C" stopOpacity="0.60" />
                            <stop offset="55%"  stopColor="#9A7530" stopOpacity="0.30" />
                            <stop offset="100%" stopColor="#7A5C28" stopOpacity="0.03" />
                        </linearGradient>
                    </defs>
                    {/* Body: full cursive name — dramatic loop initial + 5 connected humps + resolving tail */}
                    <path
                        className="footer-brand-signature-body"
                        d="M 10,38 C 5,22 6,7 20,6 C 33,5 42,19 36,31 C 33,38 24,44 16,37 C 13,34 15,28 21,24 C 28,18 46,12 68,15 C 80,16 90,9 106,7 C 120,5 130,18 124,30 C 121,37 113,40 106,37 C 103,35 105,30 112,27 C 120,23 136,20 152,21 C 164,22 174,32 170,40 L 180,30 C 185,24 196,20 208,25 C 213,28 214,34 210,38 C 207,41 202,41 199,37 C 196,33 200,27 210,25 C 222,22 238,28 236,38"
                        fill="none"
                        stroke="url(#fbsig-gold)"
                        strokeWidth="2.0"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Flourish: long sweeping underline — pen glides then lifts dramatically off paper */}
                    <path
                        className="footer-brand-signature-flourish"
                        d="M 8,48 C 70,46 148,44 212,44 C 244,44 272,42 292,36 C 304,31 310,24 308,18"
                        fill="none"
                        stroke="url(#fbsig-flourish)"
                        strokeWidth="1.1"
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
