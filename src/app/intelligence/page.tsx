'use client';

import React, { useState } from 'react';
import { ThreatCard } from '@/components/feed/ThreatCard';
import { MOCK_THREAT_REPORTS } from '@/lib/mockData/threats';
import { Badge } from '@/components/ui/Badge';
import { GlassCard } from '@/components/ui/GlassCard';
import { Radio, Search, Filter } from 'lucide-react';

export default function IntelligencePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = [
    'ALL',
    'Critical Vulnerabilities',
    'Social Media Security',
    'Windows and Linux Security',
    'Women\'s Digital Safety',
  ];

  const filteredReports = MOCK_THREAT_REPORTS.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex flex-col gap-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Radio className="w-8 h-8 text-brand-cyan animate-pulse" />
            Threat Intelligence & Security Advisories
          </h1>
          <Badge type="productStatus" value="VERIFIED & DEMO FEEDS" size="sm" />
        </div>
        <p className="text-xs text-gray-400">
          Search security advisories, vulnerability reports, and incident alerts with 3 reading modes (Beginner, Student, Professional).
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReports.map((report) => (
          <ThreatCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
