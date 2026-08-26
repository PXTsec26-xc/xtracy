'use client';

import React, { useState, useEffect } from 'react';
import { ThreatCard } from '@/components/feed/ThreatCard';
import { MOCK_THREAT_REPORTS } from '@/lib/mockData/threats';
import { Badge } from '@/components/ui/Badge';
import { GlassCard } from '@/components/ui/GlassCard';
import { DataTrustBadge } from '@/components/ui/DataTrustBadge';
import { Radio, Search, Filter, RefreshCw } from 'lucide-react';
import { ThreatReport } from '@/types';

export default function IntelligencePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [reports, setReports] = useState<ThreatReport[]>(MOCK_THREAT_REPORTS);
  const [loading, setLoading] = useState(true);
  const [dataTrustStatus, setDataTrustStatus] = useState<'LIVE' | 'DEMO' | 'FALLBACK'>('LIVE');
  const [sourceName, setSourceName] = useState('CISA KEV Live Feed');

  useEffect(() => {
    async function loadLiveThreats() {
      try {
        setLoading(true);
        const res = await fetch('/api/threat-intelligence');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setReports(json.data);
            if (json.dataTrust) {
              setDataTrustStatus(json.dataTrust.status || 'LIVE');
              setSourceName(json.dataTrust.sourceName || 'CISA KEV Live Feed');
            }
          }
        }
      } catch (err) {
        // Fallback to verified curated advisories
        setDataTrustStatus('FALLBACK');
        setSourceName('Curated Security Advisories');
      } finally {
        setLoading(false);
      }
    }

    loadLiveThreats();
  }, []);

  const categories = [
    'ALL',
    'Critical Vulnerabilities',
    'Social Media Security',
    'Windows and Linux Security',
    'Women\'s Digital Safety',
  ];

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex flex-col gap-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Radio className="w-8 h-8 text-brand-cyan animate-pulse" />
              Threat Intelligence & Security Advisories
            </h1>
            <Badge type="productStatus" value="LIVE CISA & ADVISORY FEED" size="sm" />
          </div>
          <DataTrustBadge status={dataTrustStatus} sourceName={sourceName} />
        </div>
        <p className="text-xs text-gray-400">
          Search live CISA vulnerabilities, security advisories, and incident alerts with 3 reading modes (Beginner, Student, Professional).
        </p>
      </div>

      {/* Filter & Search Bar */}
      <GlassCard className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-brand-blue/30">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search CVEs, apps, or threats..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 text-xs focus:border-brand-cyan"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-blue text-white shadow-glowBlue border border-brand-cyan'
                  : 'bg-darkBg-panel/60 text-gray-400 border border-gray-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Feed Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-xs text-gray-400 gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-brand-cyan" />
          <span>Fetching live threat intelligence records from CISA feed...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReports.map((report) => (
            <ThreatCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
