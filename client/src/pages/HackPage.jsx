import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import { useAchievements } from '../context/AchievementContext';

const HACK_LINES = [
  'Bypassing firewall...',
  'Injecting payload...',
  'Decrypting AES-256 keys...',
  'Accessing mainframe...',
  'Downloading classified data...',
  'Covering tracks...',
  'BREACH COMPLETE.',
];

export default function HackPage() {
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const { theme } = useTheme();
  const { playTone, speak } = useAudio();
  const { unlock } = useAchievements();

  useEffect(() => {
    unlock('hack_mode');
    speak('Initiating breach protocol. Do not disconnect.');

    let i = 0;
    const interval = setInterval(() => {
      if (i < HACK_LINES.length) {
        setLines((prev) => [...prev, HACK_LINES[i]]);
        setProgress(((i + 1) / HACK_LINES.length) * 100);
        playTone('type');
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
        playTone('success');
        speak('Breach successful. You are now inside the mainframe.');
      }
    }, 800);

    return () => clearInterval(interval);
  }, [unlock, playTone, speak]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 crt-flicker">
      <div className="max-w-2xl w-full font-mono">
        <p className="text-green-400 text-xs mb-4 animate-pulse">
          ⚠ FAKE HACK MODE — FOR ENTERTAINMENT ONLY ⚠
        </p>

        <div className="border border-green-500/50 rounded-lg p-6 bg-black/90">
          <p className="text-green-500 mb-4 text-lg terminal-text">
            &gt;&gt; BREACH PROTOCOL ACTIVE
          </p>

          {lines.map((line, idx) => (
            <motion.p
              key={idx}
              className="text-green-400 text-sm mb-1 hack-line"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              [{new Date().toLocaleTimeString()}] {line}
            </motion.p>
          ))}

          <div className="mt-6 h-2 bg-green-900/30 rounded overflow-hidden">
            <motion.div
              className="h-full bg-green-500"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-green-600 text-xs mt-2">{Math.round(progress)}%</p>
        </div>

        {done && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-green-400 mb-4 text-xl glow-text">ACCESS GRANTED</p>
            <Link
              to="/"
              className="text-green-500 border border-green-500 px-6 py-2 rounded inline-block hover:bg-green-500/10"
            >
              EXIT MAINFRAME
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
