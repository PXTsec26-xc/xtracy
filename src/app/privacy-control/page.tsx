'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataStorageBadge } from '@/components/ui/DataStorageBadge';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/store/useAuthStore';
import { useVaultStore } from '@/store/useVaultStore';
import { ShieldCheck, Download, Trash2, Database, AlertTriangle } from 'lucide-react';

export default function PrivacyControlCenterPage() {
  const { user, token, logout } = useAuthStore();
  const { encryptedRecords, purgeVault } = useVaultStore();

  const [deleted, setDeleted] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [serverSummary, setServerSummary] = useState<string | null>(null);

  const handleExportData = () => {
    const exportObject = {
      exportTimestamp: new Date().toISOString(),
      platform: 'XTRACY Cyber Intelligence Platform',
      user: {
        id: user?.id,
        email: user?.email,
        fullName: user?.fullName,
        userRole: user?.userRole,
      },
      localVaultMetadata: {
        encryptedRecordCount: encryptedRecords.length,
        note: 'Ciphertext remains encrypted locally via WebCrypto AES-256-GCM. Unlock Safe Vault to export plaintext notes separately.',
      },
      retentionPolicy:
        'Without a configured database, account sessions run in ephemeral server memory; client vaults and preferences remain in browser localStorage.',
    };

    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xtracy-user-data-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccountData = async () => {
    setDeleteError(null);
    setIsDeleting(true);
    try {
      let serverMsg = 'Local session and browser storage purged.';
      if (token) {
        const res = await fetch('/api/user/privacy', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json?.error?.message || 'Failed to purge server runtime records.');
        }
        if (json?.data?.message) {
          serverMsg = json.data.message;
        }
      }

      // Purge encrypted Safe Vault and XTRACY localStorage state
      purgeVault();
      if (typeof window !== 'undefined') {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && k.startsWith('xtracy')) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => window.localStorage.removeItem(k));
      }

      setServerSummary(serverMsg);
      logout();
      setDeleted(true);
      setConfirmingDelete(false);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Unable to complete data deletion.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ProtectedRoute
      fallbackTitle="Sign In to Manage Privacy & Data Controls"
      fallbackDescription="Inspect stored session data, export client metadata, and execute immediate server runtime & local storage deletion."
    >
      <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
                Privacy &amp; Data Controls Center
              </h1>
              <Badge type="productStatus" value="PRIVACY BY DESIGN" size="sm" />
            </div>
            <DataStorageBadge status="TEMPORARY" />
          </div>
          <p className="text-xs text-gray-400">
            Inspect actual data processing behavior, export account metadata, or purge server runtime records and local WebCrypto vaults.
          </p>
        </div>

        {/* Data Handling Transparency Matrix */}
        <GlassCard className="p-6 border-brand-blue/30 flex flex-col gap-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-brand-cyan flex items-center gap-2">
            <Database className="w-4 h-4" /> Transparent Data Processing Matrix
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-2">
              <strong className="text-emerald-400 font-bold uppercase text-[10px]">What XTRACY Processes</strong>
              <ul className="list-disc pl-4 text-gray-300 space-y-1">
                <li>Submitted URLs &amp; message samples during active inspection requests.</li>
                <li>Signed-in account email and PBKDF2-hashed credentials during runtime sessions.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-2">
              <strong className="text-brand-cyan font-bold uppercase text-[10px]">Where Data Is Held</strong>
              <ul className="list-disc pl-4 text-gray-300 space-y-1">
                <li>Runtime session records, scans &amp; bookmarks reside in ephemeral server memory unless an external database is connected.</li>
                <li>AES-256-GCM Safe Vault ciphertexts stay in your browser&apos;s <code className="text-white">localStorage</code> ({encryptedRecords.length} record{encryptedRecords.length === 1 ? '' : 's'}).</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-2">
              <strong className="text-red-400 font-bold uppercase text-[10px]">What XTRACY NEVER Collects</strong>
              <ul className="list-disc pl-4 text-gray-300 space-y-1">
                <li>Plaintext Safe Vault master passphrases or decrypted vault notes.</li>
                <li>Passwords checked in Password Health Lab (100% browser-local entropy math).</li>
                <li>Device GPS location, phone contacts, or third-party ad trackers.</li>
              </ul>
            </div>
          </div>
        </GlassCard>

        {deleteError && (
          <div role="alert" className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{deleteError}</span>
          </div>
        )}

        {/* Account Data Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6 border-gray-800 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-brand-cyan" /> Export Account Data Package
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Download a machine-readable JSON snapshot containing your current session profile details and local vault metadata.
              </p>
            </div>
            <button
              type="button"
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
                <Trash2 className="w-5 h-5 text-red-400" /> Account &amp; Local Vault Deletion
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Invoke <code className="font-mono text-gray-300">DELETE /api/user/privacy</code> to purge runtime server stores and clear all local XTRACY vaults and preferences.
              </p>
            </div>

            {deleted ? (
              <div role="status" className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 font-bold text-xs">
                {serverSummary || 'Account session and local vault purged.'}
              </div>
            ) : confirmingDelete ? (
              <div className="flex flex-col gap-3 p-3 rounded-xl bg-red-950/50 border border-red-800/70">
                <p className="text-xs text-red-200 font-semibold">
                  Confirm permanent deletion of runtime server records and local encrypted vault?
                </p>
                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    disabled={isDeleting}
                    className="px-3.5 py-2 rounded-lg bg-gray-800 text-gray-200 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccountData}
                    disabled={isDeleting}
                    className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white text-xs font-extrabold disabled:opacity-60"
                  >
                    {isDeleting ? 'Purging...' : 'Confirm Permanent Purge'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
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
