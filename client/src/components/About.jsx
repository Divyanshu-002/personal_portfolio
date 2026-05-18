import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import {
  profile,
  aboutStats,
  education,
  certifications,
  resumeAchievements,
  softSkills,
  devTools,
} from '../data/portfolio';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { theme } = useTheme();

  useEffect(() => {
    if (!inView) return;
    gsap.from('.about-stat', {
      scale: 0,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'back.out(2)',
      scrollTrigger: { trigger: ref.current, start: 'top 80%' },
    });
  }, [inView]);

  return (
    <section id="about" ref={ref} className="py-32 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-mono text-sm tracking-widest mb-2" style={{ color: theme.colors.secondary }}>
            // IDENTITY FILE
          </p>
          <h2 className="font-theme font-display text-5xl md:text-7xl mb-8 glow-text" style={{ color: theme.colors.primary }}>
            THE OPERATIVE
          </h2>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-12 items-start mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="glass rounded-2xl p-8 neon-border">
            <p className="text-lg leading-relaxed opacity-90 mb-6">{profile.summary}</p>
            <div className="flex flex-wrap gap-3 font-mono text-xs mb-6">
              <span className="px-3 py-1 rounded border" style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}>
                {profile.location}
              </span>
              <span className="px-3 py-1 rounded border opacity-60" style={{ borderColor: theme.colors.secondary }}>
                PRE-FINAL YEAR · CSE
              </span>
              <a
                href={`tel:${profile.phone.replace(/\s/g, '')}`}
                className="px-3 py-1 rounded border opacity-60 hover:opacity-100 interactive"
                style={{ borderColor: theme.colors.accent, color: theme.colors.accent }}
              >
                {profile.phone}
              </a>
            </div>

            <p className="font-mono text-xs tracking-widest mb-3 opacity-50">DEV TOOLS</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {devTools.map((tool) => (
                <span
                  key={tool}
                  className="text-[10px] font-mono px-2 py-1 rounded"
                  style={{ background: `${theme.colors.primary}18`, color: theme.colors.primary }}
                >
                  {tool}
                </span>
              ))}
            </div>

            <p className="font-mono text-xs tracking-widest mb-3 opacity-50">SOFT SKILLS</p>
            <div className="flex flex-wrap gap-2">
              {softSkills.map((skill) => (
                <span key={skill} className="text-[10px] font-mono px-2 py-1 rounded border border-white/10 opacity-70">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {aboutStats.map((stat) => (
              <div
                key={stat.label}
                className="about-stat glass rounded-xl p-6 text-center hover:glow-box transition-shadow"
              >
                <p className="font-display text-3xl md:text-4xl mb-2 glow-text" style={{ color: theme.colors.accent }}>
                  {stat.value}
                </p>
                <p className="font-mono text-xs uppercase opacity-60">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Education */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          <p className="font-mono text-sm tracking-widest mb-6" style={{ color: theme.colors.secondary }}>
            // EDUCATION LOG
          </p>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.school} className="glass rounded-xl p-6 flex flex-wrap justify-between gap-4 border-l-2" style={{ borderColor: theme.colors.primary }}>
                <div>
                  <h3 className="font-display text-xl" style={{ color: theme.colors.primary }}>
                    {edu.school}
                  </h3>
                  <p className="opacity-80">{edu.degree}</p>
                  <p className="font-mono text-xs opacity-50 mt-1">
                    {edu.location} · {edu.period}
                    {edu.detail ? ` · ${edu.detail}` : ''}
                  </p>
                </div>
                <span className="font-mono text-xs self-start px-3 py-1 rounded" style={{ background: `${theme.colors.secondary}22`, color: theme.colors.secondary }}>
                  {edu.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Certifications & Achievements */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.5 }}>
            <p className="font-mono text-sm tracking-widest mb-4" style={{ color: theme.colors.secondary }}>
              // CERTIFICATIONS
            </p>
            <ul className="space-y-3">
              {certifications.map((cert) => (
                <li key={cert} className="glass rounded-lg px-4 py-3 font-mono text-sm flex items-center gap-3">
                  <span style={{ color: theme.colors.accent }}>◆</span>
                  {cert}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.5 }}>
            <p className="font-mono text-sm tracking-widest mb-4" style={{ color: theme.colors.secondary }}>
              // ACHIEVEMENTS
            </p>
            <ul className="space-y-2">
              {resumeAchievements.map((item) => (
                <li key={item} className="font-mono text-sm opacity-80 flex gap-2">
                  <span style={{ color: theme.colors.primary }}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
