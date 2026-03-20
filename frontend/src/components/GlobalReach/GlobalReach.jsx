import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const REGIONS = [
    { id: 'na', label: 'North America', detail: 'HQ Operations · Sheridan, WY · Digital Infrastructure', x: '20%', y: '38%' },
    { id: 'eu', label: 'Europe', detail: 'Trade Corridors · Logistics Networks · Financial Gateways', x: '47%', y: '30%' },
    { id: 'mea', label: 'Middle East & Africa', detail: 'Commodity Flow · Energy Trade · Emerging Markets', x: '56%', y: '50%' },
    { id: 'as', label: 'Asia Pacific', detail: 'Manufacturing Hubs · Supply Chain · Digital Commerce', x: '76%', y: '42%' },
];

export default function GlobalReach() {
    const [active, setActive] = useState(null);
    const sectionRef = useRef(null);

    useGSAP(() => {
        gsap.from('.region-dot', {
            scale: 0,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: 'back.out(2)',
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 70%',
            },
        });

        gsap.from('.global-reach-title', {
            opacity: 0,
            yPercent: 20,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
            },
        });
    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="relative w-full py-24 md:py-40 section-padding overflow-hidden"
            style={{ background: 'var(--bg-void)' }}
        >
            {/* Label */}
            <div className="flex items-center gap-4 mb-16">
                <div style={{ width: '2rem', height: '1px', background: 'var(--accent)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.3em', color: 'var(--accent)', textTransform: 'uppercase' }}>
                    Global Footprint
                </span>
            </div>

            {/* Title */}
            <h2
                className="global-reach-title uppercase leading-none mb-16 md:mb-24"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 10vw, 9rem)', color: 'var(--text-primary)' }}
            >
                Operating<br />
                <span style={{ WebkitTextStroke: '1px var(--accent)', color: 'transparent' }}>Worldwide</span>
            </h2>

            {/* World map container */}
            <div
                className="relative w-full rounded-3xl overflow-hidden"
                style={{
                    aspectRatio: '16/7',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(201,168,76,0.1)',
                }}
            >
                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />

                {/* Region dots */}
                {REGIONS.map(region => (
                    <button
                        key={region.id}
                        className="region-dot absolute"
                        style={{ left: region.x, top: region.y, transform: 'translate(-50%, -50%)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                        onClick={() => setActive(active === region.id ? null : region.id)}
                        aria-label={region.label}
                    >
                        {/* Pulse ring */}
                        <span
                            className="absolute inset-0 rounded-full"
                            style={{ background: 'var(--accent)', opacity: 0.2, animation: 'pulse-ring 2.5s ease-in-out infinite' }}
                        />
                        <span
                            className="relative block"
                            style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent)' }}
                        />

                        {/* Tooltip */}
                        {active === region.id && (
                            <div
                                className="absolute z-10 text-left"
                                style={{
                                    bottom: '1.5rem',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '15rem',
                                    borderRadius: '0.75rem',
                                    padding: '1rem',
                                    background: 'rgba(5,5,7,0.97)',
                                    border: '1px solid rgba(201,168,76,0.3)',
                                    backdropFilter: 'blur(16px)',
                                }}
                            >
                                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                    {region.label}
                                </p>
                                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    {region.detail}
                                </p>
                            </div>
                        )}
                    </button>
                ))}

                {/* Countries label */}
                <div className="absolute bottom-6 right-6 text-right">
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--accent)', lineHeight: 1 }}>47+</span>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '4px' }}>
                        Countries
                    </p>
                </div>
            </div>
        </section>
    );
}
