"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, MessageSquare, TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";
const AuditModal = dynamic(() => import("../ui/AuditModal"), { ssr: false });

interface ServiceHeroProps {
  title: string;
  description?: string;
  city?: string;
  bgImage?: string;
  mobileImage?: string;
  bgType?: string;
  bgColor?: string;
  bgGradientStart?: string;
  bgGradientEnd?: string;
}

export default function ServiceHero({
  title,
  description,
  city,
  bgImage,
  mobileImage,
  bgType = 'image',
  bgColor,
  bgGradientStart,
  bgGradientEnd
}: ServiceHeroProps) {
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  // Format the title to highlight the main part in purple
  let rawTitle = title || "";
  
  // Clean up any {location} tags just in case they were passed raw
  if (city) {
    rawTitle = rawTitle.replace(/\{\s*location\s*\}/gi, city);
    
    // Automatically append the city if it's not already in the title
    if (!rawTitle.toLowerCase().includes(city.toLowerCase())) {
      rawTitle += ` ${city}`;
    }
  } else {
    rawTitle = rawTitle.replace(/\{\s*location\s*\}/gi, '').replace(/\s+in\s*$/i, '').trim();
  }

  let mainTitle = rawTitle;
  let locationPart = '';

  if (city && rawTitle.toLowerCase().endsWith(city.toLowerCase())) {
    mainTitle = rawTitle.substring(0, rawTitle.length - city.length).trim();
    locationPart = rawTitle.substring(rawTitle.length - city.length);
  }

  return (
    <section className="relative w-full min-h-[340px] md:min-h-[400px] py-8 md:py-14 flex items-center justify-center bg-gray-950 overflow-hidden border-b border-gray-900">
      
      {bgType === 'color' ? (
        <div 
          className="absolute inset-0 w-full h-full z-0" 
          style={{ backgroundColor: bgColor || '#062013' }}
        />
      ) : bgType === 'gradient' ? (
        <div 
          className="absolute inset-0 w-full h-full z-0" 
          style={{ backgroundImage: `linear-gradient(to right, ${bgGradientStart || '#062013'}, ${bgGradientEnd || '#0c3e25'})` }}
        />
      ) : bgType === 'image' && bgImage ? (
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src={bgImage}
            alt={title}
            title={`${title} - Global Webify`}
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gray-950/40 z-10" />
        </div>
      ) : (
        /* Fallback Default site-wide background */
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/web-dev-banner-bg.png"
            alt={title}
            title={`${title} - Global Webify`}
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gray-950/40 z-10" />
        </div>
      )}

      {/* Decorative Glow Elements */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl z-10 pointer-events-none" />

      {/* Hero Container */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 w-full relative z-20 flex justify-center">
        <div 
          className="w-full max-w-[1140px] rounded-[32px] p-5 sm:p-8 md:p-10 lg:p-12 flex flex-col items-start text-left border border-white/50 bg-white/85 md:bg-white/65 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] md:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)] backdrop-blur-none md:backdrop-blur-md"
        >
          {/* Location Badge (only if city is present) */}
          {city && (
            <div className="inline-flex items-center gap-1.5 text-gray-800 text-[11px] md:text-[13px] font-black uppercase tracking-wider mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a8b4c] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1a8b4c]" />
              </span>
              <span>{city}</span>
            </div>
          )}

          {/* Heading */}
          <h1 className="text-lg sm:text-xl md:text-[26px] lg:text-[30px] font-black font-heading text-gray-950 uppercase leading-tight tracking-wide mb-4 w-full break-words">
            <span className="text-purple-700">{mainTitle}</span>
            {locationPart && <span className="text-purple-700"> {locationPart}</span>}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-sm md:text-[15.5px] text-gray-800 leading-relaxed font-semibold w-full mb-8 break-words whitespace-normal">
              {description}
            </p>
          )}

          {/* Buttons */}
          <div className="grid grid-cols-2 md:flex md:flex-wrap items-center justify-start gap-2.5 md:gap-3 w-full">
            <Link
              href="/contact"
              title="Contact Us - Global Webify"
              className="text-white font-bold py-3.5 px-2 md:px-6 rounded-2xl shadow-md hover:shadow-lg hover:translate-y-[-1px] transition-all flex items-center justify-center gap-1.5 md:gap-2 text-[12px] md:text-[13.5px] tracking-wide"
              style={{
                background: 'linear-gradient(to right, #7c3aed, #4f46e5)',
                border: '1px solid #7c3aed'
              }}
            >
              Contact Us <ArrowRight size={15} />
            </Link>
            <a
              href="tel:+917563901100"
              title="Call Global Webify - Global Webify"
              className="text-white font-bold py-3.5 px-2 md:px-6 rounded-2xl shadow-sm hover:shadow-md hover:translate-y-[-1px] transition-all flex items-center justify-center gap-1.5 md:gap-2 text-[12px] md:text-[13.5px] tracking-wide"
              style={{
                background: 'linear-gradient(to right, #1f2937, #111827)',
                border: '1px solid #1f2937'
              }}
            >
              <Phone size={14} className="stroke-[2.5] text-white" /> Call
            </a>
            <a
              href="https://wa.me/917563901100"
              target="_blank"
              rel="noopener noreferrer"
              title="Chat on WhatsApp - Global Webify"
              className="text-white font-bold py-3.5 px-2 md:px-6 rounded-2xl shadow-md hover:shadow-lg hover:translate-y-[-1px] transition-all flex items-center justify-center gap-1.5 md:gap-2 text-[12px] md:text-[13.5px] tracking-wide"
              style={{
                background: 'linear-gradient(to right, #25D366, #1b8a4a)',
                border: '1px solid #25D366'
              }}
            >
              <MessageSquare size={14} className="fill-white stroke-none" /> WhatsApp
            </a>
            <button
              onClick={() => setIsAuditOpen(true)}
              className="text-white font-bold py-3.5 px-2 md:px-6 rounded-2xl shadow-md hover:shadow-lg hover:translate-y-[-1px] transition-all flex items-center justify-center gap-1.5 md:gap-2 text-[12px] md:text-[13.5px] tracking-wide"
              style={{
                background: 'linear-gradient(to right, #2563eb, #0891b2)',
                border: '1px solid #2563eb'
              }}
            >
              <TrendingUp size={14} className="stroke-[2.5] text-white" /> Free Audit
            </button>
          </div>
        </div>
      </div>
      <AuditModal isOpen={isAuditOpen} onClose={() => setIsAuditOpen(false)} />
    </section>
  );
}
