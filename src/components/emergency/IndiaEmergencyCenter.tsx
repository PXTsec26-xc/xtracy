'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { PhoneCall, ShieldAlert, Heart, Shield, AlertTriangle, ExternalLink, Info } from 'lucide-react';

export const INDIA_EMERGENCY_CONTACTS = [
  {
    priority: 1,
    number: '112',
    telLink: 'tel:112',
    name: 'National Emergency Number',
    tagline: 'CALL 112 NOW — All Immediate Emergencies',
    scope: 'All India 24/7 Universal Emergency Dispatch',
    description: 'For immediate life safety emergencies, physical danger, accidents, or urgent medical & police dispatch across all States and Union Territories in India.',
    whenToCall: 'Call immediately when in physical danger, facing an ongoing crime, or requiring instant emergency response.',
    badgeColor: 'bg-red-600 text-white border-red-500 shadow-glowRed',
    cardBorder: 'border-red-500/60 bg-gradient-to-br from-red-950/60 via-darkBg-card to-slate-900',
    isPrimary: true,
  },
  {
    priority: 2,
    number: '181',
    telLink: 'tel:181',
    name: 'Women\'s Helpline',
    tagline: 'CALL 181 — Women in Distress & Safety Support',
    scope: 'National 24/7 Toll-Free Women Safety Helpline',
    description: 'Dedicated 24/7 confidential support for women facing online harassment, cyberstalking, domestic violence, extortion, or threats.',
    whenToCall: 'Call when experiencing online stalking, blackmail, harassment, or requiring female-focused safety assistance.',
    badgeColor: 'bg-purple-600 text-white border-purple-500',
    cardBorder: 'border-purple-500/50 bg-gradient-to-br from-purple-950/40 via-darkBg-card to-slate-900',
    isPrimary: false,
  },
  {
    priority: 3,
    number: '100',
    telLink: 'tel:100',
    name: 'Police Emergency',
    tagline: 'CALL 100 — Police Assistance & Crime Reporting',
    scope: 'Direct Police Control Room Access',
    description: 'Direct emergency line to state police control rooms for urgent law enforcement assistance and criminal incident reporting.',
    whenToCall: 'Call for immediate police assistance or when 112 routing is unavailable locally.',
    badgeColor: 'bg-blue-600 text-white border-blue-500',
    cardBorder: 'border-blue-500/40 bg-darkBg-panel/60',
    isPrimary: false,
  },
  {
    priority: 4,
    number: '1930',
    telLink: 'tel:1930',
    name: 'Cybercrime & Financial Fraud Helpline',
    tagline: 'CALL 1930 — National Cyber Crime Helpline',
    scope: 'Ministry of Home Affairs (MHA) Cyber Crime Portal',
    description: 'National helpline for reporting cyber fraud, financial unauthorized transactions, account hijacking, and online scams immediately to freeze lost funds.',
    whenToCall: 'Call within the "golden hour" if money was fraudulently stolen from your bank account or payment app.',
    badgeColor: 'bg-emerald-600 text-white border-emerald-500',
    cardBorder: 'border-emerald-500/40 bg-darkBg-panel/60',
    isPrimary: false,
  },
];

interface IndiaEmergencyCenterProps {
  compact?: boolean;
}

export const IndiaEmergencyCenter: React.FC<IndiaEmergencyCenterProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {INDIA_EMERGENCY_CONTACTS.map((c) => (
          <a
            key={c.number}
            href={c.telLink}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
              c.isPrimary
                ? 'bg-red-950/80 border-red-600 text-white hover:bg-red-900 shadow-lg shadow-red-950/60 scale-[1.02]'
                : 'bg-darkBg-panel/60 border-gray-800 text-gray-200 hover:border-brand-cyan/40'
            }`}
          >
            <span className="text-[10px] uppercase font-bold text-gray-400">Priority {c.priority}</span>
            <div className="flex items-center gap-1 my-1">
              <PhoneCall className="w-3.5 h-3.5 text-white" />
              <span className="text-xl font-black text-white">{c.number}</span>
            </div>
            <span className="text-[11px] font-bold line-clamp-1">{c.name}</span>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header Info */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
            India Emergency Response & Security Contact Center
          </h2>
          <Badge type="productStatus" value="VERIFIED 112 / 181 / 100 / 1930" size="sm" />
        </div>
        <p className="text-xs text-gray-300">
          One-tap direct dialing for national emergency, women safety distress, police, and cybercrime financial fraud reporting.
        </p>
      </div>

      {/* Primary Emergency Banner: CALL 112 NOW */}
      <GlassCard className="p-6 border-red-500/60 bg-gradient-to-r from-red-950/90 via-darkBg-card to-slate-900 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-600 border border-red-400 flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-950/80">
            <PhoneCall className="w-7 h-7 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-950 text-red-300 text-[10px] font-black uppercase border border-red-700">
                PRIORITY 1 EMERGENCY
              </span>
              <span className="text-xs font-bold text-gray-300">National Universal Dispatch</span>
            </div>
            <h3 className="text-2xl font-black text-white mt-1">CALL 112 NOW</h3>
            <p className="text-xs text-gray-200 mt-1 max-w-xl leading-relaxed">
              Use <strong>112</strong> for immediate physical danger, medical crises, domestic threat, or active police assistance across all of India.
            </p>
          </div>
        </div>

        <a
          href="tel:112"
          className="w-full md:w-auto px-10 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-lg shadow-2xl shadow-red-600/40 hover:scale-105 transition-all text-center shrink-0 flex items-center justify-center gap-2"
        >
          <PhoneCall className="w-5 h-5" />
          <span>CALL 112 NOW</span>
        </a>
      </GlassCard>

      {/* Grid of 4 Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {INDIA_EMERGENCY_CONTACTS.map((contact) => (
          <GlassCard key={contact.number} className={`p-6 ${contact.cardBorder} flex flex-col justify-between gap-4`}>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${contact.badgeColor}`}>
                  Priority {contact.priority}: {contact.number}
                </span>
                <span className="text-[11px] font-semibold text-gray-400">{contact.scope}</span>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white">{contact.name}</h4>
                <p className="text-xs text-brand-cyan font-semibold mt-0.5">{contact.tagline}</p>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed bg-darkBg-panel/60 p-3.5 rounded-xl border border-gray-800">
                {contact.description}
              </p>

              <div className="text-[11px] text-amber-300 font-medium">
                <strong>When To Use: </strong>{contact.whenToCall}
              </div>
            </div>

            <a
              href={contact.telLink}
              className={`w-full py-3.5 rounded-xl text-center font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                contact.isPrimary
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-950/50'
                  : 'bg-brand-blue hover:bg-brand-electric text-white shadow-glowBlue'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              <span>Tap To Call {contact.number}</span>
            </a>
          </GlassCard>
        ))}
      </div>

      {/* Official Incident Portal Link & Safety Disclaimer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-2xl bg-darkBg-panel/60 hover:bg-darkBg-panel border border-gray-800 flex items-center justify-between transition-all"
        >
          <div>
            <strong className="text-white block">National Cyber Crime Reporting Portal</strong>
            <span className="text-[11px] text-gray-400">Official Government of India Portal (cybercrime.gov.in)</span>
          </div>
          <ExternalLink className="w-4 h-4 text-brand-cyan shrink-0" />
        </a>

        <div className="md:col-span-2 p-4 rounded-2xl bg-gray-900/80 border border-gray-800 text-[11px] text-gray-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
          <p>
            <strong className="text-gray-200">EXPLICIT EMERGENCY DISCLAIMER:</strong> XTRACY provides quick access to official emergency numbers and digital safety guidance. It does NOT automatically contact police, does NOT send your location, and does NOT replace official 112 emergency services. If you are in immediate danger, call <strong>112</strong> directly from your phone.
          </p>
        </div>
      </div>
    </div>
  );
};
