'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataTrustBadge } from '@/components/ui/DataTrustBadge';
import {
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  Check,
  Shield,
  ExternalLink,
  Code2,
} from 'lucide-react';

export default function SecurityTxtPage() {
  const [domain, setDomain] = useState('google.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/tools/security-txt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error?.message || 'Failed to inspect security.txt.');
      } else {
        setResult(data.data);
      }
    } catch {
      setError('Connection failed while checking security.txt endpoint.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleDomains = ['google.com', 'github.com', 'facebook.com', 'cloudflare.com'];

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <FileText className="w-8 h-8 text-brand-cyan" />
              Security.txt Checker (RFC 9116)
            </h1>
            <Badge type="productStatus" value="STANDALONE TOOL" size="sm" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Validate vulnerability disclosure policies published at standard `/.well-known/security.txt` and generate RFC 9116 templates.
          </p>
        </div>

        <DataTrustBadge status="LIVE" sourceName="XTRACY RFC 9116 Engine" />
      </div>

      {/* Input */}
      <GlassCard className="p-6 border-brand-blue/30 flex flex-col gap-4">
        <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter domain (e.g. google.com)"
            className="flex-1 px-4 py-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs font-mono placeholder:text-gray-500 focus:outline-none focus:border-brand-cyan transition-colors"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Discovering security.txt...' : 'Check security.txt'}</span>
          </button>
        </form>

        {/* Quick Samples */}
        <div className="flex items-center gap-2 flex-wrap text-[11px] text-gray-400">
          <span className="font-semibold text-gray-500">Quick Samples:</span>
          {sampleDomains.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setDomain(s)}
              className="px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 text-[10px] font-mono transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {result.isFound ? (
            <>
              {/* Top Compliance Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
                  <div
                    className={`p-3 rounded-xl ${
                      result.compliance.complianceScore === 100
                        ? 'bg-emerald-950 text-emerald-400'
                        : 'bg-amber-950 text-amber-400'
                    }`}
                  >
                    {result.compliance.complianceScore === 100 ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">RFC 9116 Status</span>
                    <span className="text-sm font-extrabold text-white">{result.compliance.status}</span>
                  </div>
                </GlassCard>

                <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-brand-blue/20 text-brand-cyan">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Contact Directive</span>
                    <span className="text-xs font-semibold text-emerald-400">
                      {result.fields.contact?.length > 0 ? `${result.fields.contact.length} Contact Methods` : 'MISSING'}
                    </span>
                  </div>
                </GlassCard>

                <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-950 text-purple-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Discovered URL</span>
                    <a
                      href={result.endpointUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-brand-cyan hover:underline truncate block max-w-[180px]"
                    >
                      {result.endpointUrl}
                    </a>
                  </div>
                </GlassCard>
              </div>

              {/* Raw security.txt Content Viewer */}
              <GlassCard className="p-6 border-gray-800 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-brand-cyan" /> Published Security.txt Content
                  </span>
                  <button
                    onClick={() => copyToClipboard(result.rawContent)}
                    className="text-xs text-brand-cyan hover:underline flex items-center gap-1 font-bold"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 text-xs font-mono text-gray-200 overflow-x-auto">
                  {result.rawContent}
                </pre>
              </GlassCard>
            </>
          ) : (
            <GlassCard className="p-6 border-amber-800/40 bg-amber-950/10 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
                <strong className="text-sm font-bold">No security.txt Found on {result.domain}</strong>
              </div>
              <p className="text-xs text-gray-300">
                This domain has not published an RFC 9116 security.txt file. Security researchers looking to report vulnerabilities may struggle to reach security teams safely.
              </p>

              {/* Template Generator */}
              <div className="flex flex-col gap-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Recommended RFC 9116 Template for {result.domain}:
                  </span>
                  <button
                    onClick={() => copyToClipboard(result.rfcTemplate)}
                    className="text-xs text-brand-cyan hover:underline flex items-center gap-1 font-bold"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied Template' : 'Copy Template'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 text-xs font-mono text-brand-cyan overflow-x-auto">
                  {result.rfcTemplate}
                </pre>
              </div>
            </GlassCard>
          )}
        </div>
      )}
    </div>
  );
}
