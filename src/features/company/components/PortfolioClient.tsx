"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ExternalLink, Globe, Calendar, Clock, X, Share2, CheckCircle2 } from 'lucide-react';
import { useContactInfo } from '@/lib/ContactContext';
import { TOP_BAR_CONTACT } from '@/constants/navigation';

export interface ProjectItem {
  id: number;
  title: string;
  category: string;
  image: string;
  desc: string;
  link: string;
  displayUrl: string;
  tags: string;
  order: number;
}

const getOptimizedUrl = (url: string, width: number = 800) => {
  if (url && url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    if (!url.includes('q_auto')) {
      return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
    }
  }
  return url;
};

const getOptimizedVideoUrl = (url: string) => {
  // We do not add w_720,q_auto,f_auto to videos here because Cloudinary will 
  // attempt to synchronously transcode the video on-the-fly. For large videos 
  // (like 100MB), this causes a timeout/error and the video breaks.
  return url;
};

const LazyVideo = ({ src, className }: { src: string; className?: string }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!shouldLoad) {
    return (
      <div ref={ref} className="w-full bg-gray-100 flex items-center justify-center rounded-lg" style={{ minHeight: '300px' }}>
        <div className="w-8 h-8 border-4 border-green-200 border-t-[#2CA65A] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <video 
      src={src}
      className={className || "w-full h-auto block"}
      autoPlay
      loop
      muted
      playsInline
    />
  );
};

const getVideoThumbnailUrl = (url: string): string => {
  if (!url) return '';
  // For Cloudinary videos, generate a poster from the first frame
  if (url.includes('res.cloudinary.com') && url.includes('/video/upload/')) {
    return url
      .replace('/video/upload/', '/video/upload/w_400,q_auto,f_jpg,so_auto/')
      .replace(/\.(mp4|webm|ogg)$/i, '.jpg');
  }
  return '';
};

const MotionGraphicVideo = ({ src, className }: { src: string; className?: string }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnailUrl = getVideoThumbnailUrl(src);

  const play = React.useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (!vid.src) vid.src = src;
    vid.play().catch(() => {});
    setIsPlaying(true);
  }, [src]);

  const pause = React.useCallback(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.pause();
      vid.currentTime = 0;
    }
    setIsPlaying(false);
  }, []);

  // Auto-pause when scrolled out of view (handles mobile)
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || !isPlaying) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          const vid = videoRef.current;
          if (vid) { vid.pause(); vid.currentTime = 0; }
          setIsPlaying(false);
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isPlaying]);

  // Fallback for non-Cloudinary videos
  if (!thumbnailUrl) {
    return <LazyVideo src={src} className={className} />;
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full"
      onMouseEnter={play}
      onMouseLeave={pause}
      onClick={() => { if (!isPlaying) play(); else pause(); }}
    >
      {/* Static thumbnail (first frame ~5KB) — determines container size */}
      <img 
        src={thumbnailUrl}
        alt="Motion Graphic"
        className={`${className || "w-full h-auto block"}`}
        loading="lazy"
        decoding="async"
      />
      
      {/* Video layer — only loads src on first interaction */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover ${isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        loop
        muted
        playsInline
        preload="none"
      />
      
      {/* Play icon overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-11 h-11 bg-black/25 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-0.5" />
          </div>
        </div>
      )}
    </div>
  );
};

const ProjectCard = ({ project, index }: { project: ProjectItem; index: number }) => {
  const [scrollDuration, setScrollDuration] = useState("4s");
  const imgRef = React.useRef<HTMLImageElement>(null);

  const calculateDuration = React.useCallback((naturalHeight: number, naturalWidth: number) => {
    if (naturalHeight && naturalWidth) {
      const ratio = naturalHeight / naturalWidth;
      // Constant speed: distance = ratio - container_ratio (0.75 for 4/3). 
      const distance = Math.max(0, ratio - 0.75);
      setScrollDuration(`${distance * 2.5}s`);
    }
  }, []);

  React.useEffect(() => {
    if (imgRef.current?.complete) {
      calculateDuration(imgRef.current.naturalHeight, imgRef.current.naturalWidth);
    }
  }, [calculateDuration, project.image]);

  let displayCategory = project.category;
  if (project.category === "SEO") {
    try {
      const seoData = JSON.parse(project.tags);
      if (seoData.displayCategory) {
        displayCategory = seoData.displayCategory;
      }
    } catch(e) {}
  }

  return (
    <div
      className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(26,139,76,0.12)] border border-gray-100"
    >
      {/* Browser Header Mockup */}
      <div className="bg-gray-50/80 border-b border-gray-100 px-4 py-3 flex items-center gap-2 rounded-t-3xl">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
        </div>
        <div className="flex-1 bg-gray-100/80 border border-gray-200/30 rounded-lg py-1 px-3 text-[11px] text-gray-400 truncate max-w-[220px] mx-auto text-center font-mono select-none flex items-center justify-center gap-1.5">
          <Globe size={10} className="text-gray-400" />
          <span>{project.displayUrl}</span>
        </div>
      </div>

      {/* Scrollable Screenshot Area */}
      <a 
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50 cursor-pointer block group/img"
      >
        <img 
          src={getOptimizedUrl(project.image || project.link)} 
          alt={project.title}
          title={project.title}
          className="absolute inset-0 w-full h-full object-cover object-top transition-[object-position] duration-[0.5s] group-hover/img:[transition-duration:var(--scroll-duration)] ease-linear group-hover/img:object-bottom"
          style={{ '--scroll-duration': scrollDuration } as React.CSSProperties}
          onLoad={(e) => {
            const target = e.target as HTMLImageElement;
            calculateDuration(target.naturalHeight, target.naturalWidth);
          }}
          loading={index < 6 ? "eager" : "lazy"}
          decoding="async"
        />
      </a>

      {/* Project Details */}
      <div className="p-5 flex flex-col flex-1 bg-white justify-between">
        <div>
          <div className="mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1a8b4c] bg-green-50 px-2.5 py-1 rounded-full">
              {displayCategory}
            </span>
          </div>

          <h3 className="text-[19px] md:text-[20px] font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#1a8b4c] transition-colors duration-300">
            {project.title}
          </h3>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <a 
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#1a8b4c] hover:bg-[#15803d] text-white text-center py-2.5 px-4 rounded-xl text-[14px] font-bold transition-colors flex items-center justify-center gap-2 shadow-sm shadow-green-900/10"
          >
            <span>Visit Live Site</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

const GraphicCard = ({ project, index }: { project: ProjectItem; index: number }) => {
  const isVideoUrl = (url: string) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg)$/i) || (url.includes('cloudinary') && url.includes('/video/upload/'));
  };

  const getInstagramEmbedUrl = (url: string) => {
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

  const isInsta = project.link?.includes('instagram.com');
  const isVid = isVideoUrl(project.image || project.link);

  return (
    <div
      className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(26,139,76,0.12)] border border-gray-100"
    >
      {/* Simple Image/Video Area - Natural Height */}
      <div className="relative w-full overflow-hidden bg-gray-50 group/img">
        {isInsta ? (
          <div className="w-full relative bg-white overflow-hidden" style={{ paddingTop: '125%' /* Fits 4:5 video exactly */ }}>
             <div className="absolute inset-0 z-10 pointer-events-none"></div>
             <iframe 
                src={getInstagramEmbedUrl(project.link)} 
                className="absolute inset-0 w-full h-full border-0" 
                scrolling="no"
                loading="lazy"
             />
          </div>
        ) : isVid ? (
          <MotionGraphicVideo 
            src={getOptimizedVideoUrl(project.image || project.link)}
            className="w-full h-auto block"
          />
        ) : (
          <a 
            href={project.image || project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full cursor-pointer block"
          >
            <img 
              src={getOptimizedUrl(project.image || project.link, 400)} 
              alt={project.title}
              title={project.title}
              className="w-full h-auto block transition-transform duration-500 group-hover/img:scale-105 will-change-transform"
              loading="lazy"
              decoding="async"
            />
          </a>
        )}
      </div>

      {/* Project Details */}
      <div className="p-5 flex flex-col flex-1 bg-white justify-between">
        <div>
          {project.title && (
            <h3 className="text-[19px] md:text-[20px] font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#1a8b4c] transition-colors duration-300">
              {project.title}
            </h3>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          {isInsta || isVid ? (
            <a 
              href={project.link || project.image}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#1a8b4c] hover:bg-[#15803d] text-white text-center py-2.5 px-4 rounded-xl text-[14px] font-bold transition-colors flex items-center justify-center gap-2 shadow-sm shadow-green-900/10"
            >
              <span>View Original {isInsta ? "Post" : "Video"}</span>
              <ExternalLink size={14} />
            </a>
          ) : (
            <a 
              href={project.image}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#1a8b4c] hover:bg-[#15803d] text-white text-center py-2.5 px-4 rounded-xl text-[14px] font-bold transition-colors flex items-center justify-center gap-2 shadow-sm shadow-green-900/10"
            >
              <span>View Full Image</span>
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export const SeoCard = ({ project, index }: { project: ProjectItem; index: number }) => {
  const contactInfo = useContactInfo();
  const phone = contactInfo?.phone || TOP_BAR_CONTACT.phone1;
  const [scrollDuration, setScrollDuration] = useState("4s");
  const imgRef = React.useRef<HTMLImageElement>(null);

  const calculateDuration = React.useCallback((naturalHeight: number, naturalWidth: number) => {
    if (naturalHeight && naturalWidth) {
      const ratio = naturalHeight / naturalWidth;
      // Constant speed: distance = ratio - container_ratio (1.33 for 3/4).
      const distance = Math.max(0, ratio - 1.33);
      setScrollDuration(`${distance * 2.5}s`);
    }
  }, []);

  React.useEffect(() => {
    if (imgRef.current?.complete) {
      calculateDuration(imgRef.current.naturalHeight, imgRef.current.naturalWidth);
    }
  }, [calculateDuration, project.image]);

  let seoData = { targetedCountry: "", targetedLocationLabel: "", showTargetedLocation: true, totalRanked: "", top10: "", top20: "", top30: "", sinceYear: "" };
  try {
    seoData = JSON.parse(project.tags);
  } catch(e) {}

  return (
    <div
      className="group flex flex-col md:flex-row bg-[#0B0626] rounded-3xl overflow-hidden shadow-xl w-full border border-gray-800 max-w-[1000px] mx-auto"
    >
      {/* LEFT: Image */}
      <div className="w-full md:w-[40%] lg:w-[35%] bg-white/5 relative p-4 md:p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
        <div className="bg-gray-100 rounded-xl w-full max-w-[280px] overflow-hidden shadow-lg border border-gray-200">
           <div className="bg-gray-200 px-3 py-1.5 flex items-center gap-1.5">
             <span className="w-2 h-2 rounded-full bg-red-400" />
             <span className="w-2 h-2 rounded-full bg-yellow-400" />
             <span className="w-2 h-2 rounded-full bg-green-400" />
           </div>
           <a 
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-full aspect-[3/4] block overflow-hidden bg-white group/seoimg"
          >
            <img 
              ref={imgRef}
              src={getOptimizedUrl(project.image)} 
              alt={project.title}
              className="w-full h-full object-cover object-top transition-[object-position] duration-[0.5s] group-hover/seoimg:[transition-duration:var(--scroll-duration)] ease-linear group-hover/seoimg:object-bottom"
              style={{ '--scroll-duration': scrollDuration } as React.CSSProperties}
              onLoad={(e) => calculateDuration(e.currentTarget.naturalHeight, e.currentTarget.naturalWidth)}
              loading={index < 4 ? "eager" : "lazy"}
              decoding="async"
            />
          </a>
        </div>
      </div>

      {/* RIGHT: Content */}
      <div className="w-full md:w-[60%] lg:w-[65%] p-5 md:p-6 lg:p-8 flex flex-col justify-center relative bg-gradient-to-br from-[#0B0626] to-[#160A4D]">
         
         <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
               <h3 className="text-3xl lg:text-4xl font-extrabold text-white mb-2 leading-tight">
                 {project.title}
               </h3>
               {seoData.showTargetedLocation !== false && (
                 <p className="text-gray-400 text-sm">
                   {seoData.targetedLocationLabel || 'Targeted Country'} : <span className="text-white font-medium">{seoData.targetedCountry || ''}</span>
                 </p>
               )}
            </div>
            
            <a 
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex bg-white/10 hover:bg-white/20 text-white text-[12px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition-colors border border-white/10"
            >
              CLICK TO VISIT
            </a>
         </div>

         {/* Metrics Grid */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
               <h4 className="text-2xl font-black text-white mb-1">{seoData.totalRanked}</h4>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total Ranked</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
               <h4 className="text-2xl font-black text-[#F43F5E] mb-1">{seoData.top10}</h4>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Top 10</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
               <h4 className="text-2xl font-black text-[#F59E0B] mb-1">{seoData.top20}</h4>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Top 20</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
               <h4 className="text-2xl font-black text-[#10B981] mb-1">{seoData.top30}</h4>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Top 30</p>
            </div>
         </div>

         <p className="text-gray-300 text-[13px] md:text-[14px] leading-relaxed mb-6 line-clamp-5">
           {project.desc}
         </p>

         <div className="mt-auto">
            <a 
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-6 py-3 rounded-full text-[13px] md:text-[14px] uppercase tracking-wider transition-colors active:scale-95 shadow-lg shadow-[#25D366]/20"
            >
              Discuss Your Project
            </a>
         </div>
      </div>
    </div>
  );
};

const VideoCard = React.memo(({ project, index, shareOrigin = 'https://www.globalwebify.com' }: { project: ProjectItem; index: number; shareOrigin?: string }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const getInstagramEmbedUrl = (url: string) => {
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

  const getPinterestEmbedUrl = (url: string) => {
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
  const isEmbed = isInsta || isPinterest;

  // Auto-play raw videos on scroll
  React.useEffect(() => {
    if (isEmbed) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const vid = videoRef.current;
        if (!vid) return;
        
        if (entry.isIntersecting) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isEmbed]);

  return (
    <div
      className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
    >
      {/* Video Thumbnail / Iframe Area */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-[4/5] overflow-hidden bg-gray-50 flex items-center justify-center group/img transition-all duration-300 border-b border-gray-100"
      >
        <div className="w-full h-full relative bg-black">
          {isEmbed ? (
            <>
              {!iframeLoaded && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-50/80 backdrop-blur-sm">
                  <div className="w-8 h-8 border-4 border-green-200 border-t-[#2CA65A] rounded-full animate-spin"></div>
                </div>
              )}
              <iframe 
                src={isPinterest ? getPinterestEmbedUrl(project.link) : getInstagramEmbedUrl(project.link)}
                className="absolute inset-0 w-full h-full border-0 bg-black"
                allowFullScreen
                scrolling="no"
                loading={index < 4 ? "eager" : "lazy"}
                onLoad={() => setIframeLoaded(true)}
              />
            </>
          ) : (
            <video 
              ref={videoRef}
              src={getOptimizedVideoUrl(project.link || project.image)}
              className="absolute inset-0 w-full h-full object-cover"
              loop
              muted
              playsInline
              preload="metadata"
            />
          )}
        </div>
      </div>

      {/* Project Details */}
      <div className={`flex flex-col bg-white border-t border-gray-100 ${project.title && project.title !== "Instagram Reel" ? "p-4 sm:p-5" : "p-3"}`}>
        {(project.title || project.desc) && project.title !== "Instagram Reel" && (
          <div className="mb-3">
            {project.title && project.title !== "Instagram Reel" && (
              <h3 className="text-[18px] md:text-[20px] font-bold text-gray-900 mb-2 leading-tight group-hover:text-[#E1306C] transition-colors duration-300 line-clamp-2">
                {project.title}
              </h3>
            )}
            
            {project.desc && (
              <p className="text-gray-500 text-[13px] line-clamp-2 leading-relaxed">
                {project.desc}
              </p>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <a 
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-center py-2.5 px-4 rounded-xl text-[13px] font-bold transition-colors flex items-center justify-center gap-2 border border-gray-200"
            >
              <span>{isPinterest ? "View on Pinterest" : isInsta ? "View on Instagram" : "Open Original Video"}</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});

export default function PortfolioClient({ projects }: { projects: ProjectItem[] }) {
  const [activeCategory, setActiveCategory] = useState("Website");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = activeCategory === "Videos" ? 16 : 30;
  
  const [shareOrigin, setShareOrigin] = useState('https://www.globalwebify.com');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareOrigin(window.location.origin);
    }
  }, []);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Removed disable-hover logic as it caused flickering on the top navbar when scrolling

  // Removed background prefetch queue to prevent network clogging and late rendering of visible items
  useEffect(() => {
    // We rely purely on native browser lazy loading now
  }, []);

  const baseCategories = ["Website", "CRM", "SEO", "Logo", "Graphics", "Videos"];
  const hiddenCategories = ["E-Commerce", "Web Development", "Corporate", "B2B Portal", "Informative", "Hospital And Diagnostics", "Medical And Healthcare", "Food And Beverages", "Restaurant Website", "Healthcare Website", "Education Portal"];

  const uniqueCategories = Array.from(new Set(projects.map(p => p.category).filter(Boolean)));
  const customCategories = uniqueCategories.filter(c => !baseCategories.includes(c) && !hiddenCategories.includes(c));

  const dynamicCategories = ["All", ...baseCategories, ...customCategories];

  const filteredProjects = projects.filter(p => {
    const isGlobalWebify = p.title.toLowerCase().includes("global webify") || p.title.toLowerCase().includes("globalwebify");
    
    // Hide Global Webify items from all tabs except SEO and Videos
    if (isGlobalWebify && activeCategory !== "SEO" && activeCategory !== "Videos") {
      return false;
    }

    if (activeCategory === "All") {
      return p.category !== "Videos" && p.category !== "Graphics" && p.category !== "Logo";
    }
    if (activeCategory === "Website") {
      return p.category === "Website" || p.category === "SEO" || hiddenCategories.includes(p.category);
    }
    return p.category === activeCategory;
  });

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="pt-0 sm:pt-1 pb-16 sm:pb-24 bg-[#f8fafc] font-sans relative min-h-screen overflow-x-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full -mr-72 -mt-72" style={{ background: 'radial-gradient(circle, rgba(187, 247, 208, 0.2) 0%, transparent 70%)' }} />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full -ml-64" style={{ background: 'radial-gradient(circle, rgba(187, 247, 208, 0.15) 0%, transparent 70%)' }} />

      <div className="relative z-10 container-custom">
        {/* Header Block */}
        <div className="text-center mb-8 sm:mb-10 max-w-3xl mx-auto">

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading text-gray-900 mb-4 leading-tight">
            Our <span className="text-[#2CA65A] underline decoration-green-200 decoration-4 sm:decoration-8 underline-offset-4">Portfolio</span>
          </h1>
          
          <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-5 leading-relaxed">
            Discover our best website projects showcasing performance, UX, and reliability.
          </p>
        </div>

        {/* Filtering buttons */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 py-4 px-4 select-none w-full max-w-6xl mx-auto mb-10">
            {dynamicCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-[12px] sm:text-[13px] font-bold font-lexend transition-colors duration-200 ${
                  activeCategory === cat 
                  ? "bg-[#2CA65A] text-white border border-[#2CA65A] shadow-lg shadow-green-900/10" 
                  : "bg-white text-[#2CA65A] border border-[#2CA65A]/40 hover:bg-[#2CA65A] hover:text-white hover:border-[#2CA65A]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        {activeCategory === "Videos" ? (
          <div className="flex flex-col gap-8 sm:gap-10 w-full max-w-[1400px] mx-auto">
            {/* Priority Videos (Left-to-Right Grid - Top 4 spots) */}
            {paginatedProjects.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 items-start">
                {paginatedProjects.slice(0, 4).map((project, index) => (
                  <div key={project.id} className="h-full break-inside-avoid">
                    <VideoCard project={project} index={index} shareOrigin={shareOrigin} />
                  </div>
                ))}
              </div>
            )}
            
            {/* Standard Videos (Pinterest / Masonry - Everything after top 4) */}
            {paginatedProjects.length > 4 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 items-start">
                {paginatedProjects.slice(4).map((project, index) => (
                  <div key={project.id} className="w-full">
                    <VideoCard project={project} index={4 + index} shareOrigin={shareOrigin} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeCategory === "Graphics" || activeCategory === "Logo" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 items-start max-w-[1400px] mx-auto px-4">
            {paginatedProjects.map((project, index) => (
              <div key={project.id} className="w-full">
                <GraphicCard project={project} index={index} />
              </div>
            ))}
          </div>
        ) : (
          <div 
            className={`mx-auto ${activeCategory === "SEO" ? "flex flex-col gap-4 sm:gap-6 max-w-[1000px]" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-[1400px]"}`}
          >
            {paginatedProjects.map((project, index) => {
              const cat = project.category;
              if (activeCategory === "SEO" && cat === "SEO") {
                return (
                  <div key={project.id}>
                    <SeoCard project={project} index={index} />
                  </div>
                );
              }
              if (cat === "Graphics" || cat === "Logo") {
                return (
                  <div key={project.id} className="w-full h-full">
                    <GraphicCard project={project} index={index} />
                  </div>
                );
              }
              return (
                <div key={project.id} className="h-full">
                  <ProjectCard project={project} index={index} />
                </div>
              );
            })}
          </div>
        )}

        {/* Premium Pagination UI */}
        {totalPages > 1 && (
          <div className="mt-16 w-full flex items-center justify-center gap-2 pb-10">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1.5 hidden sm:flex">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                    currentPage === i + 1 
                      ? 'bg-[#2CA65A] text-white shadow-lg shadow-green-900/20 scale-110' 
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-[#2CA65A] hover:text-[#2CA65A]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-[#2CA65A] text-white shadow-sm hover:bg-[#238a4b] shadow-green-900/10"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
