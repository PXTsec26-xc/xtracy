'use client';

import React, { useState } from 'react';
import { SOCIAL_PRIVACY_CHECKLISTS } from '@/lib/mockData/womensSafety';
import { GlassCard } from '@/components/ui/GlassCard';
import { CheckCircle2, Circle, ShieldCheck } from 'lucide-react';

export const SocialMediaChecklist: React.FC = () => {
  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});

  const toggleItem = (id: string) => {
    setCheckedState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {SOCIAL_PRIVACY_CHECKLISTS.map((platform) => {
        const completedCount = platform.items.filter((i) => checkedState[i.id]).length;
        const total = platform.items.length;
        const isAllDone = completedCount === total;

        return (
          <GlassCard key={platform.platform} className="p-5 flex flex-col gap-4 border-brand-blue/20">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${platform.color} flex items-center justify-center text-white font-black text-xs shadow-md`}>
                  {platform.platform.substring(0, 2).toUpperCase()}
                </div>
                <h3 className="text-base font-bold text-white">{platform.platform} Privacy Audit</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                isAllDone ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-gray-800 text-gray-300'
              }`}>
                {completedCount} / {total} Done
              </span>
            </div>

            {/* Checklist Items */}
            <div className="flex flex-col gap-2.5">
              {platform.items.map((item) => {
                const checked = !!checkedState[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl text-xs text-left transition-all ${
                      checked
                        ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 line-through opacity-80'
                        : 'bg-darkBg-panel/50 border border-gray-800 text-gray-200 hover:border-brand-cyan/40'
                    }`}
                  >
                    {checked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-500 shrink-0" />
                    )}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
};
