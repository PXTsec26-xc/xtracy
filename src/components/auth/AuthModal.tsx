'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { X, Lock, ShieldCheck, UserPlus, LogIn, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal } = useAuthStore();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <GlassCard className="max-w-md w-full p-6 flex flex-col gap-6 border-brand-blue/40 shadow-2xl text-center">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-cyan" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">Account Required</span>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-brand-blue/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan mx-auto shadow-glowBlue">
          <Lock className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">Unlock Personal Security Features</h3>
          <p className="text-xs text-gray-300 mt-2 leading-relaxed">
            Create a free XTRACY account or sign in to save your scan history, store encrypted Safe Vault notes, track incident response progress, and customize safety alerts.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            onClick={closeAuthModal}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-bold text-xs shadow-glowBlue hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In To Existing Account</span>
          </Link>

          <Link
            href="/signup"
            onClick={closeAuthModal}
            className="w-full py-3 rounded-xl bg-darkBg-panel/80 hover:bg-darkBg-panel border border-gray-800 text-gray-200 font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-brand-cyan" />
            <span>Create Free Account</span>
          </Link>
        </div>

        <p className="text-[11px] text-gray-500">
          Public features (112 Emergency, Women&apos;s Safety, Threat Intelligence) remain free & open for guests.
        </p>
      </GlassCard>
    </div>
  );
};
