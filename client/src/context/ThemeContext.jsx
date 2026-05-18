import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { THEMES, DEFAULT_THEME } from '../data/themes';
import api from '../utils/api';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem('portfolio-theme') || DEFAULT_THEME;
  });
  const [themesUsed, setThemesUsed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('themes-used') || '[]');
    } catch {
      return [];
    }
  });

  const theme = THEMES[themeId] || THEMES[DEFAULT_THEME];

  const setTheme = useCallback(async (id) => {
    if (!THEMES[id]) return;
    setThemeId(id);
    localStorage.setItem('portfolio-theme', id);
    setThemesUsed((prev) => {
      const next = [...new Set([...prev, id])];
      localStorage.setItem('themes-used', JSON.stringify(next));
      return next;
    });
    try {
      await api.post('/theme', { theme: id });
    } catch {
      /* offline ok */
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const c = theme.colors;
    root.style.setProperty('--color-primary', c.primary);
    root.style.setProperty('--color-secondary', c.secondary);
    root.style.setProperty('--color-accent', c.accent);
    root.style.setProperty('--color-bg', c.bg);
    root.style.setProperty('--color-bg-secondary', c.bgSecondary);
    root.style.setProperty('--color-text', c.text);
    root.style.setProperty('--color-glow', c.glow);
    root.style.setProperty('--color-glass', c.glass);
    root.style.setProperty('--particle-color', theme.particleColor);
    root.style.setProperty('--scanline-color', theme.scanline);
    document.body.style.backgroundColor = c.bg;
    document.body.style.color = c.text;
    document.body.style.cursor = theme.cursor === 'none' ? 'default' : theme.cursor;
    document.body.dataset.theme = themeId;
    document.body.dataset.font = theme.font;
  }, [theme, themeId]);

  return (
    <ThemeContext.Provider value={{ theme, themeId, setTheme, themesUsed }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
