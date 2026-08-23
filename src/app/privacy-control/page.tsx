'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/store/useAuthStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataStorageBadge } from '@/components/ui/DataStorageBadge';
import { ShieldCheck, Lock, Trash2, HardDrive, Laptop, Eye, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function PrivacyControlPage() {
  const { user, token } = useAuthStore();
  const [privacyData, setPrivacyData] = useState<any>(null);
  const [isWiping, setIsWiping] = useState(false);
  const [wipeSuccess, setWipeSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch('/api/user/privacy', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPrivacyData(data.data);
      })
      .catch(() => {});
  }, [token]);

  const handleWipeData = async () => {
    if (!token || !confirm('Are you sure you want to permanently delete all your saved scans, incident logs, and vault records? This action cannot be undone.')) return;

    setIsWiping(true);
    try {
      const res = await fetch('/api/user/privacy', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setWipeSuccess(true);
      }
    } catch (err) {
      alert('Failed to execute data erasure.');
    } finally {
      setIsWiping(false);
    }
  };

  return (
    <ProtectedRoute fallbackTitle="Sign In for Privacy & Data Control" fallbackDescription="Access your personal data breakdown, view server vs local storage, and manage data erasure.">
      <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-8 h-8 text-brand-cyan" />
                User Privacy & Data Control Center
              </h1>
              <Badge type="productStatus" value="TRANSPARENT" size="sm" />
            </div>
            <DataStorageBadge status="PERSISTENT" />
          </div>
          <p className="text-xs text-gray-400">
            Inspect what XTRACY stores, manage client-side encryption guarantees, and execute data wipe workflows.
          </p>
        </div>

        {wipeSuccess && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Account data wipe completed successfully! All saved scans, bookmarks, and vault records have been permanently erased.</span>
          </div>
        )}

        {/* Data Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <GlassCard className="p-5 border-emerald-500/30 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
              <HardDrive className="w-4 h-4" /> Server Stored Data
            </div>
            <p className="text-gray-300 text-[11px] leading-relaxed">
              Persisted in production repository for logged-in user:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Account Credentials Hash</li>
              <li>Security Profile Preferences</li>
              <li>Saved Scan History Items</li>
              <li>Bookmarked CVE Advisories</li>
              <li>Safe Vault Ciphertext (AES-GCM)</li>
            </ul>
          </GlassCard>

          <GlassCard className="p-5 border-cyan-500/30 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-brand-cyan font-bold uppercase tracking-wider text-[11px]">
              <Laptop className="w-4 h-4" /> Local Device Only
            </div>
            <p className="text-gray-300 text-[11px] leading-relaxed">
              Never sent to XTRACY servers under any circumstance:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Vault Encryption Passphrase</li>
              <li>Plaintext Vault Note Content</li>
              <li>Active Session Tokens</li>
              <li>Local UI Theme Choice</li>
            </ul>
          </GlassCard>

          <GlassCard className="p-5 border-purple-500/30 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-wider text-[11px]">
              <Lock className="w-4 h-4" /> Never Collected
            </div>
            <p className="text-gray-300 text-[11px] leading-relaxed">
              XTRACY strictly avoids invasive telemetry:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Physical GPS Location</li>
              <li>Phone Contacts / Address Book</li>
              <li>Camera / Microphone Streams</li>
              <li>Third-Party Tracking Cookies</li>
            </ul>
          </GlassCard>
        </div>

        {/* Client-Side Encryption Guarantee */}
        <GlassCard className="p-6 border-brand-blue/30 bg-gradient-to-r from-brand-blue/10 via-darkBg-card to-brand-violet/10 flex flex-col gap-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-cyan" /> Safe Vault Zero-Knowledge Architecture
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Your Safe Vault notes are encrypted inside your browser using the <strong>Web Crypto API (AES-GCM 256-bit)</strong> with PBKDF2 passphrase key derivation. Only the resulting encrypted ciphertext payload (<code className="text-brand-cyan">encryptedContent</code>, <code className="text-brand-cyan">iv</code>, <code className="text-brand-cyan">salt</code>) is sent to our servers. XTRACY servers cannot decrypt or read your vault plaintext.
          </p>
        </GlassCard>

        {/* Data Erasure Section */}
        <GlassCard className="p-6 border-red-500/40 bg-gradient-to-r from-red-950/40 via-darkBg-card to-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-950 border border-red-700/60 flex items-center justify-center text-red-400 shrink-0">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Permanently Delete Account Data</h3>
              <p className="text-xs text-gray-300 mt-1">
                Trigger a complete data wipe of all your saved scans, bookmarked advisories, incident logs, and vault records from XTRACY servers.
              </p>
            </div>
          </div>

          <button
            onClick={handleWipeData}
            disabled={isWiping}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-lg shrink-0 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isWiping ? 'Purging Data...' : 'Delete All Saved Data'}</span>
          </button>
        </GlassCard>
      </div>
    </ProtectedRoute>
  );
}
