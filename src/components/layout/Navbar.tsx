'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { UserNavMenu } from '@/components/auth/UserNavMenu';
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
    <header className="sticky top-10 z-40 px-4 max-w-7xl mx-auto my-2">
      <nav className="rounded-2xl bg-[rgba(12,18,28,0.88)] border border-[rgba(120,180,255,0.15)] backdrop-blur-xl shadow-glass px-4 py-3 flex items-center justify-between transition-all duration-300">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-brand-blue via-brand-cyan to-brand-violet p-0.5 shadow-glowBlue transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-darkBg rounded-[10px] flex items-center justify-center">
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-white to-brand-violet text-lg tracking-tighter">
                X
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg tracking-wider text-white flex items-center gap-1">
              XTRACY
            </span>
            <span className="text-[9px] uppercase tracking-widest text-brand-cyan font-semibold">
              FOUNDED & CREATED BY ELLIOT
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden xl:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold tracking-wide transition-all ${
                  active
                    ? 'bg-gradient-to-r from-brand-blue/20 to-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan shadow-sm font-bold'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-brand-cyan" />
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
            className="xl:hidden p-2 rounded-xl bg-gray-900/80 border border-gray-800 text-gray-300 hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="xl:hidden mt-2 rounded-2xl bg-darkBg-card/95 border border-brand-blue/20 backdrop-blur-2xl p-4 shadow-2xl flex flex-col gap-2 max-h-[75vh] overflow-y-auto">
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
                    ? 'bg-brand-blue/20 text-brand-cyan border border-brand-blue/40 font-bold'
                    : 'text-gray-300 hover:bg-gray-800/60'
                }`}
              >
                <Icon className="w-4 h-4 text-brand-cyan" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
