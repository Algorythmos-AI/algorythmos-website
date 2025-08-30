import React from "react";

/** Background glow orbs for the hero area (decorative only). */
export default function HeroFX() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="hero-orb -left-24 -top-16" />
      <div className="hero-orb right-0 top-24" style={{ animationDelay: "1.2s" }} />
    </div>
  );
}
