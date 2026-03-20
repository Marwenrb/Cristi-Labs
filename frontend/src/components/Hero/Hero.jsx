import { useRef, useEffect, useState } from 'react';
import gsap from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useMediaQuery } from "react-responsive";
import TypeWriter from "../TypeWriter/TypeWriter";
import { waitForFonts } from "../../lib/fontLoader";
import heroVideo  from "../../assets/Medias/hero/Cristi Labs Home Video.mp4";
import heroPoster from "../../assets/Medias/hero/hero-poster.png";

gsap.registerPlugin(ScrollTrigger, SplitText);

// 20 deterministic particles (avoid random on every render)
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${(i * 5.3 + 2) % 100}%`,
    size: i % 3 === 0 ? 2 : 1.5,
    opacity: 0.15 + (i % 5) * 0.08,
    duration: 15 + (i % 10) * 1.1,
    delay: -(i * 1.7),
    drift: `${((i % 7) - 3) * 20}px`,
}));

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789◆·—';

const Hero = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    const mobileTextRef = useRef(null);
    const mobileAnimDone = useRef(false);
    const eyebrowRef  = useRef(null);
    const headlineRef = useRef(null);
    const sublineRef  = useRef(null);
    const scrollRef   = useRef(null);
    const [scrollHidden, setScrollHidden] = useState(false);

    // Hide scroll indicator when user scrolls past 100px
    useEffect(() => {
        const onScroll = () => setScrollHidden(window.scrollY > 100);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Desktop animations (GSAP + ScrollTrigger)
    useGSAP(() => {
        if (isMobile) return;

        // Desktop: video parallax
        gsap.to(".hero-video", {
            yPercent: -12,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "bottom top",
                scrub: 1.5,
            },
        });

        // Desktop: text entrance timeline
        const tl = gsap.timeline({ delay: 0.3 });
        tl.from(eyebrowRef.current, {
            opacity: 0, y: 20, duration: 0.8, ease: 'expo.out',
        }, 0.5)
        .from(headlineRef.current, {
            opacity: 0, y: 40, duration: 1, ease: 'expo.out',
        }, 0.7)
        .from(sublineRef.current, {
            opacity: 0, y: 20, duration: 0.8, ease: 'expo.out',
        }, 1.1);
    }, [isMobile]);

    // Mobile: time-based entrance — NO ScrollTrigger (fires at scroll=0)
    useEffect(() => {
        if (!isMobile) return;
        if (mobileAnimDone.current) return;

        let splits = [];
        let mobileTl = null;
        let tiltActive = false;
        const heroEl = mobileTextRef.current;

        // Wait for fonts + 120ms for Lenis to finish first tick
        waitForFonts().then(() => {
            setTimeout(() => {
                if (!mobileTextRef.current) return;
                mobileAnimDone.current = true;

                const label = mobileTextRef.current.querySelector('.hero-label-m');
                const wordEls = mobileTextRef.current.querySelectorAll('.hero-word-m');
                const sub = mobileTextRef.current.querySelector('.hero-sub-m');

                if (!wordEls.length) return;

                // Remove premature will-change (prevents iOS Safari compositing issues)
                wordEls.forEach(w => {
                    w.style.willChange = 'auto';
                    w.style.opacity = '0';
                    w.style.transform = 'translateY(0)';
                });
                if (label) { label.style.opacity = '0'; label.style.transform = 'translateY(12px)'; }
                if (sub) { sub.style.opacity = '0'; sub.style.transform = 'translateY(16px)'; sub.style.filter = 'blur(4px)'; }

                // SplitText on each word line
                splits = Array.from(wordEls).map(el => {
                    const text = el.getAttribute('aria-label') || el.textContent;
                    el.textContent = text;
                    const split = new SplitText(el, { type: 'chars' });
                    gsap.set(split.chars, {
                        opacity: 0,
                        yPercent: 115,
                        rotateX: -75,
                        transformOrigin: '50% 100%',
                        willChange: 'transform, opacity',
                    });
                    el.style.opacity = '1';
                    return split;
                });

                // Master timeline
                mobileTl = gsap.timeline({
                    delay: 0.15,
                    onComplete: () => {
                        splits.forEach(s => {
                            gsap.set(s.chars, { willChange: 'auto', clearProps: 'transform' });
                            s.revert();
                        });
                    },
                });

                // Label slides in
                if (label) {
                    mobileTl.to(label, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 0);
                }

                // Each word line animates chars sequentially
                splits.forEach((split, lineIndex) => {
                    const lineDelay = lineIndex * 0.14;
                    const isGoldLine = lineIndex % 2 === 0;
                    mobileTl.to(split.chars, {
                        opacity: 1,
                        yPercent: 0,
                        rotateX: 0,
                        duration: 0.55,
                        ease: 'back.out(2.2)',
                        stagger: { amount: isGoldLine ? 0.3 : 0.25, ease: 'power2.out' },
                    }, 0.1 + lineDelay);
                });

                // Subtitle blur-in
                if (sub) {
                    mobileTl.to(sub, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out' }, '-=0.2');
                }

                // Label text scramble effect
                const labelTextEl = mobileTextRef.current.querySelector('.hero-label-m span:last-child');
                if (labelTextEl) {
                    const originalText = labelTextEl.textContent;
                    let iteration = 0;
                    const totalIterations = originalText.length * 2;
                    mobileTl.call(() => {
                        const timer = setInterval(() => {
                            labelTextEl.textContent = originalText
                                .split('')
                                .map((char, idx) => {
                                    if (char === ' ') return ' ';
                                    if (idx < iteration / 2) return originalText[idx];
                                    return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
                                })
                                .join('');
                            iteration++;
                            if (iteration >= totalIterations) {
                                clearInterval(timer);
                                labelTextEl.textContent = originalText;
                            }
                        }, 38);
                    }, [], 0.1);
                }

            }, 120);
        });

        // Subtle parallax — each word line at different depth
        const handleScroll = () => {
            if (!mobileTextRef.current) return;
            const scrollY = window.scrollY;
            const words = mobileTextRef.current.querySelectorAll('.hero-word-m');
            words.forEach((word, i) => {
                const depth = (i + 1) * 0.018;
                gsap.set(word, { y: -(scrollY * depth), overwrite: 'auto' });
            });
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Touch tilt interaction
        const handleTouchMove = (e) => {
            if (!tiltActive || !heroEl) return;
            const touch = e.touches[0];
            const rect = heroEl.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (touch.clientX - cx) / (rect.width / 2);
            const dy = (touch.clientY - cy) / (rect.height / 2);
            gsap.to(heroEl, { rotateY: dx * 4, rotateX: -dy * 3, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
        };
        const handleTouchStart = () => { tiltActive = true; };
        const handleTouchEnd = () => {
            tiltActive = false;
            if (heroEl) gsap.to(heroEl, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
        };

        if (heroEl) {
            heroEl.addEventListener('touchstart', handleTouchStart, { passive: true });
            heroEl.addEventListener('touchmove', handleTouchMove, { passive: true });
            heroEl.addEventListener('touchend', handleTouchEnd, { passive: true });
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (heroEl) {
                heroEl.removeEventListener('touchstart', handleTouchStart);
                heroEl.removeEventListener('touchmove', handleTouchMove);
                heroEl.removeEventListener('touchend', handleTouchEnd);
            }
            splits.forEach(s => { try { s.revert(); } catch (_) {} });
            mobileTl?.kill();
        };
    }, [isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <section className="hero-section w-dvw md:h-dvh min-h-[100dvh] md:p-2 p-2.5 mb-20">
            <div className="relative w-full h-full min-h-[85vh] md:min-h-0 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden">

                {/* Hero video — real brand asset */}
                <video
                    autoPlay loop muted playsInline preload="metadata"
                    poster={heroPoster}
                    className="hero-video absolute inset-0 w-full h-full object-cover object-center"
                    style={{ pointerEvents: 'none', zIndex: 0 }}
                >
                    <source src={heroVideo} type="video/mp4" />
                    <img src={heroPoster} alt="Cristi Labs" className="w-full h-full object-cover" loading="eager" />
                </video>

                {/* Stacked gradient overlays */}
                <div className="hero-overlay-bottom" aria-hidden />
                <div className="hero-overlay-left" aria-hidden />
                <div className="hero-overlay-vignette" aria-hidden />

                {/* Ambient floating particles — desktop only (CSS-driven) */}
                <div className="hero-particles" aria-hidden>
                    {PARTICLES.map(p => (
                        <span
                            key={p.id}
                            className="hero-particle"
                            style={{
                                left: p.left,
                                width: `${p.size}px`,
                                height: `${p.size}px`,
                                opacity: p.opacity,
                                animationDuration: `${p.duration}s`,
                                animationDelay: `${p.delay}s`,
                                '--px': p.left,
                                '--op': p.opacity,
                                '--drift': p.drift,
                            }}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="absolute inset-0 z-10">

                    {/* ── MOBILE layout: bottom-anchored ── */}
                    {/* perspective enables 3D rotateX on chars inside */}
                    <div
                        ref={mobileTextRef}
                        className="absolute bottom-8 left-5 right-5 md:hidden"
                        style={{ perspective: '1200px' }}
                    >
                        {/* Corporate label */}
                        <div className="hero-label-m" style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            marginBottom: '1rem', opacity: 0,
                        }}>
                            <span style={{ width: '20px', height: '1px', background: 'var(--accent-gold)', flexShrink: 0 }} />
                            <span style={{
                                fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                                letterSpacing: '0.25em', textTransform: 'uppercase',
                                color: 'var(--accent-gold)',
                            }}>
                                Cristi Labs · Digital
                            </span>
                        </div>

                        {/* Display lines — each wrapped in overflow:hidden for reveal */}
                        {[
                            { text: 'Code the', accent: true },
                            { text: 'Impossible.', accent: false },
                            { text: 'Trade the', accent: true },
                            { text: 'World.', accent: false },
                        ].map((line, i) => (
                            <div key={i} style={{ overflow: 'hidden', marginTop: i === 2 ? '0.5rem' : 0 }}>
                                <p className="hero-word-m" aria-label={line.text} style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: 'clamp(2.8rem, 13.5vw, 4.2rem)',
                                    lineHeight: 0.88,
                                    letterSpacing: '0.04em',
                                    color: line.accent ? 'var(--accent-gold)' : 'var(--text-primary)',
                                    textShadow: line.accent ? '0 0 32px rgba(201,168,76,0.28)' : 'none',
                                    display: 'block',
                                    opacity: 0,
                                }}>
                                    {line.text}
                                </p>
                            </div>
                        ))}

                        {/* Descriptor */}
                        <div className="hero-sub-m" style={{
                            marginTop: '1.25rem', display: 'flex', alignItems: 'flex-start',
                            gap: '12px', opacity: 0,
                        }}>
                            <span style={{
                                display: 'inline-block', width: '2px', minHeight: '44px',
                                background: 'linear-gradient(to bottom, var(--accent-gold), transparent)',
                                flexShrink: 0, marginTop: '3px',
                            }} />
                            <p style={{
                                fontFamily: 'var(--font-body)', fontSize: '0.7rem',
                                color: 'var(--text-secondary)', lineHeight: 1.7, letterSpacing: '0.02em',
                            }}>
                                Silicon Valley innovation meets global commerce.<br />
                                We build phygital ecosystems at the frontier.
                            </p>
                        </div>
                    </div>

                    {/* ── DESKTOP layout: bottom-anchored, TypeWriter headline ── */}
                    <div className="hidden md:block absolute bottom-[8%] lg:bottom-[9%] left-0 right-0 px-4">

                        {/* Eyebrow */}
                        <div ref={eyebrowRef} style={{ marginBottom: '0.75rem' }}>
                            <p style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: 'clamp(0.6rem, 1.2vw, 0.78rem)',
                                letterSpacing: '0.5em', color: 'var(--accent-gold)', textTransform: 'uppercase',
                            }}>
                                <TypeWriter
                                    text="VENTURE STUDIO · GLOBAL TRADE · DIGITAL ENTERTAINMENT"
                                    speed={28} delay={1400} showCursor={false}
                                />
                            </p>
                        </div>

                        {/* Main headline */}
                        <div ref={headlineRef} className="flex flex-row justify-between items-end">
                            <div className="flex flex-col gap-0.5">
                                <p style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
                                    lineHeight: 1, letterSpacing: '0.08em',
                                    color: 'var(--accent-gold)',
                                    textShadow: '0 0 40px rgba(201,168,76,0.2)',
                                    minHeight: '1.1em',
                                }}>
                                    <TypeWriter
                                        text={[
                                            "CODE THE IMPOSSIBLE.",
                                            "TRADE THE WORLD.",
                                            "BUILD THE FUTURE.",
                                            "DOMINATE THE MARKET.",
                                        ]}
                                        speed={55} variance={25} loop={true} loopDelay={3000} showCursor={true}
                                    />
                                </p>
                            </div>

                            {/* Right descriptor */}
                            <p ref={sublineRef} style={{
                                width: '22%', fontFamily: 'var(--font-body)',
                                fontSize: '0.7rem', color: 'var(--text-secondary)',
                                lineHeight: 1.8, letterSpacing: '0.08em', textAlign: 'right',
                            }}>
                                Orchestrating Real-World Asset liquidity, the Aura Protocol,
                                and neuromorphic web ecosystems — where physical commerce
                                and immersive experience converge.
                            </p>
                        </div>

                    </div>
                </div>

                {/* Scroll indicator */}
                <div
                    ref={scrollRef}
                    className={`hero-scroll-indicator ${scrollHidden ? 'is-hidden' : ''}`}
                    aria-hidden
                >
                    <div className="hero-scroll-chevrons">
                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                            <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" style={{ opacity: 0.5 }}>
                            <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <span className="hero-scroll-label">Scroll</span>
                </div>

            </div>
        </section>
    );
};

export default Hero;
