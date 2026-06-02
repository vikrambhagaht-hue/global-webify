"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, Briefcase, X, ArrowRight } from 'lucide-react';

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
  const [animateCall, setAnimateCall] = useState(false);
  const [animateWhatsApp, setAnimateWhatsApp] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const idleInterval = useRef<NodeJS.Timeout | null>(null);

  // Periodic Tingle Animation (Runs automatically on all pages, simultaneously)
  useEffect(() => {
    idleInterval.current = setInterval(() => {
      // Wiggle both Call and WhatsApp at the same time
      setAnimateCall(true);
      setAnimateWhatsApp(true);

      const timer = setTimeout(() => {
        setAnimateCall(false);
        setAnimateWhatsApp(false);
      }, 600);

      return () => clearTimeout(timer);
    }, 3000); // 3-second interval loop

    return () => {
      if (idleInterval.current) clearInterval(idleInterval.current);
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

  const getVariants = (delay: number) => ({
    tingle: {
      rotate: [0, -12, 12, -12, 12, 0],
      scale: [1, 1.15, 1.15, 1.15, 1.15, 1],
      transition: { duration: 0.5, ease: "easeInOut" }
    },
    idle: {
      rotate: 0,
      scale: 1,
      y: [0, -2, 0],
      transition: {
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay
        }
      }
    }
  });

  return (
    <>
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#1a8b4c] border-t border-white/20 shadow-[0_-8px_30px_rgba(0,0,0,0.25)] flex items-stretch h-[70px] safe-area-bottom overflow-hidden"
      >
        {/* Background with very subtle noise or gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        {/* Buttons in a clear grid structure */}
        {[
          { 
            href: "tel:18008905489", 
            icon: <Phone size={22} />, 
            label: "Call", 
            type: "a",
            animateState: animateCall,
            delay: 0
          },
          { 
            href: "https://wa.me/917563901100", 
            icon: <MessageCircle size={22} />, 
            label: "WhatsApp", 
            type: "a", 
            target: "_blank",
            animateState: animateWhatsApp,
            delay: 0.5
          },
          { 
            icon: <Briefcase size={22} />, 
            label: "Our Work", 
            type: "drawer",
            animateState: false,
            delay: 1.0
          }
        ].map((item, i) => (
          <motion.div
            key={item.label}
            className={`flex-1 flex border-white/20 ${i !== 2 ? 'border-r-[1.5px]' : ''}`}
            whileTap={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            {item.type === "a" ? (
              <a 
                href={item.href}
                target={item.target}
                className="flex-1 flex flex-col items-center justify-center gap-1.5 text-white transition-colors relative z-10"
              >
                <motion.div
                  animate={item.animateState ? "tingle" : "idle"}
                  variants={getVariants(item.delay)}
                >
                  {item.icon}
                </motion.div>
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">{item.label}</span>
              </a>
            ) : (
              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="flex-1 flex flex-col items-center justify-center gap-1.5 text-white transition-colors relative z-10 w-full"
              >
                <motion.div
                  animate={item.animateState ? "tingle" : "idle"}
                  variants={getVariants(item.delay)}
                >
                  {item.icon}
                </motion.div>
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">{item.label}</span>
              </button>
            )}
          </motion.div>
        ))}

        {/* Subtle bottom glow */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
      </motion.div>

      {/* Right Sidebar Drawer for Portfolio Showcase */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.5 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsDrawerOpen(false)} 
              className="fixed inset-0 bg-black z-[99998] backdrop-blur-xs" 
            />

            {/* Sidebar drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-[340px] bg-white z-[99999] shadow-2xl flex flex-col font-sans border-l border-gray-100"
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
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-auto block"
                            loading="lazy"
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
