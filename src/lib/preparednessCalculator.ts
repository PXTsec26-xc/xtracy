import { PreparednessCheckitem } from '@/types';

export const DEFAULT_PREPAREDNESS_ITEMS: PreparednessCheckitem[] = [
  {
    id: 'mfa-email',
    category: 'Account Security',
    title: 'Multi-Factor Authentication (MFA) on Primary Email',
    description: 'Enabled authenticator app or hardware key on primary recovery email.',
    points: 20,
    isCompleted: false,
  },
  {
    id: 'password-manager',
    category: 'Password Hygiene',
    title: 'Unique Passwords & Password Manager',
    description: 'Using long, unique passwords per account stored in a secure password manager.',
    points: 20,
    isCompleted: false,
  },
  {
    id: 'software-updates',
    category: 'Device Safety',
    title: 'Automatic OS & Browser Updates Enabled',
    description: 'Operating system and main browser updated to latest security patches.',
    points: 15,
    isCompleted: false,
  },
  {
    id: 'social-privacy-review',
    category: 'Privacy Exposure',
    title: 'Social Media Privacy Settings Audit',
    description: 'Restricted public visibility of phone number, email, and personal location.',
    points: 15,
    isCompleted: false,
  },
  {
    id: 'recovery-codes',
    category: 'Recovery Preparedness',
    title: 'Account Recovery Backup Codes Saved',
    description: 'Backup 2FA codes saved offline in a safe physical location or encrypted vault.',
    points: 15,
    isCompleted: false,
  },
  {
    id: 'scam-awareness-check',
    category: 'Scam Awareness',
    title: 'Phishing & Urgent Request Vigilance',
    description: 'Reviewed XTRACY Scam Check guidelines and common phishing tactics.',
    points: 15,
    isCompleted: false,
  },
];

export function calculatePreparednessScore(items: PreparednessCheckitem[]): {
  score: number;
  status: 'Safe' | 'Caution' | 'High Risk';
  completedCount: number;
  totalCount: number;
  categoryBreakdown: { [category: string]: { earned: number; total: number } };
} {
  let earnedPoints = 0;
  let totalPoints = 0;
  let completedCount = 0;

  const categoryBreakdown: { [category: string]: { earned: number; total: number } } = {};

  items.forEach((item) => {
    totalPoints += item.points;
    if (!categoryBreakdown[item.category]) {
      categoryBreakdown[item.category] = { earned: 0, total: 0 };
    }
    categoryBreakdown[item.category].total += item.points;

    if (item.isCompleted) {
      earnedPoints += item.points;
      completedCount += 1;
      categoryBreakdown[item.category].earned += item.points;
    }
  });

  const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

  let status: 'Safe' | 'Caution' | 'High Risk' = 'High Risk';
  if (score >= 80) {
    status = 'Safe';
  } else if (score >= 45) {
    status = 'Caution';
  }

  return {
    score,
    status,
    completedCount,
    totalCount: items.length,
    categoryBreakdown,
  };
}
