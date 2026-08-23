'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) return;
    setDone(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-8 px-4 animate-fadeIn">
      <GlassCard className="max-w-md w-full p-8 border-brand-blue/30 shadow-2xl flex flex-col gap-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-brand-blue/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan shadow-glowBlue mx-auto">
          <Lock className="w-6 h-6" />
        </div>

        <div>
          <h1 className="text-2xl font-black text-white">Set New Password</h1>
          <p className="text-xs text-gray-400 mt-1">Enter your new secure password (8+ characters).</p>
        </div>

        {done ? (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs flex flex-col gap-3 text-left">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Password Updated Successfully
            </div>
            <p>Your password has been changed. You can now sign in with your new credentials.</p>
            <Link
              href="/login"
              className="mt-2 text-center py-2.5 rounded-xl bg-brand-blue text-white font-bold text-xs shadow-glowBlue"
            >
              Sign In Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-1 text-xs">
              <label className="font-bold text-gray-300">New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs focus:border-brand-cyan"
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-extrabold text-xs shadow-glowBlue transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Update Password</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </GlassCard>
    </div>
  );
}
