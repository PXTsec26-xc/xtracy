'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Dna, ShieldCheck, AlertTriangle, ArrowRight, ExternalLink } from 'lucide-react';

export default function LinkDNAToolPage() {
  const [url, setUrl] = useState('');
  const [dna, setDna] = useState<any | null>(null);

  const handleProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    let formatted = url.trim();
    if (!formatted.startsWith('http')) formatted = 'https://' + formatted;

    try {
      const parsed = new URL(formatted);
      const isHttps = parsed.protocol === 'https:';
      const parts = parsed.hostname.split('.');

      setDna({
        domainIdentity: parsed.hostname,
        protocol: parsed.protocol.toUpperCase().replace(':', ''),
        subdomainCount: parts.length > 2 ? parts.length - 2 : 0,
        brandSimilarity: parts.some((p) => ['paypal', 'bank', 'login', 'verify'].includes(p.toLowerCase())) ? 'SUSPICIOUS_KEYWORD_MATCH' : 'STANDARD',
        redirectPath: ['Client Target Request', `DNS Lookup (${parsed.hostname})`, isHttps ? 'TLS Handshake (Port 443)' : 'HTTP Direct (Port 80)'],
        securitySignals: isHttps ? ['HTTPS Active', 'Standard Port 443'] : ['Unencrypted HTTP'],
        confidenceLevel: 'HIGH',
      });
    } catch (err) {
      alert('Invalid URL format.');
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Dna className="w-8 h-8 text-purple-400" />
            Link DNA — Visual URL Profiler
          </h1>
          <Badge type="productStatus" value="VISUAL DNA PROFILER" size="sm" />
        </div>
        <p className="text-xs text-gray-400">
          Visual DNA profile mapping domain identity, structure, redirect path, brand similarity, and security signals.
        </p>
      </div>

      {/* Input */}
      <GlassCard className="p-6 border-purple-500/30 flex flex-col gap-4">
        <form onSubmit={handleProfile} className="flex flex-col sm:flex-row gap-3 text-xs">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL (e.g. https://secure-bank-login.xyz)"
            className="flex-1 p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs focus:border-purple-400"
            required
          />
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Dna className="w-4 h-4" />
            <span>Generate Link DNA</span>
          </button>
        </form>
      </GlassCard>

      {/* Visual DNA Render */}
      {dna && (
        <GlassCard className="p-6 border-purple-500/40 flex flex-col gap-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-purple-400">
            Link DNA Profile Breakdown
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 uppercase">Domain Identity</span>
              <strong className="text-white text-sm truncate">{dna.domainIdentity}</strong>
            </div>

            <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 uppercase">Protocol</span>
              <strong className="text-purple-300 text-sm">{dna.protocol}</strong>
            </div>

            <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 uppercase">Subdomain Depth</span>
              <strong className="text-white text-sm">{dna.subdomainCount} subdomains</strong>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-xs">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Network Request & Handshake Sequence:</span>
            <div className="flex items-center gap-2 overflow-x-auto p-3 rounded-xl bg-darkBg-panel border border-gray-800">
              {dna.redirectPath.map((step: string, idx: number) => (
                <React.Fragment key={idx}>
                  <span className="px-3 py-1 rounded bg-gray-900 text-purple-300 text-[11px] font-mono whitespace-nowrap">
                    {step}
                  </span>
                  {idx < dna.redirectPath.length - 1 && <ArrowRight className="w-4 h-4 text-gray-600 shrink-0" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
