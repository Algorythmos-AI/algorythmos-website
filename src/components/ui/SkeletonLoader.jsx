import React from 'react';

/**
 * Skeleton Loader Component
 * - Shimmer effect
 * - Dark mode optimized (Accenture style)
 * - Accessible
 */
const SkeletonLoader = ({ 
  variant = 'text', 
  width, 
  height, 
  className = '',
  count = 1
}) => {
  const renderSkeleton = (index) => {
    let baseClasses = "relative overflow-hidden bg-white/5 before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer-slide before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";
    
    if (variant === 'circle') {
      baseClasses += " rounded-full";
    } else if (variant === 'card') {
      baseClasses += " rounded-xl border border-white/10";
    } else {
      baseClasses += " rounded-md";
    }

    return (
      <div 
        key={index}
        className={`${baseClasses} ${className}`}
        style={{ width, height }}
        role="status"
        aria-busy="true"
        aria-label="Loading content"
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
    </>
  );
};

export default SkeletonLoader;
