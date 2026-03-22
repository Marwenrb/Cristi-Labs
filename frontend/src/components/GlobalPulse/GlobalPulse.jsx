import { useState, useEffect } from "react";

// All brand trading-floor hubs — NYC → WY HQ
const GLOBAL_HUBS = [
    { city: "NYC", tz: "America/New_York" },
    { city: "LON", tz: "Europe/London" },
    { city: "TYO", tz: "Asia/Tokyo" },
    { city: "SGP", tz: "Asia/Singapore" },
    { city: "TUN", tz: "Africa/Tunis" },
    { city: "ALG", tz: "Africa/Algiers", utcOffset: 1 },
    { city: "WY",  tz: "America/Denver", utcOffset: -7 },
];

const formatTime = (date, hub) => {
    const opts = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, hourCycle: "h23" };
    try {
        const result = new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: hub.tz }).format(date);
        if (result?.length >= 8) return result;
    } catch { /* fallback */ }
    if (typeof hub.utcOffset === "number") {
        const utc = date.getTime() + date.getTimezoneOffset() * 60000;
        return new Intl.DateTimeFormat("en-GB", opts).format(new Date(utc + hub.utcOffset * 3600000));
    }
    return "—";
};

export default function GlobalPulse() {
    const [times, setTimes] = useState(GLOBAL_HUBS.map(() => ""));

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTimes(GLOBAL_HUBS.map((hub) => formatTime(now, hub)));
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, []);

    // 4× repeat — seamless -25% translateX loop
    const items = [...Array(4)].flatMap((_, cycle) =>
        GLOBAL_HUBS.map((hub, j) => ({
            key: `${hub.city}-${cycle}-${j}`,
            city: hub.city,
            time: times[j] || "—",
        }))
    );

    return (
        <div className="live-ticker-wrapper">
            <div className="live-ticker">

                {/* ── Badge — ping dot + label ── */}
                <div className="live-ticker-badge">
                    <span className="live-ticker-dot-wrapper">
                        <span className="live-ticker-ping" aria-hidden />
                        <span className="live-ticker-dot" />
                    </span>
                    <span className="live-ticker-label">GLOBAL PULSE</span>
                </div>

                {/* ── Marquee — edge-faded, GPU-accelerated ── */}
                <div className="live-ticker-marquee">
                    <div className="live-ticker-track">
                        {items.map(({ key, city, time }) => (
                            <div key={key} className="live-ticker-hub">
                                <span className="live-ticker-city">{city}</span>
                                <span className="live-ticker-sep" aria-hidden>·</span>
                                <span className="live-ticker-time">{time}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
