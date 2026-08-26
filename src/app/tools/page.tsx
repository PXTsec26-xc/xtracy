'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Wrench, Search, ShieldAlert, Dna, FileSearch, KeyRound, Shield, FileText, Lock, Compass, Gamepad2, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ToolsHubPage() {
  const tools = [
    {
      id: 'security-posture',
      name: 'SECURITY POSTURE CHECK',
      desc: 'Controlled defensive inspection of HTTPS, TLS, security headers, SPF/DMARC, and security.txt.',
      href: '/tools/security-posture',
      icon: ShieldCheck,
      badge: 'FLAGSHIP DEFENSIVE TOOL',
    },
    {
      id: 'email-forensics',
      name: 'EMAIL HEADER FORENSICS',
      desc: 'Parse raw email headers for Received hops, SPF/DKIM/DMARC results, and Reply-To mismatch.',
      href: '/tools/email-forensics',
      icon: Mail,
      badge: 'FORENSIC HEADER PARSER',
    },
    {
      id: 'digital-checkup',
      name: 'DIGITAL SAFETY CHECKUP',
      desc: 'Personalized security posture evaluation generating prioritized defensive action plans.',
      href: '/tools/digital-checkup',
      icon: ShieldCheck,
      badge: 'PERSONAL CHECKUP',
    },
    {
      id: 'x-scan',
      name: 'X-SCAN INTELLIGENCE',
      desc: 'SSRF-protected URL, SMS, and Email threat heuristic analyzer with risk scoring.',
      href: '/tools/x-scan',
      icon: Search,
      badge: 'SSRF PROTECTED',
    },
    {
      id: 'phishlens',
      name: 'PHISHLENS',
      desc: 'Phishing tactic & social engineering analyzer with "Explain Like I Am a Beginner".',
      href: '/tools/phishlens',
      icon: ShieldAlert,
      badge: 'SOCIAL ENGINEERING',
    },
    {
      id: 'link-dna',
      name: 'LINK DNA',
      desc: 'Visual URL intelligence DNA profiler mapping domain structure and redirect paths.',
      href: '/tools/link-dna',
      icon: Dna,
      badge: 'VISUAL PROFILER',
    },
    {
      id: 'file-inspector',
      name: 'X-FILE INSPECTOR',
      desc: 'Privacy-aware safe hash (SHA-256/MD5) & metadata file analyzer. Zero server execution.',
      href: '/tools/file-inspector',
      icon: FileSearch,
      badge: 'ZERO SERVER EXECUTION',
    },
    {
      id: 'account-exposure',
      name: 'ACCOUNT EXPOSURE CHECK',
      desc: 'Authorized email breach exposure architecture with transparent unconfigured state.',
      href: '/tools/account-exposure',
      icon: KeyRound,
      badge: 'BREACH CHECK',
    },
    {
      id: 'privacy-score',
      name: 'PRIVACY EXPOSURE SCORE',
      desc: 'Interactive 100% browser-local privacy habits assessment & action plan.',
      href: '/tools/privacy-score',
      icon: Shield,
      badge: '100% BROWSER LOCAL',
    },
    {
      id: 'header-analyzer',
      name: 'WEB SECURITY HEADER ANALYZER',
      desc: 'Defensive analyzer for HTTPS, HSTS, CSP, X-Frame-Options, and security headers.',
      href: '/tools/header-analyzer',
      icon: FileText,
      badge: 'SSRF PROTECTED',
    },
    {
      id: 'password-lab',
      name: 'PASSWORD HEALTH LAB',
      desc: '100% browser-local password strength, entropy & passphrase generator. Never sent to server.',
      href: '/tools/password-lab',
      icon: Lock,
      badge: 'NEVER TRANSMITTED',
    },
    {
      id: 'incident-pathfinder',
      name: 'INCIDENT RESPONSE PATHFINDER',
      desc: 'Guided step-by-step incident response playbook generator for account compromise or scams.',
      href: '/tools/incident-pathfinder',
      icon: Compass,
      badge: 'PLAYBOOK GENERATOR',
    },
    {
      id: 'simulator',
      name: 'DIGITAL SAFETY DECISION SIMULATOR',
      desc: 'Interactive educational decision scenarios (fake recruiters, QR codes) with learning scores.',
      href: '/tools/simulator',
      icon: Gamepad2,
      badge: 'EDUCATIONAL SIMULATOR',
    },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Wrench className="w-8 h-8 text-brand-cyan" />
            XTRACY Cyber Security Tools Hub
          </h1>
          <Badge type="productStatus" value="13 WORKING TOOLS" size="sm" />
        </div>
        <p className="text-xs text-gray-400">
          Defensive cybersecurity tools, posture checks, email forensics, privacy analyzers, and incident playbooks.
        </p>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <GlassCard key={tool.id} className="p-6 border-gray-800 flex flex-col justify-between gap-4 group hover:border-brand-cyan/40 transition-all">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-darkBg-panel text-brand-cyan border border-gray-800 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded bg-gray-900 text-brand-cyan border border-gray-800 text-[9px] font-bold">
                    {tool.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-brand-cyan transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">{tool.desc}</p>
              </div>

              <Link
                href={tool.href}
                className="pt-3 border-t border-gray-800 text-xs font-bold text-brand-cyan flex items-center justify-between group-hover:translate-x-1 transition-transform"
              >
                <span>Launch Tool</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
