import { Metadata } from 'next';
import ContactClient from '@/features/company/components/ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us for Web Development, SEO & CRM Solutions | Global Web Designing Services',
  description: 'Contact Global Webify for expert Web Development, Web Designing, SEO Services, and CRM Solutions. Let’s grow your business—get in touch today!',
  keywords: ['Web Development Services', 'Web Designing Services', 'Contact Global Webify', 'Contact Us for Web Development'],
  alternates: {
    canonical: '/contact'
  }
};

export default function ContactPage() {
  return <ContactClient />;
}
