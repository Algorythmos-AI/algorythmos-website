import React, { useRef, useEffect, useState } from 'react';

/**
 * ScrollReveal Wrapper
 * Triggers premium animations when elements enter the viewport.
 * Uses IntersectionObserver for performance.
 * 
 * @param {string} animation - 'fade-up', 'fade-up-slow', 'scale', 'slide-right'
 * @param {number} delay - delay in ms
 * @param {number} duration - duration string (e.g. '0.8s')
 */
const ScrollReveal = ({
    children,
    animation = 'fade-up',
    delay = 0,
    className = '',
    threshold = 0.1
}) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(element); // Trigger once
                }
            },
            {
                threshold: threshold,
                rootMargin: '0px 0px -50px 0px' // Trigger slightly before bottom
            }
        );

        observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, [threshold]);

    // Map animation props to Tailwind classes
    const getAnimationClass = () => {
        if (!isVisible) return 'opacity-0 translate-y-8'; // Initial State

        switch (animation) {
            case 'fade-up': return 'animate-fade-up';
            case 'fade-up-slow': return 'animate-fade-up-slow';
            case 'scale': return 'animate-scale-reveal';
            case 'slide-right': return 'animate-slide-in-right';
            default: return 'animate-fade-up';
        }
    };

    return (
        <div
            ref={ref}
            className={`${className} transform transition-all duration-0 ${getAnimationClass()}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
