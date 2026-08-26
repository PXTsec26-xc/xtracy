'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataTrustBadge } from '@/components/ui/DataTrustBadge';
import {
  Lock,
  Search,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Server,
  Layers,
} from 'lucide-react';

export default function SslInspectorPage() {
  const [host, setHost] = useState('google.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleInspect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!host.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/tools/ssl-inspector', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error?.message || 'Failed to inspect SSL/TLS certificate.');
      } else {
        setResult(data.data);
      }
    } catch {
      setError('Connection failed during TLS handshake.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sampleHosts = ['github.com', 'cloudflare.com', 'wikipedia.org', 'google.com'];

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Lock className="w-8 h-8 text-emerald-400" />
              SSL / TLS Certificate Inspector
            </h1>
            <Badge type="productStatus" value="STANDALONE TOOL" size="sm" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Live TLS handshake certificate inspection: issuer authority, validity window, SANs, cipher suite, and fingerprint verification.
          </p>
        </div>

        <DataTrustBadge status="LIVE" sourceName="XTRACY TLS Handshake" />
      </div>

      {/* Input */}
      <GlassCard className="p-6 border-brand-blue/30 flex flex-col gap-4">
        <form onSubmit={handleInspect} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Server className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="Enter domain name (e.g. github.com)"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-brand-cyan transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Performing TLS Handshake...' : 'Inspect TLS Certificate'}</span>
          </button>
        </form>

        {/* Quick Samples */}
        <div className="flex items-center gap-2 flex-wrap text-[11px] text-gray-400">
          <span className="font-semibold text-gray-500">Quick Samples:</span>
          {sampleHosts.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setHost(s)}
              className="px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 text-[10px] font-mono transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Top Validity & Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
              <div
                className={`p-3 rounded-xl ${
                  result.validity.status === 'VALID'
                    ? 'bg-emerald-950 text-emerald-400'
                    : 'bg-red-950 text-red-400'
                }`}
              >
                {result.validity.status === 'VALID' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Certificate Status</span>
                <span className="text-sm font-extrabold text-white">{result.validity.status}</span>
              </div>
            </GlassCard>

            <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-brand-blue/20 text-brand-cyan">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Days Remaining</span>
                <span className="text-sm font-extrabold text-brand-cyan">{result.validity.daysRemaining} Days</span>
              </div>
            </GlassCard>

            <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-950 text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Protocol & Cipher</span>
                <span className="text-xs font-semibold text-gray-200">{result.protocolVersion}</span>
              </div>
            </GlassCard>
          </div>

          {/* Certificate Hierarchy & Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subject (Issued To) */}
            <GlassCard className="p-6 border-gray-800 flex flex-col gap-3">
              <span className="text-xs font-bold text-brand-cyan uppercase tracking-wider">
                Issued To (Subject)
              </span>
              <div className="flex flex-col gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-darkBg-panel border border-gray-800 flex justify-between">
                  <span className="text-gray-400">Common Name (CN):</span>
                  <strong className="text-white font-mono">{result.subject.commonName}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-darkBg-panel border border-gray-800 flex justify-between">
                  <span className="text-gray-400">Organization (O):</span>
                  <strong className="text-white">{result.subject.organization}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-darkBg-panel border border-gray-800 flex justify-between">
                  <span className="text-gray-400">Country (C):</span>
                  <strong className="text-white">{result.subject.country}</strong>
                </div>
              </div>
            </GlassCard>

            {/* Issuer (Certificate Authority) */}
            <GlassCard className="p-6 border-gray-800 flex flex-col gap-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Issued By (Certificate Authority)
              </span>
              <div className="flex flex-col gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-darkBg-panel border border-gray-800 flex justify-between">
                  <span className="text-gray-400">CA Common Name:</span>
                  <strong className="text-white font-mono">{result.issuer.commonName}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-darkBg-panel border border-gray-800 flex justify-between">
                  <span className="text-gray-400">CA Organization:</span>
                  <strong className="text-white">{result.issuer.organization}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-darkBg-panel border border-gray-800 flex justify-between">
                  <span className="text-gray-400">CA Country:</span>
                  <strong className="text-white">{result.issuer.country}</strong>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Validity & Fingerprints */}
          <GlassCard className="p-6 border-gray-800 flex flex-col gap-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Cryptographic Fingerprints & Validity Dates
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 uppercase">Valid From (Activation)</span>
                <span className="text-white font-mono">{new Date(result.validity.validFrom).toUTCString()}</span>
              </div>
              <div className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 uppercase">Valid Until (Expiration)</span>
                <span className="text-white font-mono">{new Date(result.validity.validTo).toUTCString()}</span>
              </div>
              <div className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1 break-all">
                <span className="text-[10px] text-gray-400 uppercase">SHA-256 Fingerprint</span>
                <span className="text-brand-cyan font-mono text-[11px]">{result.fingerprints.sha256}</span>
              </div>
              <div className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 uppercase">Serial Number</span>
                <span className="text-gray-300 font-mono text-[11px]">{result.fingerprints.serialNumber}</span>
              </div>
            </div>
          </GlassCard>

          {/* Subject Alternative Names (SANs) */}
          {result.subjectAltNames?.length > 0 && (
            <GlassCard className="p-6 border-gray-800 flex flex-col gap-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-cyan" /> Covered Subject Alternative Names (SANs) ({result.subjectAltNames.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {result.subjectAltNames.map((san: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-darkBg-panel border border-gray-800 text-gray-300 font-mono text-[11px]"
                  >
                    {san}
                  </span>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      )}
    </div>
  );
}
