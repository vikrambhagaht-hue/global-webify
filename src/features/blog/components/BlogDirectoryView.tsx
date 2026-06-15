"use client";

import React from 'react';
import { m } from 'framer-motion';
import { Calendar, User, ArrowRight, BookOpen, Users, Tag, Star, Send, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
interface BlogClientProps {
  posts?: any[];
  currentPage?: number;
  totalPages?: number;
}

export default function BlogDirectoryView({ posts, currentPage = 1, totalPages = 1 }: BlogClientProps) {
  const displayPosts = posts || [];

  return (
    <div className="pt-32 pb-0 bg-white font-sans overflow-hidden">
      
      {/* ========================================================= */}
      {/* SECTION 1: FEATURED BLOG POSTS HEADER & GRID              */}
      {/* ========================================================= */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        
        {/* Featured Blog Posts Title Header */}
        <div className="text-center mb-16">
          <m.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[26px] sm:text-[32px] md:text-[38px] font-black text-[#1a8b4c] uppercase tracking-wider leading-tight"
          >
            FEATURED BLOG POSTS
          </m.h1>
          <p className="text-gray-500 text-[11px] md:text-[12px] font-bold max-w-2xl mx-auto uppercase tracking-wider mt-3">
            Explore our latest research, insights, and guides to boost your business visibility online.
          </p>
          <div className="w-20 h-1 bg-[#1a8b4c] mx-auto mt-4 rounded-full" />
        </div>

        {/* 4-Column Responsive Card Grid (Perfect 4 columns matching your image) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {displayPosts.map((post, i) => {
            const slug = post.slug.startsWith('/blog/') ? post.slug : `/blog/${post.slug}`;
            const date = post.date || (post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase() : '');
            const excerpt = post.excerpt || post.summary || '';
            const author = post.author || 'Admin';

            return (
              <Link 
                href={slug}
                key={post.title}
                className="block h-full cursor-pointer"
              >
                <m.article
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="bg-green-50/10 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-[#1a8b4c]/10 hover:border-[#1a8b4c] hover:shadow-[0_12px_40px_rgba(26,139,76,0.08)] hover:bg-green-50/20 hover:translate-y-[-4px] transition-all duration-300 group flex flex-col h-full"
                >
                  
                  {/* Centered & Contained Post Thumbnail - Never Crops */}
                  {post.image && (
                    <div className="aspect-[16/10] w-full overflow-hidden relative bg-green-50/30 flex items-center justify-center">
                      <Image 
                        src={post.image} 
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized={post.image.includes('unsplash.com') || post.image.startsWith('/uploads')}
                      />
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="p-5 md:p-6 flex flex-col flex-grow">
                    
                    {/* Post Title - Deep dark green by default, light green on hover */}
                    <h3 className="text-[15px] md:text-[16px] font-bold font-lexend text-[#15703d] leading-snug mb-2.5 line-clamp-2 group-hover:text-[#22c55e] transition-colors">
                      {post.title}
                    </h3>

                    {/* Excerpt Summary */}
                    <p className="text-gray-500 text-[12px] font-semibold leading-relaxed mb-3 line-clamp-2 whitespace-normal break-words">
                      {excerpt}
                    </p>

                    {/* Metadata: Date stamp */}
                    <div className="flex gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 mt-auto">
                      <span className="flex items-center gap-1"><Calendar size={12} className="stroke-[2.5]" /> {date}</span>
                      <span className="flex items-center gap-1"><User size={12} className="stroke-[2.5]" /> {author}</span>
                    </div>

                    {/* Read More dynamic bottom anchor */}
                    <div className="border-t border-gray-50 pt-3 flex items-center justify-between mt-2">
                      <span className="text-[#1a8b4c] font-black text-[10px] uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read More <ArrowRight size={12} className="stroke-[2.5]" />
                      </span>
                    </div>

                  </div>

                </m.article>
              </Link>
            );
          })}
        </div>

        {/* High-Fidelity Dynamic Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-16">
            {currentPage > 1 && (
              <Link
                href={`/blog?page=${currentPage - 1}`}
                className="px-3.5 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center text-xs font-bold transition-all gap-1"
              >
                Prev
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => {
              const p = i + 1;
              if (
                p === 1 ||
                p === totalPages ||
                Math.abs(p - currentPage) <= 1
              ) {
                return (
                  <Link
                    key={p}
                    href={`/blog?page=${p}`}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shadow-sm transition-all ${
                      p === currentPage
                        ? "bg-[#1a8b4c] text-white"
                        : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </Link>
                );
              }

              if (p === 2 && currentPage > 3) {
                return (
                  <span key="ell-start" className="text-gray-400 text-xs font-bold px-1 select-none">
                    ...
                  </span>
                );
              }

              if (p === totalPages - 1 && currentPage < totalPages - 2) {
                return (
                  <span key="ell-end" className="text-gray-400 text-xs font-bold px-1 select-none">
                    ...
                  </span>
                );
              }

              return null;
            })}

            {currentPage < totalPages && (
              <Link
                href={`/blog?page=${currentPage + 1}`}
                className="px-3.5 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center text-xs font-bold transition-all gap-1"
              >
                Next <ChevronRight size={12} className="stroke-[2.5]" />
              </Link>
            )}
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* SECTION 2: OUR BLOG IMPACT STATS (Middle)                 */}
      {/* ========================================================= */}
      <section className="py-20 bg-gray-50/50 relative overflow-hidden border-t border-b border-gray-100/80">
        
        {/* Soft, glowing colorful ambient highlights */}
        <div className="absolute top-1/2 left-10 -translate-y-1/2 w-80 h-80 bg-green-200/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-80 h-80 bg-blue-200/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Stats Title Block */}
          <div className="text-center mb-14">
            <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-black text-[#1a8b4c] uppercase tracking-wider leading-tight">
              OUR BLOG IMPACT
            </h2>
            <p className="text-gray-500 text-[11px] md:text-[12px] font-bold max-w-xl mx-auto uppercase tracking-wider mt-3">
              Thousands of people read our blog posts. What we add is the expansion of businesses.
            </p>
            <div className="w-16 h-1 bg-[#1a8b4c] mx-auto mt-4 rounded-full" />
          </div>

          {/* 4 Stats Cards Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Blog Articles (Green) */}
            <div className="bg-white rounded-[24px] p-8 border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col items-center text-center transition-transform hover:translate-y-[-4px] duration-300">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#1a8b4c] flex items-center justify-center shadow-sm">
                <BookOpen size={20} className="stroke-[2.5]" />
              </div>
              <span className="text-[28px] font-black text-gray-950 mt-5 mb-1.5 tracking-tight">500+</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Blog Articles</span>
            </div>

            {/* Card 2: Monthly Readers (Blue) */}
            <div className="bg-white rounded-[24px] p-8 border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col items-center text-center transition-transform hover:translate-y-[-4px] duration-300">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                <Users size={20} className="stroke-[2.5]" />
              </div>
              <span className="text-[28px] font-black text-gray-950 mt-5 mb-1.5 tracking-tight">50K+</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Monthly Readers</span>
            </div>

            {/* Card 3: Categories (Orange) */}
            <div className="bg-white rounded-[24px] p-8 border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col items-center text-center transition-transform hover:translate-y-[-4px] duration-300">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-sm">
                <Tag size={20} className="stroke-[2.5]" />
              </div>
              <span className="text-[28px] font-black text-gray-950 mt-5 mb-1.5 tracking-tight">15+</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Categories</span>
            </div>

            {/* Card 4: Reader Satisfaction (Purple) */}
            <div className="bg-white rounded-[24px] p-8 border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col items-center text-center transition-transform hover:translate-y-[-4px] duration-300">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm">
                <Star size={20} className="stroke-[2.5]" />
              </div>
              <span className="text-[28px] font-black text-gray-950 mt-5 mb-1.5 tracking-tight">95%</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reader Satisfaction</span>
            </div>

          </div>

        </div>

      </section>

      {/* ========================================================= */}
      {/* SECTION 3: BRIGHT OFFICE-INTERIOR CTA BANNER (Bottom)      */}
      {/* ========================================================= */}
      <section className="relative py-24 flex items-center justify-center">
        
        {/* Full-bleed background Office Interior photo */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c"
            alt="Global Webify Meeting Room Interior"
            fill
            className="object-cover"
            priority
          />
          {/* Subtle overlay wash to give depth and blur */}
          <div className="absolute inset-0 bg-gray-950/20 backdrop-blur-[1.5px]" />
        </div>

        {/* Central White CTA Card matching screenshot exactly */}
        <div className="relative z-10 w-full max-w-[540px] mx-4">
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-[32px] p-8 md:p-10 border border-gray-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.15)] text-center flex flex-col items-center"
          >
            
            {/* Paper Airplane Circular Green Badge */}
            <div className="w-12 h-12 rounded-full bg-[#1a8b4c] text-white flex items-center justify-center shadow-md mb-5">
              <Send size={18} className="stroke-[2.5] -rotate-12 translate-x-[-1px] translate-y-[1px]" />
            </div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-black text-[#1a8b4c] tracking-tight mb-2.5">
              Ready to Get Started?
            </h3>

            {/* Description */}
            <p className="text-gray-500 text-xs md:text-[13px] font-semibold leading-relaxed mb-8 max-w-[360px]">
              Let's work together to achieve visual success. Contact us today!
            </p>

            {/* Two Action buttons side-by-side */}
            <div className="flex items-center gap-3 w-full justify-center">
              
              {/* Button 1: Contact Us (Solid Green) */}
              <Link
                href="/contact"
                className="bg-[#1a8b4c] hover:bg-[#15703d] text-white font-black py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all text-xs tracking-wider uppercase flex items-center gap-2"
              >
                Contact Us
              </Link>
              
              {/* Button 2: Interact Now (Outline Green) */}
              <Link
                href="/contact?tab=consultation"
                className="bg-white hover:bg-gray-50 text-[#1a8b4c] border-[2px] border-[#1a8b4c] font-black py-3 px-6 rounded-xl shadow-sm hover:shadow-md transition-all text-xs tracking-wider uppercase flex items-center gap-2"
              >
                Interact Now
              </Link>

            </div>

          </m.div>
        </div>

      </section>

    </div>
  );
}
