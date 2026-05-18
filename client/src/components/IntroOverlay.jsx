import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';

const bootLines = [
  '> INITIALIZING PHANTOM OS v7.7.7...',
  '> LOADING NEURAL INTERFACE...',
  '> DECRYPTING CLASSIFIED FILES...',
  '> BYPASSING FIREWALL... [OK]',
  '> ESTABLISHING SECURE CONNECTION...',
  '> WELCOME, OPERATIVE.',
];

export default function IntroOverlay() {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem('intro-seen'));
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  const { theme } = useTheme();
  const { playTone, speak } = useAudio();

  useEffect(() => {
    if (!visible) return;

    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLines.length) {
        setLines((prev) => [...prev, bootLines[i]]);
        playTone('type');
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.8,
            onComplete: () => {
              setVisible(false);
              sessionStorage.setItem('intro-seen', '1');
              speak('Systems online. Welcome operative.');
            },
          });
        }, 600);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [visible, playTone, speak]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-[10001] flex items-center justify-center"
          style={{ background: theme.colors.bg }}
          initial={{ opacity: 1 }}
        >
          <motion.div className="max-w-lg w-full px-8 font-mono text-sm">
            <motion.p
              className="text-2xl font-display mb-8 glow-text text-center"
              style={{ color: theme.colors.primary }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              CLASSIFIED ACCESS
            </motion.p>
            {lines.map((line, idx) => (
              <motion.p
                key={idx}
                className="mb-1"
                style={{ color: theme.colors.primary }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {line}
              </motion.p>
            ))}
            <span className="typing-cursor" style={{ color: theme.colors.primary }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
