'use client';

import React from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { MailWarning, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-8 px-4 animate-fadeIn">
      <GlassCard className="max-w-md w-full p-8 border-amber-700/40 shadow-2xl flex flex-col gap-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-950/70 border border-amber-700/50 flex items-center justify-center text-amber-400 mx-auto">
          <MailWarning className="w-7 h-7" />
        </div>

        <div>
          <h1 className="text-2xl font-black text-white">Email Verification Unavailable</h1>
          <p className="text-xs text-gray-300 mt-2 leading-relaxed">
            Outbound email verification tokens require an active SMTP mail provider and persistent database storage (<code className="font-mono text-white">DATABASE_URL</code>). XTRACY does not falsify verification without checking a cryptographic email token.
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
