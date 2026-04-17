"use client";

import { useEffect, useRef, useState, useTransition } from "react";

interface Props {
  value: string;
  className?: string;
}

export function TickerNumber({ value, className }: Props) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (value === prevRef.current) return;
    const from = prevRef.current;
    const to = value;
    prevRef.current = to;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(to);
      return;
    }

    const start = performance.now();
    const duration = Math.min(600, 60 * Math.max(from.length, to.length));
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const len = Math.max(from.length, to.length);
      let out = "";
      for (let i = 0; i < len; i++) {
        const a = from[i] ?? to[i]!;
        const b = to[i] ?? a;
        if (a === b) {
          out += b;
          continue;
        }
        if (/\d/.test(b) && t < 1) {
          out += String(Math.floor(Math.random() * 10));
        } else {
          out += b;
        }
      }
      startTransition(() => setDisplay(out));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <span className={className} aria-live="off" suppressHydrationWarning>
      {display}
    </span>
  );
}
