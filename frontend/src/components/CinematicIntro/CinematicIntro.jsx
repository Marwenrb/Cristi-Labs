import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import cinematicImg from '../../assets/Pages Media/CinematicIntro.png';
import './CinematicIntro.css';

/* ═══════════════════════════════════════════════════════════════
 *  CinematicIntro — SOVEREIGN PHOTO EXPERIENCE v4
 *  Plays every app open. Pure image. Zero text.
 *
 *  DESKTOP  — Ken Burns zoom-drift · dual flares · bloom · iris exit
 *  MOBILE   — Starts tight on center logo, zooms out to reveal full
 *             composition, then slow horizontal drift. Full-screen
 *             cover with no black bars.
 *
 *  GPU-only: transform / opacity / clip-path / filter
 * ═══════════════════════════════════════════════════════════════ */

const IS_MOBILE = () => window.innerWidth <= 768;

export default function CinematicIntro() {
    const [visible, setVisible] = useState(true);

    const rootRef     = useRef(null);
    const imageRef    = useRef(null);
    const barTopRef   = useRef(null);
    const barBotRef   = useRef(null);
    const vignetteRef = useRef(null);
    const flare1Ref   = useRef(null);
    const flare2Ref   = useRef(null);
    const gradeRef    = useRef(null);
    const irisRef     = useRef(null);
    const bloomRef    = useRef(null);
    const tlRef       = useRef(null);

    /* ── Exit — iris close + blackout ── */
    const exit = useCallback(() => {
        if (tlRef.current) tlRef.current.kill();

        const tl = gsap.timeline({
            onComplete: () => {
                setVisible(false);
                document.body.style.overflow = '';
                window.dispatchEvent(new Event('cinematic-done'));
            },
        });

        // Iris closes to center
        tl.to(irisRef.current, {
            clipPath: 'circle(0% at 50% 50%)',
            duration: 0.75,
            ease: 'power3.in',
        }, 0);

        // Bars crush inward
        tl.to(barTopRef.current, { scaleY: 6, duration: 0.6, ease: 'power3.in' }, 0.1)
          .to(barBotRef.current, { scaleY: 6, duration: 0.6, ease: 'power3.in' }, 0.1);

        // Container blackout
        tl.to(rootRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
        }, 0.55);
    }, []);

    /* ── Main cinematic sequence ── */
    useEffect(() => {
        if (!visible) return;
        if (!rootRef.current) return;

        document.body.style.overflow = 'hidden';

        const img      = imageRef.current;
        const barTop   = barTopRef.current;
        const barBot   = barBotRef.current;
        const vignette = vignetteRef.current;
        const flare1   = flare1Ref.current;
        const flare2   = flare2Ref.current;
        const grade    = gradeRef.current;
        const iris     = irisRef.current;
        const bloom    = bloomRef.current;
        const mobile   = IS_MOBILE();

        // ── Initial states ──
        gsap.set(barTop,   { yPercent: -100 });
        gsap.set(barBot,   { yPercent: 100 });
        gsap.set(vignette, { opacity: 0 });
        gsap.set(flare1,   { opacity: 0, xPercent: -50 });
        gsap.set(flare2,   { opacity: 0, xPercent: 150 });
        gsap.set(grade,    { opacity: 0 });
        gsap.set(bloom,    { opacity: 0 });
        gsap.set(iris,     { clipPath: 'circle(150% at 50% 50%)' });

        if (mobile) {
            /* MOBILE: Start slightly zoomed, pan horizontally
               to reveal the full panoramic composition */
            gsap.set(img, { opacity: 0, scale: 1.35, xPercent: 15, yPercent: 0 });
        } else {
            gsap.set(img, { opacity: 0, scale: 1.18, xPercent: 2, yPercent: -1 });
        }

        const tl = gsap.timeline();
        tlRef.current = tl;

        /* ═══ ACT 1 — EMERGENCE ═══ */
        tl.to(img, {
            opacity: 1,
            duration: mobile ? 1.0 : 1.6,
            ease: 'power2.out',
        }, 0.2);

        /* ═══ ACT 2 — KEN BURNS ═══ */
        if (mobile) {
            /* MOBILE: horizontal tracking pan across the panorama */
            tl.to(img, {
                scale: 1.30,
                xPercent: -15,
                duration: 5.0,
                ease: 'power1.inOut',
            }, 0.2);
        } else {
            /* DESKTOP: zoom-out + diagonal drift */
            tl.to(img, {
                scale: 1.0,
                xPercent: -1,
                yPercent: 0.5,
                duration: 5.0,
                ease: 'power1.out',
            }, 0.2);
        }

        /* ═══ ACT 3 — LETTERBOX BARS ═══ */
        tl.to(barTop, { yPercent: 0, duration: 0.7, ease: 'expo.out' }, 0.8)
          .to(barBot, { yPercent: 0, duration: 0.7, ease: 'expo.out' }, 0.8);

        /* ═══ ACT 4 — VIGNETTE ═══ */
        tl.to(vignette, {
            opacity: 1,
            duration: 2.0,
            ease: 'sine.inOut',
        }, 1.0);

        /* ═══ ACT 5 — GOLD ANAMORPHIC FLARE ═══ */
        tl.to(flare1, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 1.5);
        tl.to(flare1, {
            xPercent: 350,
            duration: mobile ? 1.6 : 1.9,
            ease: 'power1.inOut',
        }, 1.5);
        tl.to(flare1, { opacity: 0, duration: 0.7, ease: 'power2.in' }, mobile ? 2.4 : 2.7);

        /* ═══ ACT 6 — WARM COLOR GRADE ═══ */
        tl.to(grade, {
            opacity: 1,
            duration: 1.8,
            ease: 'sine.inOut',
        }, 2.0);

        /* ═══ ACT 7 — CENTER BLOOM ═══ */
        tl.to(bloom, {
            opacity: 1,
            duration: 1.0,
            ease: 'power2.out',
        }, mobile ? 1.2 : 2.5);
        tl.to(bloom, {
            opacity: 0,
            duration: 1.5,
            ease: 'sine.in',
        }, mobile ? 2.8 : 3.5);

        /* ═══ ACT 8 — COOL COUNTER-FLARE ═══ */
        tl.to(flare2, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 3.0);
        tl.to(flare2, {
            xPercent: -250,
            duration: 1.5,
            ease: 'power1.inOut',
        }, 3.0);
        tl.to(flare2, { opacity: 0, duration: 0.6, ease: 'power2.in' }, 3.9);

        /* ═══ ACT 9 — BREATHING PULSE ═══ */
        if (!mobile) {
            tl.to(img, {
                scale: 1.04,
                xPercent: 0,
                duration: 1.4,
                ease: 'sine.inOut',
            }, 3.8);
        } else {
            tl.to(img, {
                scale: 1.25,
                xPercent: 0,
                duration: 1.4,
                ease: 'sine.inOut',
            }, 3.8);
        }

        /* ═══ ACT 10 — EXIT ═══ */
        tl.call(exit, null, 5.2);

        return () => {
            tl.kill();
            document.body.style.overflow = '';
        };
    }, [visible, exit]);

    useEffect(() => {
        if (!visible) document.body.style.overflow = '';
    }, [visible]);

    if (!visible) return null;

    return (
        <div ref={rootRef} className="ci-root" aria-hidden="true" role="presentation">

            <div className="ci-black-base" />

            {/* Image layer */}
            <div className="ci-image-wrap">
                <img
                    ref={imageRef}
                    src={cinematicImg}
                    alt=""
                    draggable={false}
                    className="ci-image"
                    width={1920}
                    height={1080}
                    fetchPriority="high"
                />
            </div>

            {/* Static scrim */}
            <div className="ci-scrim" />

            {/* Animated vignette */}
            <div ref={vignetteRef} className="ci-vignette" />

            {/* Warm color grade */}
            <div ref={gradeRef} className="ci-grade" />

            {/* Center bloom */}
            <div ref={bloomRef} className="ci-bloom" aria-hidden="true" />

            {/* Film grain */}
            <div className="ci-grain" aria-hidden="true" />

            {/* Anamorphic flare 1 — gold */}
            <div ref={flare1Ref} className="ci-flare ci-flare--gold" aria-hidden="true" />

            {/* Anamorphic flare 2 — cool */}
            <div ref={flare2Ref} className="ci-flare ci-flare--cool" aria-hidden="true" />

            {/* Iris mask */}
            <div ref={irisRef} className="ci-iris" />

            {/* Letterbox bars */}
            <div ref={barTopRef} className="ci-bar ci-bar--top" aria-hidden="true" />
            <div ref={barBotRef} className="ci-bar ci-bar--bot" aria-hidden="true" />

            {/* Skip */}
            <button
                className="ci-skip"
                onClick={exit}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') exit(); }}
                aria-label="Skip intro"
                tabIndex={0}
            >
                SKIP
            </button>
        </div>
    );
}
