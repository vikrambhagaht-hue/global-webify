"use client";

import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, RefreshCw, Maximize2 } from 'lucide-react';
import Image from 'next/image';
import galleryImages from '@/data/gallery_scraped.json';

export default function GalleryClient() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  // Close lightbox
  const closeLightbox = () => {
    setSelectedIdx(null);
    resetTransformations();
  };

  // Reset transformations when changing slides or closing
  const resetTransformations = () => {
    setZoomScale(1);
    setRotation(0);
  };

  // Navigation handlers
  const showPrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIdx === null) return;
    resetTransformations();
    setSelectedIdx((prevIdx) => (prevIdx === 0 ? galleryImages.length - 1 : prevIdx! - 1));
  };

  const showNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIdx === null) return;
    resetTransformations();
    setSelectedIdx((prevIdx) => (prevIdx === galleryImages.length - 1 ? 0 : prevIdx! + 1));
  };

  // Zoom handlers
  const zoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomScale((prev) => Math.min(prev + 0.25, 3));
  };

  const zoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomScale((prev) => Math.max(prev - 0.25, 0.75));
  };

  // Rotate handler
  const rotateRight = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRotation((prev) => (prev + 90) % 360);
  };

  // Reset transform handler
  const resetTransforms = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetTransformations();
  };

  // Keyboard navigation
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

  // Prevent background scrolling when lightbox is open
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

  // Staggered entry animation settings
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 110, 
        damping: 15 
      } 
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans relative overflow-hidden pb-20 sm:pb-28">
      {/* Premium Background Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-100/30 blur-[130px] rounded-full -mr-72 -mt-72 pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-green-100/20 blur-[120px] rounded-full -ml-64 pointer-events-none" />

      <div className="relative z-10 container-custom">
        {/* Header Block */}
        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto pt-6">
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
          
          <m.p 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed px-4"
          >
            A sneak peek into our office life, teamwork sessions, celebratory events, and custom milestones. Meet the energy driving our digital agency forward.
          </m.p>
        </div>

        {/* Responsive Grid with Aspect Ratio Optimization and Next.js Image Optimization */}
        <m.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[1400px] mx-auto px-4"
        >
          {galleryImages.map((imagePath, index) => (
            <m.div
              key={index}
              variants={itemVariants}
              onClick={() => setSelectedIdx(index)}
              className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(26,139,76,0.15)] border border-gray-100 transition-all duration-500 cursor-pointer"
            >
              {/* Lazy Loaded Next.js Image */}
              <Image
                src={imagePath}
                alt={`Global Webify Event Photo ${index + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Glassmorphic Hover Overlay */}
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 backdrop-blur-[1px]">
                <div className="flex justify-between items-center transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                  <div>
                    <p className="text-green-300 text-[10px] font-bold uppercase tracking-widest font-lexend">Team & Office</p>
                    <h4 className="text-white font-bold text-sm mt-0.5">Workspace Capture #{index + 1}</h4>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white/95 text-[#1a8b4c] flex items-center justify-center shadow-md scale-90 group-hover:scale-100 transition-all duration-300">
                    <Maximize2 size={16} strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </m.div>
          ))}
        </m.div>
      </div>

      {/* Lightbox Modal with Sliding Transitions & Manipulation Controls */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <div 
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-sm select-none"
            onClick={closeLightbox}
          >
            {/* Top Bar with counter & controls */}
            <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
              <span className="text-white/80 text-[13px] font-bold bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 font-lexend">
                {selectedIdx + 1} / {galleryImages.length}
              </span>
              
              {/* Manipulation controls (Zoom, Rotate, Reset) */}
              <div className="flex items-center gap-1.5 pointer-events-auto bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <button
                  onClick={zoomIn}
                  className="p-2 text-white/80 hover:text-white transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn size={18} strokeWidth={2.2} />
                </button>
                <button
                  onClick={zoomOut}
                  className="p-2 text-white/80 hover:text-white transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut size={18} strokeWidth={2.2} />
                </button>
                <button
                  onClick={rotateRight}
                  className="p-2 text-white/80 hover:text-white transition-colors"
                  title="Rotate Right"
                >
                  <RotateCw size={18} strokeWidth={2.2} />
                </button>
                <button
                  onClick={resetTransforms}
                  className="p-2 text-white/80 hover:text-white transition-colors border-l border-white/10 pl-2 ml-1"
                  title="Reset Transformations"
                >
                  <RefreshCw size={16} strokeWidth={2.2} />
                </button>
              </div>

              <button
                onClick={closeLightbox}
                className="w-10 h-10 rounded-full bg-white/10 text-white border border-white/10 hover:bg-white hover:text-black flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 pointer-events-auto"
                aria-label="Close Lightbox"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Left navigation arrow */}
            <button
              onClick={showPrev}
              className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white hover:text-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-50 border border-white/10"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>

            {/* Image display container */}
            <div className="w-full max-w-5xl max-h-[82vh] px-4 md:px-16 flex items-center justify-center overflow-hidden pointer-events-none">
              <m.div
                key={selectedIdx}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: zoomScale, rotate: `${rotation}deg` }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="relative max-w-full max-h-[82vh] flex items-center justify-center pointer-events-auto"
              >
                <img
                  src={galleryImages[selectedIdx]}
                  alt={`Universal Gallery Zoomed ${selectedIdx + 1}`}
                  className="max-w-full max-h-[82vh] object-contain rounded-2xl shadow-2xl border border-white/5 select-none"
                  style={{ pointerEvents: 'none' }}
                />
              </m.div>
            </div>

            {/* Right navigation arrow */}
            <button
              onClick={showNext}
              className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white hover:text-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-50 border border-white/10"
              aria-label="Next image"
            >
              <ChevronRight size={24} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
