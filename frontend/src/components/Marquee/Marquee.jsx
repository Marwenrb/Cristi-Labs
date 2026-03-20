import { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

/**
 * InfiniteMarquee — GSAP-powered, Lenis-compatible infinite scrolling ticker.
 * CSS fallback animation on mobile if GSAP fails to measure width.
 */
export default function InfiniteMarquee({
    items = [],
    speed = 80,
    direction = 'left',
    separator = '◆',
    className = '',
}) {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const [gsapActive, setGsapActive] = useState(false);

    useGSAP(() => {
        const track = trackRef.current;
        if (!track || !items.length) return;

        // Delay measure to ensure paint completes
        const startAnimation = () => {
            const totalWidth = track.scrollWidth;
            if (totalWidth < 10) return; // bail if still 0

            setGsapActive(true);

            const duration = totalWidth / speed;
            const tween = gsap.fromTo(
                track,
                { x: direction === 'right' ? -totalWidth : 0 },
                {
                    x: direction === 'right' ? 0 : -totalWidth,
                    duration,
                    ease: 'none',
                    repeat: -1,
                }
            );
            return tween;
        };

        // Try immediately
        let tween = startAnimation();

        // If failed (width was 0), retry after paint
        if (!tween) {
            const retryId = requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    tween = startAnimation();
                });
            });
            return () => {
                cancelAnimationFrame(retryId);
                tween?.kill();
            };
        }

        return () => tween?.kill();
    }, { scope: containerRef, dependencies: [items, speed, direction] });

    // CSS fallback: if GSAP hasn't started after 2s, use CSS animation
    useEffect(() => {
        const id = setTimeout(() => {
            if (!gsapActive && trackRef.current) {
                trackRef.current.style.animation =
                    direction === 'left'
                        ? `marqueeScroll ${items.length * 4}s linear infinite`
                        : `marqueeScrollReverse ${items.length * 4}s linear infinite`;
            }
        }, 2000);
        return () => clearTimeout(id);
    }, [gsapActive, direction, items.length]);

    // Duplicate items 4× for seamless loop
    const displayItems = [...items, ...items, ...items, ...items];

    return (
        <div
            className={`overflow-hidden w-full ${className}`}
            style={{
                maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
            }}
        >
            <div ref={containerRef} className="overflow-hidden">
                <div
                    ref={trackRef}
                    className="flex shrink-0 items-center will-change-transform"
                    style={{ width: 'max-content' }}
                >
                    {displayItems.map((item, i) => (
                        <span key={i} className="flex items-center shrink-0">
                            <span
                                className="px-6 whitespace-nowrap uppercase"
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: 'clamp(0.95rem, 2vw, 1.5rem)',
                                    letterSpacing: '0.15em',
                                    color: 'var(--text-secondary)',
                                }}
                            >
                                {item}
                            </span>
                            <span style={{ color: 'var(--accent)', fontSize: '0.75rem', flexShrink: 0 }}>
                                {separator}
                            </span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
