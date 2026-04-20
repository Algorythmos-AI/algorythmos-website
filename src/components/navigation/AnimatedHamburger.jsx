import React from 'react';

/**
 * Animated Hamburger Icon
 * - Thin-line 3-bar icon
 * - Smooth morph into “X”
 * - 300ms cubic-bezier ease
 * - High z-index
 * - No jitter
 * - Touch target: 48px × 48px minimum
 */
const AnimatedHamburger = ({ isOpen, toggle, className = '' }) => {
  return (
    <button
      onClick={toggle}
      className={`relative z-50 flex h-12 w-12 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${className}`}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      <div className="relative flex h-[18px] w-[24px] flex-col justify-between overflow-hidden">
        {/* Top Bar */}
        <span
          className={`h-[2px] w-full transform bg-white transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isOpen ? "translate-y-[8px] rotate-45" : "translate-y-0 rotate-0"
          }`}
        />
        
        {/* Middle Bar */}
        <span
          className={`h-[2px] w-full transform bg-white transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isOpen ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
          }`}
        />
        
        {/* Bottom Bar */}
        <span
          className={`h-[2px] w-full transform bg-white transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isOpen ? "-translate-y-[8px] -rotate-45" : "translate-y-0 rotate-0"
          }`}
        />
      </div>
    </button>
  );
};

export default AnimatedHamburger;
