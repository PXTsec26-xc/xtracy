'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { FeatureStatusBadge } from '@/components/ui/FeatureStatusBadge';
import { BookOpen, Search, Shield, Lock, Terminal, Cpu, Network, Code, Eye, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface LearningModule {
  id: string;
  category: string;
  title: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  summary: string;
  theoryContent: string;
  practicalExample: string;
  legalEthicalNotes: string;
  officialReference: string;
  relatedToolHref: string;
}

export default function LearningPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const modules: LearningModule[] = [
    {
      id: 'MOD-01',
      category: 'Cybersecurity Fundamentals',
      title: 'CIA Triad & Defense-in-Depth Architecture',
      difficulty: 'BEGINNER',
      summary: 'Core security architecture principles: Confidentiality, Integrity, Availability, and layered defensive controls.',
      theoryContent: 'Defense-in-depth requires placing multiple redundant security controls across network perimeters, endpoints, applications, and data stores so no single point of failure compromises the system.',
      practicalExample: 'Enforcing HTTPS TLS transport, WebCrypto AES-GCM local storage encryption, and strict CSP headers simultaneously.',
      legalEthicalNotes: 'Authorized security architecture principles apply to defensive systems protecting digital assets.',
      officialReference: 'NIST SP 800-53 Security and Privacy Controls',
      relatedToolHref: '/tools/security-posture',
    },
    {
      id: 'MOD-02',
      category: 'IT & Networking',
      title: 'DNS Resolution, Record Types & DNSSEC',
      difficulty: 'BEGINNER',
      summary: 'How domain names resolve to IP addresses, A/AAAA records, MX, TXT, and cryptographic DNSSEC signatures.',
      theoryContent: 'DNS translates human-readable hostnames into IP addresses. DNSSEC adds cryptographic signatures (RRSIG) to prevent DNS spoofing and cache poisoning attacks.',
      practicalExample: 'Querying TXT records for SPF (v=spf1 include:...) and DMARC policies to prevent email spoofing.',
      relatedToolHref: '/tools/dns-intel',
      officialReference: 'RFC 4033 DNS Security Introduction and Requirements',
      legalEthicalNotes: 'DNS lookup queries analyze public domain records for defensive configuration checks.',
    },
    {
      id: 'MOD-03',
      category: 'Privacy & Digital Safety',
      title: 'Client-Side Encryption & Digital Footprint Minimization',
      difficulty: 'INTERMEDIATE',
      summary: 'Using browser-native WebCrypto AES-GCM to encrypt sensitive data locally before storage or transmission.',
      theoryContent: 'Client-side encryption ensures plaintext passwords or sensitive vault contents never leave the user browser, eliminating server-side breach vectors.',
      practicalExample: 'Generating PBKDF2 100,000-iteration key derivations with AES-GCM 256-bit ciphers in WebCrypto.',
      relatedToolHref: '/safe-vault',
      officialReference: 'W3C Web Cryptography API Specification',
      legalEthicalNotes: 'Privacy-first client-side encryption ensures user sovereignty over personal data.',
    },
    {
      id: 'MOD-04',
      category: 'Web Security',
      title: 'OWASP Top 10: XSS, SQLi, and SSRF Mitigation',
      difficulty: 'INTERMEDIATE',
      summary: 'Understanding common web application vulnerabilities and defensive input validation standards.',
      theoryContent: 'Server-Side Request Forgery (SSRF) occurs when a web server fetches external URLs without validating destination IP addresses. Mitigation requires strict hostname blocklists and loopback IP blocking.',
      practicalExample: 'Using XTRACY SSRF helper to block fetching localhost (127.0.0.1) or AWS metadata (169.254.169.254).',
      relatedToolHref: '/transparency',
      officialReference: 'OWASP Top 10 Web Application Security Risks',
      legalEthicalNotes: 'Vulnerability analysis must strictly adhere to authorized testing scope rules.',
    },
    {
      id: 'MOD-05',
      category: 'Cryptography',
      title: 'SHA-256 Hashing & Merkle Tree Integrity Chains',
      difficulty: 'ADVANCED',
      summary: 'Cryptographic hash functions, one-way properties, collision resistance, and RFC 8785 canonical manifests.',
      theoryContent: 'Cryptographic hash functions convert arbitrary data into a fixed-length 256-bit digest. Modifying even one bit alters the hash value completely (avalanche effect).',
      practicalExample: 'Chaining SHA-256 digests across sequential evidence items in EvidencePulse™.',
      relatedToolHref: '/evidencepulse',
      officialReference: 'FIPS PUB 180-4 Secure Hash Standard (SHS)',
      legalEthicalNotes: 'Cryptographic hashes verify data continuity without revealing underlying plaintext content.',
    },
    {
      id: 'MOD-06',
      category: 'Digital Forensics',
      title: 'Evidence Continuity & Chain of Custody Preservation',
      difficulty: 'ADVANCED',
      summary: 'Documenting evidence acquisition timestamps, original vs derivative copies, and SHA-256 verification.',
      theoryContent: 'Digital evidence organization requires preserving original files untouched, computing integrity hashes upon acquisition, and recording audit handling logs.',
      practicalExample: 'Organizing evidence items inside XTRACY Evidence Center with SHA-256 checksum tracking.',
      relatedToolHref: '/evidence',
      officialReference: 'ISO/IEC 27037 Guidelines for Identification, Collection, Acquisition and Preservation of Digital Evidence',
      legalEthicalNotes: 'Evidence organization tools provide data continuity tracking for authorized review.',
    },
  ];

  const categories = ['ALL', 'Cybersecurity Fundamentals', 'IT & Networking', 'Privacy & Digital Safety', 'Web Security', 'Cryptography', 'Digital Forensics'];

  const filteredModules = modules.filter((mod) => {
    const matchesCategory = selectedCategory === 'ALL' || mod.category === selectedCategory;
    const matchesSearch =
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-brand-cyan" />
              XTRACY Verified Knowledge &amp; Learning Center
            </h1>
            <Badge type="productStatus" value="ACADEMIC & THEORY" size="sm" />
          </div>
          <FeatureStatusBadge status="LOCAL" label="● VERIFIED CURRICULUM" />
        </div>
        <p className="text-xs text-gray-400">
          Structured cybersecurity theories, networking standards, cryptography guides, OWASP mitigations, and legal ethics.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <GlassCard className="p-6 border-brand-cyan/40 shadow-2xl flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search learning topics (e.g. 'DNSSEC', 'SHA-256', 'OWASP', 'WebCrypto')..."
            className="w-full p-4 pr-12 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 text-xs focus:border-brand-cyan"
          />
          <Search className="w-4 h-4 text-gray-400 absolute right-4 top-4" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-cyan text-black font-extrabold border-brand-cyan'
                  : 'bg-darkBg-panel text-gray-400 border-gray-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Learning Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredModules.map((mod) => (
          <GlassCard key={mod.id} className="p-6 border-gray-800 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-brand-cyan font-mono font-bold uppercase">{mod.category}</span>
                <span className="px-2 py-0.5 rounded bg-darkBg-panel text-gray-300 font-mono text-[10px] border border-gray-800">
                  {mod.difficulty}
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{mod.title}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{mod.summary}</p>

              <div className="p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1 text-xs font-mono">
                <strong className="text-gray-400 text-[10px] uppercase">Theory Overview:</strong>
                <p className="text-gray-200 text-xs font-sans leading-relaxed">{mod.theoryContent}</p>
              </div>

              <div className="p-3 rounded-xl bg-darkBg-panel/80 border border-gray-800/80 flex flex-col gap-1 text-xs font-mono">
                <strong className="text-emerald-400 text-[10px] uppercase">Practical XTRACY Application:</strong>
                <p className="text-gray-300 text-xs font-sans leading-relaxed">{mod.practicalExample}</p>
              </div>

              <span className="text-[10px] text-gray-500 font-mono italic">
                Official Ref: {mod.officialReference}
              </span>
            </div>

            <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-mono">Verified Academic Content</span>
              <Link
                href={mod.relatedToolHref}
                className="text-xs font-bold text-brand-cyan hover:underline flex items-center gap-1"
              >
                <span>Try Related Tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
