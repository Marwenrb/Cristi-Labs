import { useEffect, useState } from 'react';
import gsap from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Footer from "../../components/Footer/Footer";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ── Pillar data ─────────────────────────────────────────────── */
const PILLARS = [
    {
        n: '01',
        title: 'INTEGRITY ABOVE VELOCITY',
        body: 'We do not ship fast and break things. We architect with intention, test with rigor, and deploy with conviction. Speed without integrity is entropy — and entropy is the enemy of permanence.',
    },
    {
        n: '02',
        title: 'ARCHITECTURE OVER IMPROVISATION',
        body: 'Every system, every product, every trade corridor is designed before it is built. We do not improvise infrastructure. We engineer it with the precision of a sovereign institution and the ambition of a frontier laboratory.',
    },
    {
        n: '03',
        title: 'PERMANENCE OVER TREND',
        body: 'We build for the century, not the quarter. While others chase cycles, we construct foundations — platforms and protocols that will outlast the hype that surrounds them.',
    },
    {
        n: '04',
        title: 'LEVERAGE AS STRATEGY, NOT NECESSITY',
        body: 'Capital, technology, and human talent are levers — not crutches. We deploy them with surgical precision, amplifying outcomes without creating dependency. Every resource is an instrument of deliberate acceleration.',
    },
];

const Vision = () => {
    const [openPillar, setOpenPillar] = useState(null);

    useEffect(() => {
        document.title = 'Vision | Cristi Labs';
    }, []);

    useGSAP(() => {
        /* Hero word stagger */
        gsap.from('.vis-hero-word', {
            yPercent: 100,
            opacity: 0,
            stagger: 0.08,
            duration: 1.2,
            ease: 'power4.out',
            delay: 0.2,
        });

        gsap.from('.vis-hero-sub', {
            yPercent: 30,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.7,
        });

        /* Manifesto — SplitText per line */
        const manifestoEl = document.querySelector('.manifesto-text');
        if (manifestoEl) {
            const split = new SplitText('.manifesto-text', { type: 'lines' });
            gsap.from(split.lines, {
                yPercent: 40,
                opacity: 0,
                stagger: 0.1,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.manifesto-text',
                    start: 'top 80%',
                    once: true,
                }
            });

            /* Cleanup */
            return () => {
                split.revert();
                ScrollTrigger.getAll().forEach(t => t.kill());
            };
        }

        /* Leadership */
        gsap.from('.vis-leadership', {
            yPercent: 25,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.vis-leadership',
                start: 'top 85%',
                once: true,
            }
        });

        /* Closing */
        gsap.from('.vis-closing h2', {
            yPercent: 40,
            opacity: 0,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.vis-closing',
                start: 'top 80%',
                once: true,
            }
        });

        return () => ScrollTrigger.getAll().forEach(t => t.kill());
    }, []);

    return (
        <div>
            {/* ═══ Hero — Monolithic Typography ═══════════════════ */}
            <section className="w-dvw md:h-dvh h-[100vh] md:p-2 p-2.5 mb-20">
                <div className="vision-grain relative w-full h-full rounded-[2.5rem] overflow-hidden bg-[var(--bg-void)]">
                    {/* Ghost text */}
                    <div className="ghost-bg-text" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} aria-hidden="true">
                        VISION
                    </div>

                    <div className="p-6 md:p-10 flex flex-col h-full relative z-[1]">
                        <div className="relative h-full flex flex-col">
                            {/* Eyebrow */}
                            <div className="section-eyebrow" style={{ paddingTop: 'clamp(7rem, 14vw, 9rem)' }}>
                                <span className="section-eyebrow-text">[ 03 ] &middot; CORPORATE PHILOSOPHY</span>
                            </div>

                            {/* Title — 3 lines */}
                            <div className="overflow-hidden mt-6">
                                <h1
                                    className="text-[var(--text-primary)]"
                                    style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: 'clamp(3.5rem, 10vw, 9rem)',
                                        lineHeight: '0.92',
                                        letterSpacing: '0.03em',
                                    }}
                                >
                                    {['BUILT FOR', 'A WORLD', 'THAT DOESN\'T'].map((line, i) => (
                                        <span key={i} className="block overflow-hidden">
                                            <span className="vis-hero-word inline-block">{line}</span>
                                        </span>
                                    ))}
                                    <span className="block overflow-hidden">
                                        <span className="vis-hero-word inline-block">
                                            EXIST <span style={{ color: 'var(--accent)' }}>YET.</span>
                                        </span>
                                    </span>
                                </h1>
                            </div>

                            {/* Bottom subtitle */}
                            <div className="mt-auto flex flex-col md:flex-row md:justify-between md:items-end gap-6 pb-8 md:pb-10 vis-hero-sub">
                                <h2
                                    className="text-[var(--accent)] text-xl md:text-2xl flex flex-col gap-1"
                                    style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.06em' }}
                                >
                                    <span>A thesis for sovereign builders</span>
                                    <span>and global operators.</span>
                                </h2>
                                <p className="md:w-[22%] w-full text-[var(--text-secondary)] text-[0.7rem] font-light tracking-wide leading-relaxed md:text-right" style={{ fontFamily: 'var(--font-body)' }}>
                                    We do not iterate on what exists. We architect what the world has not yet imagined.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Manifesto ═══════════════════════════════════════ */}
            <section className="page-section">
                <div className="max-w-4xl mx-auto">
                    <div className="section-eyebrow mb-16">
                        <span className="section-eyebrow-text">THE THESIS</span>
                    </div>

                    <div className="manifesto-text" style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2rem, 5vw, 4rem)',
                        lineHeight: 1.15,
                        letterSpacing: '0.03em',
                        color: 'var(--text-primary)',
                    }}>
                        The next century of value creation belongs to those who refuse to choose between
                        the physical and the digital. Cristi Labs exists because of a single, irreversible
                        insight: the most consequential opportunities on earth live at the exact intersection
                        where engineering velocity collides with the raw, unforgiving power of cross-border
                        commerce.
                    </div>

                    <div className="mt-16 flex flex-col gap-8">
                        <p className="text-[var(--text-secondary)] text-xl md:text-2xl leading-relaxed max-w-3xl">
                            We are not a startup chasing product-market fit. We are not a consultancy
                            packaging insights. We are a sovereign venture studio and global trade
                            conglomerate — engineering companies, moving physical assets at scale,
                            and building immersive digital ecosystems that collapse the distance between
                            atoms and bits.
                        </p>

                        <h3 style={{
                            fontFamily: 'var(--font-luxury)',
                            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                            fontWeight: 400,
                            fontStyle: 'italic',
                            color: 'var(--text-primary)',
                            lineHeight: 1.3,
                            letterSpacing: '0.01em',
                            marginTop: '2rem',
                        }}>
                            &ldquo;Phygital is not a trend we follow.
                            <br />
                            <span style={{ color: 'var(--accent)', fontStyle: 'normal' }}>
                                It is the operating system we wrote.&rdquo;
                            </span>
                        </h3>
                    </div>
                </div>
            </section>

            {/* ═══ Foundational Pillars — Accordion ═══════════════ */}
            <div className="presidential-rule" />
            <section className="page-section bg-[var(--bg-void)]">
                <div className="max-w-5xl mx-auto">
                    <div className="section-eyebrow mb-16">
                        <span className="section-eyebrow-text">FOUNDATIONAL PILLARS</span>
                    </div>

                    <div>
                        {PILLARS.map((pillar, i) => {
                            const isOpen = openPillar === i;
                            return (
                                <div
                                    key={i}
                                    className={`pillar-row ${isOpen ? 'is-open' : ''}`}
                                    onClick={() => setOpenPillar(isOpen ? null : i)}
                                    role="button"
                                    tabIndex={0}
                                    aria-expanded={isOpen}
                                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenPillar(isOpen ? null : i); } }}
                                >
                                    <div className="pillar-row-header">
                                        <div className="flex items-center gap-6">
                                            <span style={{
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: '0.55rem',
                                                letterSpacing: '0.3em',
                                                color: 'var(--accent-gold)',
                                            }}>
                                                [ {pillar.n} ]
                                            </span>
                                            <h4 style={{
                                                fontFamily: 'var(--font-display)',
                                                fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                                                letterSpacing: '0.08em',
                                                color: 'var(--text-primary)',
                                            }}>
                                                {pillar.title}
                                            </h4>
                                        </div>
                                        <span style={{
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '1rem',
                                            color: 'var(--accent-gold)',
                                            transition: 'transform 0.3s',
                                            transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                                        }}>
                                            +
                                        </span>
                                    </div>
                                    <div className="pillar-expand-rule" />
                                    <div
                                        className="pillar-expand-body"
                                        style={{
                                            maxHeight: isOpen ? '200px' : '0',
                                            opacity: isOpen ? 1 : 0,
                                        }}
                                    >
                                        <p style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.9375rem',
                                            lineHeight: '1.7',
                                            padding: '0 0 2rem 3.5rem',
                                            maxWidth: '600px',
                                        }}>
                                            {pillar.body}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        <div style={{ borderTop: '1px solid rgba(184,146,74,0.1)' }} />
                    </div>
                </div>
            </section>

            {/* ═══ Leadership ═════════════════════════════════════ */}
            <div className="presidential-rule" />
            <section className="vis-leadership leadership-section w-full py-28 md:py-36 px-6 md:px-12 bg-[var(--bg-void)]">
                <div className="max-w-6xl mx-auto relative z-[1]">
                    <div className="section-eyebrow mb-12">
                        <span className="section-eyebrow-text">THE ARCHITECT</span>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
                        <div className="lg:w-1/2">
                            <h3
                                className="text-4xl md:text-5xl lg:text-6xl tracking-wider leading-[0.95]"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Marouan
                                <br />
                                Rabai
                            </h3>
                            <p
                                className="text-[var(--accent)] text-xs uppercase tracking-[0.25em] mt-4"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Founder &amp; Chief Executive Officer
                            </p>

                            <div className="flex items-center gap-3 mt-10">
                                <a
                                    href="https://marwen-rabai.netlify.app/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="terminal-submit"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <span>&rsaquo;</span>
                                    VIEW PORTFOLIO
                                    <span>&rarr;</span>
                                </a>
                            </div>
                        </div>

                        <div className="lg:w-1/2 flex flex-col gap-6">
                            <p className="text-[var(--text-primary)] text-xl md:text-2xl font-light leading-[1.3] tracking-wide">
                                Orchestrating the convergence of Silicon Valley innovation and global commerce infrastructure.
                            </p>
                            <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
                                A builder at the intersection of digital entertainment and high-frequency international trade. Marouan founded Cristi Labs to engineer phygital ecosystems where immersive technology meets real-world asset movement — creating sovereign platforms that operate beyond conventional industry boundaries.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {['Venture Architecture', 'Global Trade', 'Digital Entertainment'].map((tag, i) => (
                                    <span key={i} className="vtag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Closing Statement ══════════════════════════════ */}
            <div className="presidential-rule" />
            <section className="vis-closing w-full px-6 md:px-12 py-32">
                <div className="max-w-5xl mx-auto text-center">
                    <h2
                        className="text-[var(--text-primary)] tracking-wider leading-[0.95]"
                        style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}
                    >
                        The future is not arriving.
                        <br />
                        <span className="text-[var(--accent)]">We are already building it.</span>
                    </h2>
                    <p
                        className="mt-10 text-[var(--text-secondary)] text-sm md:text-base tracking-wider max-w-xl mx-auto leading-relaxed"
                        style={{ fontFamily: 'var(--font-mono)' }}
                    >
                        Every asset we move, every interface we ship, every protocol we deploy
                        brings the phygital economy one step closer to inevitability.
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Vision;
