import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useFooterBounds } from "../../hooks/useFooterBounds";
import "./Navbar.css";

const navLinks = [
    { name: "Home",         path: "/",             subtitle: "The Hub" },
    { name: "Apex Transit", path: "/#apex-transit", subtitle: "Air Mobility" },
    { name: "Ventures",     path: "/ventures",     subtitle: "Our 5 Niches" },
    { name: "Global Trade", path: "/global-trade", subtitle: "Logistics & Import/Export" },
    { name: "Vision",       path: "/vision",        subtitle: "Philosophy" },
    { name: "The Vault",    path: "/store",         subtitle: "Premium Access" },
    { name: "Contact",      path: "/contact",       subtitle: "Corporate Access" },
];

const MenuButton = ({ isOpen, onClick }) => (
    <button
        onClick={onClick}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        style={{
            position: 'relative',
            background: 'rgba(5, 5, 7, 0.9)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid var(--border-default)',
            cursor: 'pointer',
            padding: '0',
            display: 'flex',
            alignItems: 'stretch',
            borderRadius: '0',
            transition: 'border-color 0.3s, box-shadow 0.3s',
            outline: 'none',
        }}
        onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--accent-gold)';
            e.currentTarget.style.boxShadow = '0 0 20px var(--accent-glow)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border-default)';
            e.currentTarget.style.boxShadow = 'none';
        }}
    >
        {/* Corner tick marks — targeting reticle aesthetic */}
        <span style={{ position:'absolute', top:'-4px', left:'-4px', width:'7px', height:'7px', borderTop:'1px solid var(--accent-gold)', borderLeft:'1px solid var(--accent-gold)' }} />
        <span style={{ position:'absolute', top:'-4px', right:'-4px', width:'7px', height:'7px', borderTop:'1px solid var(--accent-gold)', borderRight:'1px solid var(--accent-gold)' }} />
        <span style={{ position:'absolute', bottom:'-4px', left:'-4px', width:'7px', height:'7px', borderBottom:'1px solid var(--accent-gold)', borderLeft:'1px solid var(--accent-gold)' }} />
        <span style={{ position:'absolute', bottom:'-4px', right:'-4px', width:'7px', height:'7px', borderBottom:'1px solid var(--accent-gold)', borderRight:'1px solid var(--accent-gold)' }} />

        {/* Icon segment */}
        <div style={{ padding:'14px 18px', display:'flex', flexDirection:'column', justifyContent:'center', gap:'5px' }}>
            <div style={{
                height: '1px', width: '20px',
                background: isOpen ? 'var(--accent-gold)' : 'var(--text-primary)',
                transformOrigin: 'center',
                transform: isOpen ? 'translateY(6px) rotate(45deg)' : 'none',
                transition: 'transform 0.35s var(--ease-out-expo), background 0.2s',
            }} />
            <div style={{
                height: '1px',
                width: isOpen ? '0' : '12px',
                background: 'var(--accent-gold)',
                transition: 'width 0.25s var(--ease-out-expo)',
            }} />
            <div style={{
                height: '1px', width: '20px',
                background: isOpen ? 'var(--accent-gold)' : 'var(--text-primary)',
                transformOrigin: 'center',
                transform: isOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
                transition: 'transform 0.35s var(--ease-out-expo), background 0.2s',
            }} />
        </div>

        {/* Separator */}
        <div style={{ width: '1px', alignSelf: 'stretch', background: 'var(--border-default)' }} />

        {/* Label segment */}
        <div style={{ padding: '0 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '80px' }}>
            <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '8px',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: isOpen ? 'var(--accent-gold)' : 'var(--text-secondary)',
                transition: 'color 0.3s',
                whiteSpace: 'nowrap',
            }}>
                {isOpen ? 'CLOSE' : 'MENU'}
            </span>
        </div>
    </button>
);

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [nearBottom, setNearBottom] = useState(false);
    const location            = useLocation();
    const navigate            = useNavigate();
    const bottomPx            = useFooterBounds();
    const linkItemRefs        = useRef([]);

    const handleNavClick = (link) => {
        setIsOpen(false);
        // Handle hash links (e.g. /#apex-transit)
        if (link.path.includes('#')) {
            const hash = link.path.split('#')[1];
            if (location.pathname === '/') {
                // Already on home — scroll directly
                setTimeout(() => {
                    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
                }, 400);
            } else {
                // Navigate to home first, then scroll
                navigate('/');
                setTimeout(() => {
                    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
                }, 800);
            }
        }
    };

    // Fade out MENU button when within 180px of the page bottom
    useEffect(() => {
        const checkScroll = () => {
            const scrolled = window.scrollY;
            const total    = document.documentElement.scrollHeight;
            const viewH    = window.innerHeight;
            setNearBottom(total - scrolled - viewH < 180);
        };
        window.addEventListener('scroll', checkScroll, { passive: true });
        checkScroll();
        return () => window.removeEventListener('scroll', checkScroll);
    }, []);

    // GSAP entrance animation on open/close
    useEffect(() => {
        const items = linkItemRefs.current.filter(Boolean);
        if (!items.length) return;

        if (isOpen) {
            gsap.fromTo(
                items,
                { x: 60, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: 'expo.out', delay: 0.15 }
            );
        } else {
            gsap.to(items, { x: -40, opacity: 0, duration: 0.3, stagger: 0.04, ease: 'expo.in' });
        }
    }, [isOpen]);

    // Lock body scroll when overlay is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <>
            {/* ── DESKTOP: Full-screen overlay navigation ── */}
            <div
                className={`fixed inset-0 z-[100] hidden md:flex items-center justify-center transition-opacity duration-700 ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                style={{ background: 'linear-gradient(135deg, #050507 0%, #0A0A14 100%)' }}
            >
                {/* Decorative radial glow */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'radial-gradient(circle at 80% 20%, rgba(201,168,76,0.04) 0%, transparent 60%)',
                }} />

                <nav className="relative w-full h-full flex flex-col items-center justify-center gap-6 md:gap-10">
                    {navLinks.map((link, index) => (
                        <div
                            key={index}
                            ref={(el) => { linkItemRefs.current[index] = el; }}
                            className="text-center nav-link-item"
                            style={{ opacity: 0 }}
                        >
                            <Link
                                to={link.path.includes('#') ? '/' : link.path}
                                onClick={() => handleNavClick(link)}
                                className={`nav-overlay-link block tracking-wider ${
                                    location.pathname === link.path
                                        ? 'nav-overlay-link--active'
                                        : ''
                                }`}
                                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
                            >
                                {link.name}
                            </Link>
                            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.25em', color: 'var(--accent-gold-dim)', textTransform: 'uppercase', marginTop: '4px' }}>
                                {link.subtitle}
                            </p>
                        </div>
                    ))}
                </nav>
            </div>

            {/* ── MOBILE: Bottom sheet drawer ── */}
            <div
                className={`fixed left-0 right-0 bottom-0 z-[100] flex flex-col md:hidden transition-transform duration-500`}
                style={{
                    transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
                    height: '80vh',
                    background: 'rgba(5, 5, 7, 0.97)',
                    backdropFilter: 'blur(40px)',
                    WebkitBackdropFilter: 'blur(40px)',
                    borderRadius: '24px 24px 0 0',
                    borderTop: '1px solid var(--border-subtle)',
                    transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
            >
                {/* Drag handle */}
                <div className="flex justify-center pt-4 pb-2 flex-shrink-0">
                    <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'var(--border-default)' }} />
                </div>

                {/* Mobile nav links */}
                <nav className="flex flex-col items-center justify-center flex-1 gap-4 px-6 pb-10 overflow-y-auto">
                    {navLinks.map((link, index) => (
                        <div
                            key={index}
                            className="text-center w-full pb-4 border-b border-[var(--border-subtle)] last:border-b-0"
                            style={{ opacity: isOpen ? 1 : 0, transition: `opacity 0.4s ease ${0.1 + index * 0.06}s` }}
                        >
                            <Link
                                to={link.path.includes('#') ? '/' : link.path}
                                onClick={() => handleNavClick(link)}
                                className={`block tracking-wider text-3xl ${
                                    location.pathname === link.path
                                        ? 'text-[var(--accent-gold)]'
                                        : 'text-[var(--text-primary)]'
                                }`}
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                {link.name}
                            </Link>
                            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.25em', color: 'var(--accent-gold-dim)', textTransform: 'uppercase', marginTop: '4px' }}>
                                {link.subtitle}
                            </p>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Mobile backdrop */}
            <div
                className={`fixed inset-0 z-[99] md:hidden transition-opacity duration-400 ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                style={{ background: 'rgba(5,5,7,0.7)', backdropFilter: 'blur(8px)' }}
                onClick={() => setIsOpen(false)}
            />

            {/* ── Floating Menu Button ── */}
            <div
                className="fixed left-1/2 z-[101]"
                style={{
                    bottom: `${bottomPx}px`,
                    transform: 'translateX(-50%)',
                    opacity: nearBottom ? 0 : 1,
                    pointerEvents: nearBottom ? 'none' : 'auto',
                    transition: 'bottom 0.35s ease, opacity 0.4s ease',
                }}
            >
                <MenuButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
            </div>
        </>
    );
};

export default Navbar;
