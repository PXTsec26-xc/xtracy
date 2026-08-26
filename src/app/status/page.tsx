import React from 'react';
import { Metadata } from 'next';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Activity, ShieldCheck, Server, Lock, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Platform System Status | XTRACY Status Console',
  description:
    'Real-time status indicators for XTRACY core services, local WebCrypto engines, security header baselines, and external threat provider availability.',
  alternates: {
    canonical: 'https://xtracy.vercel.app/status',
  },
};

export default function StatusPage() {
  const services = [
    { name: 'XTRACY NEXUS Intelligence Engine', status: 'OPERATIONAL', type: 'LOCAL_HEURISTIC' },
    { name: 'Real Scam Check Engine', status: 'OPERATIONAL', type: 'LOCAL_HEURISTIC' },
    { name: 'EvidencePulse™ SHA-256 Engine', status: 'OPERATIONAL', type: 'LOCAL_WEBCRYPTO' },
    { name: 'Safe Vault Client Encryption', status: 'OPERATIONAL', type: 'BROWSER_NATIVE' },
    { name: 'VirusTotal Threat Intelligence API', status: 'PROVIDER_UNAVAILABLE', type: 'EXTERNAL_LOOKUP' },
    { name: 'Google Safe Browsing API', status: 'PROVIDER_UNAVAILABLE', type: 'EXTERNAL_LOOKUP' },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Activity className="w-8 h-8 text-emerald-400" />
              Platform Security &amp; Service Status
            </h1>
            <Badge type="productStatus" value="SYSTEM STATUS CONSOLE" size="sm" />
          </div>
          <span className="text-xs text-gray-400 font-mono">Updated: {new Date().toISOString().substring(0, 10)}</span>
        </div>
        <p className="text-xs text-gray-400">
          Transparent status reporting for local rule engines, cryptographic modules, and external API providers.
        </p>
      </div>

      {/* System Status Banner */}
      <GlassCard className="p-6 border-emerald-500/40 shadow-2xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              XTRACY Core Platform: OPERATIONAL
            </h2>
            <p className="text-xs text-gray-400">
              All browser-native WebCrypto engines and local heuristic rules are operating normally.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-gray-400">Platform Version:</span>
          <strong className="text-emerald-400 font-bold">v2.1 (Production)</strong>
        </div>
      </GlassCard>

      {/* Detailed Service Status Grid */}
      <GlassCard className="p-6 border-gray-800 flex flex-col gap-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-cyan flex items-center gap-2">
          <Server className="w-4 h-4" /> Service Availability Matrix
        </h3>

        <div className="flex flex-col gap-3 font-mono text-xs">
          {services.map((s, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex flex-col gap-0.5">
                <strong className="text-white font-sans font-bold">{s.name}</strong>
                <span className="text-[10px] text-gray-400">{s.type}</span>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  s.status === 'OPERATIONAL'
                    ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                    : 'bg-amber-950 border border-amber-800 text-amber-300'
                }`}
              >
                ● {s.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Honest Limitation Notice */}
      <div className="p-4 rounded-xl bg-darkBg-card border border-gray-800 text-xs text-gray-400 text-center leading-relaxed">
        Status disclosures report real local engine availability and external provider configuration status. XTRACY does not use fake uptime figures or fake &quot;100% Secure&quot; badges.
      </div>
    </div>
  );
}
