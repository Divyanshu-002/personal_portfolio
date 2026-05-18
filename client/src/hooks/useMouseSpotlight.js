import { useEffect, useRef } from 'react';

export function useMouseSpotlight(ref) {
  useEffect(() => {
    const el = ref?.current;
    if (!el) return;

    const handler = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty('--mouse-x', `${x}px`);
      el.style.setProperty('--mouse-y', `${y}px`);
    };

    el.addEventListener('mousemove', handler);
    return () => el.removeEventListener('mousemove', handler);
  }, [ref]);
}
