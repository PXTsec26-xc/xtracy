'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  FileSearch,
  Lock,
  ArrowRight,
  ShieldCheck,
  User,
  Briefcase,
  Code,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  const [inputQuery, setInputQuery] = useState('');
  const [classifiedType, setClassifiedType] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<NexusResult | null>(null);

  const popularTools = [
    { name: 'XTRACY NEXUS ENGINE', desc: 'Central intelligence engine for URLs, IPs, domains, hashes & emails', href: '/nexus', icon: Briefcase, badge: 'LOCAL' as const },
    { name: 'REAL SCAM CHECK', desc: 'Evidence-based risk diagnostic for SMS, job offers & payment lures', href: '/scam-check', icon: AlertTriangle, badge: 'LOCAL' as const },
    { name: 'EVIDENCEPULSE™ ENGINE', desc: 'SHA-256 hash chaining, RFC 8785 canonical manifests & tamper detection', href: '/evidencepulse', icon: Dna, badge: 'LOCAL' as const },
    { name: 'INDEPENDENT VERIFIER™', desc: 'Separate environment to verify package structure & ECDSA signatures', href: '/verifier', icon: ShieldCheck, badge: 'LOCAL' as const },
    { name: 'SECURITY POSTURE CHECK', desc: 'Defensive inspection of HTTPS, TLS, SPF/DMARC & security.txt', href: '/tools/security-posture', icon: ShieldCheck, badge: 'LIVE' as const },
    { name: 'SECURITY TEST LAB', desc: '26 automated in-browser unit tests verifying AES-GCM, PBKDF2 & ECDSA', href: '/test-lab', icon: Code, badge: 'LOCAL' as const },
  ];

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
      const historyRaw = localStorage.getItem('xtracy_nexus_history');
      const history = historyRaw ? JSON.parse(historyRaw) : [];
      localStorage.setItem('xtracy_nexus_history', JSON.stringify([res, ...history].slice(0, 10)));
    } catch (err) {
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col gap-16 animate-fadeIn pb-12 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center gap-6 pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue/20 border border-brand-cyan/40 text-brand-cyan text-xs font-extrabold uppercase tracking-widest shadow-glowBlue">
          <Sparkles className="w-3.5 h-3.5" />
          <span>XTRACY 2.1 — TRANSPARENT CYBER INTELLIGENCE PLATFORM</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl leading-tight">
          Investigate anything. Understand the risk.
        </h1>

        <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
          XTRACY helps organize digital incidents, analyze threat indicators, preserve evidence chronology, and verify cryptographic integrity while keeping sensitive vault data under user control.
        </p>

        {/* Central Intelligent Input Area */}
        <div className="w-full max-w-3xl flex flex-col gap-3 pt-2">
          <form onSubmit={handleExecuteNexus} className="relative flex items-center">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Paste URL, domain, IP address, file hash, email, or suspicious message text..."
              className="w-full p-4 pr-36 rounded-2xl bg-darkBg-card/90 border border-brand-cyan/40 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-brand-cyan shadow-2xl backdrop-blur-xl"
              required
            />

            <button
              type="submit"
              disabled={analyzing}
              className="absolute right-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>{analyzing ? 'Analyzing...' : 'Investigate'}</span>
            </button>
          </form>

          {/* Classified Indicator Tag */}
          {classifiedType && (
            <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-darkBg-panel/80 border border-gray-800 text-xs font-mono">
              <span className="text-gray-400">Detected Input Classification:</span>
              <span className="text-brand-cyan font-bold uppercase">{classifiedType}</span>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Result Modal / Card */}
      {result && (
        <GlassCard className="p-6 border-brand-cyan/50 shadow-2xl flex flex-col gap-6 text-xs animate-fadeIn">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div>
              <span className="text-[10px] text-brand-cyan uppercase font-bold font-mono">NEXUS Investigation Output</span>
              <h3 className="text-lg font-bold text-white truncate max-w-xl">{result.input}</h3>
            </div>

            <div className="flex items-center gap-3">
              <Badge type="risk" value={result.riskLevel} size="md" />
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-white">{result.riskScore}</span>
                <span className="text-xs text-gray-500 font-bold">/100</span>
              </div>
            </div>
          </div>

          {/* Explainable Factor Breakdown */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-brand-cyan uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> Explainable Risk Factor Calculation
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.factors.map((f, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border font-mono text-[11px] flex items-center justify-between ${
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
          </div>

          {/* Recommendations */}
          <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-2">
            <strong className="text-white font-bold text-xs uppercase font-sans">Recommended Defensive Actions:</strong>
            <ul className="list-disc pl-5 space-y-1 text-gray-300 text-xs">
              {result.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </GlassCard>
      )}

      {/* Disclaimers Bar */}
      <div className="p-4 rounded-2xl bg-darkBg-card border border-gray-800 text-xs text-gray-400 text-center leading-relaxed max-w-4xl mx-auto">
        XTRACY is a privacy-first evidence organization and cryptographic verification platform. XTRACY is not a law-enforcement system and does not guarantee legal admissibility in court. Authorized investigators remain responsible for forensic acquisition procedures.
      </div>

      {/* Popular Cyber Intelligence Tools */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Wrench className="w-5 h-5 text-brand-cyan" /> Cyber Safety & Evidence Tools
          </h2>
          <Link href="/tools" className="text-xs font-bold text-brand-cyan hover:underline flex items-center gap-1">
            <span>View All Tools</span>
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
