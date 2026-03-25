import React, { useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './gallery.css';

import galleryHq        from '../../assets/Medias/gallery/cristi-labs-hq.png';
import globalTrade      from '../../assets/Medias/gallery/global-trade.png';
import infiniteSeatImg  from '../../assets/Medias/Slides/the-infinite-seat.png';
import ghostLogisticsImg from '../../assets/Medias/Slides/ghost-logistics.png';
import digitalVaultsVid from '../../assets/Medias/Slides/digital-vaults.mp4';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Local gallery images — cinematic, dark-toned
const GALLERY_IMAGES = [
    {
        src: infiniteSeatImg,
        alt: "The Infinite Seat — Cristi Labs virtual stadium experience",
        label: "THE INFINITE SEAT",
    },
    {
        src: ghostLogisticsImg,
        alt: "Ghost Logistics — Cristi Labs global arbitrage and digital twin trade",
        label: "GHOST LOGISTICS",
    },
    {
        src: null,
        vidSrc: digitalVaultsVid,
        isVideo: true,
        alt: "Digital Vaults — Cristi Labs 3D gamified luxury asset trading",
        label: "DIGITAL VAULTS",
    },
    {
        src: globalTrade,
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
    const videoRef           = useRef(null);
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
        gsap.set(".gallery-topText h4, .gallery-topText h3, .gallery-topText p, .gallery-bottomText h3", { opacity: 1, x: 0 });

        tl4.to(".gallery-box h3", { opacity: 0 }, 'a')
            .to(".gallery-page4 .gallery-background", {
                width: "calc(100vw - 1rem)", height: "calc(100vh - 1rem)",
                borderRadius: "3.5rem", y: -40,
            }, 'a')
            .to(".gallery-page4 .gallery-background img", { transform: "scale(1)" }, 'a')
            .from(".gallery-background .gallery-topText h4, .gallery-background .gallery-topText h3, .gallery-background .gallery-topText p, .gallery-background .gallery-bottomText h3", { opacity: 0, x: 50 })
            .to({}, { duration: 0.4 }, "+=0")
            .to("#gallery-second", { transform: "translate(-50%, -56%)" }, 'b')
            .to("#gallery-second img", { transform: "scale(1)" }, 'b')
            .to(".gallery-page4 .gallery-background", { scale: 0.9, opacity: 0, y: -50 }, 'b')
            .from("#gallery-second .gallery-topText h4, #gallery-second .gallery-topText h3, #gallery-second .gallery-topText p, #gallery-second .gallery-bottomText h3", { opacity: 0, x: 50 })
            .to({}, { duration: 0.4 }, "+=0")
            .to("#gallery-third", { transform: "translate(-50%, -56%)" }, 'c')
            .to("#gallery-third video", { transform: "scale(1)" }, 'c')
            .to("#gallery-second", { scale: 0.9, opacity: 0 }, 'c')
            .from("#gallery-third .gallery-topText h4, #gallery-third .gallery-topText h3, #gallery-third .gallery-topText p, #gallery-third .gallery-bottomText h3", { opacity: 0, x: 50 })
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

    // Mobile: per-card IntersectionObserver entrance (reliable, no stuck opacity)
    useEffect(() => {
        if (!isMobile) return;

        const cards = cardRefs.current.filter(Boolean);
        if (!cards.length) return;

        // Set initial hidden state
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px) scale(0.92)';
            card.style.filter = 'blur(6px)';
            card.style.transition = 'none';
        });

        const observers = [];
        cards.forEach((card, i) => {
            const observer = new IntersectionObserver(([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    card.style.transition = `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s, filter 0.7s ease ${i * 0.06}s`;
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                    card.style.filter = 'blur(0px)';
                }));
            }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
            observer.observe(card);
            observers.push(observer);
        });

        return () => observers.forEach(o => o.disconnect());
    }, [isMobile]);

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

    // Lazy-load video only when slide 3 enters viewport — saves bandwidth + battery
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                if (!video.src) video.src = digitalVaultsVid;
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        }, { threshold: 0.1 });

        observer.observe(video);
        return () => observer.disconnect();
    }, []);

    const SLIDER_LABELS = ['Cristi Labs', 'The Infinite Seat', 'Ghost Logistics', 'Digital Vaults', 'The Aura Protocol', 'Beyond Borders'];
    const generateBrandElements = (quantity = 6) => {
        return SLIDER_LABELS.slice(0, quantity).map((label, i) => (
            <h3 key={i + 1} style={{ "--index": i + 1 }} className='tracking-tighter'>{label}</h3>
        ));
    };

    // Mobile — horizontal swipe with snap scrolling
    if (isMobile) {
        return (
            <section
                ref={mobileRef}
                style={{ background: 'var(--bg-void)', padding: '3rem 0 4rem', perspective: '1200px' }}
            >
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '2rem', paddingLeft: '1rem' }}>
                    § VENTURE DIVISIONS
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
                            {img.isVideo ? (
                                <video
                                    src={img.vidSrc}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="none"
                                    style={{ width: '100%', height: '110%', objectFit: 'cover', objectPosition: 'center center', pointerEvents: 'none' }}
                                />
                            ) : (
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    width={1920}
                                    height={1080}
                                    style={{ width: '100%', height: '110%', objectFit: 'cover', objectPosition: 'center center' }}
                                    loading={i === 0 ? 'eager' : 'lazy'}
                                    decoding="async"
                                />
                            )}
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
                    src={infiniteSeatImg}
                    alt="The Infinite Seat — Cristi Labs virtual stadium experience"
                    width={1920}
                    height={1080}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover', objectPosition: 'center center',
                        display: 'block', pointerEvents: 'none',
                    }}
                />
                <div className="gallery-topText">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(8px, 0.75vw, 10px)', letterSpacing: '0.28em', color: 'var(--accent-gold)', textTransform: 'uppercase', margin: 0 }}>
                            Division V · Virtual Stadiums
                        </p>
                        <h4>THE INFINITE SEAT</h4>
                    </div>
                </div>
                <div className="gallery-bottomText">
                    <h3>The sold-out problem — solved forever. We engineer hyper-realistic virtual arenas where fans attend World Cups, championship nights, and sold-out concerts from anywhere on Earth. FIFA. NFL. NBA. We hold every seat.</h3>
                </div>
            </div>

            <div id="gallery-second" className="gallery-background2">
                <img
                    src={ghostLogisticsImg}
                    alt="Ghost Logistics — Cristi Labs global digital twin trade"
                    width={1920}
                    height={1080}
                    loading="lazy"
                    decoding="async"
                    style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover', objectPosition: 'center center',
                        display: 'block', pointerEvents: 'none',
                    }}
                />
                <div className="gallery-topText">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(8px, 0.75vw, 10px)', letterSpacing: '0.28em', color: 'var(--accent-gold)', textTransform: 'uppercase', margin: 0 }}>
                            Division III · Digital Twin Trade
                        </p>
                        <h4>GHOST LOGISTICS</h4>
                    </div>
                </div>
                <div className="gallery-bottomText">
                    <h3>From Shenzhen to New York in 48 hours. We master the global arbitrage — securing exclusive rights to emerging technologies and launching capsule-quality brands before the market knows they exist. Every physical product ships with a verified digital twin.</h3>
                </div>
            </div>

            <div id="gallery-third" className="gallery-background2">
                <video
                    ref={videoRef}
                    muted
                    loop
                    playsInline
                    preload="none"
                    style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover', objectPosition: 'center center',
                        display: 'block', pointerEvents: 'none',
                    }}
                />
                <div className="gallery-topText">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(8px, 0.75vw, 10px)', letterSpacing: '0.28em', color: 'var(--accent-gold)', textTransform: 'uppercase', margin: 0 }}>
                            Division I · RWA Immersive Commerce
                        </p>
                        <h4>DIGITAL VAULTS</h4>
                    </div>
                </div>
                <div className="gallery-bottomText">
                    <h3>Where $50,000 transactions begin in the browser. We build 3D gamified vaults for rare watches, exotic assets, and limited-edition luxury — where the unboxing experience starts long before the package arrives. High-frequency commerce. Cinematic precision.</h3>
                </div>
            </div>
        </section>
    );
};

export default Gallery;
