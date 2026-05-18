import { useEffect, useRef, useCallback, useState } from 'react';

export function useVoiceCommand(onCommand) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const start = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      onCommand(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [onCommand]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  return { listening, start, stop };
}
