import React from 'react';

/**
 * LogoPulse Component
 * Subtle pulse effect for logo
 * Uses CSS for reliability (no external assets needed)
 */
const LogoPulse = ({ className = "" }) => {
    return (
        <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
            <div className="absolute inset-0 bg-neon-violet/10 rounded-full blur-xl animate-pulse" />
        </div>
    );
};

export default LogoPulse;
