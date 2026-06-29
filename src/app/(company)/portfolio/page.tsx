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

export const revalidate = 60; // Revalidate every 60 seconds

export default async function PortfolioPage() {
  const projects = await db.portfolioItem.findMany({
    where: { 
      isActive: true,
      isFeatured: false 
    },
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' }
    ]
  });

  return <PortfolioClient projects={projects} />;
}
