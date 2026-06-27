import { Metadata } from 'next';
import BookingClient from '@/features/company/components/BookingClient';

export const metadata: Metadata = {
  title: 'Book a Free Consultation | Web Development & Digital Marketing Experts - Global Webify',
  description: 'Book a free consultation with Global Webify and discuss your website development, SEO, digital marketing, and software solutions. Schedule your appointment today and take the first step toward growing your business online.',
  keywords: ['Web Development', 'SEO Services', 'Software Solutions', 'Web Designing Company']
};

export default function BookingPage() {
  return <BookingClient />;
}
