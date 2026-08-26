import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://xtracy.vercel.app';
  const lastModified = new Date();

  const routes = [
    '',
    '/about',
    '/founder',
    '/nexus',
    '/evidencepulse',
    '/verifier',
    '/scam-check',
    '/safe-vault',
    '/test-lab',
    '/dashboard',
    '/privacy-footprint',
    '/privacy-control',
    '/transparency',
    '/trust',
    '/security',
    '/accessibility',
    '/global-safety',
    '/tools',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
