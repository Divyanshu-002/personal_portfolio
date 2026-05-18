import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import { useAchievements } from '../context/AchievementContext';
import { achievements } from '../data/portfolio';

export default function SecretPage() {
  const { theme } = useTheme();
  const { speak, playTone } = useAudio();
  const { unlocked } = useAchievements();

  useEffect(() => {
    speak('Welcome to the vault. You have discovered classified secrets.');
    playTone('success');
  }, [speak, playTone]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: theme.colors.bg }}
    >
      <motion.div
        className="max-w-2xl w-full glass rounded-2xl p-8 neon-border text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <p className="font-mono text-sm tracking-widest mb-4" style={{ color: theme.colors.secondary }}>
          // SECRET VAULT — UNAUTHORIZED ACCESS LOGGED
        </p>
        <h1 className="font-display text-5xl mb-6 glow-text" style={{ color: theme.colors.primary }}>
          THE VAULT
        </h1>
        <p className="opacity-70 mb-8 font-mono text-sm">
          You found the hidden chamber. Only true operatives reach this point.
        </p>

        <div className="grid gap-3 mb-8 text-left">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`flex justify-between items-center p-3 rounded-lg border ${
                unlocked.includes(ach.id) ? 'opacity-100' : 'opacity-30'
              }`}
              style={{ borderColor: `${theme.colors.primary}33` }}
            >
              <div>
                <p className="font-display" style={{ color: theme.colors.primary }}>
                  {ach.secret && !unlocked.includes(ach.id) ? '???' : ach.name}
                </p>
                <p className="font-mono text-xs opacity-50">
                  {ach.secret && !unlocked.includes(ach.id) ? 'Hidden achievement' : ach.desc}
                </p>
              </div>
              <span>{unlocked.includes(ach.id) ? '✓' : '🔒'}</span>
            </div>
          ))}
        </div>

        <Link
          to="/"
          className="interactive inline-block font-mono text-sm px-6 py-3 border rounded-lg"
          style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}
        >
          ← RETURN TO BASE
        </Link>
      </motion.div>
    </div>
  );
}
