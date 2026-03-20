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
    },
    {
        name: "The Aura Protocol",
        tagline: "Fan Engagement 3.0",
        description:
            "A next-generation fan engagement protocol powering tokenized experiences for sports, entertainment, and cultural IPs worldwide.",
        number: "02",
        accent: "var(--accent)",
    },
    {
        name: "Ghost Logistics",
        tagline: "Invisible Supply Chains",
        description:
            "AI-driven supply chain orchestration for high-frequency physical trade across borders and continents. Invisible infrastructure, visible results.",
        number: "03",
        accent: "var(--text-primary)",
    },
    {
        name: "Neuromorphic UI",
        tagline: "Beyond UX",
        description:
            "Brain-inspired interface systems that adapt, learn, and respond to user behavior in real-time—transcending conventional user experience paradigms.",
        number: "04",
        accent: "var(--accent)",
    },
    {
        name: "Virtual Stadiums",
        tagline: "The Arena, Everywhere",
        description:
            "Fully immersive digital arenas for live events, esports, and cultural spectacles—accessible from anywhere on earth, at any scale.",
        number: "05",
        accent: "var(--text-primary)",
    },
];

const Ventures = () => {
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

        gsap.from(".ventures-closing h2", {
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
            {/* Hero Section — mirrors Home Hero wrapper structure */}
            <section className="w-dvw md:h-dvh h-[100vh] md:p-2 p-2.5 mb-20">
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-[var(--bg-void)]">
                    <div className="p-4 flex flex-col md:justify-center">
                        <div className="relative h-dvh">
                            <p className="text-[.7rem] text-[var(--accent-gold)] uppercase tracking-[0.25em] pt-8 pl-2" style={{ fontFamily: 'var(--font-mono)' }}>
                                <TypeWriter
                                    text="VENTURE DIVISIONS"
                                    speed={90}
                                    triggerOnScroll={false}
                                    showCursor={false}
                                    delay={300}
                                />
                            </p>
                            <h1
                                className="text-[var(--text-primary)] text-start text-6xl md:text-9xl tracking-wider lg:absolute lg:left-2 lg:top-16 mt-4"
                                style={{ fontFamily: 'var(--font-display)', lineHeight: '0.9' }}
                            >
                                Five Niches.
                                <br />
                                Infinite Reach.
                            </h1>

                            <div className="w-full h-auto absolute top-48 md:bottom-[8%] lg:bottom-[9%] flex md:flex-row flex-col md:justify-between md:items-end">
                                <h2 className="text-start lg:mt-0 text-[var(--accent)] text-2xl md:tracking-wider leading-5 flex flex-col gap-1" style={{ fontFamily: 'var(--font-display)' }}>
                                    <span>Building ecosystems</span>
                                    <span>that define tomorrow.</span>
                                </h2>

                                <p className="md:w-[20%] w-[80%] text-[var(--text-secondary)] text-[0.7rem] font-light tracking-wide lg:text-end mt-2 text-justify">
                                    From immersive commerce to neuromorphic interfaces—each venture operates as
                                    an autonomous division within the Cristi Labs ecosystem.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ventures Showcase */}
            <SectionDivider index={1} total={3} />
            <section className="w-full px-6 md:px-12 py-16">
                <div className="max-w-7xl mx-auto">
                    <p className="text-[.7rem] text-[var(--accent-gold)] uppercase tracking-wider mb-16" style={{ fontFamily: 'var(--font-mono)' }}>
                        <TypeWriter
                            text="PORTFOLIO OF VENTURES"
                            speed={70}
                            triggerOnScroll={true}
                            showCursor={false}
                        />
                    </p>
                    {ventures.map((venture, index) => (
                        <div
                            key={index}
                            className={`venture-item-${index} border-t border-[var(--border)] py-16 md:py-20 flex flex-col md:flex-row justify-between items-start gap-8 md:gap-16`}
                        >
                            <div className="flex items-start gap-6 md:gap-10 md:w-1/2">
                                <span className="text-[var(--accent)] text-sm tracking-wider mt-2" style={{ fontFamily: 'var(--font-mono)' }}>
                                    {venture.number}
                                </span>
                                <div>
                                    <h2
                                        className="text-3xl md:text-5xl lg:text-6xl tracking-wider leading-[0.95]"
                                        style={{ color: venture.accent, fontFamily: 'var(--font-display)' }}
                                    >
                                        {venture.name}
                                    </h2>
                                    <p className="text-[var(--accent)] text-xs uppercase tracking-[0.2em] mt-3" style={{ fontFamily: 'var(--font-mono)' }}>
                                        {venture.tagline}
                                    </p>
                                </div>
                            </div>
                            <p className="md:w-1/3 text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
                                {venture.description}
                            </p>
                        </div>
                    ))}
                    <div className="border-t border-[var(--border)]"></div>
                </div>
            </section>

            {/* Closing Manifesto */}
            <SectionDivider index={2} total={3} />
            <section className="ventures-closing w-full px-6 md:px-12 py-32 bg-[var(--bg-void)]">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-[var(--text-primary)] text-4xl md:text-7xl tracking-wider leading-[0.95]" style={{ fontFamily: 'var(--font-display)' }}>
                        We don&rsquo;t follow
                        <br />
                        industries.
                        <br />
                        <span className="text-[var(--accent)]">We create them.</span>
                    </h2>
                    <p className="mt-12 text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl leading-relaxed">
                        Each venture is unified by a shared commitment to innovation, global reach,
                        and phygital excellence—the DNA of Cristi Labs.
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Ventures;
