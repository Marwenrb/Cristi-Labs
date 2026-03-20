import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

/**
 * InfiniteMarquee — GSAP-powered, Lenis-compatible infinite scrolling ticker.
 *
 * Props:
 *   items: string[]        — text items to display
 *   speed: number          — pixels per second (default 80)
 *   direction: 'left'|'right'  — scroll direction (default 'left')
 *   separator: string      — separator glyph between items (default '◆')
 *   className: string      — extra class names on root
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

    useGSAP(() => {
        const container = containerRef.current;
        const track = trackRef.current;
        if (!container || !track || !items.length) return;

        const totalWidth = track.scrollWidth;
        const dir = direction === 'left' ? -1 : 1;
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

        return () => tween.kill();
    }, { scope: containerRef, dependencies: [items, speed, direction] });

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
                <div ref={trackRef} className="flex shrink-0 items-center will-change-transform" style={{ width: 'max-content' }}>
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
