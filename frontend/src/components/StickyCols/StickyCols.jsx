import gsap, { ScrollTrigger, SplitText } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { useMediaQuery } from "react-responsive";
import { useState, useEffect, useRef } from "react";
import { waitForFonts } from "../../lib/fontLoader";

import sticky1 from "../../assets/Medias/sticky/sticky-1.png";
import sticky2 from "../../assets/Medias/sticky/sticky-2.png";
import auraProtocol from "../../assets/Medias/gallery/The Aura Protocol.png";

// Local images — cinematic, matching each phase
const STICKY_IMAGES = [
    {
        src: sticky1,
        alt: "Aerial view of container port with cranes — logistics and global trade",
    },
    {
        src: sticky2,
        alt: "Dark esports arena with screens and RGB — digital entertainment",
    },
    {
        src: auraProtocol,
        alt: "The Aura Protocol — Cristi Labs digital identity platform",
    },
];

// Mobile card with CSS transition reveal animation
const MobileFeatureCard = ({ card, index }) => {
    const cardRef = useRef(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setRevealed(true); },
            { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
        );
        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={cardRef}
            className="sticky-mobile-card"
            style={{
                border: '1px solid var(--border)',
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'var(--bg-void)',
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.97)',
                transition: `opacity 0.7s ease ${index * 0.15}s, transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.15}s`,
                willChange: revealed ? 'auto' : 'transform, opacity',
            }}
        >
            <div style={{ height: '56vw', maxHeight: '260px', overflow: 'hidden', position: 'relative' }}>
                <img
                    src={card.img.src}
                    alt={card.img.alt}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: revealed ? 'scale(1)' : 'scale(1.05)',
                        transition: 'transform 1s ease',
                    }}
                />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, var(--bg-void) 0%, transparent 60%)',
                }} />
            </div>
            <div style={{ padding: '1.25rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.25em', color: 'var(--accent)', textTransform: 'uppercase' }}>
                    {card.num} / 03
                </span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', lineHeight: 1.05, color: card.accentTitle ? 'var(--accent)' : 'var(--text-primary)', marginTop: '0.625rem' }}>
                    {card.title}
                </h2>
                <p style={{ fontSize: '0.75rem', lineHeight: 1.65, color: 'var(--text-secondary)', marginTop: '0.625rem' }}>
                    {card.body}
                </p>
            </div>
        </div>
    );
};

const StickyCols = () => {

    const [reveal, setReveal] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 768 });

    useGSAP(() => {
        if (isMobile) return;

        gsap.registerPlugin(ScrollTrigger, SplitText);

        let tl;
        let mounted = true;

        // Wait for fonts before SplitText (fixes character measurement issues)
        waitForFonts().then(() => {
            // Guard: bail if component unmounted or DOM nodes gone
            if (!mounted) return;
            if (!document.querySelector('.sticky-cols')) return;

            // 1️⃣ Split text lines once fonts ready
            const textElements = document.querySelectorAll(".col-3 h1, .col-3 p");
            textElements.forEach((element) => {
                if (!document.body.contains(element)) return;
                const split = new SplitText(element, { type: "lines", linesClass: "line" });
                split.lines.forEach((line) => {
                    line.innerHTML = `<span>${line.textContent}</span>`;
                });
            });

            // Refresh ScrollTrigger after split
            ScrollTrigger.refresh();

            if (!mounted) return;

            // 2️⃣ Initial state — GSAP owns all transforms (no CSS translate conflict)
            gsap.set(".col-2", { xPercent: 100 });
            gsap.set(".col-3", { xPercent: 100, yPercent: 100 });
            gsap.set(".col-4", { xPercent: 0, yPercent: 100 });
            gsap.set(".col-3 .col-content-wrapper .line span", { yPercent: 0 });
            gsap.set(".col-3 .col-content-wrapper-2 .line span", { yPercent: -125 });

            // 3️⃣ Controlled phase logic using timeline
            // end = 2.5× VH — enough for 3 phases; pinSpacing inserts this as spacer
            // after the section so footer is reachable immediately after
            tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".sticky-cols",
                    start: "top top",
                    end: () => `+=${window.innerHeight * 2.5}`,
                    pin: true,
                    pinSpacing: true,
                    anticipatePin: 1,
                    scrub: 1.2,
                    invalidateOnRefresh: true,
                },
            });
            tl.add(() => setReveal(false));
            // PHASE 1: Reveal col-2, hide col-1
            tl.to(".col-1", { opacity: 0, scale: 0.8, duration: 0.8 })
                .to(".col-2", { xPercent: 0, duration: 0.8 }, "<")
                .to(".col-3", { yPercent: 0, duration: 0.8 }, "<")
                .to(".col-img-1 img", { scale: 1, duration: 0.8 }, "<")
                .to(".col-img-2", {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    duration: 0.8,
                }, "<")
                .to(".col-img-2 img", { scale: 1.6, duration: 0.8 }, "<");

            tl.add(() => setReveal(false));
            tl.add(() => setReveal(true));
            // PHASE 2: Switch col-2 -> col-3 content
            tl.to(".col-2", { opacity: 0, scale: 0.8, duration: 0.8 })
                .to(".col-3 .col-content-wrapper .line span", {
                    yPercent: -125,
                    duration: 0.8,
                }, "<");
            tl.to(".col-3", { xPercent: 0, duration: 0.8 }, "-=0.8")
                .to(".col-4", { yPercent: 0, duration: 0.8 }, "<")
                .to(".col-3 .col-content-wrapper-2 .line span", {
                    yPercent: 0,
                    delay: 0.4,
                    duration: 0.8,
                }, "<");
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
        const timeout = setTimeout(() => { ScrollTrigger.refresh(true); }, 300);
        return () => clearTimeout(timeout);
    }, [isMobile]);

    // Mobile — clean vertical card layout, no GSAP pin
    if (isMobile) {
        const cards = [
            {
                img: STICKY_IMAGES[0],
                num: '01',
                title: 'Architects of the Phygital Economy.',
                body: 'Merging immersive digital worlds with high-frequency global trade infrastructure.',
                accentTitle: true,
            },
            {
                img: STICKY_IMAGES[1],
                num: '02',
                title: 'Ghost Logistics & Trade.',
                body: 'Next-gen supply chains driven by algorithmic demand and immersive commerce.',
                accentTitle: false,
            },
            {
                img: STICKY_IMAGES[2],
                num: '03',
                title: 'The Aura Protocol.',
                body: 'Redefining the fan-to-icon relationship through biometric identity and digital ownership.',
                accentTitle: false,
            },
        ];
        return (
            <section style={{ background: 'var(--bg-void)', padding: '3rem 1rem 4rem' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ display: 'inline-block', width: '20px', height: '1px', background: 'var(--accent)', flexShrink: 0 }} />
                    Phygital Economy
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cards.map((card, i) => (
                        <MobileFeatureCard key={card.num} card={card} index={i} />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="sticky-cols w-screen overflow-visible">
            <div className="sticky-cols-wrapper relative w-full h-screen">
                {/* SLIDE 1 — The Vision */}
                <div className="col col-1">
                    <div className="col-content">
                        <div className="col-content-wrapper">
                            <h1 className="text-2xl text-[var(--accent)] font-bold leading-auto">Architects of
                                <br />
                                the Phygital
                                <br />
                                Economy.
                            </h1>
                            <div className="col-content-para flex items-center gap-4 justify-between">
                                <div className="flex items-center gap-0 justify-center">
                                <h3 className="border-1 px-3 py-1 text-[var(--accent)]">1</h3>
                                    <h3 className="border-1 px-3 py-1 text-[var(--accent)]/50">3</h3>
                                </div>
                                <p className={`text-[12px] font-medium  ${!reveal ? "mr-6" : "mr-0"}`}>Merging immersive digital worlds with
                                    <br />
                                    high-frequency global trade infrastructure.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="col col-2">
                    <div className="col-img col-img-1">
                        <div className="col-img-wrapper">
                            <img src={STICKY_IMAGES[0].src} alt="Cristi Labs — Phygital Economy Architecture" loading="lazy" decoding="async" />
                        </div>
                    </div>
                    <div className="col col-img-2 p-2">
                        <div className="col-img-wrapper">
                            <img src={STICKY_IMAGES[1].src} alt="Cristi Labs — Ghost Logistics & Trade" loading="lazy" decoding="async" />
                        </div>
                    </div>
                </div>
                {/* SLIDE 2 & 3 — col-3 contains both content wrappers */}
                <div className="col col-3">
                    {/* SLIDE 2 — The Trade (visible during phase 1) */}
                    <div className="col-content-wrapper">
                        <h1 className="text-2xl leading-auto text-[var(--text-primary)]">Ghost Logistics
                            <br />
                            &amp; Trade.
                        </h1>
                        <div className={`col-content-para flex items-center gap-4 justify-between ${reveal ? "ml-0" : "ml-6"}`}>
                            <div className="flex items-center gap-0 justify-center">
                                <h3 className="border-1 px-3 py-1 text-[var(--accent)]">{(reveal) ? "3" : "2"}</h3>
                                <h3 className="border-1 px-3 py-1 text-[var(--accent)]/50">3</h3>
                            </div>
                            <p className="text-[12px] font-medium">Next-gen supply chains driven by
                                <br />
                                algorithmic demand and immersive commerce.
                            </p>
                        </div>
                    </div>
                    {/* SLIDE 3 — The Tech (revealed during phase 2) */}
                    <div className="col-content-wrapper-2">
                        <h1 className="text-2xl leading-auto text-[var(--text-primary)]">The Aura
                            <br />
                            Protocol.
                        </h1>
                        <div className="col-content-para flex items-center gap-4 justify-between">
                            <div className="flex items-center gap-0 justify-center">
                            </div>
                            <p className={`text-[12px] font-medium  ${!reveal ? "mr-0" : "mr-6"}`}>Redefining the fan-to-icon relationship
                                <br />
                                through biometric identity and digital ownership.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col col-4">
                    <div className="col-img col-img-1">
                        <div className="col-img-wrapper">
                            <img src={STICKY_IMAGES[2].src} alt="The Aura Protocol — Cristi Labs digital identity platform" loading="lazy" decoding="async" />
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default StickyCols;
