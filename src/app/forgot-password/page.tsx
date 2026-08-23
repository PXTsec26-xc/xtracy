'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { KeyRound, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-8 px-4 animate-fadeIn">
      <GlassCard className="max-w-md w-full p-8 border-brand-blue/30 shadow-2xl flex flex-col gap-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-brand-blue/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan shadow-glowBlue mx-auto">
          <KeyRound className="w-6 h-6" />
        </div>

        <div>
          <h1 className="text-2xl font-black text-white">Reset Your Password</h1>
          <p className="text-xs text-gray-400 mt-1">Enter your registered email address to receive password recovery instructions.</p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs flex flex-col gap-2 text-left">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Request Processed
            </div>
            <p>If an account exists for {email}, a secure password reset link has been dispatched.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-1 text-xs">
              <label className="font-bold text-gray-300">Email Address:</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 text-xs focus:border-brand-cyan"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-extrabold text-xs shadow-glowBlue transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{isLoading ? 'Sending...' : 'Send Reset Link'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-xs text-gray-400 border-t border-gray-800 pt-4">
          Remember password?{' '}
          <Link href="/login" className="text-brand-cyan font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
