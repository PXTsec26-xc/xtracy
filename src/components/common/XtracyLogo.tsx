import React from 'react';
import Link from 'next/link';

interface XtracyLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const XtracyLogo: React.FC<XtracyLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const subtitleSizes = {
    sm: 'text-[8px]',
    md: 'text-[9px]',
    lg: 'text-[11px]',
  };

  return (
    <Link href="/" className={`flex items-center gap-3 group transition-all ${className}`}>
      {/* Precision Geometric X Logo Icon */}
      <div className={`relative ${iconSizes[size]} rounded-xl bg-gradient-to-br from-cyan-500/20 via-sky-500/20 to-blue-600/20 p-0.5 border border-sky-400/30 backdrop-blur-xl shadow-glass transition-transform duration-300 group-hover:scale-105 group-hover:border-sky-400/60`}>
        <div className="w-full h-full bg-[#080e18]/90 rounded-[10px] flex items-center justify-center p-1.5 overflow-hidden relative">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-sky-400/10 rounded-[10px] blur-xs group-hover:bg-sky-400/20 transition-all" />

          {/* SVG Geometric X Emblem */}
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10">
            {/* Upper Left to Lower Right Diagonal Pillar */}
            <path
              d="M6 7L13 16L6 25H10.5L15.5 18.5L20.5 25H25L18 16L25 7H20.5L15.5 13.5L10.5 7H6Z"
              fill="url(#xtracy-logo-gradient-1)"
            />
            {/* Interlocking Diamond Core Node */}
            <path
              d="M15.5 12L19.5 16L15.5 20L11.5 16L15.5 12Z"
              fill="url(#xtracy-logo-gradient-2)"
              opacity="0.9"
            />
            {/* Precision Cyan Linear Accent */}
            <path
              d="M8 8L24 24"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.8"
            />
            <defs>
              <linearGradient id="xtracy-logo-gradient-1" x1="6" y1="7" x2="25" y2="25" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="0.5" stopColor="#0284c7" />
                <stop offset="1" stopColor="#1e3a8a" />
              </linearGradient>
              <linearGradient id="xtracy-logo-gradient-2" x1="11.5" y1="12" x2="19.5" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f0f9ff" />
                <stop offset="1" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Lockup Text */}
      <div className="flex flex-col">
        <span className={`font-black tracking-wider text-white flex items-center gap-1.5 ${textSizes[size]} font-sans`}>
          XTRACY
        </span>
        {showSubtitle && (
          <span className={`uppercase tracking-widest text-sky-400/90 font-bold ${subtitleSizes[size]} font-mono`}>
            FOUNDED &amp; CREATED BY ELLIOT
          </span>
        )}
      </div>
    </Link>
  );
};
