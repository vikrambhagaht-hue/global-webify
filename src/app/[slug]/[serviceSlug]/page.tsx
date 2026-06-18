import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { replaceLocation } from '@/lib/replaceLocation';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { ServicePageView } from '@/features/services/components/ServicePageView';
import { CITIES_MAP } from '@/features/services/constants/cities';
import { parseFaqs } from '@/features/services/utils/faq-parser';
import { getSubdomainContent } from '@/app/admin/(dashboard)/subdomains/actions';



interface Props {
  params: { slug: string; serviceSlug: string };
}

export async function generateStaticParams() {
  return [];
}

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cityKey = params.slug.toLowerCase();
  const cityInfo = CITIES_MAP[cityKey];
  if (!cityInfo) return {};

  const raw = params.serviceSlug;
  const slugsToTry = [raw, `/${raw}`];
  try {
    const page = await db.servicePage.findFirst({
      where: { slug: { in: slugsToTry }, isActive: true }
    });
    if (!page) return {};
    const loc = cityInfo.name;

    // Check Subdomain override
    const subContent = await getSubdomainContent(raw);
    if (subContent) {
      return {
        title: replaceLocation(subContent.seoTitle || page.seoTitle || page.title || '', loc),
        description: replaceLocation(subContent.seoDescription || page.seoDescription || '', loc),
        keywords: page.seoKeywords ? page.seoKeywords.split(',').map(k => replaceLocation(k, loc).trim()) : undefined,
        alternates: {
          canonical: `/${cityKey}/${raw.startsWith('/') ? raw.slice(1) : raw}`
        }
      };
    }

    const title = replaceLocation(page.seoTitle || page.title || '', loc);
    const desc = replaceLocation(page.seoDescription || '', loc);
    return {
      title: title,
      description: desc,
      keywords: page.seoKeywords ? page.seoKeywords.split(',').map(k => replaceLocation(k, loc).trim()) : undefined,
      alternates: {
        canonical: `/${cityKey}/${raw.startsWith('/') ? raw.slice(1) : raw}`
      }
    };
  } catch (error: any) { 
    if (error && error.digest === 'DYNAMIC_SERVER_USAGE') throw error;
    return {}; 
  }
}

export default async function CityServicePage({ params }: Props) {
  const cityKey = params.slug.toLowerCase();
  const cityInfo = CITIES_MAP[cityKey];
  if (!cityInfo) notFound();

  const locationName = cityInfo.name;
  const raw = params.serviceSlug;
  const slugsToTry = [raw, `/${raw}`];

  let rawPage = await db.servicePage.findFirst({
    where: { slug: { in: slugsToTry }, isActive: true }
  });

  if (!rawPage) {
    const knownCategories = ['seo-services', 'ai-seo-services', 'social-media-marketing', 'ppc-services'];
    if (knownCategories.includes(raw)) {
      const formattedTitle = raw.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      rawPage = {
        id: 0,
        slug: raw,
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
        updatedAt: new Date(),
      } as any;
    } else {
      return notFound();
    }
  }

  if (!rawPage) return notFound();

  // Apply Subdomain Content Override
  const subContent = await getSubdomainContent(raw);
  if (subContent) {
    if (subContent.title) rawPage.contentTitle = subContent.title;
    if (subContent.heroTitle) rawPage.title = subContent.heroTitle;
    if (subContent.seoTitle) rawPage.seoTitle = subContent.seoTitle;
    if (subContent.seoDescription) rawPage.seoDescription = subContent.seoDescription;
    if (subContent.heroDescription) rawPage.heroDescription = subContent.heroDescription;
    if (subContent.content) rawPage.content = subContent.content;
  }

  const { faqs, cleanedContent } = parseFaqs(rawPage.content ?? '', locationName);

  const page = {
    id:              rawPage.id,  
    slug:            rawPage.slug,
    title:           replaceLocation(rawPage.title            ?? '', locationName),
    contentTitle:    replaceLocation(rawPage.contentTitle     ?? '', locationName),
    seoTitle:        replaceLocation(rawPage.seoTitle         ?? '', locationName),
    seoDescription:  replaceLocation(rawPage.seoDescription   ?? '', locationName),
    seoKeywords:     rawPage.seoKeywords ?? '',
    heroDescription: replaceLocation(rawPage.heroDescription  ?? '', locationName),
    content:         replaceLocation(cleanedContent, locationName),
    category:        rawPage.category   ?? 'website',
    image:           rawPage.image      ?? '',
    isActive:        rawPage.isActive,
    createdAt:       rawPage.createdAt,
    updatedAt:       rawPage.updatedAt,
    bgType:          rawPage.bgType     ?? 'image',
    bgColor:         rawPage.bgColor,
    bgGradientStart: rawPage.bgGradientStart,
    bgGradientEnd:   rawPage.bgGradientEnd,
    mobileImage:     rawPage.mobileImage,
    bgImage:         rawPage.bgImage,
  };

  const rawRemainingSubMenus = await db.servicePage.findMany({
    where: { category: page.category, isActive: true, id: { not: page.id } },
    select: { title: true, slug: true, seoDescription: true, heroDescription: true, content: true, image: true, id: true },
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

  let filteredRawSubMenus = rawRemainingSubMenus;
  if (seoSlugs.includes(currentCleanSlug)) {
    filteredRawSubMenus = rawRemainingSubMenus.filter(m => {
      const ms = m.slug.startsWith('/') ? m.slug.substring(1) : m.slug;
      return !aiSeoSlugs.includes(ms);
    });
  } else if (aiSeoSlugs.includes(currentCleanSlug)) {
    filteredRawSubMenus = rawRemainingSubMenus.filter(m => {
      const ms = m.slug.startsWith('/') ? m.slug.substring(1) : m.slug;
      return !seoSlugs.includes(ms);
    });
  }

  const subMenuSlugs = filteredRawSubMenus.map(m => {
    const clean = m.slug.startsWith('/') ? m.slug.substring(1) : m.slug;
    return clean;
  });

  const subMenuOverrides = await db.subdomainContent.findMany({
    where: { pageType: { in: subMenuSlugs } }
  });

  const remainingSubMenus = filteredRawSubMenus.map(m => {
    const cleanSlug = m.slug.startsWith('/') ? m.slug.substring(1) : m.slug;
    const override = subMenuOverrides.find(o => o.pageType === cleanSlug);

    let title = m.title;
    let heroDescription = m.heroDescription;
    let seoDescription = m.seoDescription;
    let content = m.content;

    if (override) {
      if (override.heroTitle || override.title) {
        title = override.heroTitle || override.title || m.title;
      }
      if (override.heroDescription || override.seoDescription || override.content) {
        heroDescription = override.heroDescription || null;
        seoDescription = override.seoDescription || null;
        content = override.content || "";
      }
    }

    return {
      ...m,
      title: replaceLocation(title ?? '', locationName),
      heroDescription: replaceLocation(heroDescription ?? '', locationName),
      seoDescription: replaceLocation(seoDescription ?? '', locationName),
      content: replaceLocation(content ?? '', locationName),
    };
  });

  return (
    <>
      <ServicePageView 
        page={page} 
        remainingSubMenus={remainingSubMenus as any} 
        faqs={faqs} 
        locationName={locationName} 
        cityKey={cityKey} 
      />
      

    </>
  );
}
