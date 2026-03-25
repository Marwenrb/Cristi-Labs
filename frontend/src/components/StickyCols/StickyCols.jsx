import gsap, { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { useMediaQuery } from "react-responsive";
import { useState, useEffect, useRef } from "react";
import { waitForFonts } from "../../lib/fontLoader";

import architectsImg     from "../../assets/Medias/sticky/architects-phygital-economy.png";
import ghostLogisticsImg from "../../assets/Medias/sticky/ghost-logistics-trade.png";
import auraProtocolImg   from "../../assets/Medias/sticky/the-aura-protocol.png";

gsap.registerPlugin(ScrollTrigger);

const STICKY_IMAGES = [
    { src: architectsImg,     alt: "Architects of the Phygital Economy — Cristi Labs global trade infrastructure" },
    { src: ghostLogisticsImg, alt: "Ghost Logistics & Trade — Cristi Labs digital twin commerce" },
    { src: auraProtocolImg,   alt: "The Aura Protocol — Cristi Labs celebrity tokenization and fan legacy economy" },
];

// ── Mobile card (unchanged) ──────────────────────────────────────────────────
const MobileFeatureCard = ({ card, index }) => {
    const cardRef = useRef(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setRevealed(true); },
            { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
        );
        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={cardRef}
            className="sticky-mobile-card"
            style={{
                border: "1px solid var(--border)",
                borderRadius: "12px",
                overflow: "hidden",
                background: "var(--bg-void)",
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateY(0) scale(1)" : "translateY(30px) scale(0.97)",
                transition: `opacity 0.7s ease ${index * 0.15}s, transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.15}s`,
                willChange: revealed ? "auto" : "transform, opacity",
            }}
        >
            <div style={{ height: "56vw", overflow: "hidden", position: "relative" }}>
                <img
                    src={card.img.src}
                    alt={card.img.alt}
                    width={1920}
                    height={1080}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    style={{
                        width: "100%", height: "100%", objectFit: "cover", objectPosition: "center",
                        transform: revealed ? "scale(1)" : "scale(1.05)",
                        transition: "transform 1s ease",
                    }}
                />
                <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: "33%",
                    background: "linear-gradient(to top, var(--bg-void) 0%, transparent 100%)",
                }} />
            </div>
            <div style={{ padding: "1.25rem" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "0.25em", color: "var(--accent)", textTransform: "uppercase" }}>
                    {card.num} / 03
                </span>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", lineHeight: 1.05, color: card.accentTitle ? "var(--accent)" : "var(--text-primary)", marginTop: "0.625rem" }}>
                    {card.title}
                </h2>
                <p style={{ fontSize: "0.75rem", lineHeight: 1.65, color: "var(--text-secondary)", marginTop: "0.625rem" }}>
                    {card.body}
                </p>
            </div>
        </div>
    );
};

// ── Desktop component ────────────────────────────────────────────────────────
const StickyCols = () => {
    const isMobile = useMediaQuery({ maxWidth: 768 });

    useGSAP(() => {
        if (isMobile) return;

        let tl;
        let mounted = true;

        waitForFonts().then(() => {
            if (!mounted || !document.querySelector(".sticky-cols-wrapper")) return;

            ScrollTrigger.refresh();
            if (!mounted) return;

            // ── Initial states ────────────────────────────────────────────────
            gsap.set(".col-2",   { xPercent: 100 });          // off-screen right
            gsap.set(".col-3",   { xPercent: -100 });         // off-screen left
            gsap.set(".col-4",   { yPercent: 100 });          // below viewport
            gsap.set(".col-img-2", { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" });
            // Slide 3 wrapper hidden — will fade in during phase 3
            gsap.set(".col-3 .col-content-wrapper-2", { autoAlpha: 0, y: 20 });

            // ── Master timeline ───────────────────────────────────────────────
            tl = gsap.timeline({
                scrollTrigger: {
                    trigger:          ".sticky-cols-wrapper",
                    start:            "top top",
                    end:              () => `+=${window.innerHeight * 2}`,
                    pin:              true,
                    pinSpacing:       true,
                    anticipatePin:    1,
                    scrub:            1,
                    invalidateOnRefresh: true,
                },
            });

            // ── PHASE 1 (0 → 1): Slide 1 exits · Slide 2 layout enters ───────
            tl.to(".col-1",  { xPercent: -8, opacity: 0, ease: "none", duration: 1 }, 0)
              .to(".col-2",  { xPercent: 0,              ease: "none", duration: 1 }, 0)
              .to(".col-3",  { xPercent: 0,              ease: "none", duration: 1 }, 0);

            // ── PHASE 2 (1 → 2): Ghost Logistics image wipe ──────────────────
            tl.to(".col-img-2", {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                ease: "none", duration: 1,
            }, 1);

            // ── PHASE 3 (2 → 3): Slide 2 → Slide 3 clean autoAlpha swap ─────
            //  Outgoing (Ghost Logistics): fade up and out
            tl.to(".col-3 .col-content-wrapper",   { autoAlpha: 0, y: -20, ease: "none", duration: 0.4 }, 2)
            //  Incoming (Aura Protocol): fade in from below — starts after exit clears
              .to(".col-3 .col-content-wrapper-2", { autoAlpha: 1, y: 0,   ease: "none", duration: 0.4 }, 2.45)
            //  Right panel swap: col-2 exits, col-4 rises
              .to(".col-2",  { xPercent: 100, ease: "none", duration: 0.8 }, 2)
              .to(".col-4",  { yPercent: 0,   ease: "none", duration: 1   }, 2);
        });

        return () => {
            mounted = false;
            tl?.scrollTrigger?.kill();
            tl?.kill();
        };
    }, [isMobile]);

    // Force ScrollTrigger to recalculate after Lenis + layout settle
    useEffect(() => {
        if (isMobile) return;
        const id = setTimeout(() => ScrollTrigger.refresh(true), 300);
        return () => clearTimeout(id);
    }, [isMobile]);

    // ── Mobile layout ────────────────────────────────────────────────────────
    if (isMobile) {
        const cards = [
            {
                img: STICKY_IMAGES[0],
                num: "01",
                title: "Architects of the Phygital Economy.",
                body: "Merging immersive digital worlds with high-frequency global trade infrastructure.",
                accentTitle: true,
            },
            {
                img: STICKY_IMAGES[1],
                num: "02",
                title: "Ghost Logistics & Trade.",
                body: "Next-gen supply chains driven by algorithmic demand and immersive commerce.",
                accentTitle: false,
            },
            {
                img: STICKY_IMAGES[2],
                num: "03",
                title: "The Aura Protocol.",
                body: "Redefining the fan-to-icon relationship through biometric identity and digital ownership.",
                accentTitle: false,
            },
        ];
        return (
            <section style={{ background: "var(--bg-void)", padding: "5rem 1rem 5rem" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.5625rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ display: "inline-block", width: "20px", height: "1px", background: "var(--accent)", flexShrink: 0 }} />
                    Phygital Economy
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {cards.map((card, i) => (
                        <MobileFeatureCard key={card.num} card={card} index={i} />
                    ))}
                </div>
            </section>
        );
    }

    // ── Desktop layout ───────────────────────────────────────────────────────
    return (
        <section className="sticky-cols w-screen overflow-visible">
            <div className="sticky-cols-wrapper relative w-full h-screen">

                {/* ── SLIDE 1 — left text panel ─────────────────────────────── */}
                <div className="col col-1">
                    <div className="col-content">
                        <div className="col-content-wrapper">
                            <h2 className="text-2xl text-[var(--accent)] font-bold leading-auto">
                                Architects of<br />the Phygital<br />Economy.
                            </h2>
                            <div className="col-content-para flex items-center gap-4 justify-between">
                                <div className="flex items-center gap-0 justify-center">
                                    <span className="border-1 px-3 py-1 text-[var(--accent)]">1</span>
                                    <span className="border-1 px-3 py-1 text-[var(--accent)]/50">3</span>
                                </div>
                                <p className="text-[12px] font-medium mr-6">
                                    Merging immersive digital worlds with<br />
                                    high-frequency global trade infrastructure.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT IMAGE PANEL — architects (col-img-1) + ghost logistics (col-img-2) ── */}
                <div className="col col-2">
                    <div className="col-img col-img-1">
                        <div className="col-img-wrapper">
                            <img
                                src={STICKY_IMAGES[0].src}
                                alt={STICKY_IMAGES[0].alt}
                                width={1920}
                                height={1080}
                                loading="lazy" decoding="async"
                            />
                        </div>
                    </div>
                    {/* col-img-2: absolutely overlays col-img-1, revealed via clip-path in phase 2 */}
                    <div className="col col-img-2 p-2">
                        <div className="col-img-wrapper">
                            <img
                                src={STICKY_IMAGES[1].src}
                                alt={STICKY_IMAGES[1].alt}
                                width={1920}
                                height={1080}
                                loading="lazy" decoding="async"
                            />
                        </div>
                    </div>
                </div>

                {/* ── LEFT TEXT PANEL — slides 2 & 3, enters from left in phase 1 ── */}
                <div className="col col-3">
                    {/* Slide 2 text — visible initially (yPercent:0 set by GSAP) */}
                    <div className="col-content-wrapper">
                        <h2 className="text-2xl leading-auto text-[var(--text-primary)]">
                            Ghost Logistics<br />&amp; Trade.
                        </h2>
                        <div className="col-content-para flex items-center gap-4 justify-between">
                            <div className="flex items-center gap-0 justify-center">
                                <span className="border-1 px-3 py-1 text-[var(--accent)]">2</span>
                                <span className="border-1 px-3 py-1 text-[var(--accent)]/50">3</span>
                            </div>
                            <p className="text-[12px] font-medium">
                                Next-gen supply chains driven by<br />
                                algorithmic demand and immersive commerce.
                            </p>
                        </div>
                    </div>
                    {/* Slide 3 text — absolutely overlays slide 2; lines start at yPercent:125 */}
                    <div className="col-content-wrapper-2">
                        <h2 className="text-2xl leading-auto text-[var(--text-primary)]">
                            The Aura<br />Protocol.
                        </h2>
                        <div className="col-content-para flex items-center gap-4 justify-between">
                            <div className="flex items-center gap-0 justify-center">
                                <span className="border-1 px-3 py-1 text-[var(--accent)]">3</span>
                                <span className="border-1 px-3 py-1 text-[var(--accent)]/50">3</span>
                            </div>
                            <p className="text-[12px] font-medium">
                                Redefining the fan-to-icon relationship<br />
                                through biometric identity and digital ownership.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── SLIDE 3 right image — rises from below in phase 3 ─────── */}
                <div className="col col-4">
                    <div className="col-img col-img-1">
                        <div className="col-img-wrapper">
                            <img
                                src={STICKY_IMAGES[2].src}
                                alt={STICKY_IMAGES[2].alt}
                                width={1920}
                                height={1080}
                                loading="lazy" decoding="async"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default StickyCols;
