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
    'relative rounded-2xl transition-all duration-300 backdrop-blur-xl overflow-hidden';

  const variants = {
    default:
      'bg-[rgba(9,16,29,0.75)] border border-[rgba(56,189,248,0.15)] text-gray-100 shadow-glass',
    subtle:
      'bg-[rgba(13,22,38,0.5)] border border-[rgba(255,255,255,0.07)] text-gray-200',
    interactive:
      'bg-[rgba(9,16,29,0.8)] border border-[rgba(56,189,248,0.2)] hover:border-[rgba(56,189,248,0.45)] hover:shadow-glowBlue cursor-pointer text-gray-100',
    critical:
      'bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.3)] text-red-100',
    safe:
      'bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.3)] text-emerald-100',
    accent:
      'bg-gradient-to-br from-[rgba(56,189,248,0.12)] to-[rgba(2,132,199,0.12)] border border-[rgba(56,189,248,0.3)] text-white',
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
