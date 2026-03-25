import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const METRICS = [
    { value: '$2.4B', suffix: '+', label: 'Global Trade Volume',   numericValue: 2.4,  prefix: '$', isDecimal: true,  icon: '◈', description: 'Combined gross merchandise value flowing through all Cristi Labs venture divisions globally' },
    { value: '47',    suffix: '+', label: 'Countries Reached',     numericValue: 47,   prefix: '',  isDecimal: false, icon: '◎', description: 'Active operational territories' },
    { value: '12',    suffix: '+', label: 'Venture Divisions',     numericValue: 12,   prefix: '',  isDecimal: false, icon: '◆', description: 'Autonomous business units' },
    { value: '99.97', suffix: '%', label: 'Platform Uptime',       numericValue: 99.97,prefix: '',  isDecimal: true,  icon: '◉', description: 'Infrastructure reliability SLA' },
    { value: '340',   suffix: '+', label: 'Digital Applications',  numericValue: 340,  prefix: '',  isDecimal: false, icon: '⬡', description: 'Deployed across global markets' },
    { value: '4',     suffix: '',  label: 'Continents Active',     numericValue: 4,    prefix: '',  isDecimal: false, icon: '◐', description: 'On-ground operations & logistics' },
];

export default function MetricsPulse() {
    const sectionRef = useRef(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();

        mm.add('(min-width: 768px)', () => {
            // Desktop: stagger cards in with scale + y
            gsap.from('.metric-card', {
                opacity: 0,
                y: 40,
                stagger: 0.08,
                duration: 0.8,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 75%',
                    once: true,
                },
            });
        });

        mm.add('(max-width: 767px)', () => {
            // Mobile: CSS-driven reveals via IntersectionObserver (no scrub)
            const cards = sectionRef.current?.querySelectorAll('.metric-card');
            if (!cards) return;
            cards.forEach((card, i) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(24px)';
                card.style.transition = 'none';

                const obs = new IntersectionObserver(([entry]) => {
                    if (!entry.isIntersecting) return;
                    obs.disconnect();
                    setTimeout(() => {
                        card.style.transition = `opacity 0.6s ease ${i * 0.07}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s`;
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                }, { threshold: 0.15 });
                obs.observe(card);
            });
        });

        // Count-up per metric (works on both desktop and mobile)
        METRICS.forEach((metric, i) => {
            const el = sectionRef.current?.querySelector(`[data-metric="${i}"]`);
            if (!el) return;

            const obj = { val: 0 };
            gsap.to(obj, {
                val: metric.numericValue,
                duration: 2.2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                    once: true,
                },
                onUpdate: () => {
                    const display = metric.isDecimal
                        ? obj.val.toFixed(metric.suffix === '%' ? 2 : 1)
                        : Math.floor(obj.val).toString();
                    el.textContent = metric.prefix + display + metric.suffix;
                },
            });
        });

        return () => mm.revert();
    }, { scope: sectionRef });

    // Bottom accent line animation via IntersectionObserver (no GSAP needed)
    const accentLineRef = (el) => {
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { el.style.transform = 'scaleX(1)'; obs.disconnect(); }
        }, { threshold: 0.5 });
        obs.observe(el);
    };

    return (
        <section
            ref={sectionRef}
            style={{
                background: 'var(--bg-void)',
                position: 'relative',
                padding: '5rem 0 0',
                overflow: 'hidden',
            }}
        >
            {/* Top rule with label */}
            <div style={{
                display: 'flex', alignItems: 'center',
                padding: '0 clamp(1.25rem, 6vw, 6rem)',
                marginBottom: '3rem',
                gap: '16px',
            }}>
                <div style={{ width: '28px', height: '1px', background: 'var(--accent)' }} />
                <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                    letterSpacing: '0.34em', textTransform: 'uppercase', color: 'var(--accent)',
                }}>By The Numbers</span>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(184,146,74,0.2), transparent)' }} />
                <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                    letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(184,146,74,0.58)',
                }}>Cristi Labs LLC · 2026</span>
            </div>

            {/* FEATURED metric — full width, architectural */}
            <div style={{
                padding: '0 clamp(1.25rem, 6vw, 6rem)',
                marginBottom: '1px',
            }}>
                <div
                    className="metric-card"
                    style={{
                        background: 'rgba(184,146,74,0.03)',
                        border: '1px solid rgba(184,146,74,0.1)',
                        borderRadius: '0',
                        padding: 'clamp(2rem, 4vw, 3rem)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <div>
                        <p style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                            letterSpacing: '0.3em', textTransform: 'uppercase',
                            color: 'rgba(184,146,74,0.5)', marginBottom: '0.5rem',
                        }}>{METRICS[0].icon} Annual GMV · All Divisions</p>
                        <span
                            data-metric="0"
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'clamp(4rem, 10vw, 8rem)',
                                color: 'var(--text-primary)', lineHeight: 0.9, display: 'block',
                            }}
                        >
                            {METRICS[0].value}{METRICS[0].suffix}
                        </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                            letterSpacing: '0.22em', textTransform: 'uppercase',
                            color: 'var(--accent)', marginBottom: '4px',
                        }}>{METRICS[0].label}</p>
                        <p style={{
                            fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                            color: 'var(--text-secondary)', maxWidth: '220px', lineHeight: 1.6,
                        }}>
                            {METRICS[0].description}
                        </p>
                    </div>
                    {/* Decorative bottom accent */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        height: '2px',
                        background: 'linear-gradient(to right, var(--accent), transparent)',
                    }} />
                </div>
            </div>

            {/* 5 smaller metrics in a row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
                gap: '1px',
                background: 'rgba(184,146,74,0.06)',
                margin: '1px clamp(1.25rem, 6vw, 6rem) 0',
                borderRadius: '0 0 0.5rem 0.5rem',
                overflow: 'hidden',
            }}>
                {METRICS.slice(1).map((metric, i) => (
                    <div
                        key={i}
                        className="metric-card"
                        style={{
                            background: 'var(--bg-void)',
                            padding: 'clamp(1.25rem, 3vw, 2rem)',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'background 0.3s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,146,74,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-void)'}
                    >
                        <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: '14px',
                            color: 'rgba(184,146,74,0.58)', display: 'block', marginBottom: '0.75rem',
                        }}>{metric.icon}</span>
                        <span
                            data-metric={i + 1}
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                                color: 'var(--text-primary)', lineHeight: 1, display: 'block',
                                marginBottom: '0.4rem',
                            }}
                        >
                            {metric.value}{metric.suffix}
                        </span>
                        <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                            letterSpacing: '0.2em', color: 'var(--accent)',
                            textTransform: 'uppercase', display: 'block', marginBottom: '4px',
                        }}>{metric.label}</span>
                        <span style={{
                            fontFamily: 'var(--font-body)', fontSize: '0.65rem',
                            color: 'var(--text-secondary)', lineHeight: 1.5, display: 'block',
                        }}>{metric.description}</span>
                        {/* Bottom accent */}
                        <div
                            style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                height: '1px', background: 'var(--accent)',
                                transform: 'scaleX(0)', transformOrigin: 'left',
                                transition: 'transform 1.5s ease',
                            }}
                            ref={accentLineRef}
                        />
                    </div>
                ))}
            </div>

            {/* Bottom spacing */}
            <div style={{ height: 'clamp(3rem, 6vw, 5rem)' }} />
        </section>
    );
}
