/**
 * Automated Input Validation & Scam Check Pipeline Test Suite
 */

import { classifyTargetInput } from '@/lib/server/inputClassifier';
import { analyzeScamContent } from '@/lib/server/scamCheck';

export function runScamCheckInputTests() {
  const results: { testName: string; input: string; expectedClassification: string; actualClassification: string; passed: boolean; details: string }[] = [];

  const testCases = [
    {
      name: 'Valid HTTPS URL',
      input: 'https://example.com',
      expectedClass: 'VALID_URL',
      checkScore: (res: any) => res.valid && res.classification === 'VALID_URL' && res.factors.some((f: any) => f.name === 'HTTPS Encrypted Transport'),
    },
    {
      name: 'Valid Domain',
      input: 'example.com',
      expectedClass: 'DOMAIN',
      checkScore: (res: any) => res.valid && res.classification === 'DOMAIN' && res.factors.some((f: any) => f.name === 'Unverified Domain Transport'),
    },
    {
      name: 'Invalid Malformed String',
      input: 'not-a-valid-url',
      expectedClass: 'INVALID_INPUT',
      checkScore: (res: any) => !res.valid && res.classification === 'INVALID_INPUT' && res.error === 'INVALID_INPUT',
    },
    {
      name: 'Normal Text Sentence',
      input: 'a normal sentence',
      expectedClass: 'MESSAGE_TEXT',
      checkScore: (res: any) => res.valid && res.classification === 'MESSAGE_TEXT' && res.riskScore <= 20,
    },
    {
      name: 'Suspicious Scam Message',
      input: 'Urgent! Your account is suspended. Verify now: http://phish.com',
      expectedClass: 'MESSAGE_TEXT',
      checkScore: (res: any) => res.valid && res.classification === 'MESSAGE_TEXT' && res.riskScore >= 35,
    },
    {
      name: 'Empty String Input',
      input: '',
      expectedClass: 'INVALID_INPUT',
      checkScore: (res: any) => !res.valid && res.classification === 'INVALID_INPUT',
    },
    {
      name: 'Malformed Scheme String',
      input: 'https://',
      expectedClass: 'INVALID_INPUT',
      checkScore: (res: any) => !res.valid && res.classification === 'INVALID_INPUT',
    },
    {
      name: 'Forbidden Scheme (javascript:)',
      input: 'javascript:alert(1)',
      expectedClass: 'INVALID_INPUT',
      checkScore: (res: any) => !res.valid && res.classification === 'INVALID_INPUT',
    },
    {
      name: 'Restricted Localhost Target',
      input: 'localhost',
      expectedClass: 'INVALID_INPUT',
      checkScore: (res: any) => !res.valid && res.classification === 'INVALID_INPUT',
    },
    {
      name: 'Restricted Private Loopback IP',
      input: '127.0.0.1',
      expectedClass: 'INVALID_INPUT',
      checkScore: (res: any) => !res.valid && res.classification === 'INVALID_INPUT',
    },
  ];

  for (const tc of testCases) {
    const classRes = classifyTargetInput(tc.input);
    const analysisRes = analyzeScamContent({ content: tc.input });
    const passed = classRes.classification === tc.expectedClass && tc.checkScore(analysisRes);

    results.push({
      testName: tc.name,
      input: tc.input,
      expectedClassification: tc.expectedClass,
      actualClassification: classRes.classification,
      passed,
      details: passed
        ? 'PASS'
        : `FAIL: Class=${classRes.classification}, Valid=${(analysisRes as any).valid}`,
    });
  }

  return results;
}
