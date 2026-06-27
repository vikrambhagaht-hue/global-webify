import { Metadata } from 'next';
import GalleryClient from '@/features/company/components/GalleryClient';

export const metadata: Metadata = {
  title: 'Inside Our Office | Team Gallery & Work Culture - Global Webify',
  description: 'Explore Global Webify’s Office & Team Gallery showcasing our creative workspace, talented team, and professional work culture. Discover how we build innovative digital solutions.',
  keywords: ['Global Webify Work Culture', 'Work Environment Showcase', 'Global Webify Creative Workspace', 'Global Webify Digital Agency'],
  alternates: {
    canonical: '/gallery'
  }
};

export default function GalleryPage() {
  return <GalleryClient />;
}
