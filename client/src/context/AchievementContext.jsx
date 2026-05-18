import { createContext, useContext, useState, useCallback } from 'react';
import { achievements } from '../data/portfolio';

const AchievementContext = createContext(null);

export function AchievementProvider({ children }) {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('achievements') || '[]');
    } catch {
      return [];
    }
  });
  const [toast, setToast] = useState(null);

  const unlock = useCallback((id) => {
    setUnlocked((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem('achievements', JSON.stringify(next));
      const ach = achievements.find((a) => a.id === id);
      if (ach) {
        setToast(ach);
        setTimeout(() => setToast(null), 4000);
      }
      return next;
    });
  }, []);

  return (
    <AchievementContext.Provider value={{ unlocked, unlock, toast }}>
      {children}
    </AchievementContext.Provider>
  );
}

export const useAchievements = () => {
  const ctx = useContext(AchievementContext);
  if (!ctx) throw new Error('useAchievements must be used within AchievementProvider');
  return ctx;
};
