import React from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/sections/Hero';
import { db } from '@/lib/db';
import { getHomepageFaqs, getHeroTexts, getAboutSeo, getCityHeroSettings, getHomepageHeroDesc, getHomepageAboutCard, getSectionHeaders } from '@/app/admin/(dashboard)/homepage/actions';
import { getSubdomainHomepageFaqs, getSubdomainHomepageHeroDesc, getSubdomainAboutSeo, getSubdomainHomepageAboutCard, getSubdomainSectionHeaders } from '@/app/admin/(dashboard)/subdomains/homepage/actions';

const ServicesGrid = dynamic(() => import('@/components/sections/ServicesGrid'), { ssr: true });
const Portfolio = dynamic(() => import('@/components/sections/Portfolio'), { ssr: true });
const TechStack = dynamic(() => import('@/components/sections/TechStack'), { ssr: true });
const LatestBlog = dynamic(() => import('@/components/sections/LatestBlog'), { ssr: true });
const ResultsSection = dynamic(() => import('@/components/sections/ResultsSection'), { ssr: true });
const AboutSEO = dynamic(() => import('@/components/sections/AboutSEO'), { ssr: true });
const TrustSection = dynamic(() => import('@/components/sections/TrustSection'), { ssr: true });
const FAQSection = dynamic(() => import('@/components/sections/FAQSection').then(mod => mod.FAQSection), { ssr: true });

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
  
  let result = text.replace(spanRegex, loc).replace(rawRegex, loc);
  if (loc && loc.toLowerCase() !== 'ranchi') {
    result = result.replace(/ranchi,\s*jharkhand/gi, loc);
    result = result.replace(/ranchi\s*\(\s*jharkhand\s*\)/gi, loc);
    result = result.replace(/ranchi\s+jharkhand/gi, loc);
    result = result.replace(/ranchi/gi, loc);
  }
  return result;
}

export default async function HomeView({ city, cityKey, location, subdomainContent, isMobile }: { city?: string; cityKey?: string; location?: string; subdomainContent?: any; isMobile?: boolean } = {}) {
  let dbPosts: any[] = [];
  let serviceDescriptions: Record<string, string> = {};
  let reviews: any[] = [];
  let featuredProjects: any[] = [];

  // Fix 2: Fire both DB queries in parallel instead of sequentially
  try {
    const [rawPosts, services, dbReviews, subdomainOverrides, fetchedFeaturedProjects] = await Promise.all([
      db.blogPost.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 4
      }),
      db.servicePage.findMany({
        where: { isActive: true },
        select: { slug: true, heroDescription: true }
      }),
      db.review.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
      }),
      db.subdomainContent.findMany({}),
      db.portfolioItem.findMany({
        where: { isActive: true, isFeatured: true },
        orderBy: [
          { order: 'asc' },
          { createdAt: 'desc' }
        ]
      })
    ]);

    dbPosts = rawPosts;
    reviews = dbReviews;
    featuredProjects = fetchedFeaturedProjects;
    services.forEach(s => {
      const key = s.slug.startsWith('/') ? s.slug.substring(1) : s.slug;
      let desc = s.heroDescription || "";
      
      // Look for subdomain-specific overrides for this service only if on a subdomain/city page
      if (location || city || subdomainContent) {
        const override = subdomainOverrides.find(o => o.pageType === key);
        if (override && override.heroDescription) {
          desc = override.heroDescription;
        }
      }

      if (desc) {
        serviceDescriptions[key] = desc;
      }
    });
  } catch (e) {
    console.error("Could not fetch blog posts, service descriptions, or reviews:", e);
  }

  let homepageFaqs: any[] = [];
  let heroTexts: string[] = [];
  let homepageHeroTitle = "";
  let homepageHeroDesc = "";
  let aboutSeoData = null;
  let aboutCard: any = null;
  let sectionHeaders: any = null;

  if (location || subdomainContent) {
    try {
      // Parallelize subdomain queries
      const [faqs, heroData, seo, card, headers] = await Promise.all([
        getSubdomainHomepageFaqs(),
        getSubdomainHomepageHeroDesc(),
        getSubdomainAboutSeo(),
        getSubdomainHomepageAboutCard(),
        getSubdomainSectionHeaders()
      ]);
      homepageFaqs = faqs;
      homepageHeroTitle = heroData.title;
      homepageHeroDesc = heroData.description;
      aboutSeoData = seo;
      aboutCard = card;
      sectionHeaders = headers;
    } catch (e) {
      console.error("Could not fetch subdomain homepage settings:", e);
    }
  } else {
    try {
      // Parallelize global homepage queries
      const [faqs, texts, heroDesc, seo, card, headers] = await Promise.all([
        getHomepageFaqs(),
        getHeroTexts(),
        getHomepageHeroDesc(),
        getAboutSeo(),
        getHomepageAboutCard(),
        getSectionHeaders()
      ]);
      homepageFaqs = faqs;
      heroTexts = texts;
      homepageHeroDesc = heroDesc;
      aboutSeoData = seo;
      aboutCard = card;
      sectionHeaders = headers;
    } catch (e) {
      console.error("Could not fetch global homepage settings:", e);
    }
  }

  // Load and process location for descriptions for ServicesGrid from database

  // Apply Location Replacements
  const locationName = location || city || "";

  // Always run location replacement so that {location} tags are resolved (or cleaned up/removed if locationName is empty)
  homepageHeroTitle = replaceLocation(homepageHeroTitle, locationName);
  homepageHeroDesc = replaceLocation(homepageHeroDesc, locationName);
  
  if (aboutSeoData) {
    aboutSeoData = {
      title: replaceLocation(aboutSeoData.title, locationName),
      subtitle: replaceLocation(aboutSeoData.subtitle, locationName),
      content: replaceLocation(aboutSeoData.content, locationName)
    };
  }
  
  if (aboutCard) {
    aboutCard = {
      ...aboutCard,
      title: replaceLocation(aboutCard.title, locationName),
      content: replaceLocation(aboutCard.content, locationName)
    };
  }

  if (sectionHeaders) {
    for (const key of Object.keys(sectionHeaders)) {
      if (sectionHeaders[key]) {
        sectionHeaders[key].title = replaceLocation(sectionHeaders[key].title, locationName);
        sectionHeaders[key].description = replaceLocation(sectionHeaders[key].description, locationName);
      }
    }
  }

  // Apply location replacement to FAQs
  if (homepageFaqs && homepageFaqs.length > 0) {
    homepageFaqs = homepageFaqs.map((faq: any) => ({
      ...faq,
      question: replaceLocation(faq.question, locationName),
      answer: replaceLocation(faq.answer, locationName)
    }));
  }

  // Apply location replacement to service descriptions for the services grid
  Object.keys(serviceDescriptions).forEach(key => {
    serviceDescriptions[key] = replaceLocation(serviceDescriptions[key], locationName);
  });

  if (locationName) {
    // Overrides from subdomain content if needed
    if (subdomainContent?.title) {
      homepageHeroTitle = replaceLocation(subdomainContent.title, locationName);
    }
    if (subdomainContent?.heroDescription) {
      homepageHeroDesc = replaceLocation(subdomainContent.heroDescription, locationName);
    }
  }

  const processedPosts = dbPosts.map(p => ({
    ...p,
    title: replaceLocation(p.title, locationName),
    summary: replaceLocation(p.summary || '', locationName)
  }));

  return (
    <div className="bg-white overflow-hidden pb-12">

      {/* New Hero Section Component */}
      <Hero 
          city={locationName} 
          heroTexts={heroTexts} 
          homepageHeroTitle={homepageHeroTitle}
          homepageHeroDesc={homepageHeroDesc}
          isMobile={isMobile}
      />
      <div className="space-y-0">
        {/* New Services Grid Section */}
        <ServicesGrid cityKey={cityKey} dynamicDescriptions={serviceDescriptions} location={locationName} sectionTitle={sectionHeaders?.services?.title} sectionDesc={sectionHeaders?.services?.description} />

        <Portfolio projects={featuredProjects || []} sectionTitle={sectionHeaders?.portfolio?.title} sectionDesc={sectionHeaders?.portfolio?.description} />

        <TechStack sectionTitle={sectionHeaders?.techStack?.title} sectionDesc={sectionHeaders?.techStack?.description} />

        {(!cityKey || subdomainContent) && <AboutSEO data={aboutSeoData} />}

        <ResultsSection cardData={aboutCard} reviews={reviews} sectionTitle={sectionHeaders?.results?.title} sectionDesc={sectionHeaders?.results?.description} />

        <LatestBlog dbPosts={processedPosts} sectionTitle={sectionHeaders?.latestBlog?.title} sectionDesc={sectionHeaders?.latestBlog?.description} />

        <TrustSection sectionTitle={sectionHeaders?.trust?.title} sectionDesc={sectionHeaders?.trust?.description} />
        {homepageFaqs.length > 0 && <FAQSection faqs={homepageFaqs} sectionTitle={sectionHeaders?.faq?.title} sectionDesc={sectionHeaders?.faq?.description} />}
      </div>

    </div>
  );
}
