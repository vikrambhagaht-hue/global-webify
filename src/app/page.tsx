import React from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import HomeView from '@/features/home/components/HomeView';
import { getHomepageSeo } from '@/app/admin/(dashboard)/homepage/actions';
import { getSubdomainLocation } from '@/lib/subdomain';
import { getSubdomainContent } from '@/app/admin/(dashboard)/subdomains/actions';
import { replaceLocation } from '@/lib/replaceLocation';
import CanonicalTag from '@/components/seo/CanonicalTag';



export async function generateMetadata(): Promise<Metadata> {
  const defaultTitle = "GlobalWeblify | Web Development & Digital Marketing Agency";
  const defaultDesc = "Leading Web Development, SEO, and Digital Marketing Agency in India. We build AI-powered solutions for your business growth.";
  const defaultKeywords = "Web Development, SEO, Digital Marketing, AI Solutions, GlobalWeblify";
  const defaultLogo = "https://globalwebify.com/global_webify_logo.png";

  try {
    const host = headers().get('host');
    const location = getSubdomainLocation(host);
    
    if (location) {
      const subContent = await getSubdomainContent('homepage');
      if (subContent) {
        const title = replaceLocation(subContent.seoTitle || '', location) || `GlobalWeblify ${location}`;
        const description = replaceLocation(subContent.seoDescription || '', location);
        return {
          title,
          description,
          keywords: `Web Development ${location}, SEO ${location}, Digital Marketing ${location}`,
          openGraph: {
            title,
            description,
            url: `https://${host}`,
            siteName: 'GlobalWeblify',
            images: [{ url: defaultLogo, width: 1200, height: 630, alt: 'GlobalWeblify Logo' }],
            locale: 'en_US',
            type: 'website',
          },
          twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [defaultLogo],
          }
        };
      }
    }

    const seo = await getHomepageSeo();
    const title = seo.title || defaultTitle;
    const description = seo.description || defaultDesc;
    return {
      title,
      description,
      keywords: seo.keywords || defaultKeywords,
      openGraph: {
        title,
        description,
        url: 'https://globalwebify.com',
        siteName: 'GlobalWeblify',
        images: [{ url: defaultLogo, width: 1200, height: 630, alt: 'GlobalWeblify Logo' }],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [defaultLogo],
      }
    };
  } catch (error: any) {
    if (error && error.digest === 'DYNAMIC_SERVER_USAGE') {
      throw error;
    }
    
    // Fallback for other errors during generation
    return {
      title: defaultTitle,
      description: defaultDesc,
      keywords: defaultKeywords,
      openGraph: {
        title: defaultTitle,
        description: defaultDesc,
        url: 'https://globalwebify.com',
        siteName: 'GlobalWeblify',
        images: [{ url: defaultLogo, width: 1200, height: 630, alt: 'GlobalWeblify Logo' }],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: defaultTitle,
        description: defaultDesc,
        images: [defaultLogo],
      }
    };
  }
}

export default async function Home() {
  const host = headers().get('host');
  const userAgent = headers().get('user-agent') || '';
  const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent);
  const location = getSubdomainLocation(host);
  let subContent = null;

  if (location) {
    subContent = await getSubdomainContent('homepage');
  }

  return (
    <main>
      <HomeView location={location || undefined} subdomainContent={subContent || undefined} isMobile={isMobile} />
      <CanonicalTag path="/" />
    </main>
  );
}
