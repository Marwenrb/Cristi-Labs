import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaQuery } from "react-responsive";
import { welcomeLinesLG, welcomeLinesSM } from "../../constants/welcome";
import SectionDivider from "../SectionDivider/SectionDivider";

import portVideo  from "../../assets/Medias/welcome/Container Port · Global Trade Infrastructure.mp4";
import towerVideo from "../../assets/Medias/welcome/Futuristic Corporate Tower · Digital Vision.mp4";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
    { value: 2.4, suffix: "B+", prefix: "$", label: "Global Trade Volume" },
    { value: 47,  suffix: "",   prefix: "",  label: "Countries" },
];

const Welcome = () => {
    const isMobile    = useMediaQuery({ maxWidth: 768 });
    const welcomeLines = isMobile ? welcomeLinesSM : welcomeLinesLG;
    const statsRefs   = useRef([]);

    useGSAP(() => {
        // Clip-path text reveal (existing)
        const lines = gsap.utils.toArray(".clip-text-welcome");
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".welcome-section",
                start: "top 75%",
                end: "bottom 75%",
                scrub: true,
            },
        });
        lines.forEach((line) => {
            tl.to(line, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", stagger: 0.2, duration: 1 });
        });

        // Stat counter animation
        STATS.forEach((stat, i) => {
            const el = statsRefs.current[i];
            if (!el) return;
            const obj = { val: 0 };
            gsap.to(obj, {
                val: stat.value,
                duration: 2,
                ease: "power2.out",
                onUpdate: () => {
                    const isDecimal = stat.value % 1 !== 0;
                    el.textContent = stat.prefix + (isDecimal ? obj.val.toFixed(1) : Math.floor(obj.val)) + stat.suffix;
                },
                scrollTrigger: {
                    trigger: ".welcome-stats",
                    start: "top 85%",
                    once: true,
                },
            });
        });
    });

    return (
        <div className='welcome-section w-full h-auto text-[#2A2725] md:px-7 px-6'>
            <div className='flex flex-col gap-2 tracking-[-4] leading-2'>
                <div className="w-full md:w-[86%] md:text-[64px] text-[34px] welcome-line md:pt-20">
                    <div className="w-full welcome-text flex flex-col justify-center items-start">
                        {welcomeLines.map((text, index) => (
                            <span key={index} className="relative block text-darkBrown md:tracking-[-0.010em] tracking-[0.015em]">
                                {text}
                                <span className="clip-text-welcome md:tracking-[-0.010em] tracking-[0.015em]">{text}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex md:flex-row flex-col justify-between items-center md:p-4 md:mt-20 mt-10">
                <div className="flex flex-row justify-center items-center gap-1">
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <video
                            src={portVideo}
                            autoPlay loop muted playsInline controls={false} preload="none"
                            aria-hidden="true"
                            className="md:rounded-[8rem] rounded-[9rem] md:w-56 w-44 object-cover pointer-events-none"
                            style={{ display: 'block' }}
                        />
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(135deg, rgba(11,11,11,0.25) 0%, rgba(184,146,74,0.08) 100%)',
                            borderRadius: 'inherit', pointerEvents: 'none',
                        }} />
                    </div>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <video
                            src={towerVideo}
                            autoPlay loop muted playsInline controls={false} preload="none"
                            aria-hidden="true"
                            className="md:rounded-[8rem] rounded-[9rem] md:w-56 w-44 object-cover pointer-events-none"
                            style={{ display: 'block' }}
                        />
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(135deg, rgba(11,11,11,0.25) 0%, rgba(184,146,74,0.08) 100%)',
                            borderRadius: 'inherit', pointerEvents: 'none',
                        }} />
                    </div>
                </div>
                <div className="md:w-1/2 w-full md:mt-0 mt-10">
                    <p className="md:text-[2rem] text-[1.4rem] text-[var(--text-secondary)] md:leading-[1.1] md:pr-24 font-light leading-[26px] tracking-[-0.2px]">
                        <span>Excellence in digital experiences and cross-border commerce.</span><br />
                        <span>A corporate vision built on innovation and integrity.</span>
                    </p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="welcome-stats" style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                {STATS.map((stat, i) => (
                    <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span
                            ref={(el) => { statsRefs.current[i] = el; }}
                            className="welcome-stat__value"
                        >
                            {stat.prefix}0{stat.suffix}
                        </span>
                        <span className="welcome-stat__label">{stat.label}</span>
                    </div>
                ))}
            </div>

            <SectionDivider index={1} total={5} />
        </div>
    );
};

export default Welcome;
