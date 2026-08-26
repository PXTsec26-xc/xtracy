'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataTrustBadge } from '@/components/ui/DataTrustBadge';
import { DataStorageBadge } from '@/components/ui/DataStorageBadge';
import { SafetyScoreGauge } from '@/components/ui/SafetyScoreGauge';
import { IndiaEmergencyCenter } from '@/components/emergency/IndiaEmergencyCenter';
import { calculateSmartRiskScore } from '@/lib/riskEngine';
import {
  LayoutDashboard,
  ShieldAlert,
  Globe,
  FileText,
  UserCheck,
  Search,
  Lock,
  Hash,
  Activity,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Server,
  Shield,
  Briefcase,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, token } = useAuthStore();
  const profile = useProfileStore((state) => state.profile);

  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [quickInput, setQuickInput] = useState('');
  const [activeTool, setActiveTool] = useState<'url' | 'dns' | 'headers' | 'footprint'>('url');

  useEffect(() => {
    if (!token) return;
    fetch('/api/user/scans', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) setRecentScans(data.data);
      })
      .catch(() => {});

    fetch('/api/cases', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) setIncidents(data.data);
      })
      .catch(() => {});
  }, [token]);

  const riskResult = calculateSmartRiskScore({ profile, recentScans, incidentRecords: incidents });

  const flagshipTools = [
    {
      id: 'url-guard',
      name: 'XTRACY URL Guard',
      desc: 'Real URL entropy, punycode, TLD risk profiling & heuristic score.',
      href: '/tools/url-guard',
      icon: ShieldAlert,
      tag: 'FLAGSHIP #1',
    },
    {
      id: 'dns-intel',
      name: 'Domain & DNS Intelligence',
      desc: 'Authoritative server DNS resolution for A, AAAA, MX, TXT, NS, CNAME.',
      href: '/tools/dns-intel',
      icon: Globe,
      tag: 'FLAGSHIP #2',
    },
    {
      id: 'header-analyzer',
      name: 'Security Headers Audit',
      desc: 'Live SSRF-protected HTTP header assessment (CSP, HSTS, XFO) with score.',
      href: '/tools/header-analyzer',
      icon: FileText,
      tag: 'FLAGSHIP #3',
    },
    {
      id: 'footprint-checker',
      name: 'Digital Footprint Checker',
      desc: 'Defensive OSINT public domain and handle exposure checks.',
      href: '/tools/footprint-checker',
      icon: UserCheck,
      tag: 'FLAGSHIP #4',
    },
  ];

  return (
    <ProtectedRoute
      fallbackTitle="Sign In for Unified Security Command Center"
      fallbackDescription="Access your personal security posture gauge, 4 flagship tools, recent scan history, and active incident response cases."
    >
      <div className="flex flex-col gap-8 animate-fadeIn max-w-6xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-white flex items-center gap-2">
                <LayoutDashboard className="w-8 h-8 text-brand-cyan" />
                Unified Security Command Center
              </h1>
              <Badge type="productStatus" value="POWER COMMAND" size="sm" />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Welcome back, <strong className="text-white">{user?.fullName || 'Security Analyst'}</strong>. Your security posture, flagship tools, and real-time defensive intel are active.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <DataStorageBadge status="PERSISTENT" />
            <DataTrustBadge status="LIVE" sourceName="XTRACY Engine" />
          </div>
        </div>

        {/* TOP 4 FLAGSHIP TOOLS SHOWCASE */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-brand-cyan" /> 4 Flagship Cybersecurity Tools
            </h2>
            <Link href="/tools" className="text-xs font-bold text-brand-cyan hover:underline flex items-center gap-1">
              <span>View All 18 Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {flagshipTools.map((t) => {
              const Icon = t.icon;
              return (
                <Link
                  key={t.id}
                  href={t.href}
                  className="p-5 rounded-2xl bg-gradient-to-br from-brand-blue/10 via-darkBg-panel to-darkBg-card border border-brand-cyan/30 hover:border-brand-cyan hover:scale-[1.02] transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-brand-cyan/20 text-brand-cyan group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan text-[9px] font-extrabold font-mono border border-brand-cyan/30">
                        {t.tag}
                      </span>
                    </div>
                    <strong className="text-sm font-bold text-white group-hover:text-brand-cyan transition-colors">
                      {t.name}
                    </strong>
                    <p className="text-[11px] text-gray-400 leading-relaxed">{t.desc}</p>
                  </div>

                  <span className="text-xs font-bold text-brand-cyan flex items-center justify-between pt-2 border-t border-gray-800/80">
                    <span>Launch</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Posture & Risk Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Safety Posture Score */}
          <GlassCard className="p-6 border-brand-blue/40 bg-gradient-to-br from-brand-blue/10 via-darkBg-card to-brand-violet/10 flex flex-col items-center justify-center text-center gap-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Personal Security Posture
            </h3>
            <SafetyScoreGauge
              score={riskResult.score}
              status={riskResult.score > 75 ? 'Safe' : riskResult.score > 50 ? 'Caution' : 'High Risk'}
            />
            <div className="flex items-center gap-2">
              <Badge type="risk" value={riskResult.riskLevel} size="sm" />
              <span className="text-xs text-gray-300 font-semibold">Security Score: {riskResult.score}/100</span>
            </div>
          </GlassCard>

          {/* Risk Triggers & Signals */}
          <GlassCard className="lg:col-span-2 p-6 border-gray-800 flex flex-col justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-cyan flex items-center gap-2">
                <Activity className="w-4 h-4" /> Transparent Posture Factors & Signals
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Calculated from actual scan results, active incident cases, and footprint archetype.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 text-xs">
              {riskResult.triggers.length > 0 ? (
                riskResult.triggers.map((trig, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-darkBg-panel/80 border border-gray-800 flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-white block">{trig.factor}</strong>
                      <span className="text-[11px] text-gray-400">{trig.description}</span>
                    </div>
                    <span className="font-extrabold text-red-400">{trig.impact} pts</span>
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs">
                  No negative risk factors detected. Maintain account hygiene and 2FA settings.
                </div>
              )}
            </div>

            {/* Prioritized Recommendation */}
            {riskResult.recommendations.length > 0 && (
              <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs">
                <span className="text-gray-300">
                  <strong className="text-amber-400">Top Priority Action: </strong>
                  {riskResult.recommendations[0].action}
                </span>
                {riskResult.recommendations[0].linkUrl && (
                  <Link
                    href={riskResult.recommendations[0].linkUrl!}
                    className="inline-flex items-center gap-1 text-brand-cyan font-bold hover:underline"
                  >
                    <span>Execute</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Real System Architecture Status */}
        <GlassCard className="p-6 border-gray-800 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-brand-cyan" /> Active Defensive Platform Subsystems
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
              <span className="text-gray-400 text-[10px] uppercase font-bold">DNS Resolution</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Node.js Live Resolver
              </span>
            </div>

            <div className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
              <span className="text-gray-400 text-[10px] uppercase font-bold">Threat Feed</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> CISA KEV Synchronized
              </span>
            </div>

            <div className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
              <span className="text-gray-400 text-[10px] uppercase font-bold">Safe Vault</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> WebCrypto AES-GCM
              </span>
            </div>

            <div className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
              <span className="text-gray-400 text-[10px] uppercase font-bold">XTRACY AI</span>
              <span className="text-brand-cyan font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Standby / Multi-Engine
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Compact India Emergency Center */}
        <IndiaEmergencyCenter compact />
      </div>
    </ProtectedRoute>
  );
}
