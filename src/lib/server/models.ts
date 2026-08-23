export type StorageStatus = 'PERSISTENT' | 'LOCAL' | 'TEMPORARY' | 'UNAVAILABLE';

export interface DbUser {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
  userRole: 'Everyday User' | 'Student' | 'Professional' | 'Family' | 'High-Risk Profile';
  createdAt: string;
  updatedAt: string;
}

export interface DbUserProfile {
  userId: string;
  operatingSystems: string[];
  devices: string[];
  browsers: string[];
  emailProviders: string[];
  socialMedia: string[];
  onlineServices: string[];
  privacyPreferences: {
    dataMinimization: boolean;
    localVaultOnly: boolean;
    anonymousScans: boolean;
  };
  notificationPreferences: {
    criticalAlerts: boolean;
    weeklySecurityDigest: boolean;
    womensSafetyUpdates: boolean;
  };
  emergencyPreferences: {
    primaryEmergencyNumber: string;
    quickExitEnabled: boolean;
  };
  updatedAt: string;
}

export interface DbScanHistoryItem {
  id: string;
  userId: string;
  inputType: 'url' | 'text' | 'email';
  inputSample: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  warningSignsCount: number;
  analyzedAt: string;
  storageStatus?: StorageStatus;
}

export interface DbSavedReport {
  id: string;
  userId: string;
  reportId: string;
  title: string;
  category: string;
  severity: string;
  savedAt: string;
  storageStatus?: StorageStatus;
}

export interface DbIncidentRecord {
  id: string;
  userId: string;
  scenarioId: string;
  title: string;
  status: 'IN_PROGRESS' | 'RESOLVED' | 'RECOVERING';
  checklistState: Record<string, boolean>;
  notes: string;
  createdAt: string;
  updatedAt: string;
  storageStatus?: StorageStatus;
}

export interface DbVaultNote {
  id: string;
  userId: string;
  title: string;
  category: string;
  encryptedContent: string;
  iv: string;
  salt: string;
  createdAt: string;
  updatedAt: string;
  storageStatus?: StorageStatus;
}

export interface DbSecurityAlert {
  id: string;
  userId: string;
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  readAt?: string;
  createdAt: string;
}
