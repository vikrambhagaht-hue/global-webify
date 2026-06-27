import { Metadata } from 'next';
import TeamClient from '@/features/company/components/TeamClient';

export const metadata: Metadata = {
  title: 'Meet Our Team | Global Webify – Experts in Web & Digital Solutions',
  description: 'Meet the expert team at Global Webify, skilled in web development, SEO, and digital marketing. We deliver innovative solutions for your business growth.',
  keywords: ['Skilled Web Developers', 'SEO Professionals', 'Global Webify Digital Agency Experts', 'Global Webify Team'],
  alternates: {
    canonical: '/team'
  }
};

export default function TeamPage() {
  return <TeamClient />;
}
