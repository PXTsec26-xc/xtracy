'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataTrustBadge } from '@/components/ui/DataTrustBadge';
import { Dna, AlertTriangle, ArrowRight, Globe, ShieldCheck } from 'lucide-react';
import type { DataTrustInfo } from '@/types';

interface RedirectHop {
  step: number;
  url: string;
  statusCode: number;
  locationHeader: string | null;
  host: string;
}

interface LinkDnaResult {
  originalUrl: string;
  finalUrl: string;
  finalHost: string;
  domainIdentity: string;
  protocol: string;
  subdomainCount: number;
  hopCount: number;
  hops: RedirectHop[];
  isShortener: boolean;
  crossedDomains: boolean;
  protocolDowngrade: boolean;
  trackingParamsFound: string[];
  safetyAssessment: string;
  dataTrust?: DataTrustInfo;
}

export default function LinkDNAToolPage() {
  const [url, setUrl] = useState('');
  const [dna, setDna] = useState<LinkDnaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!url.trim()) return;

    let formatted = url.trim();
    if (!/^https?:\/\//i.test(formatted)) {
      formatted = `https://${formatted}`;
    }

    let parsed: URL;
    try {
      parsed = new URL(formatted);
    } catch {
      setErrorMsg('Invalid URL format. Enter a valid http:// or https:// web address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/tools/link-dna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: parsed.href }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error?.message || 'Unable to trace URL redirect path.');
      }

      const d = json.data;
      const finalHost: string = d.finalHost || parsed.hostname;
      const parts = finalHost.split('.');
      const finalParsed = new URL(d.finalUrl || parsed.href);

      setDna({
        originalUrl: d.originalUrl,
        finalUrl: d.finalUrl,
        finalHost,
        domainIdentity: finalHost,
        protocol: finalParsed.protocol.toUpperCase().replace(':', ''),
        subdomainCount: parts.length > 2 ? parts.length - 2 : 0,
        hopCount: d.hopCount ?? 0,
        hops: Array.isArray(d.hops) ? d.hops : [],
        isShortener: Boolean(d.isShortener),
        crossedDomains: Boolean(d.crossedDomains),
        protocolDowngrade: Boolean(d.protocolDowngrade),
        trackingParamsFound: Array.isArray(d.trackingParamsFound) ? d.trackingParamsFound : [],
        safetyAssessment: d.safetyAssessment || 'Direct resolution.',
        dataTrust: json.dataTrust,
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to trace redirect path.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Dna className="w-8 h-8 text-purple-400" />
              Link DNA — Live URL &amp; Redirect Profiler
            </h1>
            <Badge type="productStatus" value="SSRF-PINNED TRACER" size="sm" />
          </div>
          {dna?.dataTrust && (
            <DataTrustBadge status={dna.dataTrust.status} sourceName={dna.dataTrust.sourceName} />
          )}
        </div>
        <p className="text-xs text-gray-400">
          Inspect live bounded HTTP redirects (up to 5 hops), destination hostname switches, URL shorteners, and marketing tracking parameters safely via SSRF-pinned requests.
        </p>
      </div>

      {/* Input */}
      <GlassCard className="p-6 border-purple-500/30 flex flex-col gap-4">
        <form onSubmit={handleProfile} className="flex flex-col gap-3 text-xs">
          <label htmlFor="link-dna-url-input" className="font-bold text-gray-300">
            Target URL to Profile &amp; Unshorten:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="link-dna-url-input"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL (e.g. https://example.org)"
              className="flex-1 p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs focus:border-purple-400"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-glowBlue hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Dna className="w-4 h-4" />
              <span>{loading ? 'Tracing Hops...' : 'Generate Link DNA'}</span>
            </button>
          </div>
        </form>

        {errorMsg && (
          <div role="alert" className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </GlassCard>

      {/* Live DNA Profile Render */}
      {dna && (
        <GlassCard className="p-6 border-purple-500/40 flex flex-col gap-6 text-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Link DNA Profile Breakdown
            </h2>
            <span className="px-3 py-1 rounded-full bg-purple-950/70 border border-purple-700/50 text-purple-200 font-bold text-[11px]">
              {dna.hopCount} Redirect Hop{dna.hopCount === 1 ? '' : 's'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 uppercase">Final Destination Host</span>
              <strong className="text-white text-sm truncate" title={dna.domainIdentity}>{dna.domainIdentity}</strong>
            </div>

            <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 uppercase">Final Protocol</span>
              <strong className="text-purple-300 text-sm">{dna.protocol}</strong>
            </div>

            <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 uppercase">Subdomain Depth</span>
              <strong className="text-white text-sm">{dna.subdomainCount} subdomain(s)</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex items-start gap-2.5">
            <ShieldCheck className={`w-4 h-4 shrink-0 mt-0.5 ${dna.protocolDowngrade ? 'text-red-400' : 'text-emerald-400'}`} />
            <div className="flex flex-col gap-1">
              <strong className="text-white">Safety Assessment:</strong>
              <p className="text-gray-300">{dna.safetyAssessment}</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {dna.isShortener && (
                  <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-700 text-amber-300 text-[10px] font-bold">
                    Known URL Shortener
                  </span>
                )}
                {dna.crossedDomains && (
                  <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-700 text-purple-300 text-[10px] font-bold">
                    Cross-Domain Redirect
                  </span>
                )}
                {dna.trackingParamsFound.length > 0 && (
                  <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700 text-cyan-300 text-[10px] font-bold">
                    Trackers Strippable: {dna.trackingParamsFound.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Verified HTTP Redirect Chain:</span>
            <div className="flex items-center gap-2 overflow-x-auto p-3 rounded-xl bg-darkBg-panel border border-gray-800">
              {dna.hops.map((hop, idx) => (
                <React.Fragment key={`${hop.step}-${hop.host}`}>
                  <div className="px-3 py-1.5 rounded bg-gray-900 border border-gray-800 text-purple-200 text-[11px] font-mono whitespace-nowrap flex flex-col">
                    <span className="text-[10px] text-gray-400">
                      Hop {hop.step} • HTTP {hop.statusCode}
                    </span>
                    <span className="text-white">{hop.host}</span>
                  </div>
                  {idx < dna.hops.length - 1 && <ArrowRight className="w-4 h-4 text-gray-500 shrink-0" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
