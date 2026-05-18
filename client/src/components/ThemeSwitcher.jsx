import { motion } from 'framer-motion';
import { THEMES } from '../data/themes';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import { useAchievements } from '../context/AchievementContext';
import { useEffect } from 'react';

export default function ThemeSwitcher() {
  const { themeId, setTheme, themesUsed } = useTheme();
  const { playTone } = useAudio();
  const { unlock } = useAchievements();

  useEffect(() => {
    if (themesUsed.length >= 3) unlock('theme_all');
  }, [themesUsed, unlock]);

  return (
    <motion.div
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3"
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 3, duration: 0.6 }}
    >
      {Object.values(THEMES).map((t) => (
        <button
          key={t.id}
          onClick={() => {
            setTheme(t.id);
            playTone('click');
          }}
          className={`interactive group relative w-12 h-12 rounded-lg glass flex items-center justify-center text-xl transition-all duration-300 ${
            themeId === t.id ? 'scale-110 glow-box' : 'opacity-50 hover:opacity-100'
          }`}
          style={{
            borderColor: themeId === t.id ? t.colors.primary : 'transparent',
            boxShadow: themeId === t.id ? `0 0 20px ${t.colors.glow}` : 'none',
          }}
          title={t.name}
          onMouseEnter={() => playTone('hover')}
        >
          {t.icon}
          <span className="absolute left-14 whitespace-nowrap text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity glass px-2 py-1 rounded pointer-events-none">
            {t.name}
          </span>
        </button>
      ))}
    </motion.div>
  );
}
