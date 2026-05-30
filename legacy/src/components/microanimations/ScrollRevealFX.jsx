import React from 'react';

/**
 * ScrollRevealFX Component
 * Subtle particle/dust effect that appears during scroll
 * Uses CSS animation instead of requiring external assets
 */
const ScrollRevealFX = ({ className = "" }) => {
    return (
        <div className={`${className}`} aria-hidden="true">
            {/* Subtle gradient particles effect using CSS */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-neon-violet/40 rounded-full blur-sm animate-pulse" />
                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-neon-blue/30 rounded-full blur-sm animate-pulse delay-300" />
                <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-neon-cyan/20 rounded-full blur-sm animate-pulse delay-500" />
                <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white/20 rounded-full blur-sm animate-pulse delay-700" />
            </div>
        </div>
    );
};

export default ScrollRevealFX;
