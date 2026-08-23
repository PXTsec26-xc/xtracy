'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Shield, Heart, Lock, CheckCircle2, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-gray-800/80 bg-darkBg-card/50 backdrop-blur-lg pt-12 pb-8 text-gray-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Mission */}
        <div className="flex flex-col gap-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-blue to-brand-violet p-0.5">
              <div className="w-full h-full bg-darkBg rounded-[6px] flex items-center justify-center font-black text-brand-cyan text-sm">
                X
              </div>
            </div>
            <span className="font-black text-white text-base tracking-wider">XTRACY</span>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            Trace. Analyze. Protect.
          </p>
          <p className="text-gray-400 text-[11px] leading-relaxed">
            Free public digital safety, cybersecurity intelligence, privacy awareness, emergency response, and women's safety platform.
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge type="productStatus" value="WORKING" size="sm" />
            <Badge type="productStatus" value="LOCAL ONLY" size="sm" />
          </div>
        </div>

        {/* Core Platform Modules */}
        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-brand-cyan mb-1">
            Core Platform
          </h4>
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Personal Security Dashboard
          </Link>
          <Link href="/scan" className="hover:text-white transition-colors">
            Quick Scan Center (Scam Check)
          </Link>
          <Link href="/emergency" className="hover:text-white transition-colors">
            Cyber Emergency Response Center
          </Link>
          <Link href="/womens-safety" className="hover:text-white transition-colors">
            Women's Safety & Privacy Center
          </Link>
          <Link href="/safe-vault" className="hover:text-white transition-colors">
            Private Safe Vault (AES-GCM)
          </Link>
        </div>

        {/* Intelligence & Resources */}
        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-brand-cyan mb-1">
            Intelligence & Safety
          </h4>
          <Link href="/intelligence" className="hover:text-white transition-colors">
            Threat Intelligence & Advisories
          </Link>
          <Link href="/threat-map" className="hover:text-white transition-colors">
            Global Cyber Incident Map
          </Link>
          <Link href="/assistant" className="hover:text-white transition-colors">
            XTRACY AI Security Assistant
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy-First Transparency Policy
          </Link>
        </div>

        {/* Safety Disclaimer */}
        <div className="flex flex-col gap-2 bg-gray-900/60 p-4 rounded-2xl border border-gray-800">
          <div className="flex items-center gap-1.5 font-bold text-gray-200">
            <Info className="w-4 h-4 text-brand-cyan" />
            <span>Safety Disclaimer</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-normal">
            XTRACY is a self-help digital safety platform providing educational guidance, defensive checklists, and heuristic analysis. It does not replace local emergency services, police, or official law enforcement. If in immediate danger, call 911 or your local emergency hotline.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-gray-400">
        <p>© {new Date().getFullYear()} XTRACY Digital Safety & Security Intelligence Network. Built for public good.</p>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Client-Side Privacy
          </span>
          <span className="flex items-center gap-1 text-purple-400">
            <Lock className="w-3.5 h-3.5" /> AES-GCM Encrypted
          </span>
        </div>
      </div>
    </footer>
  );
};
