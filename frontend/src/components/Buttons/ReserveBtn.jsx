import { Link } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import "./revbtn.css";

const ReserveBtn = () => {
    return (
        <div className="fixed right-4 md:right-6 top-[5vw] md:top-[4vw] z-40">
            <Link
                to="/contact"
                className="connect-btn flex items-center gap-3 rounded-full group whitespace-nowrap px-6 py-3 min-h-[44px]"
            >
                <span className="rev-link text-[12px] font-semibold">Connect</span>
                <span className="connect-btn-icon">
                    <MdArrowOutward className="w-5 h-5" />
                </span>
            </Link>
        </div>
    );
};

export default ReserveBtn;
