"use client";

import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Award, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { Section } from '../layout/Responsive/Section';
import Image from 'next/image';

const certificates = [
  "/Certificate1.avif",
  "/Certificate2.avif",
  "/Certificate3.avif",
  "/Certificate4.avif",
  "/Certificate5.avif",
  "/Certificate6.avif",
  "/Certificate7.avif",
];

export default function TrustSection({ sectionTitle, sectionDesc }: { sectionTitle?: string; sectionDesc?: string }) {
  const [certIndex, setCertIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCertIndex((prev) => (prev + 1) % certificates.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start downloading and playing only when in view
            videoElement.play().catch(e => console.log("Autoplay prevented:", e));
          } else {
            videoElement.pause();
          }
        });
      },
      { threshold: 0.1 } // trigger when 10% visible
    );

    observer.observe(videoElement);
    return () => observer.disconnect();
  }, []);

  const nextCert = () => setCertIndex((prev) => (prev + 1) % certificates.length);
  const prevCert = () => setCertIndex((prev) => (prev - 1 + certificates.length) % certificates.length);

  return (
    <Section id="trust" variant="transparent" className="bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Header Section - Centered at the Top */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-50 text-[#15703d] px-4 py-2 rounded-full text-[12px] font-black uppercase tracking-widest mb-4">
            <Award size={18} /> Accredited & Certified
          </div>
          {sectionTitle ? (
            <h2 
              className="text-[28px] md:text-[36px] font-black text-gray-950 leading-tight"
              dangerouslySetInnerHTML={{ __html: sectionTitle }}
            />
          ) : (
            <h2 className="text-[28px] md:text-[36px] font-black text-gray-950 leading-tight">
              Our Excellence <span className="text-[#1a8b4c]">Officially Certified</span>
            </h2>
          )}
          {sectionDesc ? (
            <p 
              className="text-gray-500 mt-4 font-medium mx-auto"
              dangerouslySetInnerHTML={{ __html: sectionDesc }}
            />
          ) : (
            <p className="text-gray-500 mt-4 font-medium mx-auto">
              We take pride in our industry-recognized certifications and proven digital framework that validate our commitment to quality and performance.
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* LEFT: Certificate Slideshow */}
          <div className="w-full lg:w-3/5">
            <div className="relative group">
              <div className="aspect-[4/3] bg-gray-50 rounded-[32px] border-4 border-gray-100 overflow-hidden shadow-2xl relative">
                <AnimatePresence mode="popLayout">
                  <m.div
                    key={certIndex}
                    initial={{ opacity: 0, scale: 0.95, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 1.05, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 p-4 flex items-center justify-center bg-white"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={certificates[certIndex]}
                        alt={`Global Webify Certification ${certIndex + 1}`}
                        title={`Global Webify Certification ${certIndex + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={true}
                      />
                    </div>
                  </m.div>
                </AnimatePresence>
                
                {/* Removed eager image preloader to significantly reduce initial network payload */}

                {/* Navigation Buttons */}
                <button 
                  onClick={prevCert}
                  aria-label="Previous Certificate"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur shadow-lg rounded-full flex items-center justify-center text-gray-900 hover:bg-[#1a8b4c] hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none focus:ring-2 focus:ring-[#1a8b4c]"
                >
                  <ChevronLeft size={24} aria-hidden="true" />
                </button>
                <button 
                  onClick={nextCert}
                  aria-label="Next Certificate"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur shadow-lg rounded-full flex items-center justify-center text-gray-900 hover:bg-[#1a8b4c] hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none focus:ring-2 focus:ring-[#1a8b4c]"
                >
                  <ChevronRight size={24} aria-hidden="true" />
                </button>
              </div>

              {/* Progress Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {certificates.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCertIndex(i)}
                    aria-label={`Go to certificate ${i + 1}`}
                    className={`h-3 rounded-full transition-all duration-300 outline-none focus:ring-2 focus:ring-[#1a8b4c] focus:ring-offset-2 ${i === certIndex ? 'w-8 bg-[#1a8b4c]' : 'w-3 bg-gray-200'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Portrait Video Player */}
          <div className="w-full lg:w-2/5 flex justify-center">
            <div className="relative w-full max-w-[320px]">
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-green-100 rounded-full blur-2xl opacity-60 z-0" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-100 rounded-full blur-3xl opacity-60 z-0" />
              
              <div className="relative z-10 rounded-[40px] overflow-hidden border-8 border-white bg-black aspect-[9/16] shadow-2xl group">
                <video 
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  controls
                  muted
                  loop
                  playsInline
                  preload="none"
                >
                  <source src="/videoplayback.mp4" type="video/mp4" />
                  <track kind="captions" src="/placeholder.txt" srcLang="en" label="English" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-[#1a8b4c]/80 rounded-full flex items-center justify-center text-white shadow-xl backdrop-blur-sm">
                    <Play size={28} fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Section>
  );
}
