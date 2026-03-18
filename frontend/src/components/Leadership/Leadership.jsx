import React from "react";

const Leadership = () => {
    return (
        <section className="leadership-section w-full py-28 md:py-36 px-6 md:px-12 bg-[var(--bg-void)] text-[var(--text-primary)]">
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
                                className="group relative inline-flex items-center gap-2 px-8 py-4 border border-[var(--border-strong)] text-sm tracking-[0.2em] uppercase overflow-hidden transition-all duration-300 hover:bg-[var(--accent)] hover:text-[var(--bg-void)] hover:border-[var(--accent)]"
                            >
                                <span className="absolute inset-0 bg-[var(--accent)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" />
                                <span className="relative z-10">View Portfolio</span>
                                <svg className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
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
                            <span className="border border-[var(--border)] text-[var(--accent)] text-[0.65rem] px-4 py-1.5 tracking-wider uppercase" style={{ fontFamily: 'var(--font-mono)' }}>Venture Architecture</span>
                            <span className="border border-[var(--border)] text-[var(--accent)] text-[0.65rem] px-4 py-1.5 tracking-wider uppercase" style={{ fontFamily: 'var(--font-mono)' }}>Global Trade</span>
                            <span className="border border-[var(--border)] text-[var(--accent)] text-[0.65rem] px-4 py-1.5 tracking-wider uppercase" style={{ fontFamily: 'var(--font-mono)' }}>Digital Entertainment</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Leadership;
