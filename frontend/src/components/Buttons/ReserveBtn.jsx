import { useRef } from "react";
import { Link } from "react-router-dom";
import { useHideNearFooter } from "../../hooks/useHideNearFooter";
import "./revbtn.css";

const ReserveBtn = () => {
    const linkRef = useRef(null);
    const hideNearFooter = useHideNearFooter();

    const handleMouseMove = (e) => {
        const el = linkRef.current;
        if (!el) return;
        const { left, top, width, height } = el.getBoundingClientRect();
        const x = (e.clientX - left - width  / 2) * 0.12;
        const y = (e.clientY - top  - height / 2) * 0.18;
        el.style.transition = "transform 100ms linear";
        el.style.transform  = `translate(${x}px, ${y}px)`;
    };

    const handleMouseLeave = () => {
        const el = linkRef.current;
        if (!el) return;
        el.style.transition = "transform 700ms cubic-bezier(0.16,1,0.3,1)";
        el.style.transform  = "translate(0px, 0px)";
    };

    return (
        <div
            className="fixed right-4 md:right-6 top-[5vw] md:top-[4vw] z-40"
            style={{
                opacity: hideNearFooter ? 0 : 1,
                pointerEvents: hideNearFooter ? 'none' : 'auto',
                transition: 'opacity 0.45s cubic-bezier(0.16,1,0.3,1)',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <Link
                ref={linkRef}
                to="/contact"
                className="connect-btn"
                aria-label="Connect with Cristi Labs"
            >
                <span className="connect-btn__label">Connect</span>
                <span className="connect-btn__icon">
                    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path
                            d="M3.5 12.5L12.5 3.5M12.5 3.5H6M12.5 3.5V10"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </Link>
        </div>
    );
};

export default ReserveBtn;
