import { useEffect, useRef, useState } from 'react';

/**
 * Cursor - Presidential precision cursor (desktop / fine-pointer only)
 * - cursor-dot (5px): snaps exactly to pointer, zero lag
 * - cursor-ring (34px): tight lerp 0.38 - barely-noticeable elegance, NOT a floating ball
 * - Both invisible at mount, appear on first mousemove only
 * - Both disappear instantly on any scroll event
 * - Reappear only when mouse physically moves again -> NO ghost floating
 * - pointer-events: none - cannot block any interaction ever
 */

const isCoarse = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

const Cursor = () => {
  const ringRef   = useRef(null);
  const dotRef    = useRef(null);
  const rafRef    = useRef(null);

  const mouse     = useRef({ x: -500, y: -500 });
  const ring      = useRef({ x: -500, y: -500 });
  const visible   = useRef(false);
  const scrolling = useRef(false);

  const [state, setState] = useState('default');

  useEffect(() => {
    if (isCoarse()) return;

    const setVisible = (v) => {
      visible.current = v;
      const o = v ? '1' : '0';
      if (ringRef.current) ringRef.current.style.opacity = o;
      if (dotRef.current)  dotRef.current.style.opacity  = o;
    };

    const onMove = (e) => {
      const { clientX: x, clientY: y } = e;
      mouse.current = { x, y };

      if (scrolling.current || !visible.current) {
        ring.current = { x, y };
        scrolling.current = false;
      }

      if (!visible.current) setVisible(true);

      const t = e.target;
      const interactive = t.closest(
        'a,button,[role="button"],input,textarea,select,label,[data-cursor="pointer"]'
      );
      const textEl =
        !interactive &&
        t.closest('p,h1,h2,h3,h4,h5,h6,span,li,blockquote,[data-cursor="text"]');

      if (interactive) setState('hover');
      else if (textEl) setState('text');
      else             setState('default');
    };

    const onScroll = () => {
      scrolling.current = true;
      setVisible(false);
    };

    const onDown  = () => setState('click');
    const onUp    = () => setState(s => s === 'click' ? 'default' : s);
    const onLeave = () => setVisible(false);

    document.addEventListener('mousemove',  onMove,   { passive: true });
    document.addEventListener('mousedown',  onDown);
    document.addEventListener('mouseup',    onUp);
    document.addEventListener('mouseleave', onLeave);
    window.addEventListener('scroll',       onScroll, { passive: true });
    const wrapper = document.getElementById('smooth-wrapper');
    wrapper?.addEventListener('scroll', onScroll, { passive: true });

    const LERP = 0.38;
    const tick = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * LERP;
      ring.current.y += (mouse.current.y - ring.current.y) * LERP;

      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${ring.current.x}px,${ring.current.y}px) translate(-50%,-50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${mouse.current.x}px,${mouse.current.y}px) translate(-50%,-50%)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mousedown',  onDown);
      document.removeEventListener('mouseup',    onUp);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('scroll',       onScroll);
      wrapper?.removeEventListener('scroll',     onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (isCoarse()) return null;

  return (
    <>
      <div
        ref={ringRef}
        className={[
          'cursor-ring',
          state === 'hover' ? 'is-hover' : '',
          state === 'text'  ? 'is-text'  : '',
          state === 'click' ? 'is-click' : '',
        ].filter(Boolean).join(' ')}
        aria-hidden="true"
        style={{ opacity: 0 }}
      />
      <div
        ref={dotRef}
        className="cursor-dot"
        aria-hidden="true"
        style={{ opacity: 0 }}
      />
    </>
  );
};

export default Cursor;
