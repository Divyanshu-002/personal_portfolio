import { AnimatePresence, motion } from 'framer-motion';
import { useAchievements } from '../context/AchievementContext';
import { useTheme } from '../context/ThemeContext';

export default function AchievementToast() {
  const { toast } = useAchievements();
  const { theme } = useTheme();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="fixed top-24 right-4 z-[10003] glass rounded-lg p-4 max-w-xs neon-border"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          style={{ borderColor: theme.colors.accent }}
        >
          <p className="font-mono text-[10px] tracking-widest mb-1" style={{ color: theme.colors.accent }}>
            🏆 ACHIEVEMENT UNLOCKED
          </p>
          <p className="font-display text-lg" style={{ color: theme.colors.primary }}>
            {toast.name}
          </p>
          <p className="font-mono text-xs opacity-60 mt-1">{toast.desc}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
