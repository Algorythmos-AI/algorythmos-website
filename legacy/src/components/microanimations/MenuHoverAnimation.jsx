import React from 'react';

/**
 * MenuHoverAnimation Component
 * Subtle shimmer effect for menu items
 * Uses CSS for reliability (no external assets needed)
 */
const MenuHoverAnimation = ({ className = "" }) => {
    return (
        <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            </div>
        </div>
    );
};

export default MenuHoverAnimation;
