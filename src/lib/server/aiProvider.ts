import { ReadingMode } from '@/types';

export interface AiResponsePayload {
  answer: string;
  recommendedSteps: string[];
  readingMode: ReadingMode;
  isAiGenerated: boolean;
  providerName: string;
}

export async function processDefensiveAiQuery({
  query,
  readingMode = 'BEGINNER',
}: {
  query: string;
  readingMode?: ReadingMode;
}): Promise<AiResponsePayload> {
  const normalizedQuery = query.toLowerCase().trim();

  // If OpenAI API key is configured
  if (process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are XTRACY AI, a defensive cyber safety assistant. Keep responses strictly defensive, helpful, and framed for reading mode ${readingMode}. Do NOT provide hacking or offensive exploitation instructions.`,
            },
            { role: 'user', content: query },
          ],
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const text = json.choices?.[0]?.message?.content || '';
        return {
          answer: text,
          recommendedSteps: ['Follow defensive steps provided above.', 'Update software to latest versions.', 'Verify security settings.'],
          readingMode,
          isAiGenerated: true,
          providerName: 'OpenAI GPT-4o Defensive Assistant',
        };
      }
    } catch (err) {
      // Fallback on API failure
    }
  }

  // Defensive Cyber Safety Rule Engine Fallback
  let answer = `Regarding "${query}": Keep your accounts safe by enabling 2-Factor Authentication (2FA) using an Authenticator app rather than SMS. Never click unverified link shorteners or share OTP codes.`;
  let steps = [
    'Change compromised account passwords immediately.',
    'Enable 2-Factor Authentication (2FA) via Authenticator App.',
    'Check active logged-in sessions and revoke unverified devices.',
    'If money was fraudulently stolen in India, call Cybercrime Helpline 1930 within the golden hour.',
  ];

  if (normalizedQuery.includes('hacked') || normalizedQuery.includes('compromised')) {
    answer = `If your account or device has been compromised: Immediately log out of all active sessions from another trusted device, change your password to a strong 16+ character passphrase, and enable 2FA.`;
    steps = [
      'Call National Emergency 112 if in physical danger.',
      'Call Cybercrime Helpline 1930 if financial fraud occurred.',
      'Revoke third-party OAuth app access permissions.',
    ];
  } else if (normalizedQuery.includes('phishing') || normalizedQuery.includes('link') || normalizedQuery.includes('url')) {
    answer = `To verify suspicious URLs or links: Inspect the domain TLD carefully (e.g. paytm-update-kyc.com is NOT paytm.com). Never enter passwords or OTPs on pages opened directly from SMS or WhatsApp links.`;
    steps = [
      'Submit the suspicious URL in XTRACY Quick Scan Center.',
      'Check SSL certificate details in browser address bar.',
      'Do not download attachments from unknown senders.',
    ];
  } else if (normalizedQuery.includes('women') || normalizedQuery.includes('stalking') || normalizedQuery.includes('harassment')) {
    answer = `For women experiencing cyberstalking, harassment, or non-consensual image sharing: Take screenshots preserving date, time, URLs, and handles BEFORE blocking the perpetrator. Contact Women's Helpline 181 for 24/7 confidential support.`;
    steps = [
      'Call Women\'s Helpline 181 immediately for confidential guidance.',
      'Use XTRACY Quick Exit button if someone approaches your device.',
      'File an official report on national cybercrime.gov.in portal.',
    ];
  }

  return {
    answer,
    recommendedSteps: steps,
    readingMode,
    isAiGenerated: false,
    providerName: 'XTRACY Defensive Security Rule Engine',
  };
}
