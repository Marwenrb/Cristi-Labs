# Cristi Labs — Frontend Application

> React 19 + Vite 6 + Tailwind CSS 4 + GSAP 3

This is the frontend application for the official Cristi Labs corporate website. It delivers a cinematic, GPU-accelerated web experience with scroll-driven animations, video backgrounds, and responsive design across all breakpoints.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (accessible on local network)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

The dev server runs at [http://localhost:5173](http://localhost:5173).

---

## Architecture

| Concern | Implementation |
|---------|---------------|
| Routing | React Router 7.6.1 — five pages (Home, Ventures, Global Trade, Vision, Contact) |
| Layout | `MainLayout.jsx` wraps all routes with Navbar, Preloader, and ScrollSmoother |
| Animation | GSAP 3.13.0 with ScrollTrigger (pinning, scrub, parallax), SplitText, and `@gsap/react` hooks |
| Smooth Scroll | `@studio-freight/lenis` integrated with GSAP ScrollSmoother |
| Styling | Tailwind CSS 4.1.8 via `@tailwindcss/vite` plugin — utility-first with custom section CSS |
| Media | All assets imported via ES modules from `src/assets/Medias/` — Vite handles hashing and optimization |
| Responsiveness | `react-responsive` for breakpoint-aware rendering |

---

## Media Structure

```
src/assets/Medias/
├── hero/          # Hero video (MP4), desktop background, poster frame
├── gallery/       # Gallery section full-bleed backgrounds
├── sticky/        # Sticky column feature visuals
└── welcome/       # Welcome section imagery
```

All media files are imported using standard ES module syntax, ensuring Vite's asset pipeline handles content hashing, optimization, and cache-busting automatically.

---

## Animation Guidelines

- All animations use `useGSAP()` from `@gsap/react` for automatic cleanup
- ScrollTrigger instances are killed in cleanup functions to prevent memory leaks
- `will-change` and GPU-accelerated transforms are used throughout for 60fps performance
- Video elements use `pointer-events-none` to prevent interaction conflicts with scroll
- SplitText instances are created after DOM ready and followed by `ScrollTrigger.refresh()`

---

## Environment

- **Node.js** >= 18
- **npm** >= 9

---

## Developer

Designed and developed by **[Marouan Rabai](https://marwen-rabai.netlify.app/)** — Founder & CEO, Cristi Labs LLC.

---

© 2026 Cristi Labs LLC. All Rights Reserved.
