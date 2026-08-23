'use client';

import React, { useState } from 'react';
import { analyzeScamContent } from '@/lib/scamRules';
import { ScamAnalysisResult } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { RiskMeter } from '@/components/ui/RiskMeter';
import { Search, Link as LinkIcon, Mail, FileText, AlertTriangle, ShieldCheck, CheckCircle2, XCircle, Info } from 'lucide-react';

export const ScamAnalyzerForm: React.FC = () => {
  const [inputType, setInputType] = useState<'url' | 'text' | 'email'>('text');
  const [content, setContent] = useState('');
  const [result, setResult] = useState<ScamAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const res = analyzeScamContent(content, inputType);
      setResult(res);
      setIsAnalyzing(false);
    }, 400);
  };

  return (
    <div className="flex flex-col gap-6">
      <GlassCard className="p-6 border-brand-blue/30 shadow-2xl">
        <form onSubmit={handleAnalyze} className="flex flex-col gap-5">
          {/* Input Type Tabs */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-cyan">
              Select Input Type To Analyze
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { setInputType('text'); setResult(null); }}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all ${
                  inputType === 'text'
                    ? 'bg-brand-blue text-white shadow-glowBlue border border-brand-cyan'
                    : 'bg-darkBg-panel/60 text-gray-400 border border-gray-800 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Suspicious Text</span>
              </button>
              <button
                type="button"
                onClick={() => { setInputType('url'); setResult(null); }}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all ${
                  inputType === 'url'
                    ? 'bg-brand-blue text-white shadow-glowBlue border border-brand-cyan'
                    : 'bg-darkBg-panel/60 text-gray-400 border border-gray-800 hover:text-white'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                <span>Suspicious URL</span>
              </button>
              <button
                type="button"
                onClick={() => { setInputType('email'); setResult(null); }}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all ${
                  inputType === 'email'
                    ? 'bg-brand-blue text-white shadow-glowBlue border border-brand-cyan'
                    : 'bg-darkBg-panel/60 text-gray-400 border border-gray-800 hover:text-white'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Email Content</span>
              </button>
            </div>
          </div>

          {/* Textarea Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-300">
              {inputType === 'url' ? 'Paste Web Address / Link:' : inputType === 'email' ? 'Paste Email Subject Line & Body:' : 'Paste Message or SMS Text:'}
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                inputType === 'url'
                  ? 'e.g. http://verify-meta-account-update.xyz/login'
                  : inputType === 'email'
                  ? 'e.g. URGENT: Your account will be suspended in 24 hours unless you verify your password at...'
                  : 'e.g. Someone is threatening to leak your intimate pictures unless you send $500 in crypto...'
              }
              className="w-full p-4 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan text-sm transition-all"
            />
          </div>

          {/* Action & Disclaimer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-[11px] text-gray-400 max-w-md">
              <strong className="text-gray-300">Privacy Guarantee:</strong> Content is analyzed client-side using heuristic rule matching. No text or URL is transmitted to external servers.
            </p>

            <button
              type="submit"
              disabled={isAnalyzing || !content.trim()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-bold text-sm shadow-glowBlue hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{isAnalyzing ? 'Analyzing Pattern...' : 'Run Scam Check'}</span>
            </button>
          </div>
        </form>
      </GlassCard>

      {/* Analysis Results Display */}
      {result && (
        <GlassCard className="p-6 border-brand-blue/40 shadow-2xl flex flex-col gap-6 animate-fadeIn">
          {/* Result Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">XTRACY Scam Analysis Result</h3>
                <Badge type="productStatus" value="WORKING" size="sm" />
              </div>
              <p className="text-xs text-gray-400 mt-1">Analyzed at {result.analyzedAt}</p>
            </div>
            <Badge type="risk" value={result.riskLevel} />
          </div>

          {/* Risk Meter & Main Flag Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1 flex justify-center bg-darkBg-panel/50 p-4 rounded-2xl border border-gray-800">
              <RiskMeter score={result.riskScore} riskLevel={result.riskLevel} />
            </div>

            <div className="md:col-span-2 flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-cyan">
                Why It Was Flagged
              </h4>
              <p className="text-sm text-gray-200 leading-relaxed bg-darkBg-panel/60 p-4 rounded-xl border border-gray-800">
                {result.dangerExplanation}
              </p>

              <div className="flex flex-col gap-1.5 mt-1">
                <span className="text-xs font-bold text-amber-400">Warning Indicators Detected:</span>
                <div className="flex flex-col gap-1.5">
                  {result.warningSigns.map((sign, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-300 bg-gray-900/80 p-2.5 rounded-lg border border-gray-800">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{sign}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Do Not Do & Safe Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* What NOT to do */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl bg-red-950/20 border border-red-900/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> What You Should NOT Do
              </h4>
              <div className="flex flex-col gap-2 text-xs text-red-200">
                {result.whatNotToDo.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safe Next Steps */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Safe Recommended Next Steps
              </h4>
              <div className="flex flex-col gap-2 text-xs text-emerald-200">
                {result.safeNextSteps.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mandatory Heuristic Disclaimer */}
          <div className="p-3 rounded-xl bg-gray-900/90 border border-gray-800 text-[11px] text-gray-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
            <p>
              <strong className="text-gray-300">IMPORTANT HEURISTIC DISCLAIMER:</strong> This analysis is a client-side heuristic risk evaluation, not a guarantee of safety or malicious intent. Automated tools can have false positives and false negatives. Always verify suspicious communications through official channels.
            </p>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
