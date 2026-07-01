import React from 'react';
import Link from 'next/link';
import { Newspaper, Layers, LogOut, Shield, LayoutDashboard, ArrowLeft, MessageSquare } from 'lucide-react';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { unstable_cache } from 'next/cache';
import SidebarNav from '@/features/admin/components/shared/SidebarNav';

const getSidebarServices = unstable_cache(
  async () => {
    return await db.servicePage.findMany({
      select: {
        id: true,
        title: true,
        category: true,
      },
      orderBy: {
        title: 'asc',
      },
    });
  },
  ['admin-sidebar-services'],
  { revalidate: 60, tags: ['services'] }
);

const globalForSeed = global as typeof globalThis & {
  isSeeded?: boolean;
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auto-seed missing category pages for the admin panel (only once on server startup)
  if (!globalForSeed.isSeeded) {
    const SEED_CATEGORIES = ['/seo-services', '/ai-seo-services', '/social-media-marketing', '/ppc-services'];
    try {
      const existing = await db.servicePage.count({
        where: {
          slug: {
            in: [
              ...SEED_CATEGORIES,
              ...SEED_CATEGORIES.map(s => s.replace(/^\//, ''))
            ]
          }
        }
      });
      if (existing < SEED_CATEGORIES.length) {
        for (const slug of SEED_CATEGORIES) {
          const exists = await db.servicePage.findFirst({
            where: {
              OR: [
                { slug },
                { slug: slug.replace(/^\//, '') }
              ]
            }
          });
          if (!exists) {
            const cleanSlug = slug.replace(/^\//, '');
            const title = cleanSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            await db.servicePage.create({
              data: {
                slug,
                title,
                contentTitle: title,
                seoTitle: `Best ${title} | GlobalWebify`,
                seoDescription: `Explore our professional ${title} to grow your business online.`,
                seoKeywords: title.toLowerCase(),
                heroDescription: `Expert ${title} tailored to drive traffic, leads, and sales for your business.`,
                content: `<h2>Welcome to our ${title}</h2><p>We provide industry-leading solutions to help you dominate your market.</p>`,
                category: 'marketing',
                image: '/web-dev-banner-bg.png',
                isActive: true,
              }
            });
          }
        }
      }
      globalForSeed.isSeeded = true;
    } catch (e) {
      console.error("Auto-seed failed", e);
    }
  }
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';
  const fullUrl = headersList.get('x-url') || '';

  const isOverview = pathname === '/admin';
  const isServices = pathname.includes('/admin/services');
  const isBlogs = pathname.includes('/admin/blogs');
  const isContacts = pathname.includes('/admin/contacts');
  const isPartnershipSubmissions = pathname.includes('/admin/partnership-submissions');
  const isHomepage = pathname.includes('/admin/homepage');

  // Fetch services for sidebar dynamic dropdown (Cached)
  const sidebarServices = await getSidebarServices();

  const categories = {
    website: { label: 'Website Services', services: [] as any[] },
    crm: { label: 'CRM Solutions', services: [] as any[] },
    seo: { label: 'SEO Services', services: [] as any[] },
    marketing: { label: 'Digital Marketing', services: [] as any[] },
    branding: { label: 'Branding & PR', services: [] as any[] },
    hosting: { label: 'Hosting', services: [] as any[] },
  };

  sidebarServices.forEach((service) => {
    const cat = service.category as keyof typeof categories;
    if (categories[cat]) {
      categories[cat].services.push(service);
    } else {
      categories.website.services.push(service);
    }
  });

  // Determine editing category to auto-expand accordion
  let activeServiceCategory = '';
  if (pathname.startsWith('/admin/services/')) {
    const parts = pathname.split('/');
    const lastPart = parts[parts.length - 1];
    
    if (lastPart !== 'new') {
      const id = parseInt(lastPart, 10);
      try {
        let service = null;
        if (!isNaN(id)) {
          service = await db.servicePage.findUnique({
            where: { id },
            select: { category: true }
          });
        } else {
          // If not a number, it's a slug. Query the DB by slug.
          const slugToQuery = `/${lastPart}`;
          service = await db.servicePage.findUnique({
            where: { slug: slugToQuery },
            select: { category: true }
          });
        }
        if (service) {
          activeServiceCategory = service.category;
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  // Determine active category from URL parameter or page context
  let activeCategory = '';
  if (fullUrl) {
    try {
      const parsedUrl = new URL(fullUrl);
      activeCategory = parsedUrl.searchParams.get('category') || '';
    } catch (e) {
      if (fullUrl.includes('category=website')) activeCategory = 'website';
      else if (fullUrl.includes('category=crm')) activeCategory = 'crm';
      else if (fullUrl.includes('category=seo')) activeCategory = 'seo';
      else if (fullUrl.includes('category=marketing')) activeCategory = 'marketing';
      else if (fullUrl.includes('category=branding')) activeCategory = 'branding';
      else if (fullUrl.includes('category=hosting')) activeCategory = 'hosting';
    }
  }

  if (!activeCategory) {
    activeCategory = activeServiceCategory;
  }

  const linkClass = (isActive: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-xs md:text-sm font-bold group/navlink ${isActive
      ? 'bg-[#1a8b4c] text-white shadow-lg shadow-[#1a8b4c]/10'
      : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
    }`;

  const iconClass = (isActive: boolean) =>
    `stroke-[2.2] flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover/navlink:text-white'}`;

  return (
    <div className="h-screen overflow-hidden bg-[#eff3f1] flex font-sans selection:bg-[#1a8b4c] selection:text-white relative">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0a1911] text-white flex flex-col flex-shrink-0 border-r border-[#132a1d] h-full hidden md:flex shadow-2xl relative z-20">
        {/* Brand/Header */}
        <div className="p-6 border-b border-[#132a1d] flex flex-col items-center justify-center text-center gap-3 bg-[#0a1911]">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white flex items-center justify-center p-1.5 flex-shrink-0 shadow-lg shadow-black/30">
            <img
              src="/global_webify_logo.png"
              alt="GlobalWebify Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-[11px] font-black tracking-widest uppercase font-poppins text-white leading-none">
              GlobalWebify
            </h2>
            <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mt-1 block">
              CMS Workstation
            </span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <SidebarNav initialActiveServiceCategory={activeServiceCategory} />

        {/* Sidebar Footer / Logout */}
        <div className="p-4 border-t border-[#132a1d] bg-[#08140e]">
          <a
            href="/api/auth/logout"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-950/40 text-red-400/90 hover:text-red-400 text-xs md:text-sm font-bold transition-all duration-200 group"
          >
            <LogOut size={18} className="stroke-[2.2] group-hover:scale-110 transition-transform" />
            <span>Sign Out</span>
          </a>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="admin-dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#1a8b4c" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#admin-dots)" />
          </svg>
        </div>

        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 h-16 flex items-center justify-between px-6 md:px-8 flex-shrink-0 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            {!isOverview && (
              <Link
                href="/admin"
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors mr-1 flex items-center justify-center border border-gray-200"
                title="Back to Overview"
              >
                <ArrowLeft size={14} className="stroke-[2.5]" />
              </Link>
            )}
            <h1 className="text-sm font-black text-gray-900 font-poppins uppercase tracking-wider">
              {isOverview ? 'GlobalWebify Console' : isServices ? 'GlobalWebify Services Portal' : isBlogs ? 'GlobalWebify Blogs Portal' : isContacts ? 'GlobalWebify Contacts Portal' : isPartnershipSubmissions ? 'Partnership Requests' : isHomepage ? 'GlobalWebify Homepage Settings' : 'GlobalWebify Console'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Small screen navigation shortcuts */}
            <div className="flex md:hidden gap-1 bg-gray-100 p-1 rounded-xl">
              <Link
                href="/admin"
                className={`p-2 rounded-lg transition-all ${isOverview ? 'bg-[#1a8b4c] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                title="Overview"
              >
                <LayoutDashboard size={16} />
              </Link>
              <Link
                href="/admin/services"
                className={`p-2 rounded-lg transition-all ${isServices ? 'bg-[#1a8b4c] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                title="Manage Services"
              >
                <Layers size={16} />
              </Link>
              <Link
                href="/admin/blogs"
                className={`p-2 rounded-lg transition-all ${isBlogs ? 'bg-[#1a8b4c] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                title="Manage Blogs"
              >
                <Newspaper size={16} />
              </Link>
              <Link
                href="/admin/contacts"
                className={`p-2 rounded-lg transition-all ${isContacts ? 'bg-[#1a8b4c] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                title="Contact Submissions"
              >
                <MessageSquare size={16} />
              </Link>
              <a
                href="/api/auth/logout"
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Sign Out"
              >
                <LogOut size={16} />
              </a>
            </div>

          </div>
        </header>

        {/* Page Inner Content */}
        <main className="flex-grow p-4 md:p-6 overflow-y-auto z-10 relative">
          <div className="bg-white rounded-3xl shadow-xl shadow-[#1a8b4c]/5 border border-gray-200/60 min-h-full p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
