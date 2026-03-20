import { useEffect, useRef, useState } from 'react';

/**
 * SectionDivider — Premium animated section separator
 *
 * Props:
 *  index  number  — section number (e.g. 1 for "§ 01 / 05")
 *  total  number  — total sections (default: 5)
 */
const SectionDivider = ({ index = 1, total = 5 }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div ref={ref} className="section-divider">
      <div className={`section-divider__line ${visible ? 'is-visible' : ''}`} />
      <div className="section-divider__diamond">
        <span>◆</span>
      </div>
      <span className="section-divider__label">
        § {pad(index)} / {pad(total)}
      </span>
    </div>
  );
};

export default SectionDivider;
