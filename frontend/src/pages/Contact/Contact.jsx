import { useState, useEffect, useRef } from "react";
import gsap from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Footer from "../../components/Footer/Footer";
import TypeWriter from "../../components/TypeWriter/TypeWriter";
import SectionDivider from "../../components/SectionDivider/SectionDivider";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
 *  FloatingField — Reusable input with animated underline
 *  The bottom border expands from center on focus.
 *  Errors render in neon-orange with a GSAP shake.
 * ═══════════════════════════════════════════════════════════════ */
const FloatingField = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    focused,
    onFocus,
    onBlur,
    hasError,
    isTextarea = false,
}) => {
    const isActive = focused === name || value.length > 0;
    const Tag = isTextarea ? "textarea" : "input";

    return (
        <div className={`contact-field relative mb-10 ${hasError ? "contact-field-error" : ""}`}
            style={{ position: 'relative' }}
        >
            {/* Field index glyph — top right */}
            <span style={{
                position: 'absolute', top: '0', right: '0',
                fontFamily: 'var(--font-mono)', fontSize: '8px',
                letterSpacing: '2px', color: hasError ? 'var(--error)' : 'var(--text-tertiary)',
                textTransform: 'uppercase', pointerEvents: 'none',
                transition: 'color 0.3s',
            }}>
                {name.toUpperCase().slice(0, 3)}_
            </span>
            {/* Corner bracket — bottom-left */}
            <span style={{
                position: 'absolute', bottom: '-1px', left: '0',
                width: '8px', height: '8px',
                borderBottom: `1px solid ${hasError ? 'var(--error)' : focused === name ? 'var(--accent)' : 'transparent'}`,
                borderLeft: `1px solid ${hasError ? 'var(--error)' : focused === name ? 'var(--accent)' : 'transparent'}`,
                transition: 'border-color 0.4s',
                pointerEvents: 'none',
            }} />
            {/* Corner bracket — bottom-right */}
            <span style={{
                position: 'absolute', bottom: '-1px', right: '0',
                width: '8px', height: '8px',
                borderBottom: `1px solid ${hasError ? 'var(--error)' : focused === name ? 'var(--accent)' : 'transparent'}`,
                borderRight: `1px solid ${hasError ? 'var(--error)' : focused === name ? 'var(--accent)' : 'transparent'}`,
                transition: 'border-color 0.4s',
                pointerEvents: 'none',
            }} />
            <Tag
                type={!isTextarea ? type : undefined}
                name={name}
                value={value}
                onChange={onChange}
                onFocus={() => onFocus(name)}
                onBlur={() => onBlur()}
                autoComplete="off"
                rows={isTextarea ? 5 : undefined}
                style={{
                    width: '100%',
                    background: focused === name ? 'rgba(212,175,55,0.03)' : 'transparent',
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    paddingTop: '28px',
                    paddingBottom: '12px',
                    paddingLeft: '0',
                    paddingRight: '24px',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderBottom: hasError ? '1px solid var(--error)' : focused === name ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.08)',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'var(--font-body)',
                    letterSpacing: '0.04em',
                    transition: 'background 0.3s, border-color 0.3s',
                }}
            />
            <label
                style={{
                    position: 'absolute',
                    left: 0,
                    top: isActive ? '4px' : '28px',
                    fontSize: isActive ? '8px' : '14px',
                    letterSpacing: isActive ? '0.22em' : '0.04em',
                    textTransform: isActive ? 'uppercase' : 'none',
                    color: hasError ? 'var(--error)' : isActive ? 'var(--accent)' : 'rgba(212,175,55,0.5)',
                    transition: 'all 0.3s var(--ease-out-expo)',
                    pointerEvents: 'none',
                    fontFamily: isActive ? 'var(--font-mono)' : 'var(--font-body)',
                }}
            >
                {label}
            </label>
            {/* Scan line — only on focus, sweeps left to right */}
            <span
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: focused === name ? '0' : '50%',
                    width: focused === name ? '100%' : '0',
                    height: '1px',
                    background: hasError ? 'var(--error)' : 'var(--accent)',
                    transform: 'translateX(0)',
                    transition: 'width 0.5s var(--ease-out-expo), left 0.5s var(--ease-out-expo)',
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════
 *  Contact Page
 * ═══════════════════════════════════════════════════════════════ */
const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        message: "",
    });
    const [errors, setErrors] = useState({});
    const [focused, setFocused] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const formRef = useRef(null);
    const successRef = useRef(null);
    const submitBtnRef = useRef(null);
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
        hour12: true,
    });

    const sheridanDate = currentTime.toLocaleDateString("en-US", {
        timeZone: "America/Denver",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    /* ── GSAP Entry Animations ──────────────────────────────── */
    useGSAP(() => {
        gsap.from(".contact-hero-word", {
            yPercent: 110,
            opacity: 0,
            stagger: 0.08,
            duration: 1.2,
            ease: "power4.out",
            delay: 0.2,
        });

        gsap.from(".contact-hero-sub", {
            yPercent: 30,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            delay: 0.8,
        });

        gsap.from(".contact-info-item", {
            yPercent: 30,
            opacity: 0,
            stagger: 0.12,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".contact-grid",
                start: "top 80%",
            },
        });

        gsap.from(".contact-field", {
            yPercent: 20,
            opacity: 0,
            stagger: 0.08,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".contact-form-area",
                start: "top 85%",
            },
        });

        gsap.from(".contact-submit-wrap", {
            yPercent: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".contact-submit-wrap",
                start: "top 90%",
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    });

    /* ── Magnetic Submit Button ─────────────────────────────── */
    useEffect(() => {
        const btn = submitBtnRef.current;
        if (!btn || isSuccess) return;

        const handleMouseMove = (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, {
                x: x * 0.25,
                y: y * 0.25,
                duration: 0.3,
                ease: "power2.out",
            });
        };

        const handleMouseLeave = () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: "elastic.out(1, 0.3)",
            });
        };

        btn.addEventListener("mousemove", handleMouseMove);
        btn.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            btn.removeEventListener("mousemove", handleMouseMove);
            btn.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [isSuccess]);

    /* ── Form Handlers ──────────────────────────────────────── */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
    };

    const validate = () => {
        const errs = {};
        if (!formData.name.trim()) errs.name = true;
        if (
            !formData.email.trim() ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        )
            errs.email = true;
        if (!formData.message.trim()) errs.message = true;
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            gsap.to(".contact-field-error", {
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
         *  See the CONTACT_SETUP documentation at the bottom
         *  of this file for EmailJS / Formspree / custom API.
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
                        {
                            opacity: 1,
                            scale: 1,
                            yPercent: 0,
                            duration: 0.8,
                            ease: "power3.out",
                        }
                    );
                }
            }, 600);
        }, 2000);
    };

    /* ── Hero Words ─────────────────────────────────────────── */
    const heroWords = ["INITIATE", "PROTOCOL."];

    /* ── Render ─────────────────────────────────────────────── */
    return (
        <div>
            {/* ═══ Hero Section ═══════════════════════════════════ */}
            <section className="w-dvw md:h-dvh h-[100vh] md:p-2 p-2.5 mb-10">
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-[var(--bg-void)]">
                    <div className="p-4 flex flex-col justify-center h-full">
                        <div className="relative flex flex-col justify-center items-start md:pl-12 pl-4">
                            <p className="text-[.7rem] text-[var(--accent)] uppercase tracking-[0.25em] mb-6 contact-hero-sub">
                                Corporate Access
                            </p>
                            <div className="overflow-hidden">
                                <h1 className="text-[var(--text-primary)] text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-wider leading-[0.9] flex flex-wrap gap-x-6" style={{ fontFamily: 'var(--font-display)' }}>
                                    {heroWords.map((word, i) => (
                                        <span key={i} className="inline-block overflow-hidden">
                                            <span className="contact-hero-word inline-block">
                                                {word}
                                            </span>
                                        </span>
                                    ))}
                                </h1>
                            </div>
                            <p className="contact-hero-sub mt-8 text-[var(--text-secondary)] text-sm md:text-base max-w-lg tracking-wide">
                                Secure your alliance with Cristi Labs. For partnerships,
                                ventures, and strategic inquiries.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Two-Column Grid ════════════════════════════════ */}
            <SectionDivider index={2} total={3} />
            <section className="contact-grid w-full px-6 md:px-12 lg:px-16 py-16 md:py-24">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    {/* ── LEFT: Corporate Info ─────────────────── */}
                    <div className="flex flex-col gap-12">
                        <div className="contact-info-item">
                            <p className="text-[.7rem] text-[var(--accent)] uppercase tracking-[0.25em] mb-4">
                                Headquarters
                            </p>
                            <div className="text-[var(--text-primary)] text-lg md:text-xl leading-relaxed">
                                <p className="font-bold tracking-wider">Cristi Labs LLC</p>
                                <p className="text-[var(--text-secondary)] mt-1">30 N Gould St, Ste R</p>
                                <p className="text-[var(--text-secondary)]">Sheridan, WY 82801</p>
                                <p className="text-[var(--text-secondary)]">United States</p>
                            </div>
                        </div>

                        <div className="contact-info-item">
                            <p className="text-[.7rem] text-[var(--accent)] uppercase tracking-[0.25em] mb-4" style={{ fontFamily: 'var(--font-mono)' }}>
                                Corporate Email
                            </p>
                            <a
                                href="mailto:access@cristilabs.net"
                                className="text-[var(--text-primary)] text-lg md:text-xl tracking-wider hover:text-[var(--accent)] transition-colors duration-300"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                access@cristilabs.net
                            </a>
                        </div>

                        <div className="contact-info-item">
                            <p className="text-[.7rem] text-[var(--accent)] uppercase tracking-[0.25em] mb-4">
                                Direct Line
                            </p>
                            <a
                                href="tel:+16816772084"
                                className="text-[var(--text-primary)] text-lg md:text-xl font-bold tracking-wider hover:text-[var(--accent)] transition-colors duration-300"
                            >
                                +1 (681) 677-2084
                            </a>
                        </div>

                        <div className="contact-info-item">
                            <p className="text-[.7rem] text-[var(--accent)] uppercase tracking-[0.25em] mb-4">
                                Local Time — Sheridan, WY
                            </p>
                            <div className="flex flex-col gap-1">
                                <p className="text-[var(--text-primary)] text-3xl md:text-4xl font-bold tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>
                                    {sheridanTime}
                                </p>
                                <p className="text-[var(--text-secondary)] text-sm tracking-wider">
                                    {sheridanDate}
                                </p>
                            </div>
                        </div>

                        <div className="contact-info-item">
                            <p className="text-[.7rem] text-[var(--accent-gold)] uppercase tracking-[0.25em] mb-4">
                                Response Protocol
                            </p>
                            <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed max-w-sm">
                                All inquiries are reviewed by our executive team. Expect a
                                response within 24–48 business hours.
                            </p>
                        </div>

                        <div className="contact-info-item">
                            <p className="text-[.7rem] text-[var(--accent-gold)] uppercase tracking-[0.25em] mb-4" style={{ fontFamily: 'var(--font-mono)' }}>
                                Coordinates
                            </p>
                            <div className="flex flex-col gap-1">
                                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
                                    44.7966° N, 106.9562° W
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="contact-coordinates-dot" />
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent-ice)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                                        ONLINE
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: The Form ──────────────────────── */}
                    <div className="relative min-h-[500px]">
                        {/* Active Form */}
                        <div
                            ref={formRef}
                            className={`contact-form-area ${isSuccess ? "pointer-events-none" : ""}`}
                        >
                            <p className="text-[.7rem] text-[var(--accent-gold)] uppercase tracking-[0.25em] mb-10" style={{ fontFamily: 'var(--font-mono)' }}>
                                <TypeWriter
                                    text="INITIATE CONTACT PROTOCOL."
                                    speed={55}
                                    delay={600}
                                    showCursor={true}
                                />
                            </p>

                            <form onSubmit={handleSubmit} noValidate>
                                <FloatingField
                                    label="Full Name *"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    focused={focused}
                                    onFocus={setFocused}
                                    onBlur={() => setFocused(null)}
                                    hasError={errors.name}
                                />
                                <FloatingField
                                    label="Email Address *"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    focused={focused}
                                    onFocus={setFocused}
                                    onBlur={() => setFocused(null)}
                                    hasError={errors.email}
                                />
                                <FloatingField
                                    label="Company / Organization"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    focused={focused}
                                    onFocus={setFocused}
                                    onBlur={() => setFocused(null)}
                                    hasError={false}
                                />
                                <FloatingField
                                    label="Message *"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    focused={focused}
                                    onFocus={setFocused}
                                    onBlur={() => setFocused(null)}
                                    hasError={errors.message}
                                    isTextarea
                                />

                                {/* ── Magnetic Submit Button ──── */}
                                <div className="contact-submit-wrap mt-4">
                                    <button
                                        ref={submitBtnRef}
                                        type="submit"
                                        disabled={isSubmitting}
                                        style={{
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '10px',
                                            letterSpacing: '3px',
                                            textTransform: 'uppercase',
                                            color: isSubmitting ? 'var(--text-tertiary)' : 'var(--bg-void)',
                                            background: isSubmitting ? 'var(--bg-elevated)' : 'var(--accent)',
                                            border: 'none',
                                            padding: '16px 48px',
                                            cursor: isSubmitting ? 'wait' : 'pointer',
                                            width: '100%',
                                            transition: 'background var(--duration-mid) var(--ease-out-expo), color var(--duration-mid)',
                                        }}
                                    >
                                        {isSubmitting
                                            ? "TRANSMITTING..."
                                            : "TRANSMIT DATA."}
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
                                <div className="w-16 h-16 border border-[var(--accent)] flex items-center justify-center mb-8">
                                    <svg
                                        className="w-7 h-7 text-[var(--accent)]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="square"
                                            strokeLinejoin="miter"
                                            strokeWidth={1.5}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-[var(--text-primary)] text-2xl md:text-3xl tracking-wider mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                                    DATA PACKET TRANSMITTED.
                                </h3>
                                <p className="text-[var(--text-secondary)] text-sm tracking-wider text-center max-w-sm" style={{ fontFamily: 'var(--font-mono)' }}>
                                    Your inquiry has been received by our executive team.
                                    Expect a response within 24–48 business hours.
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
 *  ██████╗  ██████╗ ███╗   ██╗████████╗ █████╗  ██████╗████████╗
 * ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔════╝╚══██╔══╝
 * ██║     ██║   ██║██╔██╗ ██║   ██║   ███████║██║        ██║
 * ██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██║██║        ██║
 * ╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╗   ██║
 *  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝   ╚═╝
 *
 *  CONTACT_SETUP — Developer Integration Guide
 *
 * ═══════════════════════════════════════════════════════════════════
 *
 *  1. WHERE TO INSERT THE API ENDPOINT
 *  ────────────────────────────────────
 *  Locate the `handleSubmit` function above. Find the comment
 *  block that reads "INTEGRATION POINT". Replace the `setTimeout`
 *  simulation with your actual API call:
 *
 *    // Example with fetch:
 *    const res = await fetch("https://your-api.com/contact", {
 *      method: "POST",
 *      headers: { "Content-Type": "application/json" },
 *      body: JSON.stringify(formData),
 *    });
 *    if (!res.ok) throw new Error("Failed to send");
 *    setIsSubmitting(false);
 *    setIsSuccess(true);
 *    // ... (keep the GSAP animations that follow)
 *
 *
 *  2. HOW TO MAP FIELDS TO AN EMAIL SERVICE
 *  ─────────────────────────────────────────
 *
 *  ▸ EMAILJS (https://www.emailjs.com)
 *    npm install @emailjs/browser
 *
 *    import emailjs from "@emailjs/browser";
 *
 *    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
 *      from_name:    formData.name,
 *      from_email:   formData.email,
 *      company:      formData.company,
 *      message:      formData.message,
 *    }, "YOUR_PUBLIC_KEY");
 *
 *  ▸ FORMSPREE (https://formspree.io)
 *    Replace the form's onSubmit with action-based submission:
 *
 *    const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
 *      method: "POST",
 *      headers: { "Content-Type": "application/json" },
 *      body: JSON.stringify({
 *        name:    formData.name,
 *        email:   formData.email,
 *        company: formData.company,
 *        message: formData.message,
 *      }),
 *    });
 *
 *  ▸ CUSTOM BACKEND (Express / Next.js API / etc.)
 *    Point the fetch URL to your own endpoint, e.g.:
 *    POST /api/contact → receives JSON → sends email via
 *    Nodemailer, SendGrid, Resend, etc.
 *
 *
 *  3. HOW TO CUSTOMIZE THE SUCCESS MESSAGE
 *  ────────────────────────────────────────
 *  Find the "Success State" section in the JSX return.
 *  Edit the <h3> and <p> inside the `isSuccess && (...)` block:
 *
 *    <h3>DATA PACKET TRANSMITTED.</h3>        ← Change headline
 *    <p>Your inquiry has been received...</p> ← Change body text
 *
 *  The checkmark SVG and teal color (#00d4ff) can also be
 *  swapped for any icon/brand color.
 *
 * ═══════════════════════════════════════════════════════════════════ */
