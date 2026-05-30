// src/app/utils/useInView.js
// Lightweight hook to detect when an element enters the viewport
// Replaces Framer Motion's whileInView functionality

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook that tracks when an element enters the viewport
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - Visibility threshold (0-1), default 0.1
 * @param {string} options.rootMargin - Margin around root, default "0px"
 * @param {boolean} options.once - If true, stops observing after first intersection
 * @returns {[React.RefObject, boolean]} - [ref to attach to element, isInView state]
 */
export function useInView(options = {}) {
  const { threshold = 0.1, rootMargin = '0px', once = true } = options;
  
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If already triggered and once is true, don't observe
    if (once && hasTriggered.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          hasTriggered.current = true;
          
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, once]);

  return [ref, isInView];
}

/**
 * Hook for staggered animations on multiple children
 * @param {Object} options - Options for the stagger effect
 * @param {number} options.staggerDelay - Delay between each child animation in ms
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @returns {Object} - { containerRef, isInView, getDelayStyle }
 */
export function useStaggerInView(options = {}) {
  const { staggerDelay = 100, threshold = 0.1 } = options;
  
  const [ref, isInView] = useInView({ threshold, once: true });
  
  const getDelayStyle = useCallback((index) => ({
    transitionDelay: `${index * staggerDelay}ms`,
  }), [staggerDelay]);

  return { containerRef: ref, isInView, getDelayStyle };
}

export default useInView;
