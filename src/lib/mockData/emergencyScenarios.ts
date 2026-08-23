import { EmergencyScenario } from '@/types';

export const EMERGENCY_SCENARIOS: EmergencyScenario[] = [
  {
    id: 'email-hacked',
    title: 'My Email Was Hacked or Compromised',
    subtitle: 'Primary email access is critical because it controls password resets for all your other accounts.',
    iconName: 'Mail',
    priorityLevel: 'URGENT',
    doThisNow: [
      'Attempt to log into your email immediately from a trusted device.',
      'If logged in, go straight to Account Security → Passwords and change your password to a 16+ character unique passphrase.',
      'If locked out, click "Forgot Password" or use account recovery options immediately.',
      'Log out of all active web and mobile sessions across all devices.',
    ],
    doNotDoThis: [
      'Do NOT use the same compromised password on any other account.',
      'Do NOT ignore emails notifying you of password changes or recovery email updates.',
      'Do NOT send messages from the compromised account explaining it was hacked until you control it fully.',
    ],
    secureAccount: [
      'Enable Multi-Factor Authentication (MFA) using an Authenticator App (Google/Microsoft Authenticator) instead of SMS.',
      'Audit your Forwarding Rules & Filters in email settings (hackers often set hidden auto-forwarding to steal reset codes).',
      'Check Recovery Email and Phone Number in account settings to ensure the hacker didn\'t replace them.',
    ],
    preserveEvidence: [
      'Screenshot unusual security alerts, IP addresses in login history, and unauthorized forwarding addresses.',
      'Note the exact time and date when you lost access.',
    ],
    recoverySteps: [
      'Review connected third-party applications and revoke permissions for unrecognized apps.',
      'Notify your primary contacts (family, work, bank) that your email was compromised.',
      'Check your sent folder and trash folder for unauthorized sent messages.',
    ],
    whenToEscalate: 'Escalate to police or cybercrime authorities immediately if financial transactions were authorized or personal identity documents were stolen.',
  },
  {
    id: 'social-hacked',
    title: 'My Social Media Account Was Taken Over',
    subtitle: 'Instagram, WhatsApp, Facebook, TikTok, X, or LinkedIn account hijacked by an unauthorized user.',
    iconName: 'Share2',
    priorityLevel: 'IMPORTANT',
    doThisNow: [
      'Visit the official recovery portal (e.g. instagram.com/hacked or facebook.com/hacked) from a browser you previously used.',
      'Request a login link or security code sent to your original email or phone number.',
      'If your email was also changed, initiate identity verification (video selfie or ID upload) through the platform app.',
    ],
    doNotDoThis: [
      'Do NOT pay third-party "account recovery hackers" on Instagram, Telegram, or X — 99% of them are scammers.',
      'Do NOT delete your legitimate account app while attempting recovery.',
    ],
    secureAccount: [
      'Once recovered, change password immediately and enable 2FA via Authenticator App.',
      'Revoke all active sessions and linked third-party apps.',
      'Review linked accounts (Meta Accounts Center, Google sign-in) and sever suspicious links.',
    ],
    preserveEvidence: [
      'Take screenshots of messages sent by the hacker from your hijacked profile.',
      'Copy the exact current profile URL.',
    ],
    recoverySteps: [
      'Post a warning on another social platform or message friends to inform them not to click links from your hijacked profile.',
      'Report the hijacking using the platform\'s official hacked account form.',
    ],
    whenToEscalate: 'Escalate if the hacker is actively impersonating you to extort money or send fraudulent messages to your contacts.',
  },
  {
    id: 'phishing-clicked',
    title: 'I Clicked a Suspicious Phishing Link',
    subtitle: 'Clicked an unexpected email, SMS (smishing), or web link that looked suspicious.',
    iconName: 'ExternalLink',
    priorityLevel: 'URGENT',
    doThisNow: [
      'Close the browser tab immediately.',
      'If you entered ANY credentials (password, PIN, OTP), change that password immediately on the official website!',
      'Disconnect your device from Wi-Fi or cellular data temporarily if a file download started automatically.',
    ],
    doNotDoThis: [
      'Do NOT enter any passwords, credit card numbers, or verification codes on the opened page.',
      'Do NOT open any file that downloaded after clicking the link (e.g. .apk, .exe, .zip, .url).',
    ],
    secureAccount: [
      'Change passwords on all accounts that shared the credentials entered on the fake page.',
      'Enable MFA on affected accounts.',
      'Run a full antivirus scan on your device.',
    ],
    preserveEvidence: [
      'Copy the full URL of the suspicious link (do not click it again) and paste it into XTRACY Scam Check.',
      'Take a screenshot of the message containing the link.',
    ],
    recoverySteps: [
      'Monitor your financial accounts for 48 hours if credit card info was exposed.',
      'Report the phishing URL to Google Safe Browsing or CISA Phishing portal.',
    ],
    whenToEscalate: 'Escalate to your bank or card issuer immediately if financial account credentials or credit card numbers were submitted.',
  },
  {
    id: 'suspicious-login',
    title: 'I Received an Unrecognized Login Alert',
    subtitle: 'Alert from Google, Apple, Microsoft, or social media showing a login attempt from an unknown city or device.',
    iconName: 'ShieldAlert',
    priorityLevel: 'IMPORTANT',
    doThisNow: [
      'Do NOT tap "Approve" or "Yes, it\'s me" on your phone if you didn\'t initiate the login!',
      'Open the official app or website directly (do not click the alert link) and go to Security → Active Sessions.',
      'Click "Log Out of All Other Devices".',
    ],
    doNotDoThis: [
      'Do NOT approve 2FA push notifications that arrive unexpectedly (MFA fatigue attack).',
      'Do NOT share 2FA SMS codes with anyone claiming to be "support".',
    ],
    secureAccount: [
      'Change your password immediately to a long, unique passphrase.',
      'Check if your password was leaked in a past data breach.',
      'Switch your 2FA method from SMS to an Authenticator App.',
    ],
    preserveEvidence: [
      'Screenshot the login alert showing IP address, device type, location, and timestamp.',
    ],
    recoverySteps: [
      'Review authorized OAuth third-party applications connected to your account.',
    ],
    whenToEscalate: 'Escalate if multiple accounts report simultaneous unauthorized logins within a short timeframe.',
  },
  {
    id: 'malware-ransomware',
    title: 'My Device May Contain Malware or Ransomware',
    subtitle: 'Device is behaving erratically, files are encrypted, popup ads appear continuously, or unknown apps appeared.',
    iconName: 'FileX',
    priorityLevel: 'URGENT',
    doThisNow: [
      'Disconnect from the internet immediately (Turn off Wi-Fi and unplug Ethernet) to prevent malware from spreading.',
      'If ransomware note is visible, DO NOT PAY THE RANSOM — payment does not guarantee file decryption.',
      'Restart device in Safe Mode and uninstall recently downloaded applications or suspicious browser extensions.',
    ],
    doNotDoThis: [
      'Do NOT connect external backup USB drives or flash drives to an infected computer.',
      'Do NOT log into sensitive accounts (banking, primary email) while on an infected device.',
    ],
    secureAccount: [
      'Log into critical accounts from a known clean device (e.g. phone or another clean PC) and change passwords.',
      'Revoke active sessions for all logged-in accounts.',
    ],
    preserveEvidence: [
      'Photograph ransomware screens or note exact error codes and ransom file extension names (.locked, .crypto).',
    ],
    recoverySteps: [
      'Run a full system scan with Microsoft Defender or a reputable antivirus tool.',
      'If system is heavily corrupted, perform a clean OS reinstallation from official installation media.',
      'Restore files from an uninfected offline backup.',
    ],
    whenToEscalate: 'Report ransomware incidents to official national cyber security agencies (CISA, FBI IC3, Europol No More Ransom).',
  },
  {
    id: 'blackmail-extortion',
    title: 'I am Being Blackmailed or Extorted Online',
    subtitle: 'Threatened with image release, personal information disclosure, or reputational damage unless money is sent.',
    iconName: 'Lock',
    priorityLevel: 'URGENT',
    doThisNow: [
      'STOP ALL COMMUNICATION WITH THE EXTORTIONIST. Do not respond to threats.',
      'DO NOT SEND MONEY, GIFT CARDS, OR CRYPTO. Paying increases demands.',
      'Set your social media accounts to PRIVATE immediately.',
      'Follow the XTRACY Women\'s Safety & Privacy Center evidence preservation steps.',
    ],
    doNotDoThis: [
      'Do NOT delete chat history or block the user before taking full screenshots with timestamps!',
      'Do NOT send additional images or attempt to negotiate.',
    ],
    secureAccount: [
      'Change passwords on all social media and email accounts.',
      'Enable 2FA via Authenticator App.',
      'Review privacy settings to hide friend lists and phone numbers.',
    ],
    preserveEvidence: [
      'Screenshot the extortionist\'s profile, full chat messages, account handle, and payment wallet addresses.',
    ],
    recoverySteps: [
      'Utilize StopNCII.org or TakeItDown.ncmec.org to hash intimate images for proactive platform removal.',
      'File an official complaint with law enforcement or cybercrime helpline.',
    ],
    whenToEscalate: 'Escalate to local police or domestic violence helplines immediately if in physical danger or experiencing severe distress.',
  },
];
