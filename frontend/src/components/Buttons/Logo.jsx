import { Link } from 'react-router-dom'

const Logo = () => {
    return (
        <div className='fixed top-[5vw] md:top-[4vw] left-7 z-40 flex items-center h-11'>
            <Link
                to="/"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    textDecoration: 'none',
                    userSelect: 'none',
                }}
            >
                {/* CL monogram mark — geometric square, not a circle */}
                <div style={{
                    width: '32px',
                    height: '32px',
                    border: '1px solid var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    position: 'relative',
                }}>
                    {/* Crosshair horizontal */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '4px',
                        right: '4px',
                        height: '1px',
                        background: 'var(--accent)',
                        opacity: 0.35,
                        transform: 'translateY(-50%)',
                    }} />
                    {/* Crosshair vertical */}
                    <div style={{
                        position: 'absolute',
                        left: '50%',
                        top: '4px',
                        bottom: '4px',
                        width: '1px',
                        background: 'var(--accent)',
                        opacity: 0.35,
                        transform: 'translateX(-50%)',
                    }} />
                    {/* CL lettermark */}
                    <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        fontWeight: '500',
                        color: 'var(--accent)',
                        letterSpacing: '0px',
                        lineHeight: 1,
                        position: 'relative',
                        zIndex: 1,
                    }}>
                        CL
                    </span>
                </div>

                {/* Wordmark — CRISTI heavy + LABS brass mono */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0px',
                    lineHeight: 1,
                }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '20px',
                            fontWeight: 400,
                            color: 'var(--text-primary)',
                            letterSpacing: '3px',
                            lineHeight: 1,
                        }}>
                            CRISTI
                        </span>
                        <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            fontWeight: 500,
                            color: 'var(--accent)',
                            letterSpacing: '4px',
                            lineHeight: 1,
                            paddingBottom: '1px',
                        }}>
                            LABS
                        </span>
                    </div>
                    {/* Micro tagline — always visible */}
                    <span
                        className="logo-tagline"
                        style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '7px',
                            color: 'var(--text-tertiary)',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            display: 'block',
                        }}
                    >
                        VENTURE STUDIO
                    </span>
                </div>
            </Link>
        </div>
    )
}

export default Logo
