import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../context/AudioContext';
import { useAchievements } from '../context/AchievementContext';

const COMMANDS = {
  help: () => `Available commands:
  help     - Show this message
  clear    - Clear terminal
  whoami   - Display operative info
  ls       - List mission files
  hack     - Initiate breach sequence
  theme    - Show active theme
  vault    - Access secret vault
  breach   - Enter hack mode
  exit     - Close terminal`,
  whoami: () => 'OPERATIVE: DIVYANSHU | CODENAME: DIV_OPS | CSE @ CHITKARA | STATUS: ACTIVE',
  ls: () => 'OP-001  OP-002  OP-003  OP-004  OP-005  OP-006  [CLASSIFIED]',
  theme: () => `ACTIVE THEME: ${document.body.dataset.theme || 'cyberpunk'}`,
  clear: null,
  hack: () => '>>> INITIATING BREACH PROTOCOL...\n>>> ACCESS GRANTED.\n>>> Redirecting...',
  vault: () => '>>> Opening secret vault...',
  breach: () => '>>> Entering hack mode...',
  exit: null,
};

export default function HackerTerminal({ open, onClose }) {
  const [history, setHistory] = useState([
    { type: 'system', text: 'PHANTOM OS Terminal v7.7.7' },
    { type: 'system', text: 'Type "help" for available commands.' },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { playTone } = useAudio();
  const { unlock } = useAchievements();

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      unlock('terminal');
    }
  }, [open, unlock]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [history]);

  const execute = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    setHistory((h) => [...h, { type: 'input', text: `> ${cmd}` }]);
    setCmdHistory((h) => [...h, cmd]);
    setHistoryIdx(-1);
    playTone('type');

    if (trimmed === 'clear') {
      setHistory([]);
      return;
    }
    if (trimmed === 'exit') {
      onClose();
      return;
    }
    if (trimmed === 'hack' || trimmed === 'breach') {
      unlock('hack_mode');
      setHistory((h) => [
        ...h,
        { type: 'output', text: COMMANDS[trimmed]() },
      ]);
      setTimeout(() => navigate('/breach'), 1500);
      return;
    }
    if (trimmed === 'vault') {
      setHistory((h) => [...h, { type: 'output', text: COMMANDS.vault() }]);
      setTimeout(() => navigate('/vault'), 1000);
      return;
    }

    const handler = COMMANDS[trimmed];
    if (handler) {
      setHistory((h) => [...h, { type: 'output', text: handler() }]);
    } else {
      setHistory((h) => [
        ...h,
        { type: 'error', text: `Command not found: ${trimmed}. Type "help" for commands.` },
      ]);
      playTone('alert');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      execute(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const idx = historyIdx < cmdHistory.length - 1 ? historyIdx + 1 : historyIdx;
        setHistoryIdx(idx);
        setInput(cmdHistory[cmdHistory.length - 1 - idx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const idx = historyIdx - 1;
        setHistoryIdx(idx);
        setInput(cmdHistory[cmdHistory.length - 1 - idx] || '');
      } else {
        setHistoryIdx(-1);
        setInput('');
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[10002] flex items-center justify-center p-4 bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-3xl h-[70vh] bg-black border border-green-500/50 rounded-lg overflow-hidden crt-flicker shadow-2xl"
            style={{ boxShadow: '0 0 40px rgba(0,255,0,0.2)' }}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 border-b border-green-500/30">
              <span className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={onClose} />
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="font-mono text-xs text-green-400 ml-2">phantom@classified:~</span>
            </div>

            <div ref={scrollRef} className="p-4 h-[calc(100%-80px)] overflow-y-auto font-mono text-sm">
              {history.map((line, i) => (
                <p
                  key={i}
                  className={`mb-1 ${
                    line.type === 'input'
                      ? 'text-green-300'
                      : line.type === 'error'
                      ? 'text-red-400'
                      : line.type === 'system'
                      ? 'text-green-600'
                      : 'text-green-400 terminal-text'
                  }`}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {line.text}
                </p>
              ))}
            </div>

            <div className="flex items-center px-4 py-3 border-t border-green-500/30">
              <span className="text-green-400 mr-2">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-green-400 font-mono text-sm caret-green-400"
                spellCheck={false}
                autoComplete="off"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
