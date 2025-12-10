import React from 'react';

/**
 * PageTransitionFX Component
 * Subtle page transition effect
 * Uses CSS instead of Lottie for reliability
 */
const PageTransitionFX = ({ className = "" }) => {
    return (
        <div className={`fixed inset-0 pointer-events-none z-50 ${className}`} aria-hidden="true">
            <div className="absolute inset-0 bg-neural-950 opacity-0 transition-opacity duration-300" />
        </div>
    );
};

export default PageTransitionFX;
