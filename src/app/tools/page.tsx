'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import {
  Wrench,
  Search,
  ShieldAlert,
  Dna,
  FileSearch,
  KeyRound,
  Shield,
  FileText,
  Lock,
  Compass,
  Gamepad2,
  ShieldCheck,
  Mail,
  ArrowRight,
  Globe,
  Hash,
  Code,
  FileCheck,
  CheckSquare,
  NotebookPen,
  Binary,
  Network,
  Bot,
  Activity,
} from 'lucide-react';

type ToolCategory =
  | 'ALL'
  | 'Network & Web'
  | 'Email & Identity'
  | 'Files & Crypto'
  | 'Digital Safety & Investigation';

interface ToolEntry {
  id: string;
  name: string;
  desc: string;
  href: string;
  category: Exclude<ToolCategory, 'ALL'>;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TOOLS_CATALOG: ToolEntry[] = [
  {
    id: 'security-posture',
    name: 'Security Posture Check',
    desc: 'Defensive inspection of HTTPS, TLS certificate chain, security headers, SPF/DMARC, and security.txt.',
    href: '/tools/security-posture',
    category: 'Network & Web',
    badge: 'FLAGSHIP AUDIT',
    icon: ShieldCheck,
  },
  {
    id: 'x-scan',
    name: 'X-Scan Intelligence',
    desc: 'SSRF-protected URL, SMS, and email threat heuristic analyzer with explainable risk scoring.',
    href: '/tools/x-scan',
    category: 'Network & Web',
    badge: 'SSRF PINNED',
    icon: Search,
  },
  {
    id: 'url-guard',
    name: 'XTRACY URL Guard',
    desc: 'Inspect suspicious URLs for homograph tricks, risky ports, IP hosts, and live HTTP status safely.',
    href: '/tools/url-guard',
    category: 'Network & Web',
    badge: 'LIVE HTTP CHECK',
    icon: Globe,
  },
  {
    id: 'dns-intel',
    name: 'Domain & DNS Intelligence',
    desc: 'Query authoritative A, AAAA, MX, TXT, and NS DNS records to inspect domain infrastructure.',
    href: '/tools/dns-intel',
    category: 'Network & Web',
    badge: 'LIVE DNS RESOLVER',
    icon: Network,
  },
  {
    id: 'header-analyzer',
    name: 'Web Security Header Analyzer',
    desc: 'Evaluate HSTS, Content-Security-Policy, X-Frame-Options, Referrer-Policy, and CORS defenses.',
    href: '/tools/header-analyzer',
    category: 'Network & Web',
    badge: 'SSRF PROTECTED',
    icon: FileText,
  },
  {
    id: 'http-inspector',
    name: 'HTTP Response Inspector',
    desc: 'Fetch bounded status codes, redirect destinations, and safe header telemetry without downloading payloads.',
    href: '/tools/http-inspector',
    category: 'Network & Web',
    badge: 'BOUNDED FETCH',
    icon: Activity,
  },
  {
    id: 'ssl-inspector',
    name: 'SSL / TLS Certificate Inspector',
    desc: 'Inspect peer TLS issuer, SAN hostnames, validity window, and expiration warnings over TLS.',
    href: '/tools/ssl-inspector',
    category: 'Network & Web',
    badge: 'LIVE TLS HANDSHAKE',
    icon: Lock,
  },
  {
    id: 'link-dna',
    name: 'Link DNA — Redirect Profiler',
    desc: 'Trace bounded HTTP redirects (up to 5 hops), URL shortener targets, and strippable UTM parameters.',
    href: '/tools/link-dna',
    category: 'Network & Web',
    badge: 'REDIRECT TRACER',
    icon: Dna,
  },
  {
    id: 'ip-subnet',
    name: 'IP & CIDR Subnet Inspector',
    desc: 'Analyze IPv4/IPv6 CIDR blocks, network/broadcast boundaries, usable host counts, and RFC scope.',
    href: '/tools/ip-subnet',
    category: 'Network & Web',
    badge: 'DETERMINISTIC MATH',
    icon: Network,
  },
  {
    id: 'robots-txt',
    name: 'Robots.txt Security Parser',
    desc: 'Fetch and inspect `/robots.txt` directives to audit accidental exposure of sensitive admin paths.',
    href: '/tools/robots-txt',
    category: 'Network & Web',
    badge: 'LIVE PARSER',
    icon: Bot,
  },
  {
    id: 'security-txt',
    name: 'Security.txt (RFC 9116) Audit',
    desc: 'Verify `.well-known/security.txt` contact, expiry, encryption key, and canonical fields.',
    href: '/tools/security-txt',
    category: 'Network & Web',
    badge: 'RFC 9116 CHECK',
    icon: FileCheck,
  },
  {
    id: 'email-security',
    name: 'Email DNS Security (SPF / DMARC)',
    desc: 'Evaluate sender domain SPF policies and DMARC enforcement levels to prevent domain spoofing.',
    href: '/tools/email-security',
    category: 'Email & Identity',
    badge: 'LIVE DNS AUDIT',
    icon: Mail,
  },
  {
    id: 'email-forensics',
    name: 'Email Header Forensics',
    desc: 'Parse raw RFC 5322 headers for Received hops, Authentication-Results, and Reply-To spoofing.',
    href: '/tools/email-forensics',
    category: 'Email & Identity',
    badge: 'HEADER PARSER',
    icon: Mail,
  },
  {
    id: 'phishlens',
    name: 'PhishLens Social Engineering Analyzer',
    desc: 'Detect urgency lures, financial impersonation tactics, and explain threats in plain language.',
    href: '/tools/phishlens',
    category: 'Email & Identity',
    badge: 'EXPLAINABILITY',
    icon: ShieldAlert,
  },
  {
    id: 'scam-check',
    name: 'Real Scam Check Engine',
    desc: 'Evaluate suspicious SMS, chat offers, KYC warnings, and payment links with transparent rule matches.',
    href: '/tools/scam-check',
    category: 'Email & Identity',
    badge: 'HEURISTIC ENGINE',
    icon: ShieldAlert,
  },
  {
    id: 'account-exposure',
    name: 'Account Exposure Check',
    desc: 'Honest breach intelligence lookup status with defensive guidance when API providers are unconfigured.',
    href: '/tools/account-exposure',
    category: 'Email & Identity',
    badge: 'BREACH STATUS',
    icon: KeyRound,
  },
  {
    id: 'footprint-checker',
    name: 'Digital Footprint Checker',
    desc: 'Inspect exposed surface metadata and assess public OSINT contact footprint awareness safely.',
    href: '/tools/footprint-checker',
    category: 'Email & Identity',
    badge: 'PRIVACY SURFACE',
    icon: Globe,
  },
  {
    id: 'password-lab',
    name: 'Password Health Lab',
    desc: '100% browser-local entropy meter and CSPRNG passphrase generator. Secrets never leave the client.',
    href: '/tools/password-lab',
    category: 'Files & Crypto',
    badge: 'NEVER TRANSMITTED',
    icon: Lock,
  },
  {
    id: 'file-inspector',
    name: 'X-File Hash & Integrity Inspector',
    desc: 'Browser-local WebCrypto SHA-256 & SHA-512 checksum generator and vendor hash matcher.',
    href: '/tools/file-inspector',
    category: 'Files & Crypto',
    badge: 'ZERO UPLOAD',
    icon: FileSearch,
  },
  {
    id: 'hash-utility',
    name: 'Cryptographic Hash Utility',
    desc: 'Compute SHA-256, SHA-384, and SHA-512 digests and inspect hash format signatures.',
    href: '/tools/hash-utility',
    category: 'Files & Crypto',
    badge: 'CRYPTO UTILITY',
    icon: Hash,
  },
  {
    id: 'jwt-inspector',
    name: 'JWT Token Decoder & Auditor',
    desc: 'Decode JOSE headers & claims locally and flag insecure `alg:none` or expired timestamps.',
    href: '/tools/jwt-inspector',
    category: 'Files & Crypto',
    badge: 'CLIENT DECODER',
    icon: Code,
  },
  {
    id: 'encoder-decoder',
    name: 'Security Encoder / Decoder',
    desc: 'Convert Base64, Base64URL, Hex, and URL-encoded strings safely inside browser memory.',
    href: '/tools/encoder-decoder',
    category: 'Files & Crypto',
    badge: 'CLIENT UTILITY',
    icon: Binary,
  },
  {
    id: 'evidencepulse',
    name: 'EvidencePulse™ Manifest Builder',
    desc: 'Build RFC 8785 canonical JSON evidence manifests with continuous SHA-256 chain hashes.',
    href: '/tools/evidencepulse',
    category: 'Files & Crypto',
    badge: 'RFC 8785',
    icon: FileCheck,
  },
  {
    id: 'verifier',
    name: 'CaseSeal & Checksum Verifier',
    desc: 'Verify ECDSA signatures and canonical manifest hashes offline without server dependencies.',
    href: '/tools/verifier',
    category: 'Files & Crypto',
    badge: 'INDEPENDENT VERIFY',
    icon: ShieldCheck,
  },
  {
    id: 'report-generator',
    name: 'Verification Report Builder',
    desc: 'Compile structured incident & hash continuity reports for personal archival or escalation.',
    href: '/tools/report-generator',
    category: 'Digital Safety & Investigation',
    badge: 'REPORT EXPORT',
    icon: FileText,
  },
  {
    id: 'digital-checkup',
    name: 'Digital Safety Checkup',
    desc: 'Self-assessment scoring MFA, OS patching, backup resilience, and recovery readiness.',
    href: '/tools/digital-checkup',
    category: 'Digital Safety & Investigation',
    badge: 'PERSONAL CHECKUP',
    icon: ShieldCheck,
  },
  {
    id: 'privacy-score',
    name: 'Privacy Exposure Score',
    desc: 'Evaluate daily privacy practices across public Wi-Fi, permissions, and social account visibility.',
    href: '/tools/privacy-score',
    category: 'Digital Safety & Investigation',
    badge: '100% LOCAL',
    icon: Shield,
  },
  {
    id: 'security-checklist',
    name: 'Defensive Security Checklist',
    desc: 'Interactive step-by-step hardening checklist for laptops, phones, and primary email accounts.',
    href: '/tools/security-checklist',
    category: 'Digital Safety & Investigation',
    badge: 'HARDENING GUIDE',
    icon: CheckSquare,
  },
  {
    id: 'incident-pathfinder',
    name: 'Incident Response Pathfinder',
    desc: 'Guided containment steps tailored to account takeover, smishing loss, or device compromise.',
    href: '/tools/incident-pathfinder',
    category: 'Digital Safety & Investigation',
    badge: 'PLAYBOOK ENGINE',
    icon: Compass,
  },
  {
    id: 'incident-notes',
    name: 'Incident Timeline Notes',
    desc: 'Structured local notebook to log incident dates, handles, transaction IDs, and preserving actions.',
    href: '/tools/incident-notes',
    category: 'Digital Safety & Investigation',
    badge: 'LOCAL TIMELINE',
    icon: NotebookPen,
  },
  {
    id: 'simulator',
    name: 'Digital Safety Decision Simulator',
    desc: '6-scenario interactive cyber defense training covering smishing, BEC, MFA fatigue, and MitM risks.',
    href: '/tools/simulator',
    category: 'Digital Safety & Investigation',
    badge: '6 SCENARIOS',
    icon: Gamepad2,
  },
];

const CATEGORIES: ToolCategory[] = [
  'ALL',
  'Network & Web',
  'Email & Identity',
  'Files & Crypto',
  'Digital Safety & Investigation',
];

export default function ToolsHubPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('ALL');

  const filteredTools = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return TOOLS_CATALOG.filter((tool) => {
      const catOk = selectedCategory === 'ALL' || tool.category === selectedCategory;
      if (!catOk) return false;
      if (!q) return true;
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.desc.toLowerCase().includes(q) ||
        tool.badge.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q)
      );
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Wrench className="w-8 h-8 text-brand-cyan" />
            XTRACY Cyber Security Tools Hub
          </h1>
          <Badge type="productStatus" value={`${TOOLS_CATALOG.length} WORKING TOOLS`} size="sm" />
        </div>
        <p className="text-xs text-gray-400">
          Complete directory of all {TOOLS_CATALOG.length} defensive cybersecurity tools: network &amp; SSRF-pinned web analyzers, email forensics, WebCrypto utilities, and incident playbooks.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <GlassCard className="p-4 border-brand-blue/30 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <label htmlFor="tools-search-input" className="sr-only">
              Search cybersecurity tools
            </label>
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              id="tools-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter tools by name, protocol, or capability..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 text-xs focus:border-brand-cyan"
            />
          </div>

          <span className="text-[11px] font-mono text-gray-400">
            Showing <strong className="text-brand-cyan">{filteredTools.length}</strong> of {TOOLS_CATALOG.length} tools
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              aria-pressed={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-blue/30 border-brand-cyan text-brand-cyan'
                  : 'bg-darkBg-panel border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Grid of Tools */}
      {filteredTools.length === 0 ? (
        <GlassCard className="p-8 border-gray-800 text-center text-xs text-gray-400">
          No tools matched &quot;{searchTerm}&quot;. Clear search or select &quot;ALL&quot; categories.
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <GlassCard
                key={tool.id}
                className="p-6 border-gray-800 flex flex-col justify-between gap-4 group hover:border-brand-cyan/40 transition-all"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="p-3 rounded-xl bg-darkBg-panel text-brand-cyan border border-gray-800 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded bg-gray-900 text-brand-cyan border border-gray-800 text-[9px] font-bold">
                      {tool.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-gray-500 block mb-0.5">
                      {tool.category}
                    </span>
                    <h2 className="text-base font-bold text-white group-hover:text-brand-cyan transition-colors">
                      {tool.name}
                    </h2>
                  </div>
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
      )}
    </div>
  );
}
