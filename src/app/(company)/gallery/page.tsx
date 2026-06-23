import { Metadata } from 'next';
import GalleryClient from '@/features/company/components/GalleryClient';

export const metadata: Metadata = {
  title: 'Our Gallery | GlobalWebify',
  description: 'Explore our collection of work, events, and behind-the-scenes moments that showcase our creativity and dedication to excellence.',
  keywords: ['Web Design Gallery', 'GlobalWebify Events', 'Company Culture', 'Office Gallery', 'GlobalWebify Portfolio'],
  alternates: {
    canonical: '/gallery'
  }
};

export default function GalleryPage() {
  return <GalleryClient />;
}
