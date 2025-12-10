import React from 'react';

/**
 * ButtonAnimation Component
 * Subtle hover glow effect for buttons
 * Uses CSS for reliability (no external assets needed)
 */
const ButtonAnimation = ({ className = "" }) => {
    return (
        <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-violet/20 to-neon-blue/20 blur-lg" />
            </div>
        </div>
    );
};

export default ButtonAnimation;
