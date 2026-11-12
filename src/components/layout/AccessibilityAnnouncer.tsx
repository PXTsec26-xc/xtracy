'use client';

import React, { useEffect } from 'react';
import { useAccessibilityStore } from '@/store/useAccessibilityStore';

export const AccessibilityAnnouncer: React.FC = () => {
  const { announcement, textSize, highContrast, reducedMotion, enhancedFocus } = useAccessibilityStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('a11y-text-large', textSize === 'large');
    root.classList.toggle('a11y-text-xlarge', textSize === 'xlarge');
    root.classList.toggle('a11y-high-contrast', highContrast);
    root.classList.toggle('a11y-reduced-motion', reducedMotion);
    root.classList.toggle('a11y-enhanced-focus', enhancedFocus);
  }, [textSize, highContrast, reducedMotion, enhancedFocus]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
};
