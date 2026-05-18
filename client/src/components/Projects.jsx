import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { projects } from '../data/portfolio';
import MissionCard from './MissionCard';

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { theme } = useTheme();

  return (
    <section id="projects" ref={ref} className="py-32 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-center mb-16"
        >
          <p className="font-mono text-sm tracking-widest mb-2" style={{ color: theme.colors.secondary }}>
            // CLASSIFIED MISSIONS
          </p>
          <h2 className="font-theme font-display text-5xl md:text-7xl glow-text" style={{ color: theme.colors.primary }}>
            OPERATION FILES
          </h2>
          <p className="font-mono text-xs mt-4 opacity-50">
            AUTHORIZATION REQUIRED — LEVEL 5 CLEARANCE
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <MissionCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
