'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
  LayoutDashboard, Layers, Newspaper, MessageSquare, Home, Briefcase, Handshake, Shuffle, Star, FileText, Image as ImageIcon, LayoutGrid, Users
} from 'lucide-react';
import SidebarCategories from './SidebarCategories';

interface SidebarNavProps {
  initialActiveServiceCategory?: string;
}

export default function SidebarNav({ initialActiveServiceCategory }: SidebarNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const isOverview = pathname === '/admin';
  const isServices = pathname.startsWith('/admin/services');
  const isBlogs = pathname.startsWith('/admin/blogs');
  const isTeam = pathname.startsWith('/admin/team');
  const isCareers = pathname.startsWith('/admin/careers');
  const isContacts = pathname.startsWith('/admin/contacts');
  const isHomepage = (pathname === '/admin/homepage' || pathname.startsWith('/admin/homepage/')) && !pathname.startsWith('/admin/subdomains/homepage');
  const isSubdomainHomepage = pathname.startsWith('/admin/subdomains/homepage');
  const isPartnershipPage = pathname === '/admin/partnership';
  const isPartnershipSubmissions = pathname.startsWith('/admin/partnership-submissions');
  const isRedirects = pathname.startsWith('/admin/redirects');
  const isReviews = pathname.startsWith('/admin/reviews');
  const isPolicies = pathname.startsWith('/admin/policies');
  const isPortfolio = pathname.startsWith('/admin/portfolio');
  const isHomepagePortfolio = pathname.startsWith('/admin/homepage-portfolio');

  const [openHomepage, setOpenHomepage] = React.useState(isHomepage);
  const [openSubdomainHomepage, setOpenSubdomainHomepage] = React.useState(isSubdomainHomepage);
  const [openServices, setOpenServices] = React.useState(isServices);

  React.useEffect(() => {
    setOpenHomepage(isHomepage);
  }, [isHomepage]);

  React.useEffect(() => {
    setOpenSubdomainHomepage(isSubdomainHomepage);
  }, [isSubdomainHomepage]);

  React.useEffect(() => {
    setOpenServices(isServices);
  }, [isServices]);

  const linkClass = (isActive: boolean) =>
    `flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300 text-[11px] md:text-xs font-semibold tracking-wide border group/navlink ${
      isActive 
        ? 'bg-gradient-to-r from-[#1a8b4c] to-[#0e5e3b] text-white border-[#15703d] shadow-xl shadow-[#1a8b4c]/20' 
        : 'text-gray-400 hover:text-white hover:bg-[#132a1d]/60 border-transparent hover:border-[#132a1d] hover:shadow-lg backdrop-blur-sm'
    }`;

  const iconClass = (isActive: boolean) => 
    `stroke-[2.2] flex-shrink-0 transition-colors w-[22px] h-[22px] ${isActive ? 'text-white' : 'text-gray-500 group-hover/navlink:text-white'}`;

  return (
    <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
      
      {/* Overview Button */}
      <Link href="/admin" className={linkClass(isOverview)}>
        <LayoutDashboard className={iconClass(isOverview)} />
        <span>Overview</span>
      </Link>

      {/* Collapsible Homepage Settings Dropdown */}
      <details className="group/details" open={openHomepage} onToggle={(e: any) => setOpenHomepage(e.currentTarget.open)}>
        <summary className={`flex items-center justify-between gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300 text-[11px] md:text-xs font-semibold tracking-wide cursor-pointer list-none [&::-webkit-details-marker]:hidden border group/summary ${
          isHomepage 
            ? 'bg-gradient-to-r from-[#1a8b4c] to-[#0e5e3b] text-white border-[#15703d] shadow-xl shadow-[#1a8b4c]/20' 
            : 'text-gray-400 hover:text-white hover:bg-[#132a1d]/60 border-transparent hover:border-[#132a1d] hover:shadow-lg backdrop-blur-sm'
        }`}>
          <div className="flex items-center gap-2.5">
            <Home className={`stroke-[2.2] flex-shrink-0 transition-colors w-[22px] h-[22px] ${isHomepage ? 'text-white' : 'text-gray-500 group-hover/summary:text-white'}`} />
            <span>Homepage Settings</span>
          </div>
          <span className="text-[10px] group-open/details:rotate-90 transition-transform font-bold text-gray-500 group-hover/summary:text-white">▶</span>
        </summary>
        
        {/* Homepage Submenu */}
        <div className="mt-2.5 mx-2.5 p-2 rounded-2xl bg-[#06100b] border border-[#132a1d] flex flex-col gap-2 text-gray-400 shadow-inner">
          <div className="px-2 pb-1 border-b border-[#132a1d]/50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Subsections
          </div>
          <Link 
            href="/admin/homepage/hero" 
            className={`text-xs font-semibold tracking-wide block px-3.5 py-2.5 rounded-xl transition-all duration-300 border ${
              pathname === '/admin/homepage/hero'
                ? 'text-[#22c55e] bg-[#1a8b4c]/10 border-[#1a8b4c]/30 shadow-md font-bold'
                : 'text-gray-400 bg-transparent hover:bg-[#132a1d]/40 border-transparent hover:border-[#132a1d] hover:text-white'
            }`}
          >
            Hero Text
          </Link>
          <Link 
            href="/admin/homepage/about-seo" 
            className={`text-xs font-semibold tracking-wide block px-3.5 py-2.5 rounded-xl transition-all duration-300 border ${
              pathname === '/admin/homepage/about-seo'
                ? 'text-[#22c55e] bg-[#1a8b4c]/10 border-[#1a8b4c]/30 shadow-md font-bold'
                : 'text-gray-400 bg-transparent hover:bg-[#132a1d]/40 border-transparent hover:border-[#132a1d] hover:text-white'
            }`}
          >
            About SEO Settings
          </Link>
          <Link 
            href="/admin/homepage/growth-card" 
            className={`text-xs font-semibold tracking-wide block px-3.5 py-2.5 rounded-xl transition-all duration-300 border ${
              pathname === '/admin/homepage/growth-card'
                ? 'text-[#22c55e] bg-[#1a8b4c]/10 border-[#1a8b4c]/30 shadow-md font-bold'
                : 'text-gray-400 bg-transparent hover:bg-[#132a1d]/40 border-transparent hover:border-[#132a1d] hover:text-white'
            }`}
          >
            Growth Agency Card
          </Link>
          <Link 
            href="/admin/homepage/seo" 
            className={`text-xs font-semibold tracking-wide block px-3.5 py-2.5 rounded-xl transition-all duration-300 border ${
              pathname === '/admin/homepage/seo'
                ? 'text-[#22c55e] bg-[#1a8b4c]/10 border-[#1a8b4c]/30 shadow-md font-bold'
                : 'text-gray-400 bg-transparent hover:bg-[#132a1d]/40 border-transparent hover:border-[#132a1d] hover:text-white'
            }`}
          >
            Homepage SEO
          </Link>
          <Link 
            href="/admin/homepage/faqs" 
            className={`text-xs font-semibold tracking-wide block px-3.5 py-2.5 rounded-xl transition-all duration-300 border ${
              pathname === '/admin/homepage/faqs'
                ? 'text-[#22c55e] bg-[#1a8b4c]/10 border-[#1a8b4c]/30 shadow-md font-bold'
                : 'text-gray-400 bg-transparent hover:bg-[#132a1d]/40 border-transparent hover:border-[#132a1d] hover:text-white'
            }`}
          >
            FAQ Accordions
          </Link>
          <Link 
            href="/admin/homepage/section-headers" 
            className={`text-xs font-semibold tracking-wide block px-3.5 py-2.5 rounded-xl transition-all duration-300 border ${
              pathname === '/admin/homepage/section-headers'
                ? 'text-[#22c55e] bg-[#1a8b4c]/10 border-[#1a8b4c]/30 shadow-md font-bold'
                : 'text-gray-400 bg-transparent hover:bg-[#132a1d]/40 border-transparent hover:border-[#132a1d] hover:text-white'
            }`}
          >
            Section Headers
          </Link>
        </div>
      </details>

      {/* Partnership Settings Button */}
      <Link href="/admin/partnership" className={linkClass(isPartnershipPage)}>
        <Handshake className={iconClass(isPartnershipPage)} />
        <span>Franchise Settings</span>
      </Link>

      {/* Collapsible Manage Services Dropdown */}
      <details className="group/details" open={openServices} onToggle={(e: any) => setOpenServices(e.currentTarget.open)}>
        <summary className={`flex items-center justify-between gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300 text-[11px] md:text-xs font-semibold tracking-wide cursor-pointer list-none [&::-webkit-details-marker]:hidden border group/summary ${
          isServices 
            ? 'bg-gradient-to-r from-[#1a8b4c] to-[#0e5e3b] text-white border-[#15703d] shadow-xl shadow-[#1a8b4c]/20' 
            : 'text-gray-400 hover:text-white hover:bg-[#132a1d]/60 border-transparent hover:border-[#132a1d] hover:shadow-lg backdrop-blur-sm'
        }`}>
          <div className="flex items-center gap-2.5">
            <Layers className={`stroke-[2.2] flex-shrink-0 transition-colors w-[22px] h-[22px] ${isServices ? 'text-white' : 'text-gray-500 group-hover/summary:text-white'}`} />
            <span>Manage Services</span>
          </div>
          <span className="text-[10px] group-open/details:rotate-90 transition-transform font-bold text-gray-500 group-hover/summary:text-white">▶</span>
        </summary>
        
        {/* Submenu List Categories */}
        <SidebarCategories initialActiveServiceCategory={initialActiveServiceCategory} prefix="/admin/services" />
      </details>

      {/* Collapsible Manage Portfolio Dropdown */}
      <details className="group/details" open={isPortfolio || isHomepagePortfolio} onToggle={() => {}}>
        <summary className={`flex items-center justify-between gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300 text-[11px] md:text-xs font-semibold tracking-wide cursor-pointer list-none [&::-webkit-details-marker]:hidden border group/summary ${
          (isPortfolio || isHomepagePortfolio)
            ? 'bg-gradient-to-r from-[#1a8b4c] to-[#0e5e3b] text-white border-[#15703d] shadow-xl shadow-[#1a8b4c]/20' 
            : 'text-gray-400 hover:text-white hover:bg-[#132a1d]/60 border-transparent hover:border-[#132a1d] hover:shadow-lg backdrop-blur-sm'
        }`}>
          <div className="flex items-center gap-2.5">
            <ImageIcon className={`stroke-[2.2] flex-shrink-0 transition-colors w-[22px] h-[22px] ${(isPortfolio || isHomepagePortfolio) ? 'text-white' : 'text-gray-500 group-hover/summary:text-white'}`} />
            <span>Manage Portfolio</span>
          </div>
          <span className="text-[10px] group-open/details:rotate-90 transition-transform font-bold text-gray-500 group-hover/summary:text-white">▶</span>
        </summary>
        
        {/* Portfolio Submenu */}
        <div className="mt-2.5 mx-2.5 p-2 rounded-2xl bg-[#06100b] border border-[#132a1d] flex flex-col gap-2 text-gray-400 shadow-inner">
          <Link 
            href="/admin/portfolio" 
            className={`text-xs font-semibold tracking-wide block px-3.5 py-2.5 rounded-xl transition-all duration-300 border ${
              pathname === '/admin/portfolio'
                ? 'text-[#22c55e] bg-[#1a8b4c]/10 border-[#1a8b4c]/30 shadow-md font-bold'
                : 'text-gray-400 bg-transparent hover:bg-[#132a1d]/40 border-transparent hover:border-[#132a1d] hover:text-white'
            }`}
          >
            Main Portfolio
          </Link>
          <Link 
            href="/admin/homepage-portfolio" 
            className={`text-xs font-semibold tracking-wide block px-3.5 py-2.5 rounded-xl transition-all duration-300 border ${
              pathname === '/admin/homepage-portfolio'
                ? 'text-[#22c55e] bg-[#1a8b4c]/10 border-[#1a8b4c]/30 shadow-md font-bold'
                : 'text-gray-400 bg-transparent hover:bg-[#132a1d]/40 border-transparent hover:border-[#132a1d] hover:text-white'
            }`}
          >
            Homepage Cards
          </Link>
        </div>
      </details>


      {/* Collapsible Subdomain/Market Areas Dropdown */}
      <details className="group/details" open={pathname.startsWith('/admin/subdomains')} onToggle={() => {}}>
        <summary className={`flex items-center justify-between gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300 text-[11px] md:text-xs font-semibold tracking-wide cursor-pointer list-none [&::-webkit-details-marker]:hidden border group/summary ${
          pathname.startsWith('/admin/subdomains') 
            ? 'bg-gradient-to-r from-[#1a8b4c] to-[#0e5e3b] text-white border-[#15703d] shadow-xl shadow-[#1a8b4c]/20' 
            : 'text-gray-400 hover:text-white hover:bg-[#132a1d]/60 border-transparent hover:border-[#132a1d] hover:shadow-lg backdrop-blur-sm'
        }`}>
          <div className="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={`flex-shrink-0 transition-colors ${pathname.startsWith('/admin/subdomains') ? 'text-white' : 'text-gray-500 group-hover/summary:text-white'}`}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="3"/></svg>
            <span>Market Areas</span>
          </div>
          <span className="text-[10px] group-open/details:rotate-90 transition-transform font-bold text-gray-500 group-hover/summary:text-white">▶</span>
        </summary>

        {/* Subdomain Homepage Settings Dropdown */}
        <div className="mt-2 pl-3 border-l-2 border-[#132a1d] ml-3 flex flex-col gap-1">
          <details className="group/subdetails" open={openSubdomainHomepage} onToggle={(e: any) => setOpenSubdomainHomepage(e.currentTarget.open)}>
            <summary className={`flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl transition-all duration-300 text-[11px] md:text-xs font-semibold tracking-wide cursor-pointer list-none [&::-webkit-details-marker]:hidden border ${
              isSubdomainHomepage 
                ? 'bg-[#1a8b4c]/20 text-[#22c55e] border-[#1a8b4c]/30 shadow-md' 
                : 'text-gray-400 hover:text-white hover:bg-[#132a1d]/60 border-transparent'
            }`}>
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span>Homepage Settings</span>
              </div>
              <span className="text-[9px] group-open/subdetails:rotate-90 transition-transform font-bold">▶</span>
            </summary>
            
            <div className="mt-1.5 ml-2 pl-2 border-l border-[#132a1d]/50 flex flex-col gap-1">
              <Link 
                href="/admin/subdomains/homepage/hero" 
                className={`text-[10px] md:text-xs font-semibold tracking-wide block px-3 py-2 rounded-lg transition-all duration-300 ${
                  pathname === '/admin/subdomains/homepage/hero'
                    ? 'text-white bg-[#1a8b4c] font-bold shadow-md'
                    : 'text-gray-500 hover:bg-[#132a1d]/40 hover:text-gray-200'
                }`}
              >
                Hero Text
              </Link>
              <Link 
                href="/admin/subdomains/homepage/about-seo" 
                className={`text-[10px] md:text-xs font-semibold tracking-wide block px-3 py-2 rounded-lg transition-all duration-300 ${
                  pathname === '/admin/subdomains/homepage/about-seo'
                    ? 'text-white bg-[#1a8b4c] font-bold shadow-md'
                    : 'text-gray-500 hover:bg-[#132a1d]/40 hover:text-gray-200'
                }`}
              >
                About SEO Settings
              </Link>
              <Link 
                href="/admin/subdomains/homepage/growth-card" 
                className={`text-[10px] md:text-xs font-semibold tracking-wide block px-3 py-2 rounded-lg transition-all duration-300 ${
                  pathname === '/admin/subdomains/homepage/growth-card'
                    ? 'text-white bg-[#1a8b4c] font-bold shadow-md'
                    : 'text-gray-500 hover:bg-[#132a1d]/40 hover:text-gray-200'
                }`}
              >
                Growth Agency Card
              </Link>
              <Link 
                href="/admin/subdomains/homepage/seo" 
                className={`text-[10px] md:text-xs font-semibold tracking-wide block px-3 py-2 rounded-lg transition-all duration-300 ${
                  pathname === '/admin/subdomains/homepage/seo'
                    ? 'text-white bg-[#1a8b4c] font-bold shadow-md'
                    : 'text-gray-500 hover:bg-[#132a1d]/40 hover:text-gray-200'
                }`}
              >
                Homepage SEO
              </Link>
              <Link 
                href="/admin/subdomains/homepage/faqs" 
                className={`text-[10px] md:text-xs font-semibold tracking-wide block px-3 py-2 rounded-lg transition-all duration-300 ${
                  pathname === '/admin/subdomains/homepage/faqs'
                    ? 'text-white bg-[#1a8b4c] font-bold shadow-md'
                    : 'text-gray-500 hover:bg-[#132a1d]/40 hover:text-gray-200'
                }`}
              >
                FAQ Accordions
              </Link>
              <Link 
                href="/admin/subdomains/homepage/section-headers" 
                className={`text-[10px] md:text-xs font-semibold tracking-wide block px-3 py-2 rounded-lg transition-all duration-300 ${
                  pathname === '/admin/subdomains/homepage/section-headers'
                    ? 'text-white bg-[#1a8b4c] font-bold shadow-md'
                    : 'text-gray-500 hover:bg-[#132a1d]/40 hover:text-gray-200'
                }`}
              >
                Section Headers
              </Link>
            </div>
          </details>
        </div>
        
        {/* Submenu List Categories */}
        <SidebarCategories initialActiveServiceCategory={initialActiveServiceCategory} prefix="/admin/subdomains/services" />
      </details>

      {/* Collapsible Careers Settings Dropdown */}
      <details className="group/details" open={isCareers}>
        <summary className={`flex items-center justify-between gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300 text-[11px] md:text-xs font-semibold tracking-wide cursor-pointer list-none [&::-webkit-details-marker]:hidden border group/summary ${
          isCareers 
            ? 'bg-gradient-to-r from-[#1a8b4c] to-[#0e5e3b] text-white border-[#15703d] shadow-xl shadow-[#1a8b4c]/20' 
            : 'text-gray-400 hover:text-white hover:bg-[#132a1d]/60 border-transparent hover:border-[#132a1d] hover:shadow-lg backdrop-blur-sm'
        }`}>
          <div className="flex items-center gap-2.5">
            <Briefcase className={`stroke-[2.2] flex-shrink-0 transition-colors w-[22px] h-[22px] ${isCareers ? 'text-white' : 'text-gray-500 group-hover/summary:text-white'}`} />
            <span>Manage Careers</span>
          </div>
          <span className="text-[10px] group-open/details:rotate-90 transition-transform font-bold text-gray-500 group-hover/summary:text-white">▶</span>
        </summary>
        
        {/* Careers Submenu */}
        <div className="mt-2.5 mx-2.5 p-2 rounded-2xl bg-[#06100b] border border-[#132a1d] flex flex-col gap-2 text-gray-400 shadow-inner">
          <Link 
            href="/admin/careers" 
            className={`text-xs font-semibold tracking-wide block px-3.5 py-2.5 rounded-xl transition-all duration-300 border ${
              pathname === '/admin/careers' || (pathname.startsWith('/admin/careers/') && pathname !== '/admin/careers/applications')
                ? 'text-[#22c55e] bg-[#1a8b4c]/10 border-[#1a8b4c]/30 shadow-md font-bold'
                : 'text-gray-400 bg-transparent hover:bg-[#132a1d]/40 border-transparent hover:border-[#132a1d] hover:text-white'
            }`}
          >
            Job Openings
          </Link>
          <Link 
            href="/admin/careers/applications" 
            className={`text-xs font-semibold tracking-wide block px-3.5 py-2.5 rounded-xl transition-all duration-300 border ${
              pathname === '/admin/careers/applications'
                ? 'text-[#22c55e] bg-[#1a8b4c]/10 border-[#1a8b4c]/30 shadow-md font-bold'
                : 'text-gray-400 bg-transparent hover:bg-[#132a1d]/40 border-transparent hover:border-[#132a1d] hover:text-white'
            }`}
          >
            Job Applications
          </Link>
        </div>
      </details>

      {/* Blogs Button */}
      <Link href="/admin/blogs" className={linkClass(isBlogs)}>
        <Newspaper className={iconClass(isBlogs)} />
        <span>Manage Blogs</span>
      </Link>

      {/* Team Button */}
      <Link href="/admin/team" className={linkClass(isTeam)}>
        <Users className={iconClass(isTeam)} />
        <span>Manage Team & Sequence</span>
      </Link>

      {/* Submissions Button */}
      <Link href="/admin/contacts" className={linkClass(isContacts)}>
        <MessageSquare className={iconClass(isContacts)} />
        <span>Contact Submissions</span>
      </Link>

      {/* Partnership Requests Button */}
      <Link href="/admin/partnership-submissions" className={linkClass(isPartnershipSubmissions)}>
        <Handshake className={iconClass(isPartnershipSubmissions)} />
        <span>Partnership Requests</span>
      </Link>

      {/* Redirects Button */}
      <Link href="/admin/redirects" className={linkClass(isRedirects)}>
        <Shuffle className={iconClass(isRedirects)} />
        <span>SEO Redirects</span>
      </Link>

      {/* Reviews Button */}
      <Link href="/admin/reviews" className={linkClass(isReviews)}>
        <Star className={iconClass(isReviews)} />
        <span>Manage Reviews</span>
      </Link>

      {/* Policies Button */}
      <Link href="/admin/policies" className={linkClass(isPolicies)}>
        <FileText className={iconClass(isPolicies)} />
        <span>Manage Policies</span>
      </Link>

    </nav>
  );
}
