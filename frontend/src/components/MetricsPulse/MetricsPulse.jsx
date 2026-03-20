import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const METRICS = [
    { value: '$2.4B', suffix: '+', label: 'Global Trade Volume',   numericValue: 2.4,  prefix: '$', isDecimal: true,  icon: '◈', description: 'Annual GMV across all divisions' },
    { value: '47',    suffix: '+', label: 'Countries Reached',     numericValue: 47,   prefix: '',  isDecimal: false, icon: '◎', description: 'Active operational territories' },
    { value: '12',    suffix: '+', label: 'Venture Divisions',     numericValue: 12,   prefix: '',  isDecimal: false, icon: '◆', description: 'Autonomous business units' },
    { value: '99.97', suffix: '%', label: 'Platform Uptime',       numericValue: 99.97,prefix: '',  isDecimal: true,  icon: '◉', description: 'Infrastructure reliability SLA' },
    { value: '340',   suffix: '+', label: 'Digital Applications',  numericValue: 340,  prefix: '',  isDecimal: false, icon: '⬡', description: 'Deployed across global markets' },
    { value: '4',     suffix: '',  label: 'Continents Active',     numericValue: 4,    prefix: '',  isDecimal: false, icon: '◐', description: 'On-ground operations & logistics' },
];

export default function MetricsPulse() {
    const sectionRef = useRef(null);

    useGSAP(() => {
        // Stagger cards in with scale + y
        gsap.from('.metric-card', {
            opacity: 0,
            y: 40,
            scale: 0.9,
            stagger: 0.1,
            duration: 0.8,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                once: true,
            },
        });

        // Count-up per metric
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
    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="relative w-full py-24 md:py-32 section-padding"
            style={{ background: 'linear-gradient(to bottom, var(--bg-void), #0d0c0c)' }}
        >
            {/* Section label */}
            <div className="flex items-center gap-4 mb-16">
                <div style={{ width: '2rem', height: '1px', background: 'var(--accent)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.3em', color: 'var(--accent)', textTransform: 'uppercase' }}>
                    By The Numbers
                </span>
            </div>

            {/* Metrics grid — 2 cols mobile, 3 cols desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {METRICS.map((metric, i) => (
                    <div
                        key={i}
                        className="metric-card group relative overflow-hidden"
                        style={{
                            borderRadius: '1rem',
                            padding: 'clamp(1.25rem, 4vw, 2rem)',
                            background: 'rgba(255,255,255,0.025)',
                            border: '1px solid rgba(201, 168, 76, 0.12)',
                            backdropFilter: 'blur(8px)',
                        }}
                    >
                        {/* Hover glow */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                            style={{ borderRadius: '1rem', background: 'radial-gradient(circle at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 70%)' }}
                        />

                        {/* Icon */}
                        <span style={{
                            display: 'block',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '1.1rem',
                            color: 'var(--accent)',
                            marginBottom: '0.75rem',
                            lineHeight: 1,
                        }}>
                            {metric.icon}
                        </span>

                        {/* Count value */}
                        <span
                            data-metric={i}
                            className="block"
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                                color: 'var(--text-primary)',
                                lineHeight: 1,
                                marginBottom: '0.5rem',
                            }}
                        >
                            {metric.value}{metric.suffix}
                        </span>

                        {/* Label */}
                        <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.6rem',
                            letterSpacing: '0.2em',
                            color: 'var(--accent)',
                            textTransform: 'uppercase',
                            display: 'block',
                            marginBottom: '0.5rem',
                        }}>
                            {metric.label}
                        </span>

                        {/* Description */}
                        <span style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.68rem',
                            color: 'var(--text-tertiary)',
                            lineHeight: 1.5,
                            display: 'block',
                        }}>
                            {metric.description}
                        </span>

                        {/* Bottom accent line */}
                        <div
                            className="absolute bottom-0 left-0 h-px"
                            style={{ background: 'var(--accent)', width: '0%', transition: 'width 1.5s ease' }}
                            ref={el => {
                                if (!el) return;
                                ScrollTrigger.create({
                                    trigger: el,
                                    start: 'top 85%',
                                    once: true,
                                    onEnter: () => { el.style.width = '100%'; },
                                });
                            }}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
