import { Metadata } from 'next';
import PortfolioClient from '@/features/company/components/PortfolioClient';

import { db } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Web Development & Web Designing Portfolio | Global Webify',
  description: 'Explore Global Webify’s portfolio showcasing expert Web Development and Web Designing projects. Discover innovative, responsive, and result-driven digital solutions tailored for business growth.',
  keywords: ['Web Designing Portfolio', 'Web Development Portfolio', 'Global Webify Portfolio', 'Global Webify Work Portfolio', 'Web Designing Case Studies'],
  alternates: {
    canonical: '/portfolio'
  }
};

export const dynamic = 'force-dynamic';

export default async function PortfolioPage() {
  let projects = await db.portfolioItem.findMany({
    where: { 
      isActive: true
    },
    orderBy: { createdAt: 'desc' }
  });

  // Custom sort: treat 0 as 9999 so default items go to the bottom
  projects.sort((a, b) => {
    const orderA = a.order === 0 ? 9999 : a.order;
    const orderB = b.order === 0 ? 9999 : b.order;
    if (orderA !== orderB) return orderA - orderB;
    return 0; // If they have the same order, maintain the createdAt desc order from the DB
  });

  return <PortfolioClient projects={projects} />;
}
