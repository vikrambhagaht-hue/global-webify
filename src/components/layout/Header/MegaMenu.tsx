"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  WEBSITE_SERVICES,
  CRM_SERVICES,
  SEO_SERVICES,
  HOSTING_SERVICES,
  MARKETING_SERVICES,
  BRANDING_SERVICES,
  COMPANY_LINKS
} from '@/constants/navigation';

interface MegaMenuProps {
  onClose: () => void;
  activeMenu: string | null;
  currentMenuId: string;
  currentCity: string | null;
}

const getPrefixedHref = (href: string, menuId: string, currentCity: string | null) => {
  if (!currentCity) return href;
  if (menuId === 'company' || href === '/contact' || href.startsWith('http') || href === '#') {
    return href;
  }
  return `/${currentCity}${href.startsWith('/') ? href : `/${href}`}`;
};

const menuData: Record<string, any[]> = {
  website: WEBSITE_SERVICES,
  crm: CRM_SERVICES,
  seo: SEO_SERVICES,
  hosting: HOSTING_SERVICES,
  marketing: MARKETING_SERVICES,
  branding: BRANDING_SERVICES,
  company: COMPANY_LINKS,
};

const promoLabels: Record<string, { title: string; sub: string }> = {
  website:   { title: 'Need a Website?',    sub: 'Get a stunning website built for growth.' },
  crm:       { title: 'Need CRM Solutions?', sub: 'Boost efficiency with custom software.' },
  seo:       { title: 'Drive Organic Traffic', sub: 'Dominate search rankings with expert SEO.' },
  hosting:   { title: 'Need Hosting?',       sub: 'Fast, secure & reliable hosting.' },
  marketing: { title: 'Grow Your Business', sub: 'Drive more leads with digital marketing.' },
  branding:  { title: 'Build Your Brand',    sub: 'Create a brand identity that stands out.' },
  company:   { title: 'About GlobalWebify', sub: 'Learn who we are and what we do.' },
};

function chunkArray<T>(arr: T[], cols: number): T[][] {
  const size = Math.ceil(arr.length / cols);
  return Array.from({ length: cols }, (_, i) => arr.slice(i * size, i * size + size));
}

export const MegaMenu = ({ onClose, activeMenu, currentMenuId, currentCity }: MegaMenuProps) => {
  const isVisible = activeMenu === currentMenuId;
  const currentData = currentMenuId ? menuData[currentMenuId] : null;
  const promo = currentMenuId
    ? (promoLabels[currentMenuId] ?? { title: 'Get Started', sub: 'Talk to our team today.' })
    : promoLabels['website'];
  
  const cols = currentData ? chunkArray(currentData, 3) : [[], [], []];

  return (
    <div
      onMouseLeave={() => {}}
      className={`absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.15)] z-[9999] ${
        isVisible 
          ? 'opacity-100 pointer-events-auto visible' 
          : 'opacity-0 pointer-events-none invisible'
      }`}
    >
      <div className="flex max-w-[1800px] mx-auto bg-white">

        {/* LEFT: image promo block with local nav-promo image */}
        <div className="w-[240px] lg:w-[290px] xl:w-[340px] shrink-0 relative overflow-hidden" style={{ minHeight: '300px' }}>
          <Image
            src="/nav-promo.png"
            alt="Promo Background - Global Webify"
            title="Promo Background - Global Webify"
            fill
            sizes="(max-width: 1024px) 240px, (max-width: 1280px) 290px, 340px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/5 z-0" />
          <div className="absolute bottom-6 left-6 right-6 p-4 flex flex-col gap-2 bg-white/85 backdrop-blur-md border border-white/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] z-10">
            <p className="text-[16px] font-bold text-gray-900 leading-snug">{promo.title}</p>
            <p className="text-[12px] text-gray-600 leading-relaxed font-medium">{promo.sub}</p>
            <Link
              href="/contact"
              title="Contact Us - Global Webify"
              onClick={onClose}
              className="mt-1 block text-center bg-[#1a8b4c] text-white text-[13px] font-semibold py-2 rounded-xl hover:bg-[#15703d] transition-colors shadow-sm"
            >
              Contact Us →
            </Link>
          </div>
        </div>

        <div className="w-px bg-gray-200 self-stretch" />

        {/* RIGHT: Unified 3-column grid for ALL menus */}
        <div className="flex-1 flex py-6 relative bg-white">
          {cols.map((col: any[], cIdx: number) => (
            <React.Fragment key={cIdx}>
              {cIdx > 0 && <div className="w-px bg-gray-200 self-stretch" />}
              <div className="flex-1 flex flex-col px-8 gap-2.5 relative">
                {col.map((item: any) => {
                  const hasSubLinks = item.subLinks && item.subLinks.length > 0;

                  return (
                    <div
                      key={item.name}
                      className="relative group/submenu"
                    >
                      {/* Service Category Link */}
                      <Link
                        href={getPrefixedHref(item.href, currentMenuId, currentCity)}
                        title={`${item.name} - Global Webify`}
                        onClick={onClose}
                        prefetch={true}
                        className={`flex items-center justify-between text-[14px] px-3 py-2 rounded-xl transition-colors duration-75 ${
                          hasSubLinks 
                            ? 'font-bold text-[#1a8b4c] hover:bg-[#1a8b4c]/10' 
                            : 'font-medium text-gray-800 hover:text-white hover:bg-[#1a8b4c]'
                        }`}
                      >
                        <span>{item.name}</span>
                      </Link>

                      {/* Sub-links displayed inline below */}
                      {hasSubLinks && (
                        <div className="flex flex-col gap-0.5 mt-1 mb-2 ml-4 pl-3.5 border-l border-gray-150">
                          {item.subLinks.map((sub: any) => (
                            <Link
                              key={sub.name}
                              href={getPrefixedHref(sub.href, currentMenuId, currentCity)}
                              title={`${sub.name} - Global Webify`}
                              onClick={onClose}
                              prefetch={true}
                              className="text-[13px] text-gray-650 hover:text-white hover:bg-[#1a8b4c] px-2.5 py-1.5 rounded-lg transition-colors duration-75 block font-medium"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
