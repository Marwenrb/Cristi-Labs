import { useRef, useEffect } from 'react';

// ─── Pre-warm offscreen grain canvas (tiled — much cheaper than full-size) ───
let grainCanvas = null;
let grainCtx    = null;
const GRAIN_SIZE = 256;

function buildGrainFrame() {
    if (!grainCanvas) {
        grainCanvas = document.createElement('canvas');
        grainCanvas.width  = GRAIN_SIZE;
        grainCanvas.height = GRAIN_SIZE;
        grainCtx = grainCanvas.getContext('2d');
    }
    const data = grainCtx.createImageData(GRAIN_SIZE, GRAIN_SIZE);
    const buf  = data.data;
    for (let i = 0; i < buf.length; i += 4) {
        const n = (Math.random() - 0.5) * 22;
        buf[i] = buf[i + 1] = buf[i + 2] = n;
        buf[i + 3] = 14;
    }
    grainCtx.putImageData(data, 0, 0);
    return grainCanvas;
}

export default function CinematicHero() {
    const canvasRef = useRef(null);
    const animRef   = useRef(null);
    const stateRef  = useRef({ particles: [], lines: [], time: 0, width: 0, height: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx   = canvas.getContext('2d');
        const state = stateRef.current;

        // ─── Prefers reduced motion ─────────────────────────────
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.fillStyle = '#0B0B0B';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const grad = ctx.createRadialGradient(
                canvas.width * 0.5, canvas.height * 0.5, 0,
                canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.7
            );
            grad.addColorStop(0, 'rgba(184,146,74,0.12)');
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            canvas.style.opacity = '1';
            return;
        }

        const isMobile = window.innerWidth <= 768;

        // ─── Resize ─────────────────────────────────────────────
        const resize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
            state.width   = canvas.width;
            state.height  = canvas.height;
            initParticles();
            initLines();
        };

        // ─── Particles ──────────────────────────────────────────
        const initParticles = () => {
            state.particles = [];
            const base  = (state.width * state.height) / 8000;
            const count = Math.min(Math.floor(base), isMobile ? 80 : 180);
            for (let i = 0; i < count; i++) {
                state.particles.push({
                    x:       Math.random() * state.width,
                    y:       Math.random() * state.height,
                    z:       Math.random(),
                    vx:      (Math.random() - 0.5) * 0.3,
                    vy:      (Math.random() - 0.5) * 0.15,
                    size:    Math.random() * 2.2 + 0.5,     // boosted from 1.5 + 0.3
                    opacity: Math.random() * 0.85 + 0.35,   // boosted from 0.6 + 0.1
                    gold:    Math.random() > 0.6,
                });
            }
        };

        // ─── Light lines (trade routes) ─────────────────────────
        const initLines = () => {
            state.lines = [];
            const count = isMobile ? 6 : 14;
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                state.lines.push({
                    x:        Math.random() * state.width,
                    y:        Math.random() * state.height,
                    length:   Math.random() * 400 + 150,
                    angle,
                    vx:       Math.cos(angle) * (Math.random() * 0.4 + 0.1),
                    vy:       Math.sin(angle) * (Math.random() * 0.2 + 0.05),
                    opacity:  Math.random() * 0.4 + 0.15,   // boosted from 0.15 + 0.03
                    width:    Math.random() * 1.5 + 0.5,    // thicker from 1 + 0.3
                    progress: Math.random(),
                    speed:    Math.random() * 0.002 + 0.0005,
                });
            }
        };

        // ─── Main draw loop ─────────────────────────────────────
        let frame = 0;
        const draw = () => {
            const { width, height, particles, lines } = state;
            state.time += 0.008;
            frame++;
            const t = state.time;

            // Clear
            ctx.fillStyle = '#0B0B0B';
            ctx.fillRect(0, 0, width, height);

            // ── Radial pulse — boosted ────────────────────────
            const pulseScale = 0.7 + Math.sin(t * 0.4) * 0.08;
            const centerGrad = ctx.createRadialGradient(
                width * 0.5, height * 0.5, 0,
                width * 0.5, height * 0.5, width * 0.65 * pulseScale
            );
            centerGrad.addColorStop(0,   'rgba(184,146,74,0.18)');  // was 0.04
            centerGrad.addColorStop(0.4, 'rgba(184,146,74,0.07)');  // was 0.015
            centerGrad.addColorStop(1,   'rgba(0,0,0,0)');
            ctx.fillStyle = centerGrad;
            ctx.fillRect(0, 0, width, height);

            // ── Off-center ambient glow (depth) ──────────────
            const offGrad = ctx.createRadialGradient(
                width * 0.2, height * 0.65, 0,
                width * 0.2, height * 0.65, width * 0.4
            );
            offGrad.addColorStop(0, 'rgba(150,100,40,0.06)');
            offGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = offGrad;
            ctx.fillRect(0, 0, width, height);

            // ── Top edge vignette ─────────────────────────────
            const topGrad = ctx.createLinearGradient(0, 0, 0, height * 0.35);
            topGrad.addColorStop(0, 'rgba(11,11,11,0.55)');
            topGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = topGrad;
            ctx.fillRect(0, 0, width, height);

            // ── Light lines ───────────────────────────────────
            lines.forEach(line => {
                line.x += line.vx;
                line.y += line.vy;
                line.progress += line.speed;

                if (line.x >  width  + 500) line.x = -500;
                if (line.x < -500)          line.x =  width + 500;
                if (line.y >  height + 300) line.y = -300;
                if (line.y < -300)          line.y =  height + 300;

                const dp    = line.progress % 1;
                const alpha = Math.sin(dp * Math.PI) * line.opacity;
                const x2    = line.x + Math.cos(line.angle) * line.length * dp;
                const y2    = line.y + Math.sin(line.angle) * line.length * dp;

                const lg = ctx.createLinearGradient(line.x, line.y, x2, y2);
                lg.addColorStop(0,   `rgba(184,146,74,0)`);
                lg.addColorStop(0.4, `rgba(220,170,75,${alpha})`);
                lg.addColorStop(1,   `rgba(237,234,228,${alpha * 0.6})`);

                ctx.beginPath();
                ctx.moveTo(line.x, line.y);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = lg;
                ctx.lineWidth   = line.width;
                ctx.stroke();
            });

            // ── Particles ─────────────────────────────────────
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x >  width  + 10) p.x = -10;
                if (p.x < -10)          p.x =  width + 10;
                if (p.y >  height + 10) p.y = -10;
                if (p.y < -10)          p.y =  height + 10;

                const twinkle = p.opacity * (0.75 + Math.sin(t * (1 + p.z * 3) + p.x) * 0.25);
                ctx.fillStyle = p.gold
                    ? `rgba(220,170,75,${twinkle * 1.6})`   // boosted color + multiplier
                    : `rgba(237,234,228,${twinkle * 0.8})`; // boosted from 0.4

                const size = p.size * (0.5 + p.z * 0.8);
                ctx.beginPath();
                ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                ctx.fill();
            });

            // ── Film grain (tiled, desktop only, every 6 frames) ─
            if (!isMobile && frame % 6 === 0) {
                const grain = buildGrainFrame();
                ctx.globalAlpha = 0.04;
                for (let gx = 0; gx < width; gx += GRAIN_SIZE) {
                    for (let gy = 0; gy < height; gy += GRAIN_SIZE) {
                        ctx.drawImage(grain, gx, gy);
                    }
                }
                ctx.globalAlpha = 1;
            }

            // ── Bottom gradient — reduced from 0.96 to 0.55 ──
            const bottomGrad = ctx.createLinearGradient(0, height * 0.52, 0, height);
            bottomGrad.addColorStop(0, 'rgba(0,0,0,0)');
            bottomGrad.addColorStop(1, 'rgba(11,11,11,0.55)');
            ctx.fillStyle = bottomGrad;
            ctx.fillRect(0, 0, width, height);

            animRef.current = requestAnimationFrame(draw);
        };

        // ─── Mouse parallax (desktop) ────────────────────────────
        const onMouseMove = (e) => {
            const mx = e.clientX / window.innerWidth;
            const my = e.clientY / window.innerHeight;
            stateRef.current.particles.forEach(p => {
                p.vx += (mx - 0.5) * p.z * 0.001;
                p.vy += (my - 0.5) * p.z * 0.001;
                p.vx *= 0.99;
                p.vy *= 0.99;
            });
        };

        // ─── Init ────────────────────────────────────────────────
        resize();
        canvas.style.opacity    = '0';
        canvas.style.transition = 'opacity 2s ease';
        draw();
        // Use rAF so the first painted frame triggers the CSS fade-in
        requestAnimationFrame(() => { canvas.style.opacity = '1'; });

        window.addEventListener('resize',    resize,      { passive: true });
        if (!isMobile) window.addEventListener('mousemove', onMouseMove, { passive: true });

        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
            window.removeEventListener('resize',    resize);
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position:      'absolute',
                inset:         0,
                width:         '100%',
                height:        '100%',
                display:       'block',
                pointerEvents: 'none',
                zIndex:        0,
            }}
        />
    );
}
