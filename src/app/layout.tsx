import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/auth/AuthModal';
import { GlobalSafetyBar } from '@/components/layout/GlobalSafetyBar';
import { SkipToContent } from '@/components/layout/SkipToContent';
import { AccessibilityAnnouncer } from '@/components/layout/AccessibilityAnnouncer';

export const metadata: Metadata = {
  title: 'XTRACY — ANALYZE. UNDERSTAND. RESPOND.',
  description:
    'Understand suspicious digital activity with privacy-focused cybersecurity analysis, global safety resources, and AI-guided recommendations.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
