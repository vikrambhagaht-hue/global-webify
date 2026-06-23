"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Phone, MessageCircle } from "lucide-react";
import { Section } from "../layout/Responsive/Section";
import dynamic from "next/dynamic";

// Lazy load AuditModal — not needed until user clicks
const AuditModal = dynamic(() => import("../ui/AuditModal"), { ssr: false });

// Allow SSR for AuditCardDesktop so HTML paints instantly (no white box), but JS animations load lazily.
const AuditCardDesktop = dynamic(() => import("../sections/AuditCardDesktop"));

// --- Colorful Google SVG Logo ---
const GoogleLogo = () => (
  <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    <path fill="none" d="M0 0h48v48H0z" />
  </svg>
);

// --- 1. Typing Headline ---
const TypingHeadline = ({ phrases = [] }: { phrases?: string[] }) => {
  const defaultPhrases = [
    "वेबसाइट जो ब्रांड भी बनाए, बिज़नेस भी बढ़ाए।",
    "Websites that build brands, and grow businesses.",
  ];
  const activePhrases = phrases.length > 0 ? phrases : defaultPhrases;

  const [currentText, setCurrentText] = useState(activePhrases[0] || "");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [mounted, setMounted] = useState(false);
  const [isFirstPause, setIsFirstPause] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset animation if phrases change dynamically
  useEffect(() => {
    if (activePhrases.length > 0) {
      setCurrentText(activePhrases[0]);
      setIsDeleting(false);
      setLoopNum(0);
      setTypingSpeed(100);
    }
  }, [activePhrases.join('|')]);

  useEffect(() => {
    if (!mounted || activePhrases.length === 0) return;
    
    const i = loopNum % activePhrases.length;
    const fullText = activePhrases[i];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText === fullText) {
          setIsDeleting(true);
          setTypingSpeed(isFirstPause ? 5000 : 3000);
          setIsFirstPause(false);
        } else {
          setCurrentText(fullText.substring(0, currentText.length + 1));
          setTypingSpeed(60);
        }
      } else {
        if (currentText === "") {
          setIsDeleting(false);
          setLoopNum(prev => prev + 1);
          setTypingSpeed(500);
        } else {
          setCurrentText(fullText.substring(0, currentText.length - 1));
          setTypingSpeed(30);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, loopNum, mounted, typingSpeed, activePhrases]);

  // Find the longest phrase to reserve space and prevent layout shift for SEO
  const longestPhrase = activePhrases.reduce((a, b) => a.length > b.length ? a : b, "");

  return (
    <div className="relative flex items-start justify-start w-full transition-all duration-300">
      <h1 className="text-[32px] sm:text-4xl md:text-[44px] font-extrabold md:font-black text-[#171717] leading-[1.35] tracking-tight text-left font-lexend">
        {/* SEO: hidden static text — Google reads this full phrase always */}
        <span className="sr-only">{activePhrases[0]}</span>
        {/* Invisible longest text to reserve exact layout space & prevent CLS */}
        <span className="invisible select-none" aria-hidden="true">
          {longestPhrase}
        </span>
        {/* Visual typing animation — absolutely positioned over the invisible text */}
        <span className="absolute top-0 left-0 w-full h-full" aria-hidden="true">
          {currentText}
          {/* CSS cursor blink */}
          <span className="inline-block w-[3px] h-[1em] bg-[#1a8b4c] ml-1 align-baseline relative top-[0.1em] animate-blink" />
        </span>
      </h1>
    </div>
  );
};


// --- 2b. Mobile Audit Card ---
const AuditCardMobile = () => (
  <div className="w-full max-w-[360px] mx-auto mt-4">
    <div className="bg-[#1F2937] rounded-t-[24px] p-1.5 shadow-xl border border-[#111827]">
      <div className="bg-[#F8FAFC] rounded-xl overflow-hidden text-left">
        <div className="bg-white border-b border-gray-200 px-3 py-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
            <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
            <div className="w-2 h-2 rounded-full bg-[#10b981]" />
          </div>
          <div className="bg-[#F8FAFC] border border-gray-200 text-gray-500 text-[8px] px-3 py-1 rounded flex-1 text-center font-mono truncate">
            https://audit.globalwebify.com/report
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <div className="text-left">
              <p className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Website Audit</p>
              <span className="text-sm font-black text-gray-900 leading-tight font-heading">globalwebify.com</span>
            </div>
            <span className="bg-[#DCFCE7] text-[#166534] text-[9px] font-bold px-2 py-1 rounded border border-[#BBF7D0]">A+</span>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { l: "PERF", v: 98 },
              { l: "ACC", v: 100 },
              { l: "BEST", v: 95 },
              { l: "SEO", v: 100 }
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-1.5 text-center shadow-sm">
                <div className="text-[11px] font-black text-gray-900">{stat.v}</div>
                <div className="text-[6px] font-black text-gray-500 uppercase">{stat.l}</div>
                <div className="h-1 w-full bg-gray-100 mt-1 rounded-full overflow-hidden">
                  <div className="h-full bg-[#10b981]" style={{ width: `${stat.v}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
            <div className="flex flex-col gap-2">
              {[
                { c: "bg-red-400", t: "Main-Thread", v: "1.2s" },
                { c: "bg-yellow-400", t: "Images", v: "145kb" },
                { c: "bg-green-400", t: "SEO", v: "Passed" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.c}`} />
                    <p className="text-[8px] font-bold text-gray-800">{item.t}</p>
                  </div>
                  <p className="text-[7px] font-black text-gray-500">{item.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="bg-[#374151] h-2 rounded-b-xl mx-3 shadow-xl opacity-80" />
  </div>
);

const badges = [
  { title: "Google Ad Partner", sub: "4.7 Rating", icon: <GoogleLogo /> },
  { title: "Meta Ad Partner", sub: "4.5 Rating", icon: <Image src="/meta-icon.svg" alt="Meta" width={32} height={32} className="object-contain" priority={true} /> },
  { title: "ISO Certified", sub: "ISO 9001:2015", icon: <Image src="/iso.png" alt="ISO" width={34} height={34} className="object-contain" priority={true} /> },
  { title: "AI Powered", sub: "Intelligent Solutions", icon: <Image src="/artificial-intelligence.png" alt="AI" width={34} height={34} className="object-contain" priority={true} /> },
];

export default function Hero({ 
  city, 
  heroTexts = [], 
  homepageHeroTitle,
  homepageHeroDesc,
  isMobile = false
}: { 
  city?: string; 
  heroTexts?: string[]; 
  homepageHeroTitle?: string;
  homepageHeroDesc?: string;
  isMobile?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="w-full relative overflow-hidden bg-white font-jost text-left">
      {/* Background Pattern - CSS background-image so it's not counted as LCP element */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none w-full h-full translate-y-[55px] md:translate-y-0 bg-cover bg-top opacity-[0.65] md:opacity-[0.8] saturate-[1.60] contrast-[1.15]"
        style={{ backgroundImage: 'url(/bg-pattern-landing.avif)' }}
        aria-hidden="true"
      />

      <Section 
        id="hero" 
        variant="transparent"
        spacing="hero" 
        className="z-10 pt-[100px] md:pt-[130px] lg:pt-[160px]"
      >
        <div className="flex flex-col min-[900px]:flex-row items-center justify-between gap-6 md:gap-8 lg:gap-10 xl:gap-12">

          {/* ---- LEFT COLUMN ---- */}
          <div className="flex-1 w-full flex flex-col items-center min-[900px]:items-start gap-1.5 md:gap-3 z-10 max-w-xl text-center min-[900px]:text-left">
            <div className="hidden md:inline-flex items-center gap-2.5 bg-[#E8F5EE] border-2 border-[#BBE3CB] text-[#1a8b4c] text-[10px] md:text-[11px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-sm mb-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a8b4c] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1a8b4c]" />
              </span>
              Accepting New Clients
            </div>

            {city ? (
              <div className="min-h-[160px] xs:min-h-[130px] sm:min-h-[110px] md:min-h-[115px] flex items-start justify-start w-full overflow-visible">
                <h1 
                  className="text-[32px] sm:text-3xl md:text-[38px] lg:text-[42px] font-extrabold md:font-black text-[#171717] leading-tight tracking-tight text-left font-sans font-lexend"
                  dangerouslySetInnerHTML={{ __html: homepageHeroTitle || `Your Website Isn’t Bringing Leads—and It’s Costing You Business in <span class="text-[#1a8b4c]">${city}</span>` }}
                />
              </div>
            ) : (
              <TypingHeadline phrases={heroTexts} />
            )}

            <div className="text-[#545454] text-[18px] md:text-[20px] font-normal max-w-lg leading-relaxed text-center min-[900px]:text-left font-jost mx-auto min-[900px]:mx-0">
              {city ? (
                <div 
                  className="block city-hero-desc"
                  dangerouslySetInnerHTML={{ __html: homepageHeroDesc || `We combine result-oriented Digital Marketing, modern Web Design, and branding strategies to help <span class="text-[#1a8b4c] font-bold">${city}</span> businesses stand out online and grow faster without wasted ad spend.` }}
                />
              ) : (
                <div 
                  className="block homepage-hero-desc"
                  dangerouslySetInnerHTML={{ __html: homepageHeroDesc || "We build AI-integrated websites that generate leads and scale your growth automatically." }}
                />
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-row gap-4 w-full mt-0 md:-mt-1 md:ml-4">
              <a href="tel:+917563901100" title="Free Consultation - Global Webify" className="flex-1 md:flex-none bg-gradient-to-r from-[#1cb05b] to-[#117846] hover:from-[#21c767] hover:to-[#158e53] text-white text-[14px] md:text-[16px] font-bold px-5 md:px-8 md:py-[18px] py-3 rounded-xl transition-all shadow-xl shadow-green-900/20 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap text-center inline-block">
                Free Consultation
              </a>
              <button onClick={() => setIsAuditOpen(true)} className="flex-1 md:flex-none bg-white border-2 border-[#15703d] hover:shadow-none text-[#15703d] hover:bg-green-50 text-[13px] md:text-[15px] font-bold px-4 md:px-7 md:py-4 py-2.5 rounded-xl transition-all shadow-md hover:-translate-y-0.5 cursor-pointer whitespace-nowrap">
                Get Free Audit
              </button>
            </div>

            {/* Badge grid */}
            <div className="grid grid-cols-2 gap-2 md:gap-4 w-full max-w-[480px] mt-1">
              {badges.map((badge, i) => (
                <div key={i} className="bg-white p-2.5 md:py-3 md:px-4 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-4 border-2 border-gray-200 shadow-sm transition-all hover:border-[#1a8b4c] hover:shadow-none hover:-translate-y-1 group">
                  <div className="w-8 h-8 md:w-12 md:h-12 shrink-0 flex items-center justify-center">
                    <div className="scale-75 md:scale-100 flex items-center justify-center">
                      {badge.icon}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-[13px] font-bold text-gray-900 leading-tight">{badge.title}</p>
                    <p className="text-[8px] md:text-[11px] font-medium text-gray-500 leading-tight">{badge.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Phone */}
            <div className="bg-white border-2 border-gray-200 shadow-sm p-3.5 md:p-4 rounded-2xl flex items-center justify-start gap-3 md:gap-4 w-full max-w-[480px] mt-1">
              <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full bg-green-50 flex items-center justify-center">
                <Phone className="text-[#1a8b4c] w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="text-left">
                <p className="text-[8px] md:text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Toll Free Number</p>
                <a href="tel:18008905489" title="Call Toll Free 1800-890-5489 - Global Webify" className="text-base md:text-lg font-bold text-gray-950 tracking-tight block hover:text-[#1a8b4c] transition-colors">1800-890-5489</a>
              </div>
            </div>
          </div>

          {/* ---- RIGHT COLUMN ---- */}
          <div className="w-full min-[900px]:flex-1 flex justify-center min-[900px]:justify-end relative z-10">
            {/* Desktop: lazy loaded with framer-motion 3D card. Skipped on mobile SSR to prevent DOM bloat. */}
            {!isMobile && (
              <div className="hidden md:block w-full">
                <AuditCardDesktop />
              </div>
            )}
            {/* Mobile: inline component, no framer-motion */}
            <div className="block md:hidden w-full">
              <AuditCardMobile />
            </div>
          </div>

        </div>
      </Section>

      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/917563901100"
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp - Global Webify"
        className="fixed bottom-[100px] md:bottom-4 right-4 z-50 bg-[#25D366] hover:bg-[#1DA851] text-white px-4 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline text-sm">WhatsApp</span>
      </a>
      
      <AuditModal isOpen={isAuditOpen} onClose={() => setIsAuditOpen(false)} />
    </main>
  );
}