'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { UserPlus, Mail, Lock, User, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState<'Everyday User' | 'Student' | 'Professional' | 'Family' | 'High-Risk Profile'>('Everyday User');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, userRole }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error?.message || 'Registration failed.');
        setIsLoading(false);
        return;
      }

      setSession(data.data.user, data.data.token);
      router.push('/dashboard');
    } catch (err) {
      setError('Connection error during signup.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-8 px-4 animate-fadeIn">
      <GlassCard className="max-w-md w-full p-8 border-brand-blue/30 shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-blue/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan shadow-glowBlue">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white">Create XTRACY Account</h1>
          <p className="text-xs text-gray-400">Free, privacy-first cybersecurity intelligence & personal safety.</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 text-xs">
            <label className="font-bold text-gray-300">Full Name:</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 text-xs focus:border-brand-cyan"
                required
              />
            </div>
          </div>

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
            <label className="font-bold text-gray-300">Select Security Profile Type:</label>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as any)}
              className="w-full p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs"
            >
              <option value="Everyday User">Everyday User</option>
              <option value="Student">Student</option>
              <option value="Professional">Professional</option>
              <option value="Family">Family</option>
              <option value="High-Risk Profile">High-Risk Profile</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-bold text-gray-300">Password (8+ chars):</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 text-xs focus:border-brand-cyan"
                required
                minLength={8}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-extrabold text-xs shadow-glowBlue hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 border-t border-gray-800 pt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-cyan font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
