'use client';

import React from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { FeatureStatusBadge } from '@/components/ui/FeatureStatusBadge';
import {
  Shield,
  Search,
  Wrench,
  Sparkles,
  Globe,
  Dna,
  FileSearch,
  Lock,
  Compass,
  ArrowRight,
  ShieldCheck,
  User,
  FileCheck,
  Briefcase,
  Code,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  const popularTools = [
    { name: 'XTRACY EVIDENCEPULSE™', desc: 'Cryptographic evidence continuity engine & SHA-256 hash chaining', href: '/evidencepulse', icon: Dna, badge: 'LOCAL' as const },
    { name: 'SECURITY POSTURE CHECK', desc: 'Controlled defensive inspection of HTTPS, TLS, SPF/DMARC & security.txt', href: '/tools/security-posture', icon: ShieldCheck, badge: 'LIVE' as const },
    { name: 'X-SCAN INTELLIGENCE', desc: 'SSRF-protected URL, SMS & email lure threat analyzer', href: '/tools/x-scan', icon: Search, badge: 'LIVE' as const },
    { name: 'PHISHLENS', desc: 'Social engineering & phishing tactic diagnostic', href: '/tools/phishlens', icon: Shield, badge: 'LOCAL' as const },
    { name: 'X-FILE INSPECTOR', desc: 'Safe hash & metadata file inspector (zero server execution)', href: '/tools/file-inspector', icon: FileSearch, badge: 'LOCAL' as const },
    { name: 'PASSWORD HEALTH LAB', desc: '100% browser-local entropy math & passphrase generator', href: '/tools/password-lab', icon: Lock, badge: 'LOCAL' as const },
  ];

  return (
    <div className="flex flex-col gap-16 animate-fadeIn pb-12 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center gap-6 pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue/20 border border-brand-cyan/40 text-brand-cyan text-xs font-extrabold uppercase tracking-widest shadow-glowBlue">
          <Sparkles className="w-3.5 h-3.5" />
          <span>XTRACY 2.0 — PRIVACY-FIRST EVIDENCE INTELLIGENCE PLATFORM</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl leading-tight">
          Evidence should not lose its story.
        </h1>

        <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
          XTRACY helps organize digital incidents, preserve evidence chronology, and verify cryptographic integrity while keeping sensitive vault data under user control.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/nexus"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" />
            <span>Create Secure Case</span>
          </Link>

          <Link
            href="/evidencepulse"
            className="px-8 py-3.5 rounded-xl bg-darkBg-card hover:bg-gray-800 border border-brand-cyan/40 text-brand-cyan font-extrabold text-xs transition-all flex items-center gap-2"
          >
            <Dna className="w-4 h-4 text-brand-cyan" />
            <span>Verify Evidence</span>
          </Link>
        </div>
      </div>

      {/* Disclaimers Bar */}
      <div className="p-4 rounded-2xl bg-darkBg-card border border-gray-800 text-xs text-gray-400 text-center leading-relaxed max-w-4xl mx-auto">
        XTRACY is a privacy-first evidence organization and cryptographic verification platform. XTRACY is not a law-enforcement system and does not guarantee legal admissibility in court. Authorized investigators remain responsible for forensic acquisition procedures.
      </div>

      {/* Flagship Module Showcase: EvidencePulse™ */}
      <GlassCard className="p-8 border-brand-cyan/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-brand-blue/10 via-darkBg-card to-brand-violet/10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Badge type="productStatus" value="FLAGSHIP MODULE" size="sm" />
            <FeatureStatusBadge status="LOCAL" label="● LOCAL CRYPTO" />
          </div>
          <h2 className="text-2xl font-black text-white">XTRACY EvidencePulse™</h2>
          <p className="text-xs text-gray-300 leading-relaxed max-w-xl">
            Cryptographic Evidence Continuity Engine. Link evidence items with SHA-256 hash-chaining, monitor real-time tamper-evident continuity, and detect integrity mismatches deterministically.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/evidencepulse"
              className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-electric text-white font-extrabold text-xs shadow-glowBlue transition-all flex items-center gap-2"
            >
              <span>Launch EvidencePulse™ Console</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-darkBg-panel border border-gray-800 text-xs font-mono text-gray-300 flex flex-col gap-2 shrink-0 w-full md:w-auto">
          <div className="text-emerald-400 font-bold text-sm">🟢 VERIFIED CONTINUITY</div>
          <div>Evidence Items: 24</div>
          <div>Integrity Matches: 24/24</div>
          <div>Hash Chain: INTACT</div>
          <div>Continuity Score: 94/100</div>
        </div>
      </GlassCard>

      {/* Popular Cyber Intelligence Tools */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Wrench className="w-5 h-5 text-brand-cyan" /> Cyber Safety & Evidence Tools
          </h2>
          <Link href="/tools" className="text-xs font-bold text-brand-cyan hover:underline flex items-center gap-1">
            <span>View All 13 Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTools.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.name}
                href={t.href}
                className="p-6 rounded-2xl bg-darkBg-card/80 hover:bg-darkBg-card border border-gray-800 hover:border-brand-cyan/40 transition-all flex flex-col justify-between gap-4 group"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-darkBg-panel text-brand-cyan border border-gray-800 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <FeatureStatusBadge status={t.badge} />
                  </div>
                  <strong className="text-base font-bold text-white group-hover:text-brand-cyan transition-colors">
                    {t.name}
                  </strong>
                  <p className="text-xs text-gray-400 leading-relaxed">{t.desc}</p>
                </div>
                <span className="text-xs font-bold text-brand-cyan flex items-center gap-1">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Founder Attribution & Transparency Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6 border-gray-800 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-brand-cyan" />
            <h3 className="text-base font-bold text-white">Founder & Creator — Elliot</h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Founded & Created by <Link href="/founder" className="text-brand-cyan font-bold hover:underline">Elliot</Link>. XTRACY is an independent cybersecurity and digital safety platform focused on practical defensive tools, privacy, and evidence integrity.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <Link href="/founder" className="text-xs font-bold text-brand-cyan hover:underline flex items-center gap-1">
              <span>Read Founder Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/about" className="text-xs font-bold text-gray-400 hover:text-white hover:underline flex items-center gap-1">
              <span>About XTRACY</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-gray-800 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Security Transparency & &quot;Verify Our Claims&quot;</h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Technical threat model, WebCrypto local encryption architecture, SSRF boundary rules, and step-by-step verification steps.
          </p>
          <Link href="/transparency" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 pt-2">
            <span>Inspect Transparency Architecture</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </GlassCard>
      </div>
    </div>
  );
}
