'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const OfficialProjectInfo: React.FC = () => {
  return (
    <GlassCard className="p-6 border-brand-cyan/40 shadow-2xl flex flex-col gap-4 text-xs">
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-cyan flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Official Project Information
        </h3>
        <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold text-[10px] border border-cyan-800">
          OFFICIAL ATTRIBUTION
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
        <div className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
          <span className="text-gray-400 text-[10px] uppercase">Project Name:</span>
          <strong className="text-white text-sm font-sans">XTRACY</strong>
        </div>

        <div className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
          <span className="text-gray-400 text-[10px] uppercase">Founder Name:</span>
          <Link href="/founder" className="text-brand-cyan font-bold hover:underline text-sm font-sans">
            Elliot
          </Link>
        </div>

        <div className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
          <span className="text-gray-400 text-[10px] uppercase">Professional Identity:</span>
          <strong className="text-gray-200 text-xs font-sans">PXT sec26 Sahil</strong>
        </div>

        <div className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
          <span className="text-gray-400 text-[10px] uppercase">Official Role:</span>
          <strong className="text-gray-200 text-xs font-sans">Founder & Creator of XTRACY</strong>
        </div>
      </div>

      <p className="text-gray-300 text-xs leading-relaxed border-t border-gray-800 pt-3">
        <strong className="text-white">Founder Relationship:</strong> Elliot, also identified within the PXT sec26 project identity as Sahil, is the founder and creator of XTRACY. Elliot and PXT sec26 Sahil represent the same founder identity.
      </p>
    </GlassCard>
  );
};
