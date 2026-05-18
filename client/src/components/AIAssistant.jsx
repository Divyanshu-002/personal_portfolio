import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import { useAchievements } from '../context/AchievementContext';
import { useVoiceCommand } from '../hooks/useVoiceCommand';
import { assistantLines } from '../data/portfolio';
import api from '../utils/api';

const CLICK_THRESHOLD = 5;
const CLICK_WINDOW = 2000;

export default function AIAssistant() {
  const { theme } = useTheme();
  const { speak, playTone, muted } = useAudio();
  const { unlock } = useAchievements();
  const [subtitle, setSubtitle] = useState('');
  const [mood, setMood] = useState('idle');
  const [blinking, setBlinking] = useState(false);
  const [listening, setListening] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const clickTimes = useRef([]);
  const containerRef = useRef(null);

  const pickLine = (pool) => pool[Math.floor(Math.random() * pool.length)];

  const say = useCallback(
    (text, angry = false) => {
      setSubtitle(text);
      if (!muted) speak(text, { pitch: angry ? 0.8 : 1.3, rate: angry ? 1.3 : 1.05 });
      setTimeout(() => setSubtitle(''), 5000);
    },
    [speak, muted]
  );

  const handleClick = async () => {
    playTone('click');
    const now = Date.now();
    clickTimes.current = clickTimes.current.filter((t) => now - t < CLICK_WINDOW);
    clickTimes.current.push(now);

    if (clickTimes.current.length >= CLICK_THRESHOLD) {
      setMood('angry');
      unlock('assistant_angry');
      say(pickLine(assistantLines.angry), true);
      setTimeout(() => setMood('idle'), 3000);
      clickTimes.current = [];
      return;
    }

    const line = pickLine(assistantLines.click);
    setMood('happy');
    say(line);
    setTimeout(() => setMood('idle'), 2000);

    try {
      const res = await api.post('/assistant', { message: line });
      if (res.data?.response) say(res.data.response);
    } catch {
      /* local fallback ok */
    }
  };

  const explainSection = useCallback(
    (sectionId) => {
      const text = assistantLines.sections[sectionId];
      if (text) say(text);
    },
    [say]
  );

  const handleVoiceCommand = useCallback(
    (transcript) => {
      unlock('voice');
      setListening(false);
      say(`Command received: ${transcript}`);

      if (transcript.includes('project') || transcript.includes('mission')) {
        document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
        explainSection('projects');
      } else if (transcript.includes('skill')) {
        document.querySelector('#skills')?.scrollIntoView({ behavior: 'smooth' });
        explainSection('skills');
      } else if (transcript.includes('contact')) {
        document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
        explainSection('contact');
      } else if (transcript.includes('about')) {
        document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
        explainSection('about');
      } else if (transcript.includes('home') || transcript.includes('hero')) {
        document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' });
        explainSection('hero');
      }
    },
    [say, explainSection, unlock]
  );

  const { listening: voiceActive, start: startVoice } = useVoiceCommand(handleVoiceCommand);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const idleInterval = setInterval(() => {
      if (mood === 'idle' && !subtitle) {
        say(pickLine(assistantLines.idle));
      }
    }, 30000);
    return () => clearInterval(idleInterval);
  }, [mood, subtitle, say]);

  useEffect(() => {
    const explained = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (assistantLines.sections[id] && !explained.has(id)) {
              explained.add(id);
              explainSection(id);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    ['hero', 'about', 'projects', 'skills', 'contact'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [explainSection]);

  useEffect(() => {
    const handleMouse = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setMouseOffset({
        x: (e.clientX - cx) / 50,
        y: (e.clientY - cy) / 50,
      });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const moodScale = mood === 'angry' ? 1.1 : mood === 'happy' ? 1.05 : 1;
  const moodColor = mood === 'angry' ? '#ff0044' : theme.colors.primary;

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {subtitle && (
          <motion.div
            className="glass rounded-lg px-4 py-2 max-w-xs font-mono text-xs hologram"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            style={{ borderColor: moodColor, color: theme.colors.text }}
          >
            <span className="opacity-50">AI:</span> {subtitle}
            <span className="typing-cursor ml-1" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2">
        <button
          onClick={() => {
            setListening(true);
            startVoice();
            playTone('click');
          }}
          className={`interactive w-8 h-8 rounded-full glass text-xs flex items-center justify-center ${
            voiceActive || listening ? 'animate-pulse' : ''
          }`}
          style={{ color: theme.colors.secondary }}
          title="Voice command"
        >
          🎤
        </button>

        <motion.button
          onClick={handleClick}
          className="interactive relative group"
          animate={{
            y: [0, -8, 0],
            scale: moodScale,
          }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: 0.2 },
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          style={{ transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)` }}
          onMouseEnter={() => playTone('hover')}
        >
          {/* Holographic glow */}
          <div
            className="absolute -inset-4 rounded-full opacity-40 blur-xl animate-pulse"
            style={{ background: moodColor }}
          />

          {/* Anime-style AI character (SVG) */}
          <svg
            width="100"
            height="120"
            viewBox="0 0 100 120"
            className="relative z-10 drop-shadow-lg"
          >
            {/* Hologram scan lines */}
            <defs>
              <linearGradient id="holoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={theme.colors.primary} stopOpacity="0.8" />
                <stop offset="50%" stopColor={theme.colors.secondary} stopOpacity="0.6" />
                <stop offset="100%" stopColor={theme.colors.primary} stopOpacity="0.8" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Body glow */}
            <ellipse cx="50" cy="95" rx="25" ry="8" fill={moodColor} opacity="0.3" />

            {/* Hair */}
            <path
              d="M25 45 Q50 15 75 45 Q80 60 70 70 Q50 55 30 70 Q20 60 25 45"
              fill="url(#holoGrad)"
              filter="url(#glow)"
            />

            {/* Face */}
            <ellipse cx="50" cy="55" rx="22" ry="25" fill="#1a1a2e" stroke={moodColor} strokeWidth="1.5" />

            {/* Eyes */}
            {!blinking ? (
              <>
                <ellipse cx="40" cy="52" rx="5" ry="6" fill={moodColor} />
                <ellipse cx="60" cy="52" rx="5" ry="6" fill={moodColor} />
                <circle cx="41" cy="50" r="2" fill="#fff" />
                <circle cx="61" cy="50" r="2" fill="#fff" />
              </>
            ) : (
              <>
                <line x1="35" y1="52" x2="45" y2="52" stroke={moodColor} strokeWidth="2" />
                <line x1="55" y1="52" x2="65" y2="52" stroke={moodColor} strokeWidth="2" />
              </>
            )}

            {/* Blush */}
            <circle cx="32" cy="60" r="4" fill={theme.colors.secondary} opacity="0.4" />
            <circle cx="68" cy="60" r="4" fill={theme.colors.secondary} opacity="0.4" />

            {/* Mouth */}
            {mood === 'angry' ? (
              <path d="M42 68 Q50 62 58 68" stroke="#ff0044" strokeWidth="2" fill="none" />
            ) : mood === 'happy' ? (
              <path d="M40 65 Q50 75 60 65" stroke={moodColor} strokeWidth="2" fill="none" />
            ) : (
              <line x1="44" y1="68" x2="56" y2="68" stroke={moodColor} strokeWidth="1.5" />
            )}

            {/* Headset */}
            <path d="M22 50 Q15 55 18 65" stroke={moodColor} strokeWidth="2" fill="none" />
            <path d="M78 50 Q85 55 82 65" stroke={moodColor} strokeWidth="2" fill="none" />
            <rect x="16" y="62" width="6" height="10" rx="2" fill={moodColor} opacity="0.8" />
            <rect x="78" y="62" width="6" height="10" rx="2" fill={moodColor} opacity="0.8" />

            {/* Torso */}
            <path
              d="M30 80 Q50 75 70 80 L65 110 Q50 115 35 110 Z"
              fill="url(#holoGrad)"
              opacity="0.7"
              filter="url(#glow)"
            />

            {/* Breathing indicator */}
            <circle cx="50" cy="90" r="3" fill={moodColor} className="animate-pulse-glow" />
          </svg>

          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 animate-pulse" />
        </motion.button>
      </div>
    </div>
  );
}
