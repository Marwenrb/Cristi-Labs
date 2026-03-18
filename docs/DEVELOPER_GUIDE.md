# Cristi Labs Digital — Complete Developer Guide

> **Official corporate site for Cristi Labs LLC** — A US-based venture studio operating at the intersection of high-frequency global trade and immersive digital entertainment.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Installation & Setup](#4-installation--setup)
5. [Development Workflow](#5-development-workflow)
6. [Architecture & Routing](#6-architecture--routing)
7. [Key Components](#7-key-components)
8. [Animation System (GSAP)](#8-animation-system-gsap)
9. [Design System](#9-design-system)
10. [Building & Deployment](#10-building--deployment)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Project Overview

Cristi Labs Digital is a high-end corporate website built with React 19, Tailwind CSS 4, and GSAP. It features:

- **Smooth scroll** via GSAP ScrollSmoother
- **Scroll-triggered animations** (parallax, reveals, pinned sections)
- **Responsive design** (mobile-first, desktop-optimized)
- **Multi-page SPA** with React Router v7
- **Contact form** ready for backend integration

### Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Hero, Welcome, Choose, Gallery, StickyCols, Footer |
| `/ventures` | Ventures | Five venture niches showcase |
| `/global-trade` | GlobalTrade | Logistics & Digital Twin content |
| `/vision` | Vision | Manifesto, pillars, leadership |
| `/contact` | Contact | Corporate info + contact form |

---

## 2. Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.0 | UI framework |
| **Vite** | 6.3.5 | Build tool & dev server |
| **Tailwind CSS** | 4.1.8 | Styling |
| **GSAP** | 3.13.0 | Animations (ScrollTrigger, ScrollSmoother, SplitText) |
| **@gsap/react** | 2.1.2 | React hooks for GSAP |
| **react-router-dom** | 7.6.1 | Client-side routing |
| **react-icons** | 5.5.0 | Icon library |
| **@studio-freight/lenis** | 1.0.42 | (Optional) Smooth scroll fallback |

---

## 3. Project Structure

```
Cristi Labs Digital Official/
├── package.json              # Root scripts (dev, build, preview)
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── public/
│   │   ├── vite.svg
│   │   └── preloader-bg.svg
│   └── src/
│       ├── main.jsx              # Entry point
│       ├── index.css              # Global styles + Tailwind
│       ├── Router/
│       │   └── Router.jsx         # Route definitions
│       ├── layouts/
│       │   └── MainLayout.jsx     # Shared layout (Navbar, Preloader, ScrollSmoother)
│       ├── pages/
│       │   ├── Home/
│       │   │   └── Home.jsx
│       │   ├── Ventures/
│       │   │   └── Ventures.jsx
│       │   ├── GlobalTrade/
│       │   │   └── GlobalTrade.jsx
│       │   ├── Vision/
│       │   │   └── Vision.jsx
│       │   └── Contact/
│       │       └── Contact.jsx
│       ├── components/
│       │   ├── Buttons/           # AnimateBtn, Logo, ReserveBtn
│       │   ├── Footer/
│       │   ├── Gallery/
│       │   ├── Hero/
│       │   ├── Navbar/
│       │   ├── Preloader/
│       │   ├── ScrollToTop/
│       │   ├── StickyCols/
│       │   ├── Welcome/
│       │   ├── Choose/
│       │   └── Leadership/
│       ├── constants/
│       │   └── welcome.js         # Welcome & Choose section copy
│       ├── lib/
│       │   └── lenis.js
│       └── assets/                # Images, videos, SVGs
└── docs/
    ├── DEVELOPER_GUIDE.md         # This file
    └── CONTACT_FORM_INTEGRATION.md
```

---

## 4. Installation & Setup

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn**

### Steps

```bash
# 1. Clone the repository (or navigate to project root)
cd "Cristi Labs Digital Official"

# 2. Install dependencies (from project root)
npm install

# 3. Start development server
npm run dev
```

The app runs at `http://localhost:5173` (or the next available port if 5173 is in use).

### Environment Variables

Currently no `.env` file is required. For production contact form integration, you may add:

```env
VITE_CONTACT_API_URL=https://your-api.com/contact
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Access in code via `import.meta.env.VITE_*`.

---

## 5. Development Workflow

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (hot reload) |
| `npm run build` | Production build → `frontend/dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

### Adding a New Page

1. Create `frontend/src/pages/YourPage/YourPage.jsx`
2. Import and add route in `Router.jsx`:
   ```jsx
   { path: "your-page", element: <YourPage /> }
   ```
3. Add nav link in `Navbar.jsx` and `Footer.jsx`

### Preserving GSAP Animations

When creating new pages, keep:

- Same wrapper structure (`w-dvw md:h-dvh`, `rounded-[2.5rem]`)
- Same ref/class names used by ScrollTrigger
- `useGSAP` cleanup: `return () => ScrollTrigger.getAll().forEach(t => t.kill())`

---

## 6. Architecture & Routing

### Entry Flow

```
main.jsx
  → RouterProvider (router)
    → MainLayout (Outlet)
      → Home | Ventures | GlobalTrade | Vision | Contact
```

### MainLayout Responsibilities

- **PreloaderII** — Initial load animation
- **Logo** — Top-left branding
- **ReserveBtn** — "Connect" → `/contact`
- **Navbar** — Floating menu with overlay
- **ScrollSmoother** — Wraps `#smooth-wrapper` / `#smooth-content`
- **ScrollToTop** — Resets scroll on route change

### Router Configuration

```jsx
// frontend/src/Router/Router.jsx
createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "", element: <Home /> },
      { path: "ventures", element: <Ventures /> },
      { path: "global-trade", element: <GlobalTrade /> },
      { path: "vision", element: <Vision /> },
      { path: "contact", element: <Contact /> },
    ],
  },
]);
```

---

## 7. Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| **Hero** | `components/Hero/` | Hero section with video/smoke overlay |
| **Welcome** | `components/Welcome/` | Clip-path text reveal |
| **Choose** | `components/Choose/` | Core capabilities + tag pills |
| **Gallery** | `components/Gallery/` | Pinned scroll gallery |
| **StickyCols** | `components/StickyCols/` | 3-phase sticky column carousel |
| **Navbar** | `components/Navbar/` | Full-screen overlay menu |
| **Footer** | `components/Footer/` | Brand, nav links, address |
| **PreloaderII** | `components/Preloader/` | GSAP preloader |
| **ScrollToTop** | `components/ScrollToTop/` | Scroll reset on route change |

---

## 8. Animation System (GSAP)

### Plugins Used

- **ScrollTrigger** — Scroll-based animations
- **ScrollSmoother** — Smooth scroll wrapper (Club GreenSock)
- **SplitText** — Line/char splits for text reveals

### Registration

```jsx
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
```

### ScrollSmoother Setup

```jsx
ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 1.5,
  effects: true,
});
```

### ScrollTrigger Pattern

```jsx
useGSAP(() => {
  gsap.from(".target", {
    yPercent: 30,
    opacity: 0,
    scrollTrigger: {
      trigger: ".target",
      start: "top 85%",
      scrub: true,
    },
  });
  return () => ScrollTrigger.getAll().forEach(t => t.kill());
});
```

### Cleanup

Always kill ScrollTrigger instances when unmounting page components to avoid memory leaks and duplicate triggers.

---

## 9. Design System

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#181717` | Main dark bg |
| Surface | `#2a2725` | Cards, sections |
| Accent | `#b1a696` | Secondary text, borders |
| Primary text | `#f4efe7` | Headings, body |
| Electric Teal | `#14b8a6` | CTAs, success states |
| Error | `#f97316` | Validation feedback |

### Typography

- **Font**: Inter (Google Fonts)
- **Headings**: `tracking-wider`, `uppercase` for labels
- **Body**: `text-sm` to `text-xl`, `leading-relaxed`

### Breakpoints (Tailwind)

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

---

## 10. Building & Deployment

### Production Build

```bash
npm run build
```

Output: `frontend/dist/`

### Vite Config

```js
// vite.config.js
base: '/',  // Change to '/your-repo/' for GitHub Pages
```

### Deploy to GitHub Pages

1. Set `base: '/your-repo-name/'` in `vite.config.js`
2. Build: `npm run build`
3. Deploy `frontend/dist` to `gh-pages` branch or use GitHub Actions

---

## 11. Troubleshooting

### Scroll opens at bottom on navigation

- Ensure `ScrollToTop` is rendered in `MainLayout`
- Check `history.scrollRestoration = "manual"` in ScrollToTop
- Verify `smoother.scrollTo(0, false)` runs on `pathname` change

### GSAP animations not firing

- Confirm `ScrollTrigger.refresh()` after content loads
- Check that trigger elements exist in DOM when ScrollTrigger runs
- Ensure ScrollSmoother is created before page ScrollTriggers

### Build fails (spawn EPERM)

- Common on Windows with sandboxed terminals
- Run `npm run build` in a normal terminal
- Try running as Administrator if permissions are blocked

### Contact form not submitting

- See [CONTACT_FORM_INTEGRATION.md](./CONTACT_FORM_INTEGRATION.md) for API setup
- Replace `setTimeout` simulation in `handleSubmit` with real API call

---

## Quick Reference

| File | Purpose |
|------|---------|
| `main.jsx` | App entry, RouterProvider |
| `Router.jsx` | Route definitions |
| `MainLayout.jsx` | Layout, ScrollSmoother, ScrollToTop |
| `index.css` | Tailwind, custom CSS variables |
| `welcome.js` | Welcome/Choose section copy |
| `vite.config.js` | Build config, base path |

---

*Last updated: 2026 — Cristi Labs LLC*
