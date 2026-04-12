import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import "./preloaderII.css";

gsap.registerPlugin(SplitText);

const PRELOADER_LINES = [
    'Initializing global trade infrastructure...',
    'Calibrating digital venture systems...',
    'Establishing 47-country network links...',
    'Cristi Labs · Coming Online.',
];

export default function PreloaderII() {
    const preloaderRef = useRef(null);

    useGSAP(() => {
        function createSplitTexts(elements) {
            const splits = {};
            elements.forEach(({ key, selector, type }) => {
                const config = { type, mask: type };
                if (type === "chars") { config.charsClass = "char"; }
                if (type === "lines") { config.linesClass = "line"; }
                splits[key] = SplitText.create(selector, config);
            });
            return splits;
        }

        const splitElements = [
            { key: "logoChars", selector: ".preloader-logo h1", type: "chars" },
            { key: "footerLines", selector: ".preloader-footer p", type: "lines" },
        ];

        // Wait for cinematic intro to finish, then for fonts
        const introReady = new Promise((resolve) => {
            window.addEventListener('cinematic-done', resolve, { once: true });
        });

        introReady.then(() => document.fonts.ready).then(() => {
            const splits = createSplitTexts(splitElements);

            gsap.set(splits.logoChars.chars, { x: "100%" });
            gsap.set([splits.footerLines.lines], { y: "100%" });

            function animateProgress(duration = 3.5) {
                const tl = gsap.timeline();
                tl.to(".preloader-progress-bar", {
                    scaleX: 1,
                    duration,
                    ease: "power2.inOut",
                });
                return tl;
            }

            // Rotating preloader lines
            const lines = PRELOADER_LINES.map((_, i) =>
                preloaderRef.current?.querySelector(`.preloader-line-${i}`)
            ).filter(Boolean);

            if (lines.length) {
                const linesTl = gsap.timeline({ delay: 0.5 });
                lines.forEach((line, i) => {
                    const dur = 0.4;
                    const hold = 0.7;
                    const t = i * (dur + hold);
                    linesTl.to(line, { opacity: 1, y: '-50%', x: '-50%', duration: dur, ease: 'expo.out' }, t);
                    if (i < lines.length - 1) {
                        linesTl.to(line, { opacity: 0, y: '-150%', duration: dur * 0.8, ease: 'expo.in' }, t + dur + hold);
                    }
                });
            }

            const tl = gsap.timeline({ delay: 0.3 });
            tl.to(splits.logoChars.chars, {
                x: "0%",
                stagger: 0.05,
                duration: 1,
                ease: "power4.inOut",
            })
                .to(
                    splits.footerLines.lines,
                    {
                        y: "0%",
                        stagger: 0.1,
                        duration: 1,
                        ease: "power4.inOut",
                    },
                    "0.25"
                )
                .add(animateProgress(), "<")
                .to(
                    splits.logoChars.chars,
                    {
                        x: "-100%",
                        stagger: 0.05,
                        duration: 1,
                        ease: "power4.inOut",
                    },
                    "-=0.5"
                )
                .to(splits.footerLines.lines, {
                    y: "-100%",
                    stagger: 0.1,
                    duration: 1,
                    ease: "power4.inOut",
                })
                .to(
                    ".preloader-progress",
                    {
                        opacity: 0,
                        duration: 0.7,
                        ease: "power3.out",
                    },
                    "-=0.25"
                )
                .to(
                    ".preloader-mask",
                    {
                        scale: 5,
                        duration: 5,
                        ease: "power3.out",
                    },
                    "<"
                )
                .to(
                    ".preloader-mask",
                    {
                        delay: 1,
                        opacity: 0,
                        display: "none",
                    },
                    "<"
                );
        });
    }, { scope: preloaderRef });

    return (
        <div ref={preloaderRef} className="size-full fixed z-[9999] overflow-hidden pointer-events-none">
            <div className="preloader-progress">
                <div className="preloader-progress-bar"></div>
                <div className="preloader-logo">
                    <h1>Cristi Labs</h1>
                </div>

                {/* Rotating status lines */}
                <div
                    className="preloader-lines"
                    style={{
                        position: 'absolute',
                        bottom: '8rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'clamp(0.55rem, 1.5vw, 0.7rem)',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'var(--text-secondary)',
                        height: '1.2em',
                        overflow: 'hidden',
                        minWidth: '280px',
                        textAlign: 'center',
                    }}
                >
                    {PRELOADER_LINES.map((line, i) => (
                        <span
                            key={i}
                            className={`preloader-line-${i}`}
                            style={{
                                display: 'block',
                                position: 'absolute',
                                left: '50%',
                                transform: 'translateX(-50%) translateY(100%)',
                                opacity: 0,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {line}
                        </span>
                    ))}
                </div>
            </div>

            <div className="preloader-mask"></div>

            <div className="preloader-content">
                <div className="preloader-footer">
                    <p className="preloader-tagline">
                        Digital Entertainment · Global Trade · Phygital Ecosystems
                    </p>
                </div>
            </div>
        </div >
    );
}