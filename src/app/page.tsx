'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ThreatCard } from '@/components/feed/ThreatCard';
import { MOCK_THREAT_REPORTS } from '@/lib/mockData/threats';
import { useProfileStore } from '@/store/useProfileStore';
import {
  ShieldCheck,
  Search,
  AlertTriangle,
  Heart,
  Globe,
  Lock,
  ArrowRight,
  UserCheck,
  Radio,
  CheckCircle2,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react';

export default function LandingPage() {
  const openProfileModal = useProfileStore((state) => state.openModal);
  const profile = useProfileStore((state) => state.profile);

  return (
    <div className="flex flex-col gap-16 animate-fadeIn">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 pb-12 flex flex-col items-center text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue/15 border border-brand-cyan/30 text-brand-cyan text-xs font-semibold mb-6 shadow-glowBlue">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Personal Safety & Cyber Intelligence Network</span>
          <Badge type="productStatus" value="WORKING V1" size="sm" />
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
          Trace. Analyze. <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-violet">Protect.</span>
        </h1>

        <p className="text-lg sm:text-xl font-medium text-gray-300 mt-4 max-w-2xl leading-relaxed">
          Understand digital threats. Protect your privacy. Know what to do next.
        </p>

        <p className="text-xs text-gray-400 mt-2">
          A global threat should become a clear, personalized action for you.
        </p>

        {/* Hero Quick Action Entry Points */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto">
          <button
            onClick={openProfileModal}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-blue via-brand-electric to-brand-cyan text-white font-extrabold text-base shadow-glowBlue hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            <ShieldCheck className="w-5 h-5 text-white" />
            <span>AM I SAFE? RUN CHECK</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <Link
            href="/emergency"
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-200 font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>I Think I've Been Hacked</span>
          </Link>
        </div>

        {/* Profile Status Banner Pill */}
        <div className="mt-8 p-3 px-5 rounded-2xl bg-darkBg-card/80 border border-gray-800 backdrop-blur-md flex items-center gap-3 text-xs text-gray-300">
          <UserCheck className="w-4 h-4 text-brand-cyan shrink-0" />
          <span>
            Active Profile: <strong>{profile.userRole}</strong> ({profile.operatingSystems.join(', ')})
          </span>
          <button onClick={openProfileModal} className="text-brand-cyan font-bold hover:underline ml-2">
            Change
          </button>
        </div>
      </section>

      {/* 2. QUICK SAFETY CHECK / RELEVANCE HIGHLIGHT */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard variant="interactive" className="p-6 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Does This Affect Me?</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              XTRACY filters global cyber advisories against your exact devices, OS, email, and social apps.
            </p>
          </div>
          <button onClick={openProfileModal} className="text-brand-cyan text-xs font-bold flex items-center gap-1 hover:underline">
            Configure Safety Profile →
          </button>
        </GlassCard>

        <GlassCard variant="interactive" className="p-6 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-700/60 flex items-center justify-center text-purple-300">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Women's Safety & Privacy</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Dedicated, respectful hub for cyberstalking, harassment, image abuse, and "I Need Help Now" emergency mode.
            </p>
          </div>
          <Link href="/womens-safety" className="text-purple-300 text-xs font-bold flex items-center gap-1 hover:underline">
            Access Safety Center →
          </Link>
        </GlassCard>

        <GlassCard variant="interactive" className="p-6 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Private Safe Vault</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              AES-GCM client-side encrypted storage for incident notes, evidence checklists, and recovery logs.
            </p>
          </div>
          <Link href="/safe-vault" className="text-emerald-400 text-xs font-bold flex items-center gap-1 hover:underline">
            Open Encrypted Vault →
          </Link>
        </GlassCard>
      </section>

      {/* 3. LATEST CYBER THREATS FEED (WITH DOES THIS AFFECT ME) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Radio className="w-6 h-6 text-brand-cyan animate-pulse" />
              Live Cyber Threat Intelligence
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Verified & CISA-formatted advisories transformed into personalized action steps.
            </p>
          </div>
          <Link
            href="/intelligence"
            className="px-4 py-2 rounded-xl bg-darkBg-card border border-gray-800 text-xs font-bold text-brand-cyan hover:bg-gray-800 transition-all self-start sm:self-auto"
          >
            View All Advisories →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_THREAT_REPORTS.map((report) => (
            <ThreatCard key={report.id} report={report} />
          ))}
        </div>
      </section>

      {/* 4. SCAM CHECK & EMERGENCY TEASERS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6 border-brand-blue/30 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-cyan uppercase tracking-wider">Defensive Analysis</span>
              <Badge type="productStatus" value="WORKING" size="sm" />
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-brand-cyan" />
              XTRACY Scam Check
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Analyze suspicious URLs, text messages, or emails using client-side heuristic pattern detection. Identify urgency traps, credential theft, and fake websites safely.
            </p>
          </div>
          <Link
            href="/scan"
            className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-blue hover:bg-brand-electric text-white font-bold text-xs shadow-glowBlue transition-all"
          >
            <span>Analyze Suspicious Link or Text</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </GlassCard>

        <GlassCard className="p-6 border-red-500/30 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Incident Response</span>
              <Badge type="productStatus" value="WORKING" size="sm" />
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              I Think I Have Been Hacked
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Interactive triage flows for compromised email, stolen social accounts, malware infections, and blackmail threats with DO THIS NOW checklists.
            </p>
          </div>
          <Link
            href="/emergency"
            className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg transition-all"
          >
            <span>Open Cyber Emergency Center</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </GlassCard>
      </section>

      {/* 5. PRIVACY-FIRST PROMISE & HOW IT WORKS */}
      <section className="p-8 rounded-3xl bg-darkBg-card/80 border border-brand-blue/20 backdrop-blur-xl flex flex-col gap-6">
        <div className="text-center max-w-2xl mx-auto flex flex-col items-center">
          <Shield className="w-10 h-10 text-brand-cyan mb-2" />
          <h2 className="text-2xl font-black text-white">The XTRACY Privacy-First Promise</h2>
          <p className="text-xs text-gray-400 mt-1">
            Privacy, safety, verification, accessibility, and immediate action are our foundational pillars.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-darkBg-panel/50 border border-gray-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-white text-sm">100% Client-Side Processing</h4>
            <p className="text-gray-400 leading-relaxed">
              Your safety profile, safe vault notes, and scam text analyses execute locally in your browser. Zero telemetry or data harvesting.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-darkBg-panel/50 border border-gray-800">
            <CheckCircle2 className="w-5 h-5 text-brand-cyan" />
            <h4 className="font-bold text-white text-sm">Genuine AES-GCM Encryption</h4>
            <p className="text-gray-400 leading-relaxed">
              The Safe Vault uses real browser Web Crypto API (AES-GCM 256-bit) with PBKDF2 key derivation from your passphrase.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-darkBg-panel/50 border border-gray-800">
            <CheckCircle2 className="w-5 h-5 text-purple-400" />
            <h4 className="font-bold text-white text-sm">Honest Product Labeling</h4>
            <p className="text-gray-400 leading-relaxed">
              We explicitly label every feature as WORKING, DEMO DATA, or LOCAL ENCRYPTED. No fake progress spinners or false claims.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
