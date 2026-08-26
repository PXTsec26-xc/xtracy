'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataTrustBadge } from '@/components/ui/DataTrustBadge';
import {
  Activity,
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Shield,
  Layers,
  Cookie,
  Code2,
} from 'lucide-react';

export default function HttpInspectorPage() {
  const [url, setUrl] = useState('https://github.com');
  const [method, setMethod] = useState<'GET' | 'HEAD' | 'OPTIONS'>('GET');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInspect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/tools/http-inspector', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, method }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error?.message || 'Failed to inspect HTTP endpoint.');
      } else {
        setResult(data.data);
      }
    } catch {
      setError('Connection failed during HTTP request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Activity className="w-8 h-8 text-brand-cyan" />
              HTTP Response & Method Inspector
            </h1>
            <Badge type="productStatus" value="STANDALONE TOOL" size="sm" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Safe live HTTP query inspector: test GET/HEAD/OPTIONS methods, measure latency, audit cookie security flags, and trace redirects.
          </p>
        </div>

        <DataTrustBadge status="LIVE" sourceName="XTRACY HTTP Inspector" />
      </div>

      {/* Input */}
      <GlassCard className="p-6 border-brand-blue/30 flex flex-col gap-4">
        <form onSubmit={handleInspect} className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 shrink-0">
            {(['GET', 'HEAD', 'OPTIONS'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={`px-3 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                  method === m
                    ? 'bg-brand-cyan text-black shadow-glowCyan'
                    : 'bg-darkBg-panel text-gray-400 hover:bg-gray-800'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to inspect (e.g. https://example.com/api)"
            className="flex-1 px-4 py-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs font-mono placeholder:text-gray-500 focus:outline-none focus:border-brand-cyan transition-colors"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Sending Request...' : 'Send HTTP Request'}</span>
          </button>
        </form>
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
          {/* Top Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
              <div
                className={`p-3 rounded-xl ${
                  result.statusCode >= 200 && result.statusCode < 300
                    ? 'bg-emerald-950 text-emerald-400'
                    : result.statusCode >= 300 && result.statusCode < 400
                    ? 'bg-blue-950 text-blue-400'
                    : 'bg-red-950 text-red-400'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Status Code</span>
                <span className="text-sm font-extrabold text-white font-mono">
                  {result.statusCode} {result.statusText}
                </span>
              </div>
            </GlassCard>

            <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-brand-blue/20 text-brand-cyan">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Response Latency</span>
                <span className="text-sm font-extrabold text-brand-cyan font-mono">{result.latencyMs} ms</span>
              </div>
            </GlassCard>

            <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-950 text-purple-400">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Content Type</span>
                <span className="text-xs font-semibold text-gray-300 truncate block max-w-[180px]">
                  {result.contentType}
                </span>
              </div>
            </GlassCard>
          </div>

          {/* Cookie Security Audit */}
          {result.cookieAudits?.length > 0 && (
            <GlassCard className="p-6 border-gray-800 flex flex-col gap-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Cookie className="w-4 h-4 text-brand-cyan" /> Set-Cookie Security Attribute Audit
              </span>

              <div className="flex flex-col gap-2">
                {result.cookieAudits.map((cookie: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <strong className="text-white font-mono">{cookie.name}</strong>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cookie.hasHttpOnly ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'
                        }`}
                      >
                        HttpOnly: {cookie.hasHttpOnly ? 'YES' : 'NO'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cookie.hasSecure ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'
                        }`}
                      >
                        Secure: {cookie.hasSecure ? 'YES' : 'NO'}
                      </span>
                      {cookie.sameSite && (
                        <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-bold">
                          SameSite={cookie.sameSite}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Response Headers */}
          <GlassCard className="p-6 border-gray-800 flex flex-col gap-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-cyan" /> Response Headers ({Object.keys(result.headers).length})
            </span>

            <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1.5 font-mono text-[11px] max-h-80 overflow-y-auto">
              {Object.entries(result.headers).map(([k, v]) => (
                <div key={k} className="flex items-start gap-2 break-all">
                  <span className="text-brand-cyan font-bold shrink-0">{k}:</span>
                  <span className="text-gray-300">{String(v)}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Response Body Preview if GET */}
          {result.bodyPreview && (
            <GlassCard className="p-6 border-gray-800 flex flex-col gap-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" /> Response Body Snippet (First 1,000 bytes)
              </span>
              <pre className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 text-[11px] font-mono text-gray-300 overflow-x-auto max-h-60">
                {result.bodyPreview}
              </pre>
            </GlassCard>
          )}
        </div>
      )}
    </div>
  );
}
