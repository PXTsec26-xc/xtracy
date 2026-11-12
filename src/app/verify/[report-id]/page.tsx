'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { calculateSHA256 } from '@/lib/evidencePulse';
import { canonicalizeJson } from '@/lib/rfc8785';
import { importPublicKeyJwk, verifyCaseSealSignature } from '@/lib/caseSeal';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ShieldAlert,
  SearchCheck,
} from 'lucide-react';

interface VerificationState {
  status: 'UNVERIFIED' | 'VERIFIED_MATCH' | 'MISMATCH';
  detail: string;
  computedHash?: string;
}

export default function ReportVerifyPage() {
  const params = useParams();
  const reportId = decodeURIComponent((params?.['report-id'] as string) || 'UNKNOWN');

  const [packageJson, setPackageJson] = useState('');
  const [expectedHash, setExpectedHash] = useState('');
  const [verification, setVerification] = useState<VerificationState>({
    status: 'UNVERIFIED',
    detail:
      'XTRACY does not maintain a public lookup registry of user report IDs. Supply the exported EvidencePackage JSON or SHA-256 digest below to verify cryptographic integrity locally.',
  });

  const handleVerifyPayload = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = packageJson.trim();
    if (!trimmed) {
      setVerification({
        status: 'UNVERIFIED',
        detail: 'Paste a JSON payload or evidence text alongside its expected SHA-256 checksum to verify.',
      });
      return;
    }

    try {
      const parsed = JSON.parse(trimmed);

      // 1. Check CaseSeal signature if present (CaseSealPackage format)
      if (parsed?.manifest && parsed?.signatureHex && parsed?.publicKeyJwk) {
        const publicKey = await importPublicKeyJwk(parsed.publicKeyJwk);
        const isValid = await verifyCaseSealSignature(
          parsed.manifest,
          parsed.signatureHex,
          publicKey
        );
        const computed = await calculateSHA256(canonicalizeJson(parsed.manifest));
        if (isValid) {
          setVerification({
            status: 'VERIFIED_MATCH',
            detail: 'ECDSA P-256 / CaseSeal signature verified against the canonicalized RFC-8785 manifest.',
            computedHash: computed,
          });
        } else {
          setVerification({
            status: 'MISMATCH',
            detail: 'CaseSeal ECDSA P-256 verification failed: signature or manifest mismatch.',
            computedHash: computed,
          });
        }
        return;
      }

      // 2. Compare canonical JSON SHA-256 against embedded or supplied expected digest
      const canonical = canonicalizeJson(parsed);
      const computed = await calculateSHA256(canonical);
      const targetDigest = (expectedHash.trim() || parsed?.sha256Hash || parsed?.originalFileHash || '').toLowerCase();

      if (!targetDigest || targetDigest.length < 16) {
        setVerification({
          status: 'UNVERIFIED',
          detail: 'Computed canonical SHA-256 digest below, but no expected SHA-256 digest was supplied to compare against.',
          computedHash: computed,
        });
        return;
      }

      if (computed.toLowerCase() === targetDigest) {
        setVerification({
          status: 'VERIFIED_MATCH',
          detail: 'Computed SHA-256 checksum exactly matches the supplied expected digest.',
          computedHash: computed,
        });
      } else {
        setVerification({
          status: 'MISMATCH',
          detail: `Digest mismatch: computed ${computed} does not equal expected ${targetDigest}.`,
          computedHash: computed,
        });
      }
    } catch {
      // Plain text SHA-256 comparison fallback
      const computed = await calculateSHA256(trimmed);
      const targetDigest = expectedHash.trim().toLowerCase();
      if (!targetDigest) {
        setVerification({
          status: 'UNVERIFIED',
          detail: 'Computed raw input SHA-256 digest. Supply the expected SHA-256 digest to confirm an exact match.',
          computedHash: computed,
        });
      } else if (computed.toLowerCase() === targetDigest) {
        setVerification({
          status: 'VERIFIED_MATCH',
          detail: 'Computed SHA-256 digest of supplied text matches the expected checksum.',
          computedHash: computed,
        });
      } else {
        setVerification({
          status: 'MISMATCH',
          detail: 'Computed SHA-256 digest does not match the expected checksum.',
          computedHash: computed,
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-brand-cyan" />
              Cryptographic Integrity Verifier
            </h1>
            <Badge type="productStatus" value="CLIENT-SIDE VERIFIER" size="sm" />
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Verify exported XTRACY EvidencePackage JSON payloads, CaseSeal ECDSA signatures, or SHA-256 checksums without uploading report contents to servers.
        </p>
      </div>

      {/* Verification Output Card */}
      <GlassCard className="p-8 border-brand-cyan/40 shadow-2xl flex flex-col gap-6 text-xs">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 flex-wrap gap-2 font-mono">
          <div>
            <span className="text-gray-400 text-[10px] uppercase">Report Reference ID:</span>
            <h2 className="text-lg font-bold text-white">{reportId}</h2>
          </div>

          <div className="flex items-center gap-2">
            {verification.status === 'VERIFIED_MATCH' && (
              <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 font-extrabold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> CRYPTOGRAPHIC MATCH
              </span>
            )}
            {verification.status === 'MISMATCH' && (
              <span className="px-3 py-1 rounded-full bg-red-950 border border-red-700 text-red-300 font-extrabold text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> INTEGRITY MISMATCH
              </span>
            )}
            {verification.status === 'UNVERIFIED' && (
              <span className="px-3 py-1 rounded-full bg-amber-950 border border-amber-700 text-amber-300 font-extrabold text-xs flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> UNVERIFIED — PROOF REQUIRED
              </span>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1.5">
          <span className="text-gray-400 text-[10px] uppercase font-bold">Verification Result</span>
          <p className="text-gray-200 leading-relaxed">{verification.detail}</p>
          {verification.computedHash && (
            <div className="mt-2 font-mono text-[11px] text-brand-cyan break-all">
              Computed SHA-256: {verification.computedHash}
            </div>
          )}
        </div>

        {/* Interactive Local Verifier Form */}
        <form onSubmit={handleVerifyPayload} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="verify-expected-hash" className="font-bold text-gray-300">
              Expected SHA-256 Checksum (optional if verifying signed EvidencePackage JSON):
            </label>
            <input
              id="verify-expected-hash"
              type="text"
              value={expectedHash}
              onChange={(e) => setExpectedHash(e.target.value)}
              placeholder="64-character hex SHA-256 digest..."
              className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white font-mono text-xs focus:border-brand-cyan"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="verify-payload-json" className="font-bold text-gray-300">
              Exported EvidencePackage JSON or Raw Content:
            </label>
            <textarea
              id="verify-payload-json"
              rows={6}
              value={packageJson}
              onChange={(e) => setPackageJson(e.target.value)}
              placeholder='Paste exported EvidencePackage JSON (with { "payload", "seal" }) or text to hash locally...'
              className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white font-mono text-xs focus:border-brand-cyan"
            />
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/evidence"
                className="px-5 py-2.5 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-700 text-brand-cyan font-bold text-xs inline-flex items-center gap-2 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Evidence Center</span>
              </Link>
              <Link
                href="/verifier"
                className="px-5 py-2.5 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-700 text-gray-200 font-bold text-xs inline-flex items-center gap-2 transition-all"
              >
                <span>Open Full CaseSeal Verifier</span>
              </Link>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white font-extrabold text-xs flex items-center gap-2 hover:brightness-110 transition-all"
            >
              <SearchCheck className="w-4 h-4" />
              <span>Run Local SHA-256 / Signature Check</span>
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
