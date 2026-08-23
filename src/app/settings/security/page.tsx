'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/store/useAuthStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Settings, Shield, Lock, Smartphone, CheckCircle2, AlertTriangle, Key } from 'lucide-react';

export default function SecuritySettingsPage() {
  const { user } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) return;

    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <ProtectedRoute fallbackTitle="Sign In for Security Settings" fallbackDescription="Manage authentication credentials, two-factor settings, and session privacy.">
      <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Settings className="w-8 h-8 text-emerald-400" />
              Account Security Settings
            </h1>
            <Badge type="productStatus" value="AUTHENTICATED" size="sm" />
          </div>
          <p className="text-xs text-gray-400">
            Manage your credentials, 2FA authenticator settings, active sessions, and privacy controls.
          </p>
        </div>

        {passwordSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Password changed successfully!
          </div>
        )}

        {/* Change Password Form */}
        <GlassCard className="p-6 border-brand-blue/30 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-cyan flex items-center gap-2">
            <Key className="w-4 h-4" /> Change Password
          </h3>

          <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-300">Current Password:</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-300">New Password (8+ chars):</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <button
              type="submit"
              className="self-end px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-bold text-xs shadow-glowBlue hover:scale-105 transition-all"
            >
              Update Password
            </button>
          </form>
        </GlassCard>

        {/* 2FA Configuration Card */}
        <GlassCard className="p-6 border-brand-blue/30 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-300">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Two-Factor Authentication (2FA)</h3>
                <p className="text-xs text-gray-400">Authenticator App (TOTP) Security Layer</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMfaEnabled(!mfaEnabled)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mfaEnabled
                  ? 'bg-emerald-600 text-white shadow-glowGreen'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              {mfaEnabled ? '2FA Enabled' : 'Enable 2FA'}
            </button>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed bg-darkBg-panel/50 p-4 rounded-xl border border-gray-800">
            Enabling Two-Factor Authentication requires an authenticator app (Google Authenticator, Microsoft Authenticator, or Bitwarden) when signing into your XTRACY account.
          </p>
        </GlassCard>
      </div>
    </ProtectedRoute>
  );
}
