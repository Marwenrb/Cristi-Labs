import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../../components/Footer/Footer";
import bgVideo from "../../assets/Medias/hero/Cristi Labs Home Video.mp4";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
 *  Contact Page — Secure Transmission Terminal
 * ═══════════════════════════════════════════════════════════════ */
export default function Contact() {
    const containerRef = useRef(null);
    const [formState, setFormState] = useState({
        name: "", email: "", company: "", message: "", type: "Venture Partnership",
    });
    const [submitState, setSubmitState] = useState("idle"); // idle | transmitting | sent
    const [time, setTime] = useState("");

    /* ── Document Title ──────────────────────────────────── */
    useEffect(() => {
        document.title = "Contact | Cristi Labs";
    }, []);

    /* ── HQ Clock — Sheridan WY ──────────────────────────── */
    useEffect(() => {
        const tick = () =>
            setTime(
                new Date().toLocaleTimeString("en-US", {
                    timeZone: "America/Denver",
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                })
            );
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    /* ── GSAP entrance animations ──────────────────────────── */
    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Hero text reveal
        tl.from(".contact-eyebrow", { yPercent: 100, opacity: 0, duration: 0.8 })
          .from(".contact-h1 .ch-line", { yPercent: 110, duration: 1.1, stagger: 0.08 }, "-=0.5")
          .from(".contact-subtext", { opacity: 0, yPercent: 20, duration: 0.8 }, "-=0.6");

        // Form reveal — clip-path wipe from left
        gsap.from(".contact-form-wrapper", {
            clipPath: "inset(0 100% 0 0)",
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: { trigger: ".contact-form-wrapper", start: "top 80%", once: true },
        });

        // HQ card — wipe from bottom
        gsap.from(".contact-hq-card", {
            clipPath: "inset(100% 0 0 0)",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: ".contact-hq-card", start: "top 85%", once: true },
        });

        // Section labels
        gsap.from(".contact-section-label", {
            opacity: 0,
            xPercent: -10,
            stagger: 0.15,
            duration: 0.8,
            scrollTrigger: { trigger: ".contact-body", start: "top 75%", once: true },
        });

        return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    }, []);

    /* ── Form submit ──────────────────────────────────────── */
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitState("transmitting");
        // Replace with real EmailJS/Formspree call:
        setTimeout(() => setSubmitState("sent"), 2800);
    };

    return (
        <div>
            <div ref={containerRef} className="contact-page">

                {/* -- Ambient Video Background -- */}
                <div className="contact-video-bg" aria-hidden="true">
                    <video
                        autoPlay muted loop playsInline preload="auto"
                        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.07 }}
                    >
                        <source src={bgVideo} type="video/mp4" />
                    </video>
                    <div className="contact-video-overlay" />
                </div>

                {/* -- Hero Section -- */}
                <section className="contact-hero">

                    {/* Geographic coordinates — decorative */}
                    <div className="contact-geo" aria-hidden="true">
                        <span>44.7970&deg;N</span>
                        <span className="contact-geo-sep">&middot;</span>
                        <span>106.9564&deg;W</span>
                        <span className="contact-geo-sep">&middot;</span>
                        <span>SHERIDAN &middot; WY</span>
                    </div>

                    <div className="contact-eyebrow-wrapper">
                        <div className="contact-eyebrow">
                            <span className="contact-eyebrow-line" aria-hidden="true" />
                            <span className="contact-eyebrow-text">[ 04 ] &middot; CORPORATE ACCESS</span>
                        </div>
                    </div>

                    <h1 className="contact-h1" aria-label="Request Direct Access">
                        <div className="ch-line-wrapper"><div className="ch-line">REQUEST</div></div>
                        <div className="ch-line-wrapper">
                            <div className="ch-line">
                                DIRECT<span className="ch-accent"> ACCESS</span>
                            </div>
                        </div>
                    </h1>

                    <p className="contact-subtext">
                        Qualified inquiries only.<br />
                        <span style={{ color: "rgba(184,146,74,0.58)" }}>Response within 48 business hours.</span>
                    </p>

                    {/* Separator line with timestamp */}
                    <div className="contact-hero-rule">
                        <span className="contact-hero-rule-line" aria-hidden="true" />
                        <span className="contact-hero-timestamp" aria-live="polite">{time} MT</span>
                    </div>
                </section>

                {/* -- Body : Form + HQ Card -- */}
                <section className="contact-body">

                    {/* FORM SIDE */}
                    <div className="contact-form-wrapper">

                        <div className="contact-section-label">
                            <span className="csl-index">01</span>
                            <span className="csl-text">TRANSMISSION</span>
                        </div>

                        <form className="contact-terminal" onSubmit={handleSubmit} noValidate>

                            {/* Terminal header bar */}
                            <div className="ct-header" aria-hidden="true">
                                <span className="ct-header-tag">{"> SECURE"}</span>
                                <span className="ct-header-dot" />
                                <span className="ct-header-tag">CRISTI LABS TERMINAL</span>
                                <span className="ct-header-tag ct-header-tag--right">ENCRYPTED</span>
                            </div>

                            {/* Fields */}
                            <div className="ct-fields">

                                {/* Row: Name + Company */}
                                <div className="ct-row">
                                    <div className="ct-field">
                                        <label className="ct-label" htmlFor="contact-name">Full Name</label>
                                        <input
                                            id="contact-name" type="text" className="ct-input"
                                            placeholder="YOUR FULL NAME"
                                            value={formState.name}
                                            onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                                            required
                                        />
                                        <span className="ct-input-line" aria-hidden="true" />
                                    </div>
                                    <div className="ct-field">
                                        <label className="ct-label" htmlFor="contact-company">Organization</label>
                                        <input
                                            id="contact-company" type="text" className="ct-input"
                                            placeholder="COMPANY / ENTITY"
                                            value={formState.company}
                                            onChange={(e) => setFormState((s) => ({ ...s, company: e.target.value }))}
                                        />
                                        <span className="ct-input-line" aria-hidden="true" />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="ct-field">
                                    <label className="ct-label" htmlFor="contact-email">Encrypted Channel</label>
                                    <input
                                        id="contact-email" type="email" className="ct-input"
                                        placeholder="YOUR EMAIL ADDRESS"
                                        value={formState.email}
                                        onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                                        required
                                    />
                                    <span className="ct-input-line" aria-hidden="true" />
                                </div>

                                {/* Inquiry Type — radio pills */}
                                <div className="ct-field">
                                    <label className="ct-label">Inquiry Classification</label>
                                    <div className="ct-pills">
                                        {["Venture Partnership", "Trade Operations", "Investment", "Press", "Other"].map((type) => (
                                            <label key={type} className={`ct-pill ${formState.type === type ? "ct-pill--active" : ""}`}>
                                                <input
                                                    type="radio" name="type" value={type}
                                                    checked={formState.type === type}
                                                    onChange={() => setFormState((s) => ({ ...s, type }))}
                                                    style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                                                />
                                                {type}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="ct-field">
                                    <label className="ct-label" htmlFor="contact-message">Transmission Content</label>
                                    <textarea
                                        id="contact-message" className="ct-input ct-textarea"
                                        placeholder="DESCRIBE YOUR INQUIRY..."
                                        rows={4}
                                        value={formState.message}
                                        onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                                        required
                                    />
                                    <span className="ct-input-line" aria-hidden="true" />
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="ct-submit-row">
                                {submitState === "idle" && (
                                    <button type="submit" className="ct-submit">
                                        <span className="ct-submit-arrow">&rsaquo;</span>
                                        TRANSMIT REQUEST
                                    </button>
                                )}
                                {submitState === "transmitting" && (
                                    <div className="ct-transmitting" aria-live="assertive">
                                        <span className="ct-tx-dot" aria-hidden="true" />
                                        <span className="ct-tx-label">TRANSMITTING</span>
                                        <div className="ct-tx-bar"><div className="ct-tx-fill" /></div>
                                    </div>
                                )}
                                {submitState === "sent" && (
                                    <div className="ct-sent" aria-live="assertive">
                                        <span className="ct-sent-mark">&check;</span>
                                        <span>TRANSMISSION RECEIVED &middot; WE WILL RESPOND WITHIN 48H</span>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* HQ CARD SIDE */}
                    <div className="contact-hq-side">

                        <div className="contact-section-label">
                            <span className="csl-index">02</span>
                            <span className="csl-text">HEADQUARTERS</span>
                        </div>

                        <div className="contact-hq-card">

                            {/* Status badge */}
                            <div className="chq-status">
                                <span className="chq-status-dot" aria-hidden="true" />
                                <span className="chq-status-text">OPERATIONAL</span>
                                <span className="chq-clock" aria-live="polite">{time} MT</span>
                            </div>

                            {/* Address block */}
                            <div className="chq-block">
                                <p className="chq-label">[ PRIMARY HQ ]</p>
                                <address className="chq-address">
                                    <p>Cristi Labs LLC</p>
                                    <p>30 N Gould St, Suite R</p>
                                    <p>Sheridan, WY 82801</p>
                                    <p>United States</p>
                                </address>
                            </div>

                            <div className="chq-divider" aria-hidden="true" />

                            {/* Contact channels */}
                            <div className="chq-block">
                                <p className="chq-label">[ ACCESS CHANNELS ]</p>
                                <a href="mailto:access@cristilabs.net" className="chq-link">
                                    <span className="chq-link-icon" aria-hidden="true">&rarr;</span>
                                    access@cristilabs.net
                                </a>
                                <a href="tel:+16816772084" className="chq-link">
                                    <span className="chq-link-icon" aria-hidden="true">&rarr;</span>
                                    +1 (681) 677-2084
                                </a>
                            </div>

                            <div className="chq-divider" aria-hidden="true" />

                            {/* Registry */}
                            <div className="chq-block">
                                <p className="chq-label">[ REGISTRY ]</p>
                                <div className="chq-registry">
                                    <div className="chq-reg-row">
                                        <span className="chq-reg-key">EIN</span>
                                        <span className="chq-reg-val">37-2221468</span>
                                    </div>
                                    <div className="chq-reg-row">
                                        <span className="chq-reg-key">FILE</span>
                                        <span className="chq-reg-val">2026-001890716</span>
                                    </div>
                                    <div className="chq-reg-row">
                                        <span className="chq-reg-key">STATE</span>
                                        <span className="chq-reg-val">Wyoming LLC</span>
                                    </div>
                                </div>
                            </div>

                            {/* Corner mark decoratif */}
                            <div className="chq-corner" aria-hidden="true" />
                        </div>
                    </div>

                </section>
            </div>

            <Footer />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
 *
 *  CONTACT_SETUP — Developer Integration Guide
 *
 * ═══════════════════════════════════════════════════════════════════
 *
 *  1. WHERE TO INSERT THE API ENDPOINT
 *  ────────────────────────────────────
 *  Locate the `handleSubmit` function above. Replace the `setTimeout`
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
