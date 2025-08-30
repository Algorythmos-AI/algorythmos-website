import React from "react";

/** Shimmering gradient heading that respects reduced motion. */
export default function ShimmerHeading({ className = "", children }) {
  return (
    <span
      className={`block leading-tight ${className} ${typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? '' : 'shimmer-text'}`}
    >
      {children}
    </span>
  );
}
