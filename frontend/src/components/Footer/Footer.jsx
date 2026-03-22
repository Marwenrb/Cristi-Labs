import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import { useFooterGSAP } from "../../hooks/useFooterGSAP";
import GlobalPulse from "../GlobalPulse/GlobalPulse";
import FooterBrand from "./FooterBrand";
import "./footer.css";

const FOOTER_LINKS = [
    { to: "/",            label: "Home" },
    { to: "/ventures",    label: "Ventures" },
    { to: "/global-trade",label: "Global Trade" },
    { to: "/vision",      label: "Vision" },
    { to: "/store",       label: "The Vault" },
    { to: "/contact",     label: "Contact" },
];

const Footer = () => {
    const { footerRevealRef, footerInnerRef, linkRefs } = useFooterGSAP();

    useEffect(() => {
        const cols = document.querySelectorAll('.footer-col');
        if (!cols.length) return;

        cols.forEach((col, i) => {
            col.style.cssText = 'opacity:0;transform:translateY(24px);transition:none;';

            const obs = new IntersectionObserver(([entry]) => {
                if (!entry.isIntersecting) return;
                obs.disconnect();
                setTimeout(() => {
                    col.style.transition = 'opacity 0.7s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)';
                    col.style.opacity = '1';
                    col.style.transform = 'translateY(0)';
                }, i * 100);
            }, { threshold: 0.1 });

            obs.observe(col);
        });
    }, []);

    return (
        <section
            ref={footerRevealRef}
            className="footer-reveal-wrapper relative min-h-[60vh] w-full"
        >
            <footer
                ref={footerInnerRef}
                className="footer-inner absolute bottom-0 left-0 right-0 w-full will-change-transform"
            >
                <div className="relative w-full overflow-visible">
                    {/* Base dark layer */}
                    <div className="absolute inset-0 bg-[var(--bg-void)]/95 backdrop-blur-xl" />

                    {/* Top gold accent line */}
                    <div
                        className="absolute inset-0 border-t border-[var(--border)]"
                        style={{
                            background: "linear-gradient(180deg, rgba(184,146,74,0.04) 0%, transparent 50%)",
                        }}
                    />

                    <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-6 pb-10 md:pt-8 md:pb-12">
                        {/* Global Pulse — live world clock ticker */}
                        <GlobalPulse />

                        {/* Top Section: Brand + Navigation */}
                        <div id="footer-nav-block" className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-24">
                            <FooterBrand />

                        {/* Navigation + Corporate — 2-col grid on mobile, row on md+ */}
                        <div className="grid grid-cols-2 md:flex md:flex-row gap-8 md:gap-24 px-5 sm:px-8 md:px-0">
                                {/* Navigation */}
                                <div className="footer-col space-y-6 min-w-0">
                                    <p style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '7px',
                                        letterSpacing: '0.38em',
                                        textTransform: 'uppercase',
                                        color: 'rgba(184,146,74,0.4)',
                                        marginBottom: '1.25rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                    }}>
                                        <span style={{ display: 'inline-block', width: '18px', height: '1px', background: 'rgba(184,146,74,0.4)' }} />
                                        Navigation
                                    </p>
                                    <div className="flex flex-col gap-8">
                                        {FOOTER_LINKS.map((item, i) => (
                                            <Link
                                                key={item.to}
                                                ref={(el) => { linkRefs.current[i] = el; }}
                                                to={item.to}
                                                className="footer-magnetic-link will-change-transform"
                                                style={{
                                                    fontFamily: 'var(--font-body)',
                                                    fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                                                    color: 'var(--text-secondary)',
                                                    textDecoration: 'none',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    transition: 'color 0.3s ease, gap 0.3s ease',
                                                }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.color = 'var(--accent)';
                                                    e.currentTarget.style.gap = '14px';
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                                    e.currentTarget.style.gap = '8px';
                                                }}
                                            >
                                                <span style={{ display: 'inline-block', width: '4px', height: '4px', background: 'var(--accent)', transform: 'rotate(45deg)', flexShrink: 0, opacity: 0.5 }} />
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Corporate Access */}
                                <div className="footer-col space-y-6 min-w-0">
                                    <p style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '7px',
                                        letterSpacing: '0.38em',
                                        textTransform: 'uppercase',
                                        color: 'rgba(184,146,74,0.4)',
                                        marginBottom: '1.25rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                    }}>
                                        <span style={{ display: 'inline-block', width: '18px', height: '1px', background: 'rgba(184,146,74,0.4)' }} />
                                        Corporate Access
                                    </p>
                                    <div className="flex flex-col gap-8">
                                        <a
                                            href="mailto:access@cristilabs.net"
                                            ref={(el) => { linkRefs.current[FOOTER_LINKS.length] = el; }}
                                            className="footer-magnetic-link will-change-transform"
                                            style={{
                                                fontFamily: 'var(--font-body)',
                                                fontSize: '0.9rem',
                                                color: 'var(--text-secondary)',
                                                textDecoration: 'none',
                                                display: 'block',
                                                letterSpacing: '0.02em',
                                                transition: 'color 0.3s ease',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                                        >
                                            access@cristilabs.net
                                        </a>
                                        <a
                                            href="tel:+16816772084"
                                            ref={(el) => { linkRefs.current[FOOTER_LINKS.length + 1] = el; }}
                                            className="footer-magnetic-link will-change-transform"
                                            style={{
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: '0.8rem',
                                                color: 'var(--text-secondary)',
                                                textDecoration: 'none',
                                                display: 'block',
                                                letterSpacing: '0.06em',
                                                transition: 'color 0.3s ease',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                                        >
                                            +1 (681) 677‑2084
                                        </a>
                                    </div>

                                    <p style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '7px',
                                        letterSpacing: '0.38em',
                                        textTransform: 'uppercase',
                                        color: 'rgba(184,146,74,0.4)',
                                        marginTop: '1.5rem',
                                        paddingTop: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                    }}>
                                        <span style={{ display: 'inline-block', width: '18px', height: '1px', background: 'rgba(184,146,74,0.4)' }} />
                                        Connect
                                    </p>
                                    <div className="flex flex-col gap-6">
                                        {[
                                            { href: "#", icon: <FaFacebookF size={13} />, label: "Facebook" },
                                            { href: "#", icon: <FaInstagram size={13} />, label: "Instagram" },
                                            { href: "#", icon: <FaLinkedinIn size={13} />, label: "LinkedIn" },
                                        ].map((s, i) => (
                                            <a
                                                key={s.label}
                                                href={s.href}
                                                ref={(el) => { linkRefs.current[FOOTER_LINKS.length + 2 + i] = el; }}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="footer-magnetic-link will-change-transform"
                                                style={{
                                                    fontFamily: 'var(--font-body)',
                                                    fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                                                    color: 'var(--text-secondary)',
                                                    textDecoration: 'none',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    transition: 'color 0.3s ease, gap 0.3s ease',
                                                }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.color = 'var(--accent)';
                                                    e.currentTarget.style.gap = '14px';
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                                    e.currentTarget.style.gap = '8px';
                                                }}
                                            >
                                                <span style={{ width: '4px', height: '4px', background: 'var(--accent)', transform: 'rotate(45deg)', flexShrink: 0, opacity: 0.5 }} />
                                                {s.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom strip — single line */}
                        <div
                            id="footer-copyright"
                            className="mt-10 pt-5 border-t border-[var(--border)] flex flex-col items-center justify-center gap-5 text-center md:flex-row md:items-end md:justify-between md:gap-3 md:text-left px-5 sm:px-8 md:px-0"
                        >
                            <p className="order-3 md:order-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                                &copy; 2026 Cristi Labs LLC. All Rights Reserved.
                            </p>

                            <div className="flex flex-col items-center gap-1 order-1 md:order-2">
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.3em', color: 'var(--accent)', textTransform: 'uppercase' }}>
                                    Global HQ
                                </span>
                                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--text-secondary)', whiteSpace: 'nowrap', textAlign: 'center' }}>
                                    SHERIDAN, WYOMING 82801 · USA
                                </p>
                            </div>

                            <div className="flex items-center gap-2.5 order-2 md:order-3">
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', color: 'var(--text-tertiary)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                                    Engineered by
                                </span>
                                <div style={{ width: '1px', height: '10px', background: 'var(--border)', flexShrink: 0 }} />
                                <a
                                    href="https://marwen-rabai.netlify.app/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', color: 'var(--accent)', textTransform: 'uppercase', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'opacity 0.25s' }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.65'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                    Marouan Rabai ↗
                                </a>
                            </div>
                        </div>


                    </div>
                </div>
            </footer>
        </section>
    );
};

export default Footer;
