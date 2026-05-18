import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const AudioContext = createContext(null);

const SOUNDS = {
  hover: { freq: 800, duration: 0.05, type: 'sine' },
  click: { freq: 1200, duration: 0.08, type: 'square' },
  type: { freq: 600, duration: 0.03, type: 'triangle' },
  success: { freq: 523, duration: 0.15, type: 'sine' },
  alert: { freq: 200, duration: 0.2, type: 'sawtooth' },
  ambient: null,
};

export function AudioProvider({ children }) {
  const [muted, setMuted] = useState(() => localStorage.getItem('audio-muted') === 'true');
  const ctxRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('audio-muted', String(muted));
  }, [muted]);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return ctxRef.current;
  }, []);

  const playTone = useCallback(
    (name) => {
      if (muted) return;
      const config = SOUNDS[name];
      if (!config) return;
      try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = config.type;
        osc.frequency.setValueAtTime(config.freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + config.duration);
      } catch {
        /* audio blocked */
      }
    },
    [muted, getCtx]
  );

  const speak = useCallback(
    (text, options = {}) => {
      if (muted || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 1.05;
      utterance.pitch = options.pitch || 1.2;
      utterance.volume = options.volume || 0.9;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) => v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha')
      );
      if (preferred) utterance.voice = preferred;
      window.speechSynthesis.speak(utterance);
    },
    [muted]
  );

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  return (
    <AudioContext.Provider value={{ muted, toggleMute, playTone, speak }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
};
