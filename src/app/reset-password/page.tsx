'use client';

import React from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Lock, AlertTriangle, ArrowRight, Key } from 'lucide-react';

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-8 px-4 animate-fadeIn">
      <GlassCard className="max-w-md w-full p-8 border-amber-700/40 shadow-2xl flex flex-col gap-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-700/50 flex items-center justify-center text-amber-400 mx-auto">
          <Lock className="w-6 h-6" />
        </div>

        <div>
          <h1 className="text-2xl font-black text-white">Email Password Recovery</h1>
          <p className="text-xs text-gray-400 mt-1">
            Tokenized external password reset requires configured SMTP delivery and a persistent database.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-700/40 text-amber-200 text-xs flex flex-col gap-2 text-left">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0" /> Unconfigured Service Notice
          </div>
          <p className="leading-relaxed">
            This deployment runs without an external email relay or persistent account database. XTRACY does not simulate password resets without verifying a signed email token.
          </p>
          <p className="leading-relaxed">
            If you are already signed in to an active runtime session, you can change your password directly in Security Settings.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 text-xs">
          <Link
            href="/settings/security"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-extrabold shadow-glowBlue flex items-center justify-center gap-2"
          >
            <Key className="w-4 h-4" />
            <span>Open Account Security Settings</span>
          </Link>
          <Link
            href="/login"
            className="w-full py-2.5 rounded-xl bg-darkBg-panel border border-gray-800 text-gray-200 hover:text-white font-bold flex items-center justify-center gap-2"
          >
            <span>Return to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
