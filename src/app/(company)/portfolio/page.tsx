import { Metadata } from 'next';
import PortfolioClient from '@/features/company/components/PortfolioClient';

export const metadata: Metadata = {
  title: 'Our Portfolio | GlobalWebify',
  description: 'A showcase of our best work across various industries. See how we bring visions to life through code, design, and SEO strategy.',
  keywords: ['Web Design Portfolio', 'SEO Case Studies', 'Digital Agency Work', 'GlobalWebify Projects'],
  alternates: {
    canonical: '/portfolio'
  }
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
