"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, MessageCircle, Briefcase, X, ArrowRight } from 'lucide-react';
import { CITIES_MAP } from '@/features/services/constants/cities';

const projects = [
  {
    title: "ACS Ranchi",
    category: "CORPORATE SERVICES",
    image: "/ACS_Ranchi.webp",
    link: "https://acs-jn.com/"
  },
  {
    title: "Dr. Kumar Vishal",
    category: "HEALTHCARE PROFESSIONAL",
    image: "/Dr_Kumar_Vishal.webp",
    link: "https://drkumarvishal.com/"
  },
  {
    title: "Firayalal Public School",
    category: "EDUCATION PORTAL",
    image: "/Firayalal_Public_School_Ranchi.webp",
    link: "https://firayalalpublicschool.edu.in/"
  },
  {
    title: "Health Point Ranchi",
    category: "HEALTHCARE SERVICES",
    image: "/Health_Point_Ranchi.webp",
    link: "https://healthpointranchi.com/"
  },
  {
    title: "Kaveri Restaurant",
    category: "FOOD & BEVERAGES",
    image: "/Kaveri.webp",
    link: "https://kaveri-nextjs.vercel.app/"
  }
];

export default function MobileStickyNav() {
  const pathname = usePathname();
  const citySlugs = Object.keys(CITIES_MAP);
  const segments = pathname.split('/').filter(Boolean);
  const isCityHome = segments.length === 1 && citySlugs.includes(segments[0].toLowerCase());
  const isHomepage = pathname === '/' || isCityHome;

  const [animateCall, setAnimateCall] = useState(false);
  const [animateWhatsApp, setAnimateWhatsApp] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  const idleInterval = useRef<NodeJS.Timeout | null>(null);

  // Periodic Tingle Animation (Runs automatically on all pages, simultaneously)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    idleInterval.current = setInterval(() => {
      setAnimateCall(true);
      setAnimateWhatsApp(true);

      timer = setTimeout(() => {
        setAnimateCall(false);
        setAnimateWhatsApp(false);
      }, 600);
    }, 3000);

    return () => {
      if (idleInterval.current) clearInterval(idleInterval.current);
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Close drawer on path change
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  const navRef = useRef<HTMLDivElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    const handleFocus = (e: any) => {
      const target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        setIsInputFocused(true);
      }
    };
    const handleBlur = () => {
      setIsInputFocused(false);
    };
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);
    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  }, []);

  // Use visualViewport to fix Chrome address bar gap, but use DIRECT DOM MUTATION
  // instead of React state. This prevents re-renders, ensuring clicks are never dropped!
  // useLayoutEffect runs BEFORE browser paint — critical for iPhone first-load gap fix.
  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
  
  useIsomorphicLayoutEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    let rafId: number;

    const syncPosition = () => {
      const vv = window.visualViewport;
      if (!vv || !navRef.current) return;
      const offset = window.innerHeight - vv.height - vv.offsetTop;
      const newBottom = Math.max(0, Math.round(offset));
      navRef.current.style.bottom = `${newBottom}px`;
    };

    const handleVisualViewportChange = () => {
      rafId = requestAnimationFrame(syncPosition);
    };

    // Run IMMEDIATELY on mount — fixes iPhone 13 first-load gap
    syncPosition();

    window.visualViewport.addEventListener('resize', handleVisualViewportChange);
    window.visualViewport.addEventListener('scroll', handleVisualViewportChange);
    // Also listen to window scroll for edge cases where visualViewport doesn't fire
    window.addEventListener('scroll', handleVisualViewportChange, { passive: true });

    return () => {
      window.visualViewport?.removeEventListener('resize', handleVisualViewportChange);
      window.visualViewport?.removeEventListener('scroll', handleVisualViewportChange);
      window.removeEventListener('scroll', handleVisualViewportChange);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Helper: was this a genuine tap (not a scroll gesture)?
  const isTap = () => {
    if (touchStartY.current === null) return false;
    const elapsed = Date.now() - touchStartTime.current;
    return elapsed < 300; // fast tap = under 300ms
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (action: () => void) => (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    // If finger barely moved (<10px) and was quick, it's a tap
    if (deltaY < 10 && isTap()) {
      action();
      e.preventDefault();
    }
    touchStartY.current = null;
  };

  if (isInputFocused) return null;
  if (!isHomepage) return null;

  return (
    <React.Fragment>
      <div 
        ref={navRef}
        className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#1a8b4c] border-t border-white/20 shadow-[0_-8px_30px_rgba(0,0,0,0.25)] flex flex-col overflow-visible"
        style={{ 
          paddingBottom: 'env(safe-area-inset-bottom, 0px)'
        }}
      >
        {/* Safety overlay — extends full screen height below navbar to cover ANY possible gap on ANY device */}
        <div className="absolute top-full left-0 right-0 h-screen bg-[#1a8b4c] pointer-events-none" />

        {/* Background with very subtle noise or gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        {/* Buttons in a clear grid structure with inner height */}
        <div className="flex items-stretch h-[64px] w-full relative z-10">
          {[
            { 
              href: "tel:18008905489", 
              icon: <Phone size={22} />, 
              label: "Call", 
              type: "a" as const,
              animateState: animateCall,
            },
            { 
              href: "https://wa.me/917563901100", 
              icon: <MessageCircle size={22} />, 
              label: "WhatsApp", 
              type: "a" as const, 
              target: "_blank",
              animateState: animateWhatsApp,
            },
            { 
              href: undefined,
              icon: <Briefcase size={22} />, 
              label: "Our Work", 
              type: "drawer" as const,
              animateState: false,
              target: undefined,
            }
          ].map((item, i) => (
            <div
              key={item.label}
              className={`flex-1 flex border-white/20 relative overflow-hidden active:bg-white/10 ${i !== 2 ? 'border-r-[1.5px]' : ''}`}
              style={{ touchAction: 'manipulation' }}
            >
              {item.type === "a" ? (
                <a 
                  href={item.href}
                  target={item.target}
                  title={`${item.label} - Global Webify`}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd(() => {
                    if (item.target === "_blank") {
                      window.open(item.href, "_blank");
                    } else {
                      window.location.href = item.href || "";
                    }
                  })}
                  className="flex-1 flex flex-col items-center justify-center gap-1 text-white relative z-10 overflow-hidden"
                >
                  <div className={item.animateState ? "animate-tingle" : "animate-idle-bob"}>
                    {item.icon}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.15em]">{item.label}</span>

                  {item.animateState && (
                    <div className="absolute inset-y-0 w-[60%] bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-[-25deg] pointer-events-none z-0 animate-shimmer" />
                  )}
                </a>
              ) : (
                <button 
                  onClick={() => setIsDrawerOpen(true)}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd(() => setIsDrawerOpen(true))}
                  title={`${item.label} - Global Webify`}
                  className="flex-1 flex flex-col items-center justify-center gap-1 text-white relative z-10 w-full overflow-hidden"
                >
                  <div className="animate-idle-bob" style={{ animationDelay: '1s' }}>
                    {item.icon}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.15em]">{item.label}</span>
                </button>
              )}
            </div>
          ))}        </div>

        {/* Subtle bottom glow */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
      </div>

        {/* Backdrop */}
        <div 
          onClick={() => setIsDrawerOpen(false)} 
          className={`fixed inset-0 bg-black backdrop-blur-xs z-[99998] transition-opacity duration-300 ease-out ${
            isDrawerOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`} 
        />

        {/* Sidebar drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-[85%] max-w-[340px] bg-white z-[99999] shadow-2xl flex flex-col font-sans border-l border-gray-100 transition-transform duration-300 ease-out will-change-transform ${
            isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
              {/* Outer Scrollable Wrapper */}
              <div 
                className="flex-grow overflow-y-auto"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {/* Header */}
                <div className="p-5 pb-4 flex justify-between items-center bg-white">
                  <h3 className="font-sans font-black text-[#0f5132] text-xl tracking-tight">Recent Projects</h3>
                  <button 
                    onClick={() => setIsDrawerOpen(false)} 
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    aria-label="Close"
                  >
                    <X size={24} />
                  </button>
                </div>
                {/* Divider line under header */}
                <div className="mx-5 border-b border-[#e2f0e9] pb-0.5" />

                {/* Project List */}
                <div className="p-5 flex flex-col gap-5 bg-white">
                  {projects.map((project, idx) => (
                    <div 
                      key={idx} 
                      className="relative bg-white rounded-2xl overflow-hidden border border-[#e2f0e9] flex flex-col shadow-sm"
                    >
                      {/* Project Image */}
                      <div className="relative aspect-[16/10] w-full bg-slate-100">
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          <Image
                            src={project.image}
                            alt={project.title}
                            width={300}
                            height={188}
                            className="w-full h-auto block"
                          />
                        </a>
                      </div>
                      {/* Text Area with Soft Light Green Tint */}
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-4 sm:p-5 bg-[#f5faf7] border-t border-[#e2f0e9] flex flex-col text-left active:scale-[0.99] transition-transform"
                      >
                        <h4 className="text-[#0f5132] font-bold text-[16px] leading-snug font-sans">{project.title}</h4>
                        <p className="text-[#5c8b74] font-semibold text-[11px] tracking-wider uppercase font-sans mt-1.5">{project.category}</p>
                      </a>
                    </div>
                  ))}
                </div>

                {/* Footer CTA */}
                <div className="p-5 border-t border-gray-100 bg-white flex flex-col gap-2">
                  <Link 
                    href="/portfolio" 
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full bg-[#1a8b4c] hover:bg-[#15803d] text-white py-3.5 px-4 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-green-900/10"
                  >
                    <span className="font-sans font-black uppercase tracking-wider text-[12px]">See All Portfolio</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
    </React.Fragment>
  );
}
