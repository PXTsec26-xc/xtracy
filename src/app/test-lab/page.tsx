'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { FeatureStatusBadge } from '@/components/ui/FeatureStatusBadge';
import { deriveKey, encryptText, decryptText } from '@/lib/crypto';
import { canonicalizeJson } from '@/lib/rfc8785';
import { calculateSHA256, constructEvidenceManifest, calculateManifestHash } from '@/lib/evidencePulse';
import { generateSigningKeyPair, signCaseSeal, verifyCaseSealSignature, calculateMerkleRoot, CaseSealManifest } from '@/lib/caseSeal';
import { calculateIntegrityIndex, evaluateCaseReadiness } from '@/lib/integrityIndex';
import { Terminal, CheckCircle2, XCircle, Play, RefreshCw, ShieldCheck } from 'lucide-react';

interface TestCaseResult {
  id: string;
  name: string;
  category: 'CRYPTOGRAPHY' | 'EVIDENCE' | 'CANONICALIZATION' | 'CONTINUITY' | 'CASESEAL' | 'SIGNATURE';
  status: 'PASS' | 'FAIL' | 'PENDING';
  expected: string;
  actual: string;
  executionTimeMs: number;
}

export default function SecurityTestLabPage() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<TestCaseResult[]>([]);

  const handleRunAllTests = async () => {
    setRunning(true);
    const testLogs: TestCaseResult[] = [];

    // 1. SHA-256 Same File Consistency Test
    const startTime1 = performance.now();
    const hash1 = await calculateSHA256('XTRACY_SYNTHETIC_TEST_DATA_2026');
    const hash2 = await calculateSHA256('XTRACY_SYNTHETIC_TEST_DATA_2026');
    testLogs.push({
      id: 'TEST-01',
      name: 'SHA-256 Same File Hash Consistency',
      category: 'EVIDENCE',
      status: hash1 === hash2 ? 'PASS' : 'FAIL',
      expected: hash1,
      actual: hash2,
      executionTimeMs: Math.round(performance.now() - startTime1),
    });

    // 2. SHA-256 One-Byte Modification Test
    const startTime2 = performance.now();
    const hashMod = await calculateSHA256('XTRACY_SYNTHETIC_TEST_DATA_2027');
    testLogs.push({
      id: 'TEST-02',
      name: 'SHA-256 One-Byte Modification Mismatch Detection',
      category: 'EVIDENCE',
      status: hash1 !== hashMod ? 'PASS' : 'FAIL',
      expected: 'MISMATCH_DETECTED',
      actual: hash1 !== hashMod ? 'MISMATCH_DETECTED' : 'HASH_MATCHED',
      executionTimeMs: Math.round(performance.now() - startTime2),
    });

    // 3. RFC 8785 JCS Key Sorting Test
    const startTime3 = performance.now();
    const objUnsorted = { z: 1, a: 2, m: { b: 3, a: 4 } };
    const canonicalStr = canonicalizeJson(objUnsorted);
    const expectedCanonical = '{"a":2,"m":{"a":4,"b":3},"z":1}';
    testLogs.push({
      id: 'TEST-03',
      name: 'RFC 8785 JCS Lexicographical Key Sorting',
      category: 'CANONICALIZATION',
      status: canonicalStr === expectedCanonical ? 'PASS' : 'FAIL',
      expected: expectedCanonical,
      actual: canonicalStr,
      executionTimeMs: Math.round(performance.now() - startTime3),
    });

    // 4. WebCrypto AES-GCM Encrypt & Decrypt Test
    const startTime4 = performance.now();
    let aesPass = false;
    try {
      const salt = new TextEncoder().encode('test-salt-123456');
      const key = await deriveKey('SecretPassword123!', salt);
      const payload = await encryptText('Confidential Incident Note', key);
      const dec = await decryptText(payload, key);
      aesPass = dec === 'Confidential Incident Note';
    } catch (err) {}
    testLogs.push({
      id: 'TEST-04',
      name: 'WebCrypto AES-GCM 256-bit Encrypt & Decrypt',
      category: 'CRYPTOGRAPHY',
      status: aesPass ? 'PASS' : 'FAIL',
      expected: 'Confidential Incident Note',
      actual: aesPass ? 'Confidential Incident Note' : 'DECRYPTION_FAILED',
      executionTimeMs: Math.round(performance.now() - startTime4),
    });

    // 5. CaseSeal Merkle Tree Root Calculation Test
    const startTime5 = performance.now();
    const merkleRoot = await calculateMerkleRoot(['hash1', 'hash2', 'hash3']);
    testLogs.push({
      id: 'TEST-05',
      name: 'CaseSeal Merkle Tree Root Aggregation',
      category: 'CASESEAL',
      status: merkleRoot.length === 64 ? 'PASS' : 'FAIL',
      expected: '64-character SHA-256 Merkle Root',
      actual: merkleRoot,
      executionTimeMs: Math.round(performance.now() - startTime5),
    });

    // 6. ECDSA P-256 Keypair & Digital Signature Test
    const startTime6 = performance.now();
    let sigPass = false;
    try {
      const keyPair = await generateSigningKeyPair();
      const mockManifest: CaseSealManifest = {
        schemaVersion: '2.1.0',
        canonicalization: 'RFC-8785-JCS',
        signatureAlgorithm: 'ECDSA-P256-SHA256',
        snapshotVersion: 1,
        caseId: 'XTR-CASE-TEST',
        evidenceCount: 5,
        verifiedCount: 5,
        chainStatus: 'INTACT',
        merkleRoot: merkleRoot,
        manifestHash: 'abc123hash',
        sealedAt: new Date().toISOString(),
      };
      const sigHex = await signCaseSeal(mockManifest, keyPair.privateKey);
      sigPass = await verifyCaseSealSignature(mockManifest, sigHex, keyPair.publicKey);
    } catch (err) {}
    testLogs.push({
      id: 'TEST-06',
      name: 'Local ECDSA P-256 Digital Signature Generation & Verification',
      category: 'SIGNATURE',
      status: sigPass ? 'PASS' : 'FAIL',
      expected: 'SIGNATURE_VALID',
      actual: sigPass ? 'SIGNATURE_VALID' : 'SIGNATURE_INVALID',
      executionTimeMs: Math.round(performance.now() - startTime6),
    });

    // 7. Deterministic Integrity Index Score Test
    const startTime7 = performance.now();
    const indexResult = calculateIntegrityIndex([]);
    testLogs.push({
      id: 'TEST-07',
      name: 'Deterministic Integrity Index Score Calculation (0-100)',
      category: 'CONTINUITY',
      status: indexResult.totalScore === 100 ? 'PASS' : 'FAIL',
      expected: '100',
      actual: indexResult.totalScore.toString(),
      executionTimeMs: Math.round(performance.now() - startTime7),
    });

    setResults(testLogs);
    setRunning(false);
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Terminal className="w-8 h-8 text-emerald-400" />
              XTRACY Security Test Lab
            </h1>
            <Badge type="productStatus" value="CRYPTOGRAPHIC SUITE" size="sm" />
          </div>
          <FeatureStatusBadge status="LOCAL" label="● 100% EXECUTABLE" />
        </div>
        <p className="text-xs text-gray-400">
          Controlled in-browser test environment for verifying XTRACY WebCrypto AES-GCM encryption, RFC 8785 canonicalization, Merkle roots, and ECDSA P-256 digital signatures.
        </p>
      </div>

      {/* Test Controls */}
      <GlassCard className="p-6 border-emerald-500/40 flex items-center justify-between">
        <div className="flex flex-col gap-1 text-xs">
          <strong className="text-white text-sm">Run Automated Cryptographic Test Suite</strong>
          <span className="text-gray-400">Executes real WebCrypto operations on synthetic in-memory test data.</span>
        </div>

        <button
          type="button"
          onClick={handleRunAllTests}
          disabled={running}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          <span>{running ? 'Running Test Suite...' : 'Execute Test Suite'}</span>
        </button>
      </GlassCard>

      {/* Test Output Logs */}
      {results.length > 0 && (
        <div className="flex flex-col gap-4 font-mono text-xs">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
            Test Execution Log ({results.filter((r) => r.status === 'PASS').length}/{results.length} PASSED)
          </h3>

          <div className="flex flex-col gap-3">
            {results.map((test) => (
              <GlassCard
                key={test.id}
                className={`p-4 border flex flex-col gap-2 ${
                  test.status === 'PASS' ? 'border-emerald-800 bg-emerald-950/20' : 'border-red-800 bg-red-950/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{test.id}:</span>
                    <strong className="text-white font-sans">{test.name}</strong>
                    <span className="px-2 py-0.5 rounded bg-gray-900 text-gray-400 text-[10px]">
                      {test.category}
                    </span>
                  </div>

                  <span
                    className={`px-3 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 ${
                      test.status === 'PASS'
                        ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700'
                        : 'bg-red-900/80 text-red-300 border border-red-700'
                    }`}
                  >
                    {test.status === 'PASS' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-red-400" />}
                    {test.status} ({test.executionTimeMs}ms)
                  </span>
                </div>

                <div className="text-[10px] text-gray-400 border-t border-gray-800/80 pt-2 flex flex-col gap-0.5">
                  <div>Expected: <span className="text-gray-300">{test.expected}</span></div>
                  <div>Actual:   <span className="text-brand-cyan">{test.actual}</span></div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
