import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function ScanlineOverlay() {
  const { theme } = useTheme();

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[9997] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div
        className="absolute w-full h-32 opacity-10"
        style={{
          background: `linear-gradient(transparent, ${theme.colors.primary}22, transparent)`,
        }}
        animate={{ y: ['-20%', '120%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  );
}
