"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const handleVideoEnded = () => {
    // Redirect to franchisee page with a query parameter to trigger auto-scroll
    router.push('/franchisee?scrollToForm=true');
  };

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
    <div className="min-h-screen bg-[#0a0f16] flex flex-col items-center py-6 px-4 pb-28 md:pb-12 font-sans text-white">
      {/* Header */}
      <div className="w-full max-w-md flex items-center mb-6">
        <Link href="/portfolio" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
          <ChevronLeft size={18} />
          <span className="text-[13px] font-medium">Back</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md flex flex-col gap-6">
        
        {/* Title */}
        {project.title && (
          <h1 className="text-[16px] sm:text-[18px] font-bold text-center text-gray-100 whitespace-nowrap overflow-hidden text-ellipsis">
            {project.title.split(/(Global Webify)/i).map((part, i) => 
              part.toLowerCase() === 'global webify' ? (
                <span key={i} className="text-[#2CA65A]">{part}</span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </h1>
        )}

        {/* Video Player */}
        <div className="w-full max-w-[280px] mx-auto bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800 relative flex items-center justify-center aspect-[9/16] group">
          
          {/* TOP-LEFT OVERLAY BUTTON (Desktop Only) */}
          <div className="absolute top-3 left-3 z-20 hidden md:block">
            <Link
              href="/franchisee?scrollToForm=true"
              className="pointer-events-auto bg-red-600/90 hover:bg-red-700 backdrop-blur-md text-white py-1.5 px-3 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-wide transition-all shadow-[0_0_10px_rgba(220,38,38,0.5)] flex items-center gap-1 border border-white/30 hover:scale-105"
            >
              <Calendar size={11} />
              <span>Book a Free Slot</span>
            </Link>
          </div>
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
              className="absolute inset-0 w-full h-full object-cover"
              controls
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnded}
            />
          )}
        </div>

        {/* DESKTOP ONLY CTA: Green button below the video */}
        <div className="hidden md:flex justify-center mt-2">
          <Link
            href="/franchisee?scrollToForm=true"
            className="w-full max-w-[280px] bg-[#2CA65A] hover:bg-[#238b4a] text-white py-3.5 px-6 rounded-xl text-[15px] font-bold transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <Calendar size={18} />
            <span>Book a Free Slot</span>
          </Link>
        </div>

      </div>

      {/* Enterprise Sticky CTA: ONLY ON MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0a0f16]/90 backdrop-blur-xl border-t border-gray-800 z-50 flex justify-center shadow-[0_-10px_40px_rgba(0,0,0,0.6)] md:hidden">
        <Link
          href="/franchisee?scrollToForm=true"
          className="w-full max-w-[280px] bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white py-3 px-6 rounded-xl text-[14px] font-black tracking-wide transition-all shadow-[0_5px_20px_rgba(225,29,72,0.3)] flex items-center justify-center gap-2 hover:-translate-y-1"
        >
          <Calendar size={16} />
          <span>Book a Free Slot</span>
        </Link>
      </div>

    </div>
  );
}
