'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataTrustBadge } from '@/components/ui/DataTrustBadge';
import {
  FileText,
  Shield,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Copy,
  Check,
  Terminal,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function HeaderAnalyzerPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/tools/header-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error?.message || 'Failed to analyze security headers.');
      } else {
        setResult(data.data);
      }
    } catch {
      setError('Network communication failed during header audit.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sampleTargets = ['https://github.com', 'https://google.com', 'https://cloudflare.com'];

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <FileText className="w-8 h-8 text-brand-cyan" />
              Security Headers Audit
            </h1>
            <Badge type="productStatus" value="FLAGSHIP TOOL" size="sm" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Real-time HTTP response header inspection, CSP/HSTS compliance validation, leak detection, and remediation.
          </p>
        </div>

        <DataTrustBadge status="LIVE" sourceName="XTRACY Live Header Engine" />
      </div>

      {/* Input */}
      <GlassCard className="p-6 border-brand-blue/30 flex flex-col gap-4">
        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Shield className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter public website URL (e.g. https://github.com)"
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
            <span>{loading ? 'Inspecting Live Headers...' : 'Audit Headers'}</span>
          </button>
        </form>

        {/* Quick Samples */}
        <div className="flex items-center gap-2 flex-wrap text-[11px] text-gray-400">
          <span className="font-semibold text-gray-500">Quick Samples:</span>
          {sampleTargets.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setUrl(s)}
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
          <div>
            <strong className="font-bold block">Security Header Audit Error</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Grade & Score */}
            <GlassCard className="p-6 border-brand-blue/30 flex flex-col justify-between items-center text-center gap-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Security Header Grade</span>
              <div className="flex flex-col items-center">
                <span
                  className={`text-5xl font-black ${
                    result.grade.startsWith('A')
                      ? 'text-emerald-400'
                      : result.grade.startsWith('B')
                      ? 'text-brand-cyan'
                      : result.grade.startsWith('C')
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}
                >
                  {result.grade}
                </span>
                <span className="text-sm font-extrabold text-white mt-1">{result.securityScore} / 100</span>
              </div>
              <span className="text-[11px] text-gray-400 font-mono">Status: HTTP {result.statusCode} {result.statusText}</span>
            </GlassCard>

            {/* Target Breakdown & Latency */}
            <GlassCard className="md:col-span-2 p-6 border-gray-800 flex flex-col justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Audited Endpoint</span>
                <p className="text-xs font-mono text-brand-cyan break-all bg-darkBg-panel p-2.5 rounded-lg border border-gray-800 mt-1">
                  {result.targetUrl}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-darkBg-panel border border-gray-800">
                  <span className="text-[10px] text-emerald-400 block font-bold">Optimal</span>
                  <span className="text-white font-bold">{result.summary.optimalCount} Headers</span>
                </div>
                <div className="p-2.5 rounded-xl bg-darkBg-panel border border-gray-800">
                  <span className="text-[10px] text-red-400 block font-bold">Missing</span>
                  <span className="text-white font-bold">{result.summary.missingCount} Headers</span>
                </div>
                <div className="p-2.5 rounded-xl bg-darkBg-panel border border-gray-800">
                  <span className="text-[10px] text-amber-400 block font-bold">Weak</span>
                  <span className="text-white font-bold">{result.summary.weakCount} Headers</span>
                </div>
                <div className="p-2.5 rounded-xl bg-darkBg-panel border border-gray-800">
                  <span className="text-[10px] text-purple-400 block font-bold">Latency</span>
                  <span className="text-white font-bold">{result.latencyMs} ms</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Evaluations List */}
          <GlassCard className="p-6 border-gray-800 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-cyan" /> Header Policy Assessments
              </h2>
              <button
                onClick={() => setShowRaw(!showRaw)}
                className="text-xs text-brand-cyan font-bold hover:underline"
              >
                {showRaw ? 'Hide Raw Headers' : 'Show All Raw Headers'}
              </button>
            </div>

            {/* Raw Headers Viewer */}
            {showRaw && (
              <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-2 font-mono text-[11px]">
                <strong className="text-gray-400 text-[10px] uppercase">Observed Server HTTP Headers:</strong>
                {Object.entries(result.rawHeaders).map(([k, v]) => (
                  <div key={k} className="flex items-start gap-2 break-all">
                    <span className="text-brand-cyan font-bold shrink-0">{k}:</span>
                    <span className="text-gray-300">{String(v)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Detailed Header Cards */}
            <div className="flex flex-col gap-3">
              {result.evaluations.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex flex-col gap-2.5 transition-all ${
                    item.status === 'OPTIMAL'
                      ? 'bg-emerald-950/20 border-emerald-800/40'
                      : item.status === 'ACCEPTABLE'
                      ? 'bg-blue-950/20 border-blue-800/40'
                      : item.status === 'WEAK'
                      ? 'bg-amber-950/20 border-amber-800/40'
                      : item.status === 'LEAK'
                      ? 'bg-purple-950/20 border-purple-800/40'
                      : 'bg-red-950/20 border-red-800/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {item.status === 'OPTIMAL' || item.status === 'ACCEPTABLE' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : item.status === 'WEAK' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                      <strong className="text-white text-xs font-bold">{item.name}</strong>
                      <span className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] text-gray-400 font-mono">
                        {item.importance}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold self-start sm:self-center ${
                        item.status === 'OPTIMAL'
                          ? 'bg-emerald-900 text-emerald-300'
                          : item.status === 'ACCEPTABLE'
                          ? 'bg-blue-900 text-blue-300'
                          : item.status === 'WEAK'
                          ? 'bg-amber-900 text-amber-300'
                          : item.status === 'LEAK'
                          ? 'bg-purple-900 text-purple-300'
                          : 'bg-red-900 text-red-300'
                      }`}
                    >
                      {item.status} (+{item.scoreImpact} pts)
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-300">{item.description}</p>

                  {item.value && (
                    <div className="p-2 rounded-lg bg-darkBg-panel/90 border border-gray-800 text-[11px] font-mono text-gray-300 break-all">
                      <strong className="text-gray-500 block text-[9px] uppercase">Detected Value:</strong>
                      {item.value}
                    </div>
                  )}

                  {item.remediation && (
                    <div className="p-2.5 rounded-lg bg-gray-900/90 border border-gray-800 flex items-center justify-between gap-2 text-xs font-mono">
                      <div className="text-[11px] text-brand-cyan break-all">
                        <strong className="text-gray-400 block text-[9px] uppercase font-sans">Remediation Directive:</strong>
                        {item.remediation}
                      </div>
                      <button
                        onClick={() => copyToClipboard(item.remediation, `rem-${idx}`)}
                        className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 shrink-0"
                      >
                        {copiedKey === `rem-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Ask AI Copilot Action */}
          <GlassCard className="p-6 border-brand-cyan/30 bg-gradient-to-r from-brand-blue/10 via-darkBg-card to-brand-violet/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-brand-cyan/20 text-brand-cyan">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-white text-xs block">Need help implementing CSP or HSTS?</strong>
                <span className="text-[11px] text-gray-400">Ask XTRACY AI for tailor-made Nginx, Apache, or Next.js configuration code.</span>
              </div>
            </div>
            <Link
              href={`/assistant?query=${encodeURIComponent(`How do I configure missing security headers for ${result.targetUrl} with grade ${result.grade}?`)}`}
              className="px-6 py-2.5 rounded-xl bg-brand-cyan text-black font-extrabold text-xs hover:scale-105 transition-all shrink-0"
            >
              Ask AI Remediation
            </Link>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
