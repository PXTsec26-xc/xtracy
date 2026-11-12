'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataTrustBadge } from '@/components/ui/DataTrustBadge';
import {
  COUNTRY_PROFILES,
  CountryProfile,
  GLOBAL_DISCLAIMER,
  GLOBAL_SAFETY_RESOURCES,
  GlobalSafetyResource,
  INCIDENT_RESPONSE_PLAYBOOKS,
  INTERNATIONAL_TRAVELER_TIPS,
  SafetyRegion,
} from '@/lib/globalSafetyData';
import {
  Globe,
  ShieldAlert,
  ExternalLink,
  Phone,
  AlertTriangle,
  CheckCircle2,
  Search,
  Compass,
  FileWarning,
  Flag,
} from 'lucide-react';

const REGIONS: ('ALL' | SafetyRegion)[] = [
  'ALL',
  'Global',
  'North America',
  'Europe',
  'Asia-Pacific',
  'Middle East',
  'Africa',
  'Latin America',
  'Oceania',
];

const CATEGORIES = [
  { id: 'ALL', label: 'All Categories' },
  { id: 'CYBERCRIME_REPORTING', label: 'Cybercrime Reporting' },
  { id: 'CERT_CSIRT', label: 'National CERT / CSIRT' },
  { id: 'SCAM_FRAUD_REPORTING', label: 'Scam & Fraud' },
  { id: 'WOMENS_CHILD_SAFETY', label: 'Women & Child Safety' },
  { id: 'CONSUMER_PROTECTION', label: 'Consumer Protection' },
  { id: 'DATA_PRIVACY_AUTHORITY', label: 'Data Privacy Regulator' },
];

function extractDialDigits(rawPhone: string): string | null {
  const firstPart = rawPhone.split('/')[0].split('(')[0].trim();
  const cleaned = firstPart.replace(/[^0-9+]/g, '');
  return cleaned.length >= 2 ? cleaned : null;
}

function GlobalSafetyContent() {
  const searchParams = useSearchParams();
  const initialCountry = (searchParams.get('countryCode') || 'GLOBAL').toUpperCase();

  const [countryCode, setCountryCode] = useState(initialCountry);
  const [regionFilter, setRegionFilter] = useState<'ALL' | SafetyRegion>('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'directory' | 'playbooks' | 'travelers'>('directory');

  useEffect(() => {
    const paramCode = searchParams.get('countryCode')?.toUpperCase();
    if (paramCode && COUNTRY_PROFILES.some((c) => c.countryCode === paramCode)) {
      setCountryCode(paramCode);
    }
  }, [searchParams]);

  const countriesForRegion = useMemo(() => {
    if (regionFilter === 'ALL') return COUNTRY_PROFILES;
    return COUNTRY_PROFILES.filter(
      (c) => c.region === regionFilter || c.countryCode === 'GLOBAL'
    );
  }, [regionFilter]);

  const selectedProfile: CountryProfile = useMemo(() => {
    return (
      COUNTRY_PROFILES.find((c) => c.countryCode === countryCode) ||
      COUNTRY_PROFILES[0]
    );
  }, [countryCode]);

  const filteredResources: GlobalSafetyResource[] = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return GLOBAL_SAFETY_RESOURCES.filter((res) => {
      if (countryCode !== 'GLOBAL') {
        if (res.countryCode !== countryCode && res.countryCode !== 'GLOBAL') return false;
      } else if (regionFilter !== 'ALL') {
        if (res.region !== regionFilter && res.countryCode !== 'GLOBAL') return false;
      }

      if (categoryFilter !== 'ALL' && res.category !== categoryFilter) {
        return false;
      }

      if (q) {
        const hay = `${res.countryName} ${res.orgName} ${res.description} ${res.sourceDomain} ${res.countryCode}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [countryCode, regionFilter, categoryFilter, searchQuery]);

  const countryCount = COUNTRY_PROFILES.filter((c) => c.countryCode !== 'GLOBAL').length;
  const dialableEmergency = extractDialDigits(selectedProfile.emergencyNumber);
  const dialableCyber = selectedProfile.dedicatedCyberHotline
    ? extractDialDigits(selectedProfile.dedicatedCyberHotline)
    : null;

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Globe className="w-8 h-8 text-brand-cyan" aria-hidden="true" />
              Global Cyber Safety & Emergency Directory
            </h1>
            <Badge type="productStatus" value={`${countryCount} COUNTRIES & JURISDICTIONS`} size="sm" />
          </div>
          <DataTrustBadge status="LOCAL" sourceName="Verified Official Directory (Static Offline-Ready)" />
        </div>
        <p className="text-sm text-gray-300 max-w-4xl leading-relaxed">
          Official government cybercrime reporting portals, national CERTs/CSIRTs, emergency numbers, data protection authorities, and first-response playbooks across North America, Europe, Asia-Pacific, Middle East, Africa, Latin America, and Oceania.
        </p>
      </div>

      {/* Mandatory Safety Disclaimer & Emergency vs Cybercrime Distinction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-700/70 text-amber-100 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <strong className="text-amber-300 font-bold uppercase tracking-wider text-[11px]">
              Independent Platform Disclaimer
            </strong>
            <p className="leading-relaxed text-amber-100/90">{GLOBAL_DISCLAIMER}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-red-950/30 border border-red-800/70 text-xs flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-300">
                Selected Jurisdiction: {selectedProfile.countryName}
              </span>
              <p className="text-gray-300 mt-1">
                Life-safety emergency vs. non-emergency cyber reporting are separate channels:
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-gray-900 border border-gray-700 text-gray-300">
              Languages: {selectedProfile.primaryLanguages.join(', ')}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {dialableEmergency ? (
              <a
                href={`tel:${dialableEmergency}`}
                className="px-3 py-1.5 rounded-lg bg-red-900/90 hover:bg-red-800 border border-red-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Physical Danger Emergency: {selectedProfile.emergencyNumber}</span>
              </a>
            ) : (
              <span className="px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-800 text-red-200 font-bold text-xs">
                Emergency: {selectedProfile.emergencyNumber}
              </span>
            )}

            {selectedProfile.dedicatedCyberHotline ? (
              dialableCyber ? (
                <a
                  href={`tel:${dialableCyber}`}
                  className="px-3 py-1.5 rounded-lg bg-sky-950 hover:bg-sky-900 border border-sky-700 text-sky-200 font-bold text-xs flex items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
                >
                  <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Cyber Hotline: {selectedProfile.dedicatedCyberHotline}</span>
                </a>
              ) : (
                <span className="px-3 py-1.5 rounded-lg bg-sky-950/60 border border-sky-800 text-sky-200 font-semibold text-xs">
                  {selectedProfile.dedicatedCyberHotline}
                </span>
              )
            ) : (
              <span className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-gray-300 text-xs">
                Cyber Reporting: Official Online Portal (No separate national helpline listed)
              </span>
            )}
          </div>
          {selectedProfile.specializedSupportNote && (
            <p className="text-[11px] text-gray-300">{selectedProfile.specializedSupportNote}</p>
          )}
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Global safety center sections">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'directory'}
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan ${
            activeTab === 'directory'
              ? 'bg-brand-blue text-white shadow-glowBlue'
              : 'bg-darkBg-card text-gray-300 border border-gray-800 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" aria-hidden="true" />
          Country & Agency Directory ({filteredResources.length})
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'playbooks'}
          onClick={() => setActiveTab('playbooks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan ${
            activeTab === 'playbooks'
              ? 'bg-brand-blue text-white shadow-glowBlue'
              : 'bg-darkBg-card text-gray-300 border border-gray-800 hover:text-white'
          }`}
        >
          <FileWarning className="w-4 h-4" aria-hidden="true" />
          Incident Response Playbooks ({INCIDENT_RESPONSE_PLAYBOOKS.length})
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'travelers'}
          onClick={() => setActiveTab('travelers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan ${
            activeTab === 'travelers'
              ? 'bg-brand-blue text-white shadow-glowBlue'
              : 'bg-darkBg-card text-gray-300 border border-gray-800 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" aria-hidden="true" />
          International Traveler Safety
        </button>
      </div>

      {activeTab === 'directory' && (
        <>
          {/* Filter Controls */}
          <GlassCard className="p-5 border-brand-blue/30 shadow-2xl flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Box */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="safety-search-input" className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                  Search Country, Agency, or Domain
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                  <input
                    id="safety-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. India, CERT-In, ic3.gov, Germany..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
                  />
                </div>
              </div>

              {/* Region Filter */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="safety-region-select" className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                  Geographic Region
                </label>
                <select
                  id="safety-region-select"
                  value={regionFilter}
                  onChange={(e) => {
                    const nextReg = e.target.value as 'ALL' | SafetyRegion;
                    setRegionFilter(nextReg);
                    setCountryCode('GLOBAL');
                  }}
                  className="px-3 py-2 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
                >
                  {REGIONS.map((reg) => (
                    <option key={reg} value={reg} className="bg-darkBg text-white">
                      {reg === 'ALL' ? 'All Regions Worldwide' : reg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country Filter (Manual Selection Only) */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="safety-country-select" className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                  Manual Country Selector
                </label>
                <select
                  id="safety-country-select"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
                >
                  {countriesForRegion.map((c) => (
                    <option key={c.countryCode} value={c.countryCode} className="bg-darkBg text-white">
                      {c.countryName} ({c.countryCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Pills */}
            <div
              role="group"
              aria-label="Filter safety resources by category"
              className="flex items-center gap-2 overflow-x-auto pb-1"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={categoryFilter === cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan ${
                    categoryFilter === cat.id
                      ? 'bg-brand-blue text-white shadow-glowBlue'
                      : 'bg-darkBg-panel text-gray-300 hover:text-white border border-gray-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </GlassCard>

          {selectedProfile.unavailableCategoriesNote && (
            <div className="px-4 py-3 rounded-xl bg-gray-900/70 border border-gray-800 text-xs text-gray-300">
              <strong className="text-white">Coverage Note ({selectedProfile.countryName}):</strong>{' '}
              {selectedProfile.unavailableCategoriesNote}
            </div>
          )}

          {/* Resources Grid */}
          {filteredResources.length === 0 ? (
            <GlassCard className="p-8 text-center flex flex-col items-center gap-3">
              <ShieldAlert className="w-10 h-10 text-gray-500" aria-hidden="true" />
              <h2 className="text-base font-bold text-white">No Verified Resource Matches Current Filter</h2>
              <p className="text-xs text-gray-300 max-w-md">
                Some countries do not publish separate government portals for every sub-category. Reset filters or switch to Global fallback agencies (INTERPOL / FIRST / econsumer.gov) to view international options.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCategoryFilter('ALL');
                  setSearchQuery('');
                  setCountryCode('GLOBAL');
                  setRegionFilter('ALL');
                }}
                className="px-4 py-2 rounded-lg bg-brand-blue text-white font-bold text-xs"
              >
                Reset All Filters
              </button>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredResources.map((res) => {
                const dialHref = res.contactPhone ? extractDialDigits(res.contactPhone) : null;
                return (
                  <GlassCard key={res.id} className="p-5 border-gray-800 flex flex-col justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold text-[10px] uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                          Verified Official • {res.lastVerifiedDate}
                        </span>
                        <span className="text-[11px] text-gray-300 font-semibold">
                          {res.countryName} • {res.region}
                        </span>
                      </div>

                      <h2 className="text-base font-bold text-white mt-1">{res.orgName}</h2>
                      <p className="text-xs text-gray-300 leading-relaxed">{res.description}</p>

                      <div className="flex flex-wrap gap-1.5 mt-1 text-[10px] text-gray-300">
                        <span className="px-2 py-0.5 rounded bg-darkBg-panel border border-gray-800">
                          {res.category.replace(/_/g, ' ')}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-darkBg-panel border border-gray-800">
                          {res.reportingMethod}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-darkBg-panel border border-gray-800">
                          {res.cost}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-darkBg-panel border border-gray-800">
                          {res.languages.join(', ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        Eligibility: {res.eligibility} • Domain: <code className="text-gray-200">{res.sourceDomain}</code>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-800 text-xs flex-wrap gap-2">
                      {dialHref && res.contactPhone ? (
                        <a
                          href={`tel:${dialHref}`}
                          className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-200 font-bold text-xs flex items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                        >
                          <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Call {res.contactPhone}</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-gray-400">{res.reportingMethod}</span>
                      )}

                      <a
                        href={res.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-darkBg-panel hover:bg-gray-800 border border-gray-700 text-brand-cyan font-bold text-xs flex items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
                      >
                        <span>Visit Official Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}

          {/* Broken or Outdated Link Report Mechanism */}
          <div className="p-4 rounded-2xl bg-darkBg-card border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-gray-300">
              <Flag className="w-4 h-4 text-brand-cyan shrink-0" aria-hidden="true" />
              <span>
                Notice an updated agency portal, changed emergency number, or broken link? Report directory corrections so we can review and verify them.
              </span>
            </div>
            <Link
              href="/community-feed"
              className="px-3.5 py-2 rounded-lg bg-darkBg-panel hover:bg-gray-800 border border-gray-700 text-white font-bold whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
            >
              Report Outdated Link
            </Link>
          </div>
        </>
      )}

      {activeTab === 'playbooks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {INCIDENT_RESPONSE_PLAYBOOKS.map((playbook) => (
            <GlassCard key={playbook.id} className="p-6 border-gray-800 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-bold text-white">{playbook.title}</h2>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    playbook.urgency === 'IMMEDIATE'
                      ? 'bg-red-950 text-red-300 border border-red-800'
                      : playbook.urgency === 'HIGH'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-sky-950 text-sky-300 border border-sky-800'
                  }`}
                >
                  {playbook.urgency}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{playbook.summary}</p>
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-brand-cyan mb-1.5">
                  Immediate Response Steps
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-xs text-gray-200">
                  {playbook.immediateSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                  Evidence to Preserve
                </h3>
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-300">
                  {playbook.evidenceToPreserve.map((ev, idx) => (
                    <li key={idx}>{ev}</li>
                  ))}
                </ul>
              </div>
              <p className="text-[11px] text-amber-200 bg-amber-950/30 border border-amber-900/60 p-2.5 rounded-lg">
                <strong>When to Contact Authorities:</strong> {playbook.whenToContactPolice}
              </p>
            </GlassCard>
          ))}
        </div>
      )}

      {activeTab === 'travelers' && (
        <GlassCard className="p-6 border-gray-800 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-cyan" aria-hidden="true" />
            <h2 className="text-lg font-bold text-white">International Traveler Digital & Physical Safety</h2>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            When traveling abroad, select your destination country manually in the directory above to bookmark local emergency numbers and national cybercrime reporting portals offline before departure.
          </p>
          <ul className="space-y-2.5 text-xs text-gray-200">
            {INTERNATIONAL_TRAVELER_TIPS.map((tip, idx) => (
              <li key={idx} className="p-3 rounded-xl bg-darkBg-panel border border-gray-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/evidencepulse"
              className="px-4 py-2 rounded-xl bg-brand-blue text-white font-bold text-xs"
            >
              Open Local Evidence Hashing
            </Link>
            <Link
              href="/safe-vault"
              className="px-4 py-2 rounded-xl bg-darkBg-panel border border-gray-700 text-gray-200 font-bold text-xs"
            >
              Store Emergency Notes in Encrypted Vault
            </Link>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

export default function GlobalSafetyPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-xs text-gray-400">Loading Global Safety Center...</div>}>
      <GlobalSafetyContent />
    </Suspense>
  );
}
