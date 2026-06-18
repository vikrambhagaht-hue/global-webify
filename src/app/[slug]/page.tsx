import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { replaceLocation } from '@/lib/replaceLocation';
import { ServicePageView } from '@/features/services/components/ServicePageView';
import { CityLandingView } from '@/features/services/components/CityLandingView';
import { parseFaqs } from '@/features/services/utils/faq-parser';
import { getCitySeo } from '@/app/admin/(dashboard)/homepage/actions';
import { CITIES_MAP } from '@/features/services/constants/cities';
import { getSubdomainLocation } from '@/lib/subdomain';
import { getSubdomainContent } from '@/app/admin/(dashboard)/subdomains/actions';
import PartnershipClient from '@/features/company/components/PartnershipClient';



interface Props {
  params: { slug: string };
}

// ---------- Static params ----------
export async function generateStaticParams() {
  return [];
}

export const revalidate = 3600;

// ---------- Metadata ----------
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const rawSlug = params?.slug || '';
  const cleanSlug = rawSlug.startsWith('/') ? rawSlug.slice(1) : rawSlug;
  
  // Dynamic Partnership Metadata check
  try {
    const allSettings = await db.siteSetting.findMany();
    const settingsMap = allSettings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
    const partnershipSlug = settingsMap['partnershipPageSlug'] || 'partnership';
    const cleanPartnerSlug = partnershipSlug.startsWith('/') ? partnershipSlug.slice(1) : partnershipSlug;

    if (cleanSlug.toLowerCase() === cleanPartnerSlug.toLowerCase()) {
      return {
        title: settingsMap['partnershipPageTitle'] || 'Partner Network | GlobalWeblify',
        description: settingsMap['partnershipHeroDesc'] || 'Join the GlobalWeblify Partner Network.',
        keywords: ['GlobalWeblify Partnerships', 'Agency Partnership Program'],
        alternates: {
          canonical: `/${cleanSlug}`
        }
      };
    }
  } catch (error: any) {
    if (error && error.digest === 'DYNAMIC_SERVER_USAGE') throw error;
  }

  // City landing page metadata
  const cityInfo = rawSlug ? CITIES_MAP[rawSlug.toLowerCase()] : null;
  if (cityInfo) {
    const locationName = cityInfo.name;
    const subContent = await getSubdomainContent('homepage');
    if (subContent) {
      return {
        title: replaceLocation(subContent.seoTitle || '', locationName) || `Best Web Development & Digital Marketing Services in ${locationName} | GlobalWeblify`,
        description: replaceLocation(subContent.seoDescription || '', locationName),
        keywords: `Web Development ${locationName}, SEO ${locationName}, Digital Marketing ${locationName}`,
        alternates: {
          canonical: `/${cleanSlug}`
        }
      };
    }

    try {
      const citySeo = await getCitySeo(rawSlug.toLowerCase());
      return {
        title: citySeo.title,
        description: citySeo.description,
        keywords: citySeo.keywords,
        alternates: {
          canonical: `/${cleanSlug}`
        }
      };
    } catch (error: any) {
      if (error && error.digest === 'DYNAMIC_SERVER_USAGE') throw error;
      console.error("Failed to load city SEO metadata:", error);
      return {
        title: `Best Web Development & Digital Marketing Services in ${locationName} | GlobalWeblify`,
        description: `Explore GlobalWeblify's professional web development, SEO, digital marketing, and branding services in ${locationName}. Custom solutions tailored to your local market.`,
        alternates: {
          canonical: `/${cleanSlug}`
        }
      };
    }
  }

  // Service page metadata (Fallback for non-city pages)
  try {
    const slugsToTry = [rawSlug, `/${rawSlug}`];
    const page = await db.servicePage.findFirst({
      where: { slug: { in: slugsToTry }, isActive: true }
    });
    if (!page) return {};

    const locationName = "";
    const title = replaceLocation(page.seoTitle || page.title || '', locationName);
    const description = replaceLocation(page.seoDescription || '', locationName);
    return {
      title: title,
      description: description,
      keywords: page.seoKeywords ? page.seoKeywords.split(',').map(k => k.trim()) : undefined,
      alternates: {
        canonical: `/${cleanSlug}`
      }
    };
  } catch (error: any) { 
    if (error && error.digest === 'DYNAMIC_SERVER_USAGE') throw error;
    return {}; 
  }
}

// ---------- Page component ----------
export default async function DynamicPage({ params }: Props) {
  const rawSlug = params?.slug || '';

  // ===== DYNAMIC PARTNERSHIP PAGE =====
  let partnershipSlug = 'partnership';
  let partnershipSettings: Record<string, string> = {};
  try {
    const allSettings = await db.siteSetting.findMany();
    partnershipSettings = allSettings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
    
    partnershipSlug = partnershipSettings['partnershipPageSlug'] || 'partnership';
  } catch (e) {
    console.error("Failed to load partnership settings:", e);
  }

  const cleanSlug = rawSlug.startsWith('/') ? rawSlug.slice(1) : rawSlug;
  const cleanPartnerSlug = partnershipSlug.startsWith('/') ? partnershipSlug.slice(1) : partnershipSlug;

  if (cleanSlug.toLowerCase() === cleanPartnerSlug.toLowerCase()) {
    const settings = {
      partnershipPageTitle: partnershipSettings['partnershipPageTitle'],
      partnershipPageSlug: partnershipSettings['partnershipPageSlug'],
      partnershipHeroTitle: partnershipSettings['partnershipHeroTitle'],
      partnershipHeroDesc: partnershipSettings['partnershipHeroDesc'],
      partnershipHeading: partnershipSettings['partnershipHeading'],
      partnershipDesc: partnershipSettings['partnershipDesc'],
      partnershipPageImage: partnershipSettings['partnershipPageImage'],
      partnershipExpandHeading: partnershipSettings['partnershipExpandHeading'],
      partnershipExpandParagraph: partnershipSettings['partnershipExpandParagraph']
    };
    return <PartnershipClient settings={settings} />;
  }

  // ===== CITY LANDING PAGE =====
  const cityInfo = rawSlug ? CITIES_MAP[rawSlug.toLowerCase()] : null;
  if (cityInfo) {
    const subContent = await getSubdomainContent('homepage');
    return <CityLandingView cityKey={rawSlug.toLowerCase()} cityInfo={cityInfo} subdomainContent={subContent || undefined} />;
  }

  // ===== SERVICE PAGE =====
  const slugsToTry = [rawSlug, `/${rawSlug}`];

  let fetchedPage = await db.servicePage.findFirst({
    where: { slug: { in: slugsToTry }, isActive: true }
  });

  if (!fetchedPage) {
    const knownCategories = ['seo-services', 'ai-seo-services', 'social-media-marketing', 'ppc-services'];
    
    if (knownCategories.includes(rawSlug)) {
      const formattedTitle = rawSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      fetchedPage = {
        id: Math.floor(Math.random() * 1000000),
        slug: rawSlug,
        title: formattedTitle,
        contentTitle: formattedTitle,
        seoTitle: `Best ${formattedTitle} | GlobalWebify`,
        seoDescription: `Explore our professional ${formattedTitle} to grow your business online.`,
        seoKeywords: formattedTitle.toLowerCase(),
        heroDescription: `Expert ${formattedTitle} tailored to drive traffic, leads, and sales for your business.`,
        content: `<h2>Welcome to our ${formattedTitle}</h2><p>We provide industry-leading solutions to help you dominate your market. Contact us today to learn how our experts can accelerate your growth.</p>`,
        category: 'marketing',
        image: '/web-dev-banner-bg.png',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      } as any;
    } else {
      return notFound();
    }
  }

  if (!fetchedPage) return notFound();

  const locationName = "";
  const { faqs, cleanedContent } = parseFaqs(fetchedPage.content ?? '', locationName);

  const page = {
    id:              fetchedPage.id,
    slug:            fetchedPage.slug,
    title:           replaceLocation(fetchedPage.title            ?? '', locationName),
    contentTitle:    replaceLocation(fetchedPage.contentTitle     ?? '', locationName),
    seoTitle:        replaceLocation(fetchedPage.seoTitle         ?? '', locationName),
    seoDescription:  replaceLocation(fetchedPage.seoDescription   ?? '', locationName),
    seoKeywords:     fetchedPage.seoKeywords ?? '',
    heroDescription: replaceLocation(fetchedPage.heroDescription  ?? '', locationName),
    content:         replaceLocation(cleanedContent, locationName),
    category:        fetchedPage.category   ?? 'website',
    image:           fetchedPage.image      ?? '',
    isActive:        fetchedPage.isActive,
    createdAt:       fetchedPage.createdAt,
    updatedAt:       fetchedPage.updatedAt,
    bgType:          fetchedPage.bgType     ?? 'image',
    bgColor:         fetchedPage.bgColor,
    bgGradientStart: fetchedPage.bgGradientStart,
    bgGradientEnd:   fetchedPage.bgGradientEnd,
    mobileImage:     fetchedPage.mobileImage,
    bgImage:         fetchedPage.bgImage,
  };

  const rawRemainingSubMenus = await db.servicePage.findMany({
    where: { category: page.category, isActive: true, id: { not: page.id } },
    select: { title: true, slug: true, seoDescription: true, heroDescription: true, content: true, image: true },
    orderBy: { createdAt: 'desc' }
  });

  const currentCleanSlug = page.slug.startsWith('/') ? page.slug.substring(1) : page.slug;

  const seoSlugs = [
    'seo-services',
    'on-page-seo',
    'off-page-seo',
    'technical-seo',
    'local-seo',
    'gmb-seo'
  ];

  const aiSeoSlugs = [
    'ai-seo-services',
    'generative-engine-optimization-services',
    'answer-engine-optimization-services',
    'perplexity-ai-seo-services',
    'chatgpt-ai-seo-services',
    'gemini-ai-seo-services',
    'claude-ai-seo-services',
    'agentic-ai-seo-services',
    'ai-powered-content-creation-services'
  ];

  let remainingSubMenus = rawRemainingSubMenus;
  if (seoSlugs.includes(currentCleanSlug)) {
    remainingSubMenus = rawRemainingSubMenus.filter(m => {
      const ms = m.slug.startsWith('/') ? m.slug.substring(1) : m.slug;
      return !aiSeoSlugs.includes(ms);
    });
  } else if (aiSeoSlugs.includes(currentCleanSlug)) {
    remainingSubMenus = rawRemainingSubMenus.filter(m => {
      const ms = m.slug.startsWith('/') ? m.slug.substring(1) : m.slug;
      return !seoSlugs.includes(ms);
    });
  }

  return (
    <ServicePageView 
      page={page} 
      remainingSubMenus={remainingSubMenus} 
      faqs={faqs} 
      locationName={locationName} 
      cityKey="" 
    />
  );
}
