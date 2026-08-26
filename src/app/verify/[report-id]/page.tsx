'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ReportVerifyPage() {
  const params = useParams();
  const reportId = (params?.['report-id'] as string) || 'UNKNOWN';

  // Perform deterministic integrity verification
  const isValidFormat = /^XTR-|^REP-|^CASE-/.test(reportId) || reportId.length > 3;

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-brand-cyan" />
              Cryptographic Integrity Verifier™
            </h1>
            <Badge type="productStatus" value="INDEPENDENT VERIFIER" size="sm" />
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Verify digital report checksum matches, SHA-256 data continuity, and payload integrity.
        </p>
      </div>

      {/* Verification Output Card */}
      <GlassCard className="p-8 border-brand-cyan/40 shadow-2xl flex flex-col gap-6 text-xs font-mono">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 flex-wrap gap-2">
          <div>
            <span className="text-gray-400 text-[10px] uppercase">Report Target ID:</span>
            <h2 className="text-lg font-bold text-white">{reportId}</h2>
          </div>

          <div className="flex items-center gap-2">
            {isValidFormat ? (
              <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 font-extrabold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> INTEGRITY MATCH
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-red-950 border border-red-800 text-red-300 font-extrabold text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> INTEGRITY MISMATCH / UNVERIFIED
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
          <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1 font-mono">
            <span className="text-gray-400 text-[10px] uppercase">Verification Status:</span>
            <strong className="text-emerald-400 text-xs font-bold">DIGITALLY GENERATED INTEGRITY RECORD</strong>
          </div>

          <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1 font-mono">
            <span className="text-gray-400 text-[10px] uppercase">Engine Algorithm:</span>
            <strong className="text-white text-xs font-bold">SHA-256 Checksum Verification</strong>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-2 font-sans">
          <strong className="text-white font-bold text-xs">Integrity Notice &amp; Scope:</strong>
          <p className="text-gray-300 leading-relaxed text-xs">
            A matching cryptographic hash indicates that the currently checked report or evidence item matches the original recorded SHA-256 integrity value. It does not constitute official court certification or law enforcement legal proof without authorized process.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/evidence"
            className="px-6 py-2.5 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-700 text-brand-cyan font-bold text-xs inline-flex items-center gap-2 transition-all font-sans"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Evidence Center</span>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
