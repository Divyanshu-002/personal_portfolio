import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { profile } from '../data/portfolio';

export default function Footer() {
  const { theme } = useTheme();
  const year = new Date().getFullYear();

  return (
    <footer className="py-12 px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto text-center">
        <motion.p
          className="font-display text-2xl mb-2 glow-text"
          style={{ color: theme.colors.primary }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          [{profile.codename}]
        </motion.p>
        <p className="font-mono text-xs opacity-40">
          © {year} CLASSIFIED — ALL RIGHTS RESERVED — ENCRYPTION: AES-256
        </p>
        <p className="font-mono text-[10px] opacity-30 mt-2">
          Press ~ or type &quot;hack&quot; in terminal for secrets
        </p>
      </div>
    </footer>
  );
}
