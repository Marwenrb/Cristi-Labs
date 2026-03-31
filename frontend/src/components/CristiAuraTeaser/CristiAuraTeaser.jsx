/* ══════════════════════════════════════════════════════════════════════════
   CRISTI AURA TEASER — React Component
   Cristi Labs LLC · 2026
   ══════════════════════════════════════════════════════════════════════════ */

import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import cristiAuraImg from '../../assets/Medias/gallery/Cr7 Cristi Aura Logo.jpg';
import './CristiAuraTeaser.css';

gsap.registerPlugin(ScrollTrigger);

// Typing messages — rotate through these
const TYPING_MESSAGES = [
  'INITIALIZING PROTOCOL...',
  'ACCESS LEVEL: CLASSIFIED',
  'PROJECT: CRISTI AURA',
  'ETA: UNDISCLOSED',
  'STAND BY...',
];

export default function CristiAuraTeaser() {
  const sectionRef = useRef(null);
  const textColRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const cursorRef = useRef(null);
  const subRef = useRef(null);
  const typingRef = useRef(null);
  const typingTextRef = useRef(null);
  const badgeRef = useRef(null);
  const imageColRef = useRef(null);
  const imageFrameRef = useRef(null);
  const imgRef = useRef(null);
  const imageScaleRef = useRef(null);
  const stampRef = useRef(null);

  // GSAP Animations
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
      onComplete: () => {
        gsap.set([titleRef.current, imageFrameRef.current, imageScaleRef.current], { willChange: 'auto' });
      }
    });

    // Respect reduced motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      gsap.set([eyebrowRef.current, titleRef.current, subRef.current,
                 typingRef.current, badgeRef.current, imageFrameRef.current,
                 imgRef.current, imageScaleRef.current, stampRef.current,
                 ...sectionRef.current.querySelectorAll('.cat-image-corner')],
        { opacity: 1, clipPath: 'none', filter: 'none', transform: 'none' });
      return;
    }

    // Set will-change
    gsap.set([titleRef.current, imageFrameRef.current, imageScaleRef.current], { willChange: 'transform, opacity' });

    // 0.0s — eyebrow fades up
    tl.to(eyebrowRef.current, {
      opacity: 1, y: 0, duration: 0.6, ease: 'power3.out'
    }, 0)
    // 0s — set initial y
    tl.from(eyebrowRef.current, { y: 12 }, 0);

    // 0.15s — title sweeps in from left via clip-path
    tl.to(titleRef.current, {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.0,
      ease: 'power4.inOut',
    }, 0.15);

    // 0.55s — sub text
    tl.to(subRef.current, {
      opacity: 1, duration: 0.5, ease: 'power2.out'
    }, 0.55);

    // 0.7s — typing container appears
    tl.to(typingRef.current, {
      opacity: 1, duration: 0.3, ease: 'none'
    }, 0.7);

    // 0.85s — badges
    tl.to(badgeRef.current, {
      opacity: 1, y: 0, duration: 0.5, ease: 'power3.out'
    }, 0.85);
    tl.from(badgeRef.current, { y: 10 }, 0.85);

    // IMAGE — clip reveal from bottom upward
    tl.to(imageFrameRef.current, {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.2,
      ease: 'power4.inOut',
    }, 0.2);

    // Image scale settle — on the scale wrapper (separate from parallax)
    tl.to(imageScaleRef.current, {
      scale: 1,
      duration: 1.4,
      ease: 'power3.out',
      onComplete: () => {
        if (imageScaleRef.current) {
          imageScaleRef.current.style.willChange = 'auto';
        }
      }
    }, 0.2);

    // Corner brackets staggered
    tl.to(sectionRef.current.querySelectorAll('.cat-image-corner'), {
      opacity: 1,
      duration: 0.4,
      stagger: 0.1,
      ease: 'power2.out',
    }, 1.0);

    // CLASSIFIED stamp — class-based stamp impact animation
    tl.call(() => {
      if (stampRef.current) {
        stampRef.current.classList.add('is-stamped');
      }
    }, [], 1.3);

    // Parallax scroll effect on image (subtle)
    gsap.to(imgRef.current, {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      }
    });

    // useGSAP auto-cleans its scope — no manual kill needed
  }, { scope: sectionRef });

  // Typing effect — useEffect separate from GSAP
  useEffect(() => {
    let msgIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout;

    const type = () => {
      const msg = TYPING_MESSAGES[msgIndex];
      if (!typingTextRef.current) return;

      if (!isDeleting) {
        typingTextRef.current.textContent = msg.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === msg.length) {
          isDeleting = true;
          timeout = setTimeout(type, 1800); // pause at full word
          return;
        }
      } else {
        typingTextRef.current.textContent = msg.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          msgIndex = (msgIndex + 1) % TYPING_MESSAGES.length;
        }
      }
      timeout = setTimeout(type, isDeleting ? 28 : 48);
    };

    // Start typing after scroll animation (1.5s delay)
    const startDelay = setTimeout(() => type(), 1500);
    return () => { clearTimeout(timeout); clearTimeout(startDelay); };
  }, []);

  return (
    <section className="cristi-aura-teaser" ref={sectionRef}>
      <div className="cat-inner">
        
        {/* Left: text column */}
        <div className="cat-text-col" ref={textColRef}>
          <div className="cat-eyebrow" ref={eyebrowRef}>
            <span className="cat-dot" />
            <span className="cat-eyebrow-label">CLASSIFIED PROJECT</span>
          </div>
          <h2 className="cat-title" ref={titleRef}>
            CRISTI<br />AURA<span className="cat-title-cursor" ref={cursorRef} />
          </h2>
          <p className="cat-sub" ref={subRef}>Something is coming.</p>
          <div className="cat-typing-container" ref={typingRef}>
            <span className="cat-typing-text" ref={typingTextRef} />
            <span className="cat-typing-cursor">█</span>
          </div>
          <div className="cat-badge-row" ref={badgeRef}>
            <span className="cat-badge">COMING SOON</span>
            <span className="cat-badge cat-badge--dim">2026</span>
          </div>
        </div>

        {/* Right: image column */}
        <div className="cat-image-col" ref={imageColRef}>
          <div className="cat-image-frame" ref={imageFrameRef}>
            <div className="cat-image-overlay" />
            <div className="cat-image-scanlines" />
            <div className="cat-image-scale-wrapper" ref={imageScaleRef}>
              <img
                src={cristiAuraImg}
                alt="Cristi Aura"
                className="cat-image"
                ref={imgRef}
                loading="lazy"
                width="600"
                height="800"
              />
            </div>
            <div className="cat-image-vignette" />
            <div className="cat-image-corner cat-image-corner--tl" />
            <div className="cat-image-corner cat-image-corner--tr" />
            <div className="cat-image-corner cat-image-corner--bl" />
            <div className="cat-image-corner cat-image-corner--br" />

            {/* CLASSIFIED stamp — centered inside frame */}
            <div className="cat-classified-stamp" ref={stampRef} aria-hidden="true">
              <span className="cat-stamp-inner">CLASSIFIED</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
