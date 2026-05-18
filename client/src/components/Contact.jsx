import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import { profile } from '../data/portfolio';
import api from '../utils/api';

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { theme } = useTheme();
  const { playTone, speak } = useAudio();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    playTone('click');

    try {
      await api.post('/contact', form);
      setStatus('success');
      speak('Message transmitted successfully. The operative will respond.');
      setForm({ name: '', email: '', message: '' });
      playTone('success');
    } catch {
      setStatus('error');
      playTone('alert');
    } finally {
      setLoading(false);
    }
  };

  const downloadResume = async () => {
    playTone('click');
    try {
      const res = await api.get('/resume', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Divyanshu_Resume.pdf';
      a.click();
      speak('Resume downloaded. Handle with care.');
    } catch {
      speak('Resume file temporarily unavailable.');
    }
  };

  return (
    <section id="contact" ref={ref} className="py-32 px-4 relative">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-12">
          <p className="font-mono text-sm tracking-widest mb-2" style={{ color: theme.colors.secondary }}>
            // SECURE CHANNEL
          </p>
          <h2 className="font-theme font-display text-5xl md:text-7xl glow-text" style={{ color: theme.colors.primary }}>
            TRANSMIT MESSAGE
          </h2>
        </div>

        <div className="glass rounded-2xl p-8 neon-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {['name', 'email', 'message'].map((field) => (
              <div key={field}>
                <label className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-2">
                  {field}
                </label>
                {field === 'message' ? (
                  <textarea
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    required
                    rows={4}
                    className="w-full bg-black/30 border rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:ring-1 transition-all interactive"
                    style={{ borderColor: `${theme.colors.primary}44`, focusRingColor: theme.colors.primary }}
                    onFocus={() => playTone('type')}
                  />
                ) : (
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    required
                    className="w-full bg-black/30 border rounded-lg px-4 py-3 font-mono text-sm focus:outline-none interactive"
                    style={{ borderColor: `${theme.colors.primary}44` }}
                    onFocus={() => playTone('type')}
                  />
                )}
              </div>
            ))}

            <motion.div className="flex flex-wrap gap-4">
              <button
                type="submit"
                disabled={loading}
                className="interactive flex-1 min-w-[200px] py-4 font-display tracking-widest uppercase rounded-lg glow-box transition-all disabled:opacity-50"
                style={{ background: `${theme.colors.primary}22`, color: theme.colors.primary }}
                onMouseEnter={() => playTone('hover')}
              >
                {loading ? 'TRANSMITTING...' : 'SEND TRANSMISSION'}
              </button>
              <button
                type="button"
                onClick={downloadResume}
                className="interactive px-6 py-4 font-mono text-sm border rounded-lg"
                style={{ borderColor: theme.colors.secondary, color: theme.colors.secondary }}
                onMouseEnter={() => playTone('hover')}
              >
                [DOWNLOAD RESUME]
              </button>
            </motion.div>

            {status === 'success' && (
              <p className="font-mono text-sm text-green-400">✓ TRANSMISSION SUCCESSFUL</p>
            )}
            {status === 'error' && (
              <p className="font-mono text-sm text-red-400">✗ TRANSMISSION FAILED — RETRY</p>
            )}
          </form>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8 pt-8 border-t border-white/5">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="interactive font-mono text-sm opacity-60 hover:opacity-100" onMouseEnter={() => playTone('hover')}>
              GITHUB
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="interactive font-mono text-sm opacity-60 hover:opacity-100" onMouseEnter={() => playTone('hover')}>
              LINKEDIN
            </a>
            <a href={profile.leetcode} target="_blank" rel="noopener noreferrer" className="interactive font-mono text-sm opacity-60 hover:opacity-100" onMouseEnter={() => playTone('hover')}>
              LEETCODE
            </a>
            <a href={`mailto:${profile.email}`} className="interactive font-mono text-sm opacity-60 hover:opacity-100" onMouseEnter={() => playTone('hover')}>
              {profile.email}
            </a>
            <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="interactive font-mono text-sm opacity-40 hover:opacity-100" onMouseEnter={() => playTone('hover')}>
              {profile.phone}
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
