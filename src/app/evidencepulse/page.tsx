'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { FeatureStatusBadge } from '@/components/ui/FeatureStatusBadge';
import {
  EvidenceItem,
  IntegritySummary,
  AnomalyReport,
  GENESIS_HASH,
  calculateSHA256,
  constructEvidenceManifest,
  calculateManifestHash,
  calculateRecordHash,
  verifyEvidenceChain,
} from '@/lib/evidencePulse';
import {
  ShieldCheck,
  ShieldAlert,
  Dna,
  Plus,
  FileCheck,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Download,
} from 'lucide-react';

export default function EvidencePulsePage() {
  const [items, setItems] = useState<EvidenceItem[]>([]);
  const [viewMode, setViewMode] = useState<'VICTIM' | 'INVESTIGATION'>('INVESTIGATION');
  const [showCalculationModal, setShowCalculationModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EvidenceItem['category']>('PHISHING');
  const [platform, setPlatform] = useState('Email / Web');
  const [description, setDescription] = useState('');
  const [incidentTimestamp, setIncidentTimestamp] = useState(new Date().toISOString().substring(0, 16));
  const [fileHash, setFileHash] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Analysis
  const [summary, setSummary] = useState<IntegritySummary>({
    totalItems: 0,
    verifiedCount: 0,
    hashChainIntact: true,
    missingMetadataCount: 0,
    duplicateCount: 0,
    anomalyCount: 0,
    continuityScore: 100,
  });
  const [anomalies, setAnomalies] = useState<AnomalyReport[]>([]);

  // Initial Sample Evidence Data
  useEffect(() => {
    const initSamples = async () => {
      const sample1Hash = await calculateSHA256('Sample Suspicious Phishing Email Content 2026');
      const manifest1 = constructEvidenceManifest({
        evidenceId: 'XTR-EVD-2026-001',
        caseId: 'XTR-CASE-2026-001',
        sequence: 1,
        incidentTimestamp: '2026-08-25T14:30',
        acquiredAt: new Date().toISOString(),
        fileName: 'phishing_lure.eml',
        mimeType: 'message/rfc822',
        fileSize: 4096,
        fileHash: sample1Hash,
        previousRecordHash: GENESIS_HASH,
      });

      const manifestHash1 = await calculateManifestHash(manifest1);

      const item1Base: EvidenceItem = {
        id: 'XTR-EVD-2026-001',
        caseId: 'XTR-CASE-2026-001',
        sequence: 1,
        title: 'Initial Suspicious Verification Email',
        category: 'PHISHING',
        platform: 'Gmail',
        description: 'Received email claiming urgent debit card blocking with suspicious link.',
        incidentTimestamp: '2026-08-25T14:30',
        acquiredAt: new Date().toISOString(),
        fileName: 'phishing_lure.eml',
        mimeType: 'message/rfc822',
        fileSize: 4096,
        originalFileHash: sample1Hash,
        currentFileHash: sample1Hash,
        previousRecordHash: GENESIS_HASH,
        manifestHash: manifestHash1,
        currentRecordHash: '',
        schemaVersion: '2.1.0',
        verificationStatus: 'VERIFIED',
        metadata: { fileName: 'phishing_lure.eml', fileSize: 4096 },
      };

      const recordHash1 = await calculateRecordHash(item1Base);
      const item1 = { ...item1Base, currentRecordHash: recordHash1 };

      const initialList: EvidenceItem[] = [item1];
      setItems(initialList);
      const res = await verifyEvidenceChain(initialList);
      setSummary(res.summary);
      setAnomalies(res.anomalies);
    };

    initSamples();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(file.size);

    const arrayBuffer = await file.arrayBuffer();
    const hash = await calculateSHA256(arrayBuffer);
    setFileHash(hash);
  };

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setLoading(true);

    const nextSeq = items.length + 1;
    const nextId = `XTR-EVD-2026-${nextSeq.toString().padStart(3, '0')}`;
    const prevHash = items.length > 0 ? items[items.length - 1].currentRecordHash : GENESIS_HASH;
    const computedFileHash = fileHash || (await calculateSHA256(`${title}-${description}-${incidentTimestamp}`));
    const fname = fileName || 'evidence_note.txt';

    const manifest = constructEvidenceManifest({
      evidenceId: nextId,
      caseId: 'XTR-CASE-2026-001',
      sequence: nextSeq,
      incidentTimestamp,
      acquiredAt: new Date().toISOString(),
      fileName: fname,
      mimeType: 'text/plain',
      fileSize: fileSize || 1024,
      fileHash: computedFileHash,
      previousRecordHash: prevHash,
    });

    const mHash = await calculateManifestHash(manifest);

    const newItemBase: EvidenceItem = {
      id: nextId,
      caseId: 'XTR-CASE-2026-001',
      sequence: nextSeq,
      title,
      category,
      platform,
      description,
      incidentTimestamp,
      acquiredAt: new Date().toISOString(),
      fileName: fname,
      mimeType: 'text/plain',
      fileSize: fileSize || 1024,
      originalFileHash: computedFileHash,
      currentFileHash: computedFileHash,
      previousRecordHash: prevHash,
      manifestHash: mHash,
      currentRecordHash: '',
      schemaVersion: '2.1.0',
      verificationStatus: 'VERIFIED',
      metadata: { fileName: fname, fileSize: fileSize || 1024 },
    };

    const recHash = await calculateRecordHash(newItemBase);
    const completeItem = { ...newItemBase, currentRecordHash: recHash };

    const updatedList = [...items, completeItem];
    setItems(updatedList);

    const res = await verifyEvidenceChain(updatedList);
    setSummary(res.summary);
    setAnomalies(res.anomalies);

    setTitle('');
    setDescription('');
    setFileName('');
    setFileHash('');
    setFileSize(0);
    setLoading(false);
  };

  const handleSimulateTamper = async (id: string) => {
    const updated = await Promise.all(
      items.map(async (item) => {
        if (item.id === id) {
          const tamperedHash = await calculateSHA256(`TAMPERED_CONTENT_${Date.now()}`);
          return { ...item, currentFileHash: tamperedHash, verificationStatus: 'MISMATCH' as const };
        }
        return item;
      })
    );

    setItems(updated);
    const res = await verifyEvidenceChain(updated);
    setSummary(res.summary);
    setAnomalies(res.anomalies);
  };

  const handleExportVerificationPackage = () => {
    const exportPackage = {
      schemaVersion: '2.1.0',
      caseId: 'XTR-CASE-2026-001',
      exportedAt: new Date().toISOString(),
      evidenceManifests: items.map((i) => ({
        evidenceId: i.id,
        sequence: i.sequence,
        manifestHash: i.manifestHash,
        fileHash: i.originalFileHash,
        previousRecordHash: i.previousRecordHash,
        currentRecordHash: i.currentRecordHash,
      })),
      disclaimer: 'XTRACY technical verification package for independent verification.',
    };

    const blob = new Blob([JSON.stringify(exportPackage, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xtracy-verification-package-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Disclaimer */}
      <div className="p-3.5 rounded-xl bg-gray-900/90 border border-gray-800 text-[11px] text-gray-400 leading-relaxed flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
        <div>
          <strong className="text-white font-bold">XTRACY TECHNICAL BOUNDARY: </strong>
          XTRACY EvidencePulse™ provides tamper-evident evidence organization and RFC 8785 cryptographic verification. XTRACY is not a law-enforcement system and does not guarantee legal admissibility in court.
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Dna className="w-8 h-8 text-brand-cyan" />
              EvidencePulse™ — Cryptographic Evidence Continuity Engine
            </h1>
            <Badge type="productStatus" value="FLAGSHIP ENGINE" size="sm" />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportVerificationPackage}
              className="px-3 py-1 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-700 text-brand-cyan font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Verification Package</span>
            </button>
            <FeatureStatusBadge status="LOCAL" label="● LOCAL CRYPTO" />
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Cryptographic evidence organization, RFC 8785 canonical manifest generation, SHA-256 hash chaining, and real-time tamper-evident anomaly detection.
        </p>
      </div>

      {/* Live Integrity Monitor & Continuity Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 border-brand-cyan/40 flex flex-col items-center justify-center text-center gap-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Evidence Continuity Score
          </span>
          <div className="relative flex items-center justify-center">
            <span className="text-5xl font-black text-white">{summary.continuityScore}</span>
            <span className="text-sm font-bold text-gray-500 ml-1">/100</span>
          </div>

          <Badge
            type="risk"
            value={summary.continuityScore >= 85 ? 'STRONG' : summary.continuityScore >= 60 ? 'MODERATE' : 'CRITICAL'}
            size="md"
          />

          <button
            type="button"
            onClick={() => setShowCalculationModal(!showCalculationModal)}
            className="text-[11px] font-bold text-brand-cyan hover:underline flex items-center gap-1 mt-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How is this calculated?</span>
          </button>
        </GlassCard>

        <GlassCard className="lg:col-span-2 p-6 border-gray-800 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" /> Live Cryptographic Integrity Monitor
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold ${
                summary.anomalyCount === 0
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-red-950 text-red-300 border border-red-800'
              }`}
            >
              {summary.anomalyCount === 0 ? '🟢 VERIFIED' : '⚠️ ANOMALY DETECTED'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-0.5">
              <span className="text-[10px] text-gray-400">Total Items:</span>
              <strong className="text-white text-base font-mono">{summary.totalItems}</strong>
            </div>

            <div className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-0.5">
              <span className="text-[10px] text-gray-400">Integrity Matches:</span>
              <strong className="text-emerald-400 text-base font-mono">
                {summary.verifiedCount}/{summary.totalItems}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-0.5">
              <span className="text-[10px] text-gray-400">Hash-Chain Status:</span>
              <strong className={summary.hashChainIntact ? 'text-emerald-400 text-base' : 'text-red-400 text-base'}>
                {summary.hashChainIntact ? 'INTACT' : 'BROKEN'}
              </strong>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Add Evidence Form */}
      <GlassCard className="p-6 border-brand-blue/40 flex flex-col gap-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-cyan flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Evidence Item to Continuity Chain
        </h3>

        <form onSubmit={handleAddEvidence} className="flex flex-col gap-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="font-bold text-gray-300">Evidence Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Harassment Direct Message Screenshot"
                className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs focus:border-brand-cyan"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-gray-300">Incident Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs font-bold"
              >
                <option value="PHISHING">Phishing Attempt</option>
                <option value="STALKING">Digital Stalking</option>
                <option value="HARASSMENT">Online Harassment</option>
                <option value="IMPERSONATION">Profile Impersonation</option>
                <option value="FRAUD">Financial Fraud</option>
                <option value="SUSPICIOUS_COMMUNICATION">Suspicious Communication</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-gray-300">Incident Date & Time (User-Provided):</label>
              <input
                type="datetime-local"
                value={incidentTimestamp}
                onChange={(e) => setIncidentTimestamp(e.target.value)}
                className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs focus:border-brand-cyan"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-gray-300">Platform / Service Origin:</label>
              <input
                type="text"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                placeholder="e.g. WhatsApp, Email, Instagram"
                className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs focus:border-brand-cyan"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-300">Event Description & Notes:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe event context..."
              rows={3}
              className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs focus:border-brand-cyan resize-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-300">Attach Evidence File (Calculates SHA-256 Hash):</label>
            <input
              type="file"
              onChange={handleFileSelect}
              className="p-2 rounded-xl bg-darkBg-panel border border-gray-800 text-gray-300 text-xs cursor-pointer"
            />
            {fileHash && (
              <span className="text-[10px] text-emerald-400 font-mono">
                ✓ SHA-256 Fingerprint: {fileHash}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="self-end px-8 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{loading ? 'Canonicalizing & Linking...' : 'Add to Evidence Continuity Chain'}</span>
          </button>
        </form>
      </GlassCard>

      {/* Incident Reconstruction Timeline */}
      <GlassCard className="p-6 border-gray-800 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            Incident Reconstruction Timeline ({items.length} Records)
          </h3>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('VICTIM')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'VICTIM'
                  ? 'bg-brand-blue text-white shadow-glowBlue'
                  : 'bg-darkBg-panel text-gray-400 border border-gray-800'
              }`}
            >
              Victim View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('INVESTIGATION')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'INVESTIGATION'
                  ? 'bg-brand-blue text-white shadow-glowBlue'
                  : 'bg-darkBg-panel text-gray-400 border border-gray-800'
              }`}
            >
              Investigation View
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-darkBg-panel/80 border border-gray-800 flex flex-col gap-3 text-xs"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-brand-cyan text-sm">{item.id}</span>
                  <span className="px-2 py-0.5 rounded bg-gray-900 text-purple-300 font-bold text-[10px] border border-gray-800">
                    Seq #{item.sequence}
                  </span>
                  <span className="text-gray-400 text-[11px]">via {item.platform}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase flex items-center gap-1 ${
                      item.verificationStatus === 'VERIFIED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-red-950 text-red-300 border border-red-800'
                    }`}
                  >
                    {item.verificationStatus === 'VERIFIED' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-red-400" />}
                    {item.verificationStatus}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleSimulateTamper(item.id)}
                    className="px-2.5 py-1 rounded bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 font-bold text-[10px] transition-all"
                  >
                    Test Tamper Detection
                  </button>
                </div>
              </div>

              <h4 className="text-sm font-bold text-white">{item.title}</h4>
              <p className="text-gray-300 leading-relaxed">{item.description}</p>

              {viewMode === 'INVESTIGATION' ? (
                <div className="p-3 rounded-xl bg-darkBg border border-gray-800/80 font-mono text-[10px] text-gray-400 flex flex-col gap-1">
                  <div>SHA-256 Fingerprint: <span className="text-brand-cyan">{item.originalFileHash}</span></div>
                  <div>Manifest Hash (JCS): <span className="text-emerald-400">{item.manifestHash}</span></div>
                  <div>Previous Link Hash:  <span className="text-gray-500">{item.previousRecordHash}</span></div>
                  <div>Incident Timestamp:  <span className="text-white">{item.incidentTimestamp}</span></div>
                  <div>Acquired Timestamp:  <span className="text-gray-400">{item.acquiredAt}</span></div>
                </div>
              ) : (
                <div className="text-[11px] text-gray-400 flex items-center gap-4">
                  <span>Incident Date: {new Date(item.incidentTimestamp).toLocaleDateString()}</span>
                  {item.fileName && <span>Attached File: {item.fileName}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
