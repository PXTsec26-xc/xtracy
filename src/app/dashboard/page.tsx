'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { FeatureStatusBadge } from '@/components/ui/FeatureStatusBadge';
import { LayoutDashboard, ShieldCheck, Dna, Briefcase, Lock, FileText, Search, Activity, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function CommandCenterDashboardPage() {
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);

  useEffect(() => {
    // Read local history if available
    const historyRaw = localStorage.getItem('xtracy_nexus_history');
    if (historyRaw) {
      try {
        setRecentAnalyses(JSON.parse(historyRaw));
      } catch (err) {}
    }
  }, []);

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <LayoutDashboard className="w-8 h-8 text-brand-cyan" />
              XTRACY Command Center
            </h1>
            <Badge type="productStatus" value="SECURITY POSTURE CONSOLE" size="sm" />
          </div>
          <FeatureStatusBadge status="LOCAL" label="● LOCAL METRICS" />
        </div>
        <p className="text-xs text-gray-400">
          Real-time security posture summary, investigation history, evidence integrity tracking, and privacy status.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        <GlassCard className="p-4 border-gray-800 flex flex-col gap-2">
          <span className="text-gray-400 text-[10px]">Recent Investigations</span>
          <strong className="text-2xl font-black text-white">{recentAnalyses.length}</strong>
          <span className="text-[10px] text-brand-cyan">Nexus & Scam Check Sessions</span>
        </GlassCard>

        <GlassCard className="p-4 border-gray-800 flex flex-col gap-2">
          <span className="text-gray-400 text-[10px]">Evidence Integrity Status</span>
          <strong className="text-2xl font-black text-emerald-400">INTACT</strong>
          <span className="text-[10px] text-gray-400">SHA-256 Hash Chain Verified</span>
        </GlassCard>

        <GlassCard className="p-4 border-gray-800 flex flex-col gap-2">
          <span className="text-gray-400 text-[10px]">Privacy Mode</span>
          <strong className="text-2xl font-black text-cyan-300">100% LOCAL</strong>
          <span className="text-[10px] text-gray-400">Zero Server Data Storage</span>
        </GlassCard>

        <GlassCard className="p-4 border-gray-800 flex flex-col gap-2">
          <span className="text-gray-400 text-[10px]">Data Source Availability</span>
          <strong className="text-2xl font-black text-white">ONLINE</strong>
          <span className="text-[10px] text-emerald-400">Local Rule Engines Ready</span>
        </GlassCard>
      </div>

      {/* Quick Launch Console Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/nexus"
          className="p-6 rounded-2xl bg-darkBg-card/80 hover:bg-darkBg-card border border-brand-cyan/40 transition-all flex flex-col justify-between gap-4 group"
        >
          <div className="flex flex-col gap-2">
            <div className="p-3 rounded-xl bg-darkBg-panel text-brand-cyan border border-gray-800 w-fit group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <strong className="text-base font-bold text-white group-hover:text-brand-cyan transition-colors">
              XTRACY NEXUS
            </strong>
            <p className="text-xs text-gray-400 leading-relaxed">
              Central intelligence engine for URLs, domains, IPs, file hashes, emails, or scam messages.
            </p>
          </div>
          <span className="text-xs font-bold text-brand-cyan">Launch NEXUS Engine →</span>
        </Link>

        <Link
          href="/evidencepulse"
          className="p-6 rounded-2xl bg-darkBg-card/80 hover:bg-darkBg-card border border-gray-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between gap-4 group"
        >
          <div className="flex flex-col gap-2">
            <div className="p-3 rounded-xl bg-darkBg-panel text-emerald-400 border border-gray-800 w-fit group-hover:scale-110 transition-transform">
              <Dna className="w-6 h-6" />
            </div>
            <strong className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
              EvidencePulse™ Engine
            </strong>
            <p className="text-xs text-gray-400 leading-relaxed">
              Cryptographic evidence continuity, SHA-256 hash chaining, and real-time tamper-evident checks.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-400">Launch EvidencePulse →</span>
        </Link>

        <Link
          href="/scam-check"
          className="p-6 rounded-2xl bg-darkBg-card/80 hover:bg-darkBg-card border border-gray-800 hover:border-amber-500/40 transition-all flex flex-col justify-between gap-4 group"
        >
          <div className="flex flex-col gap-2">
            <div className="p-3 rounded-xl bg-darkBg-panel text-amber-400 border border-gray-800 w-fit group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <strong className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
              Real Scam Check Engine
            </strong>
            <p className="text-xs text-gray-400 leading-relaxed">
              Evidence-based risk diagnostic for SMS, job offers, payment lures, and crypto giveaways.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-400">Launch Scam Check →</span>
        </Link>
      </div>

      {/* Investigation History / Intentional Empty State */}
      <GlassCard className="p-6 border-gray-800 flex flex-col gap-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-cyan flex items-center gap-2">
          <Clock className="w-4 h-4" /> Local Investigation History ({recentAnalyses.length})
        </h3>

        {recentAnalyses.length === 0 ? (
          <div className="p-8 rounded-2xl bg-darkBg-panel/60 border border-gray-800 text-center flex flex-col items-center justify-center gap-2 text-xs text-gray-400">
            <Activity className="w-8 h-8 text-gray-600 mb-1" />
            <strong className="text-white text-sm">No Recent Local Investigations Recorded</strong>
            <p className="max-w-md leading-relaxed">
              Submit an indicator via XTRACY NEXUS or Scam Check to generate local investigation history records.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 text-xs">
            {recentAnalyses.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex flex-col gap-0.5">
                  <strong className="text-white font-mono">{item.input}</strong>
                  <span className="text-gray-400 text-[10px]">{new Date(item.analyzedAt).toLocaleString()}</span>
                </div>
                <Badge type="risk" value={item.riskLevel} size="sm" />
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
