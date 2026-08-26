export interface GlobalSafetyResource {
  id: string;
  countryCode: string;
  countryName: string;
  region?: string;
  category: 'EMERGENCY' | 'CYBERCRIME_REPORTING' | 'WOMENS_SAFETY' | 'CONSUMER_PROTECTION';
  orgName: string;
  description: string;
  officialUrl: string;
  contactPhone?: string;
  lastReviewed: string;
  verificationStatus: 'OFFICIAL_VERIFIED' | 'COMMUNITY_REVIEWED';
}

export const GLOBAL_SAFETY_RESOURCES: GlobalSafetyResource[] = [
  // United States
  {
    id: 'us-ic3',
    countryCode: 'US',
    countryName: 'United States',
    category: 'CYBERCRIME_REPORTING',
    orgName: 'Internet Crime Complaint Center (IC3)',
    description: 'Official FBI portal for reporting online scams, fraud, ransomware, and cybercrime.',
    officialUrl: 'https://www.ic3.gov/',
    lastReviewed: '2026-08-01',
    verificationStatus: 'OFFICIAL_VERIFIED',
  },
  {
    id: 'us-cisa',
    countryCode: 'US',
    countryName: 'United States',
    category: 'CONSUMER_PROTECTION',
    orgName: 'CISA Cyber Incident Reporting',
    description: 'Cybersecurity and Infrastructure Security Agency incident reporting for organizations.',
    officialUrl: 'https://www.cisa.gov/report',
    lastReviewed: '2026-08-01',
    verificationStatus: 'OFFICIAL_VERIFIED',
  },
  // United Kingdom
  {
    id: 'uk-ncsc',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    category: 'CYBERCRIME_REPORTING',
    orgName: 'National Cyber Security Centre (NCSC)',
    description: 'Official UK portal for reporting phishing emails, malicious websites, and cyber fraud.',
    officialUrl: 'https://www.ncsc.gov.uk/section/about-ncsc/report-an-incident',
    lastReviewed: '2026-08-01',
    verificationStatus: 'OFFICIAL_VERIFIED',
  },
  {
    id: 'uk-action-fraud',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    category: 'CYBERCRIME_REPORTING',
    orgName: 'Action Fraud UK',
    description: 'National reporting centre for fraud and cybercrime in the UK.',
    officialUrl: 'https://www.actionfraud.police.uk/',
    lastReviewed: '2026-08-01',
    verificationStatus: 'OFFICIAL_VERIFIED',
  },
  // Canada
  {
    id: 'ca-antifraud',
    countryCode: 'CA',
    countryName: 'Canada',
    category: 'CYBERCRIME_REPORTING',
    orgName: 'Canadian Anti-Fraud Centre (CAFC)',
    description: 'Central agency for reporting identity theft, financial fraud, and cyber scams in Canada.',
    officialUrl: 'https://www.antifraudcentre-centreantifraude.ca/',
    lastReviewed: '2026-08-01',
    verificationStatus: 'OFFICIAL_VERIFIED',
  },
  // Australia
  {
    id: 'au-cyber',
    countryCode: 'AU',
    countryName: 'Australia',
    category: 'CYBERCRIME_REPORTING',
    orgName: 'Australian Cyber Security Centre (ReportCyber)',
    description: 'Official Australian Government cybercrime reporting portal.',
    officialUrl: 'https://www.cyber.gov.au/report-and-recover/report',
    lastReviewed: '2026-08-01',
    verificationStatus: 'OFFICIAL_VERIFIED',
  },
  // European Union / General Europe
  {
    id: 'eu-cyber',
    countryCode: 'EU',
    countryName: 'European Union',
    category: 'CYBERCRIME_REPORTING',
    orgName: 'Europol European Cybercrime Centre (EC3)',
    description: 'Central coordinator for European national cybercrime reporting agencies.',
    officialUrl: 'https://www.europol.europa.eu/about-europol/european-cybercrime-centre-ec3',
    lastReviewed: '2026-08-01',
    verificationStatus: 'OFFICIAL_VERIFIED',
  },
  // India (Verified Official References)
  {
    id: 'in-cybercrime',
    countryCode: 'IN',
    countryName: 'India',
    category: 'CYBERCRIME_REPORTING',
    orgName: 'National Cyber Crime Reporting Portal (MHA)',
    description: 'Ministry of Home Affairs official portal for reporting financial cyber fraud and digital crimes.',
    officialUrl: 'https://cybercrime.gov.in/',
    contactPhone: '1930',
    lastReviewed: '2026-08-01',
    verificationStatus: 'OFFICIAL_VERIFIED',
  },
  // International Fallback
  {
    id: 'global-cert',
    countryCode: 'GLOBAL',
    countryName: 'Global / Other',
    category: 'CYBERCRIME_REPORTING',
    orgName: 'FIRST Incident Response Directory',
    description: 'Global Forum of Incident Response and Security Teams directory for computer emergency response teams worldwide.',
    officialUrl: 'https://www.first.org/members/teams/',
    lastReviewed: '2026-08-01',
    verificationStatus: 'OFFICIAL_VERIFIED',
  },
];

export const GLOBAL_DISCLAIMER = `DISCLAIMER: XTRACY is a cyber safety intelligence platform and does NOT replace local emergency services. If you or someone else is in immediate physical danger, please contact your local national emergency services immediately.`;
