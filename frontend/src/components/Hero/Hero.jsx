import { useRef, useEffect, useState } from 'react';
import gsap from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useMediaQuery } from "react-responsive";
import TypeWriter from "../TypeWriter/TypeWriter";
import heroVideo  from "../../assets/Medias/hero/Cristi Labs Home Video.mp4";

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
    const videoRef    = useRef(null);
    const mobileRef = useRef(null);
    const desktopRef = useRef(null);
    const scrollRef   = useRef(null);
    const [scrollHidden, setScrollHidden] = useState(false);

    // Hide scroll indicator when user scrolls past 100px
    useEffect(() => {
        const onScroll = () => setScrollHidden(window.scrollY > 100);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Desktop: video parallax on scroll
    useGSAP(() => {
        if (isMobile) return;

        gsap.to(".hero-video", {
            yPercent: -12, scale: 1.08, ease: "none",
            scrollTrigger: { trigger: ".hero-section", start: "top top", end: "bottom top", scrub: 1.5 },
        });
    }, [isMobile]);

    // Video fade-in — no poster flash, premium opacity reveal
    useGSAP(() => {
        const vid = videoRef.current;
        if (!vid) return;

        const onCanPlay = () => {
            gsap.to(vid, { opacity: 1, duration: 0.6, ease: 'power2.out' });
        };

        // Already buffered enough (e.g. cached on revisit)
        if (vid.readyState >= 3) {
            onCanPlay();
        } else {
            vid.addEventListener('canplay', onCanPlay, { once: true });
        }

        return () => vid.removeEventListener('canplay', onCanPlay);
    }, []);

    // Desktop entrance: CSS transitions with data-attr selectors
    useEffect(() => {
        if (typeof window === 'undefined' || window.innerWidth < 768) return;

        const root = desktopRef.current;
        if (!root) return;

        const eyebrow = root.querySelector('[data-hero-eyebrow]');
        const title   = root.querySelector('[data-hero-title]');
        const desc    = root.querySelector('[data-hero-desc]');

        [eyebrow, title, desc].forEach(el => {
            if (!el) return;
            el.style.cssText = 'opacity:0;transform:translateY(20px);transition:none;filter:blur(3px);';
        });

        requestAnimationFrame(() => requestAnimationFrame(() => {
            if (eyebrow) {
                setTimeout(() => {
                    eyebrow.style.transition = 'opacity 0.7s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.6s ease';
                    eyebrow.style.opacity = '1'; eyebrow.style.transform = 'translateY(0)'; eyebrow.style.filter = 'blur(0)';
                }, 100);
            }
            if (title) {
                setTimeout(() => {
                    title.style.transition = 'opacity 0.8s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1), filter 0.7s ease';
                    title.style.opacity = '1'; title.style.transform = 'translateY(0)'; title.style.filter = 'blur(0)';
                }, 250);
            }
            if (desc) {
                setTimeout(() => {
                    desc.style.transition = 'opacity 0.7s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.7s ease';
                    desc.style.opacity = '1'; desc.style.transform = 'translateY(0)'; desc.style.filter = 'blur(0px)';
                }, 450);
            }
        }));
    }, []);

    // Mobile entrance: sequential reveal with blur
    useEffect(() => {
        if (typeof window === 'undefined' || window.innerWidth >= 768) return;

        const root = mobileRef.current;
        if (!root) return;

        const label   = root.querySelector('.hero-label-m');
        const typebox = root.querySelector('.hero-type-m');
        const sub     = root.querySelector('.hero-sub-m');

        if (!label || !typebox) return;

        // Hard reset — clear any stuck final-state styles
        [label, typebox, sub].forEach(el => {
            if (!el) return;
            el.style.cssText = 'opacity:0;transform:translateY(28px);transition:none;filter:blur(4px);';
        });

        // Animate after browser paints
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    label.style.transition = 'opacity 0.55s ease, transform 0.65s cubic-bezier(0.16,1,0.3,1), filter 0.5s ease';
                    label.style.opacity    = '1';
                    label.style.transform  = 'translateY(0)';
                    label.style.filter     = 'blur(0px)';
                }, 50);

                setTimeout(() => {
                    typebox.style.transition = 'opacity 0.6s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.55s ease';
                    typebox.style.opacity    = '1';
                    typebox.style.transform  = 'translateY(0)';
                    typebox.style.filter     = 'blur(0px)';
                }, 200);

                if (sub) {
                    setTimeout(() => {
                        sub.style.transition = 'opacity 0.7s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.6s ease';
                        sub.style.opacity    = '1';
                        sub.style.transform  = 'translateY(0)';
                        sub.style.filter     = 'blur(0px)';
                    }, 450);
                }
            });
        });
    }, []);

    // Mobile touch parallax — subtle 3D tilt toward finger
    useEffect(() => {
        if (typeof window === 'undefined' || window.innerWidth >= 768) return;
        const root = mobileRef.current;
        if (!root) return;

        let active = false;
        const handleTouchStart = () => { active = true; };
        const handleTouchEnd   = () => {
            active = false;
            root.style.transition = 'transform 0.8s cubic-bezier(0.16,1,0.3,1)';
            root.style.transform  = 'rotateX(0deg) rotateY(0deg)';
        };
        const handleTouchMove  = (e) => {
            if (!active) return;
            const touch = e.touches[0];
            const rect  = root.getBoundingClientRect();
            const dx    = ((touch.clientX - rect.left) / rect.width  - 0.5) * 6;
            const dy    = ((touch.clientY - rect.top)  / rect.height - 0.5) * 4;
            root.style.transition = 'transform 0.2s ease';
            root.style.transform  = `rotateY(${dx}deg) rotateX(${-dy}deg)`;
        };

        root.addEventListener('touchstart', handleTouchStart, { passive: true });
        root.addEventListener('touchmove',  handleTouchMove,  { passive: true });
        root.addEventListener('touchend',   handleTouchEnd,   { passive: true });

        return () => {
            root.removeEventListener('touchstart', handleTouchStart);
            root.removeEventListener('touchmove',  handleTouchMove);
            root.removeEventListener('touchend',   handleTouchEnd);
        };
    }, []);

    return (
        <section className="hero-section w-dvw md:h-dvh min-h-[100dvh] md:p-2 p-2.5 mb-20">
            <div className="relative w-full h-full min-h-[85vh] md:min-h-0 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden">

                {/* Hero video — real brand asset */}
                <video
                    ref={videoRef}
                    autoPlay loop muted playsInline preload="auto"
                    aria-hidden="true"
                    className="hero-video absolute inset-0 w-full h-full object-cover object-center"
                    style={{ opacity: 0, willChange: 'transform, opacity', pointerEvents: 'none', zIndex: 0 }}
                >
                    <source src={heroVideo} type="video/mp4" />
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
                        style={{ perspective: '1200px', minHeight: '220px' }}
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
                                Silicon Valley engineering meets<br />
                                global commerce infrastructure.<br />
                                <span style={{ color: 'rgba(184,146,76,0.6)' }}>We build what others only imagine.</span>
                            </p>
                        </div>
                    </div>

                    {/* ── DESKTOP layout: bottom-anchored, TypeWriter headline ── */}
                    <div ref={desktopRef} className="hidden md:block absolute bottom-[8%] lg:bottom-[9%] left-0 right-0 px-4">

                        {/* Eyebrow */}
                        <div data-hero-eyebrow style={{ marginBottom: '0.75rem' }}>
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
                        <div className="flex flex-row justify-between items-end">
                            <div data-hero-title className="flex flex-col gap-0.5">
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

                            {/* Right descriptor — side-info panel */}
                            <div style={{
                                width: '22%', maxWidth: '280px', flexShrink: 0,
                                borderRight: '1.5px solid var(--accent-gold-dim)',
                                paddingRight: '0.875rem',
                            }}>
                                <p data-hero-desc style={{
                                    fontFamily: 'var(--font-body)',
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
