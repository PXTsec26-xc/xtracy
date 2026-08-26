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

  const handleExportHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>XTRACY Security Analysis Report - ${report.reportId}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0c121c; color: #e2e8f0; padding: 40px; line-height: 1.6; }
    .card { background: #111827; border: 1px solid #1e293b; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
    h1 { color: #38bdf8; font-size: 24px; margin-bottom: 8px; }
    .meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 20px 0; font-family: monospace; font-size: 13px; }
    .meta-box { background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #1e293b; }
    .indicator { background: #0f172a; border-left: 4px solid #38bdf8; padding: 16px; margin-bottom: 12px; border-radius: 4px; }
    .footer { font-size: 11px; color: #64748b; font-style: italic; margin-top: 40px; border-top: 1px solid #1e293b; padding-top: 16px; }
  </style>
</head>
<body>
  <div className="card">
    <h1>XTRACY Automated Security Analysis Report</h1>
    <div>Report ID: <strong>${report.reportId}</strong> | Platform: <strong>${report.platformVersion}</strong></div>
    
    <div className="meta">
      <div className="meta-box">Timestamp: <strong>${new Date(report.generatedAt).toUTCString()}</strong></div>
      <div className="meta-box">Category: <strong>${report.targetType}</strong></div>
      <div className="meta-box">Verdict: <strong>${report.verdict}</strong></div>
      <div className="meta-box">Risk Score: <strong>${report.riskScore} / 100</strong></div>
    </div>

    <div className="meta-box" style="margin-bottom: 24px;">
      <strong style="color: #94a3b8; font-size: 11px; text-transform: uppercase;">Submitted Target Content:</strong>
      <div style="font-family: monospace; font-size: 12px; word-break: break-all; margin-top: 6px;">${report.targetInputSnippet}</div>
    </div>

    <h2>Detected Technical Indicators (${report.factors.length})</h2>
    ${report.factors
      .map(
        (f) => `
      <div className="indicator">
        <strong style="color: #ffffff; font-size: 14px;">${f.name} (+${f.points} pts - ${f.source})</strong>
        <p style="font-size: 13px; color: #cbd5e1; margin-top: 6px;">${f.technicalExplanation}</p>
      </div>`
      )
      .join('')}

    <h2>Recommended Defensive Actions</h2>
    <ul>
      ${report.defensiveRecommendations.map((r) => `<li>${r}</li>`).join('')}
    </ul>

    <div className="footer">
      <div>SHA-256 Checksum: <strong>${report.integrityHash}</strong> | Privacy Mode: <strong>${report.privacyMode}</strong></div>
      <p>${report.disclaimerNotice}</p>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `XTRACY_Report_${report.reportId}.html`;
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
              className="px-3 py-2 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-4 h-4 text-brand-cyan" />
              <span className="hidden sm:inline">Print Report</span>
            </button>

            <button
              onClick={handleExportHtml}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download HTML</span>
            </button>

            <button
              onClick={handleExportJson}
              className="px-3 py-2 rounded-xl bg-brand-blue hover:bg-brand-electric text-white font-bold text-xs flex items-center gap-1.5 transition-all"
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
