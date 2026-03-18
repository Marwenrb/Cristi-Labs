import { useGSAP } from "@gsap/react";
import gsap, { SplitText } from "gsap/all";
import { useMediaQuery } from "react-responsive";
import { chooseLinesLG, chooseLinesSM } from "../../constants/welcome";

const Choose = () => {

    const isMobD = useMediaQuery({
        query: "(max-width:768px)",
    });
    const chooseLines = isMobD ? chooseLinesSM : chooseLinesLG;

    useGSAP(() => {

        const lines = gsap.utils.toArray(".choose-title-clip");

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".choose-section",
                start: "top 75%",
                end: "bottom 100%",
                scrub: true,
                // markers: true,
            },
        });

        tl.from(".choose-subtitle", {
            yPercent: 100,
            opacity: 0,
            ease: "power1.inOut"
        });

        // Animate the div height
        if (!isMobD) {
            tl.fromTo(
                ".title-part",
                { height: "10vh" },
                { height: `${isMobD ? "22vh" : "50vh"}`, ease: "none" }
            );
        }

        // Animate text reveal — run *at the same time*
        tl.to(
            lines,
            {
                clipPath: "inset(0% 0% 0% 0%)",
                ease: "none",
                stagger: 0.2,
                duration: 1,
            },
            "<" // 👈 runs at the same time as the previous animation
        );

        if (!isMobD) {
            tl.from(".choose-sec", {
                yPercent: 100,
                duration: 1,
            }, "<");
        }
    });

    return (
        <section className="choose-section w-full min-h-dvh md:h-dvh p-4 md:p-8 pt-6 md:pt-10 pb-8 md:pb-10">
            <p className='text-[.65rem] md:text-[.7rem] text-[var(--accent)] choose-subtitle' style={{ fontFamily: 'var(--font-mono)' }}>Our Core Capabilities</p>
            <div className="lg:mt-10 mt-4 md:mt-7 title-part origin-bottom">
                {
                    chooseLines.map((line, index) => (
                        <h1 key={index} className={`choose-heading text-[var(--text-primary)] lg:text-[9.5rem] text-2xl sm:text-3xl leading-[0.9]`} font-medium tracking-tighter choose-title>
                            <span className={`choose-title-break ${index == 1 ? "lg:pb-3 pb-1 md:pb-2" : ""}`}>{line}<span className={`choose-title-clip ${index == 1 ? "lg:pb-3 pb-1 md:pb-2" : ""}`}>{line}</span></span>
                        </h1>
                    ))
                }
            </div>
            <div className="choose-sec w-full flex lg:flex-row flex-col justify-center items-start gap-4 md:gap-10 lg:mt-0 mt-4 md:mt-8">
                <div className='lg:w-1/2 w-full text-[var(--text-secondary)] lg:text-[2rem] text-[0.875rem] sm:text-[1rem] md:leading-[1.1] lg:mt-0 lg:pr-16'>
                    <p>Digital Entertainment and International Trade—delivered with precision. Our capabilities span content creation, distribution, and global commerce solutions tailored to your needs.</p>
                </div>
                <div className='lg:w-1/2 w-full'>
                    <div className="lg:w-[30%] w-full">
                        <p className="text-[.65rem] md:text-[.7rem] text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-mono)' }}>Cristi Labs—built on:</p>
                    </div>
                    <div className="flex flex-1 flex-wrap justify-start items-start gap-1.5 md:gap-2 mt-4 md:mt-8">
                        <div className="border-[1px] border-[var(--border-strong)] text-[var(--accent)] lg:text-[2rem] text-xs md:text-base px-3 md:px-5 py-1 md:py-1.5" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px' }}>
                            INNOVATION
                        </div>
                        <div className="border-[1px] border-[var(--border)] text-[var(--text-primary)] lg:text-[2rem] text-xs md:text-base px-3 md:px-5 py-1 md:py-1.5" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px' }}>
                            INTEGRITY
                        </div>
                        <div className="border-[1px] border-[var(--border-strong)] text-[var(--accent)] lg:text-[2rem] text-xs md:text-base px-3 md:px-5 py-1 md:py-1.5" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px' }}>
                            GLOBAL REACH
                        </div>
                        <div className="border-[1px] border-[var(--border)] text-[var(--text-primary)] lg:text-[2rem] text-xs md:text-base px-3 md:px-5 py-1 md:py-1.5" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px' }}>
                            EXCELLENCE
                        </div>
                        <div className="border-[1px] border-[var(--border-strong)] text-[var(--accent)] lg:text-[2rem] text-xs md:text-base px-3 md:px-5 py-1 md:py-1.5" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px' }}>
                            VISION
                        </div>
                        <div className="border-[1px] border-[var(--border)] text-[var(--text-primary)] lg:text-[2rem] text-xs md:text-base px-3 md:px-5 py-1 md:py-1.5" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px' }}>
                            PARTNERSHIP
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Choose;