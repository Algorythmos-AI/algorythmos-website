import React from 'react';

/**
 * FooterGlow Component
 * Subtle ambient glow effect for footer
 * Uses CSS for reliability (no external assets needed)
 */
const FooterGlow = ({ className = "" }) => {
    return (
        <div className={className} aria-hidden="true">
            {/* Primary violet glow */}
            <div
                className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-neon-violet/8 rounded-full blur-[150px]"
            />
            {/* Secondary blue glow */}
            <div
                className="absolute bottom-0 right-1/4 w-[500px] h-[350px] bg-neon-blue/5 rounded-full blur-[120px]"
            />
        </div>
    );
};

export default FooterGlow;
