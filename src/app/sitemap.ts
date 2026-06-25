import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { CITIES_MAP } from '@/features/services/constants/cities';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.globalwebify.com';

const staticRoutes = [
  "",
  "contact",
  "about",
  "portfolio",
  "team",
  "gallery",
  "market-area",
  "blog",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static Routes
  const staticSitemap = staticRoutes.map(route => ({
    url: `${BASE_URL}${route ? `/${route}` : ''}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. Dynamic Service Pages from Database
  let serviceSitemap: any[] = [];
  try {
    const services = await db.servicePage.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      take: 10000
    });
    serviceSitemap = services.map(s => {
      const cleanSlug = s.slug.startsWith('/') ? s.slug.slice(1) : s.slug;
      return {
        url: `${BASE_URL}/${cleanSlug}`,
        lastModified: s.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    });
  } catch (e) {
    console.error("Sitemap failed to fetch service pages:", e);
  }

  // 3. Dynamic City Landing Pages (e.g. /delhi, /ranchi, /kolkata)
  const cityKeys = Object.keys(CITIES_MAP);
  const citySitemap = cityKeys.map(cityKey => ({
    url: `${BASE_URL}/${cityKey}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // 4. Dynamic Blog Posts from Database
  let blogSitemap: any[] = [];
  try {
    const blogs = await db.blogPost.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      take: 10000
    });
    blogSitemap = blogs.map(b => {
      const cleanSlug = b.slug.replace(/^\/?(blog\/)?/, '');
      return {
        url: `${BASE_URL}/blog/${cleanSlug}`,
        lastModified: b.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      };
    });
  } catch (e) {
    console.error("Sitemap failed to fetch blog posts:", e);
  }

  // 5. Dynamic City Service combinations (e.g., /[city]/[serviceSlug])
  let cityServiceSitemap: any[] = [];
  if (cityKeys.length > 0 && serviceSitemap.length > 0) {
    cityKeys.forEach(cityKey => {
      serviceSitemap.forEach(service => {
        const pathParts = service.url.split('/');
        const serviceSlug = pathParts[pathParts.length - 1];
        cityServiceSitemap.push({
          url: `${BASE_URL}/${cityKey}/${serviceSlug}`,
          lastModified: service.lastModified,
          changeFrequency: 'weekly' as const,
          priority: 0.5,
        });
      });
    });
  }

  return [
    ...staticSitemap,
    ...serviceSitemap,
    ...citySitemap,
    ...blogSitemap,
    ...cityServiceSitemap
  ];
}
