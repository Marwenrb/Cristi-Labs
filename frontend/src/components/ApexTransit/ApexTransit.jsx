import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import gallery3Img from '../../assets/Medias/gallery/gallery-3.png';

gsap.registerPlugin(ScrollTrigger);

// ── ROUTE DATA ────────────────────────────────────────────────────────────
const AIR_ROUTES = [
  { from: 'New York', to: 'JFK Airport', time: '4 min', distance: '18 km', status: 'LIVE' },
  { from: 'Dubai Marina', to: 'DIFC', time: '6 min', distance: '22 km', status: 'LIVE' },
  { from: 'Paris CBD', to: 'CDG Airport', time: '9 min', distance: '35 km', status: 'Q3 2026' },
  { from: 'London City', to: 'Heathrow', time: '7 min', distance: '28 km', status: 'Q4 2026' },
  { from: 'Singapore', to: 'Sentosa', time: '3 min', distance: '12 km', status: 'LIVE' },
  { from: 'Tokyo', to: 'Narita', time: '11 min', distance: '48 km', status: '2027' },
];

const FLEET_SPECS = [
  { label: 'MAX ALTITUDE', value: '1,500', unit: 'ft / 460m' },
  { label: 'CRUISE SPEED', value: '320', unit: 'km/h' },
  { label: 'RANGE', value: '250', unit: 'km per charge' },
  { label: 'CAPACITY', value: '6', unit: 'passengers' },
  { label: 'NOISE LEVEL', value: '45', unit: 'dB — near silent' },
  { label: 'CARBON', value: '0', unit: 'direct emissions' },
];

const DESCRIPTOR_TAGS = ['eVTOL Networks', 'AI Orchestration', '47 Countries', 'Zero Emissions', 'Executive Transit'];

// ── CANVAS: CITY GRID AIR CORRIDOR VISUALIZATION ──────────────────────────
function AirCorridorCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const mobile = window.innerWidth < 768;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const NODES = [];
    const GRID_X = mobile ? 5 : 8;
    const GRID_Y = mobile ? 4 : 6;
    const initNodes = () => {
      NODES.length = 0;
      for (let x = 0; x < GRID_X; x++) {
        for (let y = 0; y < GRID_Y; y++) {
          const jitter = () => (Math.random() - 0.5) * (W() / GRID_X) * 0.4;
          NODES.push({
            x: (x / (GRID_X - 1)) * W() * 0.85 + W() * 0.075 + jitter(),
            y: (y / (GRID_Y - 1)) * H() * 0.75 + H() * 0.125 + jitter(),
            pulse: Math.random() * Math.PI * 2,
            size: Math.random() * 2 + 1.5,
            active: Math.random() > 0.3,
          });
        }
      }
    };
    initNodes();

    const PODS = Array.from({ length: mobile ? 3 : 6 }, (_, i) => ({
      progress: i / (mobile ? 3 : 6),
      speed: 0.0008 + Math.random() * 0.0006,
      fromNode: Math.floor(Math.random() * NODES.length),
      toNode: Math.floor(Math.random() * NODES.length),
      trail: [],
    }));

    let t = 0;
    const draw = () => {
      t += 0.012;
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(11, 11, 11, 0.92)';
      ctx.fillRect(0, 0, w, h);

      NODES.forEach((node, i) => {
        NODES.forEach((other, j) => {
          if (j <= i) return;
          const dist = Math.hypot(node.x - other.x, node.y - other.y);
          if (dist > w * 0.28) return;
          const alpha = (1 - dist / (w * 0.28)) * 0.12;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(184, 146, 74, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        });
      });

      PODS.forEach(pod => {
        pod.progress += pod.speed;
        if (pod.progress >= 1) {
          pod.progress = 0;
          pod.fromNode = pod.toNode;
          pod.toNode = Math.floor(Math.random() * NODES.length);
          pod.trail = [];
        }

        const from = NODES[pod.fromNode];
        const to = NODES[pod.toNode];
        if (!from || !to) return;

        const px = from.x + (to.x - from.x) * pod.progress;
        const py = from.y + (to.y - from.y) * pod.progress;

        pod.trail.push({ x: px, y: py });
        if (pod.trail.length > 20) pod.trail.shift();

        pod.trail.forEach((pt, ti) => {
          const alpha = (ti / pod.trail.length) * 0.5;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(220, 170, 75, ${alpha})`;
          ctx.fill();
        });

        const glowAlpha = 0.7 + Math.sin(t * 4 + pod.fromNode) * 0.3;
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(184, 146, 74, 0.8)';
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(237, 234, 228, ${glowAlpha})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      NODES.forEach(node => {
        if (!node.active) return;
        node.pulse += 0.04;
        const ring = (node.pulse % (Math.PI * 2)) / (Math.PI * 2);
        const ringAlpha = (1 - ring) * 0.25;
        const ringSize = ring * 20;

        ctx.beginPath();
        ctx.arc(node.x, node.y, ringSize, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(184, 146, 74, ${ringAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(184, 146, 74, 0.8)';
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
}

// ── MOBILE REVEAL WRAPPER ─────────────────────────────────────────────────
function MobileReveal({ children, delay = 0, style = {}, className = '' }) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.innerWidth >= 768) { setRevealed(true); return; }

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); observer.unobserve(el); } },
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
        willChange: revealed ? 'auto' : 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function ApexTransit() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const paragraphRef = useRef(null);
  const gallery3ImgRef = useRef(null);
  const [activeRoute, setActiveRoute] = useState(0);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // ── HEADLINE + PARAGRAPH: IntersectionObserver — works everywhere ─────
  useEffect(() => {
    const headline = headlineRef.current;
    if (!headline) return;

    // Set initial HIDDEN state before first paint via cssText
    headline.style.cssText = `
      opacity: 0;
      transform: translateY(60px) skewY(2deg);
      filter: blur(12px);
      transition: none;
    `;

    const headlineObserver = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      headlineObserver.disconnect();
      requestAnimationFrame(() => requestAnimationFrame(() => {
        headline.style.transition = [
          'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
          'filter 1.1s ease',
        ].join(', ');
        headline.style.opacity = '1';
        headline.style.transform = 'translateY(0) skewY(0)';
        headline.style.filter = 'blur(0px)';
      }));
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    headlineObserver.observe(headline);

    const para = paragraphRef.current;
    if (para) {
      para.style.cssText = 'opacity: 0; transform: translateY(30px); transition: none;';

      const paraObserver = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        paraObserver.disconnect();
        requestAnimationFrame(() => requestAnimationFrame(() => {
          setTimeout(() => {
            para.style.transition = 'opacity 0.9s ease 0.1s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.1s';
            para.style.opacity = '1';
            para.style.transform = 'translateY(0)';
          }, 300);
        }));
      }, { threshold: 0.1 });

      paraObserver.observe(para);
      return () => { headlineObserver.disconnect(); paraObserver.disconnect(); };
    }
    return () => headlineObserver.disconnect();
  }, []);

  // ── GSAP ANIMATIONS — matchMedia separates desktop / mobile ──────────
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 769px)', () => {
      // Spec cards stagger
      gsap.from('.apex-spec-card', {
        opacity: 0,
        y: 35,
        stagger: 0.07,
        duration: 0.7,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.apex-specs-grid', start: 'top 85%', once: true },
      });

      // Route rows slide from left
      gsap.from('.apex-route-row', {
        opacity: 0,
        x: -40,
        stagger: 0.06,
        duration: 0.6,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.apex-routes', start: 'top 80%', once: true },
      });

      // Canvas parallax
      gsap.to('.apex-canvas-wrap', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      });

      // Division label
      gsap.from('.apex-division-label', {
        opacity: 0,
        letterSpacing: '0.6em',
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      });
    });

    mm.add('(max-width: 768px)', () => {
      // Label fade
      gsap.from('.apex-division-label', {
        opacity: 0,
        y: 16,
        duration: 0.6,
        ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  // ── Route auto-cycle ─────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setActiveRoute(r => (r + 1) % AIR_ROUTES.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="apex-transit"
      ref={sectionRef}
      style={{
        background: 'var(--bg-void)',
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(3rem, 8vw, 6rem) 0 0',
      }}
    >
      {/* ── SECTION IDENTIFIER ────────────────────────────────────────────── */}
      <div style={{ padding: '0 clamp(1.25rem, 6vw, 6rem)', marginBottom: '2rem' }}>
        <div className="apex-division-label" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '1.5rem',
        }}>
          <div style={{ width: '28px', height: '1px', background: 'var(--accent)' }} />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
            letterSpacing: '0.34em', textTransform: 'uppercase', color: 'var(--accent)',
          }}>
            Cristi Labs · Apex Transit Division · UAM Network
          </span>
        </div>

        {/* ── HEADLINE ─────────────────────────────────────────────────────── */}
        <div ref={headlineRef} style={{ marginBottom: '0.5rem' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(4rem, 11vw, 10rem)',
            lineHeight: 0.84,
            color: 'var(--text-primary)',
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
          }}>
            Command
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(4rem, 11vw, 10rem)',
            lineHeight: 0.84,
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            WebkitTextStroke: '1px var(--accent)',
            color: 'transparent',
          }}>
            The Horizon.
          </div>
        </div>

        {/* ── DESCRIPTOR TAGS ──────────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          borderTop: '1px solid rgba(184,146,74,0.1)',
          borderBottom: '1px solid rgba(184,146,74,0.1)',
          margin: '2rem 0',
        }}>
          {['eVTOL Networks', 'AI Air Corridors', '47 Countries', 'Zero Emissions', 'Executive Transit'].map((tag, i, arr) => (
            <span key={i} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '7.5px',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              padding: '11px 20px',
              borderRight: i < arr.length - 1 ? '1px solid rgba(184,146,74,0.08)' : 'none',
              whiteSpace: 'nowrap',
            }}>
              {tag}
            </span>
          ))}
        </div>

        <p ref={paragraphRef} style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
          lineHeight: 1.82,
          color: 'var(--text-secondary)',
          maxWidth: '500px',
        }}>
          The world's first AI-orchestrated urban air mobility network.
          Silent eVTOL corridors connecting financial capitals, executive
          terminals, and logistics hubs across 47 countries. When ground
          infrastructure reaches its limit — we command the horizon.
        </p>
      </div>

      {/* ── CANVAS VISUALIZATION ───────────────────────────────────────── */}
      <div className="apex-canvas-wrap" style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(180px, 35vw, 460px)',
        overflow: 'hidden',
      }}>
        <AirCorridorCanvas />

        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, var(--bg-void) 0%, transparent 30%, transparent 70%, var(--bg-void) 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
          background: 'linear-gradient(to top, var(--bg-void), transparent)',
          pointerEvents: 'none',
        }} />

        {/* Network badge */}
        <div style={{
          position: 'absolute',
          top: '1.25rem',
          right: 'clamp(1rem, 4vw, 3rem)',
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'rgba(11,11,11,0.9)',
          border: '1px solid rgba(184,146,74,0.22)',
          backdropFilter: 'blur(16px)',
          padding: '6px 16px',
          borderRadius: '2px',
        }}>
          <span style={{
            width: '4px',
            height: '4px',
            background: 'var(--accent)',
            transform: 'rotate(45deg)',
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '8px',
            letterSpacing: '0.28em',
            color: 'rgba(184,146,74,0.6)',
            textTransform: 'uppercase',
          }}>
            APEX NETWORK
          </span>
        </div>

        {/* Active route overlay */}
        <div style={{
          position: 'absolute',
          bottom: 'clamp(1rem, 3vw, 2rem)',
          left: 'clamp(1rem, 4vw, 3rem)',
          background: 'rgba(11,11,11,0.85)',
          border: '1px solid rgba(184,146,74,0.18)',
          backdropFilter: 'blur(20px)',
          borderRadius: '2px',
          padding: '12px 18px',
          minWidth: '200px',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '7px',
            letterSpacing: '0.32em',
            color: 'var(--accent)',
            marginBottom: '6px',
            textTransform: 'uppercase',
          }}>
            Active Route
          </p>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            color: 'var(--text-primary)',
            lineHeight: 1.15,
          }}>
            {AIR_ROUTES[activeRoute].from} → {AIR_ROUTES[activeRoute].to}
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '6px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-secondary)' }}>
              ⏱ {AIR_ROUTES[activeRoute].time}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent)', letterSpacing: '0.1em' }}>
              {AIR_ROUTES[activeRoute].status}
            </span>
          </div>
        </div>
      </div>

      {/* ── FLEET SPECS: ENGINEERING DATA STRIP ────────────────────────── */}
      <div className="apex-specs-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '1px',
        background: 'rgba(184,146,74,0.06)',
        borderTop: '1px solid rgba(184,146,74,0.08)',
        borderBottom: '1px solid rgba(184,146,74,0.08)',
        overflowX: 'auto',
        marginBottom: 'clamp(2rem, 5vw, 4rem)',
      }}>
        {[
          { label: 'Altitude', value: '1,500', unit: 'ft' },
          { label: 'Speed', value: '320', unit: 'km/h' },
          { label: 'Range', value: '250', unit: 'km' },
          { label: 'Capacity', value: '6', unit: 'seats' },
          { label: 'Noise', value: '45', unit: 'dB' },
          { label: 'Emissions', value: '0', unit: 'CO₂' },
        ].map((spec, i) => (
          <div key={i} className="apex-spec-card" style={{
            background: 'var(--bg-void)',
            padding: 'clamp(1.25rem, 2.5vw, 2rem)',
            minWidth: '100px',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '7px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(184,146,74,0.4)',
              marginBottom: '8px',
            }}>{spec.label}</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              color: 'var(--text-primary)',
              lineHeight: 1,
              marginBottom: '3px',
            }}>{spec.value}</div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '8px',
              color: 'var(--text-secondary)',
              letterSpacing: '0.1em',
            }}>{spec.unit}</div>
          </div>
        ))}
      </div>

      {/* ── ROUTES TABLE + PHOTO ──────────────────────────────────────── */}
      <MobileReveal delay={0.15}>
        <div style={{ padding: '0 clamp(1.25rem, 6vw, 6rem)' }}>
          <div style={{
            border: '1px solid rgba(184,146,74,0.08)',
            borderRadius: '4px',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
          }}>

            {/* Routes panel */}
            <div className="apex-routes">
              {/* Column headers */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 60px 52px 80px',
                gap: '8px',
                padding: '10px 20px',
                background: 'rgba(184,146,74,0.03)',
                borderBottom: '1px solid rgba(184,146,74,0.08)',
              }}>
                {['CORRIDOR', 'ETA', 'KM', 'STATUS'].map(h => (
                  <span key={h} style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '7px',
                    letterSpacing: '0.24em',
                    color: 'rgba(184,146,74,0.3)',
                    textTransform: 'uppercase',
                  }}>{h}</span>
                ))}
              </div>

              {/* Route rows */}
              {AIR_ROUTES.map((route, i) => (
                <div
                  key={i}
                  className="apex-route-row"
                  onClick={() => setActiveRoute(i)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 60px 52px 80px',
                    gap: '8px',
                    padding: '11px 20px',
                    borderBottom: '1px solid rgba(184,146,74,0.04)',
                    cursor: 'pointer',
                    background: activeRoute === i ? 'rgba(184,146,74,0.03)' : 'transparent',
                    borderLeft: `2px solid ${activeRoute === i ? 'var(--accent)' : 'transparent'}`,
                    transition: 'all 0.2s ease',
                    alignItems: 'center',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.78rem',
                    color: activeRoute === i ? 'var(--text-primary)' : 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {route.from}
                    <span style={{ color: 'var(--accent)', margin: '0 5px', fontSize: '0.7rem' }}>›</span>
                    {route.to}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.95rem',
                    color: 'var(--text-primary)',
                  }}>{route.time}</span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '7.5px',
                    color: 'var(--text-secondary)',
                  }}>{route.distance}</span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '7.5px',
                    letterSpacing: '0.12em',
                    color: route.status === 'LIVE' ? 'var(--accent)' : 'rgba(184,146,74,0.4)',
                    textTransform: 'uppercase',
                  }}>{route.status}</span>
                </div>
              ))}
            </div>

            {/* Image panel */}
            <div style={{ position: 'relative', minHeight: '280px', overflow: 'hidden' }}>
              <img
                ref={gallery3ImgRef}
                src={gallery3Img}
                alt="Apex Transit aerial city network — Cristi Labs"
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center center',
                  display: 'block',
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, var(--bg-void) 0%, rgba(11,11,11,0.1) 60%, transparent 100%)',
              }} />
              <div style={{
                position: 'absolute',
                bottom: '1.5rem',
                right: '1.5rem',
                textAlign: 'right',
              }}>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                }}>47+</p>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '7.5px',
                  letterSpacing: '0.24em',
                color: 'var(--accent)',
                textTransform: 'uppercase',
              }}>Countries</p>
            </div>
          </div>
        </div>
        </div>
      </MobileReveal>

      {/* ── BOTTOM CTA BAR ──────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        padding: 'clamp(2rem, 4vw, 3rem) clamp(1.25rem, 6vw, 6rem) clamp(3rem, 6vw, 5rem)',
        borderTop: '1px solid rgba(184,146,74,0.08)',
        marginTop: 'clamp(2rem, 5vw, 4rem)',
      }}>
        <div>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.3rem, 4vw, 2.5rem)',
            color: 'var(--text-primary)',
            lineHeight: 1,
            marginBottom: '0.5rem',
          }}>
            Request Executive Access
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--text-secondary)' }}>
            BY INVITATION · VETTED OPERATORS ONLY
          </p>
        </div>
        <a
          href="/contact"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1.25rem, 3vw, 2rem)',
            border: '1px solid var(--accent)',
            color: 'var(--accent)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(9px, 1.8vw, 11px)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'background 0.3s, color 0.3s',
            flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#0B0B0B'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent)'; }}
        >
          INITIATE CONTACT →
        </a>
      </div>

      {/* ── KEYFRAMES ──────────────────────────────────────────────────── */}
      <style>{`
        @keyframes apexPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>
    </section>
  );
}
