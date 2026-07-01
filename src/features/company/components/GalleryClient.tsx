"use client";

import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, RefreshCw, Maximize2, Play } from 'lucide-react';
import Image from 'next/image';
import { fetchGalleryItems } from '@/app/(company)/gallery/actions';

type Category = {
  id: number;
  name: string;
};

type GalleryItem = {
  id: number;
  url: string;
  itemType: string;
  categoryId: number | null;
  category?: { name: string } | null;
};

export default function GalleryClient({ 
  initialCategories = [], 
  initialItems = [] 
}: { 
  initialCategories?: Category[], 
  initialItems?: GalleryItem[] 
}) {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  // Infinite Scroll State
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialItems.length === 24);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const isInitialMount = useRef(true);

  // Handle Category Change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    let isMounted = true;
    
    // Clear items immediately to prevent flickering old photos in new category
    setItems([]);
    
    const loadCategory = async () => {
      setIsCategoryLoading(true);
      const newItems = (await fetchGalleryItems(0, 24, activeCategory)) || [];
      if (isMounted) {
        setItems(newItems as GalleryItem[]);
        setPage(1);
        setHasMore(newItems.length === 24);
        setIsCategoryLoading(false);
      }
    };
    
    loadCategory();
    
    return () => { isMounted = false; };
  }, [activeCategory]);

  // Load More Function
  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextItems = (await fetchGalleryItems(page * 24, 24, activeCategory)) || [];
    setItems(prev => [...prev, ...(nextItems as GalleryItem[])]);
    setPage(p => p + 1);
    setHasMore(nextItems.length === 24);
    setIsLoadingMore(false);
  };

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isCategoryLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, isCategoryLoading, page, activeCategory]);

  const optimizeUrl = (url: string) => {
    if (url.includes('cloudinary.com') && !url.includes('f_auto')) {
      const parts = url.split('/upload/');
      if (parts.length === 2) {
        return `${parts[0]}/upload/f_auto,q_auto/${parts[1]}`;
      }
    }
    return url;
  };

  const closeLightbox = () => {
    setSelectedIdx(null);
    resetTransformations();
  };

  const resetTransformations = () => {
    setZoomScale(1);
    setRotation(0);
  };

  const showPrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIdx === null) return;
    resetTransformations();
    setSelectedIdx((prevIdx) => (prevIdx === 0 ? items.length - 1 : prevIdx! - 1));
  };

  const showNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIdx === null) return;
    resetTransformations();
    setSelectedIdx((prevIdx) => (prevIdx === items.length - 1 ? 0 : prevIdx! + 1));
  };

  const zoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomScale((prev) => Math.min(prev + 0.25, 3));
  };

  const zoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomScale((prev) => Math.max(prev - 0.25, 0.75));
  };

  const rotateRight = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRotation((prev) => (prev + 90) % 360);
  };

  const resetTransforms = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetTransformations();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIdx]);

  useEffect(() => {
    if (selectedIdx !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedIdx]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 110, damping: 15 } 
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans relative overflow-hidden pb-20 sm:pb-28">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-100/30 blur-[130px] rounded-full -mr-72 -mt-72 pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-green-100/20 blur-[120px] rounded-full -ml-64 pointer-events-none" />

      <div className="relative z-10 container-custom">
        <div className="text-center mb-10 sm:mb-14 max-w-3xl mx-auto pt-6">
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-green-100/50 border border-green-200 px-4 py-1.5 rounded-full mb-4 shadow-sm"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#1a8b4c] animate-pulse" />
            <span className="text-[#1a8b4c] text-[12px] font-bold uppercase tracking-widest font-lexend">Our Culture & Workspace</span>
          </m.div>

          <m.h1 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-gray-900 mb-5 leading-tight"
          >
            Our <span className="text-[#2CA65A] underline decoration-green-200 decoration-4 sm:decoration-8 underline-offset-4">Gallery</span>
          </m.h1>
        </div>

        {initialCategories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10 px-4">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm ${
                activeCategory === null 
                  ? 'bg-[#1a8b4c] text-white shadow-md shadow-[#1a8b4c]/20' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1a8b4c] hover:text-[#1a8b4c]'
              }`}
            >
              All
            </button>
            {initialCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm ${
                  activeCategory === cat.id
                    ? 'bg-[#1a8b4c] text-white shadow-md shadow-[#1a8b4c]/20' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1a8b4c] hover:text-[#1a8b4c]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        <m.div 
          key={activeCategory ?? 'all'}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[1400px] mx-auto px-4"
        >
          {items.map((item, index) => (
            <m.div
              key={item.id}
              variants={itemVariants}
              onClick={() => setSelectedIdx(index)}
              className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(26,139,76,0.15)] border border-gray-100 transition-all duration-500 cursor-pointer"
            >
              {item.itemType === 'video' ? (
                <video
                  src={item.url}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  muted
                  playsInline
                  loop
                  onMouseOver={e => (e.target as HTMLVideoElement).play()}
                  onMouseOut={e => (e.target as HTMLVideoElement).pause()}
                />
              ) : (
                <Image
                  src={optimizeUrl(item.url)}
                  alt={`Global Webify Gallery ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  loading="lazy"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
              )}

              {item.itemType === 'video' && (
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-full p-2 text-white/90">
                  <Play size={14} fill="currentColor" />
                </div>
              )}

              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 backdrop-blur-[1px]">
                <div className="flex justify-between items-center transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                  <div>
                    <p className="text-green-300 text-[10px] font-bold uppercase tracking-widest font-lexend">
                      {item.category?.name || 'Gallery'}
                    </p>
                    <h4 className="text-white font-bold text-sm mt-0.5">View {item.itemType === 'video' ? 'Video' : 'Capture'}</h4>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white/95 text-[#1a8b4c] flex items-center justify-center shadow-md scale-90 group-hover:scale-100 transition-all duration-300">
                    {item.itemType === 'video' ? <Play size={16} strokeWidth={2.5} fill="currentColor" className="ml-1" /> : <Maximize2 size={16} strokeWidth={2.5} />}
                  </div>
                </div>
              </div>
            </m.div>
          ))}
          
          <div ref={loaderRef} className="w-full flex justify-center py-10 mt-8">
            {isLoadingMore && (
              <div className="flex items-center gap-2 text-[#1a8b4c]">
                <span className="w-5 h-5 rounded-full border-2 border-[#1a8b4c] border-t-transparent animate-spin"></span>
                <span className="font-semibold text-sm">Loading more...</span>
              </div>
            )}
          </div>

          {!isCategoryLoading && items.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500">
              No items found in this category.
            </div>
          )}
        </m.div>
      </div>

      <AnimatePresence>
        {selectedIdx !== null && items[selectedIdx] && (
          <div 
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-sm select-none"
            onClick={closeLightbox}
          >
            <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
              <span className="text-white/80 text-[13px] font-bold bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 font-lexend">
                {selectedIdx + 1} / {items.length}
              </span>
              
              {items[selectedIdx]?.itemType === 'image' && (
                <div className="flex items-center gap-1.5 pointer-events-auto bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 hidden md:flex">
                  <button onClick={zoomIn} className="p-2 text-white/80 hover:text-white transition-colors" title="Zoom In">
                    <ZoomIn size={18} strokeWidth={2.2} />
                  </button>
                  <button onClick={zoomOut} className="p-2 text-white/80 hover:text-white transition-colors" title="Zoom Out">
                    <ZoomOut size={18} strokeWidth={2.2} />
                  </button>
                  <button onClick={rotateRight} className="p-2 text-white/80 hover:text-white transition-colors" title="Rotate Right">
                    <RotateCw size={18} strokeWidth={2.2} />
                  </button>
                  <button onClick={resetTransforms} className="p-2 text-white/80 hover:text-white transition-colors border-l border-white/10 pl-2 ml-1" title="Reset">
                    <RefreshCw size={16} strokeWidth={2.2} />
                  </button>
                </div>
              )}

              <button
                onClick={closeLightbox}
                className="w-10 h-10 rounded-full bg-white/10 text-white border border-white/10 hover:bg-white hover:text-black flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 pointer-events-auto"
                aria-label="Close Lightbox"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <button
              onClick={showPrev}
              className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white hover:text-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-50 border border-white/10"
            >
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>

            <div className="w-full max-w-5xl max-h-[82vh] px-4 md:px-16 flex items-center justify-center overflow-hidden pointer-events-none">
              <m.div
                key={selectedIdx}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: zoomScale, rotate: `${rotation}deg` }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="relative max-w-full max-h-[82vh] flex items-center justify-center pointer-events-auto"
              >
                {items[selectedIdx].itemType === 'video' ? (
                  <video
                    src={items[selectedIdx].url}
                    controls
                    autoPlay
                    className="max-w-full max-h-[82vh] object-contain rounded-2xl shadow-2xl border border-white/5"
                  />
                ) : (
                  <img
                    src={optimizeUrl(items[selectedIdx].url)}
                    alt="Gallery Zoomed"
                    className="max-w-full max-h-[82vh] object-contain rounded-2xl shadow-2xl border border-white/5 select-none"
                    style={{ pointerEvents: 'none' }}
                  />
                )}
                <div className="absolute -bottom-16 bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl text-white/90 text-sm sm:text-base whitespace-nowrap shadow-xl">
                  {items[selectedIdx].category ? items[selectedIdx].category?.name : 'Gallery Item'}
                </div>
              </m.div>
            </div>
            <button
              onClick={showNext}
              className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white hover:text-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-50 border border-white/10"
            >
              <ChevronRight size={24} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
