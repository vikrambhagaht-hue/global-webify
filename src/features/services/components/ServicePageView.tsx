"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { ExpandableContent } from '@/components/ui/ExpandableContent';
import { CardIcon } from '@/components/ui/CardIcon';
import { FAQSection } from '@/components/sections/FAQSection';
import ServiceHero from '@/components/sections/ServiceHero';
import BlogContactForm from '@/components/forms/BlogContactForm';
import { stripHtml } from '@/lib/replaceLocation';
import { CATEGORY_CONFIG } from '../constants/categories';
import { INDUSTRIES_LIST } from '../constants/industries';
import { FAQItem } from '../utils/faq-parser';
import { useContactInfo } from '@/lib/ContactContext';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import {
  WEBSITE_SERVICES,
  HOSTING_SERVICES,
  SEO_SERVICES,
  MARKETING_SERVICES,
  BRANDING_SERVICES,
  CRM_SERVICES
} from '@/constants/navigation';

function getStaticMenuName(slug: string): string | null {
  const cleanSlug = slug.startsWith('/') ? slug : `/${slug}`;
  
  const allServices = [
    ...WEBSITE_SERVICES,
    ...HOSTING_SERVICES,
    ...BRANDING_SERVICES,
    ...CRM_SERVICES,
    ...SEO_SERVICES,
    ...MARKETING_SERVICES
  ];

  const match = allServices.find(s => s.href.toLowerCase() === cleanSlug.toLowerCase());
  return match ? match.name : null;
}

function isMarketingService(slug: string): boolean {
  if (!slug) return false;
  const cleanSlug = slug.startsWith('/') ? slug : `/${slug}`;
  return MARKETING_SERVICES.some(service => {
    if (service.href === cleanSlug) return true;
    if (service.subLinks && service.subLinks.some(sub => sub.href === cleanSlug)) return true;
    return false;
  });
}

interface SubMenu {
  title: string;
  slug: string;
  seoDescription: string | null;
  heroDescription?: string | null;
  content: string | null;
  image: string | null;
}

interface ServicePageViewProps {
  page: any;
  remainingSubMenus: SubMenu[];
  faqs: FAQItem[];
  locationName?: string;
  cityKey?: string;
}

const DIGITAL_MARKETING_CLIENTS = [
  { src: 'BLPK Motion post.webp', alt: 'Babulal Premkumar', label: 'Babulal Premkumar', imgClass: 'h-20 md:h-36', blend: 'mix-blend-normal' },
  { src: 'FPS.webp', alt: 'Firayalal Public School', label: 'Firayalal Public School', imgClass: 'h-20 md:h-36', blend: 'mix-blend-normal' },
  { src: 'goldpecash.png', alt: 'Gold Pe Cash', label: 'Gold Pe Cash', imgClass: 'h-20 md:h-36', blend: 'mix-blend-normal rounded-xl' },
  { src: 'Spica Infra post.webp', alt: 'Spica Infra', label: 'Spica Infra', imgClass: 'h-20 md:h-36', blend: 'mix-blend-normal' },
  { src: 'acs .webp', alt: 'ACS', label: 'ACS', imgClass: 'h-20 md:h-36', blend: 'mix-blend-normal' },
  { src: 'vedika sawan standee.webp', alt: 'Vedika', label: 'Vedika', imgClass: 'h-[150px] md:h-[240px]', blend: 'mix-blend-normal' }
];

export function ServicePageView({ page, remainingSubMenus, faqs, locationName = "", cityKey }: ServicePageViewProps) {
  const contactInfo = useContactInfo();
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const desktopButtonRef = useRef<HTMLButtonElement>(null);
  const ICONS = ['Monitor', 'Smartphone', 'ShoppingCart', 'Layout', 'Palette', 'Settings', 'Code', 'Briefcase'];

  const getDesc = (m: SubMenu) => {
    if (m.heroDescription) return m.heroDescription;
    if (m.seoDescription) return m.seoDescription;
    if (m.content) return stripHtml(m.content);
    return 'Explore our professional services.';
  };

  const handleToggle = () => {
    if (isExpanded) {
      const cardItems = document.querySelectorAll('#services-grid .card-item');
      const targetIndex = window.innerWidth < 768 ? 5 : 7;
      const targetCard = cardItems[targetIndex] || cardItems[cardItems.length - 1];
      
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      setTimeout(() => {
        setIsExpanded(false);
        setTimeout(() => {
          const button = window.innerWidth < 768 ? mobileButtonRef.current : desktopButtonRef.current;
          if (button) {
            button.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 50);
      }, 400);
    } else {
      setIsExpanded(true);
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <ServiceHero 
        title={page.title || ""} 
        description={page.heroDescription || undefined}
        city={locationName || undefined}
        bgImage={page.bgImage || undefined}
        mobileImage={page.mobileImage || undefined}
        bgType={page.bgType}
        bgColor={page.bgColor}
        bgGradientStart={page.bgGradientStart}
        bgGradientEnd={page.bgGradientEnd}
      />

      {/* Intro Content */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-20 items-start">
            <div className="lg:col-span-3 min-w-0 font-jost">
              <h2 className="text-[22px] md:text-[24px] font-bold text-[#1a8b4c] text-left mb-6 tracking-tight leading-tight break-words font-lexend">
                {page.contentTitle || `Professional ${page.title}`}
              </h2>
              
              {page.content && page.content.trim() !== "" && stripHtml(page.content).trim() !== "" ? (
                <ExpandableContent htmlContent={page.content} maxHeight={300} />
              ) : (
                <div className="prose max-w-none text-gray-600 font-jost">
                  <p>We provide industry-leading {page.title} to help you dominate your market. Our expert team is dedicated to delivering visually stunning, high-performance solutions focused on driving more engagement and conversions.</p>
                  <p className="mt-4">Contact us today using the form to learn how we can accelerate your growth.</p>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-2 lg:sticky lg:top-[150px] min-w-0">
              <BlogContactForm />
            </div>
          </div>
        </div>
      </section>



      {/* Digital Marketing Clients */}
      {(page?.slug === 'digital-marketing' || page?.slug === '/digital-marketing') && (
        <section className="relative pt-6 pb-12 md:pt-8 md:pb-20 overflow-hidden bg-[#fafafa] border-y border-gray-100">
          {/* Premium Ambient Background Glows */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#1a8b4c]/[0.04] rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#0ea5e9]/[0.03] rounded-full blur-[120px] translate-y-1/2 pointer-events-none" />
          
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-[32px] font-black text-gray-900 mb-2 tracking-tight font-lexend">
              Brands That Trust Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a8b4c] to-[#10b981]">Digital Marketing</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 font-medium mb-8 max-w-[1200px] mx-auto whitespace-normal md:whitespace-nowrap overflow-hidden text-ellipsis">
              Join the growing list of industry leaders who have transformed their online presence and driven massive growth with our data-driven strategies.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-6 items-center justify-center w-full">
              {DIGITAL_MARKETING_CLIENTS.map((logo, i) => (
                <div key={logo.label} className="group relative flex flex-col items-center justify-center p-2 bg-gradient-to-br from-[#0a3622] to-[#062415] border border-[#1a8b4c]/20 rounded-2xl transition-all duration-500 hover:-translate-y-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_-10px_rgba(26,139,76,0.4)] hover:border-[#1a8b4c]/60 overflow-hidden h-[160px] md:h-[260px] w-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1a8b4c]/[0.15] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img 
                    src={`/digital-marketing-clients/${logo.src}`} 
                    alt={logo.alt} 
                    className={`relative z-10 w-auto object-contain transition-transform duration-700 transform-gpu will-change-transform group-hover:scale-105 ${logo.blend} ${logo.imgClass}`} 
                  />
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <span className="text-[11px] md:text-xs font-bold text-white bg-black/80 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.3)] whitespace-nowrap border border-gray-700">
                      {logo.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Services Grid */}
      <section id="services-grid" className="py-16 md:py-20 bg-slate-50 border-t border-gray-100 scroll-mt-[100px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-[36px] font-black text-gray-900 mb-4">
              {locationName ? (
                <>More Services in <span className="text-[#1a8b4c]">{locationName}</span></>
              ) : (
                <>Why Our Services <span className="text-[#1a8b4c]">Deliver Better Results</span></>
              )}
            </h2>
            <p className="text-sm md:text-base text-gray-500 font-medium">
              {locationName ? `Explore related services available in ${locationName}` : 'We Bring Life To The "Few Megabytes Of Virtual Space" You Own'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-[1200px] mx-auto">
            {remainingSubMenus.length > 0 ? (
              remainingSubMenus.map((menu, i) => {
                const categoryIcons = CATEGORY_CONFIG[page.category]?.icons || ICONS;
                const Icon = categoryIcons[i % categoryIcons.length];
                
                const CARD_THEMES = [
                  { bg: 'bg-[#1a8b4c]', hex: '#1a8b4c', textHex: '#14693a', cardBg: 'bg-green-50/70', border: 'border-green-200/80', hoverBorder: 'hover:border-[#1a8b4c]/60', mesh: 'bg-[#1a8b4c]/10' },
                  { bg: 'bg-[#0ea5e9]', hex: '#0ea5e9', textHex: '#0369a1', cardBg: 'bg-sky-50/70', border: 'border-sky-200/80', hoverBorder: 'hover:border-sky-500/60', mesh: 'bg-blue-500/10' },
                  { bg: 'bg-[#ec4899]', hex: '#ec4899', textHex: '#be185d', cardBg: 'bg-pink-50/70', border: 'border-pink-200/80', hoverBorder: 'hover:border-pink-500/60', mesh: 'bg-pink-500/10' },
                  { bg: 'bg-[#f59e0b]', hex: '#f59e0b', textHex: '#b45309', cardBg: 'bg-amber-50/70', border: 'border-amber-200/80', hoverBorder: 'hover:border-amber-500/60', mesh: 'bg-amber-500/10' },
                  { bg: 'bg-[#8b5cf6]', hex: '#8b5cf6', textHex: '#6d28d9', cardBg: 'bg-purple-50/70', border: 'border-purple-200/80', hoverBorder: 'hover:border-purple-500/60', mesh: 'bg-purple-500/10' },
                  { bg: 'bg-[#10b981]', hex: '#10b981', textHex: '#047857', cardBg: 'bg-emerald-50/70', border: 'border-emerald-200/80', hoverBorder: 'hover:border-emerald-500/60', mesh: 'bg-emerald-500/10' },
                ];
                const theme = CARD_THEMES[i % CARD_THEMES.length];
                const cleanSlug = menu.slug.startsWith('/') ? menu.slug.slice(1) : menu.slug;
                const linkHref = cityKey ? `/${cityKey}/${cleanSlug}` : `/${cleanSlug}`;
                const displayTitle = getStaticMenuName(menu.slug) || menu.title;
                
                const visibilityClass = isExpanded 
                  ? 'block' 
                  : (i < 6 ? 'block' : (i < 8 ? 'hidden md:block' : 'hidden'));
                
                return (
                  <Link href={linkHref} key={i} className={`card-item relative min-h-[260px] md:min-h-[320px] ${theme.cardBg} rounded-2xl border ${theme.border} transition-all duration-300 ease-out overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.12)] ${theme.hoverBorder} group ${visibilityClass} flex flex-col`}>
                    <div className="h-[3px] w-full rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${theme.hex}, ${theme.hex}88)` }} />
                    <div className={`absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-700 ${theme.mesh} blur-[50px] rounded-full`} />
                    <div className="relative z-20 flex-1 p-5 sm:p-6 md:p-7 flex flex-col items-center text-center">
                      <div className="relative mb-4 md:mb-5">
                        <div className={`absolute inset-0 rounded-xl blur-[8px] scale-110 opacity-10 group-hover:opacity-20 transition-opacity ${theme.bg}`} />
                        <div className={`relative w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-105 ${theme.bg}`}>
                          <CardIcon iconName={Icon} colorClass="!w-4 !h-4 md:!w-5 md:!h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col w-full">
                        <h3 className="text-[17px] md:text-[19px] font-bold font-lexend mb-2 leading-snug tracking-[-0.01em] group-hover:text-gray-950 transition-colors" style={{ color: "#064e3b" }}>
                          {displayTitle}
                        </h3>
                        <p className="text-gray-500 font-jost text-[13.5px] leading-relaxed mb-4 line-clamp-2 md:line-clamp-3 overflow-hidden text-ellipsis break-all">
                          {getDesc(menu)}
                        </p>
                      </div>
                      <div className="w-full mt-auto pt-4 border-t border-gray-100/80">
                        <span className="flex justify-center items-center gap-1.5 text-[12.5px] md:text-[13px] font-semibold font-jost tracking-wide group-hover:gap-2.5 transition-all duration-300" style={{ color: theme.textHex }}>
                          Explore Services
                          <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.2} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="text-gray-500 text-center col-span-full">No additional services found in this category.</p>
            )}
          </div>
          {/* Mobile toggle button (if more than 6 services) */}
          {remainingSubMenus.length > 6 && (
            <div className="mt-10 text-center md:hidden">
              <button
                ref={mobileButtonRef}
                onClick={handleToggle}
                className="inline-flex items-center justify-center bg-[#1a8b4c] hover:bg-green-700 text-white font-bold py-3.5 px-8 rounded-full shadow-md text-[14px] transition-all"
              >
                {isExpanded ? 'See Less Services' : 'See More Services'}
              </button>
            </div>
          )}
          {/* Desktop/Tablet toggle button (if more than 8 services) */}
          {remainingSubMenus.length > 8 && (
            <div className="mt-10 text-center hidden md:block">
              <button
                ref={desktopButtonRef}
                onClick={handleToggle}
                className="inline-flex items-center justify-center bg-[#1a8b4c] hover:bg-green-700 text-white font-bold py-3.5 px-8 rounded-full shadow-md text-[14px] transition-all"
              >
                {isExpanded ? 'See Less Services' : 'See More Services'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Industries */}
      <section 
        className="relative py-12 md:py-16 bg-[#f4fcf7] border-y border-emerald-50 font-lexend overflow-hidden"
        style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 600px' }}
      >
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#1a8b4c]/[0.03] via-transparent to-transparent pointer-events-none" />
        <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-[32px] font-black text-gray-900 mb-3">
            Industries We Work With {locationName ? `in ${locationName}` : ""}
          </h2>
          <p className="text-sm md:text-base text-gray-600 font-medium font-jost mb-12 max-w-[1200px] mx-auto whitespace-normal md:whitespace-nowrap overflow-hidden text-ellipsis">
            From emerging startups to established enterprises, we deliver tailored digital solutions that drive measurable growth and success across diverse {locationName ? `industries in ${locationName}` : "industry sectors"}.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 max-w-[1200px] mx-auto">
            {INDUSTRIES_LIST.map((ind, idx) => {
              const IconComp = ind.icon;
              return (
                <div key={idx} className={`group flex flex-col items-center justify-center p-3 sm:p-5 bg-white rounded-2xl border shadow-[0_4px_15px_-4px_rgba(0,0,0,0.03)] transition-all duration-400 hover:-translate-y-2 ${ind.bgClass} ${ind.borderClass} ${ind.shadowClass} hover:shadow-xl`}>
                  <IconComp className={`w-8 h-8 sm:w-10 sm:h-10 ${ind.color} mb-2 sm:mb-3 stroke-[1.5] transition-transform duration-500 group-hover:scale-110`} />
                  <p className={`text-[11px] sm:text-[13px] font-bold text-gray-800 text-center leading-tight transition-colors duration-300 group-hover:${ind.color}`}>
                    {ind.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 800px' }}>
          <FAQSection faqs={faqs} />
        </div>
      )}

      {/* Floating WhatsApp Icon rendered via Portal with GPU Hardware Acceleration for zero lag */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <a
          href={getWhatsAppUrl(contactInfo?.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          title="Chat on WhatsApp - Global Webify"
          aria-label="Chat on WhatsApp"
          className="fixed bottom-[78px] md:bottom-8 right-4 md:right-8 z-[999999] bg-[#25D366] hover:bg-[#1DA851] text-white p-3.5 md:px-5 md:py-3.5 rounded-full shadow-lg shadow-[#25D366]/30 flex items-center justify-center gap-2.5 transform-gpu transition-all duration-200 hover:scale-105 active:scale-95 border-2 border-white will-change-transform group"
        >
          <MessageCircle className="w-6 h-6 md:w-5 md:h-5 fill-current stroke-none shrink-0 transition-transform group-hover:rotate-12" />
          <span className="hidden md:inline font-bold text-[14px] tracking-wide whitespace-nowrap">
            Chat with us
          </span>
          <span className="md:hidden sr-only">Chat on WhatsApp</span>
        </a>,
        document.body
      )}
    </div>
  );
}
