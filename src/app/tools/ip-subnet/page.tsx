'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataTrustBadge } from '@/components/ui/DataTrustBadge';
import {
  Network,
  Search,
  Server,
  Globe,
  Shield,
  Layers,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function IpSubnetPage() {
  const [inputIp, setInputIp] = useState('192.168.1.50/24');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputIp.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/tools/ip-subnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: inputIp }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error?.message || 'Failed to calculate subnet details.');
      } else {
        setResult(data.data);
      }
    } catch {
      setError('Connection failed while communicating with Subnet Calculator backend.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sampleIps = ['10.0.0.1/16', '192.168.1.1/24', '172.16.50.1/20', '8.8.8.8/32', '1.1.1.1/28'];

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Network className="w-8 h-8 text-brand-cyan" />
              IP Intelligence & CIDR Subnet Calculator
            </h1>
            <Badge type="productStatus" value="STANDALONE TOOL" size="sm" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Real IPv4/IPv6 classification, CIDR boundary calculations, usable host ranges, wildcard masks, and reverse DNS PTR lookups.
          </p>
        </div>

        <DataTrustBadge status="LIVE" sourceName="XTRACY Subnet Engine" />
      </div>

      {/* Input */}
      <GlassCard className="p-6 border-brand-blue/30 flex flex-col gap-4">
        <form onSubmit={handleCalculate} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Network className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={inputIp}
              onChange={(e) => setInputIp(e.target.value)}
              placeholder="Enter IP or CIDR (e.g. 192.168.1.1/24 or 8.8.8.8)"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs font-mono placeholder:text-gray-500 focus:outline-none focus:border-brand-cyan transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Calculating Subnet...' : 'Calculate Subnet'}</span>
          </button>
        </form>

        {/* Quick Samples */}
        <div className="flex items-center gap-2 flex-wrap text-[11px] text-gray-400">
          <span className="font-semibold text-gray-500">Quick Samples:</span>
          {sampleIps.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setInputIp(s)}
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
          <span>{error}</span>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Key Classification Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-brand-blue/20 text-brand-cyan">
                <Network className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Target Address</span>
                <span className="text-sm font-extrabold text-white font-mono">{result.ipAddress}/{result.cidr}</span>
              </div>
            </GlassCard>

            <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-950 text-emerald-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Usable Host Pool</span>
                <span className="text-sm font-extrabold text-emerald-400 font-mono">
                  {result.subnet.usableHosts.toLocaleString()} Hosts
                </span>
              </div>
            </GlassCard>

            <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-950 text-purple-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Scope Classification</span>
                <span className="text-xs font-extrabold text-purple-300">{result.classification}</span>
              </div>
            </GlassCard>
          </div>

          {/* Subnet Calculation Matrix */}
          <GlassCard className="p-6 border-gray-800 flex flex-col gap-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-brand-cyan" /> Subnet Address Architecture
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {[
                { label: 'Network Address', value: result.subnet.networkAddress },
                { label: 'Broadcast Address', value: result.subnet.broadcastAddress },
                { label: 'Subnet Mask', value: result.subnet.subnetMask },
                { label: 'Wildcard Mask', value: result.subnet.wildcardMask },
                { label: 'First Usable IP Host', value: result.subnet.firstUsableIp },
                { label: 'Last Usable IP Host', value: result.subnet.lastUsableIp },
                { label: 'Total Allocated IPs', value: result.subnet.totalHosts.toLocaleString() },
                { label: 'Binary Subnet Mask', value: result.subnet.binarySubnetMask },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 flex items-center justify-between font-mono"
                >
                  <span className="text-gray-400 text-[11px] font-sans">{item.label}:</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-white font-bold">{item.value}</strong>
                    <button
                      onClick={() => copyToClipboard(String(item.value), `sub-${idx}`)}
                      className="p-1 rounded bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white"
                    >
                      {copiedKey === `sub-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Reverse DNS (PTR) */}
          <GlassCard className="p-5 border-gray-800 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Reverse DNS PTR Records (PTR Zone)
            </span>
            <div className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-xs font-mono text-brand-cyan">
              {result.reverseDns.map((ptr: string, idx: number) => (
                <div key={idx}>{ptr}</div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
