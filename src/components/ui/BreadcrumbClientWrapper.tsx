"use client";

import { usePathname } from 'next/navigation';
import { Breadcrumbs } from './Breadcrumbs';
import { CITIES_MAP } from '@/features/services/constants/cities';

export default function BreadcrumbClientWrapper({ dynamicPages = [] }: { dynamicPages?: any[] }) {
  const pathname = usePathname();

  // Do not render breadcrumbs on the home page or city home pages
  const citySlugs = Object.keys(CITIES_MAP);
  const segments = pathname.split('/').filter(Boolean);
  const isCityHome = segments.length === 1 && citySlugs.includes(segments[0].toLowerCase());

  if (pathname === '/' || pathname === '' || isCityHome) return null;

  // Dynamically set background color to match the page client's background
  let bgColorClass = 'bg-white';
  if (pathname === '/contact') {
    bgColorClass = 'bg-[#f4fbf7]';
  }

  return (
    <div className={`relative z-30 container-custom pt-[85px] md:pt-[95px] lg:pt-[135px] pb-1 px-4 sm:px-6 ${bgColorClass}`}>
      <Breadcrumbs pathname={pathname} dynamicPages={dynamicPages} />
    </div>
  );
}
