'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataTrustBadge } from '@/components/ui/DataTrustBadge';
import {
  UserCheck,
  Globe,
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Shield,
  AlertCircle,
  Info,
  Layers,
  Terminal,
} from 'lucide-react';
import Link from 'next/link';

export default function FootprintCheckerPage() {
  const [target, setTarget] = useState('');
  const [queryType, setQueryType] = useState<'USERNAME' | 'DOMAIN'>('USERNAME');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/tools/footprint-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, queryType }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error?.message || 'Failed to check digital footprint.');
      } else {
        setResult(data.data);
      }
    } catch {
      setError('Connection failed while checking digital footprint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <UserCheck className="w-8 h-8 text-brand-cyan" />
              Digital Footprint Checker
            </h1>
            <Badge type="productStatus" value="FLAGSHIP TOOL" size="sm" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Privacy-focused public OSINT analysis for handles and domain presence without private scraping.
          </p>
        </div>

        <DataTrustBadge status="LIVE" sourceName="XTRACY OSINT Engine" />
      </div>

      {/* Input */}
      <GlassCard className="p-6 border-brand-blue/30 flex flex-col gap-4">
        {/* Toggle Mode */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setQueryType('USERNAME');
              setResult(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              queryType === 'USERNAME'
                ? 'bg-brand-cyan text-black shadow-glowCyan'
                : 'bg-darkBg-panel text-gray-300 hover:bg-gray-800'
            }`}
          >
            Public Username Footprint
          </button>
          <button
            type="button"
            onClick={() => {
              setQueryType('DOMAIN');
              setResult(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              queryType === 'DOMAIN'
                ? 'bg-brand-cyan text-black shadow-glowCyan'
                : 'bg-darkBg-panel text-gray-300 hover:bg-gray-800'
            }`}
          >
            Public Domain Presence
          </button>
        </div>

        <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            {queryType === 'USERNAME' ? (
              <UserCheck className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            ) : (
              <Globe className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            )}
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder={
                queryType === 'USERNAME'
                  ? 'Enter handle or username (e.g. torvalds or satoshi)'
                  : 'Enter domain (e.g. example.com or github.com)'
              }
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
            <span>{loading ? 'Inspecting Footprint...' : 'Inspect Footprint'}</span>
          </button>
        </form>
      </GlassCard>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <strong className="font-bold block">Footprint Inspection Notice</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* USERNAME RESULTS */}
          {result.queryType === 'USERNAME' && (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-brand-blue/20 text-brand-cyan">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Queried Handle</span>
                    <span className="text-sm font-extrabold text-white font-mono">@{result.username}</span>
                  </div>
                </GlassCard>

                <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-emerald-950 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Public Matches</span>
                    <span className="text-sm font-extrabold text-emerald-400">
                      {result.foundCount} / {result.totalChecked} Platforms
                    </span>
                  </div>
                </GlassCard>

                <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-950 text-purple-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Exposure Risk</span>
                    <span className="text-xs font-extrabold text-gray-200">
                      {result.foundCount > 3 ? 'High Handle Reuse' : 'Low / Moderate'}
                    </span>
                  </div>
                </GlassCard>
              </div>

              {/* Platforms Grid */}
              <GlassCard className="p-6 border-gray-800 flex flex-col gap-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-brand-cyan" /> Public Platform Presence Matrix
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {result.results.map((p: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                        p.exists ? 'bg-darkBg-panel border-brand-cyan/30' : 'bg-darkBg-panel/50 border-gray-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-white text-xs font-bold">{p.platform}</strong>
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            p.exists ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-gray-900 text-gray-400'
                          }`}
                        >
                          {p.exists ? 'FOUND' : 'NOT FOUND'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-800/80 text-[11px]">
                        <span className="text-gray-400">{p.statusText}</span>
                        {p.exists && (
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-cyan hover:underline flex items-center gap-1 font-bold"
                          >
                            <span>Profile</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </>
          )}

          {/* DOMAIN RESULTS */}
          {result.queryType === 'DOMAIN' && (
            <GlassCard className="p-6 border-gray-800 flex flex-col gap-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-cyan" /> Domain Security & Public Footprint Checks
              </h2>

              <div className="flex flex-col gap-3">
                {result.checks.map((chk: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      {chk.status === 'SECURED' || chk.status === 'FOUND' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-500 shrink-0" />
                      )}
                      <div>
                        <strong className="text-white block font-bold">{chk.name}</strong>
                        <span className="text-[11px] text-gray-400">{chk.detail}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        chk.status === 'SECURED'
                          ? 'bg-emerald-950 text-emerald-300'
                          : chk.status === 'FOUND'
                          ? 'bg-blue-950 text-blue-300'
                          : 'bg-gray-900 text-gray-500'
                      }`}
                    >
                      {chk.status}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Disclaimer & AI Box */}
          <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 text-[11px] text-gray-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-300 block">Privacy & OSINT Boundaries</strong>
              {result.disclaimer}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
