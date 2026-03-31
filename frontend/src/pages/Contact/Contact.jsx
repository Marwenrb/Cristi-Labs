import { useRef, useState, useEffect, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../../components/Footer/Footer";
import "./Contact.css";

/* Assets */
import heroVideo from "../../assets/Pages Media/hero-video.mp4";
import hqImage from "../../assets/Medias/gallery/cristi-labs-hq.png";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
 *  CONFIGURATION — Web3Forms + Netlify Forms
 * ═══════════════════════════════════════════════════════════════ */
const WEB3FORMS_ACCESS_KEY = "c1d4ba60-1d48-4fe6-a657-2ef3b1495736";
const WEB3FORMS_ENDPOINT   = "https://api.web3forms.com/submit";
const NETLIFY_FORM_NAME    = "cristi-labs-contact";

/* ═══════════════════════════════════════════════════════════════
 *  HELPERS — Validation, Retry, Submission
 * ═══════════════════════════════════════════════════════════════ */

/** Basic email regex (RFC-5322 simplified) */
const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

/** Retry a fetch-based async fn with exponential backoff */
async function withRetry(fn, { retries = 2, baseDelay = 800 } = {}) {
    let lastError;
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (err) {
            lastError = err;
            if (attempt < retries) {
                await new Promise((r) => setTimeout(r, baseDelay * 2 ** attempt));
            }
        }
    }
    throw lastError;
}

/** Submit to Web3Forms API (PRIMARY) */
async function submitToWeb3Forms(data) {
    const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject:    `[Cristi Labs] New Inquiry from ${data.name}`,
        from_name:  "Cristi Labs Contact Terminal",
        name:       data.name,
        email:      data.email,
        company:    data.company || "N/A",
        message:    data.message,
        botcheck:   "",
    };

    const res = await fetch(WEB3FORMS_ENDPOINT, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body:    JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
        throw new Error(result.message || `Web3Forms error (HTTP ${res.status})`);
    }

    return result;
}

/** Submit to Netlify Forms (SECONDARY — permanent backup) */
async function submitToNetlifyForms(data) {
    const body = new URLSearchParams({
        "form-name": NETLIFY_FORM_NAME,
        name:        data.name,
        email:       data.email,
        company:     data.company || "",
        message:     data.message,
        "bot-field": "",
    });

    const res = await fetch("/", {
        method:  "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:    body.toString(),
    });

    if (!res.ok) {
        throw new Error(`Netlify Forms error (HTTP ${res.status})`);
    }

    return true;
}

/* ═══════════════════════════════════════════════════════════════
 *  Contact Page — Next-Gen Intelligence Terminal
 * ═══════════════════════════════════════════════════════════════ */
export default function Contact() {
    const btnRef = useRef(null);
    const successRef = useRef(null);

    const [formData, setFormData] = useState({
        name: "", email: "", company: "", message: "",
    });
    const [errors, setErrors] = useState({});
    const [focused, setFocused] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    /* ── Document Title ──────────────────────────────────── */
    useEffect(() => {
        document.title = "Contact | Cristi Labs";
    }, []);

    /* ── GSAP entrance animations ──────────────────────────── */
    useGSAP(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        // Hero eyebrow
        gsap.set(".contact-hero-eyebrow", { y: 14 });
        gsap.to(".contact-hero-eyebrow", {
            opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.3,
        });

        // Hero title lines — clip sweep
        gsap.to(".contact-hero-title-line", {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.0,
            ease: "power4.inOut",
            stagger: 0.12,
            delay: 0.45,
        });

        // Hero sub
        gsap.to(".contact-hero-sub", {
            opacity: 1, duration: 0.6, ease: "power2.out", delay: 1.1,
        });

        // Scroll indicator
        gsap.to(".contact-hero-scroll", {
            opacity: 1, duration: 0.5, ease: "power2.out", delay: 1.4,
        });

        // HQ Coords
        gsap.set(".contact-hero-coords", { x: 20 });
        gsap.to(".contact-hero-coords", {
            opacity: 1, x: 0, duration: 0.7, ease: "power3.out", delay: 1.0,
        });

        // Image panel reveal
        ScrollTrigger.create({
            trigger: ".contact-image-panel",
            start: "top 82%",
            once: true,
            onEnter: () => {
                gsap.to(".contact-image-panel", { opacity: 1, duration: 0.8, ease: "power3.out" });
                gsap.to(".contact-image-panel-img", { scale: 1, duration: 1.2, ease: "power3.out" });
            },
        });

        // Corp block
        gsap.set(".contact-corp-block", { y: 20 });
        ScrollTrigger.create({
            trigger: ".contact-corp-block",
            start: "top 85%",
            once: true,
            onEnter: () => {
                gsap.to(".contact-corp-block", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
            },
        });

        // Form header
        gsap.set(".contact-form-header", { y: 16 });
        ScrollTrigger.create({
            trigger: ".contact-form-header",
            start: "top 85%",
            once: true,
            onEnter: () => {
                gsap.to(".contact-form-header", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
            },
        });

        return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    }, []);

    /* ── Client-side validation ────────────────────────────── */
    const validate = useCallback(() => {
        const errs = {};
        const { name, email, message } = formData;

        if (!name.trim() || name.trim().length < 2) errs.name = true;
        if (!email.trim() || !isValidEmail(email.trim())) errs.email = true;
        if (!message.trim() || message.trim().length < 10) errs.message = true;

        setErrors(errs);
        return Object.keys(errs).length === 0;
    }, [formData]);

    /* ── Form submit — dual provider (Web3Forms + Netlify) ── */
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);
        setErrors({});

        const trimmed = {
            name:    formData.name.trim(),
            email:   formData.email.trim(),
            company: formData.company.trim(),
            message: formData.message.trim(),
        };

        const results = await Promise.allSettled([
            withRetry(() => submitToWeb3Forms(trimmed), { retries: 2 }),
            withRetry(() => submitToNetlifyForms(trimmed), { retries: 1 }),
        ]);

        const web3Result    = results[0];
        const netlifyResult = results[1];

        if (web3Result.status === "fulfilled") {
            console.info("[Contact] ✓ Web3Forms: submission delivered.");
        } else {
            console.warn("[Contact] ✗ Web3Forms failed:", web3Result.reason?.message);
        }
        if (netlifyResult.status === "fulfilled") {
            console.info("[Contact] ✓ Netlify Forms: submission delivered.");
        } else {
            console.warn("[Contact] ✗ Netlify Forms failed:", netlifyResult.reason?.message);
        }

        const anySuccess =
            web3Result.status === "fulfilled" || netlifyResult.status === "fulfilled";

        if (anySuccess) {
            setIsSuccess(true);
            setFormData({ name: "", email: "", company: "", message: "" });
        } else {
            setErrors({
                submit: "Transmission failed. Please check your connection and try again, or reach us directly at access@cristilabs.net",
            });
        }

        setIsSubmitting(false);
    }, [formData, validate]);

    /* ── Reset ─────────────────────────── */
    const handleReset = useCallback(() => {
        setIsSuccess(false);
        setErrors({});
    }, []);

    return (
        <div>
            {/* ═══ HERO PANEL ═══════════════════════════════════════ */}
            <section className="contact-hero">
                {/* Full-bleed video background */}
                <div className="contact-hero-bg">
                    <video
                        autoPlay muted loop playsInline preload="auto"
                        className="contact-hero-bg-video"
                    >
                        <source src={heroVideo} type="video/mp4" />
                    </video>
                    <div className="contact-hero-overlay" />
                    <div className="contact-hero-noise" />
                </div>

                {/* Content — bottom-left anchored */}
                <div className="contact-hero-content">
                    <div className="contact-hero-eyebrow">
                        <span className="contact-hero-eyebrow-line" />
                        <span className="contact-hero-eyebrow-text">Corporate Access</span>
                        <span className="contact-hero-eyebrow-dot">◈</span>
                        <span className="contact-hero-eyebrow-text">Cristi Labs LLC</span>
                    </div>

                    <h1 className="contact-hero-title">
                        <span className="contact-hero-title-line">OPEN</span>
                        <span className="contact-hero-title-line contact-hero-title-line--accent">
                            CHANNEL<span className="contact-hero-title-cursor" />
                        </span>
                    </h1>

                    <p className="contact-hero-sub">
                        Direct access to our executive team.<br />
                        Response within 24–48 hours.
                    </p>

                    <div className="contact-hero-scroll" aria-hidden="true">
                        <span className="contact-hero-scroll-line" />
                        <span className="contact-hero-scroll-label">SCROLL TO CONNECT</span>
                    </div>
                </div>

                {/* HQ coordinates panel — bottom right */}
                <div className="contact-hero-coords">
                    <div className="contact-coord-row">
                        <span className="contact-coord-label">LAT</span>
                        <span className="contact-coord-value">44.7977° N</span>
                    </div>
                    <div className="contact-coord-row">
                        <span className="contact-coord-label">LONG</span>
                        <span className="contact-coord-value">106.9563° W</span>
                    </div>
                    <div className="contact-coord-row">
                        <span className="contact-coord-label">TZ</span>
                        <span className="contact-coord-value">MST −7:00</span>
                    </div>
                </div>
            </section>

            {/* ═══ SPLIT CONTACT SECTION ═════════════════════════════ */}
            {!isSuccess ? (
                <section className="contact-split">
                    <div className="contact-split-inner">

                        {/* LEFT COLUMN — Corporate info + image */}
                        <div className="contact-split-left">
                            {/* Image panel */}
                            <div className="contact-image-panel">
                                <img
                                    src={hqImage}
                                    alt="Cristi Labs HQ Operations"
                                    className="contact-image-panel-img"
                                    loading="lazy"
                                />
                                <div className="contact-image-panel-overlay" />
                                <div className="contact-img-corner contact-img-corner--tl" />
                                <div className="contact-img-corner contact-img-corner--br" />
                                <div className="contact-image-label">
                                    <span className="contact-image-label-dot" />
                                    <span>SHERIDAN, WYOMING · USA</span>
                                </div>
                            </div>

                            {/* Corporate details block */}
                            <div className="contact-corp-block">
                                <div className="contact-corp-row">
                                    <span className="contact-corp-key">Entity</span>
                                    <span className="contact-corp-val">Cristi Labs LLC</span>
                                </div>
                                <div className="contact-corp-row">
                                    <span className="contact-corp-key">EIN</span>
                                    <span className="contact-corp-val">37-2221468</span>
                                </div>
                                <div className="contact-corp-row">
                                    <span className="contact-corp-key">File No.</span>
                                    <span className="contact-corp-val">2026-001890716</span>
                                </div>
                                <div className="contact-corp-row">
                                    <span className="contact-corp-key">Address</span>
                                    <span className="contact-corp-val">30 N Gould St, Ste R<br />Sheridan WY 82801</span>
                                </div>
                                <div className="contact-corp-row">
                                    <span className="contact-corp-key">Direct</span>
                                    <a href="tel:+16816772084" className="contact-corp-link">
                                        +1 (681) 677-2084
                                    </a>
                                </div>
                                <div className="contact-corp-row">
                                    <span className="contact-corp-key">Access</span>
                                    <a href="mailto:access@cristilabs.net" className="contact-corp-link">
                                        access@cristilabs.net
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN — The Form */}
                        <div className="contact-split-right">
                            <div className="contact-form-header">
                                <p className="contact-form-header-label">
                                    <span className="contact-form-status-dot" />
                                    TRANSMISSION TERMINAL
                                </p>
                                <h2 className="contact-form-title">Initiate Contact</h2>
                            </div>

                            {/* Hidden Netlify form for build-time detection */}
                            <form
                                name={NETLIFY_FORM_NAME}
                                data-netlify="true"
                                netlify-honeypot="bot-field"
                                hidden
                                aria-hidden="true"
                            >
                                <input type="text"     name="name" />
                                <input type="email"    name="email" />
                                <input type="text"     name="company" />
                                <textarea              name="message" />
                                <input type="text"     name="bot-field" />
                            </form>

                            <form className="contact-form" onSubmit={handleSubmit} noValidate>
                                {/* Honeypot */}
                                <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
                                    <label>
                                        Don&apos;t fill this out:
                                        <input type="text" name="bot-field" tabIndex={-1} autoComplete="off" />
                                    </label>
                                </div>

                                <div className={`contact-field ${errors.name ? "has-error" : ""} ${focused === "name" || formData.name ? "is-active" : ""}`}>
                                    <input
                                        type="text"
                                        id="contact-name"
                                        name="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                                        onFocus={() => setFocused("name")}
                                        onBlur={() => setFocused(null)}
                                        autoComplete="name"
                                        className="contact-input"
                                        disabled={isSubmitting}
                                        aria-describedby={errors.name ? "name-error" : undefined}
                                    />
                                    <label htmlFor="contact-name" className="contact-label">Full Name</label>
                                    <div className="contact-field-line" />
                                    {errors.name && <span id="name-error" className="contact-field-error">Required</span>}
                                </div>

                                <div className={`contact-field ${errors.email ? "has-error" : ""} ${focused === "email" || formData.email ? "is-active" : ""}`}>
                                    <input
                                        type="email"
                                        id="contact-email"
                                        name="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                                        onFocus={() => setFocused("email")}
                                        onBlur={() => setFocused(null)}
                                        autoComplete="email"
                                        className="contact-input"
                                        disabled={isSubmitting}
                                        aria-describedby={errors.email ? "email-error" : undefined}
                                    />
                                    <label htmlFor="contact-email" className="contact-label">Email Address</label>
                                    <div className="contact-field-line" />
                                    {errors.email && <span id="email-error" className="contact-field-error">Valid email required</span>}
                                </div>

                                <div className={`contact-field ${focused === "company" || formData.company ? "is-active" : ""}`}>
                                    <input
                                        type="text"
                                        id="contact-company"
                                        name="company"
                                        value={formData.company}
                                        onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
                                        onFocus={() => setFocused("company")}
                                        onBlur={() => setFocused(null)}
                                        autoComplete="organization"
                                        className="contact-input"
                                        disabled={isSubmitting}
                                    />
                                    <label htmlFor="contact-company" className="contact-label">Company <span className="contact-optional">(Optional)</span></label>
                                    <div className="contact-field-line" />
                                </div>

                                <div className={`contact-field contact-field--textarea ${errors.message ? "has-error" : ""} ${focused === "message" || formData.message ? "is-active" : ""}`}>
                                    <textarea
                                        id="contact-message"
                                        name="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                                        onFocus={() => setFocused("message")}
                                        onBlur={() => setFocused(null)}
                                        className="contact-input contact-input--textarea"
                                        disabled={isSubmitting}
                                        aria-describedby={errors.message ? "message-error" : undefined}
                                    />
                                    <label htmlFor="contact-message" className="contact-label">Your Message</label>
                                    <div className="contact-field-line" />
                                    {errors.message && <span id="message-error" className="contact-field-error">Min 10 characters required</span>}
                                </div>

                                {errors.submit && (
                                    <p className="contact-submit-error" role="alert">{errors.submit}</p>
                                )}

                                <button
                                    type="submit"
                                    className={`contact-submit-btn ${isSubmitting ? "is-submitting" : ""}`}
                                    disabled={isSubmitting}
                                    ref={btnRef}
                                    id="contact-submit-btn"
                                >
                                    <span className="contact-submit-btn-inner">
                                        <span className="contact-submit-text">
                                            {isSubmitting ? "TRANSMITTING..." : "TRANSMIT MESSAGE"}
                                        </span>
                                        <span className="contact-submit-arrow" aria-hidden="true">→</span>
                                    </span>
                                    <div className="contact-submit-progress" />
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            ) : (
                /* ═══ SUCCESS STATE ═══════════════════════════════════ */
                <div className="contact-success" ref={successRef}>
                    <div className="contact-success-icon">
                        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="20" cy="20" r="19" stroke="#14b8a6" strokeWidth="1.5"/>
                            <path d="M11 20.5L17 26.5L29 14.5" stroke="#14b8a6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h3 className="contact-success-title">DATA PACKET TRANSMITTED.</h3>
                    <p className="contact-success-sub">
                        Your inquiry has been received. Expect a response within 24–48 hours.
                    </p>
                    <button type="button" className="contact-success-btn" onClick={handleReset}>
                        NEW TRANSMISSION
                    </button>
                </div>
            )}

            <Footer />
        </div>
    );
}
