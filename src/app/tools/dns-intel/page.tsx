'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataTrustBadge } from '@/components/ui/DataTrustBadge';
import {
  Globe,
  Search,
  Server,
  Mail,
  FileCode,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Copy,
  Check,
  Layers,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import Link from 'next/link';

export default function DnsIntelPage() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'A' | 'AAAA' | 'MX' | 'TXT' | 'NS' | 'CNAME'>('A');

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/tools/dns-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error?.message || 'Failed to query DNS zone records.');
      } else {
        setResult(data.data);
      }
    } catch {
      setError('Network communication failed during DNS query.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sampleDomains = ['cloudflare.com', 'google.com', 'github.com', 'wikipedia.org'];

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Globe className="w-8 h-8 text-brand-cyan" />
              Domain & DNS Intelligence
            </h1>
            <Badge type="productStatus" value="FLAGSHIP TOOL" size="sm" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Real-time authoritative DNS record resolution: A, AAAA, MX, TXT, NS, and CNAME with security posture insights.
          </p>
        </div>

        <DataTrustBadge status="LIVE" sourceName="XTRACY DNS Resolver" />
      </div>

      {/* Input */}
      <GlassCard className="p-6 border-brand-blue/30 flex flex-col gap-4">
        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter domain name (e.g. google.com or cloudflare.com)"
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
            <span>{loading ? 'Resolving DNS Zones...' : 'Resolve DNS Records'}</span>
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
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <strong className="font-bold block">DNS Resolution Error</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-brand-blue/20 text-brand-cyan">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Target Domain</span>
                <span className="text-sm font-extrabold text-white font-mono">{result.domain}</span>
              </div>
            </GlassCard>

            <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-950 text-emerald-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Records Resolved</span>
                <span className="text-sm font-extrabold text-emerald-400">{result.totalRecordsFound} Active Records</span>
              </div>
            </GlassCard>

            <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-950 text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Query Timestamp</span>
                <span className="text-xs font-semibold text-gray-300">
                  {new Date(result.queriedAt).toLocaleTimeString()} UTC
                </span>
              </div>
            </GlassCard>
          </div>

          {/* Security Insights */}
          {result.securityInsights?.length > 0 && (
            <GlassCard className="p-5 border-brand-cyan/20 bg-darkBg-panel/70 flex flex-col gap-2.5">
              <span className="text-[10px] font-bold text-brand-cyan uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> DNS Configuration Security Insights
              </span>
              <ul className="space-y-1.5 text-xs text-gray-300">
                {result.securityInsights.map((insight: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}

          {/* Record Type Tabs & Data Viewer */}
          <GlassCard className="p-6 border-gray-800 flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-gray-800 pb-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME'] as const).map((type) => {
                  const count =
                    type === 'A'
                      ? result.records.a.length
                      : type === 'AAAA'
                      ? result.records.aaaa.length
                      : type === 'MX'
                      ? result.records.mx.length
                      : type === 'TXT'
                      ? result.records.txt.length
                      : type === 'NS'
                      ? result.records.ns.length
                      : result.records.cname.length;

                  return (
                    <button
                      key={type}
                      onClick={() => setActiveTab(type)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        activeTab === type
                          ? 'bg-brand-cyan text-black shadow-glowCyan'
                          : 'bg-darkBg-panel text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <span>{type}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                          activeTab === type ? 'bg-black/30 text-black' : 'bg-gray-900 text-gray-400'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-brand-cyan" />
                {result.recordExplanations[activeTab]}
              </span>
            </div>

            {/* Tab Content Display */}
            <div className="flex flex-col gap-3 min-h-[140px]">
              {activeTab === 'A' && (
                <div className="flex flex-col gap-2">
                  {result.records.a.length > 0 ? (
                    result.records.a.map((ip: string, i: number) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex items-center justify-between text-xs font-mono"
                      >
                        <span className="text-white font-bold">{ip}</span>
                        <button
                          onClick={() => copyToClipboard(ip, `a-${i}`)}
                          className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white"
                        >
                          {copiedKey === `a-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 italic p-4">No A (IPv4) records returned for this domain.</p>
                  )}
                </div>
              )}

              {activeTab === 'AAAA' && (
                <div className="flex flex-col gap-2">
                  {result.records.aaaa.length > 0 ? (
                    result.records.aaaa.map((ip6: string, i: number) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex items-center justify-between text-xs font-mono"
                      >
                        <span className="text-white font-bold">{ip6}</span>
                        <button
                          onClick={() => copyToClipboard(ip6, `aaaa-${i}`)}
                          className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white"
                        >
                          {copiedKey === `aaaa-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 italic p-4">No AAAA (IPv6) records returned for this domain.</p>
                  )}
                </div>
              )}

              {activeTab === 'MX' && (
                <div className="flex flex-col gap-2">
                  {result.records.mx.length > 0 ? (
                    result.records.mx.map((mx: any, i: number) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex items-center justify-between text-xs font-mono"
                      >
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded bg-brand-blue/20 text-brand-cyan text-[10px] font-bold">
                            Priority: {mx.priority}
                          </span>
                          <span className="text-white">{mx.exchange}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(mx.exchange, `mx-${i}`)}
                          className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white"
                        >
                          {copiedKey === `mx-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 italic p-4">No MX records returned for this domain.</p>
                  )}
                </div>
              )}

              {activeTab === 'TXT' && (
                <div className="flex flex-col gap-2">
                  {result.records.txt.length > 0 ? (
                    result.records.txt.map((txt: string, i: number) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 flex items-start justify-between gap-2 text-xs font-mono break-all"
                      >
                        <span className="text-gray-200">{txt}</span>
                        <button
                          onClick={() => copyToClipboard(txt, `txt-${i}`)}
                          className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white shrink-0"
                        >
                          {copiedKey === `txt-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 italic p-4">No TXT records returned for this domain.</p>
                  )}
                </div>
              )}

              {activeTab === 'NS' && (
                <div className="flex flex-col gap-2">
                  {result.records.ns.length > 0 ? (
                    result.records.ns.map((ns: string, i: number) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex items-center justify-between text-xs font-mono"
                      >
                        <span className="text-white">{ns}</span>
                        <button
                          onClick={() => copyToClipboard(ns, `ns-${i}`)}
                          className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white"
                        >
                          {copiedKey === `ns-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 italic p-4">No NS records returned for this domain.</p>
                  )}
                </div>
              )}

              {activeTab === 'CNAME' && (
                <div className="flex flex-col gap-2">
                  {result.records.cname.length > 0 ? (
                    result.records.cname.map((cname: string, i: number) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex items-center justify-between text-xs font-mono"
                      >
                        <span className="text-white">{cname}</span>
                        <button
                          onClick={() => copyToClipboard(cname, `cname-${i}`)}
                          className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white"
                        >
                          {copiedKey === `cname-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 italic p-4">No CNAME records returned for this domain (apex domain or direct zone).</p>
                  )}
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
