import { useEffect, useRef, useState } from 'react';

/**
 * Cursor — Premium magnetic custom cursor (desktop only)
 *
 * - Outer ring (40px): follows with 0.1 lerp lag
 * - Inner dot (6px): snaps to cursor instantly via RAF
 * - On hover interactive elements: ring scales to 60px + gold tint
 * - On hover text: ring morphs to thin horizontal line
 * - On click: compression scale + expand
 * - Only renders on non-touch devices
 */
const Cursor = () => {
  const outerRef = useRef(null);
  const dotRef   = useRef(null);
  const rafRef   = useRef(null);

  const mouse  = useRef({ x: -200, y: -200 });
  const outer  = useRef({ x: -200, y: -200 });

  const [state, setState] = useState('default'); // default | hover | text | click

  useEffect(() => {
    // Don't render on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      const target = e.target;
      const isInteractive =
        target.closest('a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]');
      const isText =
        !isInteractive &&
        target.closest('p, h1, h2, h3, h4, h5, h6, span, li, blockquote, [data-cursor="text"]');

      if (isInteractive) setState('hover');
      else if (isText)   setState('text');
      else               setState('default');
    };

    const onDown  = () => setState('click');
    const onUp    = () => setState(prev => prev === 'click' ? 'default' : prev);
    const onLeave = () => { mouse.current = { x: -200, y: -200 }; };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup',   onUp);
    document.addEventListener('mouseleave', onLeave);

    // RAF loop for outer ring lerp
    const LERP = 0.1;
    const loop = () => {
      outer.current.x += (mouse.current.x - outer.current.x) * LERP;
      outer.current.y += (mouse.current.y - outer.current.y) * LERP;

      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${outer.current.x}px, ${outer.current.y}px) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup',   onUp);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Don't mount on touch
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  const outerClasses = [
    'cursor-outer',
    state === 'hover' ? 'is-hover' : '',
    state === 'text'  ? 'is-text'  : '',
    state === 'click' ? 'is-click' : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <div ref={outerRef} className={outerClasses} aria-hidden="true" />
      <div ref={dotRef}   className="cursor-dot"   aria-hidden="true" />
    </>
  );
};

export default Cursor;
