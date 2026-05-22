import React from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/sections/Hero';
import { db } from '@/lib/db';
import { FAQSection } from '@/components/sections/FAQSection';
import { getHomepageFaqs, getHeroTexts, getAboutSeo, getCityHeroSettings, getHomepageHeroDesc } from '@/app/admin/(dashboard)/homepage/actions';

const ServicesGrid = dynamic(() => import('@/components/sections/ServicesGrid'), {
  ssr: true,
  loading: () => <div className="min-h-[400px] animate-pulse bg-gray-50 rounded-3xl m-8" />
});

const Portfolio = dynamic(() => import('@/components/sections/Portfolio'), {
  ssr: true,
  loading: () => <div className="min-h-[600px] animate-pulse bg-green-50/30 rounded-3xl m-8" />
});

const TechStack = dynamic(() => import('@/components/sections/TechStack'), {
  ssr: true,
  loading: () => <div className="min-h-[300px] animate-pulse bg-gray-50 rounded-3xl m-8" />
});

const LatestBlog = dynamic(() => import('@/components/sections/LatestBlog'), {
  ssr: true,
  loading: () => <div className="min-h-[400px] animate-pulse bg-gray-50 rounded-3xl m-8" />
});

const ResultsSection = dynamic(() => import('@/components/sections/ResultsSection'), {
  ssr: true,
  loading: () => <div className="min-h-[600px] animate-pulse bg-gray-50 rounded-3xl m-8" />
});

const AboutSEO = dynamic(() => import('@/components/sections/AboutSEO'), {
  ssr: true
});

const TrustSection = dynamic(() => import('@/components/sections/TrustSection'), {
  ssr: true
});

function replaceLocation(text: string, loc: string = ""): string {
  if (!text) return '';
  const spanRegex = /<span class="location-tag"[^>]*>\{\s*location\s*\}<\/span>/gi;
  const rawRegex = /\{\s*location\s*\}/gi;
  
  if (!loc) {
    let cleaned = text.replace(spanRegex, '').replace(rawRegex, '');
    cleaned = cleaned.replace(/(?:in|at|for|from|within|near| -|-| ,|,| \/|\/)?\s*(?:<span class="location-tag"[^>]*>)?\{\s*location\s*\}(?:<\/span>)?\s*/gi, '');
    cleaned = cleaned.replace(/\s+/g, ' ').replace(/\s+([.,!?;:])/g, '$1');
    return cleaned.trim();
  }
  
  return text.replace(spanRegex, loc).replace(rawRegex, loc);
}

export default async function HomeView({ city, cityKey }: { city?: string; cityKey?: string } = {}) {
  let dbPosts: any[] = [];

  try {
    dbPosts = await db.blogPost.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 4
    });
  } catch (e) {
    console.error("Could not fetch blogs:", e);
  }

  let homepageFaqs = [];
  let heroTexts: string[] = [];
  try {
    homepageFaqs = await getHomepageFaqs();
  } catch (e) {
    console.error("Could not fetch FAQs:", e);
  }

  try {
    heroTexts = await getHeroTexts();
  } catch (e) {
    console.error("Could not fetch hero texts:", e);
  }

  let homepageHeroDesc = "";
  try {
    homepageHeroDesc = await getHomepageHeroDesc();
  } catch (e) {
    console.error("Could not fetch homepage hero description:", e);
  }

  let cityHeroSettings = null;
  if (cityKey) {
    try {
      cityHeroSettings = await getCityHeroSettings(cityKey);
    } catch (e) {
      console.error("Could not fetch city hero settings:", e);
    }
  }

  let aboutSeoData = null;
  try {
    aboutSeoData = await getAboutSeo();
  } catch (e) {
    console.error("Could not fetch AboutSEO data:", e);
  }

  // Fetch dynamic descriptions for ServicesGrid from database
  let serviceDescriptions: Record<string, string> = {};
  try {
    const services = await db.servicePage.findMany({
      where: { isActive: true },
      select: { slug: true, heroDescription: true }
    });
    services.forEach(s => {
      const key = s.slug.startsWith('/') ? s.slug.substring(1) : s.slug;
      if (s.heroDescription) {
        serviceDescriptions[key] = s.heroDescription;
      }
    });
  } catch (e) {
    console.error("Could not fetch service descriptions:", e);
  }

  const locationName = city || "";

  const processedPosts = dbPosts.map(p => ({
    ...p,
    title: replaceLocation(p.title, locationName),
    summary: replaceLocation(p.summary || '', locationName)
  }));

  return (
    <div className="bg-white overflow-hidden pb-12">
      
      {/* Background Wavy Pattern */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="waves" width="100" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 Q 25 0, 50 10 T 100 10" fill="none" stroke="#22c55e" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#waves)" />
        </svg>
      </div>

      {/* New Hero Section Component */}
      <Hero city={city} heroTexts={heroTexts} cityHeroSettings={cityHeroSettings} homepageHeroDesc={homepageHeroDesc} />

      <div className="space-y-0">
        {/* New Services Grid Section */}
        <ServicesGrid cityKey={cityKey} dynamicDescriptions={serviceDescriptions} />

        <Portfolio />

        <TechStack />

        <LatestBlog dbPosts={processedPosts} />

        <ResultsSection />

        {!cityKey && <AboutSEO data={aboutSeoData} />}
        <TrustSection />
        
        {homepageFaqs.length > 0 && <FAQSection faqs={homepageFaqs} />}
      </div>

    </div>
  );
}
