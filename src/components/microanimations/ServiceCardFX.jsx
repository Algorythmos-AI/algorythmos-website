import React from 'react';

/**
 * ServiceCardFX Component
 * Subtle hover glow effect for service cards
 * Uses CSS instead of Lottie for reliability
 */
const ServiceCardFX = ({ className = "" }) => {
    return (
        <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/10 via-transparent to-neon-blue/10 blur-xl" />
            </div>
        </div>
    );
};

export default ServiceCardFX;
