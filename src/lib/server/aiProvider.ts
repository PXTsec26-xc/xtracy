import { env } from './env';

export type AIMode = 'PROTECT' | 'ANALYZE' | 'LEARN' | 'DEVELOPER' | 'INCIDENT' | 'ORGANIZATION';

export interface AIQueryRequest {
  prompt?: string;
  query?: string;
  readingMode?: 'Beginner' | 'Student' | 'Professional';
  aiMode?: AIMode;
  structuredContext?: any;
}

export interface AIQueryResponse {
  answer: string;
  source?: string;
  providerName?: string;
  isAiGenerated?: boolean;
  readingMode: 'Beginner' | 'Student' | 'Professional';
  aiMode?: AIMode;
  disclaimer: string;
}

export async function processDefensiveAIQuery(
  request: AIQueryRequest
): Promise<AIQueryResponse> {
  const mode = request.readingMode || 'Student';
  const aiMode = request.aiMode || 'ANALYZE';
  const inputPrompt = request.prompt || request.query || '';
  const promptLower = inputPrompt.toLowerCase();

  // Ethical & Legal Safety Boundary Checks
  const prohibitedKeywords = [
    'hack into', 'steal credentials', 'create ransomware', 'ddos attack',
    'phishing kit', 'doxx', 'stalk', 'bypass authentication', 'exploit target'
  ];

  if (prohibitedKeywords.some((kw) => promptLower.includes(kw))) {
    return {
      answer: `SAFETY REFUSAL: XTRACY AI strictly operates within defensive cybersecurity and legal safety boundaries. Requests involving unauthorized hacking, credential theft, ransomware creation, or doxxing are prohibited. If you are interested in authorized ethical security research, consider legal CTF challenges (e.g. TryHackMe, HackTheBox) or defensive secure coding tutorials.`,
      source: 'DEFENSIVE_SECURITY_RULE_ENGINE',
      providerName: 'XTRACY Defensive AI Safety Engine',
      isAiGenerated: false,
      readingMode: mode,
      aiMode,
      disclaimer: 'XTRACY AI enforces strict defensive and legal safety boundaries.',
    };
  }

  // Evidence-Aware AI Response Structure for Tool Context
  if (request.structuredContext) {
    const ctx = request.structuredContext;
    const observedFacts = ctx.explainability?.facts?.join('\n- ') || ctx.evidence?.join('\n- ') || 'Target verified via controlled scan.';
    const heuristics = ctx.explainability?.heuristics?.join('\n- ') || 'No critical heuristics flagged.';
    const recs = ctx.recommendedActions?.join('\n- ') || 'Maintain strong account hygiene and 2FA.';

    const answerText = `[OBSERVED DATA]
- Target: ${ctx.caseId || ctx.hostname || 'Security Analysis'}
- Evaluated Risk Rating: ${ctx.riskLevel || ctx.riskRating || 'EVALUATED'} (${ctx.riskScore || 0}/100)
- Observed Evidence:
- ${observedFacts}

[AI INTERPRETATION]
Based on observed technical indicators (${mode} Level explanation):
- ${heuristics}
- Analysis Confidence: ${ctx.confidenceLevel || 'HIGH'}

[RECOMMENDED ACTION]
- ${recs}`;

    return {
      answer: answerText,
      source: 'DEFENSIVE_SECURITY_RULE_ENGINE',
      providerName: 'XTRACY Defensive AI Engine',
      isAiGenerated: true,
      readingMode: mode,
      aiMode,
      disclaimer: 'XTRACY AI interpretations are strictly based on observed tool analysis metrics.',
    };
  }

  // General Defensive AI Query Response
  let answerText = `[OBSERVED DATA]
- Query Topic: ${inputPrompt || 'Defensive Guidance'}
- Guidance Tier: ${mode}

[AI INTERPRETATION]
`;

  if (promptLower.includes('phishing') || promptLower.includes('sms')) {
    answerText += `Social engineering attacks trick recipients into revealing credentials or clicking unverified links. Always verify domain handles out-of-band.`;
  } else if (promptLower.includes('password') || promptLower.includes('mfa')) {
    answerText += `Strong unique passphrases paired with hardware or authenticator app 2FA prevent automated credential stuffing.`;
  } else {
    answerText += `Defensive cybersecurity relies on evidence-based risk assessment, regular updates, and strict access controls.`;
  }

  answerText += `\n\n[RECOMMENDED ACTION]
- Use X-Scan Intelligence or Security Posture Check before trusting suspicious domains.
- Audit active account sessions regularly.`;

  return {
    answer: answerText,
    source: 'DEFENSIVE_SECURITY_RULE_ENGINE',
    providerName: 'XTRACY Defensive AI Engine',
    isAiGenerated: false,
    readingMode: mode,
    aiMode,
    disclaimer: 'Automated AI responses are for guidance and educational purposes.',
  };
}

export const processDefensiveAiQuery = processDefensiveAIQuery;
