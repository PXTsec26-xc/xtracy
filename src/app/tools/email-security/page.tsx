'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataTrustBadge } from '@/components/ui/DataTrustBadge';
import {
  Mail,
  Search,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  Check,
  Info,
  Layers,
} from 'lucide-react';

export default function EmailSecurityPage() {
  const [domain, setDomain] = useState('google.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/tools/email-security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error?.message || 'Failed to analyze email security records.');
      } else {
        setResult(data.data);
      }
    } catch {
      setError('Connection failed during email security DNS query.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sampleDomains = ['google.com', 'github.com', 'microsoft.com', 'cloudflare.com'];

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Mail className="w-8 h-8 text-brand-cyan" />
              Email Security Record Analyzer (SPF, DMARC, DKIM)
            </h1>
            <Badge type="productStatus" value="STANDALONE TOOL" size="sm" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Real-time DNS audit of Sender Policy Framework (SPF), DMARC anti-spoofing policies, and Mail Exchanger configurations.
          </p>
        </div>

        <DataTrustBadge status="LIVE" sourceName="XTRACY Email Security Resolver" />
      </div>

      {/* Input */}
      <GlassCard className="p-6 border-brand-blue/30 flex flex-col gap-4">
        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter domain (e.g. yourcompany.com)"
            className="flex-1 px-4 py-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs font-mono placeholder:text-gray-500 focus:outline-none focus:border-brand-cyan transition-colors"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Inspecting SPF & DMARC...' : 'Analyze Email Security'}</span>
          </button>
        </form>

        {/* Quick Samples */}
        <div className="flex items-center gap-2 flex-wrap text-[11px] text-gray-400">
          <span className="font-semibold text-gray-500">Quick Samples:</span>
          {sampleDomains.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setDomain(s)}
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
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
              <div
                className={`p-3 rounded-xl ${
                  result.securityScore >= 80
                    ? 'bg-emerald-950 text-emerald-400'
                    : result.securityScore >= 50
                    ? 'bg-amber-950 text-amber-400'
                    : 'bg-red-950 text-red-400'
                }`}
              >
                {result.securityScore >= 80 ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <ShieldAlert className="w-5 h-5" />
                )}
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Anti-Spoofing Score</span>
                <span className="text-sm font-extrabold text-white">{result.securityScore} / 100 ({result.postureLevel})</span>
              </div>
            </GlassCard>

            <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-brand-blue/20 text-brand-cyan">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">SPF Policy</span>
                <span className="text-xs font-semibold text-emerald-400">
                  {result.spf.present ? 'CONFIGURED' : 'MISSING'}
                </span>
              </div>
            </GlassCard>

            <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-950 text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">DMARC Policy</span>
                <span className="text-xs font-semibold text-purple-300">
                  {result.dmarc.present ? `p=${result.dmarc.policy}` : 'MISSING'}
                </span>
              </div>
            </GlassCard>
          </div>

          {/* SPF & DMARC Deep Dive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SPF Card */}
            <GlassCard className="p-6 border-gray-800 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
                  <span className="text-xs font-bold text-brand-cyan uppercase tracking-wider">
                    Sender Policy Framework (SPF)
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      result.spf.present ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'
                    }`}
                  >
                    {result.spf.present ? 'ACTIVE' : 'MISSING'}
                  </span>
                </div>

                {result.spf.record ? (
                  <div className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex items-start justify-between gap-2 text-xs font-mono break-all text-gray-200">
                    <span>{result.spf.record}</span>
                    <button
                      onClick={() => copyToClipboard(result.spf.record, 'spf')}
                      className="p-1 rounded bg-gray-900 hover:bg-gray-800 text-gray-400 shrink-0"
                    >
                      {copiedKey === 'spf' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-red-400">No SPF TXT record discovered in DNS zone.</p>
                )}

                <ul className="space-y-1 text-xs text-gray-300">
                  {result.spf.details.map((d: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>

            {/* DMARC Card */}
            <GlassCard className="p-6 border-gray-800 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                    DMARC Anti-Spoofing Protocol
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      result.dmarc.present ? 'bg-purple-950 text-purple-300' : 'bg-red-950 text-red-300'
                    }`}
                  >
                    {result.dmarc.present ? `p=${result.dmarc.policy}` : 'MISSING'}
                  </span>
                </div>

                {result.dmarc.record ? (
                  <div className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex items-start justify-between gap-2 text-xs font-mono break-all text-purple-200">
                    <span>{result.dmarc.record}</span>
                    <button
                      onClick={() => copyToClipboard(result.dmarc.record, 'dmarc')}
                      className="p-1 rounded bg-gray-900 hover:bg-gray-800 text-gray-400 shrink-0"
                    >
                      {copiedKey === 'dmarc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-red-400">No _dmarc TXT record found. Recommended for anti-phishing protection.</p>
                )}

                <ul className="space-y-1 text-xs text-gray-300">
                  {result.dmarc.details.map((d: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          </div>

          {/* DKIM Note */}
          <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 text-[11px] text-gray-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-300 block font-bold">DKIM (DomainKeys Identified Mail) Note:</strong>
              {result.dkimGuidance.note}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
