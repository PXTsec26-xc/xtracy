'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import {
  Binary,
  ShieldCheck,
  ArrowRightLeft,
  Copy,
  Check,
  Code2,
  FileText,
  Layers,
} from 'lucide-react';

export default function EncoderDecoderPage() {
  const [input, setInput] = useState('XTRACY Cybersecurity Intelligence');
  const [mode, setMode] = useState<'BASE64' | 'HEX' | 'URL' | 'BINARY'>('BASE64');
  const [operation, setOperation] = useState<'ENCODE' | 'DECODE'>('ENCODE');
  const [copied, setCopied] = useState(false);

  // Conversion logic
  const convert = (str: string, currentMode: typeof mode, currentOp: typeof operation): { output: string; error?: string } => {
    if (!str) return { output: '' };

    try {
      if (currentMode === 'BASE64') {
        if (currentOp === 'ENCODE') {
          const encoded = Buffer.from(str, 'utf8').toString('base64');
          return { output: encoded };
        } else {
          const decoded = Buffer.from(str, 'base64').toString('utf8');
          return { output: decoded };
        }
      }

      if (currentMode === 'HEX') {
        if (currentOp === 'ENCODE') {
          const hex = Buffer.from(str, 'utf8').toString('hex');
          return { output: hex };
        } else {
          const cleanHex = str.replace(/[^0-9a-fA-F]/g, '');
          const decoded = Buffer.from(cleanHex, 'hex').toString('utf8');
          return { output: decoded };
        }
      }

      if (currentMode === 'URL') {
        if (currentOp === 'ENCODE') {
          return { output: encodeURIComponent(str) };
        } else {
          return { output: decodeURIComponent(str) };
        }
      }

      if (currentMode === 'BINARY') {
        if (currentOp === 'ENCODE') {
          const bin = Array.from(Buffer.from(str, 'utf8'))
            .map((byte) => byte.toString(2).padStart(8, '0'))
            .join(' ');
          return { output: bin };
        } else {
          const cleanBin = str.replace(/[^01]/g, '');
          const bytes: number[] = [];
          for (let i = 0; i < cleanBin.length; i += 8) {
            const chunk = cleanBin.slice(i, i + 8);
            if (chunk.length === 8) {
              bytes.push(parseInt(chunk, 2));
            }
          }
          return { output: Buffer.from(bytes).toString('utf8') };
        }
      }

      return { output: '' };
    } catch (err: any) {
      return { output: '', error: `Decode error: ${err.message || 'Malformed input string.'}` };
    }
  };

  const { output, error } = convert(input, mode, operation);

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    if (output) {
      setInput(output);
      setOperation(operation === 'ENCODE' ? 'DECODE' : 'ENCODE');
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Binary className="w-8 h-8 text-brand-cyan" />
              Base64, Hex & URL Encoder / Decoder
            </h1>
            <Badge type="productStatus" value="STANDALONE TOOL" size="sm" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Real-time bidirectional encoding and decoding for Base64, Hexadecimal, URL component, and 8-bit binary strings.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-brand-blue/20 border border-brand-cyan/40 text-brand-cyan text-xs font-semibold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Client-Side Zero Transmission</span>
        </div>
      </div>

      {/* Mode Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {(['BASE64', 'HEX', 'URL', 'BINARY'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === m
                  ? 'bg-brand-cyan text-black shadow-glowCyan'
                  : 'bg-darkBg-panel text-gray-300 hover:bg-gray-800'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Encode vs Decode toggle */}
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xl bg-darkBg-panel border border-gray-800 flex items-center">
            <button
              onClick={() => setOperation('ENCODE')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                operation === 'ENCODE' ? 'bg-brand-blue text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Encode
            </button>
            <button
              onClick={() => setOperation('DECODE')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                operation === 'DECODE' ? 'bg-brand-blue text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Decode
            </button>
          </div>

          <button
            onClick={handleSwap}
            disabled={!output}
            className="p-2.5 rounded-xl bg-darkBg-panel border border-gray-800 text-gray-300 hover:text-white hover:border-brand-cyan/40 disabled:opacity-40 transition-all flex items-center gap-1.5 text-xs font-semibold"
            title="Swap input and output"
          >
            <ArrowRightLeft className="w-4 h-4 text-brand-cyan" />
            <span className="hidden sm:inline">Swap</span>
          </button>
        </div>
      </div>

      {/* Input / Output Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Card */}
        <GlassCard className="p-6 border-brand-blue/30 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-cyan" />
              {operation === 'ENCODE' ? 'Plaintext Input' : `${mode} Encoded Input`}
            </label>
            <span className="text-[11px] text-gray-400 font-mono">{input.length} chars</span>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            placeholder={
              operation === 'ENCODE'
                ? 'Type plaintext to encode...'
                : `Paste ${mode} string to decode...`
            }
            className="w-full p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs font-mono placeholder:text-gray-500 focus:outline-none focus:border-brand-cyan transition-colors"
          />
        </GlassCard>

        {/* Output Card */}
        <GlassCard className="p-6 border-gray-800 flex flex-col justify-between gap-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                {operation === 'ENCODE' ? `${mode} Result` : 'Decoded Plaintext'}
              </label>

              {output && (
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            {error ? (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs font-mono min-h-[160px]">
                {error}
              </div>
            ) : (
              <textarea
                readOnly
                value={output}
                rows={8}
                placeholder="Conversion output appears here in real time..."
                className="w-full p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 text-brand-cyan text-xs font-mono select-all focus:outline-none"
              />
            )}
          </div>

          <div className="text-[11px] text-gray-400 flex items-center justify-between pt-2 border-t border-gray-800">
            <span>Encoding standard: <strong className="text-gray-300">UTF-8 / RFC 4648</strong></span>
            <span className="font-mono text-gray-300">{output.length} chars</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
