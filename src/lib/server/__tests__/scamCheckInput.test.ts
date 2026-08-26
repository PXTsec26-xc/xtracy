/**
 * Automated Input Validation & Evidence-Based Security Pipeline Test Suite
 */

import { classifyInputGate } from '@/lib/server/inputClassifier';
import { analyzeScamContent } from '@/lib/server/scamCheck';

export function runScamCheckInputTests() {
  const results: { testName: string; input: string; expectedCategory: string; actualCategory: string; passed: boolean; details: string }[] = [];

  const testCases = [
    // INVALID / RESTRICTED TARGETS
    { name: 'Invalid Malformed String', input: 'not-a-valid-url', expectedCategory: 'INVALID_INPUT', expectReject: true },
    { name: 'Forbidden Scheme (javascript:)', input: 'javascript:alert(1)', expectedCategory: 'INVALID_INPUT', expectReject: true },
    { name: 'Forbidden Scheme (data:)', input: 'data:text/html,test', expectedCategory: 'INVALID_INPUT', expectReject: true },
    { name: 'Forbidden Scheme (file:)', input: 'file:///etc/passwd', expectedCategory: 'INVALID_INPUT', expectReject: true },
    { name: 'Restricted Localhost Target', input: 'localhost', expectedCategory: 'RESTRICTED_TARGET', expectReject: true },
    { name: 'Restricted Loopback IPv4', input: '127.0.0.1', expectedCategory: 'RESTRICTED_TARGET', expectReject: true },
    { name: 'Restricted Loopback IPv6', input: '::1', expectedCategory: 'RESTRICTED_TARGET', expectReject: true },
    { name: 'Restricted Private IPv4 Class C', input: '192.168.1.1', expectedCategory: 'RESTRICTED_TARGET', expectReject: true },
    { name: 'Restricted Private IPv4 Class A', input: '10.0.0.1', expectedCategory: 'RESTRICTED_TARGET', expectReject: true },
    { name: 'Restricted Private IPv4 Class B', input: '172.16.0.1', expectedCategory: 'RESTRICTED_TARGET', expectReject: true },

    // VALID PUBLIC TARGETS
    { name: 'Public HTTPS URL', input: 'https://example.com', expectedCategory: 'VALID_URL', expectReject: false },
    { name: 'Public HTTP URL', input: 'http://example.com', expectedCategory: 'VALID_URL', expectReject: false },
    { name: 'Public Domain Name', input: 'example.com', expectedCategory: 'VALID_DOMAIN', expectReject: false },
    { name: 'Public IP Address', input: '8.8.8.8', expectedCategory: 'VALID_IP', expectReject: false },
  ];

  for (const tc of testCases) {
    const gateRes = classifyInputGate(tc.input);
    const analysisRes = analyzeScamContent({ content: tc.input });

    let passed = false;
    if (tc.expectReject) {
      passed =
        gateRes.category === tc.expectedCategory &&
        !analysisRes.valid &&
        analysisRes.riskScore === null &&
        analysisRes.securityReport === null &&
        analysisRes.analysisStatus === 'REJECTED';
    } else {
      passed =
        gateRes.category === tc.expectedCategory &&
        analysisRes.valid &&
        typeof analysisRes.riskScore === 'number' &&
        analysisRes.analysisStatus === 'COMPLETE';
    }

    results.push({
      testName: tc.name,
      input: tc.input,
      expectedCategory: tc.expectedCategory,
      actualCategory: gateRes.category,
      passed,
      details: passed
        ? 'PASS'
        : `FAIL: Category=${gateRes.category}, Valid=${(analysisRes as any).valid}, Score=${(analysisRes as any).riskScore}`,
    });
  }

  // STATE RESET VERIFICATION TEST: Scan valid target then invalid target
  const validScan = analyzeScamContent({ content: 'https://example.com' });
  const invalidScan = analyzeScamContent({ content: 'localhost' });

  const stateResetPassed =
    validScan.valid === true &&
    typeof validScan.riskScore === 'number' &&
    invalidScan.valid === false &&
    invalidScan.riskScore === null &&
    invalidScan.securityReport === null &&
    invalidScan.analysisStatus === 'REJECTED';

  results.push({
    testName: 'State Isolation & Non-Leakage Test',
    input: 'https://example.com -> localhost',
    expectedCategory: 'ISOLATED_STATES',
    actualCategory: invalidScan.analysisStatus,
    passed: stateResetPassed,
    details: stateResetPassed ? 'PASS: Invalid scan produced null score without leaking previous valid scan data' : 'FAIL',
  });

  return results;
}
