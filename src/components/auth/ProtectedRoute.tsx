'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthModal } from '@/components/auth/AuthModal';
import { GlassCard } from '@/components/ui/GlassCard';
import { Lock, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallbackTitle = 'Authentication Required',
  fallbackDescription = 'This area contains personal security data. Please sign in to access your personal dashboard and saved security items.',
}) => {
  const { isAuthenticated, openAuthModal } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal();
    }
  }, [isAuthenticated, openAuthModal]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 animate-fadeIn">
        <GlassCard className="p-8 border-brand-blue/30 text-center flex flex-col items-center gap-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-brand-blue/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan shadow-glowBlue">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">{fallbackTitle}</h2>
            <p className="text-xs text-gray-300 mt-2 leading-relaxed max-w-md">
              {fallbackDescription}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-bold text-xs shadow-glowBlue hover:scale-105 transition-all"
            >
              Sign In Now
            </Link>

            <Link
              href="/signup"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-darkBg-panel/80 hover:bg-darkBg-panel border border-gray-800 text-gray-200 font-bold text-xs transition-all"
            >
              Create Account
            </Link>
          </div>
        </GlassCard>

        <AuthModal />
      </div>
    );
  }

  return <>{children}</>;
};
