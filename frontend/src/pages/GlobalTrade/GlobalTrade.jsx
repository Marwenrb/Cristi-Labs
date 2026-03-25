import { useEffect, useState } from 'react';
import gsap from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Footer from "../../components/Footer/Footer";

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
            <span>44.7966&deg; N, 106.9562&deg; W &mdash; SHERIDAN WY HQ</span>
            <span style={{ color: 'var(--text-tertiary)', opacity: 0.4 }}>&middot;</span>
            <span style={{ color: 'var(--accent)', opacity: 0.7 }}>{utc}</span>
            <span style={{ color: 'var(--text-tertiary)', opacity: 0.4 }}>&middot;</span>
            <span className="flex items-center gap-1.5">
                <span
                    style={{
                        display: 'inline-block', width: '5px', height: '5px',
                        background: 'var(--accent-ice)', borderRadius: '50%',
                        animation: 'pulsing-dot 2s ease-in-out infinite',
                    }}
                />
                <span style={{ color: 'var(--accent-ice)' }}>SYSTEMS ONLINE</span>
            </span>
        </div>
    );
};

/* ── Trade process steps ─────────────────────────────────────── */
const TRADE_STEPS = [
    { step: '01', title: 'Source & Qualify', desc: 'Supplier verification, commodity grading, and compliance checks across 12+ origin countries.' },
    { step: '02', title: 'Negotiate & Contract', desc: 'Real-time market pricing, multi-currency contracts, and digital twin asset binding.' },
    { step: '03', title: 'Route & Transport', desc: 'AI-optimized shipping routes, customs pre-clearance, and end-to-end cargo tracking.' },
    { step: '04', title: 'Deliver & Verify', desc: 'Last-mile delivery orchestration, immutable delivery receipts, and payment release.' },
];

/* ── Feature data ──────────────────────────────────────────── */
const FEATURES = [
    { n: '01', title: 'Real-World Asset Liquidity', desc: 'Transforming physical commodities into trackable, tradeable digital positions with instant settlement and sovereign-grade compliance.' },
    { n: '02', title: 'Digital Twin Infrastructure', desc: 'Every container, every pallet, every shipment mirrored in real-time — enabling predictive analytics and zero-blind-spot operations.' },
    { n: '03', title: 'Multi-Corridor Route Network', desc: 'Transpacific, Euro-Asia, and MENA corridors operating 24/7 with AI-optimized routing and customs pre-clearance protocols.' },
];

const GlobalTrade = () => {
    useEffect(() => {
        document.title = 'Global Trade | Cristi Labs';
    }, []);

    useGSAP(() => {
        /* Hero words */
        gsap.from('.gt-hero-word', {
            yPercent: 100,
            opacity: 0,
            stagger: 0.08,
            duration: 1.2,
            ease: 'power4.out',
            delay: 0.2,
        });

        gsap.from('.gt-hero-sub', {
            yPercent: 30,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.7,
        });

        /* Feature grid */
        gsap.from('.trade-feature-col', {
            yPercent: 30,
            opacity: 0,
            stagger: 0.15,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.trade-feature-grid',
                start: 'top 80%',
                once: true,
            }
        });

        /* Trade process steps */
        gsap.from('.trade-step', {
            yPercent: 30,
            opacity: 0,
            stagger: 0.12,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.trade-process',
                start: 'top 80%',
                once: true,
            }
        });

        /* Stats count-up */
        const statEls = document.querySelectorAll('.trade-stat-value[data-target]');
        statEls.forEach(el => {
            const target = parseFloat(el.getAttribute('data-target'));
            const suffix = el.getAttribute('data-suffix') || '';
            const prefix = el.getAttribute('data-prefix') || '';

            gsap.fromTo(
                el,
                { textContent: '0' },
                {
                    textContent: target,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { textContent: 1 },
                    scrollTrigger: {
                        trigger: '.trade-stats',
                        start: 'top 80%',
                        once: true,
                    },
                    onUpdate() {
                        const val = Math.round(parseFloat(this.targets()[0].textContent));
                        this.targets()[0].textContent = prefix + val + suffix;
                    },
                }
            );
        });

        gsap.from('.trade-stat', {
            yPercent: 40,
            opacity: 0,
            stagger: 0.1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.trade-stats',
                start: 'top 80%',
                once: true,
            }
        });

        /* SVG route lines — trigger draw animation */
        gsap.from('.trade-route-line', {
            strokeDashoffset: 1000,
            duration: 3,
            stagger: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.trade-map-section',
                start: 'top 80%',
                once: true,
            }
        });

        /* Closing */
        gsap.from('.gt-closing h2', {
            yPercent: 40,
            opacity: 0,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.gt-closing',
                start: 'top 80%',
                once: true,
            }
        });

        return () => ScrollTrigger.getAll().forEach(t => t.kill());
    }, []);

    return (
        <div>
            {/* ═══ Hero Section ═══════════════════════════════════ */}
            <section className="w-dvw md:h-dvh h-[100vh] md:p-2 p-2.5 mb-20">
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-[var(--bg-void)]">
                    {/* Animated grid */}
                    <div className="ventures-grid-bg" aria-hidden="true" />

                    {/* Ghost text */}
                    <div className="ghost-bg-text" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} aria-hidden="true">
                        GLOBAL TRADE
                    </div>

                    <div className="p-6 md:p-10 flex flex-col h-full relative z-[1]">
                        <div className="relative h-full flex flex-col">
                            {/* Eyebrow */}
                            <div className="section-eyebrow pt-20 md:pt-28">
                                <span className="section-eyebrow-text">[ 02 ] &middot; GLOBAL OPERATIONS</span>
                            </div>

                            {/* Title */}
                            <div className="overflow-hidden mt-6">
                                <h1
                                    className="text-[var(--text-primary)]"
                                    style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: 'clamp(3.5rem, 11vw, 9rem)',
                                        lineHeight: '0.9',
                                        letterSpacing: '0.04em',
                                    }}
                                >
                                    <span className="inline-block overflow-hidden">
                                        <span className="gt-hero-word inline-block">LOGISTICS THAT</span>
                                    </span>
                                    <br />
                                    <span className="inline-block overflow-hidden">
                                        <span className="gt-hero-word inline-block" style={{ color: 'var(--accent)' }}>MOVE THE WORLD</span>
                                    </span>
                                </h1>
                            </div>

                            {/* Bottom row */}
                            <div className="mt-auto flex flex-col md:flex-row md:justify-between md:items-end gap-6 pb-8 md:pb-10 gt-hero-sub">
                                <div className="flex flex-col gap-4">
                                    <p
                                        className="text-[var(--text-secondary)] text-sm md:text-base max-w-lg leading-relaxed"
                                        style={{ fontFamily: 'var(--font-body)' }}
                                    >
                                        From container routing to digital twin infrastructure —
                                        we operate at the scale of sovereign trade.
                                    </p>
                                    <div className="hidden md:block">
                                        <LiveCoordDisplay />
                                    </div>
                                </div>
                                <a
                                    href="/contact"
                                    style={{
                                        fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                                        letterSpacing: '0.3em', color: 'var(--accent)',
                                        textDecoration: 'none', textTransform: 'uppercase',
                                    }}
                                >
                                    [ REQUEST OPERATIONS BRIEF &rarr; ]
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Ops Ticker ═════════════════════════════════════ */}
            <div className="ops-ticker">
                <div className="ops-ticker-inner">
                    ACTIVE CORRIDORS: 12 &nbsp;&nbsp;&middot;&nbsp;&nbsp; TRADE LANES: TRANSPACIFIC &middot; EURO-ASIA &middot; MENA &nbsp;&nbsp;&middot;&nbsp;&nbsp; DIGITAL TWIN: ACTIVE &nbsp;&nbsp;&middot;&nbsp;&nbsp; STATUS: OPERATIONAL &nbsp;&nbsp;&middot;&nbsp;&nbsp; ACTIVE CORRIDORS: 12 &nbsp;&nbsp;&middot;&nbsp;&nbsp; TRADE LANES: TRANSPACIFIC &middot; EURO-ASIA &middot; MENA &nbsp;&nbsp;&middot;&nbsp;&nbsp; DIGITAL TWIN: ACTIVE &nbsp;&nbsp;&middot;&nbsp;&nbsp; STATUS: OPERATIONAL
                </div>
            </div>

            {/* ═══ SVG World Map with Trade Routes ═══════════════ */}
            <section className="trade-map-section page-section relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative">
                    <div className="section-eyebrow mb-12">
                        <span className="section-eyebrow-text">TRADE CORRIDOR NETWORK</span>
                    </div>

                    <svg viewBox="0 0 1000 500" className="w-full h-auto opacity-30" style={{ maxHeight: '400px' }}>
                        {/* Simplified world map outlines — gold strokes */}
                        <g stroke="var(--accent-gold)" strokeWidth="0.5" fill="none" opacity="0.4">
                            {/* North America */}
                            <path d="M 150 120 Q 180 100 220 110 L 250 130 Q 270 150 260 180 L 230 200 Q 200 220 170 210 L 140 180 Q 130 150 150 120Z" />
                            {/* South America */}
                            <path d="M 220 260 Q 240 250 260 270 L 270 310 Q 260 350 240 370 L 220 360 Q 200 330 210 290Z" />
                            {/* Europe */}
                            <path d="M 440 100 Q 470 90 500 100 L 510 130 Q 500 150 480 150 L 450 140 Q 430 120 440 100Z" />
                            {/* Africa */}
                            <path d="M 460 190 Q 490 180 510 200 L 520 260 Q 510 310 490 330 L 470 320 Q 450 280 455 230Z" />
                            {/* Asia */}
                            <path d="M 560 80 Q 620 70 700 90 L 740 130 Q 750 170 730 200 L 680 210 Q 620 200 580 170 L 550 130 Q 545 100 560 80Z" />
                            {/* Australia */}
                            <path d="M 750 330 Q 790 320 820 340 L 830 370 Q 810 390 780 390 L 750 370 Q 740 350 750 330Z" />
                        </g>

                        {/* Hub dots */}
                        {[
                            { cx: 200, cy: 160, label: 'US' },
                            { cx: 480, cy: 120, label: 'EU' },
                            { cx: 650, cy: 140, label: 'ASIA' },
                            { cx: 530, cy: 230, label: 'MENA' },
                        ].map((hub, i) => (
                            <g key={i}>
                                <circle cx={hub.cx} cy={hub.cy} r="4" fill="var(--accent-gold)" opacity="0.8" />
                                <circle cx={hub.cx} cy={hub.cy} r="8" fill="none" stroke="var(--accent-gold)" strokeWidth="0.5" opacity="0.4" />
                            </g>
                        ))}

                        {/* Animated trade routes */}
                        <path className="trade-route-line" d="M 200 160 Q 340 80 480 120" fill="none" stroke="#B8924A" strokeWidth="0.8" strokeDasharray="1000" strokeDashoffset="1000" />
                        <path className="trade-route-line" d="M 480 120 Q 560 100 650 140" fill="none" stroke="#B8924A" strokeWidth="0.8" strokeDasharray="1000" strokeDashoffset="1000" />
                        <path className="trade-route-line" d="M 200 160 Q 400 200 530 230" fill="none" stroke="#B8924A" strokeWidth="0.8" strokeDasharray="1000" strokeDashoffset="1000" />
                        <path className="trade-route-line" d="M 530 230 Q 600 200 650 140" fill="none" stroke="#B8924A" strokeWidth="0.8" strokeDasharray="1000" strokeDashoffset="1000" />
                    </svg>
                </div>
            </section>

            {/* ═══ Feature Grid — 3-Column Intelligence ═══════════ */}
            <section className="page-section">
                <div className="max-w-7xl mx-auto">
                    <div className="section-eyebrow mb-12">
                        <span className="section-eyebrow-text">OPERATIONAL CAPABILITIES</span>
                    </div>

                    <div className="trade-feature-grid">
                        {FEATURES.map((f, i) => (
                            <div key={i} className="trade-feature-col">
                                <span style={{
                                    fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                                    letterSpacing: '0.3em', color: 'var(--accent-gold)',
                                }}>
                                    {f.n}
                                </span>
                                <h3 style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                                    letterSpacing: '0.06em',
                                    color: 'var(--text-primary)',
                                    marginTop: '1rem',
                                    marginBottom: '1rem',
                                }}>
                                    {f.title}
                                </h3>
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.875rem',
                                    lineHeight: '1.7',
                                }}>
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ Trade Process ══════════════════════════════════ */}
            <div className="presidential-rule" />
            <section className="trade-process w-full px-6 md:px-12 py-24 bg-[var(--bg-surface)]">
                <div className="max-w-7xl mx-auto">
                    <div className="section-eyebrow mb-16">
                        <span className="section-eyebrow-text">TRADE EXECUTION PROTOCOL</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {TRADE_STEPS.map((step, i) => (
                            <div key={i} className="trade-step relative">
                                {i < TRADE_STEPS.length - 1 && (
                                    <div
                                        className="hidden lg:block absolute top-3 left-[calc(100%+1rem)] w-[calc(2rem-2px)] h-px"
                                        style={{ background: 'linear-gradient(to right, var(--accent-gold-dim), transparent)', opacity: 0.5 }}
                                    />
                                )}
                                <div className="flex items-center gap-3 mb-5">
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.15em' }}>
                                        {step.step}
                                    </span>
                                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                                </div>
                                <h4
                                    className="text-[var(--text-primary)] mb-3"
                                    style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', letterSpacing: '0.04em' }}
                                >
                                    {step.title}
                                </h4>
                                <p className="text-[var(--text-secondary)] text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ Stats Section ══════════════════════════════════ */}
            <div className="presidential-rule" />
            <section className="trade-stats w-full px-6 md:px-12 py-24 bg-[var(--bg-void)]">
                <div className="max-w-7xl mx-auto">
                    <div className="section-eyebrow mb-16">
                        <span className="section-eyebrow-text">OPERATIONAL REACH</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        {[
                            { value: '12+', target: '12', suffix: '+', label: 'Countries' },
                            { value: '24/7', label: 'Operations' },
                            { value: '100%', target: '100', suffix: '%', label: 'Digital Tracked' },
                            { value: '\u221E', label: 'Scalability' },
                        ].map((stat, i) => (
                            <div key={i} className="trade-stat" style={{ borderTop: '1px solid rgba(201,168,76,0.18)', paddingTop: '1.5rem' }}>
                                <p
                                    className={`trade-stat-value text-[var(--text-primary)]`}
                                    {...(stat.target ? { 'data-target': stat.target, 'data-suffix': stat.suffix } : {})}
                                    style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1 }}
                                >
                                    {stat.value}
                                </p>
                                <p className="text-[var(--accent)] text-sm mt-2 tracking-wider uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ Closing Section ════════════════════════════════ */}
            <section className="gt-closing w-full px-6 md:px-12 py-32">
                <div className="max-w-5xl mx-auto">
                    <div className="section-eyebrow mb-10">
                        <span className="section-eyebrow-text">INFRASTRUCTURE STATEMENT</span>
                    </div>
                    <h2
                        className="text-[var(--text-primary)] tracking-wider leading-[0.95]"
                        style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}
                    >
                        Where physical goods
                        <br />
                        meet digital precision.
                    </h2>
                    <p className="mt-8 text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl leading-relaxed">
                        Cristi Labs Global Trade is the engine that powers our conglomerate — connecting
                        the tangible world to our digital ecosystem with speed, scale, and intelligence.
                    </p>
                    <div style={{
                        marginTop: '3rem', paddingTop: '2rem',
                        borderTop: '1px solid rgba(201,168,76,0.08)',
                        display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap',
                    }}>
                        <a
                            href="/contact"
                            className="terminal-submit"
                            style={{ textDecoration: 'none' }}
                        >
                            <span>&rsaquo;</span>
                            OPEN A TRADE CHANNEL
                            <span>&rarr;</span>
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default GlobalTrade;
