"use client";

import React, { useState, useRef, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ExternalLink, Globe } from 'lucide-react';
import Image from 'next/image';

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

const ProjectCard = ({ project }: { project: ProjectItem }) => {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [containerHeight, setContainerHeight] = useState(320);
  const [imageHeight, setImageHeight] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const updateHeights = () => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
    if (imageRef.current) {
      setImageHeight(imageRef.current.clientHeight);
    }
  };

  useEffect(() => {
    updateHeights();
    
    // Ensure height is captured even if image is cached or loads instantly
    const img = imageRef.current;
    if (img) {
      if (img.complete) {
        updateHeights();
      }
      img.addEventListener('load', updateHeights);
      return () => img.removeEventListener('load', updateHeights);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      updateHeights();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <m.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(26,139,76,0.12)] border border-gray-100 transition-all duration-500"
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

      {/* Scrollable Screenshot Area - Clickable to Live Site */}
      <a 
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50 cursor-pointer block"
      >
        <div
          className="absolute top-0 left-0 w-full will-change-transform"
          style={{
            transform: isHovered && imageHeight > containerHeight 
              ? `translateY(-${imageHeight - containerHeight}px)` 
              : 'translateY(0px)',
            transitionProperty: 'transform',
            transitionDuration: isHovered 
              ? `${Math.max(0.1, (imageHeight - containerHeight) / 250)}s` 
              : '0.6s',
            transitionTimingFunction: isHovered ? 'linear' : 'ease-out'
          }}
        >
          <img 
            ref={imageRef}
            src={project.image} 
            alt={project.title}
            title={project.title}
            className="w-full h-auto block"
            loading={project.id <= 6 ? "eager" : "lazy"}
            onLoad={updateHeights}
          />
        </div>

        {/* Quick Hover Guidance Overlay */}
        <div className="absolute inset-0 bg-black/[0.02] pointer-events-none transition-opacity duration-300 hover:opacity-0" />
      </a>

      {/* Project Details */}
      <div className="p-5 flex flex-col flex-1 bg-white justify-between">
        <div>
          <div className="mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1a8b4c] bg-green-50 px-2.5 py-1 rounded-full">
              {project.category}
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
            className="flex-1 bg-[#1a8b4c] hover:bg-[#15803d] text-white text-center py-2.5 px-4 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 shadow-sm shadow-green-900/10 hover:shadow-md hover:shadow-green-900/20"
          >
            <span>Visit Live Site</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </m.div>
  );
};

export default function PortfolioClient({ projects }: { projects: ProjectItem[] }) {
  const [activeCategory, setActiveCategory] = useState("All");

  // Dynamically extract unique categories from projects
  const uniqueCategories = Array.from(new Set(projects.map(p => p.category).filter(Boolean)));
  const dynamicCategories = ["All", ...uniqueCategories];

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="pt-0 sm:pt-1 pb-16 sm:pb-24 bg-[#f8fafc] font-sans relative overflow-hidden min-h-screen">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-100/30 blur-[130px] rounded-full -mr-72 -mt-72" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-green-100/20 blur-[120px] rounded-full -ml-64" />

      <div className="relative z-10 container-custom">
        {/* Header Block */}
        <div className="text-center mb-8 sm:mb-10 max-w-3xl mx-auto">


          <m.h1 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading text-gray-900 mb-4 leading-tight"
          >
            Our <span className="text-[#2CA65A] underline decoration-green-200 decoration-4 sm:decoration-8 underline-offset-4">Portfolio</span>
          </m.h1>
          
          <m.p 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="text-gray-600 text-sm sm:text-base md:text-lg mb-5 leading-relaxed"
          >
            Discover our best website projects showcasing performance, UX, and reliability.
          </m.p>
        </div>

        {/* Filtering buttons - Full Width to prevent excessive wrapping */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 py-4 px-4 select-none w-full max-w-6xl mx-auto mb-10">
            {dynamicCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-[12px] sm:text-[13px] font-bold font-lexend transition-all duration-300 ${
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
        <m.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-[1400px] mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </m.div>
      </div>
    </div>
  );
}
