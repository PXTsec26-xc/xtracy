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
import { LayoutDashboard, ShieldCheck, AlertTriangle, Search, Briefcase, Globe, Bell, GraduationCap, ArrowRight, Activity, Lock } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, token } = useAuthStore();
  const profile = useProfileStore((state) => state.profile);

  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    fetch('/api/user/scans', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRecentScans(data.data);
      })
      .catch(() => {});

    fetch('/api/cases', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setIncidents(data.data);
      })
      .catch(() => {});
  }, [token]);

  const riskResult = calculateSmartRiskScore({ profile, recentScans, incidentRecords: incidents });

  return (
    <ProtectedRoute fallbackTitle="Sign In for Security Command Center" fallbackDescription="Access your unified security posture score, risk triggers, saved scans, active cases, and privacy status.">
      <div className="flex flex-col gap-8 animate-fadeIn">
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
              Real-time cybersecurity posture, active threat exposure, digital footprint status, and emergency response.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <DataStorageBadge status="PERSISTENT" />
            <DataTrustBadge status="LIVE" sourceName="XTRACY Risk Engine" />
          </div>
        </div>

        {/* Top Posture & Score Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="p-6 border-brand-blue/40 bg-gradient-to-br from-brand-blue/10 via-darkBg-card to-brand-violet/10 flex flex-col items-center justify-center text-center gap-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Personal Preparedness Posture</h3>
            <SafetyScoreGauge score={riskResult.score} status={riskResult.score > 75 ? 'Safe' : riskResult.score > 50 ? 'Caution' : 'High Risk'} />
            <div className="flex items-center gap-2">
              <Badge type="risk" value={riskResult.riskLevel} size="sm" />
              <span className="text-xs text-gray-300 font-semibold">Security Score: {riskResult.score}/100</span>
            </div>
          </GlassCard>

          {/* Risk Triggers & Explanations */}
          <GlassCard className="lg:col-span-2 p-6 border-gray-800 flex flex-col justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-cyan flex items-center gap-2">
                <Activity className="w-4 h-4" /> Transparent Risk Score Triggers & Signal Analysis
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Calculated from recent scans, active cases, and profile archetype.</p>
            </div>

            <div className="flex flex-col gap-2.5 text-xs">
              {riskResult.triggers.length > 0 ? (
                riskResult.triggers.map((trig, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-darkBg-panel/80 border border-gray-800 flex items-center justify-between">
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

        {/* Quick Tools Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/scan" className="p-4 rounded-2xl bg-darkBg-panel/80 hover:bg-darkBg-panel border border-gray-800 flex flex-col gap-2 transition-all group">
            <Search className="w-5 h-5 text-brand-cyan group-hover:scale-110 transition-transform" />
            <strong className="text-white text-xs">Quick Scan Center</strong>
            <span className="text-[11px] text-gray-400">Analyze URLs & SMS</span>
          </Link>

          <Link href="/privacy-footprint" className="p-4 rounded-2xl bg-darkBg-panel/80 hover:bg-darkBg-panel border border-gray-800 flex flex-col gap-2 transition-all group">
            <Globe className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            <strong className="text-white text-xs">Digital Footprint</strong>
            <span className="text-[11px] text-gray-400">Privacy & Accounts</span>
          </Link>

          <Link href="/case-vault" className="p-4 rounded-2xl bg-darkBg-panel/80 hover:bg-darkBg-panel border border-gray-800 flex flex-col gap-2 transition-all group">
            <Briefcase className="w-5 h-5 text-brand-blue group-hover:scale-110 transition-transform" />
            <strong className="text-white text-xs">Incident Case Vault</strong>
            <span className="text-[11px] text-gray-400">Manage Recovery</span>
          </Link>

          <Link href="/learning" className="p-4 rounded-2xl bg-darkBg-panel/80 hover:bg-darkBg-panel border border-gray-800 flex flex-col gap-2 transition-all group">
            <GraduationCap className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <strong className="text-white text-xs">Learning Simulations</strong>
            <span className="text-[11px] text-gray-400">Quizzes & Exercises</span>
          </Link>
        </div>

        {/* Compact India Emergency Center */}
        <IndiaEmergencyCenter compact />
      </div>
    </ProtectedRoute>
  );
}
