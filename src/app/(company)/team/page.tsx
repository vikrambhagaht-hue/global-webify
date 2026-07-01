import { Metadata } from 'next';
import TeamClient from '@/features/company/components/TeamClient';
import { getLiveTeamMembers } from '@/app/admin/(dashboard)/team/actions';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Meet Our Team | Global Webify – Experts in Web & Digital Solutions',
  description: 'Meet the expert team at Global Webify, skilled in web development, SEO, and digital marketing. We deliver innovative solutions for your business growth.',
  keywords: ['Skilled Web Developers', 'SEO Professionals', 'Global Webify Digital Agency Experts', 'Global Webify Team'],
  alternates: {
    canonical: '/team'
  }
};

export default async function TeamPage() {
  const members = await getLiveTeamMembers();
  return <TeamClient initialMembers={members} />;
}
