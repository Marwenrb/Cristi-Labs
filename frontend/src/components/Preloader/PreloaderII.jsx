import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import "./preloaderII.css";

gsap.registerPlugin(SplitText);
export default function PreloaderII() {
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

        // Gate SplitText behind font readiness to prevent wrong measurements
        document.fonts.ready.then(() => {
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
    }, []);

    return (
        <div className="size-full fixed z-[9999] overflow-hidden pointer-events-none">
            <div className="preloader-progress">
                <div className="preloader-progress-bar"></div>
                <div className="preloader-logo">
                    <h1>Cristi Labs</h1>
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