'use client';

import React, { useState } from 'react';
import { useVaultStore } from '@/store/useVaultStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Lock, Unlock, Key, Plus, Trash2, Shield, AlertCircle, FileText, Info } from 'lucide-react';

export const VaultManager: React.FC = () => {
  const { isUnlocked, notes, error, unlockVault, lockVault, addNote, deleteNote, purgeVault } = useVaultStore();

  const [passphraseInput, setPassphraseInput] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Incident Log' | 'Timeline Event' | 'Evidence Notes' | 'Recovery Steps' | 'General Safety Note'>('Incident Log');
  const [newContent, setNewContent] = useState('');
  const [newEvRef, setNewEvRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphraseInput.trim()) return;
    await unlockVault(passphraseInput.trim());
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmitting(true);
    const success = await addNote(newTitle.trim(), newCategory, newContent.trim(), newEvRef.trim());
    if (success) {
      setNewTitle('');
      setNewContent('');
      setNewEvRef('');
    }
    setIsSubmitting(false);
  };

  if (!isUnlocked) {
    return (
      <GlassCard className="max-w-md mx-auto p-8 border-brand-blue/30 shadow-2xl flex flex-col gap-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-blue/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan mx-auto shadow-glowBlue">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-xl font-black text-white flex items-center justify-center gap-2">
            Private XTRACY Safe Vault
            <Badge type="productStatus" value="WORKING" size="sm" />
          </h3>
          <p className="text-xs text-gray-300 mt-2 leading-relaxed">
            Client-side encrypted local vault using <strong>AES-GCM (256-bit)</strong> & PBKDF2 key derivation. Your notes stay 100% inside your browser.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-bold text-gray-300">Set or Enter Passphrase:</label>
            <input
              type="password"
              value={passphraseInput}
              onChange={(e) => setPassphraseInput(e.target.value)}
              placeholder="Enter your master vault passphrase..."
              className="w-full p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan text-sm"
              required
            />
          </div>

          {error && <p className="text-xs text-red-400 font-bold bg-red-950/60 p-2 rounded-lg">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-bold text-sm shadow-glowBlue hover:scale-[1.02] transition-all"
          >
            Unlock Encrypted Vault
          </button>
        </form>

        <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 text-[11px] text-gray-400 text-left flex items-start gap-2">
          <Info className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
          <p>
            <strong>LOCAL RETENTION DISCLAIMER:</strong> Data is encrypted locally in browser Web Storage. Clearing browser cache or losing your passphrase makes recovery impossible.
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Vault Header Bar */}
      <GlassCard className="p-4 border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
            <Unlock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Safe Vault Unlocked (AES-GCM 256-bit)
              <Badge type="productStatus" value="LOCAL ENCRYPTED" size="sm" />
            </h3>
            <p className="text-xs text-emerald-400">Active session encrypted in memory</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={lockVault}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-white transition-all flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Vault</span>
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to purge all encrypted vault notes from this browser?')) {
                purgeVault();
              }
            }}
            className="px-4 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800 text-xs font-bold text-red-300 transition-all"
          >
            Purge All Data
          </button>
        </div>
      </GlassCard>

      {/* Create New Encrypted Note Form */}
      <GlassCard className="p-6 border-brand-blue/30 shadow-xl">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider text-brand-cyan mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Encrypted Note / Incident Record
        </h4>

        <form onSubmit={handleAddNote} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 text-xs">
              <label className="font-bold text-gray-300">Note Title:</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Instagram Takeover Incident Timeline"
                className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 focus:border-brand-cyan text-sm"
                required
              />
            </div>

            <div className="flex flex-col gap-1 text-xs">
              <label className="font-bold text-gray-300">Category:</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-sm"
              >
                <option value="Incident Log">Incident Log</option>
                <option value="Timeline Event">Timeline Event</option>
                <option value="Evidence Notes">Evidence Notes</option>
                <option value="Recovery Steps">Recovery Steps</option>
                <option value="General Safety Note">General Safety Note</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-bold text-gray-300">Encrypted Content Body:</label>
            <textarea
              rows={4}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Enter incident notes, timestamps, usernames, or evidence details..."
              className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 focus:border-brand-cyan text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="self-end px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-bold text-xs shadow-glowBlue transition-all"
          >
            Encrypt & Store Note
          </button>
        </form>
      </GlassCard>

      {/* Encrypted Notes List */}
      <div className="flex flex-col gap-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider text-gray-300">
          Stored Encrypted Vault Records ({notes.length})
        </h4>

        {notes.length === 0 ? (
          <p className="text-xs text-gray-500 italic p-6 rounded-2xl border border-gray-800 text-center">
            Your encrypted vault is empty. Create your first incident note above.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {notes.map((note) => (
              <GlassCard key={note.id} className="p-5 border-gray-800 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800 text-[11px] font-bold">
                      {note.category}
                    </span>
                    <h5 className="font-bold text-white text-base">{note.title}</h5>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-gray-400">{new Date(note.timestamp).toLocaleString()}</span>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1.5 rounded-lg bg-red-950/80 border border-red-800 text-red-300 hover:text-white"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-200 leading-relaxed whitespace-pre-wrap bg-darkBg-panel/60 p-4 rounded-xl border border-gray-800/80">
                  {note.content}
                </p>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
