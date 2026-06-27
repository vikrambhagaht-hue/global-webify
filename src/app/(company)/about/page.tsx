import { Metadata } from 'next';
import AboutClient from '@/features/company/components/AboutClient';

export const metadata: Metadata = {
  title: 'Top 5 Best Web Development Company in Ranchi | About Global Webify',
  description: 'Global Webify is recognized as a Top 5 Best Web Development Company in Ranchi, delivering innovative digital solutions. Learn more about our journey and expertise today!',
  keywords: ['Best Web Development Company in Ranchi', 'Top 5 Web Development Company in Ranchi', 'Website Designer in Ranchi', 'About Global Webify'],
  alternates: {
    canonical: '/about'
  }
};

export default function AboutPage() {
  return <AboutClient />;
}
