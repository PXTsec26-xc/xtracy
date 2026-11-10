# 08 — BRAND ASSET INVENTORY & TRADE DRESS SPECIFICATION

**Project**: XTRACY Cybersecurity Intelligence Platform
**Creator & Mark Owner**: Sahil Maisuria (Elliot PXT)
**Organization**: PhantomXTrace (PXT)
**Date**: November 10, 2026

---

## 1. Visual Brand Identity

### A. The Geometric X Emblem
- **Source Code Implementation**: `src/components/common/XtracyLogo.tsx`
- **Design Elements**:
  - Upper-left to lower-right interlocking diagonal pillar path (`d="M6 7L13 16L6 25H10.5L15.5 18.5L20.5 25H25L18 16L25 7H20.5L15.5 13.5L10.5 7H6Z"`)
  - Central diamond core node (`d="M15.5 12L19.5 16L15.5 20L11.5 16L15.5 12Z"`)
  - Precision linear cyan accent stroke (`stroke="#38bdf8"`)
- **Color Gradients**:
  - Primary Pillar Gradient: `#38bdf8` (sky-400) -> `#0284c7` (sky-600) -> `#1e3a8a` (blue-900)
  - Core Node Gradient: `#f0f9ff` (sky-50) -> `#38bdf8` (sky-400)

---

## 2. Platform Color Palette & Trade Dress

| Token | Hex Value / CSS Rule | Role in Platform Trade Dress |
|---|---|---|
| **Midnight Navy (Base)** | `#09101d` / `bg-darkBg` | Background foundation across all interfaces |
| **Panel Navy (Elevated)** | `rgba(15, 23, 42, 0.75)` / `bg-darkBg-card` | Glassmorphic cards with backdrop blur |
| **Brand Cyan Accent** | `#38bdf8` / `text-brand-cyan` | Active states, primary emblems, and founder highlights |
| **Electric Blue Accent** | `#0ea5e9` / `bg-brand-blue` | Action buttons, investigation submit actions |
| **Defensive Emerald** | `#10b981` / `text-emerald-400` | Integrity pass, verified facts, 100% clean verdicts |
| **Amber Warning** | `#f59e0b` / `text-amber-400` | Security cautions, untrusted input alerts |
| **Crimson Danger** | `#ef4444` / `text-red-400` | Confirmed malicious IOCs, SSRF violations |

---

## 3. Typography & Wordmark Lockup

- **Primary Heading Typeface**: Inter / Geist Sans (Clean, high-legibility geometric sans-serif)
- **Technical & Hash Typeface**: JetBrains Mono / Geist Mono (Monospaced for SHA-256 digests and IP addresses)
- **Approved Primary Wordmark Lockup**:
  ```text
  XTRACY
  FOUNDED BY SAHIL MAISURIA (ELLIOT PXT)
  PHANTOMXTRACE (PXT)
  ```
