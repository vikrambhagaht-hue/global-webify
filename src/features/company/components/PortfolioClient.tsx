"use client";

import React, { useState, useEffect } from 'react';
import { ExternalLink, Globe } from 'lucide-react';
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
}

const getOptimizedUrl = (url: string) => {
  if (url && url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    if (!url.includes('q_auto')) {
      return url.replace('/upload/', '/upload/w_800,q_auto,f_auto/');
    }
  }
  return url;
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
      className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(26,139,76,0.12)] border border-gray-100 transition-shadow duration-500"
      style={{ animation: `fadeSlideIn 0.3s ease-out both ${index * 0.03}s` }}
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
          ref={imgRef}
          src={getOptimizedUrl(project.image)} 
          alt={project.title}
          title={project.title}
          className="w-full h-full object-cover object-top transition-[object-position] duration-[0.5s] group-hover/img:[transition-duration:var(--scroll-duration)] ease-linear group-hover/img:object-bottom"
          style={{ '--scroll-duration': scrollDuration } as React.CSSProperties}
          onLoad={(e) => calculateDuration(e.currentTarget.naturalHeight, e.currentTarget.naturalWidth)}
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

  let seoData = { targetedCountry: "", totalRanked: "", top10: "", top20: "", top30: "", sinceYear: "" };
  try {
    seoData = JSON.parse(project.tags);
  } catch(e) {}

  return (
    <div
      className="group flex flex-col md:flex-row bg-[#0B0626] rounded-3xl overflow-hidden shadow-xl w-full border border-gray-800 transition-shadow duration-500 max-w-[1000px] mx-auto"
      style={{ animation: `fadeSlideIn 0.3s ease-out both ${index * 0.03}s` }}
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
               <p className="text-gray-400 text-sm">Targeted Country : <span className="text-white font-medium">{seoData.targetedCountry}</span></p>
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

const VideoCard = ({ project, index }: { project: ProjectItem; index: number }) => {
  const hasImage = project.image && project.image.trim() !== "";
  const [isPlaying, setIsPlaying] = useState(!hasImage);
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

  return (
    <div
      className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(225,48,108,0.2)] border border-gray-100 transition-shadow duration-500"
      style={{ animation: `fadeSlideIn 0.3s ease-out both ${index * 0.03}s` }}
    >
      {/* Video Thumbnail / Iframe Area */}
      <div className={`relative w-full ${project.tags === "square" ? "aspect-square" : "aspect-[4/5] sm:aspect-[3/4]"} overflow-hidden bg-gray-50 p-2 sm:p-3 flex items-center justify-center group/img transition-all duration-300 border-b border-gray-100`}>
        <div className="w-full h-full relative rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 bg-white">
          {isPlaying && (
            <iframe 
               src={getInstagramEmbedUrl(project.link)}
               className="absolute inset-0 w-full h-full border-0 bg-white z-0"
               allowFullScreen
               scrolling="no"
               loading="lazy"
               onLoad={() => setIframeLoaded(true)}
            />
          )}

          {(!isPlaying || (isPlaying && hasImage && !iframeLoaded)) && (
            <div className="absolute inset-0 z-10 bg-white">
              <img 
                src={getOptimizedUrl(project.image)} 
                alt={project.title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? 'opacity-50' : 'opacity-80 group-hover/img:opacity-100 cursor-pointer'}`}
                loading={index < 6 ? "eager" : "lazy"}
                decoding="async"
                onClick={() => !isPlaying && setIsPlaying(true)}
              />
              {!isPlaying ? (
                <div 
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  onClick={() => setIsPlaying(true)}
                >
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover/img:scale-110 group-hover/img:bg-white/40 transition-all duration-300 shadow-2xl border border-white/40">
                     <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-white border-b-8 border-b-transparent ml-1"></div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin shadow-lg"></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Project Details */}
      <div className="p-5 flex flex-col flex-1 bg-white justify-between">
        <div>
          <div className="mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E1306C] bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100">
              Instagram Reel
            </span>
          </div>

          {project.title !== "Instagram Reel" && (
            <h3 className="text-[18px] md:text-[20px] font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#E1306C] transition-colors duration-300 line-clamp-2">
              {project.title}
            </h3>
          )}
          
          {project.desc && (
            <p className="text-gray-500 text-[13px] line-clamp-2 mb-4 leading-relaxed">
              {project.desc}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100 mt-auto">
          {!isPlaying ? (
            <button 
              onClick={() => setIsPlaying(true)}
              className="flex-1 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] hover:opacity-90 text-white text-center py-2.5 px-4 rounded-xl text-[14px] font-bold transition-opacity flex items-center justify-center gap-2 shadow-sm shadow-pink-900/20"
            >
              <span>Play Video Here</span>
            </button>
          ) : (
            <a 
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-center py-2.5 px-4 rounded-xl text-[14px] font-bold transition-colors flex items-center justify-center gap-2"
            >
              <span>Open in Instagram</span>
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default function PortfolioClient({ projects }: { projects: ProjectItem[] }) {
  const [activeCategory, setActiveCategory] = useState("Website");

  // Disable hover effects while user is actively scrolling
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      document.body.classList.add('disable-hover');
      clearTimeout(timer);
      timer = setTimeout(() => document.body.classList.remove('disable-hover'), 150);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(timer); document.body.classList.remove('disable-hover'); };
  }, []);

  // Silently prefetch remaining images one-by-one into browser cache (staggered to avoid bandwidth flood)
  useEffect(() => {
    const remaining = projects.slice(6); // first 6 are already eager-loaded
    const timers: ReturnType<typeof setTimeout>[] = [];
    remaining.forEach((p, i) => {
      timers.push(setTimeout(() => {
        const img = new window.Image();
        img.src = getOptimizedUrl(p.image);
      }, 800 + i * 200)); // start after 800ms, then one every 200ms
    });
    return () => timers.forEach(clearTimeout);
  }, [projects]);

  const baseCategories = ["Website", "CRM", "SEO", "Logo", "Graphics", "Videos"];
  const hiddenCategories = ["E-Commerce", "Web Development", "Corporate", "B2B Portal", "Informative", "Hospital And Diagnostics", "Medical And Healthcare", "Food And Beverages", "Restaurant Website", "Healthcare Website", "Education Portal"];

  const uniqueCategories = Array.from(new Set(projects.map(p => p.category).filter(Boolean)));
  const customCategories = uniqueCategories.filter(c => !baseCategories.includes(c) && !hiddenCategories.includes(c));

  const dynamicCategories = ["All", ...baseCategories, ...customCategories];

  const filteredProjects = projects.filter(p => {
    const isGlobalWebify = p.title.toLowerCase().includes("global webify") || p.title.toLowerCase().includes("globalwebify");
    
    if (isGlobalWebify && activeCategory !== "SEO") {
      return false;
    }

    if (activeCategory === "All") {
      return p.category !== "Videos";
    }
    if (activeCategory === "Website") {
      return p.category === "Website" || p.category === "SEO" || hiddenCategories.includes(p.category);
    }
    return p.category === activeCategory;
  });

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
                onClick={() => setActiveCategory(cat)}
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

        {/* Grid layout */}
        <div 
          className={`mx-auto ${activeCategory === "SEO" ? "flex flex-col gap-4 sm:gap-6 max-w-[1000px]" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-[1400px]"}`}
        >
          {filteredProjects.map((project, index) => {
            const isSEO = activeCategory === "SEO" && project.category === "SEO";
            return (
              <div key={project.id} className={!isSEO ? "h-full" : ""}>
                {isSEO ? (
                  <SeoCard project={project} index={index} />
                ) : project.category === "Videos" ? (
                  <VideoCard project={project} index={index} />
                ) : (
                  <ProjectCard project={project} index={index} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
