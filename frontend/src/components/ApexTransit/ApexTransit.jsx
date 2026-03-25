import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import airplaneImg from '../../assets/Medias/gallery/airplane.jpg';
import apexTransitVideo from '../../assets/Medias/welcome/apex-transit-sequence.mp4';
import './ApexTransit.css';

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
  const tagsRef = useRef(null);
  const labelRef = useRef(null);
  const videoRef = useRef(null);
  const [activeRoute, setActiveRoute] = useState(0);

  // ── APEX VIDEO: lazy load + auto pause off-screen ──────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      {
        threshold: 0.05,
        rootMargin: '100px 0px 0px 0px',
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  // ── HEADLINE + PARAGRAPH: IntersectionObserver with skewY reveal ──────
  useEffect(() => {
    const headline = headlineRef.current;
    const para = paragraphRef.current;

    if (headline) {
      headline.style.cssText =
        'opacity:0;transform:translateY(55px) skewY(2.5deg);filter:blur(10px);transition:none;';
    }
    if (para) {
      para.style.cssText = 'opacity:0;transform:translateY(28px);transition:none;';
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();

      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (headline) {
          headline.style.transition = [
            'opacity 1.2s cubic-bezier(0.16,1,0.3,1)',
            'transform 1.4s cubic-bezier(0.16,1,0.3,1)',
            'filter 1.1s ease',
          ].join(',');
          headline.style.opacity   = '1';
          headline.style.transform = 'translateY(0) skewY(0deg)';
          headline.style.filter    = 'blur(0px)';
        }

        if (para) {
          setTimeout(() => {
            para.style.transition = 'opacity 0.9s ease, transform 1s cubic-bezier(0.16,1,0.3,1)';
            para.style.opacity    = '1';
            para.style.transform  = 'translateY(0)';
          }, 350);
        }
      }));
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    if (headline) observer.observe(headline);
    return () => observer.disconnect();
  }, []);

  // ── DIVISION LABEL: slide in from left ────────────────────────────────
  useEffect(() => {
    const el = labelRef.current;
    if (!el) return;
    el.style.cssText = 'opacity:0;transform:translateX(-24px);transition:none;';

    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.7s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)';
        el.style.opacity = '1';
        el.style.transform = 'translateX(0)';
      }));
    }, { threshold: 0.1 });

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── TAG STRIP: fade up on scroll ──────────────────────────────────────
  useEffect(() => {
    const el = tagsRef.current;
    if (!el) return;
    el.style.cssText = 'opacity:0;transform:translateY(16px);transition:none;';

    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.8s ease 0.2s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }));
    }, { threshold: 0.1 });

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── ROUTE ROWS + SPEC CARDS: IntersectionObserver (reliable, no stuck opacity) ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Route rows — slide in from left
    const routeRows = section.querySelectorAll('.apex-route-row');
    routeRows.forEach(row => {
      row.style.opacity = '0';
      row.style.transform = 'translateX(-40px)';
      row.style.transition = 'none';
    });

    const routesContainer = section.querySelector('.apex-routes');
    if (routesContainer) {
      const routeObserver = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        routeObserver.disconnect();
        routeRows.forEach((row, i) => {
          requestAnimationFrame(() => requestAnimationFrame(() => {
            row.style.transition = `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s`;
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
          }));
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
      routeObserver.observe(routesContainer);
    }

    // Spec cards — fade up
    const specCards = section.querySelectorAll('.apex-spec-card');
    specCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(35px)';
      card.style.transition = 'none';
    });

    const specsGrid = section.querySelector('.apex-specs-grid');
    if (specsGrid) {
      const specObserver = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        specObserver.disconnect();
        specCards.forEach((card, i) => {
          requestAnimationFrame(() => requestAnimationFrame(() => {
            card.style.transition = `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s`;
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }));
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      specObserver.observe(specsGrid);
    }

    return () => {};
  }, []);

  // ── GSAP ANIMATIONS — matchMedia for canvas parallax + label ──────────
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 769px)', () => {
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
        <div ref={labelRef} className="apex-division-label" style={{
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
        <div ref={tagsRef} style={{
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

      {/* ── VIDEO VISUALIZATION ─────────────────────────────────────────── */}
      <div className="apex-canvas-wrap" style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(180px, 35vw, 460px)',
        overflow: 'hidden',
      }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            display: 'block',
            pointerEvents: 'none',
          }}
        >
          <source src={apexTransitVideo} type="video/mp4" />
        </video>

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

        {/* ── HUD: subtle dot-grid overlay ─────────────────────────── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: [
            'linear-gradient(rgba(184,146,74,0.016) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(184,146,74,0.016) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '72px 72px',
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        {/* ── Corner bracket: top-left ─────────────────────────────────── */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          width: '16px',
          height: '16px',
          borderTop: '1px solid rgba(184,146,74,0.42)',
          borderLeft: '1px solid rgba(184,146,74,0.42)',
          pointerEvents: 'none',
          zIndex: 3,
        }} />

        {/* ── Corner bracket: bottom-right ─────────────────────────────── */}
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          width: '16px',
          height: '16px',
          borderBottom: '1px solid rgba(184,146,74,0.42)',
          borderRight: '1px solid rgba(184,146,74,0.42)',
          pointerEvents: 'none',
          zIndex: 3,
        }} />

        {/* ── Scan line sweep ──────────────────────────────────────────── */}
        <div className="apex-scan-line" />

        {/* ── Network badge ────────────────────────────────────────────── */}
        <div style={{
          position: 'absolute',
          top: '1.25rem',
          right: 'clamp(1rem, 4vw, 3rem)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(8,8,8,0.94)',
          border: '1px solid rgba(184,146,74,0.22)',
          backdropFilter: 'blur(20px)',
          padding: '6px 14px',
          borderRadius: '2px',
          boxShadow: '0 2px 20px rgba(0,0,0,0.45), inset 0 1px 0 rgba(184,146,74,0.07)',
          zIndex: 5,
        }}>
          <span className="apex-live-dot" />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '8px',
            letterSpacing: '0.3em',
            color: 'rgba(184,146,74,0.65)',
            textTransform: 'uppercase',
          }}>
            APEX NETWORK
          </span>
        </div>

        {/* ── Active route overlay ─────────────────────────────────────── */}
        <div
          className="apex-route-card"
          style={{
            position: 'absolute',
            bottom: 'clamp(1rem, 3vw, 2rem)',
            left: 'clamp(1rem, 4vw, 3rem)',
            background: 'rgba(8,8,8,0.92)',
            border: '1px solid rgba(184,146,74,0.16)',
            borderTop: '1px solid rgba(184,146,74,0.5)',
            backdropFilter: 'blur(24px)',
            borderRadius: '2px',
            padding: '12px 18px',
            minWidth: '200px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(184,146,74,0.06)',
            zIndex: 5,
          }}
        >
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '6.5px',
            letterSpacing: '0.36em',
            color: 'rgba(184,146,74,0.5)',
            marginBottom: '7px',
            textTransform: 'uppercase',
          }}>
            Active Route
          </p>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            color: 'var(--text-primary)',
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
          }}>
            {AIR_ROUTES[activeRoute].from}
            <span style={{ color: 'rgba(184,146,74,0.55)', margin: '0 5px', fontSize: '0.82em' }}>›</span>
            {AIR_ROUTES[activeRoute].to}
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '8px',
            paddingTop: '7px',
            borderTop: '1px solid rgba(184,146,74,0.08)',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.06em',
            }}>
              ⏱ {AIR_ROUTES[activeRoute].time}
            </span>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: AIR_ROUTES[activeRoute].status === 'LIVE' ? 'var(--accent)' : 'rgba(184,146,74,0.58)',
              letterSpacing: '0.14em',
            }}>
              {AIR_ROUTES[activeRoute].status === 'LIVE' && (
                <span className="apex-live-dot" style={{ width: '4px', height: '4px' }} />
              )}
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
              color: 'rgba(184,146,74,0.58)',
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
                    color: 'rgba(184,146,74,0.58)',
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
                    color: route.status === 'LIVE' ? 'var(--accent)' : 'rgba(184,146,74,0.58)',
                    textTransform: 'uppercase',
                  }}>{route.status}</span>
                </div>
              ))}
            </div>

            {/* RIGHT PANEL — airplane image */}
            <div style={{
              position: 'relative',
              minHeight: '280px',
              overflow: 'hidden',
              background: '#0B0B0B',
            }}>
              <img
                src={airplaneImg}
                alt="Apex Transit eVTOL — Cristi Labs urban air mobility corridor"
                width={1920}
                height={1080}
                loading="lazy"
                decoding="async"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center center',
                  display: 'block',
                }}
              />
              {/* Gradient for text legibility */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, var(--bg-void) 0%, rgba(11,11,11,0.45) 40%, transparent 100%)',
                pointerEvents: 'none',
                zIndex: 1,
              }} />
              {/* 47+ overlay */}
              <div style={{
                position: 'absolute',
                bottom: '1.5rem',
                right: '1.5rem',
                textAlign: 'right',
                zIndex: 2,
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
