import { useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";

/**
 * useCardTilt — returns refs/handlers + animated style for a light 3D tilt.
 * @param {number} maxDeg  max rotation in degrees (default 6)
 * @param {number} scaleOnHover scale factor on hover (default 1.02)
 * @param {boolean} disabled  respect prefers-reduced-motion
 */
export default function useCardTilt(maxDeg = 6, scaleOnHover = 1.02, disabled = false) {
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sc = useMotionValue(1);

  const rotateX = useSpring(rx, { stiffness: 180, damping: 16 });
  const rotateY = useSpring(ry, { stiffness: 180, damping: 16 });
  const scale   = useSpring(sc, { stiffness: 180, damping: 16 });

  function onMouseMove(e) {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;   // 0..1
    const py = (e.clientY - rect.top) / rect.height;   // 0..1
    ry.set((px - 0.5) * 2 * maxDeg);   // left(-) right(+)
    rx.set(-(py - 0.5) * 2 * maxDeg);  // top(+) bottom(-)
    sc.set(scaleOnHover);
  }

  function onMouseLeave() {
    rx.set(0); ry.set(0); sc.set(1);
  }

  return {
    ref,
    events: { onMouseMove, onMouseLeave },
    style: { rotateX, rotateY, scale, transformStyle: "preserve-3d" },
  };
}
