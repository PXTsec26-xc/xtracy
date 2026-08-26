'use client';

import React, { useState, useMemo } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import {
  Lock,
  ShieldCheck,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Cpu,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function PasswordLabToolPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Generator Config
  const [passphraseWordCount, setPassphraseWordCount] = useState(4);
  const [includeNumber, setIncludeNumber] = useState(true);
  const [separator, setSeparator] = useState('-');
  const [generatedPassphrase, setGeneratedPassphrase] = useState('');

  // 100% Browser Local Entropy & Strength Calculation
  const stats = useMemo(() => {
    let pool = 0;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);

    if (hasLower) pool += 26;
    if (hasUpper) pool += 26;
    if (hasNumber) pool += 10;
    if (hasSymbol) pool += 32;

    const len = password.length;
    if (pool === 0 || len === 0) {
      return {
        entropy: 0,
        hasLower: false,
        hasUpper: false,
        hasNumber: false,
        hasSymbol: false,
        poolSize: 0,
        onlineCrackTime: 'Instant',
        offlineCrackTime: 'Instant',
        rating: 'EMPTY',
      };
    }

    const entropy = Math.floor(len * Math.log2(pool));

    // Combinations calculation: pool^len
    // Crack speed:
    // Online rate-limited (100 guesses/sec)
    // Offline high-end cluster (10^11 guesses/sec = 100 billion/sec)
    const combinations = Math.pow(pool, len);

    const formatSeconds = (seconds: number) => {
      if (seconds < 1) return 'Instant (< 1 second)';
      if (seconds < 60) return `${Math.round(seconds)} seconds`;
      if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
      if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
      if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
      if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} years`;
      if (seconds < 315360000000) return `${Math.round(seconds / 3153600000)} centuries`;
      return 'Trillions of years (Computationally unbreakable)';
    };

    const onlineSeconds = combinations / 100;
    const offlineSeconds = combinations / 1e11;

    let rating = 'VERY_WEAK';
    if (entropy >= 80) rating = 'VERY_STRONG';
    else if (entropy >= 60) rating = 'STRONG';
    else if (entropy >= 45) rating = 'MODERATE';
    else if (entropy >= 30) rating = 'WEAK';

    return {
      entropy,
      hasLower,
      hasUpper,
      hasNumber,
      hasSymbol,
      poolSize: pool,
      onlineCrackTime: formatSeconds(onlineSeconds),
      offlineCrackTime: formatSeconds(offlineSeconds),
      rating,
    };
  }, [password]);

  const generateSecurePassphrase = () => {
    const wordList = [
      'crypto', 'cipher', 'quantum', 'beacon', 'galaxy', 'matrix', 'timber',
      'shadow', 'shield', 'vector', 'falcon', 'summit', 'aurora', 'nexus',
      'phoenix', 'orbital', 'canyon', 'glacier', 'zenith', 'pulsar', 'vortex',
      'cobalt', 'ember', 'granite', 'harbor', 'island', 'jupiter', 'kinetic'
    ];
    const selected: string[] = [];
    for (let i = 0; i < passphraseWordCount; i++) {
      const idx = Math.floor(Math.random() * wordList.length);
      selected.push(wordList[idx]);
    }

    let phrase = selected.join(separator);
    if (includeNumber) {
      const num = Math.floor(Math.random() * 900 + 100);
      phrase += `${separator}${num}`;
    }
    setGeneratedPassphrase(phrase);
  };

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
              <Lock className="w-8 h-8 text-emerald-400" />
              Password Strength & Entropy Analyzer
            </h1>
            <Badge type="productStatus" value="100% CLIENT BROWSER" size="sm" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Zero-knowledge mathematical entropy analysis, brute-force crack time estimates, and passphrase generator.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Never sent to server (Zero-Knowledge)</span>
        </div>
      </div>

      {/* Password Input Card */}
      <GlassCard className="p-6 border-emerald-500/30 flex flex-col gap-5">
        <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
          Test Password or Passphrase:
        </label>
        <div className="relative flex items-center">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type a password to test entropy in real-time..."
            className="w-full pl-4 pr-12 py-3.5 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs font-mono placeholder:text-gray-500 focus:outline-none focus:border-emerald-400 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {password.length > 0 && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            {/* Entropy Meter */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">
                  Calculated Entropy:{' '}
                  <strong className="text-emerald-400 font-mono text-sm">{stats.entropy} bits</strong>
                </span>
                <span
                  className={`font-black text-xs px-2 py-0.5 rounded ${
                    stats.rating === 'VERY_STRONG'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : stats.rating === 'STRONG'
                      ? 'bg-brand-blue/30 text-brand-cyan border border-brand-blue'
                      : stats.rating === 'MODERATE'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-red-950 text-red-300 border border-red-800'
                  }`}
                >
                  {stats.rating.replace('_', ' ')}
                </span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    stats.entropy >= 80
                      ? 'bg-emerald-400'
                      : stats.entropy >= 60
                      ? 'bg-brand-cyan'
                      : stats.entropy >= 40
                      ? 'bg-amber-400'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, (stats.entropy / 90) * 100)}%` }}
                />
              </div>
            </div>

            {/* Diversity Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  password.length >= 12
                    ? 'bg-emerald-950/20 border-emerald-800 text-emerald-300'
                    : 'bg-gray-900 border-gray-800 text-gray-500'
                }`}
              >
                {password.length >= 12 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                <span>12+ Characters ({password.length})</span>
              </div>

              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  stats.hasUpper && stats.hasLower
                    ? 'bg-emerald-950/20 border-emerald-800 text-emerald-300'
                    : 'bg-gray-900 border-gray-800 text-gray-500'
                }`}
              >
                {stats.hasUpper && stats.hasLower ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                <span>Mixed Case (a-Z)</span>
              </div>

              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  stats.hasNumber
                    ? 'bg-emerald-950/20 border-emerald-800 text-emerald-300'
                    : 'bg-gray-900 border-gray-800 text-gray-500'
                }`}
              >
                {stats.hasNumber ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                <span>Numbers (0-9)</span>
              </div>

              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  stats.hasSymbol
                    ? 'bg-emerald-950/20 border-emerald-800 text-emerald-300'
                    : 'bg-gray-900 border-gray-800 text-gray-500'
                }`}
              >
                {stats.hasSymbol ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                <span>Special Symbols (!@#$)</span>
              </div>
            </div>

            {/* Estimated Brute Force Crack Times */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-xs block font-bold">Online Rate-Limited Attack (100 guesses/s)</strong>
                  <span className="text-xs text-emerald-400 font-semibold">{stats.onlineCrackTime}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex items-start gap-3">
                <Cpu className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-xs block font-bold">Offline GPU Cluster (100 Billion/s)</strong>
                  <span className="text-xs text-purple-300 font-semibold">{stats.offlineCrackTime}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Passphrase Generator */}
      <GlassCard className="p-6 border-gray-800 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Diceware Passphrase Generator</h3>
          </div>

          {/* Generator Controls */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <select
              value={passphraseWordCount}
              onChange={(e) => setPassphraseWordCount(Number(e.target.value))}
              className="px-2.5 py-1 rounded-lg bg-darkBg-panel border border-gray-800 text-white text-xs"
            >
              <option value={3}>3 Words</option>
              <option value={4}>4 Words (Recommended)</option>
              <option value={5}>5 Words (High Security)</option>
              <option value={6}>6 Words (Maximum)</option>
            </select>

            <select
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-darkBg-panel border border-gray-800 text-white text-xs"
            >
              <option value="-">Hyphen (-)</option>
              <option value=".">Dot (.)</option>
              <option value="_">Underscore (_)</option>
              <option value=" ">Space</option>
            </select>

            <label className="flex items-center gap-1.5 text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeNumber}
                onChange={(e) => setIncludeNumber(e.target.checked)}
                className="rounded border-gray-700 bg-gray-900 text-emerald-400"
              />
              <span>Add Number</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={generateSecurePassphrase}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-105 text-white font-extrabold text-xs shadow-glowEmerald transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate Passphrase</span>
          </button>

          {generatedPassphrase && (
            <div className="flex-1 w-full p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex items-center justify-between gap-2 text-xs">
              <code className="text-emerald-400 font-mono font-bold text-sm break-all">{generatedPassphrase}</code>
              <button
                type="button"
                onClick={() => copyToClipboard(generatedPassphrase, 'phrase')}
                className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white shrink-0"
              >
                {copiedKey === 'phrase' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
