'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataTrustBadge } from '@/components/ui/DataTrustBadge';
import {
  Bot,
  Search,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  ShieldAlert,
  Layers,
  Copy,
  Check,
  Code2,
} from 'lucide-react';

export default function RobotsTxtPage() {
  const [domain, setDomain] = useState('github.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleInspect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/tools/robots-txt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error?.message || 'Failed to fetch robots.txt.');
      } else {
        setResult(data.data);
      }
    } catch {
      setError('Connection failed while querying robots.txt.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleDomains = ['github.com', 'wikipedia.org', 'cloudflare.com', 'google.com'];

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Bot className="w-8 h-8 text-brand-cyan" />
              Robots.txt Inspector & Path Leak Analyzer
            </h1>
            <Badge type="productStatus" value="STANDALONE TOOL" size="sm" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Analyze crawler crawl directives, parse User-agent rules, and detect sensitive administrative endpoint disclosures in Disallow policies.
          </p>
        </div>

        <DataTrustBadge status="LIVE" sourceName="XTRACY Robots Parser" />
      </div>

      {/* Input */}
      <GlassCard className="p-6 border-brand-blue/30 flex flex-col gap-4">
        <form onSubmit={handleInspect} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter domain (e.g. github.com)"
            className="flex-1 px-4 py-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs font-mono placeholder:text-gray-500 focus:outline-none focus:border-brand-cyan transition-colors"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Inspecting Robots.txt...' : 'Inspect robots.txt'}</span>
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
          {result.isFound ? (
            <>
              {/* Top Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-brand-blue/20 text-brand-cyan">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">User-Agents Configured</span>
                    <span className="text-sm font-extrabold text-white">
                      {Object.keys(result.userAgents).length} Agents
                    </span>
                  </div>
                </GlassCard>

                <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-950 text-purple-400">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Disallow Directives</span>
                    <span className="text-sm font-extrabold text-purple-300">
                      {result.totalDisallowRules} Rules
                    </span>
                  </div>
                </GlassCard>

                <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
                  <div
                    className={`p-3 rounded-xl ${
                      result.exposedSensitivePaths.length > 0
                        ? 'bg-amber-950 text-amber-400'
                        : 'bg-emerald-950 text-emerald-400'
                    }`}
                  >
                    {result.exposedSensitivePaths.length > 0 ? (
                      <ShieldAlert className="w-5 h-5" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Sensitive Path Leaks</span>
                    <span
                      className={`text-sm font-extrabold ${
                        result.exposedSensitivePaths.length > 0 ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {result.exposedSensitivePaths.length} Flagged Paths
                    </span>
                  </div>
                </GlassCard>
              </div>

              {/* Security Insights */}
              <div
                className={`p-4 rounded-xl border text-xs flex items-start gap-2.5 ${
                  result.exposedSensitivePaths.length > 0
                    ? 'bg-amber-950/30 border-amber-800 text-amber-200'
                    : 'bg-emerald-950/30 border-emerald-800 text-emerald-200'
                }`}
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block">Defensive Reconnaissance Insight</strong>
                  <span>{result.securityInsight}</span>
                </div>
              </div>

              {/* Sensitive Paths List if found */}
              {result.exposedSensitivePaths.length > 0 && (
                <GlassCard className="p-6 border-amber-800/40 flex flex-col gap-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Disclosed Sensitive Path Identifiers in Disallow Rules
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {result.exposedSensitivePaths.map((path: string, i: number) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-darkBg-panel border border-amber-800/60 text-amber-300 font-mono text-xs"
                      >
                        {path}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Raw Robots Content Viewer */}
              <GlassCard className="p-6 border-gray-800 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-brand-cyan" /> Raw Robots.txt Content
                  </span>
                  <button
                    onClick={() => copyToClipboard(result.rawContent)}
                    className="text-xs text-brand-cyan hover:underline flex items-center gap-1 font-bold"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Content'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 text-xs font-mono text-gray-200 overflow-x-auto max-h-96">
                  {result.rawContent}
                </pre>
              </GlassCard>
            </>
          ) : (
            <GlassCard className="p-6 border-gray-800 text-center flex flex-col items-center gap-2">
              <p className="text-xs text-gray-400">{result.message}</p>
            </GlassCard>
          )}
        </div>
      )}
    </div>
  );
}
