import gsap, { ScrollTrigger, SplitText } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { useMediaQuery } from "react-responsive";
import colimg1 from "../../assets/Medias/sticky/sticky-1.png";
import colimg2 from "../../assets/Medias/sticky/sticky-2.png";
import colimg3 from "../../assets/Medias/sticky/sticky-3.png";
import { useState, useEffect } from "react";

const StickyCols = () => {

    const [reveal, setReveal] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 768 });

    useGSAP(() => {
        if (isMobile) return;

        gsap.registerPlugin(ScrollTrigger, SplitText);

        // 1️⃣ Split text lines once DOM ready
        const textElements = document.querySelectorAll(".col-3 h1, .col-3 p");
        textElements.forEach((element) => {
            const split = new SplitText(element, { type: "lines", linesClass: "line" });
            split.lines.forEach((line) => {
                line.innerHTML = `<span>${line.textContent}</span>`;
            });
        });

        // Refresh ScrollTrigger after split
        ScrollTrigger.refresh();

        // 2️⃣ Initial state
        gsap.set(".col-3 .col-content-wrapper .line span", { yPercent: 0 });
        gsap.set(".col-3 .col-content-wrapper-2 .line span", { yPercent: -125 });

        // 3️⃣ Controlled phase logic using timeline (simpler and stable)
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".sticky-cols",
                start: "top top",
                end: "+=90%",
                pin: true,
                scrub: 1,
                // markers: true,
            },
        });
        tl.add(() => setReveal(false));
        // PHASE 1: Reveal col-2, hide col-1
        tl.to(".col-1", { opacity: 0, scale: 0.8, duration: 0.8 })
            .to(".col-2", { x: "0%", duration: 0.8 }, "<")
            .to(".col-3", { y: "0%", duration: 0.8 }, "<")
            .to(".col-img-1 img", { scale: 1, duration: 0.8 }, "<")
            .to(".col-img-2", {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                duration: 0.8,
            }, "<")
            .to(".col-img-2 img", { scale: 1.6, duration: 0.8 }, "<")

        tl.add(() => setReveal(false));
        tl.add(() => setReveal(true));
        // PHASE 2: Switch col-2 -> col-3 content
        tl.to(".col-2", { opacity: 0, scale: 0.8, duration: 0.8 })
            .to(".col-3 .col-content-wrapper .line span", {
                yPercent: -125,
                duration: 0.8,
            }, "<")
        tl.to(".col-3", { x: "0%", duration: 0.8 }, "-=0.8")
            .to(".col-4", { y: "0%", duration: 0.8 }, "<")
            .to(".col-3 .col-content-wrapper-2 .line span", {
                yPercent: 0,
                delay: 0.4,
                duration: 0.8,
            }, "<");

        return () => {
            ScrollTrigger.getAll().forEach((st) => st.kill());
            tl.kill();
        };
    }, [isMobile]);

    // Mobile — GSAP ScrollTrigger scroll-reveal + image parallax
    useEffect(() => {
        if (!isMobile) return;
        gsap.registerPlugin(ScrollTrigger);

        const allTriggers = [];

        const timer = setTimeout(() => {
            const cards = document.querySelectorAll('.sticky-mobile-card');
            if (!cards.length) return;

            cards.forEach((card, i) => {
                const img = card.querySelector('img');

                gsap.set(card, { opacity: 0, y: 45 });

                const st = ScrollTrigger.create({
                    trigger: card,
                    start: 'top 86%',
                    onEnter: () => {
                        gsap.to(card, {
                            opacity: 1, y: 0,
                            duration: 0.8,
                            ease: 'power3.out',
                            delay: i * 0.085,
                        });
                    },
                    once: true,
                });
                allTriggers.push(st);

                if (img) {
                    const anim = gsap.to(img, {
                        yPercent: 8,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1.5,
                        },
                    });
                    if (anim.scrollTrigger) allTriggers.push(anim.scrollTrigger);
                }
            });
        }, 120);

        return () => {
            clearTimeout(timer);
            allTriggers.forEach(t => t?.kill?.());
        };
    }, [isMobile]);

    // Mobile — clean vertical card layout, no GSAP pin
    if (isMobile) {
        const cards = [
            { img: colimg1, num: '01', title: 'Architects of the Phygital Economy.', body: 'Merging immersive digital worlds with high-frequency global trade infrastructure.', accentTitle: true },
            { img: colimg2, num: '02', title: 'Ghost Logistics & Trade.', body: 'Next-gen supply chains driven by algorithmic demand and immersive commerce.', accentTitle: false },
            { img: colimg3, num: '03', title: 'The Aura Protocol.', body: 'Redefining the fan-to-icon relationship through biometric identity and digital ownership.', accentTitle: false },
        ];
        return (
            <section style={{ background: 'var(--bg-void)', padding: '3rem 1rem 4rem' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ display: 'inline-block', width: '20px', height: '1px', background: 'var(--accent)', flexShrink: 0 }} />
                    Phygital Economy
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cards.map((card) => (
                        <div key={card.num} className="sticky-mobile-card" style={{ border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', background: 'var(--bg-void)' }}>
                            <div style={{ height: '56vw', overflow: 'hidden' }}>
                                <img src={card.img} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="sticky-cols w-screen overflow-hidden">
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
                            <img src={colimg1} alt="Cristi Labs — Phygital Economy Architecture" />
                        </div>
                    </div>
                    <div className="col col-img-2 p-2">
                        <div className="col-img-wrapper">
                            <img src={colimg2} alt="Cristi Labs — Ghost Logistics & Trade" />
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
                            <img src={colimg3} alt="Cristi Labs — The Aura Protocol" />
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default StickyCols;
