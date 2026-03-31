import { useState, useEffect } from 'react';
import gsap from 'gsap/all';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Footer from '../../components/Footer/Footer';
import TypeWriter from '../../components/TypeWriter/TypeWriter';
import SectionDivider from '../../components/SectionDivider/SectionDivider';

gsap.registerPlugin(ScrollTrigger);

const VAULT_TIERS = [
    {
        tier: 'SOVEREIGN',
        level: '001',
        description: 'Directorial access, priority acquisition rights, and personal executive briefings.',
        clearance: 'ULTRA',
        items: ['Directorial Briefings', 'First Right of Acquisition', 'Private Events', 'Advisory Council'],
        isClassified: false,
    },
    {
        tier: 'ELITE',
        level: '002',
        description: 'Curated drops, exclusive merchandise, digital collectibles, and insider intelligence.',
        clearance: 'SECRET',
        items: ['Curated Product Drops', 'Digital Collectibles', 'Insider Intelligence', 'Community Access'],
        isClassified: false,
    },
    {
        tier: 'CLASSIFIED',
        level: '003',
        description: '[REDACTED — CLEARANCE REQUIRED]',
        clearance: 'CLASSIFIED',
        items: ['[REDACTED]', '[REDACTED]', '[REDACTED]', '[REDACTED]'],
        isClassified: true,
    },
];

const VAULT_STATS = [
    { value: '∞', label: 'Exclusive SKUs' },
    { value: '3', label: 'Clearance Tiers' },
    { value: '2026', label: 'Access Opens' },
    { value: '100%', label: 'Members Only' },
];

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

/* ── Corner bracket decoration ────────────────────────────────── */
const CornerBrackets = () => (
    <>
        {[
            { top: '24px', left: '24px', bt: true, bl: true },
            { top: '24px', right: '24px', bt: true, br: true },
            { bottom: '24px', left: '24px', bb: true, bl: true },
            { bottom: '24px', right: '24px', bb: true, br: true },
        ].map((pos, i) => (
            <div
                key={i}
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    top: pos.top,
                    bottom: pos.bottom,
                    left: pos.left,
                    right: pos.right,
                    width: '20px',
                    height: '20px',
                    borderTop: pos.bt ? '1px solid rgba(201,168,76,0.2)' : 'none',
                    borderBottom: pos.bb ? '1px solid rgba(201,168,76,0.2)' : 'none',
                    borderLeft: pos.bl ? '1px solid rgba(201,168,76,0.2)' : 'none',
                    borderRight: pos.br ? '1px solid rgba(201,168,76,0.2)' : 'none',
                    pointerEvents: 'none',
                }}
            />
        ))}
    </>
);

const Store = () => {
    const [email, setEmail] = useState('');
    const [emailFocused, setEmailFocused] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [emailError, setEmailError] = useState(false);

    useEffect(() => {
        document.title = 'The Vault | Cristi Labs';
    }, []);

    useGSAP(() => {
        /* Hero entry */
        gsap.from('.vault-hero-word', {
            yPercent: 120,
            opacity: 0,
            stagger: 0.09,
            duration: 1.3,
            ease: 'power4.out',
            delay: 0.3,
        });

        gsap.from('.vault-hero-sub', {
            yPercent: 30,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.9,
        });

        gsap.from('.vault-hero-meta', {
            yPercent: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 1,
            ease: 'power3.out',
            delay: 1.1,
        });

        /* Stats */
        gsap.from('.vault-stat', {
            yPercent: 40,
            opacity: 0,
            stagger: 0.1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.vault-stats-row',
                start: 'top 82%',
            },
        });

        /* Tiers */
        gsap.from('.vault-tier', {
            yPercent: 40,
            opacity: 0,
            stagger: 0.15,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.vault-tiers',
                start: 'top 80%',
            },
        });

        /* Access form */
        gsap.from('.vault-access-section', {
            yPercent: 25,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.vault-access-section',
                start: 'top 85%',
            },
        });

        // useGSAP auto-cleans its scope — no manual kill needed
    });

    const handleSubmit = e => {
        e.preventDefault();
        const valid = email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!valid) {
            setEmailError(true);
            gsap.to('.vault-email-field', {
                x: [-6, 6, -4, 4, 0],
                duration: 0.4,
                ease: 'power2.inOut',
            });
            return;
        }
        setEmailError(false);
        setSubmitted(true);
    };

    return (
        <div>
            {/* ═══ Hero Section ═══════════════════════════════════ */}
            <section className="w-dvw md:h-dvh h-[100vh] md:p-2 p-2.5 mb-20">
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-[var(--bg-void)]">
                    <AmbientGrid />
                    <CornerBrackets />

                    <div className="p-6 md:p-10 flex flex-col h-full">
                        <div className="relative h-full flex flex-col">

                            {/* Label — restricted access */}
                            <div className="flex items-center gap-4 pt-28 md:pt-36">
                                <div style={{ width: '24px', height: '1px', background: 'var(--error)' }} />
                                <p
                                    style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '9px',
                                        letterSpacing: '0.28em',
                                        color: 'var(--error)',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    <TypeWriter
                                        text="RESTRICTED ACCESS — VAULT ARCHIVE"
                                        speed={55}
                                        showCursor={false}
                                        delay={200}
                                    />
                                </p>
                            </div>

                            {/* Headline */}
                            <div className="overflow-hidden mt-8 md:mt-10">
                                <h1
                                    className="text-[var(--text-primary)] flex flex-wrap gap-x-5"
                                    style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: 'clamp(3.5rem, 11vw, 10rem)',
                                        lineHeight: '0.88',
                                        letterSpacing: '0.02em',
                                    }}
                                >
                                    {['THE', 'VAULT.'].map((word, i) => (
                                        <span key={i} className="inline-block overflow-hidden">
                                            <span className="vault-hero-word inline-block">{word}</span>
                                        </span>
                                    ))}
                                </h1>
                            </div>

                            {/* Bottom row */}
                            <div className="mt-auto flex flex-col md:flex-row md:justify-between md:items-end gap-6 pb-8 md:pb-10">
                                <h2
                                    className="vault-hero-sub text-[var(--accent)] flex flex-col gap-1"
                                    style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: 'clamp(1.25rem, 3vw, 1.875rem)',
                                        letterSpacing: '0.06em',
                                    }}
                                >
                                    <span>Curated commerce.</span>
                                    <span>Exclusive access.</span>
                                </h2>

                                <div className="vault-hero-meta md:w-[22%] flex flex-col gap-4">
                                    <p
                                        className="text-[var(--text-secondary)] text-[0.7rem] font-light tracking-wide leading-relaxed"
                                        style={{ fontFamily: 'var(--font-body)' }}
                                    >
                                        The Cristi Labs private inventory. Limited-edition products, directorial briefings,
                                        and exclusive physical artifacts — accessible only to verified vault members.
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                width: '6px',
                                                height: '6px',
                                                background: 'var(--accent-ice)',
                                                borderRadius: '50%',
                                                animation: 'pulsing-dot 2s ease-in-out infinite',
                                            }}
                                        />
                                        <span
                                            style={{
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: '0.6rem',
                                                color: 'var(--accent-ice)',
                                                letterSpacing: '0.3em',
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            OPENING — EST. 2026
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Stats Row ═══════════════════════════════════════ */}
            <section className="vault-stats-row w-full px-6 md:px-12 py-16 bg-[var(--bg-surface)]">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {VAULT_STATS.map((stat, i) => (
                        <div key={i} className="vault-stat">
                            <p
                                className="text-[var(--text-primary)]"
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                                    lineHeight: 1,
                                    color: 'var(--accent)',
                                }}
                            >
                                {stat.value}
                            </p>
                            <p
                                className="mt-2 text-[var(--text-secondary)] uppercase tracking-wider"
                                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}
                            >
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ Vault Tiers ═════════════════════════════════════ */}
            <SectionDivider index={1} total={3} />
            <section className="vault-tiers w-full px-6 md:px-12 py-24">
                <div className="max-w-7xl mx-auto">
                    <p
                        className="text-[.7rem] text-[var(--accent-gold)] uppercase tracking-wider mb-16"
                        style={{ fontFamily: 'var(--font-mono)' }}
                    >
                        <TypeWriter
                            text="MEMBERSHIP CLEARANCE LEVELS"
                            speed={60}
                            triggerOnScroll
                            showCursor={false}
                        />
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {VAULT_TIERS.map((tier, i) => (
                            <div
                                key={i}
                                className="vault-tier relative flex flex-col border border-[var(--border)] p-8 md:p-10 bg-[var(--bg-surface)]"
                                style={{
                                    filter: tier.isClassified ? 'blur(4px)' : 'none',
                                    userSelect: tier.isClassified ? 'none' : 'auto',
                                    pointerEvents: tier.isClassified ? 'none' : 'auto',
                                    transition: 'border-color 0.35s ease, box-shadow 0.35s ease, background 0.3s',
                                }}
                                onMouseEnter={e => {
                                    if (!tier.isClassified) {
                                        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)';
                                        e.currentTarget.style.boxShadow = '0 0 48px rgba(184,146,74,0.07), inset 0 1px 0 rgba(184,146,74,0.08)';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!tier.isClassified) {
                                        e.currentTarget.style.borderColor = 'var(--border)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }
                                }}
                            >
                                {/* Top accent line */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '1px',
                                        background: tier.isClassified ? 'var(--error)' : 'var(--accent)',
                                        opacity: 0.6,
                                    }}
                                />

                                {/* Header row */}
                                <div className="flex items-start justify-between mb-6">
                                    <span
                                        style={{
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '8px',
                                            letterSpacing: '0.3em',
                                            color: tier.isClassified ? 'var(--error)' : 'var(--accent-gold)',
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        LEVEL — {tier.level}
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '7px',
                                            letterSpacing: '0.2em',
                                            color: tier.isClassified ? 'var(--error)' : 'var(--accent-ice)',
                                            textTransform: 'uppercase',
                                            border: `1px solid ${tier.isClassified ? 'var(--error)' : 'rgba(94,234,212,0.3)'}`,
                                            padding: '3px 8px',
                                        }}
                                    >
                                        {tier.clearance}
                                    </span>
                                </div>

                                <h3
                                    className="text-[var(--text-primary)] mb-3"
                                    style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    {tier.tier}
                                </h3>

                                <p
                                    className="text-[var(--text-secondary)] text-sm leading-relaxed mb-8"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    {tier.description}
                                </p>

                                <div className="flex flex-col gap-3 mt-auto">
                                    {tier.items.map((item, j) => (
                                        <div key={j} className="flex items-center gap-3">
                                            <span
                                                style={{
                                                    width: '4px',
                                                    height: '4px',
                                                    background: tier.isClassified ? 'var(--error)' : 'var(--accent)',
                                                    transform: 'rotate(45deg)',
                                                    flexShrink: 0,
                                                    opacity: 0.6,
                                                }}
                                            />
                                            <span
                                                style={{
                                                    fontFamily: 'var(--font-mono)',
                                                    fontSize: '0.7rem',
                                                    color: 'var(--text-secondary)',
                                                    letterSpacing: '0.08em',
                                                }}
                                            >
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ Early Access Form ════════════════════════════════ */}
            <SectionDivider index={2} total={3} />
            <section className="vault-access-section w-full px-6 md:px-12 py-28 bg-[var(--bg-void)]">
                <div className="max-w-3xl mx-auto">
                    <p
                        className="text-[.7rem] text-[var(--accent)] uppercase tracking-wider mb-6"
                        style={{ fontFamily: 'var(--font-mono)' }}
                    >
                        Request Clearance
                    </p>

                    <h2
                        className="text-[var(--text-primary)] mb-6"
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                            lineHeight: '0.95',
                            letterSpacing: '0.03em',
                        }}
                    >
                        Secure your access to
                        <br />
                        <span style={{ color: 'var(--accent)' }}>The Vault.</span>
                    </h2>

                    <p
                        className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed mb-16 max-w-xl"
                        style={{ fontFamily: 'var(--font-body)' }}
                    >
                        First access is reserved for those who act early. Submit your contact
                        details — our executive team will review and issue clearance prior to
                        the vault&rsquo;s official opening.
                    </p>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} noValidate>
                            {/* Email field */}
                            <div
                                className="vault-email-field relative mb-10"
                                style={{ position: 'relative' }}
                            >
                                <input
                                    type="email"
                                    id="vault-email"
                                    value={email}
                                    onChange={e => {
                                        setEmail(e.target.value);
                                        if (emailError) setEmailError(false);
                                    }}
                                    onFocus={() => setEmailFocused(true)}
                                    onBlur={() => setEmailFocused(false)}
                                    name="vault-email"
                                    autoComplete="off"
                                    style={{
                                        width: '100%',
                                        background: 'transparent',
                                        color: 'var(--text-primary)',
                                        fontSize: '15px',
                                        paddingTop: '28px',
                                        paddingBottom: '12px',
                                        paddingLeft: 0,
                                        paddingRight: '24px',
                                        border: 'none',
                                        borderBottom: `1px solid ${emailError ? 'var(--error)' : emailFocused ? 'var(--accent)' : 'rgba(255,255,255,0.08)'}`,
                                        outline: 'none',
                                        fontFamily: 'var(--font-body)',
                                        letterSpacing: '0.04em',
                                        transition: 'border-color 0.3s',
                                    }}
                                />
                                <label
                                    htmlFor="vault-email"
                                    style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: email.length > 0 || emailFocused ? '4px' : '28px',
                                        fontSize: email.length > 0 || emailFocused ? '8px' : '14px',
                                        letterSpacing: email.length > 0 || emailFocused ? '0.22em' : '0.04em',
                                        textTransform: email.length > 0 || emailFocused ? 'uppercase' : 'none',
                                        color: emailError ? 'var(--error)' : email.length > 0 || emailFocused ? 'var(--accent)' : 'rgba(212,175,55,0.5)',
                                        transition: 'all 0.3s var(--ease-out-expo)',
                                        pointerEvents: 'none',
                                        fontFamily: email.length > 0 || emailFocused ? 'var(--font-mono)' : 'var(--font-body)',
                                    }}
                                >
                                    {emailError ? 'Invalid email address' : 'Email Address *'}
                                </label>
                                {/* Scan line */}
                                <span
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '1px',
                                        background: emailError ? 'var(--error)' : 'var(--accent)',
                                        transform: emailFocused ? 'scaleX(1)' : 'scaleX(0)',
                                        transformOrigin: 'center',
                                        transition: 'transform 0.5s var(--ease-out-expo)',
                                        pointerEvents: 'none',
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '10px',
                                    letterSpacing: '3px',
                                    textTransform: 'uppercase',
                                    color: 'var(--bg-void)',
                                    background: 'var(--accent)',
                                    border: '1px solid var(--accent)',
                                    padding: '16px 48px',
                                    cursor: 'pointer',
                                    width: '100%',
                                    transition: 'opacity 0.3s, transform 0.2s, box-shadow 0.3s',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.opacity = '0.88';
                                    e.currentTarget.style.boxShadow = '0 6px 32px rgba(184,146,74,0.22)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.opacity = '1';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                                onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)'; }}
                                onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                            >
                                REQUEST VAULT ACCESS
                            </button>
                        </form>
                    ) : (
                        <div
                            className="flex flex-col items-center text-center py-16 border border-[var(--border)]"
                            style={{ background: 'var(--bg-surface)' }}
                        >
                            <div className="w-12 h-12 border border-[var(--accent)] flex items-center justify-center mb-6">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    style={{ color: 'var(--accent)' }}
                                >
                                    <path
                                        strokeLinecap="square"
                                        strokeWidth={1.5}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h3
                                className="text-[var(--text-primary)] mb-3"
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                                    letterSpacing: '0.08em',
                                }}
                            >
                                CLEARANCE REQUEST FILED.
                            </h3>
                            <p
                                className="text-[var(--text-secondary)] text-sm tracking-wider max-w-sm"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                You will be contacted by our executive team prior to vault opening.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Store;
