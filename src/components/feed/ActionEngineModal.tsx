'use client';

import React, { useState } from 'react';
import { ThreatReport, ReadingMode } from '@/types';
import { useProfileStore } from '@/store/useProfileStore';
import { calculatePersonalRelevance } from '@/lib/relevanceEngine';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ReadingModeToggle } from '@/components/ui/ReadingModeToggle';
import { X, ShieldAlert, CheckCircle2, BookOpen, GraduationCap, Code2, ExternalLink, UserCheck } from 'lucide-react';

interface ActionEngineModalProps {
  report: ThreatReport;
  onClose: () => void;
}

export const ActionEngineModal: React.FC<ActionEngineModalProps> = ({ report, onClose }) => {
  const [readingMode, setReadingMode] = useState<ReadingMode>('BEGINNER');
  const profile = useProfileStore((state) => state.profile);

  const relevance = calculatePersonalRelevance(report.affectedTags, profile);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <GlassCard className="max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 flex flex-col gap-6 border-brand-blue/40 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-800 pb-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge type="risk" value={report.severity} size="sm" />
              <Badge type="relevance" value={relevance.level} size="sm" />
              <Badge label="Category" value={report.category} size="sm" />
              {report.isDemoData && <Badge type="productStatus" value="DEMO DATA" size="sm" />}
            </div>
            <h2 className="text-xl font-black text-white leading-tight">{report.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Personal Relevance Box */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-brand-blue/15 via-darkBg-panel to-brand-violet/15 border border-brand-blue/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Does This Affect Me?</h4>
              <p className="text-xs text-gray-300">
                {relevance.matchedTags.length > 0
                  ? `YES — Matched items in your profile: ${relevance.matchedTags.join(', ')}.`
                  : `NO IMMEDIATE DIRECT MATCH — Your profile items (${profile.operatingSystems.concat(profile.socialMedia).slice(0, 3).join(', ')}) do not explicitly list these affected components.`}
              </p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase shrink-0 border ${
            relevance.level === 'Highly Relevant' ? 'bg-red-950 text-red-400 border-red-800' :
            relevance.level === 'Possibly Relevant' ? 'bg-amber-950 text-amber-400 border-amber-800' :
            'bg-emerald-950 text-emerald-400 border-emerald-800'
          }`}>
            Relevance: {relevance.level}
          </span>
        </div>

        {/* Reading Mode Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-brand-cyan">
            Select Intelligence Reading Mode
          </label>
          <ReadingModeToggle currentMode={readingMode} onSelectMode={setReadingMode} />
        </div>

        {/* Content Body Based on Reading Mode */}
        {readingMode === 'BEGINNER' && (
          <div className="flex flex-col gap-4 bg-darkBg-panel/50 p-5 rounded-2xl border border-gray-800">
            <div>
              <h4 className="text-xs font-bold uppercase text-brand-cyan tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> What Happened? (Human Explanation)
              </h4>
              <p className="text-sm text-gray-200 mt-2 leading-relaxed">
                {report.beginner.simpleExplanation}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-amber-400 tracking-wider">
                Why It Matters To You
              </h4>
              <p className="text-sm text-gray-300 mt-1 leading-relaxed">
                {report.beginner.whyItMatters}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-emerald-400 tracking-wider mb-2">
                What To Do Right Now (Immediate Actions)
              </h4>
              <div className="flex flex-col gap-2">
                {report.beginner.immediateSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 bg-gray-900/80 p-3 rounded-xl border border-gray-800 text-xs text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {readingMode === 'STUDENT' && (
          <div className="flex flex-col gap-4 bg-darkBg-panel/50 p-5 rounded-2xl border border-gray-800">
            <div>
              <h4 className="text-xs font-bold uppercase text-brand-cyan tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" /> Educational Technical Concept Overview
              </h4>
              <p className="text-sm text-gray-200 mt-2 leading-relaxed">
                {report.student.overview}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-purple-400 tracking-wider mb-2">
                Key Cybersecurity Concepts Involved
              </h4>
              <div className="flex flex-wrap gap-2">
                {report.student.concepts.map((c, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-purple-950/80 border border-purple-800 text-purple-300 text-xs font-semibold">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-xl text-xs text-blue-200">
              <span className="font-bold text-brand-cyan">Educational Note: </span>
              {report.student.educationalNote}
            </div>

            <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-200">
              <span className="font-bold text-emerald-400">Defensive Takeaway: </span>
              {report.student.defensiveTakeaway}
            </div>
          </div>
        )}

        {readingMode === 'PROFESSIONAL' && (
          <div className="flex flex-col gap-4 bg-darkBg-panel/50 p-5 rounded-2xl border border-gray-800 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
                <span className="text-[10px] text-gray-400 uppercase font-bold">CVE Identifier</span>
                <p className="text-sm font-bold text-brand-cyan">{report.professional.cve || 'N/A'}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
                <span className="text-[10px] text-gray-400 uppercase font-bold">CVSS Severity Score</span>
                <p className="text-sm font-bold text-red-400">{report.professional.cvssScore || 'N/A'} / 10</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
                <span className="text-[10px] text-gray-400 uppercase font-bold">MITRE ATT&CK ID</span>
                <p className="text-sm font-bold text-purple-300">{report.professional.mitreAttackId || 'N/A'}</p>
              </div>
            </div>

            <div>
              <span className="font-bold text-gray-300 uppercase text-[10px]">Affected Systems / Versions:</span>
              <p className="text-gray-200 font-mono text-[11px] bg-black/60 p-2 rounded-lg mt-1 border border-gray-800">
                {report.professional.affectedVersions || 'See official advisory notes'}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-emerald-400 uppercase text-[11px] mb-2">Remediation Steps</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                {report.professional.remediationSteps.map((rem, i) => (
                  <li key={i}>{rem}</li>
                ))}
              </ul>
            </div>

            {report.officialSource && (
              <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-gray-400">
                <span>Official Trusted Source: <strong className="text-white">{report.officialSource}</strong></span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-end border-t border-gray-800 pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs"
          >
            Close Intelligence Report
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
