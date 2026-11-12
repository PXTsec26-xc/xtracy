'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { FeatureStatusBadge } from '@/components/ui/FeatureStatusBadge';
import { classifyInput, analyzeNexusInput, NexusResult } from '@/lib/server/nexusEngine';
import {
  Shield,
  Search,
  Wrench,
  Sparkles,
  Globe,
  Dna,
  Lock,
  ArrowRight,
  ShieldCheck,
  User,
  Briefcase,
  Code,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Terminal,
  Layers,
  Fingerprint,
  Activity,
  Zap,
  Info,
  Scale,
  Newspaper,
  Building2,
  Eye,
  FileText,
} from 'lucide-react';

export default function HomePage() {
  const [inputQuery, setInputQuery] = useState('');
  const [classifiedType, setClassifiedType] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<NexusResult | null>(null);

  const handleInputChange = (val: string) => {
    setInputQuery(val);
    if (val.trim()) {
      setClassifiedType(classifyInput(val));
    } else {
      setClassifiedType(null);
    }
  };

  const handleExecuteNexus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    setAnalyzing(true);
    try {
      const res = await analyzeNexusInput(inputQuery);
      setResult(res);

      // Save to local history
      if (typeof window !== 'undefined') {
        const historyRaw = localStorage.getItem('xtracy_nexus_history');
        const history = historyRaw ? JSON.parse(historyRaw) : [];
        localStorage.setItem('xtracy_nexus_history', JSON.stringify([res, ...history].slice(0, 10)));
      }
    } catch (err) {
    } finally {
      setAnalyzing(false);
    }
  };

  const metrics = [
    { icon: Code, title: '31 Security Tools', subtitle: 'Verified Diagnostic Engines' },
    { icon: Activity, title: 'Real-Time Analysis', subtitle: 'Deterministic Intelligence' },
    { icon: ShieldCheck, title: 'Zero-Log Privacy', subtitle: 'Client-Side Architecture' },
    { icon: Layers, title: 'High-Performance', subtitle: 'Graph & Data Engine' },
    { icon: Sparkles, title: 'Open & Independent', subtitle: 'Defensive Research' },
  ];

  const intelligenceModules = [
    {
      title: 'XTRACY NEXUS',
      desc: 'Central intelligence engine for multi-source analysis and risk scoring.',
      href: '/nexus',
      icon: Briefcase,
      badge: 'NEXUS ENGINE',
    },
    {
      title: 'Graph Engine',
      desc: 'Map relationships, entities and digital traces with advanced graph analysis.',
      href: '/evidence',
      icon: Layers,
      badge: 'CORRELATION',
    },
    {
      title: 'Crypto-Tools',
      desc: 'AES-GCM encryption, PBKDF2 key derivation and secure data utilities.',
      href: '/safe-vault',
      icon: Lock,
      badge: 'CLIENT-FIRST',
    },
    {
      title: 'Evidence Suite',
      desc: 'Generate, verify and manage digital evidence with integrity tracking.',
      href: '/evidencepulse',
      icon: Fingerprint,
      badge: 'RFC 8785',
    },
    {
      title: 'Security Analysis',
      desc: 'Identify threats, anomalies and security risks across digital assets.',
      href: '/tools/security-posture',
      icon: Activity,
      badge: 'PASSIVE AUDIT',
    },
  ];

  const bottomNavItems = [
    { label: 'About XTRACY', href: '/about', icon: Info },
    { label: 'Founder (Elliot PXT sec26)', href: '/founder', icon: User },
    { label: 'Governance & Policy', href: '/governance', icon: FileText },
    { label: 'Transparency & Trust', href: '/transparency', icon: Eye },
    { label: 'Intellectual Property', href: '/intellectual-property', icon: Scale },
    { label: 'Legal & Compliance', href: '/legal', icon: ShieldCheck },
    { label: 'Press & Updates', href: '/press', icon: Newspaper },
    { label: 'Organization (PXT)', href: '/organization', icon: Building2 },
  ];

  return (
    <div className="flex flex-col gap-12 sm:gap-16 animate-fadeIn pb-16 max-w-7xl mx-auto px-2 sm:px-4">
      {/* ─────────────────────────────────────────────────────────────
          SECTION B: HERO SECTION (TWO-COLUMN UI REFERENCE RECONSTRUCTION)
          ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-6 sm:pt-10 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Brand, Mission, CTAs, Trust Badges & Interactive Investigation */}
          <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6 text-left">
            {/* Category / Topic Kicker */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.2em] text-cyan-400 uppercase">
                CYBERSECURITY • DIGITAL INVESTIGATION • PRIVACY INTELLIGENCE
              </span>
            </div>

            {/* Main Headline */}
            <div className="flex flex-col gap-1">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-white leading-[1.08] drop-shadow-[0_0_35px_rgba(34,211,238,0.2)]">
                XTRACY
              </h1>
              <h2 className="text-xl sm:text-3xl xl:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                Cybersecurity Intelligence Platform
              </h2>
            </div>

            {/* Mission Statement Paragraph */}
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl font-normal">
              An independent, privacy-focused platform for digital investigation, intelligence analysis, and security operations — built for researchers, analysts, and cybersecurity professionals.
            </p>

            {/* Call-to-Action Buttons */}
            <div className="flex items-center gap-3.5 flex-wrap pt-1">
              <Link
                href="/nexus"
                className="px-6 sm:px-7 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-[#020817] font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_24px_rgba(34,211,238,0.55)] transition-all hover:scale-105 flex items-center gap-2 shrink-0"
              >
                <span>Launch Platform</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/tools"
                className="px-6 sm:px-7 py-3 rounded-full bg-[#071120]/80 hover:bg-[#0c1a30] text-gray-200 hover:text-white border border-sky-500/35 hover:border-cyan-400 font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center gap-2 backdrop-blur-xl shrink-0"
              >
                <Wrench className="w-4 h-4 text-cyan-400" />
                <span>Explore Tools</span>
              </Link>
            </div>

            {/* Verified Platform Characteristics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-medium text-gray-300">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#050d1a]/60 border border-sky-500/20">
                <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Privacy First</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#050d1a]/60 border border-sky-500/20">
                <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Minimal Retention</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#050d1a]/60 border border-sky-500/20">
                <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Secure &amp; Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#050d1a]/60 border border-sky-500/20">
                <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Client-Side Processing</span>
              </div>
            </div>

            {/* Interactive Investigation Input Bar */}
            <div className="w-full flex flex-col gap-2 pt-2">
              <form onSubmit={handleExecuteNexus} className="relative flex items-center w-full">
                <label htmlFor="home-nexus-input" className="sr-only">
                  Target URL, domain, IP address, file hash, email, or suspicious message
                </label>
                <input
                  id="home-nexus-input"
                  type="text"
                  aria-label="Target URL, domain, IP address, file hash, email, or suspicious message"
                  value={inputQuery}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Paste URL, domain, IP address, file hash, email, or suspicious lure text..."
                  className="w-full py-3.5 pl-4 pr-32 rounded-2xl bg-[#070e1c]/90 border border-sky-500/40 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all"
                  required
                />
                <button
                  type="submit"
                  disabled={analyzing}
                  className="absolute right-1.5 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 text-black font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center gap-1.5 disabled:opacity-60"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{analyzing ? 'Analyzing...' : 'Investigate'}</span>
                </button>
              </form>

              {classifiedType && (
                <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#060c18] border border-gray-800 text-[11px] font-mono">
                  <span className="text-gray-400">Classified Target:</span>
                  <span className="text-cyan-400 font-bold uppercase">{classifiedType}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: High-Fidelity Cyber Shield Globe Visual (UI Reference) */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="relative w-full max-w-[460px] aspect-[430/250] rounded-2xl overflow-hidden border border-sky-500/30 shadow-[0_0_40px_rgba(34,211,238,0.25)] bg-[#030712] group">
              {/* Digital Globe Image Asset extracted from UI Reference */}
              <Image
                src="/brand/hero-cyber-globe.png"
                alt="XTRACY Digital Globe and Cyber Shield Visual"
                fill
                sizes="(max-width: 1024px) 100vw, 460px"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                priority
              />

              {/* Ambient Cyber Light Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-40 pointer-events-none" />

              {/* Corner Tech Brackets */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/80" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/80" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/80" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/80" />
            </div>
          </div>
        </div>

        {/* Live Investigation Result Display (When Invoked) */}
        {result && (
          <GlassCard className="mt-8 p-6 border-cyan-500/50 shadow-2xl flex flex-col gap-5 text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 flex-wrap gap-2">
              <div>
                <span className="text-[10px] text-cyan-400 uppercase font-bold font-mono">
                  NEXUS Live Diagnostic Output
                </span>
                <h3 className="text-base font-bold text-white truncate max-w-xl">{result.input}</h3>
              </div>

              <div className="flex items-center gap-3">
                <Badge type="risk" value={result.riskLevel} size="md" />
                <div className="flex items-center gap-1 font-mono">
                  <span className="text-2xl font-black text-white">{result.riskScore}</span>
                  <span className="text-xs text-gray-500 font-bold">/100</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.factors.map((f, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border font-mono text-[11px] flex items-center justify-between ${
                    f.type === 'POSITIVE'
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                      : 'bg-red-950/40 border-red-800 text-red-300'
                  }`}
                >
                  <span>{f.description}</span>
                  <strong className="font-bold">{f.points > 0 ? `+${f.points}` : f.points} pts</strong>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1.5">
              <strong className="text-white font-bold text-xs uppercase font-sans">
                Recommended Actions:
              </strong>
              <ul className="list-disc pl-5 space-y-1 text-gray-300 text-xs">
                {result.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </GlassCard>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION C: PLATFORM METRICS / FEATURE STRIP (UI REFERENCE)
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#060c18]/85 border border-sky-500/25 backdrop-blur-2xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-800/80 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3 pt-3 sm:pt-0 ${idx !== 0 ? 'sm:pl-4' : ''}`}
              >
                <div className="p-2.5 rounded-xl bg-sky-950/60 border border-sky-800/50 text-cyan-400 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <strong className="text-white text-xs sm:text-sm font-bold tracking-tight">
                    {m.title}
                  </strong>
                  <span className="text-[10px] sm:text-[11px] text-gray-400 font-mono">
                    {m.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION D: CORE INTELLIGENCE MODULES (UI REFERENCE)
          ───────────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-5">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
              — XTRACY PLATFORM
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Core Intelligence Modules
            </h2>
          </div>

          <Link
            href="/tools"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-mono"
          >
            <span>Explore All Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 5-Card Module Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {intelligenceModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.title}
                href={mod.href}
                className="p-5 rounded-2xl bg-[#060c18]/90 hover:bg-[#091326] border border-sky-500/25 hover:border-cyan-400/60 transition-all flex flex-col justify-between gap-4 group shadow-glass hover:scale-[1.02]"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-sky-950/70 border border-sky-800/60 text-cyan-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/50">
                      {mod.badge}
                    </span>
                  </div>

                  <strong className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {mod.title}
                  </strong>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-normal">
                    {mod.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>Launch Engine</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION E: FOUNDER SECTION (ANONYMOUS & PROVENANCE RECONSTRUCTION)
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full">
        <div className="relative rounded-2xl bg-[#050b16]/95 border border-sky-500/30 p-5 sm:p-7 shadow-[0_0_35px_rgba(0,0,0,0.7)] overflow-hidden">
          {/* Subtle Watermarked X in the background */}
          <div className="absolute right-0 top-0 bottom-0 w-80 opacity-5 pointer-events-none flex items-center justify-center">
            <span className="text-[280px] font-black text-cyan-400 font-sans select-none">X</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            {/* Left Column: Anonymous Silhouette Graphic */}
            <div className="md:col-span-3 flex justify-center md:justify-start">
              <div className="relative w-36 h-28 sm:w-40 sm:h-32 rounded-xl overflow-hidden border border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.3)] bg-black shrink-0">
                <Image
                  src="/brand/founder-silhouette.png"
                  alt="Elliot PXT (PhantomXTrace Founder) Silhouette"
                  fill
                  sizes="160px"
                  className="object-cover object-center"
                />
              </div>
            </div>

            {/* Center Column: Formal Identity Lockup */}
            <div className="md:col-span-5 flex flex-col gap-1 text-center md:text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                PROJECT ORIGIN
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Elliot / PXT
              </h3>
              <span className="text-sm sm:text-base font-extrabold text-cyan-300 font-mono tracking-wider">
                Founder of PhantomXTrace (PXT)
              </span>
              <span className="text-xs text-gray-400 font-semibold mt-0.5">
                Platform Architect — XTRACY Defensive Suite
              </span>
            </div>

            {/* Right Column: Statement & CTA */}
            <div className="md:col-span-4 flex flex-col gap-3.5 items-center md:items-end text-center md:text-right">
              <p className="text-xs text-gray-300 leading-relaxed font-normal">
                A privacy-focused cybersecurity innovator building independent digital intelligence technology under{' '}
                <strong className="text-white">PhantomXTrace (PXT)</strong>.
              </p>
              <Link
                href="/founder"
                className="px-5 py-2.5 rounded-xl bg-[#081324] hover:bg-[#0c1e3a] border border-cyan-400/60 hover:border-cyan-300 text-cyan-300 hover:text-white text-xs font-bold font-mono transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.25)]"
              >
                <span>View Founder Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION F: BOTTOM NAVIGATION BAR (UI REFERENCE)
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full">
        <div className="p-3 sm:p-4 rounded-2xl bg-[#040914]/90 border border-sky-500/20 backdrop-blur-2xl grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center">
          {bottomNavItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className="p-2.5 rounded-xl hover:bg-sky-500/10 flex flex-col items-center justify-center gap-1 text-gray-300 hover:text-white transition-colors group"
              >
                <Icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] sm:text-[11px] font-medium leading-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
