import { useEffect, useRef, useState } from "react";

/** Count from 0 to 'to' when element becomes visible. */
export default function useCountUp(to = 100, durationMs = 1200, options = {}) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            if (prefersReduce || durationMs <= 0) {
              setValue(to);
              return;
            }
            const start = performance.now();
            const step = (t) => {
              const p = Math.min(1, (t - start) / durationMs);
              setValue(Math.round(p * to));
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [to, durationMs]);

  return { ref, value };
}
