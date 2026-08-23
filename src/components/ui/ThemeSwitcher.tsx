'use client';

import React from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import { ThemeMode } from '@/types';
import { Moon, Sun, AlertTriangle } from 'lucide-react';

export const ThemeSwitcher: React.FC = () => {
  const { mode, setMode } = useThemeStore();

  const options: { mode: ThemeMode; label: string; icon: React.FC<{ className?: string }> }[] = [
    { mode: 'dark', label: 'Dark Glass', icon: Moon },
    { mode: 'light', label: 'Light Glass', icon: Sun },
    { mode: 'emergency', label: 'Emergency Focus', icon: AlertTriangle },
  ];

  return (
    <div className="inline-flex items-center p-1 rounded-xl bg-gray-900/80 border border-gray-800 backdrop-blur-md">
      {options.map(({ mode: m, label, icon: Icon }) => {
        const active = mode === m;
        return (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              active
                ? m === 'emergency'
                  ? 'bg-red-600 text-white font-bold shadow-md shadow-red-950/50'
                  : 'bg-brand-blue/20 text-brand-cyan border border-brand-blue/30 font-semibold shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
            }`}
            title={`Switch to ${label} mode`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
};
