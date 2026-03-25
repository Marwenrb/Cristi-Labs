import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * TypeWriter — Next-Gen Premium Implementation v2
 * Features: Character scramble, decode effects, glitch mode, premium cursor
 * 
 * Props:
 *  text            string | string[]  — text or sequence to type
 *  speed           number             — base ms per character (default: 55)
 *  variance        number             — random variance per char in ms (default: 25)
 *  delay           number             — initial delay before typing (default: 0)
 *  loop            boolean            — loop the full sequence (default: false)
 *  loopDelay       number             — pause before restarting loop (default: 2500)
 *  showCursor      boolean            — show blinking cursor (default: true)
 *  cursorChar      string             — cursor character (default: '▌')
 *  cursorStyle     'classic'|'block'|'line'|'underscore' — cursor variant
 *  mode            'type'|'scramble'|'decode' — typing effect mode
 *  scrambleChars   string             — characters to use for scramble effect
 *  triggerOnScroll boolean            — start when element enters viewport (default: false)
 *  className       string             — CSS classes for the text
 *  onComplete      () => void         — callback when sequence finishes
 *  glitch          boolean            — enable occasional glitch effect
 *  glitchIntensity number             — 0-1, how often glitches occur
 */

// Character sets for scramble effect
const SCRAMBLE_SETS = {
  default: '!<>-_\\/[]{}—=+*^?#_αβγδ',
  binary: '01',
  hex: '0123456789ABCDEF',
  matrix: 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ',
  tech: '█▓▒░╔╗╚╝═║┌┐└┘',
};

const TypeWriter = ({
  text = '',
  speed = 55,
  variance = 25,
  delay = 0,
  loop = false,
  loopDelay = 2500,
  showCursor = true,
  cursorChar = '▌',
  cursorStyle = 'block',
  mode = 'type',
  scrambleChars = SCRAMBLE_SETS.default,
  triggerOnScroll = false,
  className = '',
  onComplete,
  glitch = false,
  glitchIntensity = 0.03,
}) => {
  const [displayChars, setDisplayChars] = useState([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isGlitching, setIsGlitching] = useState(false);

  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const cursorIntervalRef = useRef(null);
  const glitchTimeoutRef = useRef(null);
  const observerRef = useRef(null);
  const isRunningRef = useRef(false);
  const isMountedRef = useRef(true);

  // Stabilize texts array
  const texts = useMemo(() => Array.isArray(text) ? text : [text], [text]);

  // Store all props in a ref to avoid stale closures
  const propsRef = useRef({ 
    texts, speed, variance, delay, loop, loopDelay, onComplete, 
    mode, scrambleChars, glitch, glitchIntensity 
  });
  
  useEffect(() => {
    propsRef.current = { 
      texts, speed, variance, delay, loop, loopDelay, onComplete,
      mode, scrambleChars, glitch, glitchIntensity
    };
  });

  // Get random scramble character
  const getScrambleChar = useCallback(() => {
    const chars = propsRef.current.scrambleChars;
    return chars[Math.floor(Math.random() * chars.length)];
  }, []);

  // Core typing engine with modes
  const runTypingEngine = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    const { delay: d, mode: m } = propsRef.current;

    let textIndex = 0;
    let charIndex = 0;
    let scrambleFrames = 0;
    const maxScrambleFrames = 3;

    const type = () => {
      if (!isMountedRef.current) return;
      
      const { 
        texts: t, speed: s, variance: v, loop: l, loopDelay: ld, 
        onComplete: oc, mode: currentMode, glitch: g, glitchIntensity: gi 
      } = propsRef.current;
      
      const currentText = t[textIndex] || '';

      // Handle glitch effect
      if (g && Math.random() < gi && charIndex > 0) {
        setIsGlitching(true);
        glitchTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) setIsGlitching(false);
        }, 50 + Math.random() * 100);
      }

      if (charIndex < currentText.length) {
        if (currentMode === 'scramble') {
          // Scramble mode: show scrambled chars that resolve to real chars
          if (scrambleFrames < maxScrambleFrames) {
            const newChars = currentText.split('').map((char, i) => {
              if (i < charIndex) return { char, resolved: true };
              if (i === charIndex) return { char: getScrambleChar(), resolved: false };
              return { char: ' ', resolved: true };
            });
            setDisplayChars(newChars);
            scrambleFrames++;
            animationRef.current = setTimeout(type, 25);
          } else {
            const newChars = currentText.split('').map((char, i) => ({
              char: i <= charIndex ? char : ' ',
              resolved: i <= charIndex,
            }));
            setDisplayChars(newChars);
            scrambleFrames = 0;
            charIndex++;
            animationRef.current = setTimeout(type, s + Math.random() * v);
          }
        } else if (currentMode === 'decode') {
          // Decode mode: entire text scrambled, progressively decodes
          const newChars = currentText.split('').map((char, i) => ({
            char: i < charIndex ? char : getScrambleChar(),
            resolved: i < charIndex,
          }));
          setDisplayChars(newChars);
          charIndex++;
          animationRef.current = setTimeout(type, s + Math.random() * v);
        } else {
          // Classic type mode
          const newChars = currentText.slice(0, charIndex + 1).split('').map(char => ({
            char,
            resolved: true,
          }));
          setDisplayChars(newChars);
          charIndex++;
          animationRef.current = setTimeout(type, s + Math.random() * v);
        }
      } else {
        textIndex++;
        if (textIndex < t.length) {
          // Move to next text in sequence
          animationRef.current = setTimeout(() => {
            charIndex = 0;
            scrambleFrames = 0;
            setDisplayChars([]);
            animationRef.current = setTimeout(type, 200);
          }, 900);
        } else {
          // All texts complete
          if (oc) oc();
          if (l) {
            animationRef.current = setTimeout(() => {
              if (!isMountedRef.current) return;
              textIndex = 0;
              charIndex = 0;
              scrambleFrames = 0;
              setDisplayChars([]);
              animationRef.current = setTimeout(type, 100);
            }, ld);
          } else {
            isRunningRef.current = false;
          }
        }
      }
    };

    animationRef.current = setTimeout(type, d);
  }, [getScrambleChar]);

  // Premium cursor with variable blink timing
  useEffect(() => {
    if (!showCursor) return;
    
    let blinkSpeed = 530;
    let isOn = true;
    
    const blink = () => {
      if (!isMountedRef.current) return;
      isOn = !isOn;
      setCursorVisible(isOn);
      // Slight timing variance for organic feel
      const nextBlink = blinkSpeed + (Math.random() * 60 - 30);
      cursorIntervalRef.current = setTimeout(blink, nextBlink);
    };
    
    cursorIntervalRef.current = setTimeout(blink, blinkSpeed);
    
    return () => {
      if (cursorIntervalRef.current) clearTimeout(cursorIntervalRef.current);
    };
  }, [showCursor]);

  // Main trigger effect
  useEffect(() => {
    isMountedRef.current = true;

    if (!triggerOnScroll) {
      runTypingEngine();
      return () => {
        isMountedRef.current = false;
        if (animationRef.current) clearTimeout(animationRef.current);
        if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current);
        isRunningRef.current = false;
      };
    }

    const target = containerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            if (isMountedRef.current) runTypingEngine();
          }, 100);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
    );

    observer.observe(target);
    observerRef.current = observer;

    return () => {
      isMountedRef.current = false;
      if (animationRef.current) clearTimeout(animationRef.current);
      if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current);
      isRunningRef.current = false;
      observer.disconnect();
    };
  }, [triggerOnScroll, runTypingEngine]);

  // Unmount cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Cursor styles by variant
  const getCursorStyles = () => {
    const base = {
      display: 'inline-block',
      marginLeft: '2px',
      transition: 'opacity 0.08s ease',
      willChange: 'opacity',
    };

    switch (cursorStyle) {
      case 'block':
        return {
          ...base,
          color: 'var(--accent-gold-bright, #F0C96B)',
          textShadow: '0 0 12px var(--accent-gold, #C9A84C), 0 0 24px rgba(201,168,76,0.45)',
          opacity: cursorVisible ? 1 : 0,
          fontSize: '0.9em',
          fontWeight: 400,
        };
      case 'line':
        return {
          ...base,
          width: '2px',
          height: '1.1em',
          background: 'var(--accent-ice, #5EEAD4)',
          boxShadow: '0 0 8px var(--accent-ice, #5EEAD4)',
          opacity: cursorVisible ? 1 : 0.2,
          verticalAlign: 'text-bottom',
        };
      case 'underscore':
        return {
          ...base,
          color: 'var(--gold-500, #C9A84C)',
          textShadow: '0 0 8px var(--gold-500, #C9A84C)',
          opacity: cursorVisible ? 1 : 0,
          transform: 'translateY(2px)',
        };
      default: // classic
        return {
          ...base,
          color: 'var(--gold-400, #DEB954)',
          textShadow: '0 0 10px var(--gold-400, #DEB954)',
          opacity: cursorVisible ? 1 : 0,
          fontWeight: 300,
        };
    }
  };

  // Character render with optional animation classes
  const renderChar = (charObj, index) => {
    const style = {
      display: charObj.resolved ? 'inline' : 'inline-block',
      transition: 'opacity 0.15s ease, transform 0.15s ease',
      opacity: charObj.resolved ? 1 : 0.7,
      color: charObj.resolved ? 'inherit' : 'var(--accent-gold-bright, #F0C96B)',
      transform: charObj.resolved ? 'none' : 'translateY(-1px)',
      textShadow: !charObj.resolved ? '0 0 8px var(--accent-gold, #C9A84C)' : 'none',
    };

    return (
      <span key={index} style={style}>
        {charObj.char}
      </span>
    );
  };

  const glitchStyle = isGlitching ? {
    filter: 'blur(0.5px)',
    transform: `translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px)`,
  } : {};

  const getCursorChar = () => {
    switch (cursorStyle) {
      case 'block': return '▌';
      case 'line': return '';
      case 'underscore': return '_';
      default: return cursorChar;
    }
  };

  return (
    <span 
      ref={containerRef} 
      className={className} 
      aria-label={texts.join(' ')}
      style={glitchStyle}
    >
      {displayChars.map(renderChar)}
      {showCursor && (
        <span style={getCursorStyles()} aria-hidden="true">
          {cursorStyle === 'line' ? null : getCursorChar()}
        </span>
      )}
    </span>
  );
};

export default TypeWriter;
