'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/store/useAuthStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Settings, Smartphone, CheckCircle2, AlertTriangle, Key } from 'lucide-react';

export default function SecuritySettingsPage() {
  const { token, isGuest } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (!newPassword || newPassword.length < 10) {
      setPasswordError('New password must be at least 10 characters long.');
      return;
    }

    if (!token || isGuest) {
      setPasswordError('Password updates require a signed-in runtime account session (not Guest mode).');
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error?.message || 'Unable to update password.');
      }

      setPasswordSuccess(json?.data?.message || 'Password updated in active runtime session store.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Password change failed.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ProtectedRoute
      fallbackTitle="Sign In for Security Settings"
      fallbackDescription="Manage authentication credentials and review 2FA & session storage capabilities."
    >
      <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Settings className="w-8 h-8 text-emerald-400" />
              Account Security Settings
            </h1>
            <Badge type="productStatus" value="SESSION CREDENTIALS" size="sm" />
          </div>
          <p className="text-xs text-gray-400">
            Update runtime session credentials and review two-factor authentication availability.
          </p>
        </div>

        {passwordSuccess && (
          <div role="status" className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div role="alert" className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        {/* Change Password Form */}
        <GlassCard className="p-6 border-brand-blue/30 flex flex-col gap-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-brand-cyan flex items-center gap-2">
            <Key className="w-4 h-4" /> Change Account Password
          </h2>

          <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label htmlFor="sec-current-password" className="font-bold text-gray-300">
                  Current Password:
                </label>
                <input
                  id="sec-current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs focus:border-brand-cyan"
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="sec-new-password" className="font-bold text-gray-300">
                  New Password (10+ characters):
                </label>
                <input
                  id="sec-new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 10 characters"
                  className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs focus:border-brand-cyan"
                  required
                  minLength={10}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="self-end px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-bold text-xs shadow-glowBlue hover:brightness-110 transition-all disabled:opacity-60"
            >
              {isUpdating ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </GlassCard>

        {/* Honest 2FA Status Card */}
        <GlassCard className="p-6 border-amber-700/40 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-300">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Two-Factor Authentication (TOTP)
                </h2>
                <p className="text-xs text-gray-400">Authenticator App Security Layer</p>
              </div>
            </div>

            <span className="px-3.5 py-1.5 rounded-xl bg-amber-950/80 border border-amber-700/60 text-amber-300 text-[11px] font-extrabold uppercase">
              Unavailable Without Persistent DB
            </span>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed bg-darkBg-panel/50 p-4 rounded-xl border border-gray-800">
            Interactive TOTP secret provisioning and backup-code verification require persistent encrypted server storage (<code className="font-mono text-white">DATABASE_URL</code>). Rather than simulating 2FA locally with a client toggle, enrollment remains disabled until persistent storage is attached.
          </p>
        </GlassCard>
      </div>
    </ProtectedRoute>
  );
}
