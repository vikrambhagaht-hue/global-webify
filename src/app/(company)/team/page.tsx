import { Metadata } from 'next';
import TeamClient from '@/features/company/components/TeamClient';

export const metadata: Metadata = {
  title: 'Meet Global Webify Team Members',
  description: 'Meet the passionate team behind Global Webify – experts in web design, website development, SEO, and digital marketing. Our talented professionals combine creativity, innovation, and technical skills to deliver world-class digital solutions.',
  keywords: ['Global Webify', 'Global Webify Team Members', 'Global Webify in Ranchi', 'Digital Agency Team'],
  alternates: {
    canonical: '/team'
  }
};

export default function TeamPage() {
  return <TeamClient />;
}
