// src/components/common/PageLoader.jsx
// Lightweight loading fallback for lazy-loaded routes
// Keeps the shell fast while pages load

import React from 'react';

/**
 * Minimal page loader shown during route transitions
 * Matches the app's dark theme and brand colors
 */
const PageLoader = () => {
  return (
    <div 
      className="min-h-[60vh] flex items-center justify-center bg-transparent"
      role="status"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Simple spinner using brand gradient */}
        <div 
          className="w-10 h-10 border-3 border-t-transparent border-violet-500 rounded-full animate-spin"
          style={{ borderWidth: '3px' }}
        />
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default PageLoader;
