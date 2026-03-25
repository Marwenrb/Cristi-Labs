import { useEffect } from 'react';
import gsap from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Footer from "../../components/Footer/Footer";

import stickyAura from '../../assets/Medias/sticky/the-aura-protocol.png';
import stickyArch from '../../assets/Medias/sticky/architects-phygital-economy.png';
import ghostLogistics from '../../assets/Medias/Slides/ghost-logistics.png';
import infiniteSeat from '../../assets/Medias/Slides/the-infinite-seat.png';
import apexStadium from '../../assets/Medias/Slides/Virtual Stadium.png';
import galleryTrade from '../../assets/Medias/gallery/global-trade.png';

gsap.registerPlugin(ScrollTrigger);

const ventures = [
    {
        name: "Immersive Commerce",
        category: "SPATIAL COMPUTING",
        description:
            "Redefining retail through spatial computing and mixed-reality shopping experiences that blur the line between digital and physical storefronts.",
        number: "01",
        status: "ACTIVE",
        tags: ["XR Retail", "Spatial UI", "Phygital"],
        img: stickyArch,
    },
    {
        name: "The Aura Protocol",
        category: "FAN ENGAGEMENT",
        description:
            "A next-generation fan engagement protocol powering tokenized experiences for sports, entertainment, and cultural IPs worldwide.",
        number: "02",
        status: "ACTIVE",
        tags: ["Tokenized XP", "Cultural IP", "Web3"],
        img: stickyAura,
    },
    {
        name: "Ghost Logistics",
        category: "SUPPLY CHAIN",
        description:
            "AI-driven supply chain orchestration for high-frequency physical trade across borders and continents. Invisible infrastructure, visible results.",
        number: "03",
        status: "ACTIVE",
        tags: ["AI Routing", "Cross-Border", "Digital Twin"],
        img: ghostLogistics,
    },
    {
        name: "Neuromorphic UI",
        category: "INTERFACE SYSTEMS",
        description:
            "Brain-inspired interface systems that adapt, learn, and respond to user behavior in real-time — transcending conventional user experience paradigms.",
        number: "04",
        status: "CLASSIFIED",
        tags: ["Neural UX", "Adaptive AI", "[REDACTED]"],
        img: galleryTrade,
    },
    {
        name: "Virtual Stadiums",
        category: "DIGITAL ARENAS",
        description:
            "Fully immersive digital arenas for live events, esports, and cultural spectacles — accessible from anywhere on earth, at any scale.",
        number: "05",
        status: "DEVELOPING",
        tags: ["Esports", "Live Events", "Immersive"],
        img: apexStadium,
    },
];

const STATUS_COLOR = {
    ACTIVE:     'var(--accent-ice)',
    DEVELOPING: 'var(--accent-gold)',
    CLASSIFIED: 'var(--error)',
};

const Ventures = () => {
    useEffect(() => {
        document.title = 'Ventures | Cristi Labs';
    }, []);

    useGSAP(() => {
        /* Hero word stagger */
        gsap.from('.vent-hero-word', {
            yPercent: 100,
            opacity: 0,
            stagger: 0.08,
            duration: 1.2,
            ease: 'power4.out',
            delay: 0.2,
        });

        gsap.from('.vent-hero-sub', {
            yPercent: 30,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.7,
        });

        /* Dossier entrance */
        gsap.from('.venture-dossier', {
            opacity: 0,
            xPercent: -3,
            duration: 1.2,
            stagger: 0.18,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.ventures-list',
                start: 'top 75%',
                once: true,
            }
        });

        /* Closing manifesto */
        gsap.from('.vent-closing-content', {
            yPercent: 40,
            opacity: 0,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.vent-closing',
                start: 'top 80%',
                once: true,
            }
        });

        return () => ScrollTrigger.getAll().forEach(t => t.kill());
    }, []);

    const heroWords = ["FIVE", "DIVISIONS.", "ONE", "MANDATE."];

    return (
        <div>
            {/* ═══ Hero Section ═══════════════════════════════════ */}
            <section className="w-dvw md:h-dvh h-[100vh] md:p-2 p-2.5 mb-20">
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-[var(--bg-void)]">
                    {/* Animated grid background */}
                    <div className="ventures-grid-bg" aria-hidden="true" />

                    {/* Ghost text */}
                    <div className="ghost-bg-text" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} aria-hidden="true">
                        VENTURES
                    </div>

                    <div className="p-6 md:p-10 flex flex-col h-full relative z-[1]">
                        <div className="relative h-full flex flex-col">
                            {/* Eyebrow */}
                            <div className="section-eyebrow pt-28 md:pt-36">
                                <span className="section-eyebrow-text">[ 01 ] &middot; VENTURE PORTFOLIO</span>
                            </div>

                            {/* Title */}
                            <div className="overflow-hidden mt-6">
                                <h1
                                    className="text-[var(--text-primary)] flex flex-wrap gap-x-5"
                                    style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: 'clamp(3.5rem, 11vw, 9rem)',
                                        lineHeight: '0.9',
                                        letterSpacing: '0.04em',
                                    }}
                                >
                                    {heroWords.map((word, i) => (
                                        <span key={i} className="inline-block overflow-hidden">
                                            <span className="vent-hero-word inline-block">{word}</span>
                                        </span>
                                    ))}
                                </h1>
                            </div>

                            {/* Bottom row */}
                            <div className="mt-auto flex flex-col md:flex-row md:justify-between md:items-end gap-6 pb-8 md:pb-10 vent-hero-sub">
                                <h2
                                    className="text-[var(--accent)] text-xl md:text-2xl flex flex-col gap-1"
                                    style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.06em' }}
                                >
                                    <span>Building ecosystems</span>
                                    <span>that define tomorrow.</span>
                                </h2>
                                <p
                                    className="md:w-[22%] w-full text-[var(--text-secondary)] text-[0.7rem] font-light tracking-wide leading-relaxed md:text-right"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    From immersive commerce to neuromorphic interfaces — each venture operates as
                                    an autonomous division within the Cristi Labs ecosystem.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Venture Dossiers ═══════════════════════════════ */}
            <section className="w-full px-6 md:px-12 py-16">
                <div className="max-w-7xl mx-auto">
                    {/* Section header */}
                    <div className="flex items-center justify-between mb-16">
                        <div className="section-eyebrow" style={{ marginBottom: 0 }}>
                            <span className="section-eyebrow-text">PORTFOLIO OF VENTURES</span>
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                            <span
                                style={{
                                    display: 'inline-block', width: '6px', height: '6px',
                                    background: 'var(--accent-ice)', borderRadius: '50%',
                                    animation: 'pulsing-dot 2s ease-in-out infinite',
                                }}
                            />
                            <span style={{
                                fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                                color: 'var(--accent-ice)', letterSpacing: '0.3em', textTransform: 'uppercase',
                            }}>
                                3 ACTIVE DIVISIONS
                            </span>
                        </div>
                    </div>

                    {/* Dossier list */}
                    <div className="ventures-list">
                        {ventures.map((v, i) => (
                            <div key={i} className="venture-dossier" data-venture-index={v.number}>
                                {/* Left: Dossier metadata */}
                                <div className="venture-meta">
                                    <span className="venture-index">[ {v.number} ]</span>
                                    <span className="venture-status" style={{ color: STATUS_COLOR[v.status] || 'var(--accent-gold)' }}>
                                        &bull; {v.status}
                                    </span>
                                    <div className="venture-divider" />
                                    <span className="venture-category">{v.category}</span>
                                </div>

                                {/* Center: Core content */}
                                <div className="venture-body">
                                    <h2 className="venture-name">{v.name}</h2>
                                    <p className="venture-desc">{v.description}</p>
                                    <div className="venture-tags">
                                        {v.tags.map((tag, ti) => (
                                            <span key={ti} className="vtag">{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Right: Visual */}
                                <div className="venture-visual">
                                    <img 
                                        src={v.img} 
                                        alt={v.name} 
                                        width={1920}
                                        height={1080}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div className="venture-visual-overlay" />
                                </div>
                            </div>
                        ))}
                        {/* Final border */}
                        <div style={{ borderTop: '1px solid rgba(184,146,74,0.1)' }} />
                    </div>
                </div>
            </section>

            {/* ═══ Closing Manifesto ═══════════════════════════════ */}
            <div className="presidential-rule" />
            <section className="vent-closing w-full px-6 md:px-12 py-32 bg-[var(--bg-void)] relative overflow-hidden">
                <div className="ventures-grid-bg" aria-hidden="true" />

                <div className="vent-closing-content max-w-6xl mx-auto relative z-10">
                    <h2
                        className="text-[var(--text-primary)] leading-[0.95]"
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
                            letterSpacing: '0.03em',
                        }}
                    >
                        We don&rsquo;t follow
                        <br />
                        industries.
                        <br />
                        <span style={{ color: 'var(--accent)' }}>We create them.</span>
                    </h2>

                    <div className="mt-12 flex flex-col md:flex-row justify-between items-start gap-8">
                        <p
                            className="text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl leading-relaxed"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Each venture is unified by a shared commitment to innovation, global reach,
                            and phygital excellence — the DNA of Cristi Labs.
                        </p>

                        {/* Venture count indicators */}
                        <div className="flex items-center gap-4 md:gap-6 shrink-0">
                            {['ACTIVE', 'DEVELOPING', 'CLASSIFIED'].map((s, i) => {
                                const count = ventures.filter(v => v.status === s).length;
                                return (
                                    <div 
                                        key={i} 
                                        className="venture-stat-card group"
                                        style={{
                                            position: 'relative',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '1.5rem 1.25rem',
                                            background: `linear-gradient(135deg, ${STATUS_COLOR[s]}08, ${STATUS_COLOR[s]}15)`,
                                            border: `1px solid ${STATUS_COLOR[s]}30`,
                                            borderRadius: '1rem',
                                            backdropFilter: 'blur(10px)',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            cursor: 'pointer',
                                            minWidth: '90px',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                                            e.currentTarget.style.borderColor = STATUS_COLOR[s];
                                            e.currentTarget.style.boxShadow = `0 12px 40px ${STATUS_COLOR[s]}40, 0 0 0 1px ${STATUS_COLOR[s]}50`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                            e.currentTarget.style.borderColor = `${STATUS_COLOR[s]}30`;
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        {/* Animated dot indicator */}
                                        <div 
                                            style={{
                                                position: 'absolute',
                                                top: '0.75rem',
                                                right: '0.75rem',
                                                width: '6px',
                                                height: '6px',
                                                background: STATUS_COLOR[s],
                                                borderRadius: '50%',
                                                animation: s === 'ACTIVE' ? 'pulsing-dot 2s ease-in-out infinite' : 'none',
                                                boxShadow: `0 0 10px ${STATUS_COLOR[s]}`,
                                            }}
                                        />
                                        
                                        <span style={{
                                            fontFamily: 'var(--font-display)', 
                                            fontSize: '2.5rem',
                                            fontWeight: '600',
                                            color: STATUS_COLOR[s], 
                                            lineHeight: 1,
                                            textShadow: `0 0 20px ${STATUS_COLOR[s]}40`,
                                        }}>
                                            {count}
                                        </span>
                                        <span style={{
                                            fontFamily: 'var(--font-mono)', 
                                            fontSize: '0.5rem',
                                            letterSpacing: '0.3em', 
                                            color: STATUS_COLOR[s],
                                            textTransform: 'uppercase', 
                                            opacity: 0.9,
                                            fontWeight: '500',
                                        }}>
                                            {s}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Ventures;
