'use client';

import React from 'react';
import { ReadingMode } from '@/types';
import { BookOpen, GraduationCap, Code2 } from 'lucide-react';

interface ReadingModeToggleProps {
  currentMode: ReadingMode;
  onSelectMode: (mode: ReadingMode) => void;
}

export const ReadingModeToggle: React.FC<ReadingModeToggleProps> = ({
  currentMode,
  onSelectMode,
}) => {
  const modes: { mode: ReadingMode; title: string; subtitle: string; icon: React.FC<{ className?: string }> }[] = [
    {
      mode: 'BEGINNER',
      title: 'Beginner',
      subtitle: 'Simple Language & Actions',
      icon: BookOpen,
    },
    {
      mode: 'STUDENT',
      title: 'Student',
      subtitle: 'Concepts, CVE & Takeaways',
      icon: GraduationCap,
    },
    {
      mode: 'PROFESSIONAL',
      title: 'Professional',
      subtitle: 'CVSS, MITRE, IOCs & Remediation',
      icon: Code2,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-darkBg-card/80 border border-gray-800 backdrop-blur-md">
      {modes.map(({ mode, title, subtitle, icon: Icon }) => {
        const active = currentMode === mode;
        return (
          <button
            key={mode}
            onClick={() => onSelectMode(mode)}
            className={`flex flex-col items-center justify-center p-2.5 rounded-lg text-center transition-all ${
              active
                ? 'bg-gradient-to-r from-brand-blue/30 to-brand-violet/30 border border-brand-blue/40 text-white shadow-glowBlue font-semibold'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
              <Icon className="w-4 h-4 text-brand-cyan" />
              <span>{title}</span>
            </div>
            <span className="text-[10px] text-gray-400 hidden sm:block mt-0.5">{subtitle}</span>
          </button>
        );
      })}
    </div>
  );
};
