import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    tailwindcss(),
    react(),
  ],
  optimizeDeps: {
    include: ['gsap', 'gsap/ScrollTrigger', 'gsap/ScrollSmoother', 'gsap/SplitText'],
  },
  build: {
    // Target modern browsers — smaller output, no legacy polyfills
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true,
    // Raise warning threshold — GSAP is intentionally large
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split large deps into individually-cacheable chunks
        manualChunks(id) {
          if (id.includes('node_modules/gsap')) return 'gsap';
          if (id.includes('node_modules/react-dom')) return 'react-dom';
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-is')) return 'react-core';
          if (
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/@remix-run')
          ) return 'router';
          if (id.includes('node_modules/react-icons')) return 'icons';
          if (id.includes('node_modules/@gsap')) return 'gsap-react';
          if (id.includes('node_modules/react-responsive')) return 'react-responsive';
          if (id.includes('node_modules/@studio-freight/lenis') || id.includes('node_modules/lenis')) return 'lenis';
        },
        // Consistent naming for long-term HTTP cache control
        assetFileNames: 'assets/[ext]/[name]-[hash][extname]',
        chunkFileNames:  'assets/js/[name]-[hash].js',
        entryFileNames:  'assets/js/[name]-[hash].js',
      },
    },
  },
  // Prevent accidental exposure of .env vars (only VITE_ prefix is exposed)
  envPrefix: 'VITE_',
});
