'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataTrustBadge } from '@/components/ui/DataTrustBadge';
import { CommunitySubmissionItem } from '@/app/api/submissions/route';
import { Users, ShieldAlert, ThumbsUp, Calendar, Filter, Plus } from 'lucide-react';
import Link from 'next/link';

export default function CommunityFeedPage() {
  const [items, setItems] = useState<CommunitySubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    fetch('/api/submissions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setItems(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = filterStatus === 'ALL'
    ? items
    : items.filter((item) => item.status === filterStatus);

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Users className="w-8 h-8 text-brand-cyan" />
              Community Threat Intelligence Feed
            </h1>
            <Badge type="productStatus" value="PUBLIC VERIFIED" size="sm" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Browse live crowdsourced scam alerts, phishing URLs, smishing messages, and impersonation reports submitted by users.
          </p>
        </div>

        <Link
          href="/submit-threat"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Threat</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="font-bold text-gray-300">Filter Status:</span>
          {['ALL', 'VERIFIED', 'PENDING_REVIEW'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                filterStatus === st
                  ? 'bg-brand-blue/30 border-brand-cyan text-brand-cyan'
                  : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {st === 'ALL' ? 'All Reports' : st === 'VERIFIED' ? '● Verified Only' : '● Pending Review'}
            </button>
          ))}
        </div>

        <span className="text-[11px] text-gray-400">Showing {filteredItems.length} submissions</span>
      </div>

      {/* List Grid */}
      {loading ? (
        <div className="text-center py-12 text-xs text-gray-400">Loading community threat feed...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredItems.map((item) => (
            <GlassCard key={item.id} className="p-6 border-gray-800 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                    item.status === 'VERIFIED'
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                      : 'bg-amber-950/80 text-amber-400 border-amber-800'
                  }`}>
                    {item.status === 'VERIFIED' ? '● VERIFIED REPORT' : '● PENDING VERIFICATION'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[10px] font-bold border border-purple-800">
                    {item.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-red-400">Risk Score: {item.riskScore}/100</span>
                  <DataTrustBadge status="LIVE" sourceName="XTRACY Community Queue" />
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-white font-mono bg-darkBg-panel/80 p-3 rounded-xl border border-gray-800 break-all">
                  {item.sampleContent}
                </p>
              </div>

              {item.warningSigns && item.warningSigns.length > 0 && (
                <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 text-xs">
                  <span className="font-bold text-amber-300 uppercase text-[10px] block mb-1">Detected Warning Indicators:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-gray-300">
                    {item.warningSigns.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-4">
                  <span>Reported by: <strong className="text-gray-200">{item.submitterName}</strong></span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {new Date(item.submittedAt).toLocaleDateString()}
                  </span>
                </div>

                <button
                  onClick={() => {
                    item.upvotesCount += 1;
                    setItems([...items]);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-brand-cyan font-bold transition-all"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Confirm Warning ({item.upvotesCount})</span>
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
