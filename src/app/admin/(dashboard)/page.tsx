import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Layers, Newspaper, Plus, Eye, ArrowRight, MessageSquare, ChevronRight } from 'lucide-react';
import { getSlugTitle } from '@/lib/replaceLocation';

export const revalidate = 0; // Disable cache so the dashboard stats are always real-time

export default async function AdminDashboardOverview() {
  // Fetch real-time metrics and lists in parallel to prevent sequential blocking
  const [
    servicesCount,
    blogsCount,
    rawCount,
    recentServices,
    recentBlogs
  ] = await Promise.all([
    db.servicePage.count(),
    db.blogPost.count(),
    db.$queryRaw<any[]>`SELECT COUNT(*) as count FROM ContactSubmission`.catch(e => {
      console.error('Failed to query contacts count');
      return [];
    }),
    db.servicePage.findMany({
      select: {
        id: true,
        slug: true,
        category: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    db.blogPost.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ]);

  let contactsCount = 0;
  if (rawCount && rawCount[0]) {
    contactsCount = Number(rawCount[0].count);
  }

  return (
    <div className="space-y-10 font-sans">
      
      {/* Top Greeting & Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-950 p-8 md:p-12 rounded-[32px] border border-gray-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#1a8b4c]/10 blur-[100px] rounded-full pointer-events-none -mr-32 -mt-32" />
        
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 bg-[#1a8b4c]/20 border border-[#1a8b4c]/30 px-3 py-1 rounded-full text-[10px] font-black text-green-400 uppercase tracking-widest">
            Control Console Active
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-black text-white font-heading uppercase tracking-tight leading-none">
            Welcome Back, Administrator
          </h2>
          <p className="text-sm md:text-base text-gray-400 font-medium max-w-2xl">
            Welcome to the GlobalWebify central workstation. Manage services, create blog posts, and interact with submitted business inquiries.
          </p>
        </div>
        

      </div>

      {/* Triple Large Stats Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Services Stat */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_-15px_rgba(26,139,76,0.06)] flex items-center gap-6 relative overflow-hidden group transition-all duration-300">
          <div className="absolute top-[-30%] right-[-10%] w-40 h-40 rounded-full bg-green-500/5 blur-3xl group-hover:bg-green-500/10 transition-all pointer-events-none" />
          <div className="w-16 h-16 rounded-2xl bg-green-50 text-[#1a8b4c] flex items-center justify-center border border-green-100 flex-shrink-0">
            <Layers size={28} className="stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
              Active Services
            </span>
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 font-heading tracking-tight mt-1 leading-none">
              {servicesCount}
            </h3>
            <Link 
              href="/admin/services" 
              className="text-xs font-black text-[#1a8b4c] uppercase tracking-wider flex items-center gap-1 mt-3 hover:underline"
            >
              Manage Services <ArrowRight size={12} className="stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* Blogs Stat */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_-15px_rgba(37,99,235,0.06)] flex items-center gap-6 relative overflow-hidden group transition-all duration-300">
          <div className="absolute top-[-30%] right-[-10%] w-40 h-40 rounded-full bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-all pointer-events-none" />
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 flex-shrink-0">
            <Newspaper size={28} className="stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
              Blog Articles
            </span>
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 font-heading tracking-tight mt-1 leading-none">
              {blogsCount}
            </h3>
            <Link 
              href="/admin/blogs" 
              className="text-xs font-black text-blue-600 uppercase tracking-wider flex items-center gap-1 mt-3 hover:underline"
            >
              Manage Blogs <ArrowRight size={12} className="stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* Inquiries Stat */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_-15px_rgba(139,92,246,0.06)] flex items-center gap-6 relative overflow-hidden group transition-all duration-300">
          <div className="absolute top-[-30%] right-[-10%] w-40 h-40 rounded-full bg-purple-500/5 blur-3xl group-hover:bg-purple-500/10 transition-all pointer-events-none" />
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 flex-shrink-0">
            <MessageSquare size={28} className="stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
              Contact Queries
            </span>
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 font-heading tracking-tight mt-1 leading-none">
              {contactsCount}
            </h3>
            <Link 
              href="/admin/contacts" 
              className="text-xs font-black text-purple-600 uppercase tracking-wider flex items-center gap-1 mt-3 hover:underline"
            >
              View Inquiries <ArrowRight size={12} className="stroke-[2.5]" />
            </Link>
          </div>
        </div>

      </div>

      {/* Side-by-Side Large Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Services List */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-green-50 text-[#1a8b4c] flex items-center justify-center">
                <Layers size={16} />
              </div>
              <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest font-heading">
                Recently Created Services
              </h4>
            </div>
            <Link 
              href="/admin/services" 
              className="text-[11px] font-black text-[#1a8b4c] uppercase tracking-wider hover:underline flex items-center gap-0.5"
            >
              View All <ChevronRight size={12} />
            </Link>
          </div>
          
          <div className="divide-y divide-gray-50 p-2">
            {recentServices.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-xs font-semibold">
                No services created yet.
              </div>
            ) : (
              recentServices.map((service) => (
                <div key={service.id} className="p-4 rounded-2xl flex items-center justify-between hover:bg-gray-50/80 transition-colors">
                  <div className="min-w-0 pr-4 space-y-1">
                    <span className="text-[9px] font-black bg-green-50 text-[#1a8b4c] px-2 py-0.5 rounded-full uppercase tracking-wider border border-green-100">
                      {service.category}
                    </span>
                    <h5 className="text-sm font-black text-gray-900 truncate">
                      {getSlugTitle(service.slug)}
                    </h5>
                    <p className="text-[10px] text-gray-400 font-mono truncate">
                      {service.slug}
                    </p>
                  </div>
                  <Link
                    href={`/admin/services/${service.slug.replace(/^\//, '')}`}
                    className="p-3 text-gray-400 hover:text-[#1a8b4c] hover:bg-green-50 rounded-xl transition-all flex-shrink-0"
                    title="Edit Service"
                  >
                    <Eye size={16} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Blogs List */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Newspaper size={16} />
              </div>
              <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest font-heading">
                Recently Published Blogs
              </h4>
            </div>
            <Link 
              href="/admin/blogs" 
              className="text-[11px] font-black text-blue-600 uppercase tracking-wider hover:underline flex items-center gap-0.5"
            >
              View All <ChevronRight size={12} />
            </Link>
          </div>
          
          <div className="divide-y divide-gray-50 p-2">
            {recentBlogs.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-xs font-semibold">
                No blog articles created yet.
              </div>
            ) : (
              recentBlogs.map((blog) => (
                <div key={blog.id} className="p-4 rounded-2xl flex items-center justify-between hover:bg-gray-50/80 transition-colors">
                  <div className="min-w-0 pr-4 space-y-1">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                      blog.isActive 
                        ? 'bg-blue-50 text-blue-600 border-blue-100' 
                        : 'bg-gray-50 text-gray-500 border-gray-100'
                    }`}>
                      {blog.isActive ? 'Active' : 'Draft'}
                    </span>
                    <h5 className="text-sm font-black text-gray-900 truncate">
                      {blog.title}
                    </h5>
                    <p className="text-[10px] text-gray-400 font-semibold">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <Link
                    href={`/admin/blogs/${blog.slug.replace(/^\/blog\//, '').replace(/^\//, '')}`}
                    className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all flex-shrink-0"
                    title="Edit Blog"
                  >
                    <Eye size={16} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
