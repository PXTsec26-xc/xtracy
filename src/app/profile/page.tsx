'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { User, Shield, CheckCircle2, Laptop, Smartphone, Mail, Globe, Save } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUserRole } = useAuthStore();
  const { profile, toggleItem } = useProfileStore();

  const [selectedRole, setSelectedRole] = useState(user?.userRole || 'Everyday User');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const roles = [
    'Everyday User',
    'Student',
    'Professional',
    'Family',
    'High-Risk Profile',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserRole(selectedRole as any);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <ProtectedRoute fallbackTitle="Sign In for Profile Settings" fallbackDescription="Access your security profile archetype and preferences.">
      <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <User className="w-8 h-8 text-brand-cyan" />
              User Profile & Security Archetype
            </h1>
            <Badge type="productStatus" value="AUTHENTICATED" size="sm" />
          </div>
          <p className="text-xs text-gray-400">
            Customize your security archetype, device footprint, and personalized threat alerts.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          {/* Account Details */}
          <GlassCard className="p-6 border-brand-blue/30 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-cyan">
              Account Overview
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-darkBg-panel border border-gray-800">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Full Name</span>
                <p className="text-sm font-bold text-white mt-1">{user?.fullName}</p>
              </div>
              <div className="p-3 rounded-xl bg-darkBg-panel border border-gray-800">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Email Address</span>
                <p className="text-sm font-bold text-white mt-1">{user?.email}</p>
              </div>
            </div>
          </GlassCard>

          {/* Archetype Selector */}
          <GlassCard className="p-6 border-brand-blue/30 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-cyan">
              Select Security Archetype
            </h3>
            <p className="text-xs text-gray-400">
              Your archetype tunes threat prioritization without uploading personal telemetry.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {roles.map((r) => {
                const active = selectedRole === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r as any)}
                    className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      active
                        ? 'bg-brand-blue/30 border-brand-cyan text-brand-cyan shadow-glowBlue'
                        : 'bg-darkBg-panel/60 border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </GlassCard>

          {/* Save Button */}
          <button
            type="submit"
            className="self-end px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Settings</span>
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
