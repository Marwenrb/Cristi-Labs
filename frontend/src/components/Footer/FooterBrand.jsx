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
                const chars = titleSplit.chars;
                const words = taglineSplit.words;

                // --- Reduced motion: instant show ---
                if (prefersReduced) {
                    gsap.set(chars, { opacity: 1 });
                    gsap.set(words, { opacity: 1 });
                    if (cursorEl) {
                        gsap.set(cursorEl, { opacity: 1 });
                        cursorEl.style.animationPlayState = 'running';
                    }
                    watermark && gsap.set(watermark, { opacity: 0.035 });
                    tier && gsap.set(tier, { opacity: 1 });
                    accent && gsap.set(accent, { scaleX: 1 });
                    cardEl.classList.add('is-revealed');
                    return;
                }

                // --- Initial states ---
                gsap.set(chars, { opacity: 0 });
                gsap.set(words, { opacity: 0, y: 6 });
                watermark && gsap.set(watermark, { opacity: 0 });
                tier && gsap.set(tier, { opacity: 0 });
                accent && gsap.set(accent, { scaleX: 0 });
                cursorEl && gsap.set(cursorEl, { opacity: 0 });

                // --- Master timeline ---
                const tl = gsap.timeline();

                // Phase 0 — Card structure reveals (corners + top rule)
                tl.call(() => { cardEl.classList.add('is-revealed'); }, null, 0);

                // Phase 1 — Watermark fades in slowly (background element)
                if (watermark) {
                    tl.to(watermark, {
                        opacity: 0.035,
                        duration: 2,
                        ease: "power2.out",
                    }, 0);
                }

                // Phase 2 — Tier label fades in
                if (tier) {
                    tl.to(tier, {
                        opacity: 1,
                        duration: 0.6,
                        ease: "power2.out",
                    }, 0.2);
                }

                // Phase 3 — TYPEWRITER: characters appear one by one
                // Each char snaps from 0 to 1 opacity — like a real terminal
                const typeDelay = 0.05;   // time per character
                chars.forEach((char, i) => {
                    tl.set(char, { opacity: 1 }, 0.4 + (i * typeDelay));
                });

                // Phase 4 — Cursor appears after last character typed
                const cursorTime = 0.4 + (chars.length * typeDelay);
                if (cursorEl) {
                    tl.set(cursorEl, { opacity: 1 }, cursorTime);
                    tl.call(() => {
                        cursorEl.style.animationPlayState = 'running';
                    }, null, cursorTime);
                }

                // Phase 5 — Tagline words fade up, staggered
                tl.to(words, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power3.out",
                    stagger: 0.08,
                }, cursorTime + 0.15);

                // Phase 6 — Accent line sweeps from left
                if (accent) {
                    tl.to(accent, {
                        scaleX: 1,
                        duration: 1,
                        ease: "power3.inOut",
                    }, cursorTime + 0.3);
                }

                }); // end waitForFonts
            },
            { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
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
