'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Shield, CheckSquare, Square, RefreshCw, ArrowRight } from 'lucide-react';

export default function PrivacyScoreToolPage() {
  const [habits, setHabits] = useState([
    { id: 1, label: 'I use unique passwords for every major account', checked: true },
    { id: 2, label: 'I have Two-Factor Authentication (2FA) enabled on primary email', checked: true },
    { id: 3, label: 'I do not use public Wi-Fi without a trusted VPN', checked: false },
    { id: 4, label: 'My social media accounts are set to private', checked: true },
    { id: 5, label: 'I install software updates within 48 hours of release', checked: false },
    { id: 6, label: 'I audit smartphone app location permissions regularly', checked: true },
  ]);

  const toggleHabit = (id: number) => {
    setHabits(habits.map((h) => (h.id === id ? { ...h, checked: !h.checked } : h)));
  };

  const completedCount = habits.filter((h) => h.checked).length;
  const privacyScore = Math.floor((completedCount / habits.length) * 100);

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-brand-blue" />
            Privacy Exposure Score Assessment
          </h1>
          <Badge type="productStatus" value="LOCAL ASSESSMENT" size="sm" />
        </div>
        <p className="text-xs text-gray-400">
          Interactive self-reported habits assessment evaluating digital footprint exposure and password hygiene.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 border-brand-blue/40 flex flex-col items-center justify-center text-center gap-3">
          <span className="text-xs font-bold text-gray-400 uppercase">Privacy Score</span>
          <span className="text-5xl font-black text-brand-cyan">{privacyScore}/100</span>
          <Badge type="risk" value={privacyScore > 75 ? 'LOW' : 'MEDIUM'} size="sm" />
        </GlassCard>

        <GlassCard className="md:col-span-2 p-6 border-gray-800 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Digital Safety & Privacy Habits Checklist</h3>
          <div className="flex flex-col gap-2 text-xs">
            {habits.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => toggleHabit(h.id)}
                className="flex items-center gap-3 p-3 rounded-xl bg-darkBg-panel border border-gray-800 hover:border-brand-cyan/40 text-left transition-all"
              >
                {h.checked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-gray-500 shrink-0" />
                )}
                <span className={h.checked ? 'text-white font-medium' : 'text-gray-400'}>{h.label}</span>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
