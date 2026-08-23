export type ThemeMode = 'dark' | 'light' | 'emergency';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ConfidenceLevel = 'Developing' | 'Verified' | 'Officially Confirmed';
export type RelevanceLevel = 'Not Relevant' | 'Possibly Relevant' | 'Highly Relevant';
export type ReadingMode = 'BEGINNER' | 'STUDENT' | 'PROFESSIONAL';

export type DataTrustStatus = 'LIVE' | 'CACHED' | 'FALLBACK' | 'DEMO';

export interface DataTrustInfo {
  status: DataTrustStatus;
  sourceName: string;
  sourceUrl?: string;
  lastRefreshed: string;
  cacheDurationSeconds?: number;
}

export interface UserSafetyProfile {
  operatingSystems: string[]; // e.g. ['Android', 'Windows', 'macOS', 'iOS', 'Linux']
  devices: string[];          // e.g. ['Smartphone', 'Laptop', 'Tablet', 'IoT']
  browsers: string[];         // e.g. ['Chrome', 'Firefox', 'Safari', 'Edge', 'Brave']
  emailProviders: string[];   // e.g. ['Gmail', 'Outlook', 'ProtonMail', 'Yahoo']
  socialMedia: string[];      // e.g. ['Instagram', 'Facebook', 'WhatsApp', 'TikTok', 'X', 'LinkedIn']
  onlineServices: string[];   // e.g. ['Google Workspace', 'AWS', 'iCloud', 'Digital Banking', 'Crypto']
  userRole: 'Student' | 'Professional' | 'Business Owner' | 'Developer' | 'Cybersecurity Learner' | 'Everyday User';
  isConfigured: boolean;
  updatedAt: string;
}

export interface ThreatReport {
  id: string;
  title: string;
  summary: string;
  category: 
    | 'Breaking Security Alerts'
    | 'Critical Vulnerabilities'
    | 'Data Breaches'
    | 'Major Cyber Incidents'
    | 'Ransomware Reports'
    | 'Scams & Fraud'
    | 'AI & Deepfake Threats'
    | 'Privacy Incidents'
    | 'Mobile Security'
    | 'Social Media Security'
    | 'Windows and Linux Security'
    | 'Women\'s Digital Safety';
  severity: RiskLevel;
  confidence: ConfidenceLevel;
  affectedTags: string[]; // e.g. ['Android', 'Instagram', 'Gmail', 'Windows']
  publishedAt: string;
  recommendedAction: 'Monitor' | 'Update' | 'Secure Account' | 'Act Immediately';
  isDemoData: boolean;
  officialSource?: string;
  dataTrust?: DataTrustInfo;
  
  // 3-Tier Explanations
  beginner: {
    simpleExplanation: string;
    whyItMatters: string;
    immediateSteps: string[];
  };
  student: {
    overview: string;
    concepts: string[];
    educationalNote: string;
    defensiveTakeaway: string;
  };
  professional: {
    cve?: string;
    cvssScore?: number;
    attackVector?: string;
    affectedVersions?: string;
    mitreAttackId?: string;
    iocs?: string[];
    remediationSteps: string[];
    technicalReferences: string[];
  };
}

export interface ScamAnalysisResult {
  riskScore: number; // 0 to 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  inputType: 'url' | 'text' | 'email';
  inputSample: string;
  warningSigns: string[];
  dangerExplanation: string;
  whatNotToDo: string[];
  safeNextSteps: string[];
  heuristicRulesTriggered: string[];
  analyzedAt: string;
  dataTrust?: DataTrustInfo;
}

export interface VaultNote {
  id: string;
  title: string;
  category: 'Incident Log' | 'Timeline Event' | 'Evidence Notes' | 'Recovery Steps' | 'General Safety Note';
  timestamp: string;
  content: string;
  evidenceReference?: string;
  checklistState: { [key: string]: boolean };
}

export interface EmergencyScenario {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  priorityLevel: 'NORMAL' | 'IMPORTANT' | 'URGENT';
  doThisNow: string[];
  doNotDoThis: string[];
  secureAccount: string[];
  preserveEvidence: string[];
  recoverySteps: string[];
  whenToEscalate: string;
}

export interface EmergencyContact {
  priority: number;
  number: string;
  telLink: string;
  name: string;
  tagline: string;
  scope: string;
  description: string;
  whenToCall: string;
  badgeColor: string;
}

export interface WomenSafetyGuide {
  id: string;
  title: string;
  category: 'Cyberstalking' | 'Online Harassment' | 'Impersonation' | 'Image Abuse' | 'Account Takeover' | 'Location Privacy';
  summary: string;
  warningSigns: string[];
  immediateDefensiveSteps: string[];
  evidencePreservationGuide: string[];
  officialResources: { name: string; contact: string; website: string; scope: string }[];
}

export interface IncidentPin {
  id: string;
  title: string;
  region: string;
  lat: number;
  lng: number;
  category: 'Data Breach' | 'Ransomware' | 'Vulnerabilities' | 'Scam Campaign' | 'Malware' | 'Phishing';
  severity: RiskLevel;
  date: string;
  summary: string;
  isDemoData: boolean;
  dataTrust?: DataTrustInfo;
}

export interface PreparednessCheckitem {
  id: string;
  category: 'Account Security' | 'Password Hygiene' | 'Privacy Exposure' | 'Scam Awareness' | 'Device Safety' | 'Recovery Preparedness';
  title: string;
  description: string;
  points: number;
  isCompleted: boolean;
}
