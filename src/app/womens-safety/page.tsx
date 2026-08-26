'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { QuickExitButton } from '@/components/ui/QuickExitButton';
import { Badge } from '@/components/ui/Badge';
import { IndiaEmergencyCenter } from '@/components/emergency/IndiaEmergencyCenter';
import { EmergencyHelpModal } from '@/components/womens-safety/EmergencyHelpModal';
import { SocialMediaChecklist } from '@/components/womens-safety/SocialMediaChecklist';
import { WOMEN_SAFETY_GUIDES } from '@/lib/mockData/womensSafety';
import { Heart, ShieldAlert, Lock, PhoneCall } from 'lucide-react';

export default function WomensSafetyPage() {
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-10 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Heart className="w-7 h-7 text-purple-400" />
              Women&apos;s Safety & Privacy Center
            </h1>
            <Badge type="productStatus" value="100% PRIVATE & LOCAL" size="sm" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Dedicated digital safety, harassment response, cyberstalking protection, and confidential emergency guidance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setEmergencyModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg shadow-red-950/60 transition-all flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            <span>I NEED HELP NOW</span>
          </button>
          <QuickExitButton variant="navbar" />
        </div>
      </div>

      {/* India Emergency Contacts Section */}
      <IndiaEmergencyCenter />

      {/* Prominent Emergency Assistance Triage Card */}
      <GlassCard className="p-6 border-red-500/40 bg-gradient-to-r from-red-950/40 via-darkBg-card to-purple-950/40 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-950 border border-red-700/60 flex items-center justify-center text-red-400 shrink-0">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Emergency Assistance Triage</h3>
            <p className="text-xs text-gray-300 mt-1">
              Select your current situation without publicly explaining sensitive details. Get immediate defensive steps and official helplines.
            </p>
          </div>
        </div>

        <button
          onClick={() => setEmergencyModalOpen(true)}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-lg shrink-0 transition-all"
        >
          Open Emergency Help Window
        </button>
      </GlassCard>

      {/* Social Media Privacy Checklists */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-cyan" />
            Social Media Privacy Audit Checklists
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Step-by-step security and privacy settings for Instagram, WhatsApp, Facebook, and TikTok.
          </p>
        </div>

        <SocialMediaChecklist />
      </section>

      {/* Safety Guides & Evidence Preservation */}
      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold text-white">Safety Guides & Evidence Preservation</h2>
          <p className="text-xs text-gray-400 mt-0.5">Practical defensive responses for stalking, harassment, and impersonation.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {WOMEN_SAFETY_GUIDES.map((guide) => (
            <GlassCard key={guide.id} className="p-6 border-purple-500/20 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <h3 className="text-base font-bold text-white text-purple-300">{guide.title}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[11px] font-bold border border-purple-800">
                  {guide.category}
                </span>
              </div>

              <p className="text-xs text-gray-300">{guide.summary}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-2">
                <div className="p-4 rounded-xl bg-darkBg-panel/60 border border-gray-800">
                  <h4 className="font-bold text-amber-400 uppercase text-[11px] mb-2">Warning Signs</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    {guide.warningSigns.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-darkBg-panel/60 border border-gray-800">
                  <h4 className="font-bold text-emerald-400 uppercase text-[11px] mb-2">Immediate Defensive Steps</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    {guide.immediateDefensiveSteps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Official Helplines */}
              <div className="pt-3 border-t border-gray-800/80 flex flex-col gap-2">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase">Trusted Official Resources & Helplines</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {guide.officialResources.map((res, i) => (
                    <a
                      key={i}
                      href={res.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-800 flex flex-col justify-between transition-all"
                    >
                      <strong className="text-white">{res.name}</strong>
                      <span className="text-[11px] text-gray-400 mt-1">{res.contact}</span>
                    </a>
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Emergency Help Modal */}
      {emergencyModalOpen && (
        <EmergencyHelpModal onClose={() => setEmergencyModalOpen(false)} />
      )}
    </div>
  );
}
