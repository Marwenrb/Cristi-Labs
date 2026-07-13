import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar/Navbar";
import PreloaderII from "../components/Preloader/PreloaderII";
import ReserveBtn from "../components/Buttons/ReserveBtn";
import Logo from "../components/Buttons/Logo";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import BackToTop from "../components/BackToTop/BackToTop";
import Cursor from "../components/Cursor/Cursor";
import { initLenis } from "../lib/lenis";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const MainLayout = () => {
    const location = useLocation();

    // Mobile only: Lenis smooth touch scroll (desktop uses ScrollSmoother)
    useEffect(() => {
        if (window.innerWidth > 768) return;
        const lenis = initLenis();
        return () => {
            lenis._cleanup?.();
            lenis.destroy();
        };
    }, []);

    // Create ScrollSmoother once on mount — desktop only (mobile uses Lenis)
    useGSAP(() => {
        if (window.innerWidth <= 768) return;
        if (!ScrollSmoother.get()) {
            const smoother = ScrollSmoother.create({
                wrapper: "#smooth-wrapper",
                content: "#smooth-content",
                smooth: 1.5,
                effects: true,
            });
            window.__smoother = smoother;
        } else {
            window.__smoother = ScrollSmoother.get();
        }
    });

    // On route change, force scroll to top, kill stale triggers, and refresh
    useEffect(() => {
        const smoother = ScrollSmoother.get();

        // Kill stale page ScrollTriggers — preserve ScrollSmoother's internal trigger
        ScrollTrigger.getAll().forEach(t => {
            if (smoother && t === smoother.scrollTrigger) return;
            t.kill();
        });

        if (smoother) {
            smoother.scrollTo(0, true);
        } else {
            window.scrollTo(0, 0);
        }

        requestAnimationFrame(() => {
            ScrollTrigger.refresh();
        });
    }, [location.pathname]);

    return (
        <>
            <ScrollToTop />
            <Cursor />
            <PreloaderII />
            <Logo />
            <ReserveBtn />
            <Navbar />
            <BackToTop />
            <div id="smooth-wrapper">
                <div id="smooth-content">
                    <main>
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
};

export default MainLayout;
