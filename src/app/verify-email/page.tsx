'use client';

import React from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { MailCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-8 px-4 animate-fadeIn">
      <GlassCard className="max-w-md w-full p-8 border-brand-blue/30 shadow-2xl flex flex-col gap-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 mx-auto shadow-glowBlue">
          <MailCheck className="w-7 h-7 animate-pulse" />
        </div>

        <div>
          <h1 className="text-2xl font-black text-white">Email Verification</h1>
          <p className="text-xs text-gray-300 mt-2 leading-relaxed">
            Verification link confirmed! Your email address has been verified for secure account access.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-extrabold text-xs shadow-glowBlue flex items-center justify-center gap-2"
        >
          <span>Go to Personal Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </GlassCard>
    </div>
  );
}
