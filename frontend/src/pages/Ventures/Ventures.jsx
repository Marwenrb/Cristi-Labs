import { useEffect, useRef } from 'react';
import gsap from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Footer from "../../components/Footer/Footer";
import TypeWriter from "../../components/TypeWriter/TypeWriter";
import SectionDivider from "../../components/SectionDivider/SectionDivider";

gsap.registerPlugin(ScrollTrigger);

const ventures = [
    {
        name: "Immersive Commerce",
        tagline: "Retail, Reimagined",
        description:
            "Redefining retail through spatial computing and mixed-reality shopping experiences that blur the line between digital and physical storefronts.",
        number: "01",
        accent: "var(--text-primary)",
        status: "ACTIVE",
        metric: "∞ Storefronts",
    },
    {
        name: "The Aura Protocol",
        tagline: "Fan Engagement 3.0",
        description:
            "A next-generation fan engagement protocol powering tokenized experiences for sports, entertainment, and cultural IPs worldwide.",
        number: "02",
        accent: "var(--accent)",
        status: "ACTIVE",
        metric: "12+ IPs",
    },
    {
        name: "Ghost Logistics",
        tagline: "Invisible Supply Chains",
        description:
            "AI-driven supply chain orchestration for high-frequency physical trade across borders and continents. Invisible infrastructure, visible results.",
        number: "03",
        accent: "var(--text-primary)",
        status: "ACTIVE",
        metric: "24/7 Ops",
    },
    {
        name: "Neuromorphic UI",
        tagline: "Beyond UX",
        description:
            "Brain-inspired interface systems that adapt, learn, and respond to user behavior in real-time—transcending conventional user experience paradigms.",
        number: "04",
        accent: "var(--accent)",
        status: "CLASSIFIED",
        metric: "[REDACTED]",
    },
    {
        name: "Virtual Stadiums",
        tagline: "The Arena, Everywhere",
        description:
            "Fully immersive digital arenas for live events, esports, and cultural spectacles—accessible from anywhere on earth, at any scale.",
        number: "05",
        accent: "var(--text-primary)",
        status: "DEVELOPING",
        metric: "Est. 2026",
    },
];

/* ── Status color map ─────────────────────────────────────────── */
const STATUS_STYLE = {
    ACTIVE:     { color: 'var(--accent-ice)',  border: 'rgba(94,234,212,0.3)' },
    DEVELOPING: { color: 'var(--accent)',       border: 'rgba(201,168,76,0.3)' },
    CLASSIFIED: { color: 'var(--error)',        border: 'rgba(192,57,43,0.45)'  },
};

/* ── Ambient grid background ─────────────────────────────────── */
const AmbientGrid = () => (
    <div
        aria-hidden="true"
        style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
                'linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            pointerEvents: 'none',
        }}
    />
);

/* ── Single venture row ─────────────────────────────────────── */
const VentureItem = ({ venture, index }) => {
    const rowRef = useRef(null);

    const handleEnter = () => {
        const el = rowRef.current;
        if (!el) return;
        el.style.borderLeftColor = 'var(--accent)';
        el.style.paddingLeft = '20px';
        el.style.background = 'rgba(201,168,76,0.025)';
    };

    const handleLeave = () => {
        const el = rowRef.current;
        if (!el) return;
        el.style.borderLeftColor = 'transparent';
        el.style.paddingLeft = '0px';
        el.style.background = 'transparent';
    };

    const statusStyle = STATUS_STYLE[venture.status] || STATUS_STYLE.ACTIVE;

    return (
        <div
            ref={rowRef}
            className={`venture-item-${index} border-t border-[var(--border)] py-16 md:py-20 flex flex-col md:flex-row justify-between items-start gap-8 md:gap-16`}
            style={{
                borderLeft: '2px solid transparent',
                paddingLeft: '0px',
                transition: 'border-left-color 0.4s var(--ease-out-expo), padding-left 0.4s var(--ease-out-expo), background 0.4s',
            }}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            <div className="flex items-start gap-6 md:gap-10 md:w-1/2">
                <span
                    className="text-sm tracking-wider mt-2 shrink-0"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}
                >
                    {venture.number}
                </span>
                <div style={{ position: 'relative' }}>
                    {/* Ghost number — decorative background digit */}
                    <span
                        aria-hidden="true"
                        style={{
                            position: 'absolute',
                            top: '-0.6em',
                            right: '-0.15em',
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(5rem, 12vw, 9rem)',
                            color: 'rgba(201,168,76,0.038)',
                            lineHeight: 1,
                            letterSpacing: '-0.02em',
                            userSelect: 'none',
                            pointerEvents: 'none',
                            zIndex: 0,
                        }}
                    >
                        {venture.number}
                    </span>
                    {/* Status + metric pills */}
                    <div className="flex flex-wrap items-center gap-2 mb-4" style={{ position: 'relative', zIndex: 1 }}>
                        <span
                            style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '7px',
                                letterSpacing: '0.2em',
                                color: statusStyle.color,
                                textTransform: 'uppercase',
                                border: `1px solid ${statusStyle.border}`,
                                padding: '3px 8px',
                            }}
                        >
                            {venture.status}
                        </span>
                        <span
                            style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '7px',
                                letterSpacing: '0.15em',
                                color: 'var(--text-tertiary)',
                                textTransform: 'uppercase',
                                border: '1px solid rgba(255,255,255,0.06)',
                                padding: '3px 8px',
                            }}
                        >
                            {venture.metric}
                        </span>
                    </div>
                    <h2
                        className="tracking-wider leading-[0.95]"
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(1.75rem, 4vw, 3.75rem)',
                            color: venture.accent,
                            position: 'relative',
                            zIndex: 1,
                        }}
                    >
                        {venture.name}
                    </h2>
                    <p
                        className="text-xs uppercase tracking-[0.2em] mt-3"
                        style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', position: 'relative', zIndex: 1 }}
                    >
                        {venture.tagline}
                    </p>
                </div>
            </div>
            <p className="md:w-1/3 text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
                {venture.description}
            </p>
        </div>
    );
};

const Ventures = () => {
    useEffect(() => {
        document.title = 'Ventures | Cristi Labs';
    }, []);

    useGSAP(() => {
        ventures.forEach((_, i) => {
            gsap.from(`.venture-item-${i}`, {
                yPercent: 30,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: `.venture-item-${i}`,
                    start: "top 85%",
                    end: "top 55%",
                    scrub: true,
                },
            });
        });

        gsap.from(".ventures-closing-content", {
            yPercent: 40,
            opacity: 0,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".ventures-closing",
                start: "top 80%",
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    });

    return (
        <div>
            {/* ═══ Hero Section ═══════════════════════════════════ */}
            <section className="w-dvw md:h-dvh h-[100vh] md:p-2 p-2.5 mb-20">
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-[var(--bg-void)]">
                    <AmbientGrid />

                    <div className="p-4 flex flex-col md:justify-center">
                        <div className="relative h-dvh">
                            <p
                                className="text-[.7rem] text-[var(--accent-gold)] uppercase tracking-[0.25em] pt-8 pl-2"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                <TypeWriter
                                    text="VENTURE DIVISIONS"
                                    speed={90}
                                    triggerOnScroll={false}
                                    showCursor={false}
                                    delay={300}
                                />
                            </p>

                            <h1
                                className="text-[var(--text-primary)] text-start tracking-wider lg:absolute lg:left-2 lg:top-16 mt-4"
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: 'clamp(3.5rem, 11vw, 9rem)',
                                    lineHeight: '0.9',
                                }}
                            >
                                Five Niches.
                                <br />
                                Infinite Reach.
                            </h1>

                            <div className="w-full h-auto absolute top-48 md:bottom-[8%] lg:bottom-[9%] flex md:flex-row flex-col md:justify-between md:items-end">
                                <h2
                                    className="text-start lg:mt-0 text-2xl md:tracking-wider leading-5 flex flex-col gap-1"
                                    style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
                                >
                                    <span>Building ecosystems</span>
                                    <span>that define tomorrow.</span>
                                </h2>
                                <p
                                    className="md:w-[20%] w-[80%] text-[var(--text-secondary)] text-[0.7rem] font-light tracking-wide lg:text-end mt-2 text-justify"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    From immersive commerce to neuromorphic interfaces—each venture operates as
                                    an autonomous division within the Cristi Labs ecosystem.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Ventures Showcase ═══════════════════════════════ */}
            <SectionDivider index={1} total={3} />
            <section className="w-full px-6 md:px-12 py-16">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-16">
                        <p
                            className="text-[.7rem] text-[var(--accent-gold)] uppercase tracking-wider"
                            style={{ fontFamily: 'var(--font-mono)' }}
                        >
                            <TypeWriter
                                text="PORTFOLIO OF VENTURES"
                                speed={70}
                                triggerOnScroll
                                showCursor={false}
                            />
                        </p>
                        {/* Active count indicator */}
                        <div className="hidden md:flex items-center gap-2">
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: '6px',
                                    height: '6px',
                                    background: 'var(--accent-ice)',
                                    borderRadius: '50%',
                                    animation: 'pulsing-dot 2s ease-in-out infinite',
                                }}
                            />
                            <span
                                style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.6rem',
                                    color: 'var(--accent-ice)',
                                    letterSpacing: '0.3em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                3 ACTIVE DIVISIONS
                            </span>
                        </div>
                    </div>

                    {ventures.map((venture, index) => (
                        <VentureItem key={index} venture={venture} index={index} />
                    ))}
                    <div className="border-t border-[var(--border)]" />
                </div>
            </section>

            {/* ═══ Closing Manifesto ═══════════════════════════════ */}
            <SectionDivider index={2} total={3} />
            <section className="ventures-closing w-full px-6 md:px-12 py-32 bg-[var(--bg-void)] relative overflow-hidden">
                {/* Ambient grid — subtle version for closing */}
                <AmbientGrid />

                <div className="ventures-closing-content max-w-6xl mx-auto relative z-10">
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
                            and phygital excellence—the DNA of Cristi Labs.
                        </p>

                        {/* Venture count indicators */}
                        <div className="flex items-center gap-6 shrink-0">
                            {['ACTIVE', 'DEVELOPING', 'CLASSIFIED'].map((s, i) => {
                                const style = STATUS_STYLE[s];
                                const count = ventures.filter(v => v.status === s).length;
                                return (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <span
                                            style={{
                                                fontFamily: 'var(--font-display)',
                                                fontSize: '2rem',
                                                color: style.color,
                                                lineHeight: 1,
                                            }}
                                        >
                                            {count}
                                        </span>
                                        <span
                                            style={{
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: '0.55rem',
                                                letterSpacing: '0.25em',
                                                color: style.color,
                                                textTransform: 'uppercase',
                                                opacity: 0.8,
                                            }}
                                        >
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
