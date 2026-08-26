/**
 * Automated PhishLens Social Engineering Calibrated Scoring Test Suite
 */

import { analyzePhishLensMessage } from '@/lib/server/textAnalyzer';

export function runPhishLensScoringTests() {
  const testResults: { scenarioId: number; name: string; input: string; riskScore: number; verdict: string; minExpected: number; maxExpected: number; expectedVerdict: string; passed: boolean; details: string }[] = [];

  const testCases = [
    {
      scenarioId: 1,
      name: 'Urgent Bank Account + Suspicious URL + Username/Password/OTP Request',
      input: 'URGENT: Your bank account will be blocked in 2 hours due to unauthorized access. Click http://secure-bank-login.xyz to verify your username, password, and 6-digit OTP code immediately.',
      minExpected: 90,
      maxExpected: 100,
      expectedVerdict: 'Critical Risk Signals',
    },
    {
      scenarioId: 2,
      name: 'Fake IT Department Requesting Employee ID',
      input: 'Hello, this is the corporate IT Helpdesk department. Please provide your employee ID for audit verification.',
      minExpected: 35,
      maxExpected: 50,
      expectedVerdict: 'Moderate Risk Signals',
    },
    {
      scenarioId: 3,
      name: 'Normal Project Meeting Reminder',
      input: 'Reminder: Project sync meeting scheduled at 3 PM in Conference Room 4.',
      minExpected: 0,
      maxExpected: 15,
      expectedVerdict: 'Low Risk Signals',
    },
    {
      scenarioId: 4,
      name: 'Message Requesting Username, Password and OTP',
      input: 'Security Alert: Please enter your username, password, and OTP code to unblock your account.',
      minExpected: 85,
      maxExpected: 95,
      expectedVerdict: 'Critical Risk Signals',
    },
    {
      scenarioId: 5,
      name: 'High-Risk Phishing Test (Password + Suspicious/Deceptive URL)',
      input: 'Important notice: Click http://login-verify-account.com to reset your password.',
      minExpected: 80,
      maxExpected: 90,
      expectedVerdict: 'Critical Risk Signals',
    },
  ];

  for (const tc of testCases) {
    const analysis = analyzePhishLensMessage(tc.input);
    const scorePassed = analysis.riskScore >= tc.minExpected && analysis.riskScore <= tc.maxExpected;
    const verdictPassed = analysis.verdict === tc.expectedVerdict;
    const passed = scorePassed && verdictPassed;

    testResults.push({
      scenarioId: tc.scenarioId,
      name: tc.name,
      input: tc.input,
      riskScore: analysis.riskScore,
      verdict: analysis.verdict,
      minExpected: tc.minExpected,
      maxExpected: tc.maxExpected,
      expectedVerdict: tc.expectedVerdict,
      passed,
      details: passed
        ? `PASS (Score: ${analysis.riskScore}/100, Verdict: ${analysis.verdict})`
        : `FAIL (Score: ${analysis.riskScore}/100, Expected: ${tc.minExpected}-${tc.maxExpected}, Verdict: ${analysis.verdict}, Expected Verdict: ${tc.expectedVerdict})`,
    });
  }

  return testResults;
}
