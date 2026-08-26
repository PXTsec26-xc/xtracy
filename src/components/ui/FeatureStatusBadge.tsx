'use client';

import React from 'react';

export type FeatureStatusType = 'LIVE' | 'LOCAL' | 'REQUIRES_API' | 'UNAVAILABLE';

interface FeatureStatusBadgeProps {
  status: FeatureStatusType;
  label?: string;
  size?: 'sm' | 'md';
}

export const FeatureStatusBadge: React.FC<FeatureStatusBadgeProps> = ({
  status,
  label,
  size = 'sm',
}) => {
  let styles = 'bg-cyan-950/80 border-cyan-800 text-cyan-300';
  let defaultLabel = 'LOCAL';

  if (status === 'LIVE') {
    styles = 'bg-emerald-950/80 border-emerald-800 text-emerald-300';
    defaultLabel = 'LIVE';
  } else if (status === 'LOCAL') {
    styles = 'bg-cyan-950/80 border-cyan-800 text-cyan-300';
    defaultLabel = 'LOCAL';
  } else if (status === 'REQUIRES_API') {
    styles = 'bg-amber-950/80 border-amber-800 text-amber-300';
    defaultLabel = 'REQUIRES API';
  } else if (status === 'UNAVAILABLE') {
    styles = 'bg-red-950/80 border-red-800 text-red-300';
    defaultLabel = 'UNAVAILABLE';
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]';

  return (
    <span className={`rounded-full border font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${styles} ${padding}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      <span>{label || defaultLabel}</span>
    </span>
  );
};
