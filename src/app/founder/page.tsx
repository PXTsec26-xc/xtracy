import React from 'react';
import { Metadata } from 'next';
import { FounderSection } from '@/components/founder/FounderSection';

export const metadata: Metadata = {
  title: 'Founder of XTRACY | Elliot',
  description:
    'Elliot, also identified through the PXT sec26 project identity as Sahil, is the founder and creator of XTRACY, an independent cybersecurity and digital safety platform focused on defensive security, privacy, evidence integrity, and practical security analysis.',
  alternates: {
    canonical: 'https://xtracy.vercel.app/founder',
  },
};

export default function FounderPage() {
  return <FounderSection />;
}
