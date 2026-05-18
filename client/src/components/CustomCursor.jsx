import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function CustomCursor() {
  const { theme } = useTheme();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const show = theme.cursor === 'none';

  useEffect(() => {
    if (!show) return;

    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e) => {
      const t = e.target;
      setHovering(
        t.closest('a, button, [role="button"], input, textarea, .interactive') !== null
      );
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
    };
  }, [show]);

  if (!show) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[10000] mix-blend-difference"
        style={{
          background: theme.colors.primary,
          boxShadow: `0 0 20px ${theme.colors.primary}`,
        }}
        animate={{
          x: pos.x - 8,
          y: pos.y - 8,
          scale: hovering ? 2 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border rounded-full pointer-events-none z-[9999]"
        style={{ borderColor: theme.colors.secondary }}
        animate={{
          x: pos.x - 16,
          y: pos.y - 16,
          scale: hovering ? 1.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      />
    </>
  );
}
