import { useRef, useEffect, useState } from 'react';
import gsap from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useMediaQuery } from "react-responsive";
import TypeWriter from "../TypeWriter/TypeWriter";
import heroVideo  from "../../assets/Medias/hero/Cristi Labs Home Video.mp4";
import heroPoster from "../../assets/Medias/hero/hero-poster.png";

gsap.registerPlugin(ScrollTrigger);

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

const Hero = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    const mobileRef = useRef(null);
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

        gsap.to(".hero-video", {
            yPercent: -12, scale: 1.08, ease: "none",
            scrollTrigger: { trigger: ".hero-section", start: "top top", end: "bottom top", scrub: 1.5 },
        });

        const tl = gsap.timeline({ delay: 0.3 });
        tl.from(eyebrowRef.current, { opacity: 0, y: 20, duration: 0.8, ease: 'expo.out' }, 0.5)
          .from(headlineRef.current, { opacity: 0, y: 40, duration: 1, ease: 'expo.out' }, 0.7)
          .from(sublineRef.current, { opacity: 0, y: 20, duration: 0.8, ease: 'expo.out' }, 1.1);
    }, [isMobile]);

    // Mobile: CSS transition-based entrance — zero GSAP dependency
    useEffect(() => {
        if (typeof window === 'undefined' || window.innerWidth >= 768) return;

        const el = mobileRef.current;
        if (!el) return;

        const label = el.querySelector('.hero-label-m');
        const typeBlock = el.querySelector('.hero-type-m');
        const sub   = el.querySelector('.hero-sub-m');

        // Set start state — hidden
        [label, typeBlock, sub].forEach(node => {
            if (!node) return;
            node.style.opacity = '0';
            node.style.transform = 'translateY(20px)';
            node.style.transition = 'none';
        });
        if (sub) sub.style.filter = 'blur(6px)';

        // Double-rAF then CSS transitions
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (label) {
                    label.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    label.style.opacity = '1';
                    label.style.transform = 'translateY(0)';
                }

                setTimeout(() => {
                    if (typeBlock) {
                        typeBlock.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
                        typeBlock.style.opacity = '1';
                        typeBlock.style.transform = 'translateY(0)';
                    }
                }, 200);

                setTimeout(() => {
                    if (sub) {
                        sub.style.transition = 'opacity 0.8s ease, transform 0.8s ease, filter 0.8s ease';
                        sub.style.opacity = '1';
                        sub.style.transform = 'translateY(0)';
                        sub.style.filter = 'blur(0px)';
                    }
                }, 600);
            });
        });
    }, []); // eslint-disable-line

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

                    {/* ── MOBILE layout: bottom-anchored with TypeWriter ── */}
                    <div
                        ref={mobileRef}
                        className="absolute bottom-8 left-5 right-5 md:hidden"
                        style={{ perspective: '1200px' }}
                    >
                        {/* Corporate label */}
                        <div className="hero-label-m" style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            marginBottom: '1rem',
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

                        {/* Typewriter headline — mobile */}
                        <div className="hero-type-m" style={{ minHeight: '4.4rem' }}>
                            <p style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'clamp(2.4rem, 12vw, 3.5rem)',
                                lineHeight: 0.92,
                                letterSpacing: '0.04em',
                                color: 'var(--accent-gold)',
                                textShadow: '0 0 32px rgba(201,168,76,0.28)',
                                textTransform: 'uppercase',
                            }}>
                                <TypeWriter
                                    text={[
                                        "CODE THE IMPOSSIBLE.",
                                        "TRADE THE WORLD.",
                                        "BUILD THE FUTURE.",
                                        "DOMINATE THE MARKET.",
                                    ]}
                                    speed={50}
                                    variance={20}
                                    loop={true}
                                    loopDelay={2500}
                                    showCursor={true}
                                    delay={800}
                                />
                            </p>
                        </div>

                        {/* Descriptor */}
                        <div className="hero-sub-m" style={{
                            marginTop: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '12px',
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
