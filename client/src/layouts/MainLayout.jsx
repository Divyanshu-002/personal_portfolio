import { Outlet } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ParticleField from '../components/ParticleField';
import CustomCursor from '../components/CustomCursor';
import ScanlineOverlay from '../components/ScanlineOverlay';
import AudioControls from '../components/AudioControls';
import ThemeSwitcher from '../components/ThemeSwitcher';
import AIAssistant from '../components/AIAssistant';
import HackerTerminal from '../components/HackerTerminal';
import { useKonami } from '../hooks/useKonami';
import { useAchievements } from '../context/AchievementContext';
import { useTheme } from '../context/ThemeContext';
import { useAnalytics } from '../hooks/useAnalytics';

export default function MainLayout() {
  useAnalytics();
  const [terminalOpen, setTerminalOpen] = useState(false);
  const { unlock } = useAchievements();
  const { themesUsed } = useTheme();

  useKonami(useCallback(() => {
    unlock('konami');
    window.location.href = '/vault';
  }, [unlock]));

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '`' || e.key === '~') {
        setTerminalOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleTerminal = useCallback(() => {
    setTerminalOpen((o) => !o);
    if (!terminalOpen) unlock('terminal');
  }, [terminalOpen, unlock]);

  return (
    <div className="relative min-h-screen scanlines">
      <ParticleField />
      <CustomCursor />
      <ScanlineOverlay />
      <Navbar onTerminalToggle={toggleTerminal} />
      <main>
        <Outlet context={{ themesUsed }} />
      </main>
      <ThemeSwitcher />
      <AudioControls />
      <AIAssistant />
      <HackerTerminal open={terminalOpen} onClose={() => setTerminalOpen(false)} />
    </div>
  );
}
