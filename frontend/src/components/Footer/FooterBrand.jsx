import { useRef, useEffect } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { waitForFonts } from "../../lib/fontLoader";

gsap.registerPlugin(SplitText);

const FooterBrand = () => {
    const brandRef = useRef(null);
    const titleRef = useRef(null);
    const cursorRef = useRef(null);
    const taglineRef = useRef(null);
    const hasAnimatedRef = useRef(false);

    useEffect(() => {
        const el = brandRef.current;
        if (!el) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const observer = new IntersectionObserver(
            (entries) => {
                if (hasAnimatedRef.current) return;
                const entry = entries[0];
                if (!entry.isIntersecting) return;

                hasAnimatedRef.current = true;
                observer.disconnect();

                const titleEl = titleRef.current;
                const cursorEl = cursorRef.current;
                const taglineEl = taglineRef.current;
                const cardEl = el.querySelector('.footer-brand-card');
                if (!titleEl || !taglineEl || !cardEl) return;

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
                } catch {
                    return;
                }

                const watermark = cardEl.querySelector('.footer-brand-watermark');
                const tier = cardEl.querySelector('.footer-brand-tier');
                const accent = cardEl.querySelector('.footer-brand-accent');
                const cornerEl = cardEl.querySelector('.footer-brand-corner');

                // Reduced motion — instant reveal, no animation
                if (prefersReduced) {
                    gsap.set(titleSplit.chars, { opacity: 1 });
                    if (cursorEl) {
                        gsap.set(cursorEl, { opacity: 1 });
                        cursorEl.style.animationPlayState = 'running';
                    }
                    gsap.set(taglineSplit.words, { clipPath: 'inset(0 0% 0 0)' });
                    watermark && gsap.set(watermark, { opacity: 1 });
                    accent && gsap.set(accent, { scaleX: 1 });
                    tier && gsap.set(tier, { clipPath: 'inset(0 0% 0 0)', opacity: 1 });
                    cardEl.classList.add('is-revealed');
                    return;
                }

                // --- Initial states for orchestrated reveal ---
                gsap.set(titleSplit.chars, {
                    opacity: 0,
                    yPercent: 110,
                    filter: 'blur(8px)',
                    transformOrigin: "50% 100%",
                    willChange: 'transform, opacity, filter',
                });
                cursorEl && gsap.set(cursorEl, { opacity: 0 });
                gsap.set(taglineSplit.words, {
                    clipPath: 'inset(0 100% 0 0)',
                    yPercent: 8,
                });
                watermark && gsap.set(watermark, { opacity: 0, scale: 1.08 });
                tier && gsap.set(tier, { clipPath: 'inset(0 100% 0 0)', opacity: 0 });
                accent && gsap.set(accent, { scaleX: 0 });

                // --- Orchestrated GSAP timeline ---
                const cardTl = gsap.timeline();

                // 0.0s — Watermark settles in background
                if (watermark) {
                    cardTl.to(watermark, {
                        opacity: 1,
                        scale: 1,
                        duration: 2.4,
                        ease: "power4.out",
                    }, 0);
                }

                // 0.1s — Tier clips in from left
                if (tier) {
                    cardTl.to(tier, {
                        clipPath: 'inset(0 0% 0 0)',
                        opacity: 1,
                        duration: 0.9,
                        ease: "power3.inOut",
                    }, 0.1);
                }

                // 0.2s — Accent line sweeps from left
                if (accent) {
                    cardTl.to(accent, {
                        scaleX: 1,
                        duration: 1.0,
                        ease: "power3.inOut",
                    }, 0.2);
                }

                // 0.3s — Title characters cascade up through blur
                cardTl.to(titleSplit.chars, {
                    yPercent: 0,
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 0.75,
                    ease: "power4.out",
                    stagger: { each: 0.038, from: "start" },
                    onComplete: () => {
                        titleSplit.chars.forEach(c => {
                            c.style.willChange = 'auto';
                            c.style.filter = 'none';
                        });
                    },
                }, 0.3);

                // After title — tagline words clip in
                cardTl.to(taglineSplit.words, {
                    clipPath: 'inset(0 0% 0 0)',
                    yPercent: 0,
                    duration: 0.55,
                    ease: "power3.inOut",
                    stagger: 0.065,
                }, ">+0.1");

                // Last — cursor fades in and begins blinking
                if (cursorEl) {
                    cardTl.to(cursorEl, {
                        opacity: 1,
                        duration: 0.3,
                        ease: "none",
                        onComplete: () => {
                            cursorEl.style.animationPlayState = 'running';
                        },
                    }, ">");
                }

                // 0.6s — Corner brackets + card ::after reveal via class toggle
                // (GSAP cannot animate pseudo-elements directly)
                cardTl.call(() => {
                    cardEl.classList.add('is-revealed');
                }, null, 0.6);

                }); // end waitForFonts
            },
            { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
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
