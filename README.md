<div align="center">

<br />

```
CRISTI LABS LLC
```

# Cristi Labs — Official Corporate Website

**A cinematic, scroll-driven digital experience for a venture studio operating at the
intersection of global trade infrastructure and immersive digital technology.**

<br />

[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![GSAP](https://img.shields.io/badge/GSAP-3.13-88CE02?style=flat-square&logo=greensock&logoColor=white)](https://gsap.com)
[![License](https://img.shields.io/badge/License-Proprietary-B8924A?style=flat-square)](#license)

<br />

> *"Code the Impossible. Trade the World."*

</div>

---

## About

This repository contains the full source code for the official **Cristi Labs LLC** corporate website — a GPU-accelerated, fully responsive web experience engineered to reflect the brand's position at the intersection of Silicon Valley engineering and global commerce infrastructure.

Built entirely from first principles — no templates, no UI kits — the site delivers:

- **Cinematic visual storytelling** across six distinct pages with parallax and depth effects
- **GSAP ScrollTrigger animations** — scroll-synced reveals, marquee sliders, and sticky feature columns
- **Fully responsive layout** — adaptive mobile gallery with marquee and card components
- **Custom design token system** — antique gold accent palette, Bebas Neue / Sora / Geist Mono typography
- **Smooth inertial scrolling** via Lenis, with scroll-position-aware navbar
- **Contact form** ready for EmailJS / Formspree / custom API integration

**Entity:** Cristi Labs LLC · Wyoming Limited Liability Company  
**EIN:** 37-2221468 · **File No.:** 2026-001890716  
**Website:** [cristilabs.net](https://cristilabs.net)

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — Hero, Welcome manifesto, Capabilities, Gallery, Sticky features |
| `/ventures` | Five autonomous venture divisions |
| `/global-trade` | International logistics and digital trade infrastructure |
| `/vision` | Corporate philosophy, foundational pillars, leadership |
| `/contact` | Corporate access with animated form |

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | React | 19.1.0 |
| Build Tool | Vite | 6.3.5 |
| Styling | Tailwind CSS | 4.1.8 |
| Animation | GSAP — ScrollTrigger, ScrollSmoother, SplitText | 3.13.0 |
| Smooth Scroll | @studio-freight/lenis | 1.0.42 |
| Routing | React Router DOM | 7.6.1 |
| Icons | React Icons | 5.5.0 |

---

## Design System

The site is built on a custom design token system — no third-party component library.

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-void` | `#0B0B0B` | Site background |
| `--accent` | `#B8924A` | Antique gold — CTAs, labels, borders |
| `--text-primary` | `#EDEAE4` | Headings, primary content |
| `--text-secondary` | `#7A7670` | Body copy, descriptions |
| `--font-display` | Bebas Neue | All headlines |
| `--font-body` | Sora | Body text |
| `--font-mono` | Geist Mono | Labels, metadata, code |

---

## Quick Start

```bash
# Navigate to project root
cd "Cristi Labs Digital Official"

# Install dependencies
cd frontend && npm install

# Start development server
npm run dev
```

Development server: [http://localhost:5173](http://localhost:5173)

---

## Project Structure

```
Cristi Labs Digital Official/
├── docs/
│   ├── DEVELOPER_GUIDE.md
│   └── CONTACT_FORM_INTEGRATION.md
└── frontend/
    └── src/
        ├── main.jsx
        ├── index.css              # Design tokens & global styles
        ├── Router/Router.jsx
        ├── layouts/MainLayout.jsx
        ├── pages/                 # Home, Ventures, GlobalTrade, Vision, Contact
        ├── components/            # Hero, Gallery, Navbar, StickyCols, ScrollReturn...
        ├── constants/             # Section copy & content
        └── assets/                # Video, images, SVG
```

---

## Scripts

```bash
npm run dev       # Development server with HMR
npm run build     # Production build → frontend/dist/
npm run preview   # Preview production build
npm run lint      # ESLint
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [`DEVELOPER_GUIDE.md`](./docs/DEVELOPER_GUIDE.md) | Full architecture, setup, and GSAP patterns |
| [`CONTACT_FORM_INTEGRATION.md`](./docs/CONTACT_FORM_INTEGRATION.md) | EmailJS / Formspree / custom API integration |

---

## Developer

<br />

<div align="center">

<table>
  <tr>
    <td align="center" style="padding: 24px 48px;">
      <br />
      <strong style="font-size: 18px;">Marwen Rabai</strong>
      <br /><br />
      <em>Founder &amp; Lead Engineer — Cristi Labs LLC</em>
      <br /><br />
      Full-stack engineer and product builder specializing in high-performance
      React applications, GSAP animation systems, and production-grade
      digital experiences.
      <br /><br />
      <a href="https://marwen-rabai.netlify.app/" target="_blank">
        <strong>→ marwen-rabai.netlify.app</strong>
      </a>
      <br /><br />
    </td>
  </tr>
</table>

</div>

<br />

---

## License

This project is **proprietary software** owned exclusively by Cristi Labs LLC.  
All rights reserved. Unauthorized reproduction, distribution, or modification
is strictly prohibited without written consent from Cristi Labs LLC.

---

<div align="center">

<br />

**CRISTI LABS LLC**

30 N Gould St, Suite R · Sheridan, WY 82801 · United States  
[cristilabs.net](https://cristilabs.net) · +1 (681) 677-2084

<br />

*© 2026 Cristi Labs LLC. All Rights Reserved.*

<br />

*Designed & engineered by [Marwen Rabai](https://marwen-rabai.netlify.app/)*

<br />

</div>

## Overview

This repository contains the source code for the official Cristi Labs corporate website — a cinematic, high-performance web experience built to reflect the brand's position at the convergence of Silicon Valley innovation and global commerce infrastructure.

**Live Sections:**
- **Home** — Hero with cinematic video, Welcome manifesto, Capability pillars, Gallery showcase, Sticky column features
- **Ventures** — Five autonomous venture divisions
- **Global Trade** — Logistics, digital twin assets, operational reach
- **Vision** — Corporate philosophy, foundational pillars, leadership
- **Contact** — Corporate access with animated form and live HQ clock

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.1.0 |
| Build Tool | Vite | 6.3.5 |
| Styling | Tailwind CSS | 4.1.8 |
| Animation | GSAP (ScrollTrigger, ScrollSmoother, SplitText) | 3.13.0 |
| Animation Hooks | @gsap/react | 2.1.2 |
| Smooth Scroll | @studio-freight/lenis | 1.0.42 |
| Routing | React Router | 7.6.1 |
| Icons | React Icons | 5.5.0 |

---

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd "Cristi Labs Digital Official"

# Install dependencies
cd frontend
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR (accessible on local network via `--host`) |
| `npm run build` | Production build with Vite — outputs to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint across the codebase |

---

## Project Architecture

```
Cristi Labs Digital Official/
├── docs/
│   ├── DEVELOPER_GUIDE.md              # Full architecture & setup reference
│   └── CONTACT_FORM_INTEGRATION.md     # Contact form API integration guide
│
└── frontend/
    ├── public/
    │   ├── preloader-bg.svg            # Brand logo mask for preloader
    │   └── vite.svg
    │
    └── src/
        ├── main.jsx                    # Application entry point
        ├── index.css                   # Global styles & section-specific CSS
        │
        ├── Router/
        │   └── Router.jsx              # Route definitions
        │
        ├── layouts/
        │   └── MainLayout.jsx          # Navbar, Preloader, ScrollSmoother wrapper
        │
        ├── pages/
        │   ├── Home/Home.jsx           # Landing — Hero, Welcome, Choose, Gallery, StickyCols
        │   ├── Ventures/Ventures.jsx   # Five venture divisions showcase
        │   ├── GlobalTrade/GlobalTrade.jsx  # Trade operations & digital twin
        │   ├── Vision/Vision.jsx       # Manifesto, pillars, leadership
        │   └── Contact/Contact.jsx     # Corporate contact with animated form
        │
        ├── components/
        │   ├── Hero/                   # Cinematic hero with video background
        │   ├── Welcome/                # Scroll-driven text reveal section
        │   ├── Choose/                 # Capability pillars with clip-path animation
        │   ├── Gallery/                # Pinned gallery with scroll transitions
        │   ├── StickyCols/             # Multi-phase sticky column showcase
        │   ├── Navbar/                 # Full-screen overlay navigation
        │   ├── Footer/                 # Corporate footer
        │   ├── Leadership/             # Founder section
        │   ├── Preloader/              # Brand-masked loading screen
        │   ├── Buttons/                # AnimateBtn, Logo, ReserveBtn
        │   ├── Cards/                  # Card components
        │   └── ScrollToTop/            # Route-change scroll reset
        │
        ├── assets/
        │   ├── favicon.ico
        │   └── Medias/
        │       ├── hero/               # Hero video, background, poster frame
        │       ├── gallery/            # Gallery section backgrounds
        │       ├── sticky/             # Sticky column visuals
        │       └── welcome/            # Welcome section imagery
        │
        ├── constants/
        │   └── welcome.js             # Welcome & Choose section copy
        │
        └── lib/
            └── lenis.js               # Lenis smooth scroll configuration
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [**DEVELOPER_GUIDE.md**](./docs/DEVELOPER_GUIDE.md) | Complete project overview, architecture breakdown, development setup, and troubleshooting |
| [**CONTACT_FORM_INTEGRATION.md**](./docs/CONTACT_FORM_INTEGRATION.md) | Step-by-step guide to connect the contact form to EmailJS, Formspree, or a custom backend API |

---

## Key Features

- **Cinematic Hero** — Full-bleed video background with poster frame, parallax scroll, and responsive mobile fallback
- **GSAP-Powered Animations** — ScrollTrigger-driven text reveals, pinned galleries, sticky column transitions, and clip-path effects
- **Buttery Smooth Scroll** — Lenis-powered smooth scrolling integrated with GSAP ScrollSmoother
- **Animated Contact Form** — Floating label inputs, magnetic submit button, GSAP shake validation, and success state transitions
- **Full-Screen Navigation** — Overlay menu with route-aware active states
- **Brand-Masked Preloader** — SVG logo mask with progress bar animation
- **Responsive Design** — Adaptive layouts across mobile, tablet, and desktop breakpoints via `react-responsive`
- **Vite Asset Pipeline** — All media imported via ES modules for automatic hashing, optimization, and cache-busting

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | Latest 2 versions |
| Firefox | Latest 2 versions |
| Safari | Latest 2 versions |
| Edge | Latest 2 versions |

---

## Developer

<table>
  <tr>
    <td align="center">
      <strong>Marouan Rabai</strong>
      <br />
      Founder & CEO — Cristi Labs LLC
      <br />
      <a href="https://marwen-rabai.netlify.app/">Portfolio</a>
    </td>
  </tr>
</table>

---

## License

This project is **proprietary software** owned by Cristi Labs LLC. All rights reserved.
Unauthorized reproduction, distribution, or modification is strictly prohibited.

---

<div align="center">

**Cristi Labs LLC**
30 N Gould St, Ste R, Sheridan, WY 82801, United States

© 2026 Cristi Labs LLC. All Rights Reserved.

</div>
