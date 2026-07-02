"use client";

import React from 'react';
import { m } from 'framer-motion';
import { ArrowUpRight, Star, Award } from 'lucide-react';
import { Section } from '../layout/Responsive/Section';
import { AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    author: "Nirav Khatri",
    role: "Treezio",
    initials: "NK",
    text: "I'm extremely satisfied with the website created by Global Webify! The team was professional, responsive, and truly understood my vision. They delivered a clean, user-friendly, and visually appealing site that exceeded my expectations. Highly recommend their services for reliable and high-quality web development."
  },
  {
    author: "padmacourier14",
    role: "Website Development",
    initials: "PC",
    text: "I recently availed digital marketing services from Global Webify, and I must say, the experience has been exceptional! Their team is highly professional, knowledgeable, and dedicated to delivering results. Within just a few months, I noticed a significant increase in website traffic and brand visibility."
  },
  {
    author: "Suman Mahalder",
    role: "Website Development",
    initials: "SM",
    text: "I was impressed by Global Webify's creative approach to web design. They took the time to understand my brand and developed a custom solution that exceeded my expectations. Their team is talented, and their prices are competitive. Great value for the quality delivered!"
  }
];

export default function ResultsSection({ cardData, reviews, sectionTitle, sectionDesc }: { cardData?: any; reviews?: any[]; sectionTitle?: string; sectionDesc?: string }) {
  const [index, setIndex] = React.useState(0);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const checkDevice = () => {
      const isLargeHover = window.innerWidth >= 1024 && window.matchMedia('(hover: hover)').matches;
      setIsDesktop(prev => (prev !== isLargeHover ? isLargeHover : prev));
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const items = React.useMemo(() => {
    if (reviews && reviews.length > 0) {
      return reviews.map((r) => {
        const initials = r.author
          ? r.author
              .split(' ')
              .filter(Boolean)
              .map((n: string) => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase()
          : 'G';
        return {
          author: r.author,
          role: 'Google Review',
          initials,
          text: r.text,
          rating: r.rating,
        };
      });
    }
    return testimonials.map((t) => ({ ...t, rating: 5 }));
  }, [reviews]);

  React.useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items]);

  // Ensure index is within range of current items
  const safeIndex = index >= items.length ? 0 : index;
  const current = items[safeIndex] || items[0] || testimonials[0];

  return (
    <Section id="results" variant="white" className="pt-10 pb-20 md:pt-16 md:pb-32 bg-white font-sans overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Header Section */}
        <div className="mb-12 text-center">
          {sectionTitle ? (
            <h2 
              className="text-[28px] md:text-[36px] font-black text-[#064e3b] leading-tight tracking-tight"
              dangerouslySetInnerHTML={{ __html: sectionTitle }}
            />
          ) : (
            <h2 className="text-[28px] md:text-[36px] font-black text-[#064e3b] leading-tight tracking-tight">
              Results That Speak Louder Than <span className="text-[#1a8b4c]">Words</span>
            </h2>
          )}
          {sectionDesc ? (
            <p 
              className="text-gray-600 text-[14px] md:text-[16px] font-medium mt-3 max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{ __html: sectionDesc }}
            />
          ) : (
            <p className="text-gray-600 text-[14px] md:text-[16px] font-medium mt-3 max-w-2xl mx-auto">
              Explore our milestones, client success reviews, and AI-powered performance statistics that define our journey.
            </p>
          )}
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          
          {/* LEFT LARGE CARD: Main Info */}
          <m.div 
            initial={isDesktop ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
            whileInView={isDesktop ? { opacity: 1, x: 0 } : undefined}
            viewport={{ once: true, margin: "150px" }}
            className="lg:col-span-6 bg-gradient-to-br from-gray-950 to-[#022c22] shadow-2xl rounded-[40px] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group min-h-[450px]"
          >
            <div className="relative z-10">
              <h3 
                className="text-[28px] md:text-[36px] font-black text-[#1cb05b] leading-[1.1] mb-6"
                dangerouslySetInnerHTML={{ __html: cardData?.title || 'Data-Driven <br /> Growth Agency' }}
              />
              <div className="max-w-md">
                <p 
                  className={`text-white/75 font-normal text-[15px] md:text-[16px] leading-relaxed transition-all duration-500 ${isExpanded ? 'max-h-[1000px]' : 'line-clamp-6 max-h-[150px]'}`}
                  dangerouslySetInnerHTML={{ __html: (cardData?.content || 'We offer AI-powered digital marketing services to help businesses appear in Google AI, ChatGPT, and Perplexity recommendations.\n\nOur strategies are focused on sustainable, ethical, and conversion-oriented growth for brands worldwide.').replace(/\n/g, '<br />') }}
                />
              </div>
            </div>

            <div className="mt-12 flex items-start relative z-10">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-white/10 border-2 border-white/40 text-white px-8 py-3 rounded-full font-black text-[15px] hover:bg-[#1cb05b] hover:border-[#1cb05b] hover:text-white transition-all uppercase tracking-wider shadow-sm hover:shadow-lg"
              >
                {isExpanded ? 'Read Less' : (cardData?.buttonText || 'Read More')}
              </button>
            </div>

            {/* Decorative background circle - Optimized using radial-gradient */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full -mr-32 -mt-32 pointer-events-none hidden lg:block" style={{ background: 'radial-gradient(circle, rgba(26, 139, 76, 0.15) 0%, rgba(26, 139, 76, 0) 70%)' }} />
          </m.div>

          {/* MIDDLE COLUMN: Stats */}
          <div className="lg:col-span-3 flex flex-col gap-4 md:gap-6">
            
             {/* ROI Card */}
            <m.div 
              initial={isDesktop ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              whileInView={isDesktop ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true, margin: "150px" }}
              className="bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] shadow-xl shadow-blue-900/20 rounded-[32px] p-8 flex flex-col justify-center flex-1 group hover:-translate-y-1 transition-transform"
            >
              <h4 className="text-[42px] font-black text-white mb-2">350%</h4>
              <p className="text-green-300 text-[11px] font-black uppercase tracking-[0.2em] leading-tight">
                Average ROI <br /> Increase
              </p>
              <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <m.div 
                  initial={isDesktop ? { scaleX: 0 } : { scaleX: 1 }}
                  whileInView={isDesktop ? { scaleX: 1 } : undefined}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.1 }}
                  style={{ transformOrigin: "left" }}
                  className="h-full bg-blue-400 w-[85%]"
                />
              </div>
            </m.div>

            {/* Leads Card */}
            <m.div 
              initial={isDesktop ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              whileInView={isDesktop ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true, margin: "150px" }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-[#1e1b4b] to-[#4c1d95] shadow-xl shadow-purple-900/20 rounded-[32px] p-8 flex flex-col justify-center flex-1 text-white group hover:-translate-y-1 transition-transform"
            >
              <h4 className="text-[42px] font-black text-white mb-2">12k+</h4>
              <p className="text-green-300 text-[11px] font-black uppercase tracking-[0.2em] leading-tight">
                Leads <br /> Generated
              </p>
              <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <m.div 
                  initial={isDesktop ? { scaleX: 0 } : { scaleX: 1 }}
                  whileInView={isDesktop ? { scaleX: 1 } : undefined}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                  style={{ transformOrigin: "left" }}
                  className="h-full bg-purple-400 w-[95%]"
                />
              </div>
            </m.div>
          </div>

          {/* RIGHT COLUMN: Testimonial Slider */}
          <m.div 
            initial={isDesktop ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
            whileInView={isDesktop ? { opacity: 1, x: 0 } : undefined}
            viewport={{ once: true, margin: "150px" }}
            className="lg:col-span-3 bg-[#f3f4f6] rounded-[40px] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden group min-h-[450px]"
          >
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="flex gap-1 mb-6 text-yellow-500">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={20}
                    fill={idx < (current.rating || 5) ? "currentColor" : "none"}
                    stroke="currentColor"
                  />
                ))}
              </div>

              <div className="flex-1 relative h-[280px] overflow-hidden">
                <AnimatePresence mode="wait">
                  <m.p 
                    key={safeIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-800 font-medium text-[14px] md:text-[15px] italic leading-relaxed"
                  >
                    "{current.text}"
                  </m.p>
                </AnimatePresence>
              </div>
            </div>

            <div className="relative z-10 mt-auto">
              <m.div 
                key={`author-${safeIndex}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 mb-8"
              >
                <div className="w-12 h-12 bg-purple-200 text-purple-700 rounded-full flex items-center justify-center font-black text-lg">
                  {current.initials}
                </div>
                <div>
                  <h5 className="font-black text-gray-950 text-[15px]">{current.author}</h5>
                  <p className="text-gray-600 text-[11px] font-bold">{current.role}</p>
                </div>
              </m.div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {items.length <= 6 ? (
                    items.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === safeIndex ? 'w-6 bg-[#1a8b4c]' : 'w-1.5 bg-gray-300'}`} 
                      />
                    ))
                  ) : (
                    <span className="text-[11px] font-bold text-gray-500 font-poppins uppercase tracking-wider">
                      Review <span className="text-[#1a8b4c] font-black">{safeIndex + 1}</span> of <span className="font-black">{items.length}</span>
                    </span>
                  )}
                </div>
                {/* Removed external link icon */}
              </div>
            </div>

            {/* Corner styling */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 rounded-bl-[40px] z-0" />
          </m.div>

        </div>

        {/* Bottom stats row - Optimized for Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-6">
          <m.div 
            initial={isDesktop ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            whileInView={isDesktop ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true, margin: "150px" }}
            className="bg-[#f0fdf4] border border-[#1a8b4c]/10 shadow-lg shadow-[#1a8b4c]/5 rounded-[24px] md:rounded-[32px] p-5 md:p-6 flex flex-col md:flex-row items-center justify-between group hover:border-[#1a8b4c]/30 transition-all text-center md:text-left"
          >
            <div>
              <h4 className="text-[28px] md:text-[36px] font-black text-gray-950 leading-none mb-1">98%</h4>
              <p className="text-gray-500 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em]">Retention</p>
            </div>
            <div className="hidden md:flex w-12 h-12 bg-gray-50 text-[#1a8b4c] rounded-full items-center justify-center group-hover:bg-[#1a8b4c] group-hover:text-white transition-colors shadow-sm">
              <Star size={24} fill="currentColor" />
            </div>
          </m.div>

          <m.div 
            initial={isDesktop ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            whileInView={isDesktop ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true, margin: "150px" }}
            transition={{ delay: 0.05 }}
            className="bg-[#f0fdf4] border border-[#1a8b4c]/10 shadow-lg shadow-[#1a8b4c]/5 rounded-[24px] md:rounded-[32px] p-5 md:p-6 flex flex-col md:flex-row items-center justify-between group hover:border-[#1a8b4c]/30 transition-all text-center md:text-left"
          >
            <div>
              <h4 className="text-[28px] md:text-[36px] font-black text-gray-950 leading-none mb-1">10+</h4>
              <p className="text-gray-500 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em]">Years Experience</p>
            </div>
            <div className="hidden md:flex w-12 h-12 bg-gray-50 text-[#1a8b4c] rounded-full items-center justify-center group-hover:bg-[#1a8b4c] group-hover:text-white transition-colors shadow-sm">
              <Award size={24} />
            </div>
          </m.div>

          <m.div 
            initial={isDesktop ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            whileInView={isDesktop ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true, margin: "150px" }}
            transition={{ delay: 0.1 }}
            className="bg-[#f0fdf4] border border-[#1a8b4c]/10 shadow-lg shadow-[#1a8b4c]/5 rounded-[24px] md:rounded-[32px] p-5 md:p-6 flex flex-col md:flex-row items-center justify-between group hover:border-[#1a8b4c]/30 transition-all text-center md:text-left"
          >
            <div>
              <h4 className="text-[28px] md:text-[36px] font-black text-gray-950 leading-none mb-1">24/7</h4>
              <p className="text-gray-500 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em]">Support</p>
            </div>
            <div className="hidden md:flex w-12 h-12 bg-gray-50 text-[#1a8b4c] rounded-full items-center justify-center group-hover:bg-[#1a8b4c] group-hover:text-white transition-colors shadow-sm">
              <ArrowUpRight size={24} />
            </div>
          </m.div>
        </div>
      </div>
    </Section>
  );
}
