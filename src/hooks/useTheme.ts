/**
 * Theme Management React Hook
 * 
 * Manages Light/Dark theme state, synchronizes with `localStorage` ('aether_theme'),
 * and applies or removes the `.dark` class on the root HTML document element.
 */

import { useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark';

/**
 * Hook for controlling application-wide Light/Dark mode.
 *
 * @returns Object containing current `theme` mode and `toggleTheme` function
 */
export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const cached = window.localStorage.getItem('aether_theme');
    return cached === 'dark' || cached === 'light' ? cached : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.localStorage.setItem('aether_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return {
    theme,
    toggleTheme,
    setTheme
  };
}
