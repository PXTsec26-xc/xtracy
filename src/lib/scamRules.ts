import { ScamAnalysisResult } from '@/types';

export function analyzeScamContent(input: string, type: 'url' | 'text' | 'email'): ScamAnalysisResult {
  const text = input.trim();
  const lower = text.toLowerCase();
  
  const warningSigns: string[] = [];
  const rulesTriggered: string[] = [];
  let score = 5; // Base default score

  if (type === 'url') {
    // URL-specific checks
    if (!text.startsWith('http://') && !text.startsWith('https://')) {
      warningSigns.push('URL lacks secure protocol specification (missing https://)');
      score += 15;
    }

    if (text.startsWith('http://')) {
      warningSigns.push('Unencrypted HTTP connection detected (No SSL/TLS certificate)');
      score += 25;
      rulesTriggered.push('HTTP_UNENCRYPTED');
    }

    if (/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(text)) {
      warningSigns.push('Raw IP address used instead of legitimate domain name');
      score += 35;
      rulesTriggered.push('RAW_IP_URL');
    }

    const suspiciousTLDs = ['.xyz', '.top', '.work', '.click', '.gq', '.tk', '.cf', '.ga', '.ml', '.zip', '.mov', '.buzz', '.rest'];
    if (suspiciousTLDs.some((tld) => lower.includes(tld))) {
      warningSigns.push('High-risk low-cost top-level domain frequently associated with automated phishing infrastructure');
      score += 30;
      rulesTriggered.push('HIGH_RISK_TLD');
    }

    const brandKeywords = ['paypal', 'bank', 'instagram', 'facebook', 'netflix', 'apple', 'microsoft', 'google', 'amazon', 'support', 'verify', 'account-update', 'login-security'];
    const hasBrandKeyword = brandKeywords.some((brand) => lower.includes(brand));
    const isStandardDomain = lower.includes('.com') || lower.includes('.org') || lower.includes('.gov') || lower.includes('.edu');

    if (hasBrandKeyword && (lower.includes('-') || lower.includes('_') || lower.split('.').length > 3)) {
      warningSigns.push('Potential brand typosquatting or sub-domain spoofing technique');
      score += 35;
      rulesTriggered.push('TYPOSQUATTING_SPOOF');
    }
  } else {
    // Text and Email Content checks
    const urgencyKeywords = ['urgent', 'immediately', 'within 24 hours', 'account suspended', 'legal action', 'warrant issued', 'final notice', 'action required', 'do not ignore'];
    const matchedUrgency = urgencyKeywords.filter((kw) => lower.includes(kw));
    if (matchedUrgency.length > 0) {
      warningSigns.push(`High urgency or pressure tactics detected: "${matchedUrgency.slice(0, 2).join('", "')}"`);
      score += 25;
      rulesTriggered.push('URGENCY_PRESSURE');
    }

    const credentialHarvesting = ['enter your password', 'verify your pin', 'social security', 'verify seed phrase', 'login to restore access', 'confirm credit card', 'otp code'];
    const matchedCreds = credentialHarvesting.filter((kw) => lower.includes(kw));
    if (matchedCreds.length > 0) {
      warningSigns.push(`Direct request for sensitive credentials or security information: "${matchedCreds[0]}"`);
      score += 40;
      rulesTriggered.push('CREDENTIAL_HARVESTING');
    }

    const financialScams = ['wire transfer', 'crypto', 'gift card', 'bitcoin wallet', 'payment via zelle', 'cash app', 'claim prize', 'lottery winner', 'inheritance'];
    const matchedFinance = financialScams.filter((kw) => lower.includes(kw));
    if (matchedFinance.length > 0) {
      warningSigns.push(`Untraceable payment method requested: "${matchedFinance[0]}"`);
      score += 30;
      rulesTriggered.push('UNTRACEABLE_PAYMENT');
    }

    const extortionKeywords = ['recorded you', 'intimate pictures', 'webcam video', 'send money or else', 'expose to your contacts', 'leak video'];
    const matchedExtortion = extortionKeywords.filter((kw) => lower.includes(kw));
    if (matchedExtortion.length > 0) {
      warningSigns.push(`Extortion or blackmail indicator detected: "${matchedExtortion[0]}"`);
      score += 45;
      rulesTriggered.push('EXTORTION_BLACKMAIL');
    }

    if (lower.includes('bit.ly') || lower.includes('tinyurl.com') || lower.includes('t.co') || lower.includes('is.gd')) {
      warningSigns.push('Shortened URL link hides destination web address');
      score += 20;
      rulesTriggered.push('SHORTENED_URL');
    }
  }

  // Cap score at 98
  score = Math.min(Math.max(score, 5), 98);

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (score >= 65) {
    riskLevel = 'HIGH';
  } else if (score >= 35) {
    riskLevel = 'MEDIUM';
  }

  let dangerExplanation = 'No prominent malicious indicators detected based on client-side heuristic rules. However, always exercise caution with unexpected links or messages.';
  if (riskLevel === 'HIGH') {
    dangerExplanation = 'This content contains multiple high-risk indicators commonly associated with phishing, fraud campaigns, credential harvesting, or extortion tactics.';
  } else if (riskLevel === 'MEDIUM') {
    dangerExplanation = 'This content exhibits suspicious language, unusual formatting, or urgency pressure. Caution is recommended.';
  }

  const whatNotToDo = [
    'Do NOT click any embedded links or open attachments.',
    'Do NOT enter your passwords, PINs, or financial information.',
    'Do NOT reply or contact the sender through the provided contact details.',
    'Do NOT send money, gift cards, or cryptocurrency payments.',
  ];

  const safeNextSteps = [
    'Verify the sender through an official, independent channel (e.g. typing the official URL into your browser).',
    'Report the message or email as spam/phishing within your email service or application.',
    'If you entered credentials into a suspicious page, change your password immediately on the official website and enable Multi-Factor Authentication (MFA).',
  ];

  return {
    riskScore: score,
    riskLevel,
    inputType: type,
    inputSample: text.length > 120 ? text.substring(0, 120) + '...' : text,
    warningSigns: warningSigns.length > 0 ? warningSigns : ['No immediate explicit threat signatures matched standard rule set.'],
    dangerExplanation,
    whatNotToDo,
    safeNextSteps,
    heuristicRulesTriggered: rulesTriggered,
    analyzedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
  };
}
