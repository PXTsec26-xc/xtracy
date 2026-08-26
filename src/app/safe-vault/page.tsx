'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { FeatureStatusBadge } from '@/components/ui/FeatureStatusBadge';
import { Lock, Unlock, ShieldAlert, KeyRound, Download, Trash2, Clock, AlertTriangle, Plus, Eye, EyeOff } from 'lucide-react';
import { deriveKey, encryptText, decryptText, WebCryptoPayload } from '@/lib/crypto';

interface VaultItem {
  id: string;
  title: string;
  category: string;
  decryptedContent?: string;
  encryptedPayload: WebCryptoPayload;
  createdAt: string;
}

export default function SafeVaultPage() {
  const [masterPassword, setMasterPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Auto-lock & Emergency Lock states
  const [autoLockMinutes, setAutoLockMinutes] = useState(5);
  const [showExportWarning, setShowExportWarning] = useState(false);

  // Items
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Incident Evidence Note');
  const [content, setContent] = useState('');
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [derivedCryptoKey, setDerivedCryptoKey] = useState<CryptoKey | null>(null);

  // Auto-Lock Inactivity Timer
  useEffect(() => {
    if (!isUnlocked) return;

    const timer = setTimeout(() => {
      handleEmergencyLock();
    }, autoLockMinutes * 60 * 1000);

    return () => clearTimeout(timer);
  }, [isUnlocked, autoLockMinutes, vaultItems]);

  // Handle Master Vault Unlock via WebCrypto PBKDF2
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterPassword) return;

    try {
      // Derive PBKDF2 Key locally in browser memory
      const saltBytes = new TextEncoder().encode('xtracy-vault-salt-v2026');
      const key = await deriveKey(masterPassword, saltBytes);
      setDerivedCryptoKey(key);

      // Decrypt any existing stored ciphertext items
      const decryptedList = await Promise.all(
        vaultItems.map(async (item) => {
          try {
            const dec = await decryptText(item.encryptedPayload, key);
            return { ...item, decryptedContent: dec };
          } catch (err) {
            return item;
          }
        })
      );

      setVaultItems(decryptedList);
      setIsUnlocked(true);
    } catch (err) {
      alert('Failed to derive WebCrypto key. Please check password.');
    }
  };

  // Emergency Lock: Immediately wipes decrypted session state
  const handleEmergencyLock = () => {
    setIsUnlocked(false);
    setDerivedCryptoKey(null);
    setMasterPassword('');
    setVaultItems((prev) =>
      prev.map((item) => ({ ...item, decryptedContent: undefined }))
    );
  };

  // Add Item to Encrypted Vault
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !derivedCryptoKey) return;

    const payload = await encryptText(content, derivedCryptoKey);
    const newItem: VaultItem = {
      id: `VAULT-${Date.now().toString(36).toUpperCase()}`,
      title: title || 'Encrypted Security Note',
      category,
      decryptedContent: content,
      encryptedPayload: payload,
      createdAt: new Date().toISOString(),
    };

    setVaultItems([newItem, ...vaultItems]);
    setTitle('');
    setContent('');
  };

  // Secure Export Warning
  const handleConfirmExport = () => {
    const exportData = vaultItems.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      content: item.decryptedContent || '[ENCRYPTED CIPHERTEXT]',
      createdAt: item.createdAt,
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
            <Badge type="productStatus" value="AES-GCM 256-BIT WEBCRYPTO" size="sm" />
          </div>
          <FeatureStatusBadge status="LOCAL" label="● 100% LOCAL WEBCRYPTO" />
        </div>
        <p className="text-xs text-gray-400">
          Client-side WebCrypto AES-GCM 256-bit encrypted vault for sensitive incident notes and credentials. Passwords and keys are never transmitted to XTRACY servers.
        </p>
      </div>

      {/* Lock Status & Emergency Controls Bar */}
      <GlassCard className="p-6 border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {isUnlocked ? (
            <Unlock className="w-6 h-6 text-emerald-400 animate-pulse" />
          ) : (
            <Lock className="w-6 h-6 text-amber-400" />
          )}
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold">Vault Security Status</span>
            <h3 className="text-base font-bold text-white">
              {isUnlocked ? '🔓 Vault Unlocked (Decrypted Session Active)' : '🔒 Vault Locked (AES-GCM Encrypted)'}
            </h3>
          </div>
        </div>

        {isUnlocked && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-darkBg-panel px-3 py-1.5 rounded-xl border border-gray-800 text-xs">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-400">Auto-Lock:</span>
              <select
                value={autoLockMinutes}
                onChange={(e) => setAutoLockMinutes(Number(e.target.value))}
                className="bg-transparent text-white font-bold cursor-pointer focus:outline-none"
              >
                <option value={1} className="bg-darkBg">1 Min</option>
                <option value={5} className="bg-darkBg">5 Mins</option>
                <option value={15} className="bg-darkBg">15 Mins</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setShowExportWarning(true)}
              className="px-3.5 py-1.5 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-700 text-brand-cyan font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Decrypted</span>
            </button>

            <button
              type="button"
              onClick={handleEmergencyLock}
              className="px-4 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-glowBlue"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>EMERGENCY LOCK</span>
            </button>
          </div>
        )}
      </GlassCard>

      {/* Unlock Vault Form (If Locked) */}
      {!isUnlocked ? (
        <GlassCard className="p-8 border-gray-800 max-w-xl mx-auto w-full flex flex-col gap-4">
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-emerald-400" /> Enter Master Vault Password
          </h3>

          <form onSubmit={handleUnlock} className="flex flex-col gap-4 text-xs">
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                placeholder="Enter master password to derive PBKDF2 key..."
                className="w-full p-3.5 pr-12 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs focus:border-emerald-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Derive Key & Unlock Vault</span>
            </button>
          </form>
        </GlassCard>
      ) : (
        /* Add Item & Items List (If Unlocked) */
        <div className="flex flex-col gap-6">
          {/* Add Item Form */}
          <GlassCard className="p-6 border-emerald-500/30 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Encrypted Vault Note
            </h3>

            <form onSubmit={handleAddItem} className="flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="font-bold text-gray-300">Note Title:</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Incident Evidence Keys / Case Notes"
                    className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs focus:border-emerald-400"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-300">Category:</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs focus:border-emerald-400"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-300">Plaintext Note Content (Encrypted Locally via AES-GCM):</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type confidential note..."
                  rows={3}
                  className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs focus:border-emerald-400 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="self-end px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Encrypt & Store Note</span>
              </button>
            </form>
          </GlassCard>

          {/* Vault Items List */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Encrypted Vault Items ({vaultItems.length})
            </h3>

            {vaultItems.map((item) => (
              <GlassCard key={item.id} className="p-5 border-gray-800 flex flex-col gap-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-emerald-400 text-sm">{item.id}</span>
                  <span className="px-2.5 py-0.5 rounded bg-gray-900 text-gray-300 text-[10px] font-bold">
                    {item.category}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{item.title}</h4>

                {item.decryptedContent ? (
                  <div className="p-3 rounded-xl bg-darkBg-panel text-gray-200 border border-gray-800 font-mono text-[11px]">
                    {item.decryptedContent}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-darkBg-panel text-gray-500 font-mono text-[10px]">
                    [AES-GCM CIPHERTEXT LOCKED]
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Export Warning Modal */}
      {showExportWarning && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <GlassCard className="max-w-md w-full p-6 border-red-800 flex flex-col gap-4 text-xs">
            <div className="flex items-center gap-2 text-red-400 font-bold uppercase text-sm">
              <AlertTriangle className="w-5 h-5" /> Secure Export Warning
            </div>

            <p className="text-gray-300 leading-relaxed">
              Exporting decrypted records writes plain-text copies to your local device download folder. Exported files will no longer be protected by XTRACY WebCrypto client-side AES-GCM encryption.
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
    </div>
  );
}
