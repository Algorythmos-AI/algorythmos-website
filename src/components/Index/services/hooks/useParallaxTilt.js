import { useEffect, useRef, useState } from "react";

/** Subtle perspective tilt + icon lift on pointer move. */
export default function useParallaxTilt(maxTilt = 6, iconLiftPx = 8) {
  const ref = useRef(null);
  const [cardStyle, setCardStyle] = useState({});
  const [iconStyle, setIconStyle] = useState({});
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) return;

    let raf = 0;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;   // 0..1
      const y = (e.clientY - r.top) / r.height;   // 0..1
      const tiltX = (0.5 - y) * maxTilt;
      const tiltY = (x - 0.5) * maxTilt;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setCardStyle({
          transform: `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-1px)`,
        });
        setIconStyle({
          transform: `translate3d(${(x - 0.5) * 6}px, ${(y - 0.5) * -6}px, 0) translateY(-${iconLiftPx}px)`,
        });
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      setCardStyle({ transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)" });
      setIconStyle({ transform: "translate3d(0,0,0) translateY(0)" });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [maxTilt, iconLiftPx]);

  return { ref, cardStyle, iconStyle };
}
