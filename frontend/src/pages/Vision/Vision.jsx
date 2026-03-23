import { useEffect } from 'react';
import gsap from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Footer from "../../components/Footer/Footer";
import TypeWriter from "../../components/TypeWriter/TypeWriter";
import SectionDivider from "../../components/SectionDivider/SectionDivider";

gsap.registerPlugin(ScrollTrigger);

const Vision = () => {
    useEffect(() => {
        document.title = 'Vision | Cristi Labs';
    }, []);

    useGSAP(() => {
        gsap.utils.toArray(".manifesto-line").forEach((line) => {
            gsap.from(line, {
                yPercent: 40,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: line,
                    start: "top 85%",
                    end: "top 60%",
                    scrub: true,
                },
            });
        });

        gsap.from(".vision-value", {
            yPercent: 30,
            opacity: 0,
            stagger: 0.15,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".vision-values-grid",
                start: "top 80%",
            },
        });

        gsap.from(".leadership-block", {
            yPercent: 25,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".leadership-block",
                start: "top 85%",
            },
        });

        gsap.from(".vision-closing h2", {
            yPercent: 40,
            opacity: 0,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".vision-closing",
                start: "top 80%",
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    });

    return (
        <div>
            {/* Hero Section */}
            <section className="w-dvw md:h-dvh h-[100vh] md:p-2 p-2.5 mb-20">
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-[var(--bg-void)]">
                    {/* Ambient grid */}
                    <div
                        aria-hidden="true"
                        style={{
                            position: 'absolute', inset: 0,
                            backgroundImage: 'linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)',
                            backgroundSize: '80px 80px', pointerEvents: 'none',
                        }}
                    />
                    <div className="p-6 md:p-10 flex flex-col h-full">
                        <div className="relative h-full flex flex-col">
                            {/* Label — top left, generous breathing room */}
                            <div className="flex items-center gap-4 pt-20 md:pt-28">
                                <div style={{ width: '24px', height: '1px', background: 'var(--accent)' }} />
                                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.28em', color: 'var(--accent-gold)', textTransform: 'uppercase' }}>
                                    <TypeWriter
                                        text="CORPORATE PHILOSOPHY"
                                        speed={80}
                                        showCursor={false}
                                        delay={500}
                                    />
                                </p>
                            </div>

                            {/* Main Title */}
                            <h1
                                className="text-[var(--text-primary)] text-start text-6xl md:text-8xl lg:text-[10rem] mt-8 md:mt-10"
                                style={{ fontFamily: 'var(--font-display)', lineHeight: '0.88', letterSpacing: '0.02em' }}
                            >
                                Where Conviction
                                <br />
                                Becomes Capital.
                            </h1>

                            {/* Bottom row — subtitle + body copy */}
                            <div className="mt-auto flex flex-col md:flex-row md:justify-between md:items-end gap-6 pb-8 md:pb-10">
                                <h2 className="text-[var(--accent)] text-xl md:text-2xl lg:text-3xl flex flex-col gap-1" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.06em' }}>
                                    <span>A thesis for sovereign builders</span>
                                    <span>and global operators.</span>
                                </h2>
                                <p className="md:w-[22%] w-full text-[var(--text-secondary)] text-[0.7rem] font-light tracking-wide leading-relaxed md:text-right" style={{ fontFamily: 'var(--font-body)' }}>
                                    We do not iterate on what exists. We architect what the world has not yet imagined — at the exact convergence point of physical commerce and digital sovereignty.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Manifesto Section */}
            <section className="w-full px-6 md:px-12 py-32">
                <div className="max-w-5xl mx-auto space-y-24">
                    <div className="manifesto-line flex gap-8 md:gap-16 items-start">
                        <span className="hidden md:block shrink-0 mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.2em', opacity: 0.5 }}>§01</span>
                        <div>
                            <p className="text-[0.65rem] text-[var(--accent)] uppercase tracking-[0.3em] mb-8" style={{ fontFamily: 'var(--font-mono)' }}>
                                The Thesis
                            </p>
                            <h2 className="text-[var(--text-primary)] text-3xl md:text-5xl lg:text-6xl tracking-wider leading-[1.1]" style={{ fontFamily: 'var(--font-display)' }}>
                                The next century of value creation belongs to those who refuse to choose between the physical and the digital.
                            </h2>
                        </div>
                    </div>
                    <div className="manifesto-line flex gap-8 md:gap-16 items-start">
                        <span className="hidden md:block shrink-0 mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.2em', opacity: 0.5 }}>§02</span>
                        <p className="text-[var(--text-secondary)] text-xl md:text-2xl leading-relaxed max-w-3xl">
                            Cristi Labs exists because of a single, irreversible insight: the most consequential opportunities on earth live at the exact intersection where Silicon Valley&rsquo;s engineering velocity collides with the raw, unforgiving power of cross-border commerce.
                        </p>
                    </div>
                    <div className="manifesto-line flex gap-8 md:gap-16 items-start">
                        <span className="hidden md:block shrink-0 mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.2em', opacity: 0.5 }}>§03</span>
                        <p className="text-[var(--text-secondary)] text-xl md:text-2xl leading-relaxed max-w-3xl">
                            We are not a startup chasing product-market fit. We are not a consultancy packaging insights. We are a sovereign venture studio and global trade conglomerate — engineering companies, moving physical assets at scale, and building immersive digital ecosystems that collapse the distance between atoms and bits.
                        </p>
                    </div>
                    <div className="manifesto-line flex gap-8 md:gap-16 items-start">
                        <span className="hidden md:block shrink-0 mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.2em', opacity: 0.5 }}>§04</span>
                        {/* Key quote — Cormorant Garamond luxury serif */}
                        <h3
                            style={{
                                fontFamily: 'var(--font-luxury)',
                                fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                                fontWeight: 400,
                                fontStyle: 'italic',
                                color: 'var(--text-primary)',
                                lineHeight: 1.3,
                                letterSpacing: '0.01em',
                            }}
                        >
                            Phygital is not a trend we follow.
                            <br />
                            <span style={{ color: 'var(--accent)', fontStyle: 'normal' }}>
                                It is the operating system we wrote.
                            </span>
                        </h3>
                    </div>
                </div>
            </section>

            {/* Foundational Pillars Section */}
            <SectionDivider index={2} total={4} />
            <section className="w-full px-6 md:px-12 py-28 md:py-36 bg-[var(--bg-void)]">
                <div className="max-w-7xl mx-auto">
                    <p className="text-[0.65rem] text-[var(--accent-gold)] uppercase tracking-[0.3em] mb-16" style={{ fontFamily: 'var(--font-mono)' }}>
                        <TypeWriter
                            text="FOUNDATIONAL PILLARS"
                            speed={80}
                            triggerOnScroll={true}
                            showCursor={false}
                        />
                    </p>
                    <div className="vision-values-grid grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
                        {[
                            {
                                n: '01',
                                title: 'Relentless Innovation',
                                body: 'We engineer what does not yet exist. From neuromorphic interface systems to tokenized fan engagement protocols, every venture begins with a question the market has not thought to ask — and an answer only we can build.',
                            },
                            {
                                n: '02',
                                title: 'Borderless Operations',
                                body: 'Incorporated in Wyoming. Operating across continents. Our trade infrastructure and digital platforms recognize no borders — only velocity, opportunity, and the disciplined execution required to capture both at scale.',
                            },
                            {
                                n: '03',
                                title: 'Uncompromising Excellence',
                                body: 'Every interface pixel, every container shipment, every line of production code reflects a standard that refuses negotiation. Mediocrity is not a risk we manage — it is a reality we have eliminated from our operating vocabulary.',
                            },
                        ].map((pillar, i) => (
                            <div
                                key={i}
                                className="vision-value relative pt-8"
                                style={{
                                    borderTop: '1px solid var(--border)',
                                    paddingLeft: '1.25rem',
                                    borderLeft: '2px solid var(--accent)',
                                }}
                            >
                                <span
                                    className="text-xs tracking-wider"
                                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}
                                >
                                    {pillar.n}
                                </span>
                                <h4
                                    className="mb-4 mt-3"
                                    style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                                        letterSpacing: '0.05em',
                                        color: 'var(--text-primary)',
                                    }}
                                >
                                    {pillar.title}
                                </h4>
                                <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
                                    {pillar.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Leadership Section */}
            <section className="leadership-block w-full py-28 md:py-36 px-6 md:px-12 bg-[var(--bg-void)] text-[var(--text-primary)]">
                <div className="max-w-6xl mx-auto">
                    <p className="text-[0.65rem] text-[var(--accent)] uppercase tracking-[0.3em] mb-12" style={{ fontFamily: 'var(--font-mono)' }}>
                        The Architect
                    </p>

                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
                        <div className="lg:w-1/2">
                            <h3 className="text-4xl md:text-5xl lg:text-6xl tracking-wider leading-[0.95]" style={{ fontFamily: 'var(--font-display)' }}>
                                Marouan
                                <br />
                                Rabai
                            </h3>
                            <p className="text-[var(--accent)] text-xs uppercase tracking-[0.25em] mt-4" style={{ fontFamily: 'var(--font-mono)' }}>
                                Founder &amp; Chief Executive Officer
                            </p>

                            <div className="flex items-center gap-3 mt-10">
                                <a
                                    href="https://marwen-rabai.netlify.app/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '10px',
                                        letterSpacing: '3px',
                                        textTransform: 'uppercase',
                                        color: 'var(--accent)',
                                        background: 'transparent',
                                        border: '1px solid var(--border-strong)',
                                        padding: '14px 28px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        textDecoration: 'none',
                                        transition: 'background var(--duration-mid) var(--ease-out-expo), border-color var(--duration-mid)',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'var(--accent-ghost)';
                                        e.currentTarget.style.borderColor = 'var(--accent)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.borderColor = 'var(--border-strong)';
                                    }}
                                >
                                    View Portfolio →
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
                                <span style={{ border: '1px solid var(--border)', fontFamily: 'var(--font-mono)' }} className="text-[var(--accent)] text-[0.65rem] px-4 py-1.5 tracking-wider uppercase">Venture Architecture</span>
                                <span style={{ border: '1px solid var(--border)', fontFamily: 'var(--font-mono)' }} className="text-[var(--accent)] text-[0.65rem] px-4 py-1.5 tracking-wider uppercase">Global Trade</span>
                                <span style={{ border: '1px solid var(--border)', fontFamily: 'var(--font-mono)' }} className="text-[var(--accent)] text-[0.65rem] px-4 py-1.5 tracking-wider uppercase">Digital Entertainment</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Closing Statement */}
            <SectionDivider index={4} total={4} />
            <section className="vision-closing w-full px-6 md:px-12 py-32">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Rotating headline */}
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 7vw, 6rem)', color: 'var(--accent-gold)', lineHeight: 1, minHeight: '1.1em', letterSpacing: '0.04em', marginBottom: '1rem' }}>
                        <TypeWriter
                            text={["THE VISION.", "THE MISSION.", "THE FUTURE."]}
                            speed={80}
                            loop={true}
                            loopDelay={2000}
                            showCursor={true}
                        />
                    </p>
                    <h2 className="text-[var(--text-primary)] text-4xl md:text-7xl tracking-wider leading-[0.95]" style={{ fontFamily: 'var(--font-display)' }}>
                        The future is not arriving.
                        <br />
                        <span className="text-[var(--accent)]">We are already building it.</span>
                    </h2>
                    <p className="mt-10 text-[var(--text-secondary)] text-sm md:text-base tracking-wider max-w-xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-mono)' }}>
                        Every asset we move, every interface we ship, every protocol we deploy brings the phygital economy one step closer to inevitability.
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Vision;
