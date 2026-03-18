import React, { useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './gallery.css';

import gbg1 from '../../assets/Medias/gallery/gallery-1.png';
import gbg2 from '../../assets/Medias/gallery/gallery-2.png';
import gbg3 from '../../assets/Medias/gallery/gallery-3.png';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Gallery = () => {
    const pageRef = useRef(null);
    const mobileRef = useRef(null);
    const isMobile = useMediaQuery({ maxWidth: 768 });

    useEffect(() => {
        if (isMobile) return;
        // Create new timeline
        const tl4 = gsap.timeline({
            scrollTrigger: {
                trigger: ".gallery-page4",
                start: "30% 30%",
                end: "220% 30%",
                scrub: 1,
                pin: true,
            }
        });

        // Add background color animation
        tl4.to(".gallery-page4", {
            backgroundColor: "var(--bg-void)",
        }, 'start');

        gsap.set(".gallery-topText h4, .gallery-topText h3, .gallery-bottomText h3", {
            opacity: 1,
            x: 0
        });

        // Animation sequence
        tl4.to(".gallery-box h3", {
            opacity: 0,
        }, 'a')
            .to(".gallery-page4 .gallery-background", {
                width: "calc(100vw - 1rem)",
                height: "calc(100vh - 1rem)",
                borderRadius: "3.5rem",
                y: -40,
            }, 'a')
            .to(".gallery-page4 .gallery-background img", {
                transform: "scale(1)",
            }, 'a')
            .from(".gallery-background .gallery-topText h4, .gallery-background .gallery-topText h3, .gallery-background .gallery-bottomText h3", {
                opacity: 0,
                x: 50,
            })
            .to({}, { duration: 0.4 }, "+=0")

            .to("#gallery-second", {
                transform: "translate(-50%, -56%)",
            }, 'b')
            .to("#gallery-second img", {
                transform: "scale(1)",
            }, 'b')
            .to(".gallery-page4 .gallery-background", {
                scale: 0.9,
                opacity: 0,
                y: -50
            }, 'b')
            .from("#gallery-second .gallery-topText h4, #gallery-second .gallery-topText h3, #gallery-second .gallery-bottomText h3", {
                opacity: 0,
                x: 50,
            })
            .to({}, { duration: 0.4 }, "+=0")
            .to("#gallery-third", {
                transform: "translate(-50%, -56%)",
            }, 'c')
            .to("#gallery-third img", {
                transform: "scale(1)",
            }, 'c')
            .to("#gallery-second", {
                scale: 0.9,
                opacity: 0,
            }, 'c')
            .from("#gallery-third .gallery-topText h4, #gallery-third .gallery-topText h3, #gallery-third .gallery-bottomText h3", {
                opacity: 0,
                x: 50,
            })
            .to({}, { duration: 0.4 }, "+=0");

        // Clean up function
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [isMobile]);

    // Mobile — GSAP ScrollTrigger scroll-reveal + image parallax
    useEffect(() => {
        if (!isMobile) return;
        gsap.registerPlugin(ScrollTrigger);

        const allTriggers = [];

        const timer = setTimeout(() => {
            const cards = document.querySelectorAll('.gallery-mobile-card');
            if (!cards.length) return;

            cards.forEach((card, i) => {
                const img = card.querySelector('img');

                gsap.set(card, { opacity: 0, y: 52, scale: 0.96 });

                const st = ScrollTrigger.create({
                    trigger: card,
                    start: 'top 88%',
                    onEnter: () => {
                        gsap.to(card, {
                            opacity: 1, y: 0, scale: 1,
                            duration: 0.85,
                            ease: 'power3.out',
                            delay: i * 0.07,
                        });
                    },
                    once: true,
                });
                allTriggers.push(st);

                if (img) {
                    const anim = gsap.to(img, {
                        yPercent: 10,
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

    const generateBrandElements = (quantity = 6) => {
        const elements = [];
        for (let i = 1; i <= quantity; i++) {
            elements.push(
                <h3 key={i} style={{ "--index": i }} className='tracking-tighter'>
                    Cristi Labs
                </h3>
            );
        }
        return elements;
    };

    // Mobile — marquee always visible + 3 static image cards
    if (isMobile) {
        const cards = [
            { img: gbg1, label: 'Digital Entertainment', caption: 'Premium content and experiences delivered with refined craft and modern vision.' },
            { img: gbg2, label: 'International Trade', caption: 'Cross-border commerce and strategic partnerships at the heart of global markets.' },
            { img: gbg3, label: 'Strategic Vision', caption: 'Innovation meets integrity — where digital media and commerce converge.' },
        ];
        return (
            <section ref={mobileRef} style={{ background: 'var(--bg-void)', padding: '3rem 1rem 4rem' }}>
                {/* Marquee — always visible on mobile */}
                <div style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1.25rem 0', marginBottom: '2rem' }}>
                    <div className="gallery-marquee-mobile">
                        {[...Array(12)].map((_, i) => (
                            <span key={i} style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '2.25rem',
                                color: 'var(--text-tertiary)',
                                letterSpacing: '0.04em',
                                flexShrink: 0,
                                paddingRight: '2.5rem',
                            }}>
                                Cristi Labs
                            </span>
                        ))}
                    </div>
                </div>
                {/* Image cards — vertical */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cards.map((card, i) => (
                        <div key={i} className="gallery-mobile-card" style={{ position: 'relative', borderRadius: '1.25rem', overflow: 'hidden', height: '62vw' }}>
                            <img src={card.img} alt={card.label} style={{ width: '100%', height: '110%', objectFit: 'cover', objectPosition: 'center top' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,11,11,0.96) 0%, rgba(11,11,11,0.35) 55%, transparent 100%)', zIndex: 1 }} />
                            <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem', zIndex: 2 }}>
                                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '6px' }}>
                                    {card.label}
                                </p>
                                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                                    {card.caption}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="gallery-page4 " ref={pageRef}>
            <div className="gallery-slider">
                <div
                    className="gallery-box"
                    style={{ "--time": "40s", "--quantity": 6 }}
                >
                    {generateBrandElements(6)}
                </div>
            </div>

            <div className="gallery-background">
                <img src={gbg1} alt="Cristi Labs — Digital Entertainment Division" />
                <div className="gallery-topText">
                    <h4>Digital Entertainment</h4>
                </div>
                <div className="gallery-bottomText">
                    <h3>Premium content and experiences delivered with refined craft and modern vision.</h3>
                </div>
            </div>

            <div id="gallery-second" className="gallery-background2">
                <img src={gbg2} alt="Cristi Labs — International Trade Operations" />
                <div className="gallery-topText">
                    <h4>International Trade</h4>
                </div>
                <div className="gallery-bottomText">
                    <h3>Cross-border commerce and strategic partnerships at the heart of global markets.</h3>
                </div>
            </div>

            <div id="gallery-third" className="gallery-background2">
                <img src={gbg3} alt="Cristi Labs — Strategic Vision & Innovation" />
                <div className="gallery-topText">
                    <h4>Strategic Vision</h4>
                </div>
                <div className="gallery-bottomText">
                    <h3>Innovation meets integrity—where digital media and commerce converge.</h3>
                </div>
            </div>
        </section>
    );
};

export default Gallery;