'use client';

import React from 'react';
import { useAccessibilityStore } from '@/store/useAccessibilityStore';

export const AccessibilityAnnouncer: React.FC = () => {
  const { announcement } = useAccessibilityStore();

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
