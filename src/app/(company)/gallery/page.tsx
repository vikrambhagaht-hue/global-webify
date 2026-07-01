import { Metadata } from 'next';
import GalleryClient from '@/features/company/components/GalleryClient';
import { db } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Inside Our Office | Team Gallery & Work Culture - Global Webify',
  description: 'Explore Global Webify’s Office & Team Gallery showcasing our creative workspace, talented team, and professional work culture. Discover how we build innovative digital solutions.',
  keywords: ['Global Webify Work Culture', 'Work Environment Showcase', 'Global Webify Creative Workspace', 'Global Webify Digital Agency'],
  alternates: {
    canonical: '/gallery'
  }
};

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const categories = await db.galleryCategory.findMany({
    orderBy: { order: 'asc' }
  });
  
  const items = await db.galleryItem.findMany({
    orderBy: [
      { isFeatured: 'desc' },
      { featureOrder: 'asc' },
      { createdAt: 'desc' }
    ],
    take: 24,
    include: { category: true }
  });

  return <GalleryClient initialCategories={categories} initialItems={items} />;
}
