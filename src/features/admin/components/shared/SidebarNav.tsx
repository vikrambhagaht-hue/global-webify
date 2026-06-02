'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
  LayoutDashboard, Layers, Newspaper, MessageSquare, Home
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
  const isContacts = pathname.startsWith('/admin/contacts');
  const isHomepage = pathname.startsWith('/admin/homepage');

  const [openHomepage, setOpenHomepage] = React.useState(isHomepage);
  const [openServices, setOpenServices] = React.useState(isServices);

  React.useEffect(() => {
    setOpenHomepage(isHomepage);
  }, [isHomepage]);

  React.useEffect(() => {
    setOpenServices(isServices);
  }, [isServices]);

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
            href="/admin/homepage/city-hero" 
            className={`text-xs font-semibold tracking-wide block px-3.5 py-2.5 rounded-xl transition-all duration-300 border ${
              pathname === '/admin/homepage/city-hero'
                ? 'text-[#22c55e] bg-[#1a8b4c]/10 border-[#1a8b4c]/30 shadow-md font-bold'
                : 'text-gray-400 bg-transparent hover:bg-[#132a1d]/40 border-transparent hover:border-[#132a1d] hover:text-white'
            }`}
          >
            City Landing Hero
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
            href="/admin/homepage/faqs" 
            className={`text-xs font-semibold tracking-wide block px-3.5 py-2.5 rounded-xl transition-all duration-300 border ${
              pathname === '/admin/homepage/faqs'
                ? 'text-[#22c55e] bg-[#1a8b4c]/10 border-[#1a8b4c]/30 shadow-md font-bold'
                : 'text-gray-400 bg-transparent hover:bg-[#132a1d]/40 border-transparent hover:border-[#132a1d] hover:text-white'
            }`}
          >
            FAQ Accordions
          </Link>
        </div>
      </details>

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
        <SidebarCategories initialActiveServiceCategory={initialActiveServiceCategory} />
      </details>

      {/* Blogs Button */}
      <Link href="/admin/blogs" className={linkClass(isBlogs)}>
        <Newspaper className={iconClass(isBlogs)} />
        <span>Manage Blogs</span>
      </Link>

      {/* Submissions Button */}
      <Link href="/admin/contacts" className={linkClass(isContacts)}>
        <MessageSquare className={iconClass(isContacts)} />
        <span>Contact Submissions</span>
      </Link>

    </nav>
  );
}
