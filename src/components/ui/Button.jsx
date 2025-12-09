import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Premium Button Component
 * - "Neural" gradient glow
 * - "Tesla" press physics (scale: 0.98)
 * - Glass border options
 */
const Button = ({
    children,
    variant = 'primary',
    to = null,
    onClick = null,
    className = '',
    icon = null,
    external = false
}) => {

    // Base physics and finish
    const baseStyles = "relative group inline-flex items-center justify-center font-semibold transition-all duration-300 ease-quint active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

    // Variants
    const variants = {
        // Primary: Brand Gradient (Light Violet -> Blue -> Deep Purple)
        primary: "bg-gradient-to-br from-[#6D00FF] via-[#3715E0] to-[#7658E7] text-white rounded-full px-8 py-4 shadow-[0_0_25px_rgba(109,0,255,0.3)] hover:shadow-[0_0_40px_rgba(109,0,255,0.5)] hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] active:brightness-90",

        // Secondary: Outline with Violet Accent
        secondary: "bg-transparent border border-[#6D00FF] text-white rounded-full px-8 py-4 shadow-[0_0_15px_rgba(109,0,255,0.1)] hover:shadow-[0_0_25px_rgba(109,0,255,0.3)] hover:bg-[#6D00FF]/10 hover:scale-[1.02] active:scale-[0.98]",

        // Glow: Brand Gradient (Legacy)
        glow: "bg-gradient-to-r from-neon-violet to-neon-blue text-white rounded-full px-8 py-4 shadow-neon hover:shadow-neon-strong hover:scale-[1.02]",

        // Ghost: Text only with arrow
        ghost: "text-gray-300 hover:text-white px-4 py-2 hover:bg-white/5 rounded-lg"
    };

    const combinedClasses = `${baseStyles} ${variants[variant] || variants.primary} ${className}`;

    // Content Wrapper
    const content = (
        <span className="flex items-center gap-3 relative z-10">
            {children}
            {icon || (variant !== 'ghost' && <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />)}
        </span>
    );

    // Render as Link
    if (to) {
        if (external) {
            return (
                <a href={to} target="_blank" rel="noopener noreferrer" className={combinedClasses} role="button">
                    {content}
                </a>
            );
        }
        return (
            <Link to={to} className={combinedClasses} role="button">
                {content}
            </Link>
        );
    }

    // Render as Button
    return (
        <button onClick={onClick} className={combinedClasses}>
            {content}
        </button>
    );
};

export default Button;
