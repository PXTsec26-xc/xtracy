import type { Metadata, Viewport } from 'next';
import './globals.css';
import { EmergencyBanner } from '@/components/layout/EmergencyBanner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SafetyProfileModal } from '@/components/profile/SafetyProfileModal';
import { AuthModal } from '@/components/auth/AuthModal';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'XTRACY — Trace. Analyze. Protect. | Cyber Intelligence & Personal Safety',
  description:
    'Free public digital safety, cybersecurity intelligence, privacy awareness, emergency guidance, and women\'s safety platform.',
  manifest: '/manifest.json',
  applicationName: 'XTRACY',
  appleWebApp: {
    capable: true,
    title: 'XTRACY',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#070A12',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col justify-between cyber-bg-grid bg-darkBg text-gray-100 antialiased selection:bg-brand-blue selection:text-white">
        <EmergencyBanner />
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
          {children}
        </main>
        <SafetyProfileModal />
        <AuthModal />
        <Footer />

        {/* PWA Service Worker Registration */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('XTRACY ServiceWorker registered:', registration.scope);
                  },
                  function(err) {
                    console.log('XTRACY ServiceWorker registration failed:', err);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
