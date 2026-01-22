// src/components/ui/AnimatedSection.jsx
// Drop-in replacement for framer-motion's motion.div with whileInView
// Uses CSS animations + IntersectionObserver instead

import React from 'react';
import { useInView } from '../../app/utils/useInView';

/**
 * Animated section that fades up when it enters the viewport
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {string} [props.className] - Additional CSS classes
 * @param {number} [props.delay] - Animation delay in ms (default 0)
 * @param {'fadeUp' | 'fadeIn' | 'scaleIn'} [props.animation] - Animation type
 * @param {number} [props.threshold] - Visibility threshold 0-1 (default 0.1)
 * @param {string} [props.as] - HTML element to render (default 'div')
 * @param {Object} [props.style] - Inline styles
 * @param {Object} [props.rest] - Other props passed to the element
 */
export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  animation = 'fadeUp',
  threshold = 0.1,
  as: Tag = 'div',
  style = {},
  ...rest
}) {
  const [ref, isInView] = useInView({ threshold, once: true });

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const animationClass = {
    fadeUp: 'animate-on-scroll',
    fadeIn: 'animate-fade-on-scroll',
    scaleIn: 'animate-scale-on-scroll',
  }[animation] || 'animate-on-scroll';

  const combinedClassName = `${animationClass} ${isInView ? 'in-view' : ''} ${className}`.trim();

  return (
    <Tag
      ref={ref}
      className={prefersReducedMotion ? className : combinedClassName}
      style={{
        ...style,
        transitionDelay: prefersReducedMotion ? '0ms' : `${delay}ms`,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Convenience exports for common patterns
export const FadeUp = (props) => <AnimatedSection animation="fadeUp" {...props} />;
export const FadeIn = (props) => <AnimatedSection animation="fadeIn" {...props} />;
export const ScaleIn = (props) => <AnimatedSection animation="scaleIn" {...props} />;
