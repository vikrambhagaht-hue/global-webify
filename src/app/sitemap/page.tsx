import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';
import { CITIES_MAP } from '@/features/services/constants/cities';
import { 
  Home, 
  Info, 
  Briefcase, 
  Users, 
  Image as ImageIcon, 
  MapPin, 
  BookOpen, 
  Mail,
  Code,
  Search,
  Palette,
  Server,
  ChevronRight,
  Compass,
  ArrowRight
} from 'lucide-react';

export const revalidate = 3600; // Revalidate page every hour

export const metadata: Metadata = {
  title: 'Sitemap | GlobalWebify',
  description: 'Explore the full sitemap of GlobalWebify. Find links to all our web development services, digital marketing pages, locations, and blog posts.',
};

const COMPANY_PAGES = [
  { label: "Home", href: "/", icon: Home, desc: "Welcome to our main page" },
  { label: "About Us", href: "/about", icon: Info, desc: "Learn more about our agency" },
  { label: "Our Portfolio", href: "/portfolio", icon: Briefcase, desc: "See our latest work and projects" },
  { label: "Our Team", href: "/team", icon: Users, desc: "Meet the experts behind our success" },
  { label: "Gallery", href: "/gallery", icon: ImageIcon, desc: "Take a visual tour of our workspace" },
  { label: "Market Areas", href: "/market-area", icon: MapPin, desc: "Locations where we serve our clients" },
  { label: "Blog Articles", href: "/blog", icon: BookOpen, desc: "Insights, guides, and tech updates" },
  { label: "Contact Us", href: "/contact", icon: Mail, desc: "Get in touch with our team" }
];

const CATEGORY_META: Record<string, { label: string; icon: any; color: string; bgColor: string }> = {
  website: { 
    label: "Web Development & Design", 
    icon: Code, 
    color: "text-teal-600 border-teal-100", 
    bgColor: "bg-teal-50/50" 
  },
  marketing: { 
    label: "Digital Marketing & SEO", 
    icon: Search, 
    color: "text-emerald-600 border-emerald-100", 
    bgColor: "bg-emerald-50/50" 
  },
  branding: { 
    label: "Branding & PR", 
    icon: Palette, 
    color: "text-purple-600 border-purple-100", 
    bgColor: "bg-purple-50/50" 
  },
  hosting: { 
    label: "Domain & Hosting", 
    icon: Server, 
    color: "text-cyan-600 border-cyan-100", 
    bgColor: "bg-cyan-50/50" 
  }
};

export default async function SitemapPage() {
  // Query all active service pages from DB
  let services: any[] = [];
  try {
    services = await db.servicePage.findMany({
      where: { isActive: true },
      select: {
        title: true,
        slug: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Failed to query service pages for sitemap:", error);
  }

  // Query all active blog posts from DB
  let blogs: any[] = [];
  try {
    blogs = await db.blogPost.findMany({
      where: { isActive: true },
      select: {
        title: true,
        slug: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Failed to query blog posts for sitemap:", error);
  }

  // Group services by category
  const servicesByCategory: Record<string, typeof services> = {};
  services.forEach(service => {
    const cat = service.category || 'website';
    if (!servicesByCategory[cat]) {
      servicesByCategory[cat] = [];
    }
    servicesByCategory[cat].push(service);
  });

  // Extract cities from constant map
  const cities = Object.keys(CITIES_MAP).map(key => ({
    slug: key,
    name: CITIES_MAP[key].name,
    subtitle: CITIES_MAP[key].subtitle
  }));

  return (
    <div className="bg-[#fafdfc] min-h-screen py-20 font-sans">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <span className="text-[12px] font-black text-gray-400 uppercase tracking-[0.25em] block mb-3">
            Platform Directory
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-[54px] font-black text-[#1a8b4c] uppercase tracking-tight leading-none mb-6">
            Website Sitemap
          </h1>
          <p className="text-[15px] md:text-[16px] text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Find and explore all sections of our platform. From corporate pages and dynamic service categories to our localized markets and educational blogs.
          </p>
          <div className="w-16 h-[3px] bg-[#1a8b4c] rounded-full mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Company & Blog */}
          <div className="lg:col-span-4 space-y-8 lg:space-y-12">
            
            {/* Company Section */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-[#1a8b4c]">
                  <Compass size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="text-[18px] font-black text-gray-950 uppercase tracking-tight">
                    Company
                  </h2>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider leading-none">
                    Core Directory Links
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {COMPANY_PAGES.map((page, idx) => {
                  const Icon = page.icon;
                  return (
                    <Link
                      key={idx}
                      href={page.href}
                      className="group flex items-start gap-4 p-3 rounded-2xl hover:bg-[#f0fdf4]/40 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-[#f0fdf4] group-hover:text-[#1a8b4c] transition-colors shrink-0">
                        <Icon size={16} />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[13px] font-bold text-gray-800 group-hover:text-[#1a8b4c] transition-colors flex items-center gap-1.5 leading-tight">
                          {page.label}
                          <ChevronRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#1a8b4c]" />
                        </span>
                        <p className="text-[11px] text-gray-400 font-semibold leading-tight">
                          {page.desc}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Latest Articles (Blogs) */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-[#1a8b4c]">
                  <BookOpen size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="text-[18px] font-black text-gray-950 uppercase tracking-tight">
                    Latest Blogs
                  </h2>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider leading-none">
                    Tech & SEO Articles
                  </p>
                </div>
              </div>

              {blogs.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {blogs.map((blog, idx) => {
                    const cleanSlug = blog.slug.replace(/^\/?(blog\/)?/, '');
                    return (
                      <Link
                        key={idx}
                        href={`/blog/${cleanSlug}`}
                        className="group flex items-center justify-between p-3 border border-gray-50 rounded-xl hover:border-[#1a8b4c]/20 hover:bg-[#f0fdf4]/20 transition-all"
                      >
                        <span className="text-[13px] font-semibold text-gray-700 group-hover:text-[#1a8b4c] transition-colors leading-tight line-clamp-2">
                          {blog.title}
                        </span>
                        <ChevronRight size={14} className="text-gray-400 group-hover:text-[#1a8b4c] transition-colors shrink-0 ml-2" />
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[13px] text-gray-400 font-semibold italic text-center py-4">
                  No articles published yet.
                </p>
              )}
            </div>

          </div>

          {/* Right Column: Services & Locations */}
          <div className="lg:col-span-8 space-y-8 lg:space-y-12">
            
            {/* Services Section */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-[#1a8b4c]">
                  <Code size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="text-[18px] font-black text-gray-950 uppercase tracking-tight">
                    Our Services
                  </h2>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider leading-none">
                    Category-Wise Services
                  </p>
                </div>
              </div>

              {Object.keys(servicesByCategory).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.keys(servicesByCategory).map((cat) => {
                    const meta = CATEGORY_META[cat] || {
                      label: cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                      icon: Code,
                      color: "text-gray-600 border-gray-100",
                      bgColor: "bg-gray-50/50"
                    };
                    const Icon = meta.icon;
                    const catServices = servicesByCategory[cat];

                    return (
                      <div key={cat} className="space-y-4">
                        {/* Sub Category Header */}
                        <div className={`flex items-center gap-2.5 p-3 rounded-2xl border ${meta.color} ${meta.bgColor}`}>
                          <Icon size={16} className="shrink-0" />
                          <h3 className="text-[13px] font-black uppercase tracking-wider text-gray-800">
                            {meta.label}
                          </h3>
                        </div>

                        {/* List of services in this category */}
                        <div className="space-y-2.5 pl-2">
                          {catServices.map((service, idx) => {
                            const cleanSlug = service.slug.startsWith('/') ? service.slug.slice(1) : service.slug;
                            return (
                              <Link
                                key={idx}
                                href={`/${cleanSlug}`}
                                className="group flex items-center gap-2 hover:translate-x-1 transition-transform duration-200"
                              >
                                <ChevronRight size={12} className="text-gray-400 group-hover:text-[#1a8b4c] transition-colors shrink-0" />
                                <span className="text-[13px] font-semibold text-gray-600 group-hover:text-[#1a8b4c] transition-colors leading-tight">
                                  {service.title}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[13px] text-gray-400 font-semibold italic text-center py-4">
                  No services configured yet.
                </p>
              )}
            </div>

            {/* Locations Section */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-[#1a8b4c]">
                  <MapPin size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="text-[18px] font-black text-gray-950 uppercase tracking-tight">
                    Locations
                  </h2>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider leading-none">
                    Market Area Pages
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[300px] overflow-y-auto pr-1">
                {cities.map((city, idx) => (
                  <Link
                    key={idx}
                    href={`/${city.slug}`}
                    className="group p-3 border border-gray-50 bg-[#fafdfc]/30 rounded-2xl text-center shadow-sm hover:shadow-md hover:border-[#1a8b4c]/20 hover:bg-[#f0fdf4]/20 transition-all"
                  >
                    <MapPin size={14} className="text-gray-400 group-hover:text-[#1a8b4c] transition-colors mx-auto mb-1.5" />
                    <span className="text-[12px] font-bold text-gray-800 group-hover:text-[#1a8b4c] transition-colors leading-tight block">
                      {city.name}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 block group-hover:text-gray-500 transition-colors uppercase tracking-wider truncate leading-none mt-0.5">
                      {city.subtitle}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
