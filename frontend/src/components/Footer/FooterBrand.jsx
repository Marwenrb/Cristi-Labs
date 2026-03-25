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

                    // Reduced motion — instant reveal
                    if (prefersReduced) {
                        chars.forEach(c => gsap.set(c, { opacity: 1 }));
                        gsap.set(words, { opacity: 1, y: 0 });
                        if (cursorEl) {
                            cursorEl.style.opacity = '1';
                            cursorEl.style.animationPlayState = 'running';
                        }
                        watermark && gsap.set(watermark, { opacity: 0.028 });
                        tier && gsap.set(tier, { opacity: 1 });
                        accent && gsap.set(accent, { scaleX: 1 });
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
                            opacity: 0.028,
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
