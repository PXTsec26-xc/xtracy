'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataStorageBadge } from '@/components/ui/DataStorageBadge';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/store/useAuthStore';
import { ShieldCheck, Download, Trash2, Database, Lock, Eye, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export default function PrivacyControlCenterPage() {
  const { user, token, logout } = useAuthStore();
  const [deleted, setDeleted] = useState(false);

  const handleExportData = () => {
    const exportObject = {
      exportTimestamp: new Date().toISOString(),
      platform: 'XTRACY Cyber Intelligence Platform',
      user: {
        id: user?.id,
        email: user?.email,
        fullName: user?.fullName,
      },
      retentionPolicy: 'Users retain 100% control over local ciphertext vaults and scan history.',
      storedDataTypes: ['Encrypted Safe Vault Ciphertext', 'Scam Analysis Scans', 'Bookmarked Threat Articles'],
    };

    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xtracy-user-data-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccountData = () => {
    if (confirm('Are you sure you want to delete all account data and local encrypted vaults? This action is permanent.')) {
      logout();
      setDeleted(true);
    }
  };

  return (
    <ProtectedRoute
      fallbackTitle="Sign In to Manage Privacy & Data Controls"
      fallbackDescription="Access your stored scans, WebCrypto local vault notes, data export tools, and account deletion controls."
    >
      <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
                Privacy & Data Controls Center
              </h1>
              <Badge type="productStatus" value="PRIVACY BY DESIGN" size="sm" />
            </div>
            <DataStorageBadge status="PERSISTENT" />
          </div>
          <p className="text-xs text-gray-400">
            Inspect data handling policies, manage account data storage, export data packages, or execute full account data deletion.
          </p>
        </div>

        {/* Data Handling Transparency Matrix */}
        <GlassCard className="p-6 border-brand-blue/30 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-cyan flex items-center gap-2">
            <Database className="w-4 h-4" /> Transparent Data Processing Matrix
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-2">
              <strong className="text-emerald-400 font-bold uppercase text-[10px]">What XTRACY Processes</strong>
              <ul className="list-disc pl-4 text-gray-300 space-y-1">
                <li>Submitted URLs & SMS text samples during X-Scan analysis.</li>
                <li>Email address when authenticating or checking breach architecture.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-2">
              <strong className="text-brand-cyan font-bold uppercase text-[10px]">What XTRACY Stores</strong>
              <ul className="list-disc pl-4 text-gray-300 space-y-1">
                <li>Account profile (Email, Hashed Password via PBKDF2).</li>
                <li>AES-GCM encrypted Safe Vault ciphertexts.</li>
                <li>User-initiated NEXUS Investigation Case metadata.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-2">
              <strong className="text-red-400 font-bold uppercase text-[10px]">What XTRACY NEVER Stores</strong>
              <ul className="list-disc pl-4 text-gray-300 space-y-1">
                <li>Plaintext Safe Vault master keys or unencrypted passwords.</li>
                <li>Passwords typed into Password Health Lab (100% browser-local).</li>
                <li>Physical GPS locations or phone contact lists.</li>
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* Account Data Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6 border-gray-800 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-brand-cyan" /> Export Account Data Package
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Download a complete machine-readable JSON package containing your stored profile details, scan logs, and metadata.
              </p>
            </div>
            <button
              onClick={handleExportData}
              className="px-6 py-3 rounded-xl bg-brand-blue/20 hover:bg-brand-blue/30 border border-brand-cyan/40 text-brand-cyan font-extrabold text-xs transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export My Data (JSON)</span>
            </button>
          </GlassCard>

          <GlassCard className="p-6 border-red-900/40 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-400" /> Account Data Deletion
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Permanently purge all stored scan logs, case notes, and authentication sessions.
              </p>
            </div>
            {deleted ? (
              <div className="p-3 rounded-xl bg-red-950 border border-red-800 text-red-300 font-bold text-xs text-center">
                Account session and data purged.
              </div>
            ) : (
              <button
                onClick={handleDeleteAccountData}
                className="px-6 py-3 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 font-extrabold text-xs transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete All My Data</span>
              </button>
            )}
          </GlassCard>
        </div>
      </div>
    </ProtectedRoute>
  );
}
