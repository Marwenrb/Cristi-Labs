import { useEffect, useRef, useState } from 'react';

/**
 * useMobileReveal — IntersectionObserver-based reveal for mobile elements.
 * Returns a ref to attach to the element and a `revealed` boolean.
 *
 * @param {Object} options
 * @param {number} [options.threshold=0.1] — visibility threshold (0–1)
 * @param {string} [options.rootMargin='0px 0px -8% 0px'] — observer root margin
 * @param {boolean} [options.once=true] — unobserve after first reveal
 */
export default function useMobileReveal({
    threshold = 0.1,
    rootMargin = '0px 0px -8% 0px',
    once = true,
} = {}) {
    const ref = useRef(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Skip on desktop — always show
        if (window.innerWidth >= 768) {
            setRevealed(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setRevealed(true);
                    if (once) observer.unobserve(el);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, rootMargin, once]);

    return { ref, revealed };
}
