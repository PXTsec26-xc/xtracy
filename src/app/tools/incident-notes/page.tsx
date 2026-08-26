'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import {
  FileText,
  Plus,
  Trash2,
  Download,
  Copy,
  Check,
  AlertTriangle,
  Clock,
  Shield,
  Layers,
} from 'lucide-react';

interface NoteEntry {
  id: string;
  timestamp: string;
  author: string;
  actionTaken: string;
  evidence: string;
  nextStep: string;
}

export default function IncidentNotesPage() {
  const [incidentTitle, setIncidentTitle] = useState('INC-2026-08: Suspicious Phishing Domain Investigation');
  const [severity, setSeverity] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [status, setStatus] = useState<'TRIAGE' | 'CONTAINMENT' | 'ERADICATION' | 'RESOLVED'>('CONTAINMENT');
  const [copied, setCopied] = useState(false);

  const [entries, setEntries] = useState<NoteEntry[]>([
    {
      id: 'e-1',
      timestamp: new Date().toLocaleTimeString(),
      author: 'Security Lead',
      actionTaken: 'Observed lookalike domain targeting company authentication portal. Executed URL Guard and DNS lookup.',
      evidence: 'Domain resolved to overseas bulletproof hosting IP. SPF missing.',
      nextStep: 'Submit abuse report to registrar and update firewall blocklist.',
    },
  ]);

  const addEntry = () => {
    const newEntry: NoteEntry = {
      id: `e-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      author: 'Security Analyst',
      actionTaken: '',
      evidence: '',
      nextStep: '',
    };
    setEntries([newEntry, ...entries]);
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const updateEntry = (id: string, field: keyof NoteEntry, val: string) => {
    setEntries(entries.map((e) => (e.id === id ? { ...e, [field]: val } : e)));
  };

  const exportMarkdown = () => {
    let md = `# Incident Record: ${incidentTitle}\n\n`;
    md += `**Severity:** ${severity}  \n`;
    md += `**Status:** ${status}  \n`;
    md += `**Date:** ${new Date().toLocaleDateString()}  \n\n`;
    md += `---\n\n## Incident Timeline & Action Notes\n\n`;

    entries.forEach((e) => {
      md += `### [${e.timestamp}] by ${e.author}\n\n`;
      md += `**Action Taken:** ${e.actionTaken}\n\n`;
      md += `**Evidence / Artifacts:** ${e.evidence}\n\n`;
      md += `**Next Steps:** ${e.nextStep}\n\n---\n\n`;
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <FileText className="w-8 h-8 text-brand-cyan" />
              Incident Response Notes Workspace
            </h1>
            <Badge type="productStatus" value="INCIDENT WORKSPACE" size="sm" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Structured defensive incident response logger for recording timeline evidence, triage actions, and remediation next steps.
          </p>
        </div>

        <button
          onClick={exportMarkdown}
          className="px-4 py-2 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Timeline' : 'Export Incident Log'}</span>
        </button>
      </div>

      {/* Incident Case Banner */}
      <GlassCard className="p-6 border-brand-blue/30 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <input
            type="text"
            value={incidentTitle}
            onChange={(e) => setIncidentTitle(e.target.value)}
            className="flex-1 p-2.5 rounded-xl bg-darkBg-panel border border-gray-800 text-white font-bold text-sm focus:border-brand-cyan"
          />

          <div className="flex items-center gap-2">
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
              className="p-2 rounded-lg bg-darkBg border border-gray-800 text-white font-bold text-xs"
            >
              <option value="CRITICAL">CRITICAL SEVERITY</option>
              <option value="HIGH">HIGH SEVERITY</option>
              <option value="MEDIUM">MEDIUM SEVERITY</option>
              <option value="LOW">LOW SEVERITY</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="p-2 rounded-lg bg-darkBg border border-gray-800 text-brand-cyan font-bold text-xs"
            >
              <option value="TRIAGE">TRIAGE</option>
              <option value="CONTAINMENT">CONTAINMENT</option>
              <option value="ERADICATION">ERADICATION</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Timeline Entries */}
      <GlassCard className="p-6 border-gray-800 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-cyan" /> Incident Timeline & Action Log ({entries.length})
          </h2>
          <button
            onClick={addEntry}
            className="px-3.5 py-1.5 rounded-xl bg-brand-cyan text-black font-extrabold text-xs flex items-center gap-1 hover:scale-105 transition-all shadow-glowCyan"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Action Log</span>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-gray-900 text-brand-cyan font-mono text-[10px] font-bold">
                    {entry.timestamp}
                  </span>
                  <input
                    type="text"
                    value={entry.author}
                    onChange={(e) => updateEntry(entry.id, 'author', e.target.value)}
                    placeholder="Analyst Name..."
                    className="p-1 rounded bg-darkBg border border-gray-800 text-white font-bold text-xs"
                  />
                </div>

                <button
                  onClick={() => removeEntry(entry.id)}
                  className="p-1.5 rounded bg-red-950 text-red-400 hover:bg-red-900"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Action Performed:</label>
                  <textarea
                    value={entry.actionTaken}
                    onChange={(e) => updateEntry(entry.id, 'actionTaken', e.target.value)}
                    rows={2}
                    placeholder="Document action..."
                    className="p-2 rounded-lg bg-darkBg border border-gray-800 text-white text-[11px]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-amber-400 font-bold uppercase">Evidence / Artifact:</label>
                  <textarea
                    value={entry.evidence}
                    onChange={(e) => updateEntry(entry.id, 'evidence', e.target.value)}
                    rows={2}
                    placeholder="Log hash, IP, header..."
                    className="p-2 rounded-lg bg-darkBg border border-gray-800 text-amber-200 text-[11px]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-brand-cyan font-bold uppercase">Next Step Action:</label>
                  <textarea
                    value={entry.nextStep}
                    onChange={(e) => updateEntry(entry.id, 'nextStep', e.target.value)}
                    rows={2}
                    placeholder="Next triage action..."
                    className="p-2 rounded-lg bg-darkBg border border-gray-800 text-brand-cyan text-[11px]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
