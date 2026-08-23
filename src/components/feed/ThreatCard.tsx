'use client';

import React, { useState } from 'react';
import { ThreatReport } from '@/types';
import { useProfileStore } from '@/store/useProfileStore';
import { calculatePersonalRelevance } from '@/lib/relevanceEngine';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataTrustBadge } from '@/components/ui/DataTrustBadge';
import { ActionEngineModal } from '@/components/feed/ActionEngineModal';
import { ShieldAlert, ArrowRight, UserCheck, Calendar } from 'lucide-react';

interface ThreatCardProps {
  report: ThreatReport;
}

export const ThreatCard: React.FC<ThreatCardProps> = ({ report }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const profile = useProfileStore((state) => state.profile);

  const relevance = calculatePersonalRelevance(report.affectedTags, profile);

  return (
    <>
      <GlassCard variant="interactive" className="p-5 flex flex-col justify-between gap-4 group">
        <div className="flex flex-col gap-3">
          {/* Header Badges with DataTrust System */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge type="risk" value={report.severity} size="sm" />
              <DataTrustBadge
                trustInfo={report.dataTrust}
                status={report.isDemoData ? 'DEMO' : 'LIVE'}
                sourceName={report.officialSource || 'CISA KEV / XTRACY Intelligence'}
              />
            </div>
            <Badge type="relevance" value={relevance.level} size="sm" />
          </div>

          {/* Title & Summary */}
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-brand-cyan transition-colors leading-snug">
              {report.title}
            </h3>
            <p className="text-xs text-gray-300 mt-2 line-clamp-2 leading-relaxed">
              {report.summary}
            </p>
          </div>

          {/* Personal Relevance Highlight Box */}
          <div className="p-3 rounded-xl bg-darkBg-panel/60 border border-gray-800/80 flex items-start gap-2.5">
            <UserCheck className={`w-4 h-4 mt-0.5 shrink-0 ${
              relevance.level === 'Highly Relevant' ? 'text-red-400' :
              relevance.level === 'Possibly Relevant' ? 'text-amber-400' : 'text-emerald-400'
            }`} />
            <div className="text-[11px]">
              <span className="font-bold text-gray-200">Personal Impact: </span>
              <span className="text-gray-300">
                {relevance.matchedTags.length > 0
                  ? `Matches your profile items: ${relevance.matchedTags.join(', ')}`
                  : 'Does not match your primary device profile.'}
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer Action */}
        <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs">
          <span className="text-gray-400 flex items-center gap-1 text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {report.publishedAt}
          </span>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-blue/20 hover:bg-brand-blue/40 border border-brand-cyan/40 text-brand-cyan font-bold transition-all"
          >
            <span>Does This Affect Me?</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </GlassCard>

      {/* Action Engine Modal */}
      {modalOpen && (
        <ActionEngineModal report={report} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
};
