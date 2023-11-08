import {useEffect, useRef} from 'react';

export const useAnimationFrame = (callback: () => void) => {
  const callbackRef = useRef<() => void>();
  callbackRef.current = callback;

  useEffect(() => {
    let af: number;
    const frame = () => {
      callbackRef.current?.();
      af = requestAnimationFrame(frame);
    };
    af = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(af);
    };
  }, []);
};
