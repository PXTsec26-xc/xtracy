'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { FeatureStatusBadge } from '@/components/ui/FeatureStatusBadge';
import { ShieldCheck, Database, Lock, Globe, Server, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyFootprintPanelPage() {
  const dataFlows = [
    { label: 'Vault Encryption Architecture', status: 'LOCAL', desc: 'WebCrypto AES-GCM 256-bit client-side encryption via PBKDF2 (100,000 iterations).' },
    { label: 'Central Evidence Database Storage', status: 'NONE', desc: 'Sensitive evidence items and original files are NEVER stored on centralized XTRACY servers.' },
    { label: 'Vault Password / Key Transmission', status: 'NEVER', desc: 'Master vault passwords and PBKDF2 derived keys never leave browser memory.' },
    { label: 'Evidence Upload & File Hash Parsing', status: 'USER-CONTROLLED', desc: 'File SHA-256 hashes are calculated locally in browser memory. Binary files are never executed.' },
    { label: 'External API Requests Disclosure', status: 'SHOWN BEFORE USE', desc: 'External threat feeds (CISA KEV) and breach lookups are explicitly disclosed before execution.' },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-brand-cyan" />
              Privacy Footprint Panel
            </h1>
            <Badge type="productStatus" value="TRANSPARENT DATA FLOW" size="sm" />
          </div>
          <FeatureStatusBadge status="LOCAL" label="● 100% TRANSPARENT" />
        </div>
        <p className="text-xs text-gray-400">
          Transparent data flow monitoring disclosing local browser processing, zero centralized evidence storage, and external API lookup consent.
        </p>
      </div>

      {/* Application Data Flow Dashboard */}
      <GlassCard className="p-6 border-brand-cyan/40 shadow-2xl flex flex-col gap-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-cyan flex items-center gap-2">
          <Database className="w-4 h-4" /> Application Data Flow Architecture
        </h3>

        <div className="flex flex-col gap-3 text-xs">
          {dataFlows.map((flow, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex flex-col gap-1">
                <strong className="text-white text-sm">{flow.label}</strong>
                <p className="text-gray-400 text-xs">{flow.desc}</p>
              </div>

              <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-bold text-[11px] shrink-0 self-start sm:self-center">
                {flow.status}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Third Party Disclosures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6 border-gray-800 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2 text-xs">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-400" /> CISA KEV Dataset Feed
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Fetches public CISA Known Exploited Vulnerabilities JSON dataset directly via HTTPS. Requests do not transmit user account data.
            </p>
          </div>
          <FeatureStatusBadge status="LIVE" label="● LIVE DATASET" />
        </GlassCard>

        <GlassCard className="p-6 border-gray-800 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2 text-xs">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" /> Account Exposure API Architecture
            </h3>
            <p className="text-gray-400 leading-relaxed">
              When configured with an HIBP API key, queries k-Anonymity hash prefixes. Displays honest configuration requirement if unconfigured.
            </p>
          </div>
          <FeatureStatusBadge status="REQUIRES_API" label="● OPTIONAL API" />
        </GlassCard>
      </div>

      {/* Link to Privacy Control Center */}
      <GlassCard className="p-6 border-brand-blue/30 flex items-center justify-between">
        <div className="flex flex-col gap-1 text-xs">
          <strong className="text-white text-sm">Need to export or delete your local account data?</strong>
          <span className="text-gray-400">Manage machine-readable JSON data packages and account data deletion.</span>
        </div>

        <Link
          href="/privacy-control"
          className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-electric text-white font-extrabold text-xs shadow-glowBlue transition-all flex items-center gap-1.5 shrink-0"
        >
          <span>Open Privacy Controls</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </GlassCard>
    </div>
  );
}
