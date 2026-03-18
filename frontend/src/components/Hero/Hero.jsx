import { useRef } from 'react';
import gsap from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroVideo from "../../assets/Medias/hero/hero-video.mp4";
import heroPoster from "../../assets/Medias/hero/hero-poster.png";
import { useGSAP } from "@gsap/react";
import { useMediaQuery } from "react-responsive";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    const mobileTextRef = useRef(null);

    useGSAP(() => {
        if (!isMobile) {
            gsap.to(".hero-video", {
                yPercent: -15,
                scale: 1.1,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero-section",
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.5,
                },
            });
            return;
        }

        // Mobile: ultra-premium staggered line-reveal entrance
        const tl = gsap.timeline({ delay: 0.5 });
        tl.to('.hero-label-m', {
            opacity: 1,
            duration: 0.55,
            ease: 'power2.out',
        })
        .fromTo('.hero-word-m',
            { yPercent: 115 },
            { yPercent: 0, duration: 0.9, stagger: 0.075, ease: 'power4.out' },
            '-=0.25'
        )
        .to('.hero-sub-m', {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power2.out',
        }, '-=0.4');
    }, [isMobile]);

    return (
        <section className="hero-section w-dvw md:h-dvh min-h-[100dvh] md:p-2 p-2.5 mb-20">
            <div className="relative w-full h-full min-h-[85vh] md:min-h-0 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden">
                {/* Video — responsive, object-cover for mobile */}
                <div className="hero-video-wrap absolute inset-0 z-0 min-h-full min-w-full">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        poster={heroPoster}
                        className="hero-video absolute inset-0 w-full h-full min-w-full min-h-full object-cover object-center"
                    >
                        <source src={heroVideo} type="video/mp4" />
                    </video>
                    <div
                        className="absolute inset-0"
                        aria-hidden
                        style={{
                            background: 'linear-gradient(to top, rgba(11,11,11,0.97) 0%, rgba(11,11,11,0.55) 50%, rgba(11,11,11,0.15) 100%)',
                        }}
                    />
                </div>

                {/* Content — absolute inset-0 guarantees z-10 reliably fills parent on all devices */}
                <div className="absolute inset-0 z-10">
                    {/* Mobile: ultra-premium line-reveal entrance */}
                    <div ref={mobileTextRef} className="absolute bottom-8 left-5 right-5 md:hidden">
                        {/* Corporate label */}
                        <div className="hero-label-m" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '1rem',
                            opacity: 0,
                        }}>
                            <span style={{ width: '20px', height: '1px', background: 'var(--accent)', flexShrink: 0 }} />
                            <span style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.5rem',
                                letterSpacing: '0.25em',
                                textTransform: 'uppercase',
                                color: 'var(--accent)',
                            }}>
                                Cristi Labs · Digital
                            </span>
                        </div>

                        {/* Main display — each line wrapped in overflow:hidden for mask-reveal */}
                        {[
                            { text: 'Code the', accent: true },
                            { text: 'Impossible.', accent: false },
                            { text: 'Trade the', accent: true },
                            { text: 'World.', accent: false },
                        ].map((line, i) => (
                            <div key={i} style={{ overflow: 'hidden', marginTop: i === 2 ? '0.5rem' : 0 }}>
                                <p className="hero-word-m" style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: 'clamp(2.8rem, 13.5vw, 4.2rem)',
                                    lineHeight: 0.88,
                                    letterSpacing: '0.04em',
                                    color: line.accent ? 'var(--accent)' : 'var(--text-primary)',
                                    textShadow: line.accent ? '0 0 32px rgba(212,175,55,0.28)' : 'none',
                                    willChange: 'transform',
                                    display: 'block',
                                }}>
                                    {line.text}
                                </p>
                            </div>
                        ))}

                        {/* Descriptor with vertical gold bar */}
                        <div className="hero-sub-m" style={{
                            marginTop: '1.25rem',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            opacity: 0,
                        }}>
                            <span style={{
                                display: 'inline-block',
                                width: '2px',
                                minHeight: '44px',
                                background: 'linear-gradient(to bottom, var(--accent), transparent)',
                                flexShrink: 0,
                                marginTop: '3px',
                            }} />
                            <p style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.7rem',
                                color: 'var(--text-secondary)',
                                lineHeight: 1.7,
                                letterSpacing: '0.02em',
                            }}>
                                Silicon Valley innovation meets global commerce.<br />
                                We build phygital ecosystems at the frontier.
                            </p>
                        </div>
                    </div>
                    {/* Desktop: original bottom-anchored layout */}
                    <div className="hidden md:block absolute bottom-[8%] lg:bottom-[9%] left-0 right-0 px-4">
                        <div className="flex flex-row justify-between items-end">
                            <div className="flex flex-col gap-1">
                                <p className="text-[var(--accent)] text-2xl tracking-[0.15em]" style={{ fontFamily: 'var(--font-display)' }}>
                                    Code the Impossible.
                                </p>
                                <p className="text-[var(--accent)] text-2xl tracking-[0.15em]" style={{ fontFamily: 'var(--font-display)' }}>
                                    Trade the World.
                                </p>
                                <p className="text-[var(--text-secondary)] text-[0.8125rem] font-light mt-3 leading-relaxed max-w-sm" style={{ fontFamily: 'var(--font-body)' }}>
                                    Silicon Valley innovation meets global commerce. We build phygital ecosystems.
                                </p>
                            </div>
                            <p className="w-[22%] text-[var(--text-secondary)] text-[0.7rem] font-light tracking-[0.08em] leading-relaxed text-right" style={{ fontFamily: 'var(--font-body)' }}>
                                Orchestrating Real-World Asset liquidity, the Aura Protocol, and neuromorphic web ecosystems — where physical commerce and immersive experience converge.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
