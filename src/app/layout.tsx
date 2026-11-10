import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/auth/AuthModal';
import { GlobalSafetyBar } from '@/components/layout/GlobalSafetyBar';
import { SkipToContent } from '@/components/layout/SkipToContent';
import { AccessibilityAnnouncer } from '@/components/layout/AccessibilityAnnouncer';

export const metadata: Metadata = {
  metadataBase: new URL('https://xtracy.vercel.app'),
  title: {
    default: 'XTRACY — Independent Cybersecurity Intelligence Platform',
    template: '%s | XTRACY',
  },
  description:
    'Executive defensive cybersecurity platform founded by Elliot PXT sec26 (Founder of PhantomXTrace). Deterministic URL analysis, DNS intelligence, cryptographic evidence continuity, and local privacy vaults.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-32x32.png',
    apple: '/icon-192.png',
  },
  verification: {
    google: 'google8e7a6e34132ffca2',
  },
  authors: [
    { name: 'Elliot PXT sec26', url: 'https://xtracy.vercel.app/founder' },
  ],
  creator: 'Elliot PXT sec26',
  publisher: 'PhantomXTrace (PXT)',
  alternates: {
    canonical: 'https://xtracy.vercel.app',
  },
  openGraph: {
    title: 'XTRACY — Independent Cybersecurity Intelligence Platform',
    description:
      'Executive defensive cybersecurity platform founded by Elliot PXT sec26. Developed under the PhantomXTrace (PXT) identity.',
    url: 'https://xtracy.vercel.app',
    siteName: 'XTRACY',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'XTRACY — Independent Cybersecurity Intelligence Platform',
    description:
      'Defensive cybersecurity intelligence, deterministic threat analysis, and cryptographic evidence continuity. Founded by Elliot PXT sec26.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://xtracy.vercel.app/#organization',
        name: 'XTRACY',
        alternateName: 'PhantomXTrace',
        url: 'https://xtracy.vercel.app',
        founder: {
          '@type': 'Person',
          '@id': 'https://xtracy.vercel.app/founder#person',
          name: 'Elliot PXT sec26',
          alternateName: 'Founder of PhantomXTrace (PXT)',
          jobTitle: 'Founder of PhantomXTrace (PXT) & Creator of XTRACY',
          url: 'https://xtracy.vercel.app/founder',
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://xtracy.vercel.app/#website',
        url: 'https://xtracy.vercel.app',
        name: 'XTRACY Cybersecurity Intelligence Platform',
        publisher: {
          '@id': 'https://xtracy.vercel.app/#organization',
        },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'XTRACY',
        operatingSystem: 'Any (Web-based)',
        applicationCategory: 'SecurityApplication',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        author: {
          '@id': 'https://xtracy.vercel.app/founder#person',
        },
      },
    ],
  };

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
      </head>
      <body className="font-sans min-h-screen bg-darkBg text-gray-100 flex flex-col selection:bg-brand-cyan/30 selection:text-brand-cyan">
        {/* Keyboard Accessibility Skip Link */}
        <SkipToContent />

        {/* Screen Reader ARIA Live Announcer */}
        <AccessibilityAnnouncer />

        {/* Global Safety Bar */}
        <GlobalSafetyBar />

        {/* Global Header Navigation */}
        <Navbar />

        {/* Guest Authentication Modal */}
        <AuthModal />

        {/* Main Content Area */}
        <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
          {children}
        </main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
