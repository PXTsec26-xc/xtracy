'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { SecurityAnalysisReport } from '@/lib/server/reportGenerator';
import { ShieldCheck, Printer, Download, X, AlertTriangle, FileText, Lock } from 'lucide-react';

interface ReportModalProps {
  report: SecurityAnalysisReport;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ report, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `XTRACY_Report_${report.reportId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-darkBg border border-brand-cyan/40 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl animate-fadeIn text-xs max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-brand-cyan" />
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider">
                XTRACY Automated Security Analysis Report
              </h2>
              <span className="text-xs text-gray-400 font-mono">Report ID: {report.reportId}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-4 h-4 text-brand-cyan" />
              <span className="hidden sm:inline">Print Report</span>
            </button>

            <button
              onClick={handleExportJson}
              className="px-3.5 py-2 rounded-xl bg-brand-blue hover:bg-brand-electric text-white font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-700 text-gray-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Overview Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono">
          <div className="p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
            <span className="text-gray-400 text-[10px] uppercase">Analysis Timestamp:</span>
            <strong className="text-white text-xs">{new Date(report.generatedAt).toLocaleString()}</strong>
          </div>

          <div className="p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
            <span className="text-gray-400 text-[10px] uppercase">Target Category:</span>
            <strong className="text-brand-cyan text-xs uppercase">{report.targetType}</strong>
          </div>

          <div className="p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
            <span className="text-gray-400 text-[10px] uppercase">Verdict:</span>
            <strong className="text-amber-400 text-xs font-bold">{report.verdict}</strong>
          </div>

          <div className="p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
            <span className="text-gray-400 text-[10px] uppercase">Explainable Risk Score:</span>
            <strong className="text-white text-sm font-black">{report.riskScore} / 100</strong>
          </div>
        </div>

        {/* Target Snippet */}
        <div className="p-4 rounded-xl bg-darkBg-panel/90 border border-gray-800 flex flex-col gap-1 font-mono">
          <strong className="text-gray-400 text-[10px] uppercase">Submitted Target Content Snippet:</strong>
          <p className="text-white text-xs break-all">{report.targetInputSnippet}</p>
        </div>

        {/* Technical Indicators */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-brand-cyan uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4" /> Detected Technical Indicators ({report.factors.length})
          </h3>

          <div className="flex flex-col gap-2">
            {report.factors.map((f, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <strong className="text-white font-bold">{f.name}</strong>
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[10px]">
                    +{f.points} PTS ({f.source})
                  </span>
                </div>
                <p className="text-gray-300 leading-relaxed">{f.technicalExplanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Integrity Checksum & Disclaimer */}
        <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 flex flex-col gap-2 font-mono">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-400">SHA-256 Integrity Checksum:</span>
            <strong className="text-emerald-400 text-[10px] break-all">{report.integrityHash}</strong>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-400">Privacy Mode:</span>
            <span className="text-cyan-300 font-bold">{report.privacyMode}</span>
          </div>

          <p className="text-[10px] text-gray-500 italic border-t border-gray-800 pt-2 leading-relaxed">
            {report.disclaimerNotice}
          </p>
        </div>
      </div>
    </div>
  );
};
