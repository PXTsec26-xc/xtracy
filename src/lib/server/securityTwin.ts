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
    cspHeaderPresent: boolean;
    hstsHeaderPresent: boolean;
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
      openPorts: isHttps ? [443] : [80],
      publicKeywords: ['web-server', 'http-endpoint'],
      riskScore,
    },
    configuration: {
      httpsEnabled: isHttps,
      cspHeaderPresent: false,
      hstsHeaderPresent: isHttps,
    },
    evidenceCount: factorsCount,
    openFindingsCount: factorsCount,
    riskMovement: riskScore > 40 ? 'INCREASED' : 'STABLE',
    unknownAreas: [
      'Backend Application Logic',
      'Private Server Configuration',
      'Database Security State',
    ],
    lastAssessedAt: timestamp,
  };
}
