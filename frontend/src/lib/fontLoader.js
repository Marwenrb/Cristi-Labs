import { useState, useEffect } from 'react';

/**
 * fontLoader.js — Returns a Promise that resolves when all Google Fonts are loaded.
 * Uses the CSS Font Loading API (supported in all modern browsers).
 */

const REQUIRED_FONTS = [
  { family: 'Bebas Neue', weight: '400' },
  { family: 'Sora', weight: '300' },
  { family: 'Sora', weight: '400' },
  { family: 'Sora', weight: '500' },
  { family: 'Geist Mono', weight: '400' },
  { family: 'Geist Mono', weight: '500' },
];

/**
 * @returns {Promise<void>} resolves when all required fonts are ready
 */
export const waitForFonts = () => {
  if (!document.fonts || !document.fonts.ready) {
    // Fallback for very old browsers — delay 500ms
    return new Promise((resolve) => setTimeout(resolve, 500));
  }

  const fontPromises = REQUIRED_FONTS.map(({ family, weight }) =>
    document.fonts.load(`${weight} 16px "${family}"`).catch(() => {})
  );

  return Promise.all([document.fonts.ready, ...fontPromises]);
};

/**
 * React hook — returns true when all fonts are ready
 */
export const useFontsLoaded = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    waitForFonts().then(() => setFontsLoaded(true));
  }, []);

  return fontsLoaded;
};
