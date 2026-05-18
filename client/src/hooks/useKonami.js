import { useEffect } from 'react';

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

export function useKonami(onSuccess) {
  useEffect(() => {
    let index = 0;
    const handler = (e) => {
      if (e.key === KONAMI[index]) {
        index++;
        if (index === KONAMI.length) {
          index = 0;
          onSuccess();
        }
      } else {
        index = 0;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onSuccess]);
}
