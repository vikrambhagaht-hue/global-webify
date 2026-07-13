import { Metadata } from 'next';
import { db } from '@/lib/db';
import VideoShareClient from '@/features/company/components/VideoShareClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const project = await db.portfolioItem.findUnique({
      where: { id: parseInt(params.id, 10) }
    });

    if (!project) return { title: 'Video Not Found' };

    const title = project.title ? `Global Webify - ${project.title}` : 'Global Webify — Premium Digital Solutions';
    const description = 'Watch our latest portfolio video and book a free consultation with our experts!';
    
    // Cloudinary automatically generates thumbnails if you replace .mp4 with .jpg
    let ogImage = project.thumbnail || project.image || '';
    if (ogImage && ogImage.endsWith('.mp4')) {
      ogImage = ogImage.replace(/\.mp4$/i, '.jpg');
    }

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: ogImage }],
        type: 'video.other',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      }
    };
  } catch (error) {
    return { title: 'Global Webify' };
  }
}

export default async function VideoSharePage({ params }: { params: { id: string } }) {
  const project = await db.portfolioItem.findUnique({
    where: { id: parseInt(params.id, 10) }
  });

  if (!project) {
    notFound();
  }

  // Passing the project data to a client component for interactive video playing
  return <VideoShareClient project={project} />;
}
