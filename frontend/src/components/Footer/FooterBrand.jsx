import { useRef, useEffect } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { waitForFonts } from "../../lib/fontLoader";

gsap.registerPlugin(SplitText);

const TYPING_SPEED = 0.055;

const FooterBrand = () => {
    const brandRef = useRef(null);
    const titleRef = useRef(null);
    const cursorRef = useRef(null);
    const taglineRef = useRef(null);
    const hasAnimatedRef = useRef(false);

    // IntersectionObserver — reliable trigger with ScrollSmoother
    useEffect(() => {
        const el = brandRef.current;
        if (!el) return;

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
                if (!titleEl || !taglineEl) return;

                // Wait for fonts before SplitText measures characters
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

                gsap.set(titleSplit.chars, {
                    opacity: 0,
                    y: 22,
                    filter: 'blur(7px)',
                    transformOrigin: "50% 100%",
                });
                cursorEl && gsap.set(cursorEl, { opacity: 0 });
                gsap.set(taglineSplit.words, { y: 18, opacity: 0 });

                const tl = gsap.timeline();

                // Phase 1 — luxury blur-dissolve reveal: each char falls lightly into place
                tl.to(titleSplit.chars, {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    stagger: TYPING_SPEED,
                    duration: 0.7,
                    ease: "expo.out",
                });

                // Phase 2 — cursor materialises immediately after last char
                if (cursorEl) {
                    tl.to(cursorEl, { opacity: 1, duration: 0.08 }, `-=${TYPING_SPEED}`);
                }

                // Phase 3 — tagline glides upward word by word
                tl.to(
                    taglineSplit.words,
                    {
                        y: 0,
                        opacity: 1,
                        stagger: 0.07,
                        duration: 0.7,
                        ease: "expo.out",
                    },
                    "-=0.3"
                );
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
                <div className="footer-brand-title-row">
                    <h2 ref={titleRef} className="footer-brand-title">
                        CRISTI <span className="footer-brand-title-accent">LABS</span>
                    </h2>
                    <span
                        ref={cursorRef}
                        className="footer-brand-cursor"
                        aria-hidden="true"
                    />
                </div>

                <p ref={taglineRef} className="footer-brand-tagline">
                    Code the Impossible. Trade the World.
                </p>

                <div className="footer-brand-accent" />

                <div className="footer-brand-corner" aria-hidden="true" />
            </div>
        </div>
    );
};

export default FooterBrand;
