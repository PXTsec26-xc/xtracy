'use client';

import React, { useState } from 'react';
import { EMERGENCY_SCENARIOS } from '@/lib/mockData/emergencyScenarios';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, ShieldCheck, Lock, FileText, AlertTriangle } from 'lucide-react';

export const IncidentFlowAccordion: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(EMERGENCY_SCENARIOS[0].id);

  return (
    <div className="flex flex-col gap-4">
      {EMERGENCY_SCENARIOS.map((scen) => {
        const isOpen = openId === scen.id;
        return (
          <GlassCard key={scen.id} className="border-brand-blue/20 overflow-hidden">
            {/* Accordion Bar Header */}
            <button
              onClick={() => setOpenId(isOpen ? null : scen.id)}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-darkBg-panel/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm border ${
                  scen.priorityLevel === 'URGENT' ? 'bg-red-950/80 text-red-400 border-red-800' :
                  scen.priorityLevel === 'IMPORTANT' ? 'bg-amber-950/80 text-amber-400 border-amber-800' :
                  'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                }`}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {scen.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">{scen.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Badge type="risk" value={scen.priorityLevel} size="sm" />
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </div>
            </button>

            {/* Accordion Body Flow */}
            {isOpen && (
              <div className="p-5 border-t border-gray-800/80 bg-darkBg-panel/30 flex flex-col gap-6 animate-fadeIn">
                {/* 2 Column Flow: Do This Now vs Do NOT Do This */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* DO THIS NOW */}
                  <div className="flex flex-col gap-3 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/40">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> DO THIS RIGHT NOW
                    </h4>
                    <div className="flex flex-col gap-2">
                      {scen.doThisNow.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-emerald-200">
                          <span className="font-bold text-emerald-400">{idx + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DO NOT DO THIS */}
                  <div className="flex flex-col gap-3 p-4 rounded-2xl bg-red-950/20 border border-red-900/40">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> DO NOT DO THIS
                    </h4>
                    <div className="flex flex-col gap-2">
                      {scen.doNotDoThis.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-red-200">
                          <span className="font-bold text-red-400">•</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Guidance Sections */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800">
                    <h5 className="font-bold text-brand-cyan uppercase text-[11px] mb-2">Secure Your Account</h5>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      {scen.secureAccount.map((sec, i) => (
                        <li key={i}>{sec}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800">
                    <h5 className="font-bold text-amber-400 uppercase text-[11px] mb-2">Preserve Evidence</h5>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      {scen.preserveEvidence.map((ev, i) => (
                        <li key={i}>{ev}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800">
                    <h5 className="font-bold text-purple-300 uppercase text-[11px] mb-2">When To Escalate</h5>
                    <p className="text-gray-300 leading-relaxed">{scen.whenToEscalate}</p>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        );
      })}
    </div>
  );
};
