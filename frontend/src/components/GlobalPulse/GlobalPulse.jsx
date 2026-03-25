import { useState, useEffect } from "react";

// Intelligence Feed — 7 global hubs
const CITIES = [
    { code: "NYC", zone: "America/New_York" },
    { code: "LON", zone: "Europe/London" },
    { code: "TYO", zone: "Asia/Tokyo" },
    { code: "SGP", zone: "Asia/Singapore" },
    { code: "TUN", zone: "Africa/Tunis" },
    { code: "ALG", zone: "Africa/Algiers" },
    { code: "WY",  zone: "America/Denver" },
];

function getTime(zone) {
    try {
        return new Date().toLocaleTimeString("en-GB", {
            timeZone: zone,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
    } catch {
        return "—";
    }
}

// Shared ticker items — rendered inside each track copy
function TickerItems({ times }) {
    return (
        <>
            {CITIES.map((city, i) => (
                <div key={city.code} className="live-ticker-hub" aria-hidden="true">
                    <span className="live-ticker-city">{city.code}</span>
                    <span className="live-ticker-sep">·</span>
                    <span className="live-ticker-time">{times[i]}</span>
                </div>
            ))}
            <span className="live-ticker-loop-sep" aria-hidden="true">◆</span>
        </>
    );
}

export default function GlobalPulse() {
    const [times, setTimes] = useState(() => CITIES.map((c) => getTime(c.zone)));

    useEffect(() => {
        const id = setInterval(() => {
            setTimes(CITIES.map((c) => getTime(c.zone)));
        }, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="live-ticker-wrapper">
            <div className="live-ticker">

                {/* ── Badge — ping dot + label ── */}
                <div className="live-ticker-badge">
                    <span className="live-ticker-dot-wrapper">
                        <span className="live-ticker-ping" aria-hidden="true" />
                        <span className="live-ticker-dot" />
                    </span>
                    <span className="live-ticker-label">GLOBAL PULSE</span>
                </div>

                {/* ── Marquee — 2 tracks (7 cities × 2 = 14 nodes), CSS seamless loop ── */}
                <div className="live-ticker-marquee" aria-label="Global time zones" role="timer">
                    <div className="live-ticker-track live-ticker-track--a">
                        <TickerItems times={times} />
                    </div>
                    <div className="live-ticker-track live-ticker-track--b" aria-hidden="true">
                        <TickerItems times={times} />
                    </div>
                </div>

            </div>
        </div>
    );
}
