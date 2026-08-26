'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, UserPlus } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error?.message || 'Login failed. Please check credentials.');
        setIsLoading(false);
        return;
      }

      setSession(data.data.user, data.data.token);
      router.push('/dashboard');
    } catch (err) {
      setError('Connection error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] py-8 px-4 animate-fadeIn">
      <GlassCard className="max-w-md w-full p-8 border-brand-blue/30 shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-blue/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan shadow-glowBlue">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white">Sign In to XTRACY</h1>
          <p className="text-xs text-gray-400">Access your personal security dashboard, saved scans, and Safe Vault.</p>
        </div>

        {/* Demo Credentials Alert Pill */}
        <div className="p-3 rounded-xl bg-gray-900/90 border border-gray-800 text-[11px] text-gray-300">
          <span className="font-bold text-brand-cyan">Quick Local Demo Login: </span>
          Email: <code className="text-white">user@xtracy.org</code> | Password: <code className="text-white">XtracyPass123!</code>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-bold text-gray-300">Password:</label>
              <Link href="/forgot-password" className="text-brand-cyan hover:underline text-[11px]">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 text-xs focus:border-brand-cyan"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-extrabold text-xs shadow-glowBlue hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* OAuth Placeholder */}
        <div className="pt-2 border-t border-gray-800 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => alert('OAuth Integration (Google Sign-In) ready for production provider configuration.')}
            className="w-full py-2.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-800 text-xs font-semibold text-gray-300 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-brand-cyan" />
            <span>Continue with Google OAuth (Provider Ready)</span>
          </button>

          <div className="text-center text-xs text-gray-400 mt-2">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-brand-cyan font-bold hover:underline">
              Create free account
            </Link>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
