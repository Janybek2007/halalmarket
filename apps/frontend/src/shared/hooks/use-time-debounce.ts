'use client';
import { useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useTimeDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) {
  // eslint-disable-next-line no-undef
  const timer = useRef<NodeJS.Timeout | null>(null);

  function debouncedFunction(...args: Parameters<T>) {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  return debouncedFunction;
}
