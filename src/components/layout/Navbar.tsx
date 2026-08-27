'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { UserNavMenu } from '@/components/auth/UserNavMenu';
import { XtracyLogo } from '@/components/common/XtracyLogo';
import {
  Shield,
  Search,
  Globe,
  Radio,
  Lock,
  Menu,
  X,
  Sparkles,
  Briefcase,
  Wrench,
  User,
  ShieldCheck,
  Building2,
  Eye,
  Dna,
  FileCheck,
  Terminal,
  Info,
  BookOpen,
  Activity,
  FileText,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'HOME', icon: Shield },
    { href: '/about', label: 'ABOUT', icon: Info },
    { href: '/founder', label: 'FOUNDER', icon: User },
    { href: '/evidence', label: 'EVIDENCE', icon: Dna },
    { href: '/scam-check', label: 'SCAM CHECK', icon: ShieldCheck },
    { href: '/nexus', label: 'NEXUS', icon: Briefcase },
    { href: '/assistant', label: 'AI ASSISTANT', icon: Terminal },
    { href: '/learning', label: 'LEARNING', icon: BookOpen },
    { href: '/tools', label: 'TOOLS', icon: Wrench },
    { href: '/governance', label: 'GOVERNANCE', icon: FileText },
    { href: '/status', label: 'STATUS', icon: Activity },
    { href: '/transparency', label: 'TRANSPARENCY', icon: Eye },
    { href: '/safe-vault', label: 'VAULT', icon: Lock },
  ];

  return (
    <header className="sticky top-6 z-40 px-4 max-w-7xl mx-auto my-2">
      <nav className="rounded-2xl bg-[rgba(9,16,29,0.85)] border border-[rgba(56,189,248,0.18)] backdrop-blur-2xl shadow-glass px-4 py-3 flex items-center justify-between transition-all duration-300">
        {/* Stylized XTRACY Executive Brand Logo */}
        <XtracyLogo size="md" showSubtitle={true} />

        {/* Desktop Navigation Links */}
        <div className="hidden xl:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold tracking-wide transition-all ${
                  active
                    ? 'bg-sky-500/15 border border-sky-400/35 text-sky-300 shadow-sm font-bold'
                    : 'text-gray-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-sky-400' : 'text-sky-400/80'}`} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Section: User Nav Menu + Theme Switcher */}
        <div className="flex items-center gap-2.5">
          <UserNavMenu />

          <div className="hidden sm:block">
            <ThemeSwitcher />
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden p-2 rounded-xl bg-slate-900/80 border border-sky-500/20 text-gray-300 hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="xl:hidden mt-2 rounded-2xl bg-[rgba(9,16,29,0.95)] border border-sky-500/30 backdrop-blur-2xl p-4 shadow-2xl flex flex-col gap-2 max-h-[75vh] overflow-y-auto">
          <div className="pb-2 border-b border-gray-800 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Navigation Menu</span>
            <ThemeSwitcher />
          </div>
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                    : 'text-gray-300 hover:bg-gray-800/60'
                }`}
              >
                <Icon className="w-4 h-4 text-sky-400" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
