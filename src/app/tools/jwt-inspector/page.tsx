'use client';

import React, { useState, useMemo } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import {
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  FileCode,
} from 'lucide-react';

export default function JwtInspectorPage() {
  const sampleJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEyMzQ1NiIsIm5hbWUiOiJBbGV4IE1vcmdhbiIsInJvbGUiOiJTZWN1cml0eSBBbmFseXN0IiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.4zC92p8H3W4L9U6yq7X8V0m2k1J5b9Z3w8Q6x4Y1v7s';

  const [jwtString, setJwtString] = useState(sampleJwt);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const parsedJwt = useMemo(() => {
    if (!jwtString.trim()) return null;

    const parts = jwtString.trim().split('.');
    if (parts.length !== 3) {
      return { error: 'Invalid JWT structure. A standard JWT must contain exactly 3 segments separated by dots (Header.Payload.Signature).' };
    }

    try {
      const decodeBase64Url = (str: string) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        return decodeURIComponent(
          Array.from(atob(base64))
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      };

      const headerJson = JSON.parse(decodeBase64Url(parts[0]));
      const payloadJson = JSON.parse(decodeBase64Url(parts[1]));
      const signatureRaw = parts[2];

      const nowSec = Math.floor(Date.now() / 1000);
      let isExpired = false;
      let expDateStr = null;
      let iatDateStr = null;
      let timeRemaining = null;

      if (payloadJson.exp) {
        isExpired = nowSec > payloadJson.exp;
        expDateStr = new Date(payloadJson.exp * 1000).toLocaleString();
        const diffSec = payloadJson.exp - nowSec;
        timeRemaining = isExpired
          ? `Expired ${Math.abs(Math.round(diffSec / 86400))} days ago`
          : `Valid for ${Math.round(diffSec / 86400)} more days`;
      }

      if (payloadJson.iat) {
        iatDateStr = new Date(payloadJson.iat * 1000).toLocaleString();
      }

      const securityWarnings: string[] = [];
      if (headerJson.alg === 'none' || headerJson.alg === 'NONE') {
        securityWarnings.push('CRITICAL: Token algorithm is set to "none". Signature verification is completely disabled.');
      }

      if (headerJson.alg === 'HS256' && !payloadJson.exp) {
        securityWarnings.push('WARNING: No expiration (exp) claim present. Token will remain indefinitely valid.');
      }

      return {
        header: headerJson,
        payload: payloadJson,
        signature: signatureRaw,
        isExpired,
        expDateStr,
        iatDateStr,
        timeRemaining,
        securityWarnings,
      };
    } catch (err: any) {
      return { error: `Failed to decode Base64URL segment: ${err.message}` };
    }
  }, [jwtString]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <KeyRound className="w-8 h-8 text-brand-cyan" />
              JWT (JSON Web Token) Inspector
            </h1>
            <Badge type="productStatus" value="STANDALONE TOOL" size="sm" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Zero-transmission JWT debugger: inspect claims, decode header & payload, validate timestamps, and detect algorithm security flaws.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Processed 100% Client-Side</span>
        </div>
      </div>

      {/* Input */}
      <GlassCard className="p-6 border-brand-blue/30 flex flex-col gap-3">
        <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
          Paste Encoded JSON Web Token:
        </label>
        <textarea
          value={jwtString}
          onChange={(e) => setJwtString(e.target.value)}
          rows={4}
          placeholder="Paste JWT string (eyJhbGciOi...)"
          className="w-full p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs font-mono placeholder:text-gray-500 focus:outline-none focus:border-brand-cyan transition-colors select-all"
        />
      </GlassCard>

      {/* Error */}
      {parsedJwt?.error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{parsedJwt.error}</span>
        </div>
      )}

      {/* Decoded Results */}
      {parsedJwt && !parsedJwt.error && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Security Warnings */}
          {parsedJwt.securityWarnings && parsedJwt.securityWarnings.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800 text-amber-200 text-xs flex flex-col gap-1.5">
              <strong className="font-bold flex items-center gap-1.5 text-amber-400">
                <AlertTriangle className="w-4 h-4" /> Security Observations
              </strong>
              {parsedJwt.securityWarnings.map((warn, i) => (
                <span key={i} className="text-[11px]">{warn}</span>
              ))}
            </div>
          )}

          {/* Key Status Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-brand-blue/20 text-brand-cyan">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Algorithm</span>
                <span className="text-sm font-extrabold text-white font-mono">{parsedJwt.header?.alg || 'None'}</span>
              </div>
            </GlassCard>

            <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
              <div className={`p-3 rounded-xl ${parsedJwt.isExpired ? 'bg-red-950 text-red-400' : 'bg-emerald-950 text-emerald-400'}`}>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Token Status</span>
                <span className={`text-sm font-extrabold ${parsedJwt.isExpired ? 'text-red-400' : 'text-emerald-400'}`}>
                  {parsedJwt.isExpired ? 'EXPIRED' : 'ACTIVE / VALID'}
                </span>
              </div>
            </GlassCard>

            <GlassCard className="p-5 border-gray-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-950 text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Expiration Window</span>
                <span className="text-xs font-semibold text-gray-300">
                  {parsedJwt.timeRemaining || 'No expiration claim'}
                </span>
              </div>
            </GlassCard>
          </div>

          {/* Header & Payload Inspector Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Header (JOSE) */}
            <GlassCard className="p-6 border-brand-cyan/20 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
                <span className="text-xs font-bold text-brand-cyan uppercase tracking-wider">
                  Decoded Header (Algorithm & Token Type)
                </span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(parsedJwt.header, null, 2), 'header')}
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                >
                  {copiedKey === 'header' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'header' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 text-xs font-mono text-gray-200 overflow-x-auto">
                {JSON.stringify(parsedJwt.header, null, 2)}
              </pre>
            </GlassCard>

            {/* Payload (Claims) */}
            <GlassCard className="p-6 border-purple-500/20 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Decoded Payload (Claims & Data)
                </span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(parsedJwt.payload, null, 2), 'payload')}
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                >
                  {copiedKey === 'payload' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'payload' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 text-xs font-mono text-purple-200 overflow-x-auto">
                {JSON.stringify(parsedJwt.payload, null, 2)}
              </pre>
            </GlassCard>
          </div>

          {/* Signature Segment */}
          <GlassCard className="p-5 border-gray-800 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Cryptographic Signature Hash (Raw Segment)
            </span>
            <code className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-gray-400 text-xs font-mono break-all select-all">
              {parsedJwt.signature}
            </code>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
