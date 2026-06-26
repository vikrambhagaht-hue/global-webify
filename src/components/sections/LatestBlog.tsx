"use client";

import React from 'react';
import { m } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/data/posts';

interface LatestBlogProps {
  dbPosts?: any[];
  sectionTitle?: string;
  sectionDesc?: string;
}

export default function LatestBlog({ dbPosts = [], sectionTitle, sectionDesc }: LatestBlogProps) {
  // Merge database posts and static posts, taking exactly the top 4
  const latestPosts = [...dbPosts, ...blogPosts].slice(0, 4);

  return (
    <section className="pt-8 pb-14 md:pt-12 md:pb-20 bg-gray-50/50 relative overflow-hidden font-sans border-t border-gray-100">
      
      {/* Subtle glowing highlights */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-50/40 rounded-full blur-3xl pointer-events-none -ml-48 -mt-48" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1a8b4c]/5 rounded-full blur-3xl pointer-events-none -mr-48 -mb-48" />
 
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <m.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-green-50 text-[#1a8b4c] px-4 py-2 rounded-full text-[12px] font-black uppercase tracking-widest mb-4"
          >
            <Calendar size={18} /> Our Blog
          </m.div>
          {sectionTitle ? (
            <m.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[28px] md:text-[36px] font-black text-gray-950 leading-tight"
              dangerouslySetInnerHTML={{ __html: sectionTitle }}
            />
          ) : (
            <m.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[28px] md:text-[36px] font-black text-gray-950 leading-tight"
            >
              Latest <span className="text-[#1a8b4c]">Insights & News</span>
            </m.h2>
          )}

          {sectionDesc ? (
            <m.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gray-500 mt-4 font-medium max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{ __html: sectionDesc }}
            />
          ) : (
            <m.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gray-500 mt-4 font-medium max-w-2xl mx-auto"
            >
              Stay up to date with the latest trends, strategies, and growth hacks in the digital world.
            </m.p>
          )}
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {latestPosts.map((post, i) => {
            const slug = post.slug.startsWith('/blog/') ? post.slug : `/blog/${post.slug}`;
            const date = post.date || (post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase() : '');
            const excerpt = post.excerpt || post.summary || '';

            return (
              <Link 
                href={slug}
                key={post.title}
                title={`${post.title} - Global Webify`}
                className="block h-full cursor-pointer"
              >
                <m.article
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02, duration: 0.3 }}
                  className="bg-green-50/10 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-[#1a8b4c]/10 hover:border-[#1a8b4c] hover:shadow-[0_12px_40px_rgba(26,139,76,0.08)] hover:bg-green-50/20 hover:translate-y-[-4px] transition-all duration-300 group flex flex-col h-full md:transform-gpu md:will-change-transform"
                >
                  
                  {/* Centered & Contained Post Thumbnail - Never Crops Custom Uploads */}
                  {post.image && (
                    <div className="aspect-[16/10] w-full overflow-hidden relative rounded-t-3xl bg-green-50/30 flex items-center justify-center">
                      <Image 
                        src={post.image} 
                        alt={post.title}
                        title={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized={post.image.includes('unsplash.com') || post.image.startsWith('/uploads')}
                      />
                    </div>
                  )}

                  {/* Card Body content */}
                  <div className="p-5 md:p-6 flex flex-col flex-grow">
                    
                    {/* Date stamp with Calendar Icon */}
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-widest mb-3.5">
                      <Calendar size={14} className="stroke-[2]" />
                      <span>{date}</span>
                    </div>
                    
                    {/* Post Title - Deep dark green by default, light green on hover */}
                    <h3 className="text-[15.5px] md:text-[16.5px] font-bold font-lexend text-[#15703d] leading-snug mb-3 line-clamp-2 group-hover:text-[#22c55e] transition-colors">
                      {post.title}
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-gray-500 text-[12.5px] font-normal leading-relaxed mb-6 line-clamp-3 whitespace-normal break-words">
                      {excerpt}
                    </p>
                  
                  {/* Read More Indicator anchored to bottom */}
                  <div className="mt-auto">
                    <div 
                      className="text-[#15803d] font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all text-[11.5px] uppercase tracking-widest"
                    >
                      Read More <ArrowRight size={14} className="stroke-[2]" />
                    </div>
                  </div>

                </div>

              </m.article>
            </Link>
          );
        })}
        </div>

        {/* View All Blogs CTA centered below */}
        <div className="flex justify-center mt-8 md:mt-12">
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/blog"
              className="bg-[#1a8b4c] hover:bg-[#15703d] text-white font-bold py-3.5 px-8 rounded-full shadow-md hover:shadow-lg hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 text-xs md:text-sm tracking-widest uppercase"
            >
              View All Blogs <ArrowRight size={16} className="stroke-[2]" />
            </Link>
          </m.div>
        </div>

      </div>

    </section>
  );
}
