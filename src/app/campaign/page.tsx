import { Metadata } from 'next';
import VideoShareClient from '@/features/company/components/VideoShareClient';

export const metadata: Metadata = {
  title: 'Special Offer | Global Webify',
  description: 'Premium Digital Solutions & Website Design Services',
};

export default function CampaignPage() {
  const adProject = {
    id: 9999,
    title: 'Grow Your Business with Global Webify',
    category: 'Campaign',
    image: '',
    desc: 'Special offer campaign video',
    link: '/ad-video.mp4',
    displayUrl: '',
    tags: '',
    order: 0
  };

  return (
    <VideoShareClient project={adProject} />
  );
}
