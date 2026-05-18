import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AudioProvider } from './context/AudioContext';
import { AchievementProvider } from './context/AchievementContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import SecretPage from './pages/SecretPage';
import HackPage from './pages/HackPage';
import IntroOverlay from './components/IntroOverlay';
import AchievementToast from './components/AchievementToast';

export default function App() {
  return (
    <ThemeProvider>
      <AudioProvider>
        <AchievementProvider>
          <IntroOverlay />
          <AchievementToast />
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="vault" element={<SecretPage />} />
              <Route path="breach" element={<HackPage />} />
            </Route>
          </Routes>
        </AchievementProvider>
      </AudioProvider>
    </ThemeProvider>
  );
}
