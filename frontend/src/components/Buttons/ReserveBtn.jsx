import { Link } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import "./revbtn.css";

const ReserveBtn = () => {
    return (
        <div className="relative z-40">
            <Link
                to="/contact"
                className="connect-btn absolute right-4 md:right-6 top-[5vw] md:top-[4vw] min-h-[44px] px-4 py-2.5 flex items-center justify-center gap-2.5 rounded-full group whitespace-nowrap w-auto"
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
