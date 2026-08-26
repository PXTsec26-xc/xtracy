'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { OfficialProjectInfo } from '@/components/common/OfficialProjectInfo';
import { User, Shield, Terminal, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const FounderSection: React.FC = () => {
  const focusAreas = [
    'Defensive Cybersecurity',
    'Digital Safety',
    'Privacy',
    'Security Awareness',
    'Evidence Integrity',
    'Practical Security Analysis',
  ];

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Elliot',
    alternateName: ['PXT sec26', 'Sahil'],
    jobTitle: 'Founder & Creator of XTRACY',
    worksFor: {
      '@type': 'Organization',
      name: 'XTRACY',
      url: 'https://xtracy.vercel.app',
    },
    url: 'https://xtracy.vercel.app/founder',
    description:
      'Elliot, also identified through the PXT sec26 project identity as Sahil, is the founder and creator of XTRACY, an independent cybersecurity and digital safety platform.',
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'XTRACY',
    description:
      'XTRACY is an independent cybersecurity and digital safety platform focused on practical defensive security tools, privacy-aware analysis, and evidence integrity.',
    url: 'https://xtracy.vercel.app',
    founder: {
      '@type': 'Person',
      name: 'Elliot',
      alternateName: ['PXT sec26', 'Sahil'],
      jobTitle: 'Founder & Creator of XTRACY',
      url: 'https://xtracy.vercel.app/founder',
    },
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
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
              <User className="w-8 h-8 text-brand-cyan" />
              Elliot
            </h1>
            <Badge type="productStatus" value="OFFICIAL IDENTITY" size="sm" />
          </div>
          <span className="text-xs text-gray-400 font-mono">Elliot (PXT sec26 Sahil)</span>
        </div>
        <p className="text-xs text-gray-400">
          Founder & Creator of XTRACY — Privacy-First Digital Evidence Intelligence Platform.
        </p>
      </div>

      {/* Hero Founder Card */}
      <GlassCard className="p-8 border-brand-cyan/40 shadow-2xl flex flex-col md:flex-row gap-8 items-center">
        <div className="relative w-36 h-36 rounded-3xl bg-gradient-to-br from-brand-blue via-brand-cyan to-brand-violet p-1 shadow-glowBlue shrink-0 flex items-center justify-center">
          <div className="w-full h-full bg-darkBg rounded-[22px] flex flex-col items-center justify-center gap-2 text-center p-4">
            <Terminal className="w-10 h-10 text-brand-cyan animate-pulse" />
            <span className="font-black text-white text-xs tracking-wider">ELLIOT</span>
            <span className="text-[9px] text-gray-400 font-semibold uppercase">PXT sec26 Sahil</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-black text-white">Elliot</h2>
            <span className="text-sm font-bold text-brand-cyan">Founder & Creator of XTRACY</span>
          </div>

          <div className="p-4 rounded-xl bg-darkBg-panel/90 border border-gray-800 flex flex-col gap-1.5 text-xs font-mono">
            <strong className="text-brand-cyan uppercase font-bold text-[11px] font-sans">
              FOUNDER IDENTITY
            </strong>
            <div><span className="text-gray-400">Code Name:</span> <strong className="text-white">Elliot</strong></div>
            <div><span className="text-gray-400">Professional / Project Identity:</span> <strong className="text-brand-cyan">PXT sec26 Sahil</strong></div>
          </div>

          <blockquote className="text-xs text-gray-300 italic border-l-2 border-brand-cyan pl-4 py-1 leading-relaxed">
            &quot;Elliot, also identified within the PXT sec26 project identity as Sahil, is the founder and creator of XTRACY.&quot;
          </blockquote>
        </div>
      </GlassCard>

      {/* Section A: About the Founder */}
      <GlassCard className="p-6 border-gray-800 flex flex-col gap-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2 text-brand-cyan">
          <User className="w-5 h-5" /> About the Founder
        </h3>
        <p className="text-xs text-gray-300 leading-relaxed">
          Elliot (PXT sec26 Sahil) is an independent cybersecurity researcher and developer dedicated to making digital defense accessible, transparent, and privacy-conscious. With a focus on practical security tools, WebCrypto client-side encryption, and deterministic verification engines, Elliot designed XTRACY to give users full control over their security posture and digital evidence integrity.
        </p>
      </GlassCard>

      {/* Section B: Why XTRACY Was Created */}
      <GlassCard className="p-6 border-gray-800 flex flex-col gap-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2 text-brand-blue">
          <Compass className="w-5 h-5" /> Why XTRACY Was Created
        </h3>
        <p className="text-xs text-gray-300 leading-relaxed">
          XTRACY was created to bring useful defensive cybersecurity and digital safety capabilities into one practical platform. In a digital landscape increasingly filled with phishing attempts, stalking incidents, and online harassment, XTRACY provides accessible tools for threat analysis, evidence chronology preservation, and cryptographic verification without requiring central evidence storage.
        </p>
      </GlassCard>

      {/* Section C: Areas of Focus */}
      <GlassCard className="p-6 border-gray-800 flex flex-col gap-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 text-emerald-400">
          <Shield className="w-5 h-5" /> Areas of Focus
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

      {/* Section D & E: Official Project Info */}
      <OfficialProjectInfo />

      {/* Navigation link to About */}
      <div className="flex justify-end pt-2">
        <Link
          href="/about"
          className="px-6 py-2.5 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-700 text-brand-cyan font-bold text-xs flex items-center gap-1.5 transition-all"
        >
          <span>Learn More About XTRACY</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
