import React from 'react';
import { Metadata } from 'next';
import { FounderSection } from '@/components/founder/FounderSection';

export const metadata: Metadata = {
  title: 'Founder & Creator of XTRACY | Elliot PXT sec26',
  description:
    'Official founder profile of Elliot PXT sec26, Founder of PhantomXTrace (PXT) and architect of the XTRACY defensive cybersecurity intelligence platform.',
  alternates: {
    canonical: 'https://xtracy.vercel.app/founder',
  },
  openGraph: {
    title: 'Elliot PXT sec26 — Founder of PhantomXTrace & Creator of XTRACY',
    description:
      'Official founder profile of Elliot PXT sec26. Founder of PhantomXTrace (PXT) and creator of XTRACY, an independent cybersecurity intelligence platform.',
    url: 'https://xtracy.vercel.app/founder',
    siteName: 'XTRACY Cybersecurity Intelligence Platform',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elliot PXT sec26 — Founder of PhantomXTrace',
    description:
      'Founder of PhantomXTrace (PXT) & Creator of XTRACY. Independent defensive cybersecurity intelligence platform.',
  },
};

export default function FounderPage() {
  return <FounderSection />;
}
