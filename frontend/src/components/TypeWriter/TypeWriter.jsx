import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * TypeWriter — Production-grade, bulletproof implementation
 * Fixes: stale closure, observer cleanup, loop timing, scroll trigger
 *
 * Props:
 *  text            string | string[]  — text or sequence to type
 *  speed           number             — base ms per character (default: 60)
 *  variance        number             — random variance per char in ms (default: 30)
 *  delay           number             — initial delay before typing (default: 0)
 *  loop            boolean            — loop the full sequence (default: false)
 *  loopDelay       number             — pause before restarting loop (default: 2500)
 *  showCursor      boolean            — show blinking cursor (default: true)
 *  cursorChar      string             — cursor character (default: '|')
 *  triggerOnScroll boolean            — start when element enters viewport (default: false)
 *  className       string             — CSS classes for the text
 *  onComplete      () => void         — callback when sequence finishes
 */
const TypeWriter = ({
  text = '',
  speed = 60,
  variance = 30,
  delay = 0,
  loop = false,
  loopDelay = 2500,
  showCursor = true,
  cursorChar = '|',
  triggerOnScroll = false,
  className = '',
  onComplete,
}) => {
  const [displayText, setDisplayText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  const containerRef = useRef(null);
  const timeoutRef = useRef(null);
  const cursorIntervalRef = useRef(null);
  const observerRef = useRef(null);
  const isRunningRef = useRef(false);
  const isMountedRef = useRef(true);

  // Stabilize texts array — avoids dependency churn with inline arrays
  const texts = useMemo(() => Array.isArray(text) ? text : [text], [text]);

  // Store all props in a ref so the typing engine always reads current values
  const propsRef = useRef({ texts, speed, variance, delay, loop, loopDelay, onComplete });
  useEffect(() => {
    propsRef.current = { texts, speed, variance, delay, loop, loopDelay, onComplete };
  });

  // Core typing engine — reads from propsRef, no stale closures
  const runTypingEngine = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    const { delay: d } = propsRef.current;

    let textIndex = 0;
    let charIndex = 0;

    const type = () => {
      if (!isMountedRef.current) return;
      const { texts: t, speed: s, variance: v, loop: l, loopDelay: ld, onComplete: oc } = propsRef.current;
      const currentText = t[textIndex] || '';

      if (charIndex < currentText.length) {
        setDisplayText(currentText.slice(0, charIndex + 1));
        charIndex++;
        timeoutRef.current = setTimeout(type, s + Math.random() * v);
      } else {
        textIndex++;
        if (textIndex < t.length) {
          // Pause then clear and type next string
          timeoutRef.current = setTimeout(() => {
            charIndex = 0;
            setDisplayText('');
            timeoutRef.current = setTimeout(type, 200);
          }, 800);
        } else {
          // All strings complete
          if (oc) oc();
          if (l) {
            // Loop: reset and continue
            timeoutRef.current = setTimeout(() => {
              if (!isMountedRef.current) return;
              textIndex = 0;
              charIndex = 0;
              setDisplayText('');
              timeoutRef.current = setTimeout(type, 100);
            }, ld);
          } else {
            isRunningRef.current = false;
          }
        }
      }
    };

    timeoutRef.current = setTimeout(type, d);
  }, []); // empty deps — reads everything from propsRef

  // Cursor blink — independent, uses its own ref
  useEffect(() => {
    if (!showCursor) return;
    cursorIntervalRef.current = setInterval(() => {
      setCursorVisible(v => !v);
    }, 530);
    return () => {
      if (cursorIntervalRef.current) clearInterval(cursorIntervalRef.current);
    };
  }, [showCursor]);

  // Main trigger effect
  useEffect(() => {
    isMountedRef.current = true;

    if (!triggerOnScroll) {
      runTypingEngine();
      return () => {
        isMountedRef.current = false;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        isRunningRef.current = false;
      };
    }

    // Scroll-triggered: IntersectionObserver fires once
    const target = containerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Small delay ensures DOM is fully ready on mobile before starting
          setTimeout(() => {
            if (isMountedRef.current) runTypingEngine();
          }, 100);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -5% 0px',
      }
    );

    observer.observe(target);
    observerRef.current = observer;

    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      isRunningRef.current = false;
      observer.disconnect();
    };
  }, [triggerOnScroll, runTypingEngine]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const cursorStyle = {
    color: 'var(--accent-gold, #C9A84C)',
    textShadow: '0 0 8px var(--accent-gold, #C9A84C)',
    opacity: cursorVisible ? 1 : 0,
    transition: 'opacity 0.1s',
    marginLeft: '1px',
  };

  return (
    <span ref={containerRef} className={className} aria-label={texts.join(' ')}>
      {displayText}
      {showCursor && (
        <span style={cursorStyle} aria-hidden="true">
          {cursorChar}
        </span>
      )}
    </span>
  );
};

export default TypeWriter;
