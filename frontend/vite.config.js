import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/',

  plugins: [
    tailwindcss(),
    react(),
  ],

  build: {
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    assetsInlineLimit: 4096,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/gsap')) return 'gsap';
          if (id.includes('node_modules/react-dom')) return 'react-dom';
          if (id.includes('node_modules/react/') || id.includes('react-is')) return 'react-core';
          if (id.includes('react-router') || id.includes('@remix-run')) return 'router';
          if (id.includes('react-icons')) return 'icons';
          if (id.includes('@gsap/react')) return 'gsap-react';
          if (id.includes('@studio-freight/lenis') || id.includes('node_modules/lenis')) return 'lenis';
          if (id.includes('react-responsive')) return 'react-responsive';
        },
        assetFileNames: 'assets/[ext]/[name]-[hash][extname]',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },

  optimizeDeps: {
    include: [
      'gsap',
      'gsap/ScrollTrigger',
      'gsap/ScrollSmoother',
      'gsap/SplitText',
    ],
  },

  envPrefix: 'VITE_',
});
