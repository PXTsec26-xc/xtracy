'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataTrustBadge } from '@/components/ui/DataTrustBadge';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Lock,
  Globe,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Zap,
  Activity,
  Terminal,
  KeyRound,
} from 'lucide-react';
import Link from 'next/link';

export default function UrlGuardPage() {
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/tools/url-guard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error?.message || 'Failed to inspect target URL.');
      } else {
        setResult(data.data);
      }
    } catch {
      setError('Network connection error while contacting URL Guard backend.');
    } finally {
      setLoading(false);
    }
  };

  const sampleUrls = [
    'https://github.com/security',
    'http://192.168.1.1/admin-login',
    'http://secure-login-verify-account.paypal.com.tk/auth',
    'https://google.com',
  ];

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <ShieldAlert className="w-8 h-8 text-brand-cyan" />
              XTRACY URL Guard
            </h1>
            <Badge type="productStatus" value="FLAGSHIP TOOL" size="sm" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Deterministic security analysis, Shannon entropy scoring, punycode/IDN detection, TLD risk profiling, and transparent factor scoring.
          </p>
        </div>

        <DataTrustBadge status="LIVE" sourceName="XTRACY URL Guard Engine" />
      </div>

      {/* Input Section */}
      <GlassCard className="p-6 border-brand-blue/30 flex flex-col gap-4">
        <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter suspicious URL or domain (e.g. https://example.com/login?token=abc)"
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
            <span>{loading ? 'Inspecting URL DNA...' : 'Audit Target URL'}</span>
          </button>
        </form>

        {/* Quick Samples */}
        <div className="flex items-center gap-2 flex-wrap text-[11px] text-gray-400">
          <span className="font-semibold text-gray-500">Quick Test Samples:</span>
          {sampleUrls.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => setInputUrl(sample)}
              className="px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 text-[10px] font-mono transition-colors"
            >
              {sample}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <strong className="font-bold block">Inspection Blocked or Malformed Target</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Results Dashboard */}
      {result && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Posture & Key Metrics Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Risk Gauge Card */}
            <GlassCard className="p-6 border-brand-blue/30 flex flex-col justify-between items-center text-center gap-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Calculated Risk Index</span>
              <div className="relative flex items-center justify-center">
                <div
                  className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center ${
                    result.riskLevel === 'HIGH'
                      ? 'border-red-500 bg-red-950/20 text-red-400 shadow-glowRed'
                      : result.riskLevel === 'MEDIUM'
                      ? 'border-amber-500 bg-amber-950/20 text-amber-400'
                      : 'border-emerald-500 bg-emerald-950/20 text-emerald-400'
                  }`}
                >
                  <span className="text-3xl font-black">{result.riskScore}</span>
                  <span className="text-[9px] uppercase font-bold text-gray-400">/ 100</span>
                </div>
              </div>
              <Badge type="risk" value={result.riskLevel} size="md" />
            </GlassCard>

            {/* Target Breakdown */}
            <GlassCard className="md:col-span-2 p-6 border-gray-800 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Normalized Target Structure</span>
                <p className="text-xs font-mono text-brand-cyan break-all bg-darkBg-panel p-2.5 rounded-lg border border-gray-800">
                  {result.normalizedUrl}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-darkBg-panel border border-gray-800">
                  <span className="text-[10px] text-gray-400 block font-semibold">Protocol</span>
                  <span className="text-white font-bold">{result.parsed.protocol.replace(':', '').toUpperCase()}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-darkBg-panel border border-gray-800">
                  <span className="text-[10px] text-gray-400 block font-semibold">Hostname</span>
                  <span className="text-white font-bold truncate block">{result.parsed.hostname}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-darkBg-panel border border-gray-800">
                  <span className="text-[10px] text-gray-400 block font-semibold">Shannon Entropy</span>
                  <span className="text-white font-bold">{result.metrics.hostnameEntropy} bits</span>
                </div>
                <div className="p-2.5 rounded-xl bg-darkBg-panel border border-gray-800">
                  <span className="text-[10px] text-gray-400 block font-semibold">Subdomain Depth</span>
                  <span className="text-white font-bold">{result.metrics.subdomainDepth} levels</span>
                </div>
              </div>

              {/* Summary advice */}
              <div className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-xs">
                <strong className="text-white block font-bold mb-0.5">XTRACY Recommendation:</strong>
                <p className="text-gray-300 text-[11px]">{result.explainability.summary}</p>
              </div>
            </GlassCard>
          </div>

          {/* Scoring Factors Breakdown */}
          <GlassCard className="p-6 border-gray-800 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-brand-cyan" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Transparent Scoring Factor Breakdown
                </h2>
              </div>
              <span className="text-[10px] text-gray-400">
                {result.scoringFactors?.length || 0} Evaluated Heuristic Signals
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {result.scoringFactors?.map((factor: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-all ${
                    factor.type === 'CRITICAL'
                      ? 'bg-red-950/30 border-red-800/60 text-red-200'
                      : factor.type === 'WARNING'
                      ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                      : 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {factor.type === 'CRITICAL' ? (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    ) : factor.type === 'WARNING' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white font-bold">{factor.name}</strong>
                        <span className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-mono">
                          {factor.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-300 mt-0.5">{factor.description}</p>
                    </div>
                  </div>

                  <span
                    className={`font-black text-xs shrink-0 self-end sm:self-center px-2 py-1 rounded bg-black/40 ${
                      factor.impact > 0 ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    {factor.impact > 0 ? `+${factor.impact}` : factor.impact} pts
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* External Reputation Provider Card */}
          <GlassCard className="p-6 border-gray-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-cyan" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Multi-Engine Reputation Provider</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold border border-gray-800 bg-gray-900 text-gray-300">
                {result.reputationProvider?.isConfigured ? 'LIVE CONNECTED' : 'UNCONFIGURED (HEURISTICS ACTIVE)'}
              </span>
            </div>

            <p className="text-xs text-gray-400">
              Provider: <strong className="text-white">{result.reputationProvider?.provider}</strong> — {result.reputationProvider?.notes || 'Engine analysis synchronized.'}
            </p>
          </GlassCard>

          {/* Ask AI Copilot Action */}
          <GlassCard className="p-6 border-brand-cyan/30 bg-gradient-to-r from-brand-blue/10 via-darkBg-card to-brand-violet/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-brand-cyan/20 text-brand-cyan">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white text-xs block">Need deep remediation or incident advice?</strong>
                <span className="text-[11px] text-gray-400">Ask XTRACY AI to interpret these metrics in Beginner, Student, or Professional mode.</span>
              </div>
            </div>
            <Link
              href={`/assistant?query=${encodeURIComponent(`Explain URL Guard results for ${result.normalizedUrl} with risk score ${result.riskScore}/100`)}`}
              className="px-6 py-2.5 rounded-xl bg-brand-cyan text-black font-extrabold text-xs hover:scale-105 transition-all shrink-0"
            >
              Consult XTRACY AI
            </Link>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
