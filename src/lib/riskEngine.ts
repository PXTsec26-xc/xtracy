import { UserSafetyProfile, RiskLevel } from '@/types';
import { DbScanHistoryItem, DbIncidentRecord } from '@/lib/server/models';

export interface SmartRiskScoreResult {
  score: number; // 0 to 100
  riskLevel: RiskLevel;
  triggers: {
    factor: string;
    impact: number;
    description: string;
  }[];
  recommendations: {
    priority: number;
    action: string;
    description: string;
    linkUrl?: string;
  }[];
  updatedAt: string;
}

export function calculateSmartRiskScore({
  profile,
  recentScans = [],
  incidentRecords = [],
}: {
  profile?: UserSafetyProfile | null;
  recentScans?: DbScanHistoryItem[];
  incidentRecords?: DbIncidentRecord[];
}): SmartRiskScoreResult {
  let score = 85; // Base starting score for fresh profile
  const triggers: SmartRiskScoreResult['triggers'] = [];
  const recommendations: SmartRiskScoreResult['recommendations'] = [];

  // Signal 1: High-risk scan detections
  const highRiskScans = recentScans.filter((s) => s.riskLevel === 'HIGH');
  if (highRiskScans.length > 0) {
    const penalty = Math.min(highRiskScans.length * 15, 30);
    score -= penalty;
    triggers.push({
      factor: 'High Risk Scans Detected',
      impact: -penalty,
      description: `Detected ${highRiskScans.length} high-risk suspicious URLs or messages in your scan history.`,
    });
    recommendations.push({
      priority: 1,
      action: 'Review High-Risk Scan Warning Signs',
      description: 'Check suspicious scan history to ensure no credentials were submitted to dangerous sites.',
      linkUrl: '/scan',
    });
  }

  // Signal 2: Active incident response cases
  const activeIncidents = incidentRecords.filter((i) => i.status === 'IN_PROGRESS');
  if (activeIncidents.length > 0) {
    const penalty = Math.min(activeIncidents.length * 20, 40);
    score -= penalty;
    triggers.push({
      factor: 'Active Incident Response Cases',
      impact: -penalty,
      description: `You have ${activeIncidents.length} active incident cases under recovery in Case Vault.`,
    });
    recommendations.push({
      priority: 1,
      action: 'Complete Incident Recovery Steps',
      description: 'Follow step-by-step triage flows in Incident Case Vault.',
      linkUrl: '/case-vault',
    });
  }

  // Signal 3: Security Archetype Risk Profile
  if ((profile?.userRole as string) === 'High-Risk Profile' || profile?.userRole === 'Cybersecurity Learner') {
    score -= 10;
    triggers.push({
      factor: 'High-Risk Profile Archetype',
      impact: -10,
      description: 'Profile set to High-Risk Archetype (Target for phishing, stalking, or targeted attack).',
    });
    recommendations.push({
      priority: 2,
      action: 'Enable Safe Vault AES-GCM Passphrase Protection',
      description: 'Store sensitive evidence notes in encrypted Safe Vault.',
      linkUrl: '/safe-vault',
    });
  }

  // Bound score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  // Determine Risk Level
  let riskLevel: RiskLevel = 'LOW';
  if (score < 40) riskLevel = 'CRITICAL';
  else if (score < 60) riskLevel = 'HIGH';
  else if (score < 75) riskLevel = 'MEDIUM';

  // Default positive recommendation if no major issues
  if (recommendations.length === 0) {
    recommendations.push({
      priority: 3,
      action: 'Maintain Password & Privacy Hygiene',
      description: 'Run regular privacy checks in Digital Footprint & Privacy Center.',
      linkUrl: '/privacy-footprint',
    });
  }

  return {
    score,
    riskLevel,
    triggers,
    recommendations: recommendations.sort((a, b) => a.priority - b.priority),
    updatedAt: new Date().toISOString(),
  };
}
