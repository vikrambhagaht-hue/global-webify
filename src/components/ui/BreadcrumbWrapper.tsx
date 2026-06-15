import { db } from '@/lib/db';
import BreadcrumbClientWrapper from './BreadcrumbClientWrapper';
import { unstable_cache } from 'next/cache';

const getCachedDynamicPages = unstable_cache(
  async () => {
    try {
      const servicePages = await db.servicePage.findMany({
        select: { slug: true, title: true, category: true }
      });
      const blogPosts = await db.blogPost.findMany({
        select: { slug: true, title: true }
      });
      return [
        ...servicePages,
        ...blogPosts.map(p => ({
          slug: p.slug,
          title: p.title,
          category: 'blog'
        }))
      ];
    } catch (error) {
      console.error('Failed to fetch dynamic pages for breadcrumbs', error);
      return [];
    }
  },
  ['breadcrumb-dynamic-pages'],
  { revalidate: 60, tags: ['breadcrumb-dynamic-pages'] }
);

export default async function BreadcrumbWrapper() {
  const dynamicPages = await getCachedDynamicPages();
  return <BreadcrumbClientWrapper dynamicPages={dynamicPages} />;
}
