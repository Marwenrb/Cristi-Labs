import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

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

// ── CANVAS: CITY GRID AIR CORRIDOR VISUALIZATION ──────────────────────────
function AirCorridorCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };
    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // City grid nodes
    const NODES = [];
    const GRID_X = 8, GRID_Y = 6;
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

    // Moving pods (aircraft)
    const PODS = Array.from({ length: 6 }, (_, i) => ({
      progress: i / 6,
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

      // Dark base
      ctx.fillStyle = 'rgba(11, 11, 11, 0.92)';
      ctx.fillRect(0, 0, w, h);

      // Draw grid connections
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

      // Animate pods along routes
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

        // Trail
        pod.trail.push({ x: px, y: py, t: pod.progress });
        if (pod.trail.length > 20) pod.trail.shift();

        // Draw trail
        pod.trail.forEach((pt, ti) => {
          const alpha = (ti / pod.trail.length) * 0.5;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(220, 170, 75, ${alpha})`;
          ctx.fill();
        });

        // Draw pod
        const glowAlpha = 0.7 + Math.sin(t * 4 + pod.fromNode) * 0.3;
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(184, 146, 74, 0.8)';
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(237, 234, 228, ${glowAlpha})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Pulse rings on active nodes
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

        // Node dot
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
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function ApexTransit() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const [activeRoute, setActiveRoute] = useState(0);

  // ── GSAP ANIMATIONS (Lenis-safe: NO pin, NO ScrollSmoother conflict) ────
  useGSAP(() => {
    document.fonts.ready.then(() => {
      if (!headlineRef.current) return;

      const split = new SplitText(headlineRef.current, { type: 'chars, words' });

      // Headline char reveal
      gsap.from(split.chars, {
        opacity: 0,
        yPercent: 110,
        rotateX: -80,
        stagger: { amount: 0.8, ease: 'power2.in' },
        duration: 0.7,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: headlineRef.current,
          start: 'top 82%',
          once: true,
        },
        onComplete: () => split.revert(),
      });
    });

    // ── Spec cards stagger in ──────────────────────────────
    gsap.from('.apex-spec-card', {
      opacity: 0,
      y: 35,
      stagger: 0.07,
      duration: 0.7,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: '.apex-specs-grid',
        start: 'top 85%',
        once: true,
      },
    });

    // ── Route rows slide in from left ──────────────────────
    gsap.from('.apex-route-row', {
      opacity: 0,
      x: -40,
      stagger: 0.06,
      duration: 0.6,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: '.apex-routes',
        start: 'top 80%',
        once: true,
      },
    });

    // ── Canvas section parallax (no pin — Lenis safe) ──────
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

    // ── Floating label ──────────────────────────────────────
    gsap.from('.apex-division-label', {
      opacity: 0,
      letterSpacing: '0.6em',
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
      },
    });

    return () => ScrollTrigger.getAll()
      .filter(t => t.vars?.trigger?.closest?.('#apex-transit'))
      .forEach(t => t.kill());

  }, { scope: sectionRef });

  // ── Route auto-cycle ────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      setActiveRoute(r => (r + 1) % AIR_ROUTES.length);
    }, 2800);
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
        padding: '6rem 0 0',
      }}
    >
      {/* ── DIVISION LABEL ─────────────────────────────────────────────── */}
      <div className="apex-division-label" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '0 clamp(1.25rem, 6vw, 6rem)',
        marginBottom: '4rem',
      }}>
        <span style={{ display: 'inline-block', width: '28px', height: '1px', background: 'var(--accent)' }} />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5625rem',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
        }}>
          Cristi Labs · Apex Transit Division · Est. 2026
        </span>
      </div>

      {/* ── HEADLINE BLOCK ─────────────────────────────────────────────── */}
      <div style={{ padding: '0 clamp(1.25rem, 6vw, 6rem)', marginBottom: '3rem' }}>
        <h2
          ref={headlineRef}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.5rem, 10vw, 9rem)',
            lineHeight: 0.92,
            color: 'var(--text-primary)',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}
        >
          The Sky<br />
          <span style={{
            WebkitTextStroke: '1px var(--accent)',
            color: 'transparent',
          }}>
            Is The Network.
          </span>
        </h2>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
          lineHeight: 1.75,
          color: 'var(--text-secondary)',
          maxWidth: '540px',
        }}>
          Cristi Labs Apex Transit operates the world's first AI-orchestrated
          urban air mobility network — eVTOL corridors connecting financial
          districts, logistics hubs, and executive terminals across 47 countries.
          Ground transit is a relic. The next infrastructure layer is vertical.
        </p>
      </div>

      {/* ── CANVAS VISUALIZATION ───────────────────────────────────────── */}
      <div className="apex-canvas-wrap" style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(240px, 45vw, 520px)',
        margin: '0 0 0rem',
        overflow: 'hidden',
      }}>
        <AirCorridorCanvas />

        {/* Overlay gradient for text legibility */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, var(--bg-void) 0%, transparent 30%, transparent 70%, var(--bg-void) 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(to top, var(--bg-void), transparent)',
          pointerEvents: 'none',
        }} />

        {/* Live badge overlay */}
        <div style={{
          position: 'absolute',
          top: '1.25rem',
          right: 'clamp(1.25rem, 4vw, 3rem)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(11,11,11,0.85)',
          border: '1px solid rgba(184,146,74,0.25)',
          backdropFilter: 'blur(12px)',
          borderRadius: '999px',
          padding: '6px 14px',
        }}>
          <span style={{
            width: '6px', height: '6px',
            borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 8px #22c55e',
            animation: 'apexPulse 1.5s ease infinite',
            display: 'inline-block',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.25em',
            color: 'var(--text-secondary)',
          }}>
            LIVE NETWORK
          </span>
        </div>

        {/* Active route display overlay */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: 'clamp(1.25rem, 4vw, 3rem)',
          background: 'rgba(11,11,11,0.8)',
          border: '1px solid rgba(184,146,74,0.2)',
          backdropFilter: 'blur(16px)',
          borderRadius: '12px',
          padding: '1rem 1.5rem',
          minWidth: '220px',
        }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.3em', color: 'var(--accent)', marginBottom: '8px' }}>
            ACTIVE ROUTE
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: 1.1 }}>
            {AIR_ROUTES[activeRoute].from} → {AIR_ROUTES[activeRoute].to}
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>
              ⏱ {AIR_ROUTES[activeRoute].time}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)' }}>
              {AIR_ROUTES[activeRoute].status}
            </span>
          </div>
        </div>
      </div>

      {/* ── FLEET SPECS GRID ────────────────────────────────────────────── */}
      <div className="apex-specs-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '1px',
        background: 'rgba(184,146,74,0.08)',
        borderTop: '1px solid rgba(184,146,74,0.1)',
        borderBottom: '1px solid rgba(184,146,74,0.1)',
        margin: '0 0 4rem',
      }}>
        {FLEET_SPECS.map((spec, i) => (
          <div
            key={i}
            className="apex-spec-card"
            style={{
              background: 'var(--bg-void)',
              padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1rem, 2vw, 2rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'default',
              transition: 'background 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,146,74,0.04)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-void)'}
          >
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '8px',
              letterSpacing: '0.25em',
              color: 'var(--accent)',
              textTransform: 'uppercase',
            }}>
              {spec.label}
            </span>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--text-primary)',
              lineHeight: 1,
            }}>
              {spec.value}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: 'var(--text-secondary)',
              letterSpacing: '0.1em',
            }}>
              {spec.unit}
            </span>
          </div>
        ))}
      </div>

      {/* ── ROUTES TABLE + PHOTO ────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
        gap: 0,
        margin: '0 clamp(1.25rem, 6vw, 6rem) 0',
        border: '1px solid rgba(184,146,74,0.1)',
        borderRadius: '1.5rem',
        overflow: 'hidden',
      }}>
        {/* Routes list */}
        <div className="apex-routes" style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.3em', color: 'var(--accent)', marginBottom: '1.5rem' }}>
            ACTIVE CORRIDORS · 2026
          </p>
          {AIR_ROUTES.map((route, i) => (
            <div
              key={i}
              className="apex-route-row"
              onClick={() => setActiveRoute(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.875rem 0',
                borderBottom: '1px solid rgba(184,146,74,0.07)',
                cursor: 'pointer',
                background: activeRoute === i ? 'rgba(184,146,74,0.04)' : 'transparent',
                borderLeft: activeRoute === i ? '2px solid var(--accent)' : '2px solid transparent',
                paddingLeft: activeRoute === i ? '12px' : '0',
                transition: 'all 0.3s ease',
              }}
            >
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '3px' }}>
                  {route.from} <span style={{ color: 'var(--accent)' }}>→</span> {route.to}
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
                  {route.distance}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  {route.time}
                </p>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '8px',
                  letterSpacing: '0.2em',
                  color: route.status === 'LIVE' ? '#22c55e' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  justifyContent: 'flex-end',
                }}>
                  {route.status === 'LIVE' && (
                    <span style={{
                      display: 'inline-block',
                      width: '5px', height: '5px',
                      borderRadius: '50%',
                      background: '#22c55e',
                      animation: 'apexPulse 1.5s ease infinite',
                    }} />
                  )}
                  {route.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Image panel */}
        <div style={{ position: 'relative', minHeight: '320px', overflow: 'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=95&fm=webp"
            alt="Aerial city view at night — Apex Transit corridors"
            loading="lazy"
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, var(--bg-void) 0%, rgba(11,11,11,0.3) 40%, transparent 100%)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            right: '2rem',
            textAlign: 'right',
          }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--text-primary)', lineHeight: 1 }}>
              47+
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--accent)' }}>
              COUNTRIES
            </p>
          </div>
        </div>
      </div>

      {/* ── BOTTOM CTA BAR ──────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        padding: '3rem clamp(1.25rem, 6vw, 6rem) 5rem',
        borderTop: '1px solid rgba(184,146,74,0.08)',
        marginTop: '4rem',
      }}>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '0.5rem' }}>
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
            padding: '1rem 2rem',
            border: '1px solid var(--accent)',
            color: 'var(--accent)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
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

      {/* ── ANIMATIONS CSS ──────────────────────────────────────────────── */}
      <style>{`
        @keyframes apexPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>
    </section>
  );
}
