"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, ChevronLeft } from 'lucide-react';

// Define a minimal ProjectItem type locally so we don't need circular imports
interface ProjectItem {
  id: number;
  title: string | null;
  category: string;
  image: string | null;
  desc: string | null;
  link: string | null;
  displayUrl: string | null;
  tags: string | null;
  order: number;
}

export default function VideoShareClient({ project }: { project: ProjectItem }) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const getInstagramEmbedUrl = (url: string | null) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('instagram.com')) {
        urlObj.search = '';
        let pathname = urlObj.pathname;
        if (!pathname.endsWith('/')) pathname += '/';
        return `${urlObj.origin}${pathname}embed?hidecaption=true`;
      }
    } catch (e) {}
    return url;
  };

  const getPinterestEmbedUrl = (url: string | null) => {
    if (!url) return '';
    try {
      if (url.includes('pinterest.com/pin/')) {
        const match = url.match(/pin\/(\d+)/);
        if (match && match[1]) {
          return `https://assets.pinterest.com/ext/embed.html?id=${match[1]}`;
        }
      }
    } catch (e) {}
    return '';
  };

  const isInsta = project.link?.includes("instagram.com");
  const isPinterest = project.link?.includes("pinterest.com");
  const isIframe = isInsta || isPinterest;

  return (
    <div className="min-h-screen bg-[#0a0f16] flex flex-col items-center py-6 px-4 font-sans text-white">
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-8">
        <Link href="/portfolio" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </Link>
        <div className="text-lg font-bold text-white tracking-wide">
          Global <span className="text-[#2CA65A]">Webify</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md flex flex-col gap-6">
        
        {/* Title */}
        {project.title && (
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-100 leading-tight">
            {project.title}
          </h1>
        )}

        {/* Video Player */}
        <div className="w-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800 aspect-[4/5] relative flex items-center justify-center">
          {isIframe ? (
            <>
              {!iframeLoaded && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900">
                  <div className="w-8 h-8 border-4 border-green-200 border-t-[#2CA65A] rounded-full animate-spin"></div>
                </div>
              )}
              <iframe 
                src={isInsta ? getInstagramEmbedUrl(project.link) : getPinterestEmbedUrl(project.link)}
                className="absolute inset-0 w-full h-full border-0 bg-white"
                allowFullScreen
                scrolling="no"
                onLoad={() => setIframeLoaded(true)}
              />
            </>
          ) : (
            <video 
              src={project.link || project.image || ''}
              className="w-full h-full object-cover"
              controls
              autoPlay
              playsInline
            />
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800 flex flex-col items-center text-center gap-4 mt-2">
          <h3 className="text-xl font-bold text-gray-100">Ready to build yours?</h3>
          <p className="text-gray-400 text-[13px] leading-relaxed">Schedule a free 1-on-1 consultation with our experts to discuss your requirements and grow your business.</p>
          
          <a
            href="/franchisee"
            className="w-full bg-[#2CA65A] hover:bg-[#238b4a] text-white py-4 px-6 rounded-2xl text-[15px] font-bold transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-3 mt-2"
          >
            <Calendar size={18} />
            <span>Book a Free Slot</span>
          </a>
        </div>

      </div>
    </div>
  );
}
