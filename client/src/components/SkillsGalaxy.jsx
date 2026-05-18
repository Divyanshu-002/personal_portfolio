import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import { motion, useInView } from 'framer-motion';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { skills } from '../data/portfolio';

function SkillPlanet({ skill, index, total }) {
  const meshRef = useRef();
  const angle = (index / total) * Math.PI * 2;
  const radius = 2 + skill.orbit * 0.8;
  const speed = 0.3 / skill.orbit;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * speed + angle;
    meshRef.current.position.x = Math.cos(t) * radius;
    meshRef.current.position.z = Math.sin(t) * radius;
    meshRef.current.rotation.y += 0.01;
  });

  const size = 0.15 + (skill.level / 100) * 0.25;

  return (
    <group ref={meshRef}>
      <mesh>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={skill.color}
          emissive={skill.color}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <Text
        position={[0, size + 0.3, 0]}
        fontSize={0.15}
        color={skill.color}
        anchorX="center"
        anchorY="middle"
      >
        {skill.name}
      </Text>
      <pointLight position={[0, 0, 0]} intensity={0.5} color={skill.color} distance={2} />
    </group>
  );
}

function GalaxyCore({ color }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[0.6, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1}
        wireframe
        metalness={1}
        roughness={0}
      />
    </mesh>
  );
}

function GalaxyScene() {
  const { theme } = useTheme();
  const color = theme.colors.primary;

  return (
    <>
      <ambientLight intensity={0.3} />
      <GalaxyCore color={color} />
      {skills.map((skill, i) => (
        <SkillPlanet key={skill.name} skill={skill} index={i} total={skills.length} />
      ))}
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} />
    </>
  );
}

export default function SkillsGalaxy() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { theme } = useTheme();

  return (
    <section id="skills" ref={ref} className="py-32 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-center mb-8"
        >
          <p className="font-mono text-sm tracking-widest mb-2" style={{ color: theme.colors.secondary }}>
            // ARSENAL GALAXY
          </p>
          <h2 className="font-theme font-display text-5xl md:text-7xl glow-text" style={{ color: theme.colors.primary }}>
            SKILL CONSTELLATION
          </h2>
        </motion.div>

        <motion.div
          className="h-[500px] md:h-[600px] rounded-2xl glass overflow-hidden neon-border"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Canvas camera={{ position: [0, 3, 8], fov: 50 }}>
            <GalaxyScene />
          </Canvas>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-8">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="glass rounded-lg p-3 text-center group hover:glow-box transition-all"
            >
              <div className="h-1 rounded-full mb-2 overflow-hidden bg-white/5">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: skill.color }}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${skill.level}%` } : {}}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </div>
              <p className="font-mono text-xs">{skill.name}</p>
              <p className="font-display text-lg" style={{ color: skill.color }}>
                {skill.level}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
