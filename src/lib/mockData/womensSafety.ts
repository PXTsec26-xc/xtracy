import { WomenSafetyGuide } from '@/types';

export const WOMEN_SAFETY_GUIDES: WomenSafetyGuide[] = [
  {
    id: 'guide-stalking',
    title: 'Cyberstalking & Digital Location Tracking Awareness',
    category: 'Cyberstalking',
    summary: 'Recognize digital tracking indicators, hidden AirTag/Bluetooth trackers, shared location settings, and compromised account sessions.',
    warningSigns: [
      'Someone knows your exact location or routine without you telling them.',
      'Unrecognized devices listed under your Apple ID, Google Account, or Find My.',
      'Unexpected notifications on your phone about an "Unknown AirTag moving with you".',
      'Battery draining unusually fast or device running hot due to unauthorized background apps.',
      'Social media accounts showing logins from unknown cities or IP addresses.',
    ],
    immediateDefensiveSteps: [
      'Perform a Bluetooth & AirTag scan using native iOS "Find My" or Android "Tracker Detect" app.',
      'Audit shared location settings on Google Maps, Apple Find My, Snapchat Snap Map, and WhatsApp Live Location.',
      'Change passwords for your primary email and cloud accounts (Apple ID, Google) from a trusted separate device.',
      'Enable Multi-Factor Authentication (MFA) using an authenticator app.',
      'Turn OFF location services for non-essential applications.',
    ],
    evidencePreservationGuide: [
      'Take full-screen screenshots showing the date, time, battery level, and full URL/username.',
      'Do NOT reset your phone immediately if you plan to file a police report, as forensic evidence may be cleared.',
      'Keep a written log of dates, times, location alerts, and suspicious messages in the XTRACY Safe Vault.',
    ],
    officialResources: [
      { name: 'National Domestic Violence Hotline', contact: '1-800-799-SAFE (7233) / Text "START" to 88788', website: 'https://www.thehotline.org', scope: 'US 24/7 Confidential Support' },
      { name: 'Safety Net Project (NNEDV)', contact: 'Tech Safety Resources', website: 'https://www.techsafety.org', scope: 'Global Digital Safety & Stalking Resources' },
      { name: 'Cyber Civil Rights Initiative', contact: '1-844-878-2274', website: 'https://www.cybercivilrights.org', scope: 'Image Abuse & Online Harassment Helpline' },
    ],
  },
  {
    id: 'guide-harassment',
    title: 'Online Harassment, Doxxing & Blackmail Protection',
    category: 'Online Harassment',
    summary: 'Defensive action plan for handling coordinated online harassment, public exposure of personal details (doxxing), or extortion threats.',
    warningSigns: [
      'Receiving multiple aggressive or threatening messages from multiple fake accounts.',
      'Your phone number, address, or employer information posted publicly without permission.',
      'Demands for money, gift cards, or intimate images accompanied by threats of exposure.',
    ],
    immediateDefensiveSteps: [
      'Do NOT pay extortion demands or engage with harassers — paying rarely stops blackmail and marks you as a target.',
      'Set all social media accounts to Maximum Privacy (Friends Only or Private).',
      'Document every message, comment, and profile before blocking or reporting.',
      'Use official platform reporting forms for Doxxing, Harassment, and Impersonation.',
      'Remove your personal information from major data brokers using opt-out directories.',
    ],
    evidencePreservationGuide: [
      'Save direct links to the harassing posts and user profile URLs.',
      'Capture original unedited screenshots showing timestamps and usernames.',
      'Store evidence safely in an encrypted local folder or the XTRACY Safe Vault.',
    ],
    officialResources: [
      { name: 'StopNCII.org', contact: 'Digital Hash Prevention Platform', website: 'https://stopncii.org', scope: 'Global Non-Consensual Image Removal' },
      { name: 'Take It Down (NCMEC)', contact: '1-800-843-5678', website: 'https://takeitdown.ncmec.org', scope: 'Removal of Explicit Images of Minors' },
      { name: 'IC3 - FBI Internet Crime Complaint Center', contact: 'Online Incident Filing', website: 'https://www.ic3.gov', scope: 'US Federal Extortion & Cybercrime Reporting' },
    ],
  },
  {
    id: 'guide-impersonation',
    title: 'Impersonation, Fake Profiles & Account Takeover Response',
    category: 'Impersonation',
    summary: 'How to detect, document, report, and remove unauthorized accounts using your name, photos, or identity.',
    warningSigns: [
      'Friends notifying you that "you" sent them suspicious messages or friend requests.',
      'A duplicate account created using your exact photos, bio, and close variation of your username.',
      'You are locked out of your legitimate account and your recovery email/phone was altered.',
    ],
    immediateDefensiveSteps: [
      'If your account is taken over, initiate official account recovery immediately using the platform\'s hacked account portal.',
      'Alert close contacts on alternative channels that an impersonator account is active.',
      'File an official Impersonation Report with the platform supplying your valid ID if requested.',
      'Check if your email or password appeared in a data breach.',
    ],
    evidencePreservationGuide: [
      'Obtain the full URL of the fake account profile (e.g. instagram.com/fake_user).',
      'Screenshot direct messages sent by the fake profile.',
      'Record the exact date and time when you first noticed the fake account.',
    ],
    officialResources: [
      { name: 'Instagram Hacked & Impersonation Hub', contact: 'Help Center Portal', website: 'https://instagram.com/hacked', scope: 'Meta Impersonation & Recovery' },
      { name: 'Google Account Recovery Portal', contact: 'Account Recovery Help', website: 'https://accounts.google.com/signin/recovery', scope: 'Google Account Security' },
    ],
  },
];

export const SOCIAL_PRIVACY_CHECKLISTS = [
  {
    platform: 'Instagram',
    iconName: 'Instagram',
    color: 'from-pink-500 to-purple-600',
    items: [
      { id: 'ig-private', label: 'Make Account Private (Settings → Account Privacy → Private Account)' },
      { id: 'ig-activity', label: 'Turn Off Activity Status (Settings → Messages & Story Replies → Show Activity Status)' },
      { id: 'ig-tags', label: 'Require Manual Tag Approval (Settings → Tags and Mentions → Manually Approve Tags)' },
      { id: 'ig-mfa', label: 'Enable Authenticator App 2FA (Settings → Security → Two-Factor Authentication)' },
      { id: 'ig-sessions', label: 'Review Active Login Activity & Log Out of Unknown Devices' },
    ],
  },
  {
    platform: 'WhatsApp',
    iconName: 'MessageSquare',
    color: 'from-emerald-500 to-teal-600',
    items: [
      { id: 'wa-pin', label: 'Enable Two-Step Verification PIN (Settings → Account → Two-Step Verification)' },
      { id: 'wa-profile', label: 'Restrict Profile Photo & About to My Contacts Only (Settings → Privacy)' },
      { id: 'wa-groups', label: 'Restrict Who Can Add You to Groups (Settings → Privacy → Groups → My Contacts)' },
      { id: 'wa-location', label: 'Audit & Stop Active Live Location Sharing in All Chats' },
      { id: 'wa-devices', label: 'Review Linked Devices & Log Out of Unknown Web Sessions' },
    ],
  },
  {
    platform: 'Facebook',
    iconName: 'Facebook',
    color: 'from-blue-600 to-indigo-700',
    items: [
      { id: 'fb-audit', label: 'Run Privacy Checkup (Settings & Privacy → Privacy Checkup)' },
      { id: 'fb-search', label: 'Limit Who Can Look You Up via Email or Phone Number to Friends' },
      { id: 'fb-face', label: 'Disable Facial Recognition / Tag Suggestions' },
      { id: 'fb-off-fb', label: 'Clear Off-Facebook Activity & Disconnect Third-Party Apps' },
      { id: 'fb-mfa', label: 'Enable 2FA with Authenticator App' },
    ],
  },
  {
    platform: 'TikTok',
    iconName: 'Video',
    color: 'from-cyan-400 to-blue-500',
    items: [
      { id: 'tt-private', label: 'Switch to Private Account (Settings → Privacy → Private Account)' },
      { id: 'tt-duet', label: 'Restrict Duet / Stitch Permissions to Friends Only' },
      { id: 'tt-downloads', label: 'Disable Video Downloads by Others' },
      { id: 'tt-suggest', label: 'Turn Off "Suggest Your Account to Others"' },
      { id: 'tt-2fa', label: 'Enable 2-Step Verification in Security Settings' },
    ],
  },
];
