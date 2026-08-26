'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import {
  ShieldCheck,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Globe,
  Server,
  Laptop,
  Lock,
  LifeBuoy,
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  task: string;
  category: string;
  impact: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
}

const CHECKLIST_TEMPLATES: Record<string, { title: string; items: ChecklistItem[] }> = {
  web_app: {
    title: 'Web Application Hardening Checklist (OWASP Defenses)',
    items: [
      { id: 'w1', task: 'Enforce HTTPS & Strict-Transport-Security (HSTS)', category: 'Transport', impact: 'CRITICAL', description: 'Ensure all plaintext HTTP requests redirect to HTTPS and include HSTS header with max-age >= 31536000.' },
      { id: 'w2', task: 'Implement Content-Security-Policy (CSP)', category: 'Browser', impact: 'CRITICAL', description: "Restrict executable script origins to avoid Cross-Site Scripting (XSS) and injection." },
      { id: 'w3', task: 'Configure X-Frame-Options & X-Content-Type-Options', category: 'Headers', impact: 'HIGH', description: 'Prevent MIME-sniffing and clickjacking/UI redressing by adding nosniff and DENY directives.' },
      { id: 'w4', task: 'Secure Cookie Attributes (HttpOnly, Secure, SameSite=Strict)', category: 'Session', impact: 'CRITICAL', description: 'Prevent JavaScript access to session tokens and defend against Cross-Site Request Forgery (CSRF).' },
      { id: 'w5', task: 'Implement Server-Side Rate Limiting & Token Bucketing', category: 'API', impact: 'HIGH', description: 'Protect authentication and sensitive endpoints against brute-force and DDoS flooding.' },
      { id: 'w6', task: 'Enforce SSRF Protection on All Outbound URL Fetchers', category: 'Backend', impact: 'CRITICAL', description: 'Block loopback (127.0.0.1), private RFC 1918 subnets, and cloud metadata (169.254.169.254).' },
    ],
  },
  cloud_infra: {
    title: 'Cloud Infrastructure & Server Hardening',
    items: [
      { id: 'c1', task: 'Disable Password Authentication on SSH (Keys Only)', category: 'Access', impact: 'CRITICAL', description: 'Permit only Ed25519 or RSA-4096 SSH keys with passphrase protection.' },
      { id: 'c2', task: 'Enable Host Firewall (UFW / iptables / AWS Security Groups)', category: 'Network', impact: 'CRITICAL', description: 'Restrict open inbound ports exclusively to necessary web ports (80/443) and specific SSH IP allowlists.' },
      { id: 'c3', task: 'Configure Automated Unattended Security Updates', category: 'Maintenance', impact: 'HIGH', description: 'Ensure OS distribution patches critical kernel and library CVEs automatically.' },
      { id: 'c4', task: 'Apply Principle of Least Privilege to IAM Roles', category: 'Identity', impact: 'HIGH', description: 'Never use root API credentials; grant granular role permissions with session expiration.' },
      { id: 'c5', task: 'Configure Centralized Audit Logging & File Integrity Monitoring', category: 'Monitoring', impact: 'MEDIUM', description: 'Stream syslog and authentication records to an immutable external logging destination.' },
    ],
  },
  endpoint_safety: {
    title: 'Employee & Remote Work Endpoint Security',
    items: [
      { id: 'e1', task: 'Enable Full-Disk Encryption (BitLocker / FileVault / LUKS)', category: 'Hardware', impact: 'CRITICAL', description: 'Protects stored data against physical theft or unauthorized device inspection.' },
      { id: 'e2', task: 'Enforce Multi-Factor Authentication (TOTP / FIDO2)', category: 'Authentication', impact: 'CRITICAL', description: 'Require hardware security keys or authenticator apps for all corporate and email accounts.' },
      { id: 'e3', task: 'Deploy Enterprise Password Manager for Credential Hygiene', category: 'Passwords', impact: 'HIGH', description: 'Eliminate password reuse by generating 20+ character random credentials for each service.' },
      { id: 'e4', task: 'Set Up 5-Minute Auto-Lock Screen Timeout with Passcode', category: 'Physical', impact: 'MEDIUM', description: 'Prevents unauthorized physical access in shared or public workspaces.' },
      { id: 'e5', task: 'Disable Automatic Wi-Fi Network Joining & Enable Firewall', category: 'Network', impact: 'MEDIUM', description: 'Prevents automatic association with rogue evil-twin Wi-Fi access points.' },
    ],
  },
  incident_readiness: {
    title: 'Incident Response & Disaster Recovery Readiness',
    items: [
      { id: 'i1', task: 'Implement 3-2-1 Backup Strategy with Immutable Offline Copy', category: 'Backup', impact: 'CRITICAL', description: '3 copies, 2 different media, 1 offsite immutable backup impervious to ransomware.' },
      { id: 'i2', task: 'Document Designated Emergency Incident Response Team Contacts', category: 'Organization', impact: 'CRITICAL', description: 'Maintain an offline physical list of lead responders, legal counsel, and hosting contacts.' },
      { id: 'i3', task: 'Establish Out-of-Band Communication Channel (e.g. Signal)', category: 'Operations', impact: 'HIGH', description: 'Ensure team can coordinate if primary corporate email or Slack is compromised.' },
      { id: 'i4', task: 'Conduct Biannual Tabletop Incident Response Simulations', category: 'Testing', impact: 'MEDIUM', description: 'Simulate account takeover and ransomware scenarios to validate response playbooks.' },
    ],
  },
};

export default function SecurityChecklistPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof CHECKLIST_TEMPLATES>('web_app');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const activeTemplate = CHECKLIST_TEMPLATES[selectedTemplate];
  const totalItems = activeTemplate.items.length;
  const completedCount = activeTemplate.items.filter((item) => checkedItems[item.id]).length;
  const progressPercent = Math.round((completedCount / totalItems) * 100);

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyMarkdown = () => {
    let md = `# ${activeTemplate.title}\n\n`;
    md += `**Progress:** ${completedCount}/${totalItems} (${progressPercent}% Completed)\n\n`;
    activeTemplate.items.forEach((item) => {
      const isDone = checkedItems[item.id] ? '[x]' : '[ ]';
      md += `- ${isDone} **[${item.impact}] ${item.task}** (${item.category})\n  *${item.description}*\n`;
    });
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              Defensive Security Checklist Generator
            </h1>
            <Badge type="productStatus" value="INTERACTIVE CHECKLIST" size="sm" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Dynamic defensive security checklists for web application hardening, cloud infrastructure, endpoint safety, and incident readiness.
          </p>
        </div>

        <button
          onClick={handleCopyMarkdown}
          className="px-4 py-2 rounded-xl bg-darkBg-panel hover:bg-gray-800 border border-gray-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Markdown' : 'Export Checklist'}</span>
        </button>
      </div>

      {/* Template Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { key: 'web_app', label: 'Web Application', icon: Globe },
          { key: 'cloud_infra', label: 'Cloud & Servers', icon: Server },
          { key: 'endpoint_safety', label: 'Remote Endpoints', icon: Laptop },
          { key: 'incident_readiness', label: 'Incident Readiness', icon: LifeBuoy },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = selectedTemplate === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setSelectedTemplate(t.key as any)}
              className={`p-4 rounded-2xl border flex flex-col items-start gap-2 transition-all ${
                isActive
                  ? 'bg-brand-blue/20 border-brand-cyan text-brand-cyan shadow-glowBlue'
                  : 'bg-darkBg-panel border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <strong className="text-xs text-white block">{t.label}</strong>
            </button>
          );
        })}
      </div>

      {/* Progress Bar Card */}
      <GlassCard className="p-6 border-gray-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            {activeTemplate.title}
          </span>
          <span className="text-xs font-bold text-emerald-400">
            {completedCount} of {totalItems} Completed ({progressPercent}%)
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-gray-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-blue to-emerald-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </GlassCard>

      {/* Checklist Tasks List */}
      <div className="flex flex-col gap-3">
        {activeTemplate.items.map((item) => {
          const isDone = Boolean(checkedItems[item.id]);
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-4 rounded-xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-gray-300'
                  : 'bg-darkBg-panel border-gray-800 text-white hover:border-gray-700'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 shrink-0 text-emerald-400"
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-500 hover:text-brand-cyan" />
                )}
              </button>

              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <strong className={`text-xs font-bold ${isDone ? 'line-through text-gray-400' : 'text-white'}`}>
                    {item.task}
                  </strong>
                  <span className="px-1.5 py-0.2 rounded bg-black/40 text-[9px] text-gray-400 font-mono">
                    {item.category}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      item.impact === 'CRITICAL'
                        ? 'bg-red-950 text-red-300'
                        : item.impact === 'HIGH'
                        ? 'bg-amber-950 text-amber-300'
                        : 'bg-blue-950 text-blue-300'
                    }`}
                  >
                    {item.impact}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
