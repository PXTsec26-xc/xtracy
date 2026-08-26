'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { FeatureStatusBadge } from '@/components/ui/FeatureStatusBadge';
import { Dna, ShieldCheck, FileText, Plus, CheckCircle2, AlertTriangle, Upload, Clock, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface EvidenceItem {
  id: string;
  filename: string;
  fileSize: number;
  sha256Hash: string;
  uploadedAt: string;
  sourceDescription: string;
  itemType: 'ORIGINAL' | 'DERIVATIVE' | 'EXTRACTED_METADATA';
}

export default function EvidencePage() {
  const [caseName, setCaseName] = useState('');
  const [caseDescription, setCaseDescription] = useState('');
  const [authConfirmed, setAuthConfirmed] = useState(false);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [currentCaseId, setCurrentCaseId] = useState<string | null>(null);

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseName.trim() || !authConfirmed) return;

    const newCaseId = `XTR-CASE-${Math.floor(100000 + Math.random() * 900000)}`;
    setCurrentCaseId(newCaseId);
  };

  const handleSimulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    // Calculate SHA-256 in browser via WebCrypto
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const buffer = evt.target?.result as ArrayBuffer;
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const sha256Hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      const newItem: EvidenceItem = {
        id: `EVD-${Math.floor(10000 + Math.random() * 90000)}`,
        filename: file.name,
        fileSize: file.size,
        sha256Hash,
        uploadedAt: new Date().toISOString(),
        sourceDescription: 'User submitted evidence item',
        itemType: 'ORIGINAL',
      };

      setEvidenceList((prev) => [newItem, ...prev]);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Dna className="w-8 h-8 text-emerald-400" />
              Digital Evidence Preparation Center
            </h1>
            <Badge type="productStatus" value="CRYPTOGRAPHIC INTEGRITY" size="sm" />
          </div>
          <FeatureStatusBadge status="LOCAL" label="● LOCAL WEBCRYPTO SHA-256" />
        </div>
        <p className="text-xs text-gray-400">
          Organize evidence cases, compute SHA-256 hash chains, track original vs derivative items, and prepare structured dossiers.
        </p>
      </div>

      {/* Case Creation Form */}
      <GlassCard className="p-6 border-emerald-500/40 shadow-2xl flex flex-col gap-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider text-emerald-400 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create New Evidence Case Dossier
        </h2>

        <form onSubmit={handleCreateCase} className="flex flex-col gap-4 text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-300">Case Reference Name:</label>
            <input
              type="text"
              value={caseName}
              onChange={(e) => setCaseName(e.target.value)}
              placeholder="e.g. Incident 2026-A: Phishing Email & Wire Transfer Lure"
              className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs font-bold focus:border-emerald-400"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-300">Case Scope & Description:</label>
            <textarea
              value={caseDescription}
              onChange={(e) => setCaseDescription(e.target.value)}
              placeholder="Describe the incident timeline, affected accounts, and evidence scope..."
              rows={3}
              className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs resize-none focus:border-emerald-400"
            />
          </div>

          {/* Mandatory Authorization Acknowledgement */}
          <label className="flex items-start gap-2 text-[11px] text-gray-300 bg-darkBg-panel p-3 rounded-xl border border-gray-800 cursor-pointer">
            <input
              type="checkbox"
              checked={authConfirmed}
              onChange={(e) => setAuthConfirmed(e.target.checked)}
              className="mt-0.5 accent-emerald-400"
              required
            />
            <span>
              <strong className="text-white">AUTHORIZATION ACKNOWLEDGEMENT: </strong>
              I confirm that I own the target or have explicit authorization to assess it, or am using XTRACY solely for lawful defensive, educational, or evidence-preparation purposes.
            </span>
          </label>

          <button
            type="submit"
            disabled={!authConfirmed || !caseName.trim()}
            className="self-end px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Initialize Case Dossier</span>
          </button>
        </form>
      </GlassCard>

      {/* Active Case Workspace */}
      {currentCaseId && (
        <GlassCard className="p-6 border-gray-800 flex flex-col gap-6 text-xs animate-fadeIn">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">Active Case Dossier ID</span>
              <h3 className="text-lg font-bold text-white">{currentCaseId} — {caseName}</h3>
            </div>

            <label className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-glowBlue cursor-pointer flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span>Attach File & Calculate SHA-256</span>
              <input type="file" onChange={handleSimulateFileUpload} className="hidden" />
            </label>
          </div>

          {/* Evidence Inventory */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Evidence Items Inventory ({evidenceList.length})
            </h4>

            {evidenceList.length === 0 ? (
              <div className="p-8 rounded-xl bg-darkBg-panel/60 border border-gray-800 text-center text-gray-400 text-xs">
                No evidence items attached yet. Click &quot;Attach File &amp; Calculate SHA-256&quot; above to upload a sample file.
              </div>
            ) : (
              <div className="flex flex-col gap-3 font-mono">
                {evidenceList.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <strong className="text-white text-xs">{item.filename}</strong>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px]">
                          {item.itemType}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400">{(item.fileSize / 1024).toFixed(1)} KB</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-400">SHA-256 Checksum:</span>
                      <strong className="text-emerald-400 break-all">{item.sha256Hash}</strong>
                    </div>

                    <div className="flex items-center justify-between text-[10px] border-t border-gray-800/80 pt-1 text-gray-500">
                      <span>Item ID: {item.id}</span>
                      <Link href={`/verify/${currentCaseId}`} className="text-brand-cyan hover:underline flex items-center gap-1">
                        <span>Verify Integrity Checksum</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-[10px] text-gray-500 italic border-t border-gray-800 pt-3">
            Notice: Digital evidence organization records maintain SHA-256 data continuity. They do not constitute official law enforcement certification or court determination without formal legal process.
          </p>
        </GlassCard>
      )}
    </div>
  );
}
