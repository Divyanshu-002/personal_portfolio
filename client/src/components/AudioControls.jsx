import { motion } from 'framer-motion';
import { useAudio } from '../context/AudioContext';
import { useTheme } from '../context/ThemeContext';

export default function AudioControls() {
  const { muted, toggleMute } = useAudio();
  const { theme } = useTheme();

  return (
    <motion.button
      onClick={toggleMute}
      className="fixed bottom-4 left-4 z-40 interactive w-10 h-10 rounded-full glass flex items-center justify-center text-lg"
      style={{ color: theme.colors.primary }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.2 }}
      title={muted ? 'Unmute' : 'Mute'}
    >
      {muted ? '🔇' : '🔊'}
    </motion.button>
  );
}
