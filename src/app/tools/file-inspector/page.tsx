'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataTrustBadge } from '@/components/ui/DataTrustBadge';
import {
  FileSearch,
  ShieldCheck,
  AlertTriangle,
  Info,
  Lock,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  FileCode,
  Layers,
} from 'lucide-react';

export default function FileInspectorToolPage() {
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: number;
    type: string;
    lastModified: string;
    sha256: string;
    sha512: string;
    isSuspiciousExt: boolean;
    extension: string;
  } | null>(null);

  const [compareHash, setCompareHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const bufferToHex = (buffer: ArrayBuffer): string => {
    const byteArray = new Uint8Array(buffer);
    return Array.from(byteArray)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      // 1. Read binary array buffer locally in browser memory
      const arrayBuffer = await file.arrayBuffer();

      // 2. Real WebCrypto streaming hashing
      const sha256Buffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const sha512Buffer = await crypto.subtle.digest('SHA-512', arrayBuffer);

      const sha256Hex = bufferToHex(sha256Buffer);
      const sha512Hex = bufferToHex(sha512Buffer);

      const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')).toLowerCase() : '';
      const dangerousExtensions = ['.exe', '.bat', '.cmd', '.vbs', '.ps1', '.scr', '.jar', '.iso', '.rar', '.dll', '.com', '.msi'];
      const isSuspiciousExt = dangerousExtensions.includes(ext);

      setFileInfo({
        name: file.name,
        size: file.size,
        type: file.type || 'Unknown MIME Type',
        lastModified: new Date(file.lastModified).toISOString(),
        sha256: sha256Hex,
        sha512: sha512Hex,
        isSuspiciousExt,
        extension: ext || 'No Extension',
      });
    } catch {
      alert('Error reading local file for hashing.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isMatch =
    fileInfo && compareHash.trim()
      ? compareHash.trim().toLowerCase() === fileInfo.sha256.toLowerCase() ||
        compareHash.trim().toLowerCase() === fileInfo.sha512.toLowerCase()
      : null;

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <FileSearch className="w-8 h-8 text-brand-cyan" />
              File Hash & Integrity Inspector
            </h1>
            <Badge type="productStatus" value="100% CLIENT WEBCRYPTO" size="sm" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Privacy-preserving binary file hashing (SHA-256 / SHA-512) and checksum match validator. Files never leave your browser memory.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero Server Upload</span>
        </div>
      </div>

      {/* Upload Zone */}
      <GlassCard className="p-8 border-brand-blue/30 flex flex-col items-center justify-center text-center gap-4 border-dashed border-2 cursor-pointer hover:border-brand-cyan transition-all">
        <FileSearch className="w-12 h-12 text-brand-cyan animate-pulse" />
        <div className="flex flex-col gap-1">
          <strong className="text-white text-sm">Select Local File to Hash & Audit Integrity</strong>
          <span className="text-xs text-gray-400">
            Computes authentic SHA-256 and SHA-512 checksums instantly using native WebCrypto API.
          </span>
        </div>

        <input type="file" onChange={handleFileSelect} className="hidden" id="file-upload" />
        <label
          htmlFor="file-upload"
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan hover:scale-105 text-white font-extrabold text-xs shadow-glowBlue transition-all cursor-pointer"
        >
          {loading ? 'Computing Checksums...' : 'Browse Local File'}
        </label>
      </GlassCard>

      {/* Results */}
      {fileInfo && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-brand-blue/20 text-brand-cyan">
                <FileCode className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Filename</span>
                <span className="text-sm font-extrabold text-white font-mono truncate block" title={fileInfo.name}>
                  {fileInfo.name}
                </span>
              </div>
            </GlassCard>

            <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-950 text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">File Size</span>
                <span className="text-sm font-extrabold text-purple-300 font-mono">
                  {(fileInfo.size / (1024 * 1024)).toFixed(2)} MB ({fileInfo.size.toLocaleString()} bytes)
                </span>
              </div>
            </GlassCard>

            <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
              <div
                className={`p-3 rounded-xl ${
                  fileInfo.isSuspiciousExt ? 'bg-red-950 text-red-400' : 'bg-emerald-950 text-emerald-400'
                }`}
              >
                {fileInfo.isSuspiciousExt ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Extension Risk</span>
                <span
                  className={`text-sm font-extrabold ${
                    fileInfo.isSuspiciousExt ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {fileInfo.isSuspiciousExt ? 'EXECUTABLE / PACKAGE' : 'SAFE DOCUMENT / MEDIA'}
                </span>
              </div>
            </GlassCard>
          </div>

          {/* Checksum Match Validator */}
          <GlassCard className="p-6 border-gray-800 flex flex-col gap-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Verify Checksum Against Expected Vendor Hash
            </span>
            <input
              type="text"
              value={compareHash}
              onChange={(e) => setCompareHash(e.target.value)}
              placeholder="Paste vendor SHA-256 or SHA-512 hash to verify file integrity..."
              className="w-full p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs font-mono focus:border-brand-cyan"
            />

            {compareHash && (
              <div
                className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
                  isMatch
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                    : 'bg-red-950/40 border-red-800 text-red-300'
                }`}
              >
                {isMatch ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                <div>
                  <strong className="block font-bold">{isMatch ? 'CHECKSUM VERIFIED MATCH' : 'INTEGRITY MISMATCH'}</strong>
                  <span className="text-[11px]">
                    {isMatch
                      ? 'The selected local file matches the expected hash perfectly. File is untampered.'
                      : 'The calculated file hash does not match the provided checksum.'}
                  </span>
                </div>
              </div>
            )}
          </GlassCard>

          {/* Computed Hashes */}
          <GlassCard className="p-6 border-gray-800 flex flex-col gap-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileCode className="w-4 h-4 text-brand-cyan" /> Calculated WebCrypto Hashes
            </span>

            {/* SHA-256 */}
            <div className="p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex flex-col gap-1 overflow-hidden">
                <span className="text-[10px] text-gray-400 font-bold uppercase">SHA-256 Digest:</span>
                <code className="text-brand-cyan font-mono text-xs break-all select-all">
                  {fileInfo.sha256}
                </code>
              </div>
              <button
                onClick={() => copyToClipboard(fileInfo.sha256, 'sha256')}
                className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white shrink-0 self-end sm:self-center"
              >
                {copiedKey === 'sha256' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* SHA-512 */}
            <div className="p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex flex-col gap-1 overflow-hidden">
                <span className="text-[10px] text-purple-400 font-bold uppercase">SHA-512 Digest:</span>
                <code className="text-purple-300 font-mono text-xs break-all select-all">
                  {fileInfo.sha512}
                </code>
              </div>
              <button
                onClick={() => copyToClipboard(fileInfo.sha512, 'sha512')}
                className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white shrink-0 self-end sm:self-center"
              >
                {copiedKey === 'sha512' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
