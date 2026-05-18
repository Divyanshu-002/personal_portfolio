import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import { useMouseSpotlight } from '../hooks/useMouseSpotlight';
import { profile } from '../data/portfolio';

export default function Hero() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const { theme } = useTheme();
  const { playTone } = useAudio();
  useMouseSpotlight(sectionRef);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-char', {
        y: 120,
        opacity: 0,
        rotateX: -90,
        stagger: 0.04,
        duration: 1.2,
        ease: 'power4.out',
        delay: 2.8,
      });
      gsap.from('.hero-sub', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 3.8,
        ease: 'power3.out',
      });
      gsap.from('.hero-cta', {
        opacity: 0,
        scale: 0.8,
        stagger: 0.15,
        duration: 0.6,
        delay: 4.2,
        ease: 'back.out(1.7)',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    playTone('click');
  };

  const nameChars = profile.name.split('');

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden spotlight"
    >
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse at center, ${theme.colors.primary}33 0%, transparent 70%)`,
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.p
          className="hero-sub font-mono text-sm tracking-[0.5em] uppercase mb-4"
          style={{ color: theme.colors.secondary }}
        >
          // CLASSIFIED OPERATIVE FILE
        </motion.p>

        <h1
          ref={titleRef}
          className="font-theme font-display text-6xl sm:text-8xl md:text-9xl font-black mb-6 perspective-1000"
          style={{ color: theme.colors.text }}
        >
          {nameChars.map((char, i) => (
            <span
              key={i}
              className="hero-char inline-block glow-text"
              style={{
                color: i % 2 === 0 ? theme.colors.primary : theme.colors.text,
                textShadow: `0 0 30px ${theme.colors.glow}`,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        <p
          className="hero-sub font-mono text-lg md:text-xl mb-2"
          style={{ color: theme.colors.accent }}
        >
          [{profile.codename}] — {profile.title}
        </p>

        <p className="hero-sub text-lg md:text-2xl opacity-70 mb-12 max-w-2xl mx-auto font-body">
          {profile.tagline}
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => scrollTo('#projects')}
            className="hero-cta interactive neon-border px-8 py-4 font-display tracking-widest uppercase text-sm rounded glass glow-box transition-transform hover:scale-105"
            style={{ color: theme.colors.primary, borderColor: theme.colors.primary }}
            onMouseEnter={() => playTone('hover')}
          >
            View Missions
          </button>
          <button
            onClick={() => scrollTo('#contact')}
            className="hero-cta interactive px-8 py-4 font-display tracking-widest uppercase text-sm rounded border transition-transform hover:scale-105"
            style={{
              color: theme.colors.text,
              borderColor: theme.colors.secondary,
              boxShadow: `0 0 15px ${theme.colors.glow}`,
            }}
            onMouseEnter={() => playTone('hover')}
          >
            Establish Contact
          </button>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="font-mono text-xs opacity-50">SCROLL TO DESCEND</span>
          <div className="w-px h-12 mx-auto mt-2" style={{ background: theme.colors.primary }} />
        </motion.div>
      </div>
    </section>
  );
}
