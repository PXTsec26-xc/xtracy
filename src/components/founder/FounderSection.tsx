'use client';

import React from 'react';
import Image from 'next/image';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { OfficialProjectInfo } from '@/components/common/OfficialProjectInfo';
import {
  User,
  Shield,
  Terminal,
  Compass,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
  Lock,
  Globe,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export const FounderSection: React.FC = () => {
  const focusAreas = [
    'Defensive Cybersecurity Architecture',
    'Deterministic Threat Intelligence',
    'Zero-Knowledge Client Encryption (WebCrypto)',
    'Evidence Continuity & RFC 8785 Manifests',
    'SSRF Network Boundary Engineering',
    'Digital Safety & Privacy Protection',
  ];

  const milestones = [
    {
      period: 'Q1–Q2 2026',
      title: 'Conceptual Genesis & PhantomXTrace Initiative',
      desc: 'Formulated the defensive philosophy: "No Evidence = No Claim". Architected client-side zero-knowledge proof designs.',
    },
    {
      period: 'August 2026',
      title: 'Platform Core & SSRF Boundary Defense',
      desc: 'Engineered pre-DNS resolution SSRF filtering, AES-GCM 256-bit safe vault, and PhishLens heuristic engine.',
    },
    {
      period: 'September 2026',
      title: 'XTRACY NEXUS & Cryptographic Case Engines',
      desc: 'Developed multi-vector indicator scoring, entity-relationship graphs, temporal risk decay, and CaseSeal Merkle aggregation.',
    },
    {
      period: 'October 2026',
      title: 'Strict Quality Suite & Master Technical Dossier',
      desc: 'Created 26 passing cryptographic unit tests, STRIDE threat model, and ~400-page equivalent technical dossier.',
    },
    {
      period: 'November 2026',
      title: 'Official Founder Recognition & Brand Identity Release',
      desc: 'Consolidated official founder identity (Elliot PXT / PhantomXTrace Founder), established comprehensive IP records, and released official brand identity.',
    },
  ];

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Elliot PXT sec26',
    alternateName: ['Founder of PhantomXTrace (PXT)', 'PXTsec26'],
    jobTitle: 'Founder of PhantomXTrace (PXT) & Creator of XTRACY',
    worksFor: {
      '@type': 'Organization',
      name: 'PhantomXTrace (PXT)',
      url: 'https://xtracy.vercel.app',
    },
    url: 'https://xtracy.vercel.app/founder',
    description:
      'Elliot PXT sec26 is the founder and creator of XTRACY, an independent cybersecurity and digital safety intelligence platform developed under the PhantomXTrace (PXT) identity.',
    knowsAbout: [
      'Defensive Cybersecurity',
      'Cryptography',
      'Web Application Security',
      'SSRF Protection',
      'Digital Forensics',
    ],
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'XTRACY',
    alternateName: 'PhantomXTrace',
    description:
      'XTRACY is an independent cybersecurity and digital safety intelligence platform providing deterministic URL analysis, DNS intelligence, cryptographic evidence integrity, and local privacy vaults.',
    url: 'https://xtracy.vercel.app',
    founder: {
      '@type': 'Person',
      name: 'Elliot PXT sec26',
      alternateName: 'Founder of PhantomXTrace (PXT)',
      jobTitle: 'Founder of PhantomXTrace (PXT) & Creator of XTRACY',
      url: 'https://xtracy.vercel.app/founder',
    },
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto px-2 sm:px-4">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <User className="w-8 h-8 text-cyan-400" />
              Elliot PXT sec26
            </h1>
            <Badge type="productStatus" value="FOUNDER OF PHANTOMXTRACE" size="sm" />
          </div>
          <span className="text-xs text-cyan-300 font-mono font-semibold">
            Founder of PhantomXTrace (PXT)
          </span>
        </div>
        <p className="text-xs text-gray-400">
          Founder &amp; Creator of XTRACY — Independent Cybersecurity Intelligence Platform.
        </p>
      </div>

      {/* Hero Founder Card (Anonymous & Mysterious Cyber Presentation) */}
      <div className="relative rounded-2xl bg-[#050b16]/95 border border-sky-500/35 p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Subtle Watermarked X in the background */}
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-5 pointer-events-none flex items-center justify-center">
          <span className="text-[280px] font-black text-cyan-400 font-sans select-none">X</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          {/* Left: Authentic Hooded Silhouette */}
          <div className="md:col-span-4 flex justify-center md:justify-start">
            <div className="relative w-44 h-32 sm:w-48 sm:h-36 rounded-2xl overflow-hidden border border-cyan-400/50 shadow-[0_0_25px_rgba(34,211,238,0.35)] bg-black shrink-0">
              <Image
                src="/brand/founder-silhouette.png"
                alt="Elliot PXT sec26 (Founder of PhantomXTrace) Silhouette"
                fill
                sizes="192px"
                className="object-cover object-center"
                priority
              />
            </div>
          </div>

          {/* Right: Official Minimal Lockup & Statement */}
          <div className="md:col-span-8 flex flex-col gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block mb-1">
                FOUNDER &amp; CREATOR OF XTRACY
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                ELLIOT PXT sec26
              </h2>
              <span className="text-lg sm:text-xl font-black text-cyan-300 font-mono tracking-wider block">
                Founder of PhantomXTrace (PXT)
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
              Building independent cybersecurity and digital privacy technology under{' '}
              <strong className="text-white">PhantomXTrace (PXT)</strong>.
            </p>

            <div className="p-3.5 rounded-xl bg-[#040812]/90 border border-gray-800 text-xs font-mono grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-gray-400 text-[10px] uppercase block">Official Role:</span>
                <strong className="text-white">Founder &amp; Creator of XTRACY</strong>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase block">Research Initiative:</span>
                <strong className="text-cyan-300">PhantomXTrace (PXT)</strong>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase block">Official Platform:</span>
                <a href="https://xtracy.vercel.app/" className="text-cyan-400 hover:underline">
                  https://xtracy.vercel.app/
                </a>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase block">Code Provenance:</span>
                <strong className="text-emerald-400">Git Commit Verified</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Founder Statement & Product Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6 border-gray-800 flex flex-col gap-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2 text-cyan-400">
            <Compass className="w-5 h-5" /> Founder Statement
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            &quot;I created XTRACY because the world of digital defense is plagued by security theater—flashy circular progress bars, unsubstantiated risk scores, and closed-source tools that harvest personal information in the name of security. XTRACY was built to prove that enterprise-grade security diagnostics and cryptographic evidence integrity can be honest, transparent, and completely respectful of user privacy.&quot;
          </p>
          <span className="text-[11px] font-mono text-gray-400 block pt-1">
            — Elliot PXT sec26 (Founder of PhantomXTrace)
          </span>
        </GlassCard>

        <GlassCard className="p-6 border-gray-800 flex flex-col gap-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2 text-emerald-400">
            <Sparkles className="w-5 h-5" /> Product Vision
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            XTRACY bridges the gap between complex digital forensics and everyday digital safety. Whether a victim of targeted phishing is organizing scam messages, or a security student is inspecting TLS certificate chains and HTTP headers, XTRACY provides mathematically verifiable evidence without sending unencrypted user data to third-party databases.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Badge type="productStatus" value="DEFENSIVE MANDATE" size="sm" />
            <Badge type="productStatus" value="LOCAL PRIVACY" size="sm" />
          </div>
        </GlassCard>
      </div>

      {/* Professional Philosophy */}
      <GlassCard className="p-6 border-gray-800 flex flex-col gap-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2 text-sky-400">
          <User className="w-5 h-5" /> Professional Philosophy
        </h3>
        <div className="text-xs text-gray-300 leading-relaxed space-y-2.5">
          <p>
            <strong>Elliot PXT sec26</strong> is the founder of <strong>PhantomXTrace (PXT)</strong> and an independent cybersecurity architect, software engineer, and researcher. Specializing in defensive application security, zero-knowledge cryptographic models, and server-side request boundary defenses, Elliot architected the entire XTRACY platform from inception.
          </p>
          <p>
            Operating through the <strong>PhantomXTrace (PXT)</strong> research collective, his engineering work emphasizes deterministic intelligence—replacing speculative threat verdicts with observable signals, such as canonical RFC 8785 JSON manifest hash chains, DNS record inspection, and browser-native WebCrypto AES-GCM encryption.
          </p>
        </div>
      </GlassCard>

      {/* Project Milestones Chronology */}
      <GlassCard className="p-6 border-gray-800 flex flex-col gap-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 text-indigo-400">
          <Award className="w-5 h-5" /> Project History &amp; Chronology
        </h3>
        <div className="flex flex-col gap-3">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-darkBg-panel/80 border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-cyan-400 font-mono font-bold">{m.period}</span>
                <strong className="text-white text-xs">{m.title}</strong>
                <p className="text-[11px] text-gray-400 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Section C: Areas of Focus */}
      <GlassCard className="p-6 border-gray-800 flex flex-col gap-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 text-emerald-400">
          <Shield className="w-5 h-5" /> Architectural Areas of Focus
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {focusAreas.map((area, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-darkBg-panel/80 border border-gray-800 flex items-center gap-2 text-xs font-bold text-white"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{area}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Official Project Information Card */}
      <OfficialProjectInfo />

      {/* Navigation Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <Link
          href="/about"
          className="p-3 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-800 text-center text-xs font-bold text-sky-400 transition-all"
        >
          About Platform →
        </Link>
        <Link
          href="/intellectual-property"
          className="p-3 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-800 text-center text-xs font-bold text-cyan-400 transition-all"
        >
          Intellectual Property →
        </Link>
        <Link
          href="/ownership"
          className="p-3 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-800 text-center text-xs font-bold text-emerald-400 transition-all"
        >
          Ownership Record →
        </Link>
        <Link
          href="/press"
          className="p-3 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-800 text-center text-xs font-bold text-indigo-400 transition-all"
        >
          Press &amp; Media Kit →
        </Link>
      </div>
    </div>
  );
};
