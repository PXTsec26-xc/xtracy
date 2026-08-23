import React from 'react';
import { clsx } from 'clsx';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'interactive' | 'critical' | 'safe' | 'accent';
  className?: string;
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  className = '',
  glow = false,
  ...props
}) => {
  const baseStyles =
    'relative rounded-2xl transition-all duration-300 backdrop-blur-md overflow-hidden';

  const variants = {
    default:
      'bg-[rgba(12,18,28,0.65)] border border-[rgba(120,180,255,0.12)] text-gray-100 shadow-glass',
    subtle:
      'bg-[rgba(17,24,39,0.4)] border border-[rgba(255,255,255,0.06)] text-gray-200',
    interactive:
      'bg-[rgba(12,18,28,0.7)] border border-[rgba(0,180,216,0.2)] hover:border-[rgba(0,245,212,0.5)] hover:shadow-glowBlue cursor-pointer text-gray-100',
    critical:
      'bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.3)] text-red-100',
    safe:
      'bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.3)] text-emerald-100',
    accent:
      'bg-gradient-to-br from-[rgba(0,180,216,0.12)] to-[rgba(123,44,191,0.12)] border border-[rgba(0,180,216,0.25)] text-white',
  };

  return (
    <div
      className={clsx(
        baseStyles,
        variants[variant],
        glow && 'shadow-glowBlue',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
