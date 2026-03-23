import { useEffect, useState } from 'react';
import gsap from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Footer from "../../components/Footer/Footer";
import TypeWriter from "../../components/TypeWriter/TypeWriter";
import SectionDivider from "../../components/SectionDivider/SectionDivider";
import GlobalReach from "../../components/GlobalReach/GlobalReach";

gsap.registerPlugin(ScrollTrigger);

/* ── Live timestamp ticker ───────────────────────────────────── */
const LiveCoordDisplay = () => {
    const [tick, setTick] = useState(new Date());

    useEffect(() => {
        const id = setInterval(() => setTick(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    const utc = tick.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

    return (
        <div
            className="flex flex-wrap items-center gap-6"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)', letterSpacing: '0.1em' }}
        >
            <span>44.7966° N, 106.9562° W — SHERIDAN WY HQ</span>
            <span style={{ color: 'var(--text-tertiary)', opacity: 0.4 }}>·</span>
            <span style={{ color: 'var(--accent)', opacity: 0.7 }}>{utc}</span>
            <span style={{ color: 'var(--text-tertiary)', opacity: 0.4 }}>·</span>
            <span className="flex items-center gap-1.5">
                <span
                    style={{
                        display: 'inline-block',
                        width: '5px',
                        height: '5px',
                        background: 'var(--accent-ice)',
                        borderRadius: '50%',
                        animation: 'pulsing-dot 2s ease-in-out infinite',
                    }}
                />
                <span style={{ color: 'var(--accent-ice)' }}>SYSTEMS ONLINE</span>
            </span>
        </div>
    );
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

/* ── Trade process steps ─────────────────────────────────────── */
const TRADE_STEPS = [
    {
        step: '01',
        title: 'Source & Qualify',
        desc: 'Supplier verification, commodity grading, and compliance checks across 12+ origin countries.',
    },
    {
        step: '02',
        title: 'Negotiate & Contract',
        desc: 'Real-time market pricing, multi-currency contracts, and digital twin asset binding.',
    },
    {
        step: '03',
        title: 'Route & Transport',
        desc: 'AI-optimized shipping routes, customs pre-clearance, and end-to-end cargo tracking.',
    },
    {
        step: '04',
        title: 'Deliver & Verify',
        desc: 'Last-mile delivery orchestration, immutable delivery receipts, and payment release.',
    },
];

const GlobalTrade = () => {
    useEffect(() => {
        document.title = 'Global Trade | Cristi Labs';
    }, []);

    useGSAP(() => {
        gsap.utils.toArray(".trade-block").forEach((block) => {
            gsap.from(block, {
                yPercent: 25,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: block,
                    start: "top 85%",
                    end: "top 55%",
                    scrub: true,
                },
            });
        });

        /* ── Trade process steps ─────────────────────── */
        gsap.from(".trade-step", {
            yPercent: 30,
            opacity: 0,
            stagger: 0.12,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".trade-process",
                start: "top 80%",
            },
        });

        /* ── Stats count-up ──────────────────────────── */
        const statEls = document.querySelectorAll('.trade-stat-value[data-target]');
        statEls.forEach(el => {
            const target = parseFloat(el.getAttribute('data-target'));
            const suffix = el.getAttribute('data-suffix') || '';
            const prefix = el.getAttribute('data-prefix') || '';
            const isInfinity = el.getAttribute('data-infinity') === 'true';

            if (isInfinity) return; // keep ∞ as-is

            gsap.fromTo(
                el,
                { textContent: '0' },
                {
                    textContent: target,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { textContent: Number.isInteger(target) ? 1 : 0.1 },
                    scrollTrigger: {
                        trigger: '.trade-stats',
                        start: 'top 80%',
                        once: true,
                    },
                    onUpdate() {
                        const val = parseFloat(this.targets()[0].textContent);
                        this.targets()[0].textContent =
                            prefix + (Number.isInteger(target) ? Math.round(val) : val.toFixed(0)) + suffix;
                    },
                }
            );
        });

        gsap.from(".trade-stat", {
            yPercent: 40,
            opacity: 0,
            stagger: 0.1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".trade-stats",
                start: "top 80%",
            },
        });

        gsap.from(".trade-closing h2", {
            yPercent: 40,
            opacity: 0,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".trade-closing",
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
                        <div className="relative h-dvh flex flex-col">
                            {/* Top label */}
                            <p
                                className="text-[.7rem] text-[var(--accent-gold)] uppercase tracking-[0.25em] pt-8 pl-2"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                <TypeWriter
                                    text="GLOBAL TRADE INFRASTRUCTURE"
                                    speed={70}
                                    showCursor={false}
                                    delay={300}
                                />
                            </p>

                            {/* Headline */}
                            <h1
                                className="text-[var(--text-primary)] text-start tracking-wider lg:absolute lg:left-2 lg:top-16 mt-4"
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: 'clamp(3.5rem, 11vw, 9rem)',
                                    lineHeight: '0.9',
                                }}
                            >
                                Move Product.
                                <br />
                                Move Capital.
                            </h1>

                            {/* Bottom row */}
                            <div className="w-full h-auto absolute top-48 md:bottom-[8%] lg:bottom-[9%] flex md:flex-row flex-col md:justify-between md:items-end gap-4">
                                <div className="flex flex-col gap-4">
                                    <h2
                                        className="text-start text-2xl md:tracking-wider leading-5 flex flex-col gap-1"
                                        style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
                                    >
                                        <span>Logistics &amp; Import/Export</span>
                                        <span>across continents.</span>
                                    </h2>
                                    {/* Live coordinate strip */}
                                    <div className="hidden md:block">
                                        <LiveCoordDisplay />
                                    </div>
                                </div>

                                <p
                                    className="md:w-[20%] w-[80%] text-[var(--text-secondary)] text-[0.7rem] font-light tracking-wide lg:text-end mt-2 text-justify"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    High-frequency physical trade operations powered by data, driven by speed,
                                    and tracked by digital twin infrastructure.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Global Reach — interactive world map ═══════════ */}
            <GlobalReach />

            {/* ═══ Content Sections ═══════════════════════════════ */}
            <section className="w-full px-6 md:px-12 py-24">
                <div className="max-w-7xl mx-auto space-y-32">
                    {/* High-Frequency Physical Trade */}
                    <div className="trade-block flex flex-col md:flex-row justify-between items-start gap-12 md:gap-24">
                        <div className="md:w-1/2">
                            <p
                                className="text-[.7rem] text-[var(--accent)] uppercase tracking-[0.25em] mb-6"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Core Discipline
                            </p>
                            <h2
                                className="text-[var(--text-primary)] tracking-wider leading-[0.95]"
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                                }}
                            >
                                High-Frequency
                                <br />
                                Physical Trade
                            </h2>
                        </div>
                        <div className="md:w-1/2 flex flex-col gap-6">
                            <p className="text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed">
                                We operate at the speed of modern commerce—orchestrating bulk commodity
                                flows, premium goods distribution, and cross-border logistics with
                                military-grade precision.
                            </p>
                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                Our trade desk connects suppliers across Asia, Africa, and the Americas
                                with distribution networks in North America and Europe. Every shipment is
                                tracked, every route optimized, every margin maximized.
                            </p>
                        </div>
                    </div>

                    {/* Digital Twin Assets */}
                    <div className="trade-block flex flex-col md:flex-row justify-between items-start gap-12 md:gap-24">
                        <div className="md:w-1/2">
                            <p
                                className="text-[.7rem] text-[var(--accent)] uppercase tracking-[0.25em] mb-6"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Innovation Layer
                            </p>
                            <h2
                                className="text-[var(--text-primary)] tracking-wider leading-[0.95]"
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                                }}
                            >
                                Digital Twin
                                <br />
                                Assets
                            </h2>
                        </div>
                        <div className="md:w-1/2 flex flex-col gap-6">
                            <p className="text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed">
                                Every physical asset in our network has a digital counterpart—a real-time
                                representation that enables predictive analytics, automated compliance, and
                                instant verification.
                            </p>
                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                From warehouse inventory to in-transit cargo, our Digital Twin
                                infrastructure provides unprecedented visibility into the global supply
                                chain, enabling faster decisions and eliminating blind spots.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Trade Process ══════════════════════════════════ */}
            <SectionDivider index={1} total={4} />
            <section className="trade-process w-full px-6 md:px-12 py-24 bg-[var(--bg-surface)]">
                <div className="max-w-7xl mx-auto">
                    <p
                        className="text-[.7rem] text-[var(--accent)] uppercase tracking-wider mb-16"
                        style={{ fontFamily: 'var(--font-mono)' }}
                    >
                        <TypeWriter
                            text="TRADE EXECUTION PROTOCOL"
                            speed={70}
                            triggerOnScroll
                            showCursor={false}
                        />
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {TRADE_STEPS.map((step, i) => (
                            <div key={i} className="trade-step relative">
                                {/* Connector line on desktop */}
                                {i < TRADE_STEPS.length - 1 && (
                                    <div
                                        className="hidden lg:block absolute top-3 left-[calc(100%+1rem)] w-[calc(2rem-2px)] h-px"
                                        style={{
                                            background: 'linear-gradient(to right, var(--accent-gold-dim), transparent)',
                                            opacity: 0.5,
                                        }}
                                    />
                                )}
                                <div className="flex items-center gap-3 mb-5">
                                    <span
                                        style={{
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '0.65rem',
                                            color: 'var(--accent)',
                                            letterSpacing: '0.15em',
                                        }}
                                    >
                                        {step.step}
                                    </span>
                                    <div
                                        style={{
                                            flex: 1,
                                            height: '1px',
                                            background: 'var(--border)',
                                        }}
                                    />
                                </div>
                                <h4
                                    className="text-[var(--text-primary)] mb-3"
                                    style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                                        letterSpacing: '0.04em',
                                    }}
                                >
                                    {step.title}
                                </h4>
                                <p
                                    className="text-[var(--text-secondary)] text-sm leading-relaxed"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ Stats Section ══════════════════════════════════ */}
            <SectionDivider index={2} total={4} />
            <section className="trade-stats w-full px-6 md:px-12 py-24 bg-[var(--bg-void)]">
                <div className="max-w-7xl mx-auto">
                    <p
                        className="text-[.7rem] text-[var(--accent)] uppercase tracking-wider mb-16"
                        style={{ fontFamily: 'var(--font-mono)' }}
                    >
                        Operational Reach
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        <div className="trade-stat">
                            <p
                                className="trade-stat-value text-[var(--text-primary)]"
                                data-target="12"
                                data-suffix="+"
                                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1 }}
                            >
                                12+
                            </p>
                            <p
                                className="text-[var(--accent)] text-sm mt-2 tracking-wider uppercase"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Countries
                            </p>
                        </div>
                        <div className="trade-stat">
                            <p
                                className="trade-stat-value text-[var(--text-primary)]"
                                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1 }}
                            >
                                24/7
                            </p>
                            <p
                                className="text-[var(--accent)] text-sm mt-2 tracking-wider uppercase"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Operations
                            </p>
                        </div>
                        <div className="trade-stat">
                            <p
                                className="trade-stat-value text-[var(--text-primary)]"
                                data-target="100"
                                data-suffix="%"
                                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1 }}
                            >
                                100%
                            </p>
                            <p
                                className="text-[var(--accent)] text-sm mt-2 tracking-wider uppercase"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Digital Tracked
                            </p>
                        </div>
                        <div className="trade-stat">
                            <p
                                className="trade-stat-value text-[var(--text-primary)]"
                                data-infinity="true"
                                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1 }}
                            >
                                &infin;
                            </p>
                            <p
                                className="text-[var(--accent)] text-sm mt-2 tracking-wider uppercase"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Scalability
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Closing Section ════════════════════════════════ */}
            <section className="trade-closing w-full px-6 md:px-12 py-32">
                <div className="max-w-5xl mx-auto">
                    <h2
                        className="text-[var(--text-primary)] tracking-wider leading-[0.95]"
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
                        }}
                    >
                        Where physical goods
                        <br />
                        meet digital precision.
                    </h2>
                    <p className="mt-8 text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl leading-relaxed">
                        Cristi Labs Global Trade is the engine that powers our conglomerate—connecting
                        the tangible world to our digital ecosystem with speed, scale, and
                        intelligence.
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default GlobalTrade;
