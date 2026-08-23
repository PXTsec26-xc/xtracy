'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/store/useAuthStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataStorageBadge } from '@/components/ui/DataStorageBadge';
import { DbIncidentRecord } from '@/lib/server/models';
import { Briefcase, Plus, Clock, CheckCircle2, AlertTriangle, FileText, Download } from 'lucide-react';

export default function CaseVaultPage() {
  const { token } = useAuthStore();
  const [cases, setCases] = useState<DbIncidentRecord[]>([]);
  const [title, setTitle] = useState('');
  const [scenarioId, setScenarioId] = useState('account-takeover');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch('/api/cases', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCases(data.data);
      })
      .catch(() => {});
  }, [token]);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !token) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, scenarioId, notes, status: 'IN_PROGRESS' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCases([data.data, ...cases]);
        setTitle('');
        setNotes('');
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const exportCaseReport = (record: DbIncidentRecord) => {
    const reportText = `XTRACY INCIDENT CASE REPORT\nCase ID: ${record.id}\nTitle: ${record.title}\nStatus: ${record.status}\nCreated At: ${record.createdAt}\n\nEvidence Notes:\n${record.notes || 'No additional notes provided.'}`;
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xtracy-case-${record.id}.txt`;
    a.click();
  };

  return (
    <ProtectedRoute fallbackTitle="Sign In for Incident Case Vault" fallbackDescription="Create user-owned incident investigation cases, track timeline notes, and export case summaries.">
      <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-white flex items-center gap-2">
                <Briefcase className="w-8 h-8 text-brand-blue" />
                Incident Case Vault & Investigation Workspace
              </h1>
              <Badge type="productStatus" value="SECURE CASE WORKSPACE" size="sm" />
            </div>
            <DataStorageBadge status="PERSISTENT" />
          </div>
          <p className="text-xs text-gray-400">
            Log active cyber incidents, build timeline evidence notes, track recovery status, and export official summary reports.
          </p>
        </div>

        {/* Create Case Form */}
        <GlassCard className="p-6 border-brand-blue/30 shadow-2xl flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-cyan">
            Create Incident Investigation Case
          </h3>

          <form onSubmit={handleCreateCase} className="flex flex-col gap-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-300">Case Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Unauthorized Instagram Login Attempt from Unknown IP"
                  className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 text-xs focus:border-brand-cyan"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-300">Incident Scenario Type:</label>
                <select
                  value={scenarioId}
                  onChange={(e) => setScenarioId(e.target.value)}
                  className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs"
                >
                  <option value="account-takeover">Account Takeover / Hacked Login</option>
                  <option value="phishing-fraud">Phishing & Financial Fraud</option>
                  <option value="cyberstalking">Online Stalking / Harassment</option>
                  <option value="ransomware">Malware / Ransomware Infection</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-gray-300">Evidence Notes & Timeline Detail:</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Log dates, suspicious email handles, transaction IDs, or timeline notes..."
                rows={3}
                className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 text-xs focus:border-brand-cyan resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="self-end px-8 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isLoading ? 'Creating...' : 'Create Incident Case'}</span>
            </button>
          </form>
        </GlassCard>

        {/* Active Cases Grid */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white">Active Case Vault Directory</h3>

          <div className="grid grid-cols-1 gap-4">
            {cases.map((c) => (
              <GlassCard key={c.id} className="p-6 border-gray-800 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-red-950 text-red-300 text-[10px] font-bold border border-red-800">
                      STATUS: {c.status}
                    </span>
                    <h4 className="text-base font-bold text-white">{c.title}</h4>
                  </div>

                  <button
                    onClick={() => exportCaseReport(c)}
                    className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-brand-cyan font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Summary</span>
                  </button>
                </div>

                <p className="text-xs text-gray-300 bg-darkBg-panel/60 p-3.5 rounded-xl border border-gray-800 leading-relaxed">
                  {c.notes || 'No specific timeline notes added.'}
                </p>

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-800/80">
                  <span>Case ID: <code className="text-gray-300">{c.id}</code></span>
                  <span>Created: {new Date(c.createdAt).toLocaleString()}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
