import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { replaceLocation } from '@/lib/replaceLocation';
import { ServicePageView } from '@/features/services/components/ServicePageView';
import { CityLandingView } from '@/features/services/components/CityLandingView';
import { CITIES_MAP } from '@/features/services/constants/cities';
import { parseFaqs } from '@/features/services/utils/faq-parser';

export const revalidate = 3600; // Cache page and revalidate at most every hour or on-demand

interface Props {
  params: { slug: string };
}

// ---------- Static params ----------
export async function generateStaticParams() {
  try {
    const pages = await db.servicePage.findMany({
      where: { isActive: true },
      select: { slug: true }
    });
    const serviceParams = pages.map((page) => ({
      slug: page.slug.startsWith('/') ? page.slug.slice(1) : page.slug,
    }));
    const cityParams = Object.keys(CITIES_MAP).map((city) => ({ slug: city }));
    return [...serviceParams, ...cityParams];
  } catch (error) {
    return [];
  }
}

// ---------- Metadata ----------
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const rawSlug = params?.slug || '';

  // City landing page metadata
  const cityInfo = rawSlug ? CITIES_MAP[rawSlug.toLowerCase()] : null;
  if (cityInfo) {
    return {
      title: `Best Web Development & Digital Marketing Services in ${cityInfo.name} | GlobalWebify`,
      description: `Explore GlobalWebify's professional web development, SEO, digital marketing, and branding services in ${cityInfo.name}. Custom solutions tailored to your local market.`,
    };
  }

  // Service page metadata
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
    };
  } catch { return {}; }
}

// ---------- Page component ----------
export default async function DynamicPage({ params }: Props) {
  const rawSlug = params?.slug || '';

  // ===== CITY LANDING PAGE =====
  const cityInfo = rawSlug ? CITIES_MAP[rawSlug.toLowerCase()] : null;
  if (cityInfo) {
    return <CityLandingView cityKey={rawSlug.toLowerCase()} cityInfo={cityInfo} />;
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
  };

  const remainingSubMenus = await db.servicePage.findMany({
    where: { category: page.category, isActive: true, id: { not: page.id } },
    select: { title: true, slug: true, seoDescription: true, heroDescription: true, content: true, image: true },
    orderBy: { createdAt: 'desc' }
  });

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
