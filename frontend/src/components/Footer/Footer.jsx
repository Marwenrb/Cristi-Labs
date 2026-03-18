import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import { useFooterGSAP } from "../../hooks/useFooterGSAP";
import FooterBrand from "./FooterBrand";
import "./footer.css";

// Global hubs — trading floor + North Africa + HQ
// Manual UTC offset fallback for browsers with limited TZ data
const GLOBAL_HUBS = [
    { city: "NYC", tz: "America/New_York" },
    { city: "LON", tz: "Europe/London" },
    { city: "TYO", tz: "Asia/Tokyo" },
    { city: "SGP", tz: "Asia/Singapore" },
    { city: "TUN", tz: "Africa/Tunis" },
    { city: "ALG", tz: "Africa/Algiers", utcOffset: 1 },
    { city: "WY", tz: "America/Denver", utcOffset: -7 },
];

const FOOTER_LINKS = [
    { to: "/", label: "Home" },
    { to: "/ventures", label: "Ventures" },
    { to: "/global-trade", label: "Global Trade" },
    { to: "/vision", label: "Vision" },
    { to: "/store", label: "The Vault" },
    { to: "/contact", label: "Contact" },
];

function LiveDataTicker() {
    const [times, setTimes] = useState(
        GLOBAL_HUBS.map(() => ({ time: "", date: "" }))
    );

    useEffect(() => {
        const formatTime = (date, hub) => {
            const opts = {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
                hourCycle: "h23",
            };
            try {
                const formatted = new Intl.DateTimeFormat("en-GB", {
                    ...opts,
                    timeZone: hub.tz,
                }).format(date);
                if (formatted && formatted.length >= 8) return formatted;
            } catch {
                /* fallback below */
            }
            if (typeof hub.utcOffset === "number") {
                const utc = date.getTime() + date.getTimezoneOffset() * 60000;
                const local = new Date(utc + hub.utcOffset * 3600000);
                return new Intl.DateTimeFormat("en-GB", opts).format(local);
            }
            return "—";
        };

        const update = () => {
            const now = new Date();
            setTimes(
                GLOBAL_HUBS.map((hub) => ({
                    time: formatTime(now, hub),
                    date: (() => {
                        try {
                            return now.toLocaleDateString("en-GB", {
                                timeZone: hub.tz,
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            });
                        } catch {
                            return "";
                        }
                    })(),
                }))
            );
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="live-ticker">
            <div className="live-ticker-badge">
                <span className="live-ticker-dot" />
                <span className="live-ticker-label">GLOBAL PULSE</span>
            </div>
            <div className="live-ticker-marquee">
                <div className="live-ticker-track">
                    {[...Array(4)].flatMap((_, cycle) =>
                        GLOBAL_HUBS.map((hub, j) => {
                            const idx = j;
                            return (
                                <div key={`${hub.city}-${cycle}-${j}`} className="live-ticker-hub">
                                    <span className="live-ticker-city">{hub.city}</span>
                                    <span className="live-ticker-time">
                                        {times[idx]?.time || "—"}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

const Footer = () => {
    const { footerRevealRef, footerInnerRef, linkRefs } = useFooterGSAP();

    return (
        <section
            ref={footerRevealRef}
            className="footer-reveal-wrapper relative min-h-[60vh] w-full"
        >
            <footer
                ref={footerInnerRef}
                className="footer-inner absolute bottom-0 left-0 right-0 w-full will-change-transform"
            >
                {/* Glassmorphism layers — Blade Runner meets Wall Street */}
                <div className="relative w-full overflow-hidden">
                    {/* Base dark layer — Cristi Labs black */}
                    <div className="absolute inset-0 bg-[var(--bg-void)]/95 backdrop-blur-xl" />

                    {/* Floating glass accent */}
                    <div
                        className="absolute inset-0 border-t border-[var(--border)]"
                        style={{
                            background:
                                "linear-gradient(180deg, rgba(184,146,74,0.04) 0%, transparent 50%)",
                        }}
                    />

                    {/* Content container */}
                    <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-6 pb-10 md:pt-8 md:pb-12">
                        {/* Live Data Ticker — High-Frequency Trade theme */}
                        <div className="live-ticker-wrapper">
                            <LiveDataTicker />
                        </div>

                        {/* Top Section: Brand + Navigation */}
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-24">
                            {/* Left: Branding — next-level type + animation */}
                            <FooterBrand />

                            {/* Right: Links + Contact — Magnetic targets */}
                            <div className="flex flex-col md:flex-row gap-16 md:gap-24">
                                <div className="space-y-6">
                                    <p className="text-[0.65rem] text-zinc-600 uppercase tracking-[0.25em]">
                                        Navigation
                                    </p>
                                    <div className="flex flex-col gap-8">
                                        {FOOTER_LINKS.map((item, i) => (
                                            <Link
                                                key={item.to}
                                                ref={(el) => {
                                                    linkRefs.current[i] = el;
                                                }}
                                                to={item.to}
                                                className="footer-magnetic-link inline-block text-zinc-500 text-sm tracking-wider hover:text-[var(--accent)] transition-colors duration-300 cursor-pointer will-change-transform"
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <p className="text-[0.65rem] text-zinc-600 uppercase tracking-[0.25em]">
                                        Corporate Access
                                    </p>
                                    <div className="flex flex-col gap-8">
                        <a
                                            href="mailto:access@cristilabs.net"
                                            ref={(el) => {
                                                linkRefs.current[FOOTER_LINKS.length] =
                                                    el;
                                            }}
                                            className="footer-magnetic-link inline-block text-zinc-500 text-sm tracking-wider hover:text-[var(--accent)] transition-colors duration-300 will-change-transform"
                                        >
                                            access@cristilabs.net
                                        </a>
                                        <a
                                            href="tel:+16816772084"
                                            ref={(el) => {
                                                linkRefs.current[
                                                    FOOTER_LINKS.length + 1
                                                ] = el;
                                            }}
                                            className="footer-magnetic-link inline-block text-zinc-500 text-sm tracking-wider hover:text-[var(--accent)] transition-colors duration-300 will-change-transform"
                                        >
                                            +1 (681) 677-2084
                                        </a>
                                    </div>
                                    <p className="text-[0.65rem] text-zinc-600 uppercase tracking-[0.25em] pt-4 mt-6">
                                        Social
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
                                                className="footer-magnetic-link inline-flex items-center gap-2.5 text-zinc-500 text-sm tracking-wider hover:text-[var(--accent)] transition-colors duration-300 cursor-pointer will-change-transform"
                                            >
                                                <span className="opacity-70">{s.icon}</span>
                                                {s.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom strip — single row on all screen sizes */}
                        <div id="footer-copyright" className="mt-8 pt-5 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-y-3">
                            <p className="text-zinc-600 text-xs tracking-wider uppercase whitespace-nowrap">
                                &copy; 2026 Cristi Labs LLC. All Rights Reserved.
                            </p>
                            <div className="flex items-center gap-2.5 order-last md:order-none w-full md:w-auto justify-center">
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '2.5px', color: 'var(--text-tertiary)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                                    Engineered by
                                </span>
                                <div style={{ width: '1px', height: '10px', background: 'var(--border)', flexShrink: 0 }} />
                                <a
                                    href="https://marwen-rabai.netlify.app/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '2px', color: 'var(--accent)', textTransform: 'uppercase', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'opacity 0.25s' }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.65'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                    Marouan Rabai ↗
                                </a>
                            </div>
                            <div className="footer-location justify-end">
                                <span className="footer-location-label">Global HQ</span>
                                <span className="footer-location-value">Sheridan, Wyoming · USA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </section>
    );
};

export default Footer;
