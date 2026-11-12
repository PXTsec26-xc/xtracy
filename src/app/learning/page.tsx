'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { FeatureStatusBadge } from '@/components/ui/FeatureStatusBadge';
import { KNOWLEDGE_BASE_RESOURCES, KnowledgeResource } from '@/data/knowledgeBase';
import {
  BookOpen,
  Search,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Bookmark,
} from 'lucide-react';

const CATEGORIES: ('ALL' | KnowledgeResource['category'])[] = [
  'ALL',
  'Cybersecurity Fundamentals',
  'IT & Networking',
  'Web Security',
  'Cryptography',
  'Privacy & Digital Safety',
  'Digital Forensics',
  'Cloud & Identity Security',
  'Mobile & Consumer Safety',
];

const DIFFICULTIES: ('ALL' | KnowledgeResource['difficulty'])[] = [
  'ALL',
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
];

export default function LearningPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | KnowledgeResource['category']>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'ALL' | KnowledgeResource['difficulty']>('ALL');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState(24);
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('xtracy_kb_saved_v1') || '[]');
    } catch {
      return [];
    }
  });

  const toggleSave = (id: string) => {
    const next = savedIds.includes(id)
      ? savedIds.filter((item) => item !== id)
      : [...savedIds, id];
    setSavedIds(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('xtracy_kb_saved_v1', JSON.stringify(next));
    }
  };

  const filteredModules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return KNOWLEDGE_BASE_RESOURCES.filter((mod) => {
      if (selectedCategory !== 'ALL' && mod.category !== selectedCategory) return false;
      if (selectedDifficulty !== 'ALL' && mod.difficulty !== selectedDifficulty) return false;
      if (showSavedOnly && !savedIds.includes(mod.id)) return false;
      if (q) {
        const hay = `${mod.id} ${mod.title} ${mod.summary} ${mod.category} ${mod.officialReference} ${mod.tags.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, showSavedOnly, savedIds]);

  const displayedModules = filteredModules.slice(0, visibleLimit);

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-brand-cyan" aria-hidden="true" />
              Cybersecurity Knowledge &amp; Standards Library
            </h1>
            <Badge
              type="productStatus"
              value={`${KNOWLEDGE_BASE_RESOURCES.length} VERIFIED MODULES`}
              size="sm"
            />
          </div>
          <FeatureStatusBadge status="LOCAL" label="● CURATED STANDARDS LIBRARY" />
        </div>
        <p className="text-sm text-gray-300 max-w-4xl">
          Practical defensive guides grounded in NIST SP 800 series, CISA advisories, OWASP Cheat Sheets, IETF RFCs, MITRE CWE/ATT&amp;CK, and W3C WebCrypto/WCAG specifications.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <GlassCard className="p-6 border-brand-cyan/40 shadow-2xl flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label htmlFor="kb-search-input" className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">
              Search Topics, Standards, or Tags
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                id="kb-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleLimit(24);
                }}
                placeholder="Search (e.g. 'DNSSEC', 'SSRF', 'PBKDF2', 'RFC 8785', 'Smishing')..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-400 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="kb-difficulty-select" className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">
              Difficulty Level
            </label>
            <select
              id="kb-difficulty-select"
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value as any);
                setVisibleLimit(24);
              }}
              className="px-3 py-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d} className="bg-darkBg text-white">
                  {d === 'ALL' ? 'All Difficulty Levels' : d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleLimit(24);
                }}
                className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan ${
                  selectedCategory === cat
                    ? 'bg-brand-cyan text-black font-extrabold border-brand-cyan'
                    : 'bg-darkBg-panel text-gray-300 border-gray-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            aria-pressed={showSavedOnly}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan ${
              showSavedOnly
                ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                : 'bg-darkBg-panel border-gray-800 text-gray-300 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Saved ({savedIds.length})</span>
          </button>
        </div>

        <div className="text-[11px] text-gray-400">
          Showing {displayedModules.length} of {filteredModules.length} matching modules ({KNOWLEDGE_BASE_RESOURCES.length} total available).
        </div>
      </GlassCard>

      {/* Learning Modules Grid */}
      {displayedModules.length === 0 ? (
        <GlassCard className="p-8 text-center text-xs text-gray-300">
          No learning modules match your current search or filter selection.
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedModules.map((mod) => {
            const isSaved = savedIds.includes(mod.id);
            return (
              <GlassCard key={mod.id} className="p-6 border-gray-800 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-brand-cyan font-mono font-bold uppercase">
                      {mod.id} • {mod.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-darkBg-panel text-gray-200 font-mono text-[10px] border border-gray-800">
                        {mod.difficulty}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleSave(mod.id)}
                        aria-label={isSaved ? `Remove ${mod.title} from saved modules` : `Bookmark ${mod.title}`}
                        aria-pressed={isSaved}
                        className={`p-1.5 rounded-lg border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan ${
                          isSaved
                            ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                            : 'bg-darkBg-panel border-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <h2 className="text-base font-bold text-white">{mod.title}</h2>
                  <p className="text-xs text-gray-300 leading-relaxed">{mod.summary}</p>

                  <div className="p-3.5 rounded-xl bg-darkBg-panel border border-gray-800 flex flex-col gap-1 text-xs">
                    <strong className="text-gray-300 text-[10px] uppercase font-mono">
                      Technical Context:
                    </strong>
                    <p className="text-gray-200 text-xs leading-relaxed">{mod.theoryContent}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-darkBg-panel/80 border border-gray-800/80 flex flex-col gap-1 text-xs">
                    <strong className="text-emerald-400 text-[10px] uppercase font-mono">
                      Defensive Application:
                    </strong>
                    <p className="text-gray-300 text-xs leading-relaxed">{mod.practicalExample}</p>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-[11px] text-gray-300 pt-1">
                    <a
                      href={mod.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-cyan hover:underline flex items-center gap-1 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded"
                    >
                      <span>{mod.officialReference}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                    </a>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                    Standards Aligned
                  </span>
                  <Link
                    href={mod.relatedToolHref}
                    className="text-xs font-bold text-brand-cyan hover:underline flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded"
                  >
                    <span>Open Related Tool</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {visibleLimit < filteredModules.length && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setVisibleLimit((prev) => prev + 24)}
            className="px-6 py-3 rounded-xl bg-darkBg-card hover:bg-gray-800 border border-gray-700 text-brand-cyan font-bold text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
          >
            Load More Modules ({filteredModules.length - visibleLimit} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
