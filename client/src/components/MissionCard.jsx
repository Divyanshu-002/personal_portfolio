import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';

export default function MissionCard({ project, index }) {
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: '-50px' });
  const { theme } = useTheme();
  const { playTone } = useAudio();

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    card.querySelector('.mission-card-inner').style.transform =
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    const inner = cardRef.current?.querySelector('.mission-card-inner');
    if (inner) inner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  };

  const threatColors = {
    LOW: '#4ade80',
    MEDIUM: '#facc15',
    HIGH: '#f97316',
    CRITICAL: '#ef4444',
    EXTREME: '#dc2626',
    MAXIMUM: '#ff00ff',
  };

  return (
    <motion.div
      ref={cardRef}
      className="mission-card"
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => playTone('hover')}
    >
      <div className="mission-card-inner glass rounded-xl overflow-hidden h-full transition-transform duration-100">
        <motion.div
          className="h-1"
          style={{ background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary})` }}
          layoutId={`bar-${project.id}`}
        />

        <div className="p-6">
          <motion.div className="flex justify-between items-start mb-4">
            <div>
              <span className="font-mono text-xs opacity-50">{project.id}</span>
              <h3 className="font-display text-xl mt-1" style={{ color: theme.colors.primary }}>
                {project.codename}
              </h3>
            </div>
            <span
              className="font-mono text-[10px] px-2 py-1 rounded border"
              style={{
                borderColor: threatColors[project.threat],
                color: threatColors[project.threat],
              }}
            >
              {project.threat}
            </span>
          </motion.div>

          <p className="font-mono text-[10px] tracking-widest mb-2 opacity-50">{project.classification}</p>
          <p className="text-sm opacity-80 mb-4 line-clamp-3">{project.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-[10px] font-mono px-2 py-0.5 rounded"
                style={{ background: `${theme.colors.primary}22`, color: theme.colors.primary }}
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <span className="font-mono text-xs" style={{ color: theme.colors.accent }}>
              {project.status}
            </span>
            <div className="flex gap-3">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive font-mono text-xs hover:glow-text"
                style={{ color: theme.colors.primary }}
                onClick={() => playTone('click')}
              >
                [GITHUB]
              </a>
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive font-mono text-xs hover:glow-text"
                  style={{ color: theme.colors.secondary }}
                  onClick={() => playTone('click')}
                >
                  [DEPLOY]
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
