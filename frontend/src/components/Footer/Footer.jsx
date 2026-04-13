import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";
import { useFooterGSAP } from "../../hooks/useFooterGSAP";
import FooterBrand from "./FooterBrand";
import footerVideo from "../../assets/Pages Media/Cristi-Labs Utra-realistic_looping_background_video_for_a_high-tech_corporate_w-0.mp4";
import "./footer.css";

// Global hubs — trading floor + North Africa + HQ
const GLOBAL_HUBS = [
    { city: "NYC", tz: "America/New_York" },
    { city: "LON", tz: "Europe/London" },
    { city: "TYO", tz: "Asia/Tokyo" },
    { city: "SGP", tz: "Asia/Singapore" },
    { city: "TUN", tz: "Africa/Tunis" },
    { city: "ALG", tz: "Africa/Algiers", utcOffset: 1 },
    { city: "WY",  tz: "America/Denver", utcOffset: -7 },
];

const FOOTER_LINKS = [
    { to: "/",            label: "Home" },
    { to: "/ventures",    label: "Ventures" },
    { to: "/global-trade",label: "Global Trade" },
    { to: "/vision",      label: "Vision" },
    { to: "/store",       label: "The Vault" },
    { to: "/contact",     label: "Contact" },
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
            } catch { /* fallback below */ }
            if (typeof hub.utcOffset === "number") {
                const utc = date.getTime() + date.getTimezoneOffset() * 60000;
                const local = new Date(utc + hub.utcOffset * 3600000);
                return new Intl.DateTimeFormat("en-GB", opts).format(local);
            }
            return "\u2014";
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
                        } catch { return ""; }
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
                        GLOBAL_HUBS.map((hub, j) => (
                            <div key={`${hub.city}-${cycle}-${j}`} className="live-ticker-hub">
                                <span className="live-ticker-city">{hub.city}</span>
                                <span className="live-ticker-time">
                                    {times[j]?.time || "\u2014"}
                                </span>
                            </div>
                        ))
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
                <div className="footer-shell relative w-full overflow-hidden">
                    {/* Background video */}
                    <video
                        src={footerVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover -z-20 pointer-events-none"
                    />
                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-black/30 pointer-events-none -z-10" />
                    {/* Refined dark surface */}
                    <div className="footer-shell-bg absolute inset-0" />

                    <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-6 pb-10 md:pt-8 md:pb-12">
                        {/* Live Data Ticker */}
                        <div className="live-ticker-wrapper">
                            <LiveDataTicker />
                        </div>

                        {/* Top Section: Brand + Navigation */}
                        <div className="footer-top-section">
                            <div className="footer-brand-wrapper">
                                <FooterBrand />
                            </div>

                            <div className="footer-nav-zone">
                                {/* ── Column 1: Navigation ── */}
                                <div className="footer-glass-card footer-col">
                                    <p className="footer-col-label">Navigation</p>
                                    <div className="footer-col-links">
                                        {FOOTER_LINKS.map((item, i) => (
                                            <NavLink
                                                key={item.to}
                                                ref={(el) => { linkRefs.current[i] = el; }}
                                                to={item.to}
                                                className={({ isActive }) =>
                                                    `fnl footer-magnetic-link will-change-transform${isActive ? ' fnl--active' : ''}`
                                                }
                                            >
                                                {item.label}
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>

                                {/* ── Column 2: Corporate Access + Social ── */}
                                <div className="footer-glass-card footer-col">
                                    <p className="footer-col-label">Corporate Access</p>
                                    <div className="footer-contact-stack">
                                        <a
                                            href="mailto:access@cristilabs.net"
                                            ref={(el) => { linkRefs.current[FOOTER_LINKS.length] = el; }}
                                            className="footer-magnetic-link fcs-link will-change-transform"
                                        >
                                            access@cristilabs.net
                                        </a>
                                        <a
                                            href="tel:+16816772084"
                                            ref={(el) => { linkRefs.current[FOOTER_LINKS.length + 1] = el; }}
                                            className="footer-magnetic-link fcs-link will-change-transform"
                                        >
                                            +1 (681) 677-2084
                                        </a>
                                    </div>

                                    <p className="footer-col-label footer-col-label--spaced">Social</p>
                                    <div className="footer-social-stack">
                                        {[
                                            { href: "https://facebook.com/CristiLabs", icon: <FaFacebookF size={11} />, label: "Facebook" },
                                            { href: "https://instagram.com/CristiLabs", icon: <FaInstagram size={11} />, label: "Instagram" },
                                        ].map((s, i) => (
                                            <a
                                                key={s.label}
                                                href={s.href}
                                                ref={(el) => { linkRefs.current[FOOTER_LINKS.length + 2 + i] = el; }}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="footer-magnetic-link fss-link will-change-transform"
                                            >
                                                <span className="fss-icon">{s.icon}</span>
                                                <span className="fss-text">{s.label}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Legal bottom bar */}
                        <div className="footer-legal-bar">
                            <p className="footer-legal-copy">
                                &copy; 2026 Cristi Labs LLC. All Rights Reserved.
                            </p>
                            <div className="footer-legal-credit">
                                <span className="footer-legal-credit-label">Engineered by</span>
                                <span className="footer-legal-credit-sep" />
                                <a
                                    href="https://marwen-rabai.netlify.app/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer-legal-credit-name"
                                >
                                    Marouan Rabai ↗
                                </a>
                            </div>
                            <div className="footer-location">
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
