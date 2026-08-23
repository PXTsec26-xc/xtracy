'use client';

import React from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import { LogOut, ShieldAlert } from 'lucide-react';

interface QuickExitButtonProps {
  className?: string;
  variant?: 'navbar' | 'prominent';
}

export const QuickExitButton: React.FC<QuickExitButtonProps> = ({
  className = '',
  variant = 'navbar',
}) => {
  const triggerQuickExit = useThemeStore((state) => state.triggerQuickExit);

  if (variant === 'prominent') {
    return (
      <button
        onClick={triggerQuickExit}
        className={`group relative inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-950/50 hover:shadow-red-600/30 transition-all duration-200 ${className}`}
        title="Immediately exit page to neutral site (Weather.com)"
      >
        <ShieldAlert className="w-5 h-5 animate-pulse" />
        <span>QUICK EXIT NOW</span>
        <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    );
  }

  return (
    <button
      onClick={triggerQuickExit}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-200 text-xs font-semibold shadow-sm transition-all ${className}`}
      title="Immediately leave page to a neutral website (Weather.com)"
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>Quick Exit</span>
    </button>
  );
};
