'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { FeatureStatusBadge } from '@/components/ui/FeatureStatusBadge';
import { useVaultStore } from '@/store/useVaultStore';
import { VaultNote } from '@/types';
import {
  Lock,
  Unlock,
  ShieldAlert,
  KeyRound,
  Download,
  Trash2,
  Clock,
  AlertTriangle,
  Plus,
  Eye,
  EyeOff,
} from 'lucide-react';

const VAULT_CATEGORIES: VaultNote['category'][] = [
  'Incident Log',
  'Timeline Event',
  'Evidence Notes',
  'Recovery Steps',
  'General Safety Note',
];

export default function SafeVaultPage() {
  const {
    isUnlocked,
    notes,
    encryptedRecords,
    error: storeError,
    unlockVault,
    lockVault,
    addNote,
    deleteNote,
    purgeVault,
  } = useVaultStore();

  const [masterPassword, setMasterPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  // Auto-lock & Export/Purge confirmation modals
  const [autoLockMinutes, setAutoLockMinutes] = useState(5);
  const [showExportWarning, setShowExportWarning] = useState(false);
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);

  // New note fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<VaultNote['category']>('Evidence Notes');
  const [evidenceRef, setEvidenceRef] = useState('');
  const [content, setContent] = useState('');

  // Auto-Lock Inactivity Timer
  useEffect(() => {
    if (!isUnlocked) return;

    const timer = setTimeout(() => {
      lockVault();
      setMasterPassword('');
      setStatusMessage('Vault automatically locked due to inactivity.');
    }, autoLockMinutes * 60 * 1000);

    return () => clearTimeout(timer);
  }, [isUnlocked, autoLockMinutes, notes.length, lockVault]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setStatusMessage(null);
    if (!masterPassword || masterPassword.length < 6) {
      setLocalError('Enter a master passphrase of at least 6 characters (12+ recommended).');
      return;
    }

    setIsBusy(true);
    try {
      const ok = await unlockVault(masterPassword);
      if (ok) {
        setMasterPassword('');
        setStatusMessage(
          encryptedRecords.length === 0
            ? 'New local encrypted vault initialized in browser storage.'
            : `Unlocked ${encryptedRecords.length} AES-256-GCM record(s) locally.`
        );
      } else {
        setLocalError('Unable to decrypt stored vault records with that passphrase.');
      }
    } finally {
      setIsBusy(false);
    }
  };

  const handleEmergencyLock = () => {
    lockVault();
    setMasterPassword('');
    setLocalError(null);
    setStatusMessage('Emergency lock triggered: decrypted notes wiped from session memory.');
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setStatusMessage(null);
    if (!content.trim() || !title.trim()) {
      setLocalError('Provide both a note title and content before encrypting.');
      return;
    }

    setIsBusy(true);
    try {
      const ok = await addNote(title.trim(), category, content.trim(), evidenceRef.trim() || undefined);
      if (ok) {
        setTitle('');
        setContent('');
        setEvidenceRef('');
        setStatusMessage('Note encrypted with PBKDF2 + unique random salt & 96-bit IV (AES-256-GCM).');
      } else {
        setLocalError('Encryption failed. Ensure vault is unlocked.');
      }
    } finally {
      setIsBusy(false);
    }
  };

  const handleConfirmExport = () => {
    const exportData = notes.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      evidenceReference: item.evidenceReference,
      content: item.content,
      timestamp: item.timestamp,
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xtracy-decrypted-vault-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportWarning(false);
  };

  const handleConfirmPurge = () => {
    purgeVault();
    setMasterPassword('');
    setShowPurgeConfirm(false);
    setStatusMessage('All encrypted vault records permanently removed from browser localStorage.');
  };

  const activeError = localError || storeError;

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Lock className="w-8 h-8 text-emerald-400" />
              Cryptographic Safe Vault
            </h1>
            <Badge type="productStatus" value="AES-256-GCM WEBCRYPTO" size="sm" />
          </div>
          <FeatureStatusBadge status="LOCAL" label="● BROWSER LOCALSTORAGE" />
        </div>
        <p className="text-xs text-gray-400">
          Client-side WebCrypto PBKDF2-SHA256 + AES-256-GCM encrypted vault with unique per-record random 128-bit salts and 96-bit IVs. Passphrases and plaintext notes never leave your browser.
        </p>
      </div>

      {/* Cryptographic Boundary Notice */}
      <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-700/40 text-xs text-amber-200 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-amber-300">Security Boundary Notice:</strong> Ciphertext is stored only in this browser&apos;s{' '}
          <code className="font-mono text-white">localStorage</code> ({encryptedRecords.length} record{encryptedRecords.length === 1 ? '' : 's'} currently stored). Clearing browser site data deletes vault entries permanently because XTRACY does not store your passphrase or recovery key. While unlocked, decrypted notes exist in JavaScript memory; use Emergency Lock when stepping away.
        </p>
      </div>

      {activeError && (
        <div role="alert" className="p-3.5 rounded-xl bg-red-950/70 border border-red-700/60 text-red-200 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{activeError}</span>
        </div>
      )}

      {statusMessage && !activeError && (
        <div role="status" className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-700/50 text-emerald-200 text-xs">
          {statusMessage}
        </div>
      )}

      {/* Lock Status & Emergency Controls Bar */}
      <GlassCard className="p-6 border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {isUnlocked ? (
            <Unlock className="w-6 h-6 text-emerald-400" />
          ) : (
            <Lock className="w-6 h-6 text-amber-400" />
          )}
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold">Vault Security Status</span>
            <h2 className="text-base font-bold text-white">
              {isUnlocked
                ? `Vault Unlocked (${notes.length} note${notes.length === 1 ? '' : 's'} in active session)`
                : `Vault Locked (${encryptedRecords.length} encrypted record${encryptedRecords.length === 1 ? '' : 's'})`}
            </h2>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          {isUnlocked && (
            <>
              <div className="flex items-center gap-1.5 bg-darkBg-panel px-3 py-1.5 rounded-xl border border-gray-800 text-xs">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <label htmlFor="vault-autolock-select" className="text-gray-400">
                  Auto-Lock:
                </label>
                <select
                  id="vault-autolock-select"
                  value={autoLockMinutes}
                  onChange={(e) => setAutoLockMinutes(Number(e.target.value))}
                  className="bg-transparent text-white font-bold cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded"
                >
                  <option value={1} className="bg-darkBg">1 Min</option>
                  <option value={5} className="bg-darkBg">5 Mins</option>
                  <option value={15} className="bg-darkBg">15 Mins</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setShowExportWarning(true)}
                disabled={notes.length === 0}
                className="px-3.5 py-1.5 rounded-xl bg-darkBg-panel hover:bg-gray-800 disabled:opacity-50 border border-gray-700 text-brand-cyan font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Decrypted</span>
              </button>

              <button
                type="button"
                onClick={handleEmergencyLock}
                className="px-4 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-glowBlue"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>EMERGENCY LOCK</span>
              </button>
            </>
          )}

          {encryptedRecords.length > 0 && (
            <button
              type="button"
              onClick={() => setShowPurgeConfirm(true)}
              className="px-3.5 py-1.5 rounded-xl bg-darkBg-panel hover:bg-red-950/60 border border-red-900/50 text-red-300 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge Local Vault</span>
            </button>
          )}
        </div>
      </GlassCard>

      {/* Unlock Vault Form (If Locked) */}
      {!isUnlocked ? (
        <GlassCard className="p-8 border-gray-800 max-w-xl mx-auto w-full flex flex-col gap-4">
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-emerald-400" />
            {encryptedRecords.length > 0 ? 'Unlock Existing Vault' : 'Initialize & Unlock Safe Vault'}
          </h3>

          <form onSubmit={handleUnlock} className="flex flex-col gap-4 text-xs">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="vault-master-password" className="font-bold text-gray-300">
                Master Vault Passphrase:
              </label>
              <div className="relative flex items-center">
                <input
                  id="vault-master-password"
                  type={showPassword ? 'text' : 'password'}
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  placeholder="Enter master passphrase (never transmitted)..."
                  className="w-full p-3.5 pr-12 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs focus:border-emerald-400"
                  required
                  minLength={6}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide master passphrase' : 'Show master passphrase'}
                  className="absolute right-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-glowBlue hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Unlock className="w-4 h-4" />
              <span>{isBusy ? 'Deriving Key & Decrypting...' : 'Derive PBKDF2 Key & Unlock Vault'}</span>
            </button>
          </form>
        </GlassCard>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Add Item Form */}
          <GlassCard className="p-6 border-emerald-500/30 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Encrypted Vault Note
            </h3>

            <form onSubmit={handleAddItem} className="flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="vault-note-title" className="font-bold text-gray-300">Note Title:</label>
                  <input
                    id="vault-note-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Case Evidence Keys"
                    className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs focus:border-emerald-400"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="vault-note-category" className="font-bold text-gray-300">Category:</label>
                  <select
                    id="vault-note-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as VaultNote['category'])}
                    className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs focus:border-emerald-400"
                  >
                    {VAULT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-darkBg">{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="vault-evidence-ref" className="font-bold text-gray-300">Evidence Ref (optional):</label>
                  <input
                    id="vault-evidence-ref"
                    type="text"
                    value={evidenceRef}
                    onChange={(e) => setEvidenceRef(e.target.value)}
                    placeholder="e.g. CASE-2026-01"
                    className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="vault-note-content" className="font-bold text-gray-300">
                  Plaintext Note Content (Encrypted Locally via AES-256-GCM):
                </label>
                <textarea
                  id="vault-note-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type confidential incident notes, hashes, or recovery steps..."
                  rows={3}
                  className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs focus:border-emerald-400 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isBusy}
                className="self-end px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-glowBlue hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-60"
              >
                <Lock className="w-4 h-4" />
                <span>Encrypt &amp; Save to Local Vault</span>
              </button>
            </form>
          </GlassCard>

          {/* Vault Items List */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Encrypted Vault Items ({notes.length})
            </h3>

            {notes.length === 0 ? (
              <GlassCard className="p-6 border-gray-800 text-xs text-gray-400 text-center">
                No notes stored in this vault yet. Add a note above to encrypt and persist it locally.
              </GlassCard>
            ) : (
              notes.map((item) => (
                <GlassCard key={item.id} className="p-5 border-gray-800 flex flex-col gap-3 text-xs">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-400 text-sm">{item.id}</span>
                      <span className="px-2.5 py-0.5 rounded bg-gray-900 text-gray-300 text-[10px] font-bold">
                        {item.category}
                      </span>
                      {item.evidenceReference && (
                        <span className="px-2 py-0.5 rounded bg-brand-blue/20 text-brand-cyan font-mono text-[10px]">
                          Ref: {item.evidenceReference}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteNote(item.id)}
                      aria-label={`Delete vault note ${item.title}`}
                      className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800/70 text-red-300 text-[11px] font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-white">{item.title}</h4>

                  <div className="p-3 rounded-xl bg-darkBg-panel text-gray-200 border border-gray-800 font-mono text-[11px] whitespace-pre-wrap break-words">
                    {item.content}
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </div>
      )}

      {/* Export Warning Modal */}
      {showExportWarning && (
        <div role="dialog" aria-modal="true" aria-labelledby="export-warning-title" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <GlassCard className="max-w-md w-full p-6 border-red-800 flex flex-col gap-4 text-xs">
            <div id="export-warning-title" className="flex items-center gap-2 text-red-400 font-bold uppercase text-sm">
              <AlertTriangle className="w-5 h-5" /> Secure Export Warning
            </div>

            <p className="text-gray-300 leading-relaxed">
              Exporting decrypted records writes plain-text copies to your local device download folder. Exported files will no longer be protected by XTRACY WebCrypto client-side AES-256-GCM encryption.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowExportWarning(false)}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmExport}
                className="px-6 py-2 rounded-xl bg-red-950 text-red-200 border border-red-800 font-bold text-xs"
              >
                I Understand, Export
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Purge Confirmation Modal */}
      {showPurgeConfirm && (
        <div role="dialog" aria-modal="true" aria-labelledby="purge-vault-title" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <GlassCard className="max-w-md w-full p-6 border-red-800 flex flex-col gap-4 text-xs">
            <div id="purge-vault-title" className="flex items-center gap-2 text-red-400 font-bold uppercase text-sm">
              <Trash2 className="w-5 h-5" /> Permanently Purge Local Vault?
            </div>

            <p className="text-gray-300 leading-relaxed">
              This removes all {encryptedRecords.length} encrypted record(s) from this browser&apos;s local storage immediately. Deleted records cannot be recovered unless you previously exported a backup.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPurgeConfirm(false)}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPurge}
                className="px-6 py-2 rounded-xl bg-red-950 text-red-200 border border-red-800 font-bold text-xs"
              >
                Purge Permanently
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
