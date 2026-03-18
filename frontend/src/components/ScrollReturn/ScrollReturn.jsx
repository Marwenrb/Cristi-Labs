import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/* ─────────────────────────────────────────────────────────────────
 *  ScrollReturn
 *  "Ticker Tape" scroll indicator — fixed bottom-right
 *  Vertical progress line + rotated monospace label + brass dot
 *  Appears after 40% of page scrolled. No icons, no chevrons.
 * ───────────────────────────────────────────────────────────────── */
export default function ScrollReturn() {
    const containerRef = useRef(null)
    const [visible, setVisible] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const update = () => {
            const smoother = window.__smoother
            const scrollY = smoother ? smoother.scrollTop() : window.scrollY
            const total = document.body.scrollHeight - window.innerHeight
            const pct = total > 0 ? Math.min(1, scrollY / total) : 0

            setProgress(pct)
            setVisible(scrollY > window.innerHeight * 0.4)
        }

        window.addEventListener('scroll', update, { passive: true })
        update()
        return () => window.removeEventListener('scroll', update)
    }, [])

    useEffect(() => {
        if (!containerRef.current) return
        gsap.to(containerRef.current, {
            opacity: visible ? 1 : 0,
            y: visible ? 0 : 16,
            duration: 0.4,
            ease: 'power3.out',
        })
    }, [visible])

    const handleClick = () => {
        const smoother = window.__smoother
        if (smoother) {
            smoother.scrollTo(0, true)
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    return (
        <div
            ref={containerRef}
            onClick={handleClick}
            style={{
                position: 'fixed',
                bottom: '40px',
                right: '40px',
                zIndex: 90,
                opacity: 0,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                userSelect: 'none',
            }}
        >
            {/* Progress track — vertical thin line */}
            <div style={{
                width: '1px',
                height: '64px',
                background: 'var(--border)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Fill — rises from bottom as page scrolls */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: `${progress * 100}%`,
                    background: 'var(--accent)',
                    transition: 'height 0.1s linear',
                }} />
            </div>

            {/* Label — vertical monospace, rotated 180° to read bottom-up */}
            <div
                style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    letterSpacing: '3px',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    height: '72px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color var(--duration-mid) var(--ease-out-expo)',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
                RETURN
            </div>

            {/* Brass dot — the trigger */}
            <div
                style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    boxShadow: '0 0 12px var(--accent-glow)',
                    transition: 'transform var(--duration-fast)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.8)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
            />
        </div>
    )
}
