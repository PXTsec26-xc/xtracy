'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import {
  Hash,
  ShieldCheck,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  KeyRound,
  FileCode,
  Sparkles,
} from 'lucide-react';

export default function HashUtilityPage() {
  const [inputText, setInputText] = useState('XTRACY Defensive Cybersecurity Platform 2026');
  const [hmacSecret, setHmacSecret] = useState('');
  const [compareHash, setCompareHash] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const calculateHashes = React.useCallback(async () => {
    if (!inputText) return;
    setLoading(true);
    try {
      const res = await fetch('/api/tools/hash-utility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          secret: hmacSecret,
          compareHash,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data.data);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [inputText, hmacSecret, compareHash]);

  useEffect(() => {
    calculateHashes();
  }, [calculateHashes]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const hashList = result?.hashes
    ? [
        { name: 'SHA-256 (Recommended Standard)', value: result.hashes.sha256, bits: 256 },
        { name: 'SHA-512 (High Security)', value: result.hashes.sha512, bits: 512 },
        { name: 'SHA-384', value: result.hashes.sha384, bits: 384 },
        { name: 'SHA-1 (Legacy / Deprecated)', value: result.hashes.sha1, bits: 160 },
        { name: 'MD5 (Legacy / Insecure for Passwords)', value: result.hashes.md5, bits: 128 },
      ]
    : [];

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Hash className="w-8 h-8 text-brand-cyan" />
              Cryptographic Hash Generator & Verifier
            </h1>
            <Badge type="productStatus" value="STANDALONE TOOL" size="sm" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Real-time cryptographic hashing (SHA-256, SHA-512, SHA-384, SHA-1, MD5, HMAC-SHA256) and checksum integrity validator.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-brand-blue/20 border border-brand-cyan/40 text-brand-cyan text-xs font-semibold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>NIST Standard Cryptography</span>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="md:col-span-2 p-6 border-brand-blue/30 flex flex-col gap-4">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
            Input Plaintext String:
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
            placeholder="Type or paste any text string to generate cryptographic hashes..."
            className="w-full p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs font-mono placeholder:text-gray-500 focus:outline-none focus:border-brand-cyan transition-colors"
          />

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={hmacSecret}
                onChange={(e) => setHmacSecret(e.target.value)}
                placeholder="Optional HMAC secret key..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs font-mono focus:border-brand-cyan"
              />
            </div>
            <span className="text-[11px] text-gray-400 shrink-0">
              Length: <strong className="text-white font-mono">{inputText.length}</strong> chars
            </span>
          </div>
        </GlassCard>

        {/* Hash Match / Checksum Validator */}
        <GlassCard className="p-6 border-gray-800 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Checksum Matcher
            </span>
            <p className="text-[11px] text-gray-400">
              Paste an expected hash from a vendor or download page to verify checksum match.
            </p>
            <input
              type="text"
              value={compareHash}
              onChange={(e) => setCompareHash(e.target.value)}
              placeholder="Paste checksum to compare..."
              className="w-full p-2.5 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs font-mono focus:border-brand-cyan"
            />
          </div>

          {compareHash && result?.verification && (
            <div
              className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
                result.verification.isMatch
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                  : 'bg-red-950/40 border-red-800 text-red-300'
              }`}
            >
              {result.verification.isMatch ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <div>
                <strong className="block font-bold">
                  {result.verification.isMatch ? `MATCH VERIFIED (${result.verification.matchedAlgorithm})` : 'NO MATCH FOUND'}
                </strong>
                <span className="text-[10px]">
                  {result.verification.isMatch
                    ? 'Input string exactly produces the provided checksum.'
                    : 'The provided checksum does not match any computed hash.'}
                </span>
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Hashes Output List */}
      <GlassCard className="p-6 border-gray-800 flex flex-col gap-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <FileCode className="w-4 h-4 text-brand-cyan" /> Cryptographic Digests
        </h2>

        <div className="flex flex-col gap-3">
          {hashList.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex flex-col gap-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <strong className="text-white text-xs font-bold">{item.name}</strong>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/40 text-gray-400 font-mono">
                    {item.bits} bits
                  </span>
                </div>
                <code className="text-brand-cyan font-mono text-xs break-all select-all">
                  {item.value}
                </code>
              </div>

              <button
                onClick={() => copyToClipboard(item.value, `hash-${idx}`)}
                className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white shrink-0 self-end sm:self-center"
              >
                {copiedKey === `hash-${idx}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ))}

          {/* HMAC Result if secret provided */}
          {result?.hashes?.hmacSha256 && (
            <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex flex-col gap-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <strong className="text-purple-300 text-xs font-bold">HMAC-SHA256 (Keyed Hash)</strong>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-900/60 text-purple-200 font-mono">
                    256 bits
                  </span>
                </div>
                <code className="text-purple-200 font-mono text-xs break-all select-all">
                  {result.hashes.hmacSha256}
                </code>
              </div>

              <button
                onClick={() => copyToClipboard(result.hashes.hmacSha256, 'hmac')}
                className="p-2 rounded-lg bg-purple-900/40 hover:bg-purple-900 text-purple-300 hover:text-white shrink-0 self-end sm:self-center"
              >
                {copiedKey === 'hmac' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
