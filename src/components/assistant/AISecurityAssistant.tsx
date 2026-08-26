'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { DataTrustBadge } from '@/components/ui/DataTrustBadge';
import { ReadingMode } from '@/types';
import {
  Sparkles,
  Send,
  Bot,
  Shield,
  BookOpen,
  AlertTriangle,
  ArrowRight,
  User,
  Zap,
  Info,
  Terminal,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  steps?: string[];
  provider?: string;
  isAiGenerated?: boolean;
  timestamp: string;
}

export const AISecurityAssistant: React.FC = () => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: "Hello! I am XTRACY AI, your defensive cybersecurity copilot. Ask me to interpret security headers, explain DNS records, evaluate suspicious links, or generate incident triage steps.",
      steps: [
        'How do I configure Content-Security-Policy (CSP) to block XSS?',
        'What is the difference between SPF softfail (~all) and hardfail (-all)?',
        'How do I triage an employee who clicked a credential harvesting link?',
      ],
      provider: 'XTRACY Defensive AI Engine',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [readingMode, setReadingMode] = useState<ReadingMode>('STUDENT');
  const [isLoading, setIsLoading] = useState(false);

  const executeQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: queryText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText.trim(),
          readingMode: readingMode === 'BEGINNER' ? 'Beginner' : readingMode === 'STUDENT' ? 'Student' : 'Professional',
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const payload = data.data;
        const botMsg: ChatMessage = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'assistant',
          text: payload.answer,
          provider: payload.providerName,
          isAiGenerated: payload.isAiGenerated,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const errMsg: ChatMessage = {
          id: 'msg-err-' + Date.now(),
          sender: 'assistant',
          text: data.error?.message || 'Sorry, I could not process your query right now.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errMsg]);
      }
    } catch {
      const errMsg: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        sender: 'assistant',
        text: 'Network connection error while reaching XTRACY AI service.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    const text = inputQuery;
    setInputQuery('');
    await executeQuery(text);
  };

  const quickPrompts = [
    'How do I fix missing HSTS and CSP headers on Nginx?',
    'Explain DMARC p=reject vs p=quarantine',
    'What are the first 3 steps if an admin password is leaked?',
    'Why is domain entropy important for detecting phishing?',
  ];

  return (
    <GlassCard className="p-6 border-brand-blue/30 shadow-2xl flex flex-col gap-6 max-w-4xl mx-auto min-h-[620px] justify-between">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue via-brand-cyan to-brand-violet flex items-center justify-center text-white shadow-glowBlue">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">XTRACY AI Copilot</h2>
              <Badge type="productStatus" value="DEFENSIVE COPILOT" size="sm" />
            </div>
            <p className="text-[11px] text-gray-400">Multi-engine defensive cybersecurity reasoning & tool interpretation.</p>
          </div>
        </div>

        {/* Reading Level Selector */}
        <div className="flex items-center gap-1 bg-darkBg-panel/80 p-1 rounded-xl border border-gray-800 text-xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 px-2">Level:</span>
          {(['BEGINNER', 'STUDENT', 'PROFESSIONAL'] as ReadingMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setReadingMode(mode)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all ${
                readingMode === mode
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Starter Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] scrollbar-none">
        <span className="text-gray-500 font-bold shrink-0">Quick Queries:</span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => executeQuery(p)}
            className="px-3 py-1 rounded-lg bg-darkBg-panel hover:bg-gray-800 border border-gray-800 text-gray-300 whitespace-nowrap transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages Thread Window */}
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[420px] pr-2 scrollbar-thin flex-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col gap-1 text-xs max-w-[90%] ${
              msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
            }`}
          >
            <div className="flex items-center gap-2 text-[10px] text-gray-400">
              {msg.sender === 'assistant' ? (
                <>
                  <Bot className="w-3 h-3 text-brand-cyan" />
                  <span>{msg.provider || 'XTRACY AI Copilot'}</span>
                </>
              ) : (
                <>
                  <User className="w-3 h-3 text-brand-blue" />
                  <span>You</span>
                </>
              )}
              <span>• {msg.timestamp}</span>
            </div>

            <div
              className={`p-4 rounded-2xl leading-relaxed border ${
                msg.sender === 'user'
                  ? 'bg-brand-blue/30 text-white border-brand-cyan/40 rounded-br-none shadow-glowBlue'
                  : 'bg-darkBg-panel text-gray-200 border-gray-800 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>

              {msg.steps && msg.steps.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-800/80 flex flex-col gap-1.5">
                  <span className="font-bold text-brand-cyan text-[11px] uppercase">Suggested Inquiries:</span>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    {msg.steps.map((step, idx) => (
                      <li key={idx} className="cursor-pointer hover:text-brand-cyan" onClick={() => executeQuery(step)}>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="self-start p-3.5 rounded-2xl bg-darkBg-panel border border-gray-800 text-xs text-brand-cyan flex items-center gap-2 animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>XTRACY AI is analyzing defensive cybersecurity guidance...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="flex items-center gap-2 pt-3 border-t border-gray-800">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask XTRACY AI (e.g. 'How do I fix missing CSP on Next.js?' or 'Is this domain suspicious?')..."
          className="flex-1 px-4 py-3 rounded-xl bg-darkBg-panel border border-gray-800 text-white placeholder-gray-500 text-xs focus:border-brand-cyan"
        />
        <button
          type="submit"
          disabled={isLoading || !inputQuery.trim()}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white font-extrabold text-xs shadow-glowBlue hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      </form>
    </GlassCard>
  );
};
