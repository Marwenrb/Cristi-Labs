import React, { useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './gallery.css';

import gallery1 from '../../assets/Medias/gallery/gallery-1.png';
import gallery2 from '../../assets/Medias/gallery/gallery-2.png';
import gallery3 from '../../assets/Medias/gallery/gallery-3.png';
import galleryHq from '../../assets/Medias/gallery/Cristi Labs Hq.png';
import galleryTrade from '../../assets/Medias/gallery/global trade.png';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Local gallery images — cinematic, dark-toned
const GALLERY_IMAGES = [
    {
        src: gallery1,
        alt: "Aerial view of freight terminal at dusk — Cristi Labs logistics network",
        label: "GLOBAL INFRASTRUCTURE",
    },
    {
        src: gallery2,
        alt: "Circuit board macro — Cristi Labs precision technology",
        label: "TECHNOLOGY PRECISION",
    },
    {
        src: gallery3,
        alt: "Earth from orbit — Cristi Labs worldwide operations",
        label: "GLOBAL REACH",
    },
    {
        src: galleryTrade,
        alt: "Global trade operations — Cristi Labs financial intelligence",
        label: "FINANCIAL INTELLIGENCE",
    },
    {
        src: galleryHq,
        alt: "Cristi Labs corporate headquarters — power and scale",
        label: "EXECUTIVE SPACES",
    },
];

// Swipe hint — persistent pulse (no fade-out)
const SwipeHint = () => (
    <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '8px', marginTop: '16px',
        pointerEvents: 'none',
        animation: 'swipePulse 2s ease-in-out infinite',
    }}>
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontSize: '10px', letterSpacing: '0.3em' }}>SWIPE</span>
        <span style={{ color: 'var(--accent-gold)', fontSize: '14px' }}>→</span>
    </div>
);

const Gallery = () => {
    const pageRef            = useRef(null);
    const mobileRef          = useRef(null);
    const scrollContainerRef = useRef(null);
    const cardRefs           = useRef([]);
    const isMobile           = useMediaQuery({ maxWidth: 768 });

    // Desktop: pinned scroll gallery with anticipatePin fix
    useEffect(() => {
        if (isMobile) return;

        const tl4 = gsap.timeline({
            scrollTrigger: {
                trigger: ".gallery-page4",
                start: "30% 30%",
                end: "220% 30%",
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            }
        });

        tl4.to(".gallery-page4", { backgroundColor: "var(--bg-void)" }, 'start');
        gsap.set(".gallery-topText h4, .gallery-topText h3, .gallery-bottomText h3", { opacity: 1, x: 0 });

        tl4.to(".gallery-box h3", { opacity: 0 }, 'a')
            .to(".gallery-page4 .gallery-background", {
                width: "calc(100vw - 1rem)", height: "calc(100vh - 1rem)",
                borderRadius: "3.5rem", y: -40,
            }, 'a')
            .to(".gallery-page4 .gallery-background img", { transform: "scale(1)" }, 'a')
            .from(".gallery-background .gallery-topText h4, .gallery-background .gallery-topText h3, .gallery-background .gallery-bottomText h3", { opacity: 0, x: 50 })
            .to({}, { duration: 0.4 }, "+=0")
            .to("#gallery-second", { transform: "translate(-50%, -56%)" }, 'b')
            .to("#gallery-second img", { transform: "scale(1)" }, 'b')
            .to(".gallery-page4 .gallery-background", { scale: 0.9, opacity: 0, y: -50 }, 'b')
            .from("#gallery-second .gallery-topText h4, #gallery-second .gallery-topText h3, #gallery-second .gallery-bottomText h3", { opacity: 0, x: 50 })
            .to({}, { duration: 0.4 }, "+=0")
            .to("#gallery-third", { transform: "translate(-50%, -56%)" }, 'c')
            .to("#gallery-third img", { transform: "scale(1)" }, 'c')
            .to("#gallery-second", { scale: 0.9, opacity: 0 }, 'c')
            .from("#gallery-third .gallery-topText h4, #gallery-third .gallery-topText h3, #gallery-third .gallery-bottomText h3", { opacity: 0, x: 50 })
            .to({}, { duration: 0.4 }, "+=0");

        const images = pageRef.current?.querySelectorAll('img') ?? [];
        let loaded = 0;
        const tryRefresh = () => { loaded++; if (loaded === images.length) ScrollTrigger.refresh(); };
        images.forEach(img => {
            if (img.complete) tryRefresh();
            else img.addEventListener('load', tryRefresh, { once: true });
        });

        return () => { tl4.scrollTrigger?.kill(); tl4.kill(); };
    }, [isMobile]);

    // Mobile: per-card entrance (once) + vertical parallax on inner image
    useGSAP(() => {
        if (!isMobile) return;

        const cards = cardRefs.current.filter(Boolean);
        if (!cards.length) return;

        // 3D flip entrance — fires once on scroll-into-view
        cards.forEach((card, i) => {
            gsap.fromTo(card,
                { opacity: 0, y: 60, rotateX: 25, scale: 0.85, filter: 'blur(8px)' },
                {
                    opacity: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)',
                    duration: 0.9, ease: 'expo.out', delay: i * 0.06,
                    scrollTrigger: { trigger: card, start: 'top 92%', once: true },
                }
            );
        });

        // Image parallax — lighter on mobile for smoother scroll feel
        cards.forEach((card) => {
            const img = card.querySelector('img');
            if (!img) return;
            gsap.to(img, {
                yPercent: -8, ease: 'none',
                scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 0 },
            });
        });

        // Scoped cleanup — only kill triggers created in this scope
        return () => { /* useGSAP auto-reverts context scope */ };
    }, { scope: mobileRef, dependencies: [isMobile] });

    // Mobile: horizontal swipe velocity → rotateY card tilt
    useEffect(() => {
        if (!isMobile) return;
        const container = scrollContainerRef.current;
        if (!container) return;

        let lastScrollLeft = 0;
        let rafId;

        const trackVelocity = () => {
            const currentScrollLeft = container.scrollLeft;
            const velocity = (currentScrollLeft - lastScrollLeft) * 0.08;
            lastScrollLeft = currentScrollLeft;

            cardRefs.current.filter(Boolean).forEach(card => {
                gsap.to(card, {
                    rotateY:  -velocity * 0.6,
                    skewY:     velocity * 0.15,
                    duration: 0.5,
                    ease:     'power3.out',
                    overwrite: 'auto',
                });
            });
            rafId = requestAnimationFrame(trackVelocity);
        };

        const handleScroll = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(trackVelocity);
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            cancelAnimationFrame(rafId);
            container.removeEventListener('scroll', handleScroll);
        };
    }, [isMobile]);

    const generateBrandElements = (quantity = 6) => {
        const elements = [];
        for (let i = 1; i <= quantity; i++) {
            elements.push(
                <h3 key={i} style={{ "--index": i }} className='tracking-tighter'>Cristi Labs</h3>
            );
        }
        return elements;
    };

    // Mobile — horizontal swipe with snap scrolling
    if (isMobile) {
        return (
            <section
                ref={mobileRef}
                style={{ background: 'var(--bg-void)', padding: '3rem 0 4rem', perspective: '1200px' }}
            >
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '2rem', paddingLeft: '1rem' }}>
                    § PORTFOLIO
                </p>

                {/* Horizontal swipe container */}
                <div
                    ref={scrollContainerRef}
                    style={{
                        display: 'flex', gap: '1rem', padding: '0 1rem 0.5rem',
                        overflowX: 'auto', scrollSnapType: 'x mandatory',
                        WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none',
                    }}
                >
                    {GALLERY_IMAGES.map((img, i) => (
                        <div
                            key={i}
                            className="gallery-mobile-card"
                            ref={el => { cardRefs.current[i] = el; }}
                            style={{
                                scrollSnapAlign: 'start', flex: '0 0 82vw',
                                height: '60vw', maxHeight: '420px',
                                borderRadius: '1.25rem', overflow: 'hidden',
                                border: '1px solid var(--border-subtle)',
                                position: 'relative', flexShrink: 0,
                                transformStyle: 'preserve-3d', willChange: 'transform, opacity',
                            }}
                        >
                            <img
                                    src={img.src}
                                    alt={img.alt}
                                    style={{ width: '100%', height: '110%', objectFit: 'cover', objectPosition: 'center center' }}
                                    loading={i === 0 ? 'eager' : 'lazy'}
                                    decoding="async"
                                />
                            {/* Gradient overlay */}
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: 'linear-gradient(to top, rgba(5,5,7,0.9) 0%, rgba(5,5,7,0.3) 55%, transparent 100%)',
                                pointerEvents: 'none',
                            }} />
                            {/* Card label */}
                            <div style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
                                <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)', fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '6px' }}>
                                    {String(i + 1).padStart(2, '0')} / {String(GALLERY_IMAGES.length).padStart(2, '0')}
                                </p>
                                <p style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: '1.25rem', lineHeight: 1 }}>
                                    {img.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Swipe hint — permanent pulse */}
                <SwipeHint />
            </section>
        );
    }

    return (
        <section className="gallery-page4" ref={pageRef}>
            <div className="gallery-slider">
                <div className="gallery-box" style={{ "--time": "40s", "--quantity": 6 }}>
                    {generateBrandElements(6)}
                </div>
            </div>

            <div className="gallery-background">
                <img
                    src={GALLERY_IMAGES[0].src}
                    alt={GALLERY_IMAGES[0].alt} loading="eager" decoding="async"
                />
                <div className="gallery-topText"><h4>Digital Entertainment</h4></div>
                <div className="gallery-bottomText">
                    <h3>Premium content and experiences delivered with refined craft and modern vision.</h3>
                </div>
            </div>

            <div id="gallery-second" className="gallery-background2">
                <img
                    src={GALLERY_IMAGES[1].src}
                    alt={GALLERY_IMAGES[1].alt} loading="lazy" decoding="async"
                />
                <div className="gallery-topText"><h4>International Trade</h4></div>
                <div className="gallery-bottomText">
                    <h3>Cross-border commerce and strategic partnerships at the heart of global markets.</h3>
                </div>
            </div>

            <div id="gallery-third" className="gallery-background2">
                <img
                    src={GALLERY_IMAGES[2].src}
                    alt={GALLERY_IMAGES[2].alt} loading="lazy" decoding="async"
                />
                <div className="gallery-topText"><h4>Strategic Vision</h4></div>
                <div className="gallery-bottomText">
                    <h3>Innovation meets integrity—where digital media and commerce converge.</h3>
                </div>
            </div>
        </section>
    );
};

export default Gallery;
