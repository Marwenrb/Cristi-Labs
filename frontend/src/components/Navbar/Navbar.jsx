import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useFooterBounds } from "../../hooks/useFooterBounds";
import "./Navbar.css";

const navLinks = [
    { name: "Home", path: "/", subtitle: "The Hub" },
    { name: "Ventures", path: "/ventures", subtitle: "Our 5 Niches" },
    { name: "Global Trade", path: "/global-trade", subtitle: "Logistics & Import/Export" },
    { name: "Vision", path: "/vision", subtitle: "Philosophy" },
    { name: "The Vault", path: "/store", subtitle: "Premium Access" },
    { name: "Contact", path: "/contact", subtitle: "Corporate Access" },
];

const MenuButton = ({ isOpen, onClick }) => (
    <button
        onClick={onClick}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        style={{
            position: 'relative',
            background: 'rgba(11, 11, 11, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            padding: '0',
            display: 'flex',
            alignItems: 'stretch',
            borderRadius: '0',
            transition: 'border-color 0.3s, box-shadow 0.3s',
            outline: 'none',
        }}
        onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--accent)';
            e.currentTarget.style.boxShadow = '0 0 20px var(--accent-glow)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.boxShadow = 'none';
        }}
    >
        {/* Corner tick marks — targeting reticle aesthetic */}
        <span style={{ position:'absolute', top:'-4px', left:'-4px', width:'7px', height:'7px', borderTop:'1px solid var(--accent)', borderLeft:'1px solid var(--accent)' }} />
        <span style={{ position:'absolute', top:'-4px', right:'-4px', width:'7px', height:'7px', borderTop:'1px solid var(--accent)', borderRight:'1px solid var(--accent)' }} />
        <span style={{ position:'absolute', bottom:'-4px', left:'-4px', width:'7px', height:'7px', borderBottom:'1px solid var(--accent)', borderLeft:'1px solid var(--accent)' }} />
        <span style={{ position:'absolute', bottom:'-4px', right:'-4px', width:'7px', height:'7px', borderBottom:'1px solid var(--accent)', borderRight:'1px solid var(--accent)' }} />

        {/* Icon segment */}
        <div style={{ padding:'14px 18px', display:'flex', flexDirection:'column', justifyContent:'center', gap:'5px' }}>
            <div style={{
                height: '1px', width: '20px',
                background: isOpen ? 'var(--accent)' : 'var(--text-primary)',
                transformOrigin: 'center',
                transform: isOpen ? 'translateY(6px) rotate(45deg)' : 'none',
                transition: 'transform 0.35s var(--ease-out-expo), background 0.2s',
            }} />
            <div style={{
                height: '1px',
                width: isOpen ? '0' : '12px',
                background: 'var(--accent)',
                transition: 'width 0.25s var(--ease-out-expo)',
            }} />
            <div style={{
                height: '1px', width: '20px',
                background: isOpen ? 'var(--accent)' : 'var(--text-primary)',
                transformOrigin: 'center',
                transform: isOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
                transition: 'transform 0.35s var(--ease-out-expo), background 0.2s',
            }} />
        </div>

        {/* Separator */}
        <div style={{ width: '1px', alignSelf: 'stretch', background: 'var(--border)' }} />

        {/* Label segment */}
        <div style={{ padding: '0 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '80px' }}>
            <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '8px',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: isOpen ? 'var(--accent)' : 'var(--text-secondary)',
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
    const location = useLocation();
    const bottomPx = useFooterBounds();

    const handleNavClick = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Full-screen Overlay Navigation */}
            <div
                className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-700 ease-in-out ${
                    isOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                }`}
                style={{
                    background: 'rgba(11, 11, 11, 0.97)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                }}
            >
                <nav className="w-full h-full flex flex-col items-center justify-center gap-6 md:gap-10">
                    {navLinks.map((link, index) => (
                        <div key={index} className="text-center overflow-hidden">
                            {link.path.startsWith("#") ? (
                                <a
                                    href={link.path}
                                    onClick={handleNavClick}
                                    className="block text-[var(--text-primary)] text-3xl md:text-6xl tracking-wider hover:text-[var(--accent)] transition-colors duration-300" style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    {link.name}
                                </a>
                            ) : (
                                <Link
                                    to={link.path}
                                    onClick={handleNavClick}
                                    className={`block text-3xl md:text-6xl tracking-wider transition-colors duration-300 ${
                                        location.pathname === link.path
                                            ? "text-[var(--accent)]"
                                            : "text-[var(--text-primary)] hover:text-[var(--accent)]"
                                    }`} style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    {link.name}
                                </Link>
                            )}
                            <p className="text-[var(--accent)]/80 text-[0.65rem] tracking-[0.25em] uppercase mt-1" style={{ fontFamily: 'var(--font-mono)' }}>
                                {link.subtitle}
                            </p>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Floating Menu Button — sharp geometry, no icon library */}
            <div
                className="fixed left-1/2 -translate-x-1/2 z-50"
                style={{ bottom: `${bottomPx}px`, transition: 'bottom 0.35s ease' }}
            >
                <MenuButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
            </div>
        </>
    );
};

export default Navbar;
