'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { XtracyLogo } from '@/components/common/XtracyLogo';
import { UserNavMenu } from '@/components/auth/UserNavMenu';
import {
  Search,
  ChevronDown,
  Menu,
  X,
  Shield,
  Briefcase,
  Dna,
  ShieldCheck,
  Terminal,
  Lock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toolsRef = useRef<HTMLDivElement>(null);
  const legalRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
      if (legalRef.current && !legalRef.current.contains(e.target as Node)) {
        setLegalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toolItems = [
    { name: 'XTRACY NEXUS Engine', desc: 'Central multi-vector threat analyzer', href: '/nexus', icon: Briefcase },
    { name: 'Real Scam Check', desc: 'Heuristic text & lure risk evaluation', href: '/scam-check', icon: ShieldCheck },
    { name: 'EvidencePulse™ SHA-256', desc: 'RFC 8785 canonical manifest pipeline', href: '/evidencepulse', icon: Dna },
    { name: 'Security Posture Check', desc: 'Passive header & DNS diagnostic', href: '/tools/security-posture', icon: Shield },
    { name: 'Safe Vault (AES-GCM)', desc: 'Zero-knowledge encrypted client storage', href: '/safe-vault', icon: Lock },
    { name: 'Security Test Lab', desc: '26 automated in-browser unit tests', href: '/test-lab', icon: Terminal },
    { name: 'View All 18 Tools →', desc: 'Explore complete diagnostic suite', href: '/tools', icon: ArrowRight },
  ];

  const legalItems = [
    { name: 'Legal Terms & Policy', href: '/legal' },
    { name: 'Intellectual Property', href: '/intellectual-property' },
    { name: 'Ownership Declaration', href: '/ownership' },
    { name: 'Governance & Pilot Scope', href: '/governance' },
    { name: 'Transparency Center', href: '/transparency' },
  ];

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6 max-w-7xl mx-auto w-full">
      <nav className="rounded-full bg-[#050b16]/90 border border-sky-500/25 backdrop-blur-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.65)] transition-all">
        {/* Brand Logo Lockup */}
        <div className="flex items-center shrink-0">
          <XtracyLogo size="sm" variant="auto" priority={true} />
        </div>

        {/* Center Desktop Navigation Links (Pill Style as in UI Reference) */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2 text-[12px] font-medium tracking-wide">
          <Link
            href="/"
            className={`px-3.5 py-1 rounded-full transition-all ${
              pathname === '/'
                ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-semibold shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                : 'text-gray-300 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            Home
          </Link>

          {/* Tools Dropdown */}
          <div className="relative" ref={toolsRef}>
            <button
              onClick={() => {
                setToolsOpen(!toolsOpen);
                setLegalOpen(false);
              }}
              className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all ${
                pathname.startsWith('/tools') || pathname === '/nexus' || pathname === '/scam-check'
                  ? 'text-cyan-300 font-semibold'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <span>Tools</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${toolsOpen ? 'rotate-180 text-cyan-400' : ''}`} />
            </button>

            {toolsOpen && (
              <div className="absolute top-full left-0 mt-3 w-80 rounded-2xl bg-[#070e1c]/95 border border-sky-500/30 backdrop-blur-2xl p-2 shadow-2xl flex flex-col gap-1 z-50 animate-fadeIn">
                <div className="px-3 py-1.5 border-b border-gray-800 text-[10px] uppercase font-mono font-bold text-sky-400">
                  Featured Intelligence Engines
                </div>
                {toolItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setToolsOpen(false)}
                      className="p-2.5 rounded-xl hover:bg-sky-500/10 flex items-center gap-3 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-sky-950/60 border border-sky-800/50 text-cyan-400 group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <strong className="text-white text-xs group-hover:text-cyan-300 font-semibold">
                          {item.name}
                        </strong>
                        <span className="text-[10px] text-gray-400">{item.desc}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            href="/about"
            className={`px-3 py-1 rounded-full transition-all ${
              pathname === '/about' ? 'text-cyan-300 font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            About
          </Link>

          <Link
            href="/founder"
            className={`px-3 py-1 rounded-full transition-all ${
              pathname === '/founder'
                ? 'bg-cyan-500/20 border border-cyan-400/80 text-cyan-300 font-semibold shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Founder
          </Link>

          <Link
            href="/governance"
            className={`px-3 py-1 rounded-full transition-all ${
              pathname === '/governance' ? 'text-cyan-300 font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            Governance
          </Link>

          <Link
            href="/transparency"
            className={`px-3 py-1 rounded-full transition-all ${
              pathname === '/transparency' ? 'text-cyan-300 font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            Transparency
          </Link>

          <Link
            href="/intellectual-property"
            className={`px-3 py-1 rounded-full transition-all ${
              pathname === '/intellectual-property' ? 'text-cyan-300 font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            Intellectual Property
          </Link>

          <Link
            href="/press"
            className={`px-3 py-1 rounded-full transition-all ${
              pathname === '/press' ? 'text-cyan-300 font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            Press
          </Link>

          {/* Legal Dropdown */}
          <div className="relative" ref={legalRef}>
            <button
              onClick={() => {
                setLegalOpen(!legalOpen);
                setToolsOpen(false);
              }}
              className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all ${
                pathname === '/legal' || pathname === '/ownership'
                  ? 'text-cyan-300 font-semibold'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <span>Legal</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${legalOpen ? 'rotate-180 text-cyan-400' : ''}`} />
            </button>

            {legalOpen && (
              <div className="absolute top-full right-0 mt-3 w-56 rounded-2xl bg-[#070e1c]/95 border border-sky-500/30 backdrop-blur-2xl p-2 shadow-2xl flex flex-col gap-1 z-50 animate-fadeIn">
                {legalItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setLegalOpen(false)}
                    className="px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-sky-500/10 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Search & Launch XTRACY Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Button */}
          <Link
            href="/tools"
            className="p-2 rounded-full text-gray-300 hover:text-cyan-400 hover:bg-slate-800/50 transition-colors"
            title="Search Tools & Indicators"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </Link>

          {/* User Nav Menu for Authentication */}
          <div className="hidden sm:block">
            <UserNavMenu />
          </div>

          {/* Launch XTRACY Primary Action Button */}
          <Link
            href="/nexus"
            className="px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-[#020817] font-black text-xs tracking-wider uppercase shadow-[0_0_18px_rgba(34,211,238,0.45)] transition-all hover:scale-105 flex items-center gap-1.5 shrink-0"
          >
            <span>Launch XTRACY</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900/80 border border-sky-500/30 text-gray-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="lg:hidden mt-2 rounded-2xl bg-[#060c18]/95 border border-sky-500/30 backdrop-blur-2xl p-4 shadow-2xl flex flex-col gap-2 max-h-[80vh] overflow-y-auto animate-fadeIn">
          <div className="pb-2 border-b border-gray-800 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Navigation</span>
            <UserNavMenu />
          </div>

          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-white hover:bg-sky-500/10"
          >
            Home
          </Link>
          <Link
            href="/nexus"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-cyan-300 hover:bg-sky-500/10"
          >
            XTRACY NEXUS Engine
          </Link>
          <Link
            href="/tools"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:bg-sky-500/10"
          >
            All 18 Security Tools
          </Link>
          <Link
            href="/scam-check"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:bg-sky-500/10"
          >
            Scam Check
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:bg-sky-500/10"
          >
            About
          </Link>
          <Link
            href="/founder"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-cyan-300 hover:bg-sky-500/10"
          >
            Founder (Elliot PXT sec26)
          </Link>
          <Link
            href="/governance"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:bg-sky-500/10"
          >
            Governance
          </Link>
          <Link
            href="/transparency"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:bg-sky-500/10"
          >
            Transparency
          </Link>
          <Link
            href="/intellectual-property"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:bg-sky-500/10"
          >
            Intellectual Property
          </Link>
          <Link
            href="/ownership"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:bg-sky-500/10"
          >
            Ownership Record
          </Link>
          <Link
            href="/legal"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:bg-sky-500/10"
          >
            Legal &amp; Policy
          </Link>
          <Link
            href="/press"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:bg-sky-500/10"
          >
            Press Kit
          </Link>
        </div>
      )}
    </header>
  );
};
