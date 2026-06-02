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

export const revalidate = 3600; // Cache page and revalidate at most every hour or on-demand

interface Props {
  params: { slug: string; serviceSlug: string };
}

export async function generateStaticParams() {
  try {
    const pages = await db.servicePage.findMany({
      where: { isActive: true },
      select: { slug: true }
    });
    const params: { slug: string; serviceSlug: string }[] = [];
    Object.keys(CITIES_MAP).forEach((city) => {
      pages.forEach((page) => {
        const clean = page.slug.startsWith('/') ? page.slug.slice(1) : page.slug;
        params.push({ slug: city, serviceSlug: clean });
      });
    });
    return params;
  } catch { return []; }
}

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
    const title = replaceLocation(page.seoTitle || page.title || '', loc);
    const desc = replaceLocation(page.seoDescription || '', loc);
    return {
      title: title,
      description: desc,
      keywords: page.seoKeywords ? page.seoKeywords.split(',').map(k => replaceLocation(k, loc).trim()) : undefined,
    };
  } catch { return {}; }
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
  };

  const remainingSubMenus = await db.servicePage.findMany({
    where: { category: page.category, isActive: true, id: { not: page.id } },
    select: { title: true, slug: true, seoDescription: true, heroDescription: true, content: true, image: true },
    orderBy: { createdAt: 'desc' }
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
      
      {/* Back to city landing */}
      <section className="py-5 bg-[#f8fbfa] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Link href={`/${cityKey}`} className="inline-flex items-center gap-2 text-[#1a8b4c] font-black text-xs uppercase tracking-wider hover:gap-3 transition-all">
            <MapPin size={14} /> View All Services in {locationName}
          </Link>
        </div>
      </section>
    </>
  );
}
