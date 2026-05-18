import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import { profile } from '../data/portfolio';

const links = [
  { href: '#hero', label: 'Command' },
  { href: '#about', label: 'Identity' },
  { href: '#projects', label: 'Missions' },
  { href: '#skills', label: 'Arsenal' },
  { href: '#contact', label: 'Transmit' },
];

export default function Navbar({ onTerminalToggle }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useTheme();
  const { playTone } = useAudio();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
    playTone('click');
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass py-3' : 'py-5 bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ delay: 2.5, duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <button
          onClick={() => scrollTo('#hero')}
          className="interactive font-display text-lg tracking-widest glow-text"
          style={{ color: theme.colors.primary }}
          onMouseEnter={() => playTone('hover')}
        >
          [{profile.codename}]
        </button>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="interactive font-mono text-sm uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity"
              style={{ color: theme.colors.text }}
              onMouseEnter={() => playTone('hover')}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={onTerminalToggle}
            className="interactive font-mono text-xs px-3 py-1 border rounded"
            style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}
            onMouseEnter={() => playTone('hover')}
          >
            &gt; TERMINAL_
          </button>
        </div>

        <button
          className="md:hidden interactive text-2xl"
          style={{ color: theme.colors.primary }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden glass mt-2 mx-4 p-4 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {links.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="block w-full text-left py-3 font-mono uppercase"
              >
                {link.label}
              </button>
            ))}
            <button onClick={onTerminalToggle} className="block w-full text-left py-3 font-mono text-green-400">
              &gt; TERMINAL_
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
