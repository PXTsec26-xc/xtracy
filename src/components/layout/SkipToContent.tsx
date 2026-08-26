'use client';

import React from 'react';

export const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-blue focus:text-white focus:font-bold focus:rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-cyan"
    >
      Skip to main content
    </a>
  );
};
