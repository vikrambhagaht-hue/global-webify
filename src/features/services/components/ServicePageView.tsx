import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ExpandableContent } from '@/components/ui/ExpandableContent';
import { CardIcon } from '@/components/ui/CardIcon';
import { FAQSection } from '@/components/sections/FAQSection';
import ServiceHero from '@/components/sections/ServiceHero';
import BlogContactForm from '@/components/forms/BlogContactForm';
import { stripHtml } from '@/lib/replaceLocation';
import { CATEGORY_CONFIG } from '../constants/categories';
import { INDUSTRIES_LIST } from '../constants/industries';
import { FAQItem } from '../utils/faq-parser';

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

export function ServicePageView({ page, remainingSubMenus, faqs, locationName = "", cityKey }: ServicePageViewProps) {
  const ICONS = ['Monitor', 'Smartphone', 'ShoppingCart', 'Layout', 'Palette', 'Settings', 'Code', 'Briefcase'];

  const getDesc = (m: SubMenu) => {
    if (m.heroDescription) return m.heroDescription;
    if (m.seoDescription) return m.seoDescription;
    if (m.content) return stripHtml(m.content);
    return 'Explore our professional services.';
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <ServiceHero 
        title={page.title || ""} 
        description={page.heroDescription || undefined}
        city={locationName || undefined}
      />

      {/* Intro Content */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-20 items-start">
            <div className="lg:col-span-3 min-w-0 font-jost">
              <h2 className="text-[25px] font-black text-[#22c55e] text-left mb-6 tracking-tight leading-tight break-words font-lexend underline underline-offset-8 decoration-[#22c55e]">
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
            
            <div className="lg:col-span-2 sticky top-[150px] min-w-0">
              <BlogContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Related Services Grid */}
      <section id="services-grid" className="py-10 bg-white border-t border-gray-100 scroll-mt-[100px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-[32px] font-black text-gray-900 mb-3">
              {locationName ? `More Services in ${locationName}` : "Why Our Services Deliver Better Results"}
            </h2>
            <p className="text-sm md:text-base text-gray-600 font-medium">
              {locationName ? `Explore related services available in ${locationName}` : 'We Bring Life To The "Few Megabytes Of Virtual Space" You Own'}
            </p>
          </div>
          <input type="checkbox" id="show-more-cards" className="peer hidden" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-[1200px] mx-auto peer-checked:[&_.card-item]:!block">
            {remainingSubMenus.length > 0 ? (
              remainingSubMenus.map((menu, i) => {
                const categoryIcons = CATEGORY_CONFIG[page.category]?.icons || ICONS;
                const Icon = categoryIcons[i % categoryIcons.length];
                
                const CARD_THEMES = [
                  { bg: 'bg-[#1a8b4c]', hex: '#1a8b4c', border: 'border-green-100', hoverBorder: 'hover:border-[#1a8b4c]', mesh: 'bg-[#1a8b4c]/10' },
                  { bg: 'bg-[#0ea5e9]', hex: '#0ea5e9', border: 'border-blue-100', hoverBorder: 'hover:border-blue-500', mesh: 'bg-blue-500/10' },
                  { bg: 'bg-[#ec4899]', hex: '#ec4899', border: 'border-pink-100', hoverBorder: 'hover:border-pink-500', mesh: 'bg-pink-500/10' },
                  { bg: 'bg-[#f59e0b]', hex: '#f59e0b', border: 'border-amber-100', hoverBorder: 'hover:border-amber-500', mesh: 'bg-amber-500/10' },
                  { bg: 'bg-[#8b5cf6]', hex: '#8b5cf6', border: 'border-purple-100', hoverBorder: 'hover:border-purple-500', mesh: 'bg-purple-500/10' },
                  { bg: 'bg-[#10b981]', hex: '#10b981', border: 'border-emerald-100', hoverBorder: 'hover:border-emerald-500', mesh: 'bg-emerald-500/10' },
                ];
                const theme = CARD_THEMES[i % CARD_THEMES.length];
                const cleanSlug = menu.slug.startsWith('/') ? menu.slug.slice(1) : menu.slug;
                const linkHref = cityKey ? `/${cityKey}/${cleanSlug}` : `/${cleanSlug}`;
                const displayTitle = menu.title;
                
                return (
                  <Link href={linkHref} key={i} className={`card-item relative min-h-[260px] md:min-h-[320px] bg-white rounded-2xl border border-gray-200/80 transition-all duration-300 ease-out overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.08)] ${theme.hoverBorder} group ${i >= 6 ? 'hidden md:block' : 'block'} flex flex-col`}>
                    <div className="h-[3px] w-full rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${theme.hex}, ${theme.hex}88)` }} />
                    <div className={`absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-700 ${theme.mesh} blur-[50px] rounded-full`} />
                    <div className="relative z-20 flex-1 p-5 sm:p-6 md:p-7 flex flex-col items-start text-left">
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
                        <span className="flex items-center gap-1.5 text-[12.5px] md:text-[13px] font-semibold font-jost tracking-wide group-hover:gap-2.5 transition-all duration-300" style={{ color: theme.hex }}>
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
          {remainingSubMenus.length > 6 && (
            <div className="mt-10 text-center md:hidden peer-checked:[&_label_.see-more]:hidden peer-checked:[&_label_.see-less]:block">
              <label htmlFor="show-more-cards" className="cursor-pointer inline-flex items-center justify-center bg-[#1a8b4c] hover:bg-green-700 text-white font-bold py-3.5 px-8 rounded-full shadow-md text-[14px] transition-all">
                <span className="see-more block">See More Services</span>
                <span className="see-less hidden">See Less Services</span>
              </label>
            </div>
          )}
        </div>
      </section>

      {faqs.length > 0 && <FAQSection faqs={faqs} />}

      {/* Industries */}
      <section className="py-10 bg-white border-t border-gray-100 font-lexend">
        <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-[32px] font-black text-gray-900 mb-12">
            Industries We Work With {locationName ? `in ${locationName}` : ""}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 max-w-[1200px] mx-auto">
            {INDUSTRIES_LIST.map((ind, idx) => {
              const IconComp = ind.icon;
              return (
                <div key={idx} className="flex flex-col items-center justify-center p-3 sm:p-5 bg-gray-50/50 hover:bg-[#f4fbf8]/50 rounded-2xl border border-gray-100/80 transition-all duration-200 hover:-translate-y-0.5">
                  <IconComp className={`w-8 h-8 sm:w-10 sm:h-10 ${ind.color} mb-2 sm:mb-3 stroke-[1.5]`} />
                  <p className="text-[11px] sm:text-[13px] font-bold text-gray-800 text-center leading-tight">
                    {ind.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
