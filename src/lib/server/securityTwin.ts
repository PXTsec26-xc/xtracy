/**
 * XTRACY Security Twin Engine
 * Continuously updated digital security representation for authorized assets: IDENTITY, INFRASTRUCTURE, EXPOSURE, CONFIGURATION, ACCOUNTS, CONTROLS, EVIDENCE, FINDINGS, HISTORY, RISK.
 */

export interface SecurityTwinState {
  assetTarget: string;
  identity: {
    hostname: string;
    targetType: string;
    ownerVerificationStatus: string;
  };
  infrastructure: {
    ipAddress?: string;
    protocol: string;
    serverLocation?: string;
  };
  exposure: {
    openPorts: number[];
    publicKeywords: string[];
    riskScore: number;
  };
  configuration: {
    httpsEnabled: boolean;
    cspHeaderPresent: boolean | null;
    hstsHeaderPresent: boolean | null;
  };
  evidenceCount: number;
  openFindingsCount: number;
  riskMovement: 'STABLE' | 'INCREASED' | 'DECREASED' | 'UNKNOWN';
  unknownAreas: string[];
  lastAssessedAt: string;
}

export function generateSecurityTwin(
  assetTarget: string,
  analysisData: any
): SecurityTwinState {
  const timestamp = new Date().toISOString();

  const isHttps = analysisData?.isHttpsVerified ?? assetTarget.startsWith('https://');
  const riskScore = typeof analysisData?.riskScore === 'number' ? analysisData.riskScore : 10;
  const factorsCount = Array.isArray(analysisData?.factors) ? analysisData.factors.length : 0;

  return {
    assetTarget,
    identity: {
      hostname: assetTarget.replace(/^https?:\/\//, '').split('/')[0],
      targetType: analysisData?.classification || 'DOMAIN',
      ownerVerificationStatus: 'UNVERIFIED_PUBLIC_TARGET',
    },
    infrastructure: {
      protocol: isHttps ? 'HTTPS/TLS' : 'HTTP',
      serverLocation: 'External Public Network',
    },
    exposure: {
      openPorts: [],
      publicKeywords: [],
      riskScore,
    },
    configuration: {
      httpsEnabled: isHttps,
      cspHeaderPresent: null,
      hstsHeaderPresent: null,
    },
    evidenceCount: factorsCount,
    openFindingsCount: factorsCount,
    riskMovement: riskScore > 40 ? 'INCREASED' : 'STABLE',
    unknownAreas: [
      'Open Network Ports (No active port scan performed)',
      'HTTP Security Headers (Requires live Header Analyzer check)',
      'Backend Application & Database State',
    ],
    lastAssessedAt: timestamp,
  };
}
