'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataTrustBadge } from '@/components/ui/DataTrustBadge';
import { GlobalSafetyResource } from '@/lib/globalSafetyData';
import { Globe, ShieldAlert, ExternalLink, Phone, AlertTriangle, CheckCircle2 } from 'lucide-react';

function GlobalSafetyContent() {
  const searchParams = useSearchParams();
  const initialCountry = searchParams.get('countryCode') || 'GLOBAL';

  const [countryCode, setCountryCode] = useState(initialCountry);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [resources, setResources] = useState<GlobalSafetyResource[]>([]);
  const [disclaimer, setDisclaimer] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let url = `/api/global-safety?countryCode=${countryCode}`;
    if (categoryFilter !== 'ALL') {
      url += `&category=${categoryFilter}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setResources(data.data.resources);
          setDisclaimer(data.data.disclaimer);
        }
      })
      .finally(() => setLoading(false));
  }, [countryCode, categoryFilter]);

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Globe className="w-8 h-8 text-brand-cyan" />
              XTRACY Global Safety Center
            </h1>
            <Badge type="productStatus" value="VERIFIED DIRECTORY" size="sm" />
          </div>
          <DataTrustBadge status="LIVE" sourceName="Official Global Safety Directory" />
        </div>
        <p className="text-xs text-gray-400">
          International digital safety assistance, official government cybercrime reporting portals, emergency hotlines, and consumer protection resources.
        </p>
      </div>

      {/* Mandatory Emergency Disclaimer Box */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/80 text-amber-200 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <strong className="text-amber-300 font-bold uppercase tracking-wider text-[11px]">
            IMPORTANT EMERGENCY NOTICE
          </strong>
          <p className="leading-relaxed">
            {disclaimer || 'XTRACY does not replace local emergency services. If you or someone else is in immediate physical danger, please contact your local emergency services immediately.'}
          </p>
        </div>
      </div>

      {/* Country & Category Selector Filter Bar */}
      <GlassCard className="p-6 border-brand-blue/30 shadow-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider shrink-0">
            Select Country / Region:
          </label>
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs font-bold focus:border-brand-cyan"
          >
            <option value="GLOBAL">Global / All Regions</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="EU">European Union</option>
            <option value="IN">India</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'CYBERCRIME_REPORTING', 'WOMENS_SAFETY', 'CONSUMER_PROTECTION'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-brand-blue text-white shadow-glowBlue'
                  : 'bg-darkBg-panel text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Verified Resources Grid */}
      {loading ? (
        <div className="text-center py-12 text-xs text-gray-400">Loading verified safety resources...</div>
      ) : resources.length === 0 ? (
        <GlassCard className="p-8 text-center flex flex-col items-center gap-3">
          <ShieldAlert className="w-10 h-10 text-gray-600" />
          <h3 className="text-base font-bold text-white">No Verified Resources Listed For Selection</h3>
          <p className="text-xs text-gray-400 max-w-md">
            No specific resources found for this category. Please switch to &quot;Global / All Regions&quot; to view international fallback agencies.
          </p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((res) => (
            <GlassCard key={res.id} className="p-6 border-gray-800 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold text-[10px] uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {res.verificationStatus.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-gray-500 font-semibold">{res.countryName}</span>
                </div>

                <h3 className="text-base font-bold text-white mt-1">{res.orgName}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{res.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-800 text-xs">
                {res.contactPhone ? (
                  <a
                    href={`tel:${res.contactPhone}`}
                    className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call {res.contactPhone}</span>
                  </a>
                ) : (
                  <span className="text-[11px] text-gray-500">Official Web Reporting Portal</span>
                )}

                <a
                  href={res.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-darkBg-panel hover:bg-gray-800 border border-gray-700 text-brand-cyan font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <span>Visit Official Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </GlassCard>
          ))}
        </div>
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
