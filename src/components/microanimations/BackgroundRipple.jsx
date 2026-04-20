import React from 'react';

/**
 * BackgroundRipple Component
 * Subtle ripple effect for backgrounds
 * Uses CSS instead of Lottie for reliability
 */
const BackgroundRipple = ({ className = "" }) => {
    return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%]">
                <div className="absolute inset-0 bg-gradient-radial from-neon-violet/5 via-transparent to-transparent animate-pulse" />
            </div>
        </div>
    );
};

export default BackgroundRipple;
