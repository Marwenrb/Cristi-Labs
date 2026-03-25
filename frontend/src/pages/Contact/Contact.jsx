import { useState, useEffect, useRef } from "react";
import gsap from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Footer from "../../components/Footer/Footer";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
 *  Contact Page — Private Access Terminal
 * ═══════════════════════════════════════════════════════════════ */
const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        message: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const formRef = useRef(null);
    const successRef = useRef(null);
    const hqCardRef = useRef(null);

    /* ── Document Title ──────────────────────────────────── */
    useEffect(() => {
        document.title = 'Contact | Cristi Labs';
    }, []);

    /* ── Live Clock (Mountain Time — Sheridan, WY) ──────────── */
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const sheridanTime = currentTime.toLocaleTimeString("en-US", {
        timeZone: "America/Denver",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    /* ── HQ Card IntersectionObserver ─────────────────────────── */
    useEffect(() => {
        const card = hqCardRef.current;
        if (!card) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    card.classList.add('is-visible');
                    obs.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        obs.observe(card);
        return () => obs.disconnect();
    }, []);

    /* ── GSAP Entry Animations ──────────────────────────────── */
    useGSAP(() => {
        gsap.from(".ct-hero-word", {
            yPercent: 110,
            opacity: 0,
            stagger: 0.08,
            duration: 1.2,
            ease: "power4.out",
            delay: 0.2,
        });

        gsap.from(".ct-hero-sub", {
            yPercent: 30,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            delay: 0.8,
        });

        gsap.from(".ct-form-field", {
            yPercent: 20,
            opacity: 0,
            stagger: 0.08,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".access-terminal",
                start: "top 85%",
                once: true,
            },
        });

        return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    }, []);

    /* ── Form Handlers ──────────────────────────────────────── */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
    };

    const validate = () => {
        const errs = {};
        if (!formData.name.trim()) errs.name = true;
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = true;
        if (!formData.message.trim()) errs.message = true;
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            gsap.to(".ct-field-error", {
                x: [-6, 6, -4, 4, 0],
                duration: 0.4,
                ease: "power2.inOut",
            });
            return;
        }

        setIsSubmitting(true);

        /* ────────────────────────────────────────────────────────
         *  INTEGRATION POINT
         *  Replace the setTimeout below with your API call.
         *  See bottom of this file for EmailJS / Formspree / custom API docs.
         * ──────────────────────────────────────────────────────── */
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);

            if (formRef.current) {
                gsap.to(formRef.current, {
                    opacity: 0,
                    yPercent: -3,
                    duration: 0.5,
                    ease: "power3.in",
                });
            }

            setTimeout(() => {
                if (successRef.current) {
                    gsap.fromTo(
                        successRef.current,
                        { opacity: 0, scale: 0.95, yPercent: 10 },
                        { opacity: 1, scale: 1, yPercent: 0, duration: 0.8, ease: "power3.out" }
                    );
                }
            }, 600);
        }, 2000);
    };

    /* ── Render ─────────────────────────────────────────────── */
    const heroWords = ["REQUEST", "DIRECT", "ACCESS"];

    const fields = [
        { label: 'FULL NAME', name: 'name', required: true },
        { label: 'EMAIL ADDRESS', name: 'email', type: 'email', required: true },
        { label: 'COMPANY / ORGANIZATION', name: 'company' },
    ];

    return (
        <div>
            {/* ═══ Hero Section ═══════════════════════════════════ */}
            <section className="w-dvw md:h-dvh h-[100vh] md:p-2 p-2.5 mb-10">
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-[var(--bg-void)]">
                    {/* Animated grid */}
                    <div className="ventures-grid-bg" aria-hidden="true" />

                    {/* Ghost text */}
                    <div className="ghost-bg-text" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} aria-hidden="true">
                        ACCESS
                    </div>

                    {/* HUD corner brackets */}
                    <div aria-hidden="true" style={{
                        position: 'absolute', top: '1.5rem', left: '1.5rem',
                        width: '22px', height: '22px',
                        borderTop: '1px solid rgba(201,168,76,0.28)',
                        borderLeft: '1px solid rgba(201,168,76,0.28)',
                        pointerEvents: 'none',
                    }} />
                    <div aria-hidden="true" style={{
                        position: 'absolute', bottom: '1.5rem', right: '1.5rem',
                        width: '22px', height: '22px',
                        borderBottom: '1px solid rgba(201,168,76,0.28)',
                        borderRight: '1px solid rgba(201,168,76,0.28)',
                        pointerEvents: 'none',
                    }} />

                    <div className="p-6 md:p-10 flex flex-col h-full relative z-[1]">
                        <div className="relative h-full flex flex-col">
                            {/* Eyebrow */}
                            <div className="section-eyebrow pt-20 md:pt-28">
                                <span className="section-eyebrow-text">[ 04 ] &middot; CORPORATE ACCESS</span>
                            </div>

                            {/* Title */}
                            <div className="overflow-hidden mt-6">
                                <h1
                                    className="text-[var(--text-primary)] flex flex-wrap gap-x-5"
                                    style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: 'clamp(3.5rem, 11vw, 9rem)',
                                        lineHeight: '0.9',
                                        letterSpacing: '0.04em',
                                    }}
                                >
                                    {heroWords.map((word, i) => (
                                        <span key={i} className="inline-block overflow-hidden">
                                            <span className="ct-hero-word inline-block">{word}</span>
                                        </span>
                                    ))}
                                </h1>
                            </div>

                            {/* Bottom */}
                            <div className="mt-auto flex flex-col md:flex-row md:justify-between md:items-end gap-6 pb-8 md:pb-10 ct-hero-sub">
                                <p
                                    style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.65rem',
                                        letterSpacing: '0.2em',
                                        color: 'var(--text-secondary)',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    Qualified inquiries only. Response within 48 hours.
                                </p>
                                {/* Bottom-right coordinate strip */}
                                <div style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px',
                                }}>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7.5px', letterSpacing: '0.2em', color: 'rgba(201,168,76,0.3)', textTransform: 'uppercase' }}>
                                        44.7966&deg; N &middot; 106.9562&deg; W
                                    </span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '0.16em', color: 'rgba(201,168,76,0.18)', textTransform: 'uppercase' }}>
                                        SHR HQ &middot; SECURE CHANNEL
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Two-Column Layout ══════════════════════════════ */}
            <div className="presidential-rule" />
            <section className="w-full px-6 md:px-12 lg:px-16 py-16 md:py-24">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    {/* ── LEFT: HQ Intelligence Card ──────────────── */}
                    <div className="flex flex-col gap-12">
                        <div ref={hqCardRef} className="hq-intel-card">
                            <div style={{
                                fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                                letterSpacing: '0.3em', color: 'var(--accent-gold)',
                                marginBottom: '2rem', textTransform: 'uppercase',
                            }}>
                                [ HQ &mdash; PRIMARY ]
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1.5rem' }}>
                                <span style={{ fontFamily: 'var(--font-body)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
                                    Cristi Labs LLC
                                </span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>30 N Gould St, Suite R</span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Sheridan, WY 82801</span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>United States</span>
                            </div>

                            <div style={{ width: '100%', height: '1px', background: 'rgba(184,146,74,0.1)', margin: '1rem 0' }} />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <a
                                    href="mailto:access@cristilabs.net"
                                    className="contact-email-link"
                                    style={{
                                        fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                                        letterSpacing: '0.1em', color: 'var(--text-primary)',
                                        textDecoration: 'none', transition: 'color 0.3s',
                                        wordBreak: 'break-all', overflowWrap: 'anywhere',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}
                                >
                                    access@cristilabs.net
                                </a>
                                <a
                                    href="tel:+16816772084"
                                    style={{
                                        fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                                        letterSpacing: '0.1em', color: 'var(--text-primary)',
                                        textDecoration: 'none', transition: 'color 0.3s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}
                                >
                                    +1 (681) 677-2084
                                </a>
                            </div>

                            <div style={{ width: '100%', height: '1px', background: 'rgba(184,146,74,0.1)', margin: '1rem 0' }} />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--text-secondary)' }}>
                                    EIN: 37-2221468
                                </span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--text-secondary)' }}>
                                    FILE: 2026-001890716
                                </span>
                                <div className="flex items-center gap-2 mt-2">
                                    <span style={{
                                        display: 'inline-block', width: '6px', height: '6px',
                                        background: 'var(--accent-ice)', borderRadius: '50%',
                                        animation: 'pulsing-dot 2s ease-in-out infinite',
                                    }} />
                                    <span style={{
                                        fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                                        letterSpacing: '0.3em', color: 'var(--accent-ice)',
                                        textTransform: 'uppercase',
                                    }}>
                                        STATUS: OPERATIONAL
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Live clock */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '1rem',
                            padding: '1.25rem 0',
                            borderTop: '1px solid rgba(184,146,74,0.08)',
                            borderBottom: '1px solid rgba(184,146,74,0.08)',
                        }}>
                            <span style={{
                                fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                                letterSpacing: '0.3em', color: 'var(--text-tertiary)',
                                textTransform: 'uppercase',
                            }}>
                                HQ LOCAL TIME
                            </span>
                            <span style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                                color: 'var(--accent-gold)',
                                letterSpacing: '0.08em',
                                fontWeight: 300,
                            }}>
                                {sheridanTime}
                            </span>
                        </div>

                        {/* Response protocol */}
                        <p style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                            letterSpacing: '0.2em', color: 'var(--text-tertiary)',
                            textTransform: 'uppercase', lineHeight: 1.8,
                        }}>
                            All inquiries are reviewed by our executive team.
                            <br />
                            Expect a response within 24&ndash;48 business hours.
                        </p>
                    </div>

                    {/* ── RIGHT: Access Terminal Form ─────────────── */}
                    <div className="relative min-h-[500px]">
                        <div
                            ref={formRef}
                            className={`access-terminal ${isSuccess ? "pointer-events-none" : ""}`}
                        >
                            <form onSubmit={handleSubmit} noValidate>
                                {fields.map((field, i) => (
                                    <div key={i} className={`ct-form-field mb-8 ${errors[field.name] ? 'ct-field-error' : ''}`}>
                                        <input
                                            type={field.type || 'text'}
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            placeholder={field.label + (field.required ? ' *' : '')}
                                            autoComplete="off"
                                            className="terminal-input"
                                            style={errors[field.name] ? { borderBottomColor: 'var(--error)' } : {}}
                                        />
                                    </div>
                                ))}

                                <div className={`ct-form-field mb-8 ${errors.message ? 'ct-field-error' : ''}`}>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="MESSAGE *"
                                        rows={5}
                                        autoComplete="off"
                                        className="terminal-input"
                                        style={errors.message ? { borderBottomColor: 'var(--error)' } : {}}
                                    />
                                </div>

                                <div className="mt-8">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="terminal-submit"
                                    >
                                        <span>&rsaquo;</span>
                                        {isSubmitting ? "TRANSMITTING..." : "TRANSMIT REQUEST"}
                                        <span>&rarr;</span>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* ── Success State ────────────────────── */}
                        {isSuccess && (
                            <div
                                ref={successRef}
                                className="absolute inset-0 flex flex-col justify-center items-center opacity-0"
                            >
                                <div style={{
                                    width: '64px', height: '64px',
                                    border: '1px solid var(--accent-gold)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '2rem',
                                }}>
                                    <svg className="w-7 h-7" fill="none" stroke="var(--accent-gold)" viewBox="0 0 24 24">
                                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                                    color: 'var(--text-primary)',
                                    letterSpacing: '0.1em',
                                    marginBottom: '0.75rem',
                                }}>
                                    DATA PACKET TRANSMITTED.
                                </h3>
                                <p style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.65rem',
                                    letterSpacing: '0.2em',
                                    color: 'var(--text-secondary)',
                                    textAlign: 'center',
                                    maxWidth: '380px',
                                    lineHeight: 1.8,
                                    textTransform: 'uppercase',
                                }}>
                                    Your inquiry has been received by our executive team.
                                    Expect a response within 24&ndash;48 business hours.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;

/* ═══════════════════════════════════════════════════════════════════
 *
 *  CONTACT_SETUP — Developer Integration Guide
 *
 * ═══════════════════════════════════════════════════════════════════
 *
 *  1. WHERE TO INSERT THE API ENDPOINT
 *  ────────────────────────────────────
 *  Locate the `handleSubmit` function above. Find the comment
 *  block that reads "INTEGRATION POINT". Replace the `setTimeout`
 *  simulation with your actual API call.
 *
 *  2. SERVICES
 *  ─────────────────────────────────────────
 *
 *  EMAILJS (https://www.emailjs.com)
 *    npm install @emailjs/browser
 *    emailjs.send("SERVICE_ID", "TEMPLATE_ID", formData, "PUBLIC_KEY");
 *
 *  FORMSPREE (https://formspree.io)
 *    fetch("https://formspree.io/f/YOUR_FORM_ID", {
 *      method: "POST",
 *      headers: { "Content-Type": "application/json" },
 *      body: JSON.stringify(formData),
 *    });
 *
 *  CUSTOM BACKEND
 *    POST /api/contact → receives JSON → sends via Nodemailer/SendGrid
 *
 * ═══════════════════════════════════════════════════════════════════ */
