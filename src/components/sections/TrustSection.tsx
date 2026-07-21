"use client";

import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Award, Play, ChevronLeft, ChevronRight, X, Building2, TrendingUp, Handshake, BadgeCheck, Users2, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { Section } from '../layout/Responsive/Section';
import Link from 'next/link';
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

export default function TrustSection({ sectionTitle, sectionDesc, franchisees, sliderOnly = false }: { sectionTitle?: string; sectionDesc?: string, franchisees?: any[], sliderOnly?: boolean }) {
  const [certIndex, setCertIndex] = useState(0);
  const [franchiseeIndex, setFranchiseeIndex] = useState(0);
  const [selectedFranchisee, setSelectedFranchisee] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const hasFranchisees = franchisees && franchisees.length > 0;

  useEffect(() => {
    const timer = setInterval(() => {
      setCertIndex((prev) => (prev + 1) % certificates.length);
    }, 4000);
    
    // Create an array that includes only actual franchisees
    const totalItems = franchisees?.length || 0;
    let fTimer: NodeJS.Timeout;
    
    if (totalItems > 0) {
      fTimer = setInterval(() => {
        setFranchiseeIndex((prev) => (prev + 1) % totalItems);
      }, 3500);
    }
    
    return () => {
      clearInterval(timer);
      if (fTimer) clearInterval(fTimer);
    };
  }, [franchisees]);

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
      { rootMargin: '1000px' } // trigger download and play 1000px before reaching
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
            {sliderOnly ? (
              <><Users2 size={18} /> Franchise Network</>
            ) : (
              <><Award size={18} /> Accredited & Certified</>
            )}
          </div>
          {sectionTitle ? (
            <h2 
              className="text-[28px] md:text-[36px] font-black text-[#064e3b] leading-tight"
              dangerouslySetInnerHTML={{ __html: sectionTitle }}
            />
          ) : (
            <h2 className="text-[28px] md:text-[36px] font-black text-[#064e3b] leading-tight">
              {sliderOnly ? (
                <>Meet Our Franchise <span className="text-[#1a8b4c]">Partners</span></>
              ) : (
                <>Our Excellence <span className="text-[#1a8b4c]">Officially Certified</span></>
              )}
            </h2>
          )}
          {sectionDesc ? (
            <p 
              className="text-gray-500 mt-4 font-medium mx-auto max-w-3xl"
              dangerouslySetInnerHTML={{ __html: sectionDesc }}
            />
          ) : (
            <p className="text-gray-500 mt-4 font-medium mx-auto max-w-3xl text-[15px]">
              {sliderOnly 
                ? "Join our rapidly growing network of successful entrepreneurs and agencies delivering world-class digital solutions."
                : "We take pride in our industry-recognized certifications and proven digital framework that validate our commitment to quality and performance."}
            </p>
          )}
        </div>

        <div className={sliderOnly ? "flex justify-center items-center w-full" : "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center lg:items-stretch"}>
          
          {!sliderOnly && (
            <>
              {/* LEFT: Certificate Slideshow */}
              <div className={`${hasFranchisees ? 'lg:col-span-5' : 'lg:col-span-6'} w-full flex flex-col justify-center transition-all duration-500`}>
            <div className={`relative group ${!hasFranchisees ? 'w-full max-w-[500px] mx-auto' : ''}`}>
              <div className="aspect-[4/4.5] sm:aspect-square md:aspect-[4/4.2] bg-gray-50 rounded-[32px] border-4 border-gray-100 overflow-hidden shadow-2xl relative">
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
                
                {/* Navigation Buttons */}
                <button 
                  onClick={prevCert}
                  aria-label="Previous Certificate"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 shadow-lg rounded-full flex items-center justify-center text-gray-900 hover:bg-[#1a8b4c] hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none focus:ring-2 focus:ring-[#1a8b4c]"
                >
                  <ChevronLeft size={24} aria-hidden="true" />
                </button>
                <button 
                  onClick={nextCert}
                  aria-label="Next Certificate"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 shadow-lg rounded-full flex items-center justify-center text-gray-900 hover:bg-[#1a8b4c] hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none focus:ring-2 focus:ring-[#1a8b4c]"
                >
                  <ChevronRight size={24} aria-hidden="true" />
                </button>


              </div>
              
              {/* Pagination Dots for certificates */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {certificates.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCertIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 shadow-sm ${idx === certIndex ? 'w-8 bg-[#1a8b4c]' : 'w-2 bg-slate-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* MIDDLE/RIGHT: Portrait Video Player */}
          <div className={`${hasFranchisees ? 'lg:col-span-3' : 'lg:col-span-6'} w-full flex justify-center items-center py-6 lg:py-0 transition-all duration-500`}>
            <div className={`shrink-0 relative w-full ${hasFranchisees ? 'max-w-[280px] lg:max-w-full lg:w-[90%]' : 'max-w-[300px] mx-auto'}`}>
              <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full opacity-60 z-0 pointer-events-none" style={{ background: 'radial-gradient(circle, #dcfce7 0%, transparent 70%)' }} />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full opacity-60 z-0 pointer-events-none" style={{ background: 'radial-gradient(circle, #fef9c3 0%, transparent 70%)' }} />
              
              <div className="relative z-10 rounded-[32px] overflow-hidden border-8 border-white bg-black aspect-[9/16] shadow-2xl group w-full">
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
                  <div className="w-14 h-14 bg-[#1a8b4c]/90 rounded-full flex items-center justify-center text-white shadow-xl">
                    <Play size={24} fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          </>
        )}

          {/* RIGHT: Sliding Franchisees Div (ONLY IF FRANCHISEES EXIST) */}
          {hasFranchisees && (
            <div className={sliderOnly ? "w-full max-w-[420px] flex flex-col justify-center" : "lg:col-span-4 w-full flex flex-col justify-center"}>
              <div className="flex-1 w-full bg-gradient-to-b from-slate-50 to-white rounded-[32px] p-6 lg:p-8 border border-slate-100 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col justify-center relative overflow-hidden h-full">
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-50 rounded-full blur-3xl" />
                
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#1a8b4c] px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest mb-2 relative z-10 self-start">
                  <Users2 size={14} /> Franchise Network
                </div>
                <h3 className="text-lg lg:text-xl font-black text-slate-800 mb-6 relative z-10 uppercase tracking-wide">
                  Our Franchise <span className="text-[#1a8b4c]">Partners</span>
                </h3>
                
                <div className="relative flex-1 flex flex-col justify-center min-h-[240px] z-10">
                  <AnimatePresence mode="wait">
                    <m.div
                      key={franchiseeIndex}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-center cursor-pointer group"
                    >
                      {(() => {
                        const fList = franchisees || [];
                        const f = fList[franchiseeIndex];
                        if (!f) return null;
                        
                        return (
                          <div onClick={() => setSelectedFranchisee(f)} className="w-full flex flex-col items-center">
                            <div className="w-40 h-40 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner mb-5 group-hover:scale-105 transition-transform duration-500 relative">
                              {f.photo ? (
                                <img src={f.photo} alt={f.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400"><Users2 size={48} /></div>
                              )}
                            </div>
                            <h4 className="font-bold text-slate-900 text-[20px] leading-tight truncate w-full">{f.name}</h4>
                            {f.companyName && (
                              <p className="text-[12px] text-[#1a8b4c] font-black uppercase tracking-wider mt-1.5 truncate w-full">
                                {f.companyName}
                              </p>
                            )}
                          </div>
                        );
                      })()}
                    </m.div>
                  </AnimatePresence>
                </div>

                {/* Progress Dots for Franchisees */}
                {franchisees && franchisees.length > 1 && (
                  <div className="flex justify-center gap-2 mt-4 relative z-10">
                    {Array.from({ length: franchisees.length }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setFranchiseeIndex(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${i === franchiseeIndex ? 'w-6 bg-[#1a8b4c]' : 'w-2 bg-slate-200'}`}
                      />
                    ))}
                  </div>
                )}

                {/* Constant CTA Button */}
                {!sliderOnly && (
                  <div className="mt-6 w-full relative z-10">
                    <Link href="/franchisee" className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#1a8b4c] text-white font-bold rounded-xl hover:bg-[#15703d] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                      <Sparkles size={18} /> Become a Franchisee
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Franchisee Modal */}
      <AnimatePresence>
        {selectedFranchisee && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <m.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelectedFranchisee(null)}
            />
            <m.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-br from-[#1a8b4c] to-emerald-500 p-8 text-center relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <button 
                  onClick={() => setSelectedFranchisee(null)}
                  className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-white/20 shadow-xl bg-white mb-4">
                  {selectedFranchisee.photo ? (
                    <img src={selectedFranchisee.photo} alt={selectedFranchisee.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300"><Users2 size={40} /></div>
                  )}
                </div>
                <h3 className="text-2xl font-black text-white">{selectedFranchisee.name}</h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-white/90 text-xs font-bold mt-2">
                  <BadgeCheck size={14} className="text-emerald-100" />
                  Verified Partner
                </div>
              </div>
              <div className="p-8 space-y-5">
                {selectedFranchisee.companyName && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                      <Building2 size={18} className="text-[#1a8b4c]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Company Name</p>
                      <p className="font-semibold text-slate-800">{selectedFranchisee.companyName}</p>
                    </div>
                  </div>
                )}
                {selectedFranchisee.experience && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <TrendingUp size={18} className="text-[#1a8b4c]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experience</p>
                      <p className="font-semibold text-slate-800">{selectedFranchisee.experience}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                    <Handshake size={18} className="text-teal-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Joined Us</p>
                    <p className="font-semibold text-slate-800">
                      {new Date(selectedFranchisee.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>

    </Section>
  );
}
