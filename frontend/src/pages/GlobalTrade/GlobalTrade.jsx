import gsap from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Footer from "../../components/Footer/Footer";

gsap.registerPlugin(ScrollTrigger);

const GlobalTrade = () => {
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
            {/* Hero Section — mirrors Home Hero wrapper structure */}
            <section className="w-dvw md:h-dvh h-[100vh] md:p-2 p-2.5 mb-20">
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-[var(--bg-void)]">
                    <div className="p-4 flex flex-col md:justify-center">
                        <div className="relative h-dvh">
                            <p className="text-[.7rem] text-[var(--accent)] uppercase tracking-[0.25em] pt-8 pl-2" style={{ fontFamily: 'var(--font-mono)' }}>
                                Global Trade Division
                            </p>
                            <h1
                                className="text-[var(--text-primary)] text-start text-6xl md:text-9xl tracking-wider lg:absolute lg:left-2 lg:top-16 mt-4"
                                style={{ fontFamily: 'var(--font-display)', lineHeight: '0.9' }}
                            >
                                Move Product.
                                <br />
                                Move Capital.
                            </h1>

                            <div className="w-full h-auto absolute top-48 md:bottom-[8%] lg:bottom-[9%] flex md:flex-row flex-col md:justify-between md:items-end">
                                <h2 className="text-start lg:mt-0 text-[var(--accent)] text-2xl md:tracking-wider leading-5 flex flex-col gap-1" style={{ fontFamily: 'var(--font-display)' }}>
                                    <span>Logistics &amp; Import/Export</span>
                                    <span>across continents.</span>
                                </h2>

                                <p className="md:w-[20%] w-[80%] text-[var(--text-secondary)] text-[0.7rem] font-light tracking-wide lg:text-end mt-2 text-justify">
                                    High-frequency physical trade operations powered by data, driven by speed,
                                    and tracked by digital twin infrastructure.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Sections — mirrors Choose/Welcome section layout */}
            <section className="w-full px-6 md:px-12 py-24">
                <div className="max-w-7xl mx-auto space-y-32">
                    {/* High-Frequency Physical Trade */}
                    <div className="trade-block flex flex-col md:flex-row justify-between items-start gap-12 md:gap-24">
                        <div className="md:w-1/2">
                            <p className="text-[.7rem] text-[var(--accent)] uppercase tracking-[0.25em] mb-6" style={{ fontFamily: 'var(--font-mono)' }}>
                                Core Discipline
                            </p>
                            <h2 className="text-[var(--text-primary)] text-3xl md:text-5xl lg:text-6xl tracking-wider leading-[0.95]" style={{ fontFamily: 'var(--font-display)' }}>
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
                            <p className="text-[.7rem] text-[var(--accent)] uppercase tracking-[0.25em] mb-6" style={{ fontFamily: 'var(--font-mono)' }}>
                                Innovation Layer
                            </p>
                            <h2 className="text-[var(--text-primary)] text-3xl md:text-5xl lg:text-6xl tracking-wider leading-[0.95]" style={{ fontFamily: 'var(--font-display)' }}>
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

            {/* Stats Section — mirrors Gallery/StickyCols visual impact */}
            <section className="trade-stats w-full px-6 md:px-12 py-24 bg-[var(--bg-void)]">
                <div className="max-w-7xl mx-auto">
                    <p className="text-[.7rem] text-[var(--accent)] uppercase tracking-wider mb-16" style={{ fontFamily: 'var(--font-mono)' }}>
                        Operational Reach
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        <div className="trade-stat">
                            <p className="text-[var(--text-primary)] text-4xl md:text-6xl tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                                12+
                            </p>
                            <p className="text-[var(--accent)] text-sm mt-2 tracking-wider uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
                                Countries
                            </p>
                        </div>
                        <div className="trade-stat">
                            <p className="text-[var(--text-primary)] text-4xl md:text-6xl tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                                24/7
                            </p>
                            <p className="text-[var(--accent)] text-sm mt-2 tracking-wider uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
                                Operations
                            </p>
                        </div>
                        <div className="trade-stat">
                            <p className="text-[var(--text-primary)] text-4xl md:text-6xl tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                                100%
                            </p>
                            <p className="text-[var(--accent)] text-sm mt-2 tracking-wider uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
                                Digital Tracked
                            </p>
                        </div>
                        <div className="trade-stat">
                            <p className="text-[var(--text-primary)] text-4xl md:text-6xl tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                                &infin;
                            </p>
                            <p className="text-[var(--accent)] text-sm mt-2 tracking-wider uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
                                Scalability
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Closing Section */}
            <section className="trade-closing w-full px-6 md:px-12 py-32">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-[var(--text-primary)] text-4xl md:text-7xl tracking-wider leading-[0.95]" style={{ fontFamily: 'var(--font-display)' }}>
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
