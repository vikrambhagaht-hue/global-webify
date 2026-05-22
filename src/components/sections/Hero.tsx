"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { Section } from "../layout/Responsive/Section";
import AuditModal from "../ui/AuditModal";

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
  }, [JSON.stringify(activePhrases)]);

  useEffect(() => {
    if (!mounted || activePhrases.length === 0) return;
    
    const i = loopNum % activePhrases.length;
    const fullText = activePhrases[i];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText === fullText) {
          setIsDeleting(true);
          setTypingSpeed(3000);
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

  return (
    <div className="min-h-[120px] md:min-h-[160px] flex items-start w-full overflow-visible">
      <h1 className="text-[28px] sm:text-4xl md:text-[44px] font-bold text-gray-950 leading-relaxed tracking-normal text-left font-lexend">
        {currentText}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-[3px] h-[1em] bg-[#1a8b4c] ml-1 align-baseline relative top-[0.1em]"
        />
      </h1>
    </div>
  );
};

// --- 2a. Desktop Audit Card ---
const AuditCardDesktop = () => {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [0, 1], [8, -8]);
  const rotateY = useTransform(mouseXSpring, [0, 1], [-8, 8]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width);
    y.set((event.clientY - rect.top) / rect.height);
  }

  return (
    <motion.div
      style={{ perspective: 1200 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0.5); y.set(0.5); }}
      className="w-full max-w-[540px] mx-auto cursor-default z-20 relative"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.025, y: -8, boxShadow: "0px 28px 56px -12px rgba(26,139,76,0.22)" }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-[#1F2937] p-2.5 rounded-3xl shadow-2xl flex border border-[#111827] w-full"
      >
        <div className="w-12 shrink-0 flex flex-col gap-3 py-6 items-center bg-[#111827] rounded-l-[18px] border-r border-gray-800">
          <div className="w-6 h-6 rounded-md bg-[#22c55e]" />
          <div className="w-6 h-6 rounded-md bg-[#374151]" />
          <div className="w-6 h-6 rounded-md bg-[#374151]" />
          <div className="w-6 h-6 rounded-md bg-[#374151]" />
          <div className="w-6 h-6 rounded-md bg-[#22c55e] mt-4" />
        </div>
        <div className="flex-1 bg-[#F8FAFC] rounded-r-[18px] overflow-hidden flex flex-col min-w-0 text-left">
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
            <div className="flex gap-2 shrink-0">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
              <div className="w-3 h-3 rounded-full bg-[#10b981]" />
            </div>
            <div className="bg-[#F8FAFC] border border-gray-200 text-gray-500 text-[10px] px-4 py-1.5 rounded-lg flex-1 text-center font-mono truncate">
              https://audit.globalwebify.com/report
            </div>
          </div>
          <div className="p-5 flex-1">
            <div className="flex justify-between items-center mb-5 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-left">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Website Audit Report</p>
                <h3 className="text-lg font-black text-gray-900 font-heading">globalwebify.com</h3>
              </div>
              <span className="bg-[#DCFCE7] text-[#166534] text-[11px] font-bold px-3 py-2 rounded-lg border border-[#BBF7D0] whitespace-nowrap">Grade A+</span>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-5">
              {[
                { label: "PERFORMANCE", val: "98" },
                { label: "ACCESSIBILITY", val: "100" },
                { label: "BEST PRACTICES", val: "95" },
                { label: "SEO", val: "100" },
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-2.5 text-center shadow-sm flex flex-col items-center">
                  <div className="text-2xl font-black text-gray-900 mb-1 font-heading">{stat.val}</div>
                  <div className="text-[7px] uppercase font-bold text-gray-400 mb-2 tracking-wider w-full truncate">{stat.label}</div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#10b981]" style={{ width: `${stat.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <p className="text-[10px] font-bold text-gray-700 mb-3 text-left uppercase">Critical Optimization Opportunities</p>
              <div className="flex flex-col gap-2.5">
                {[
                  { icon: "🔴", title: "Minimize Main-Thread Work", sub: "Reduce JS parse time by 1.2s", badge: "HIGH IMPACT", badgeColor: "bg-red-100 text-red-700" },
                  { icon: "🟡", title: "Serve Images in Next-Gen Formats", sub: "Potential savings: 145 KiB", badge: "MED IMPACT", badgeColor: "bg-yellow-100 text-yellow-700" },
                  { icon: "🟢", title: "Ensure Text Remains Visible", sub: "All fonts loaded correctly", badge: "PASSED", badgeColor: "bg-green-100 text-green-700" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 text-left">
                    <div className="flex items-start gap-2 min-w-0">
                      <span className="text-[11px] mt-0.5 shrink-0">{item.icon}</span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-gray-900 truncate">{item.title}</p>
                        <p className="text-[9px] text-gray-500 truncate">{item.sub}</p>
                      </div>
                    </div>
                    <span className={`shrink-0 text-[8px] font-bold px-2 py-0.5 rounded ${item.badgeColor}`}>{item.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
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
          <div className="bg-[#F8FAFC] border border-gray-200 text-gray-400 text-[8px] px-3 py-1 rounded flex-1 text-center font-mono truncate">
            https://audit.globalwebify.com/report
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <div className="text-left">
              <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">Website Audit</p>
              <h3 className="text-sm font-black text-gray-900 leading-tight font-heading">globalwebify.com</h3>
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
                <div className="text-[6px] font-black text-gray-400 uppercase">{stat.l}</div>
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
                    <p className="text-[8px] font-bold text-gray-700">{item.t}</p>
                  </div>
                  <p className="text-[7px] font-black text-gray-400">{item.v}</p>
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
  { title: "Google Ad Partner", sub: "4.9 Rating", icon: <GoogleLogo /> },
  { title: "Meta Ad Partner", sub: "4.5 Rating", icon: <Image src="/meta-icon.svg" alt="Meta" width={32} height={32} className="object-contain" /> },
  { title: "ISO Certified", sub: "ISO 9001:2015", icon: <Image src="/iso.png" alt="ISO" width={34} height={34} className="object-contain" /> },
  { title: "AI Powered", sub: "Intelligent Solutions", icon: <Image src="/artificial-intelligence.png" alt="AI" width={34} height={34} className="object-contain" /> },
];

export default function Hero({ 
  city, 
  heroTexts = [], 
  cityHeroSettings,
  homepageHeroDesc
}: { 
  city?: string; 
  heroTexts?: string[]; 
  cityHeroSettings?: { title: string; description: string } | null;
  homepageHeroDesc?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [paddingTop, setPaddingTop] = useState(80);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateHeaderHeight = () => {
      const header = document.querySelector("header");
      if (header) {
        const height = header.offsetHeight;
        setPaddingTop(window.innerWidth < 768 ? height + 10 : height + 30);
      }
    };
    
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  return (
    <main className="w-full relative overflow-x-hidden bg-white font-sans text-left">
      {/* Optimized Background Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
        <Image
          src="/bg-pattern-landing.avif"
          alt="Background Pattern"
          fill
          priority
          className="object-cover object-top opacity-[0.6] saturate-[1.2]"
        />
      </div>

      <Section 
        id="hero" 
        variant="transparent"
        spacing="hero" 
        className="z-10"
        style={{ paddingTop }}
      >
        <div className="flex flex-col min-[900px]:flex-row items-center justify-between gap-6 md:gap-8 lg:gap-10 xl:gap-12">

          {/* ---- LEFT COLUMN ---- */}
          <div className="flex-1 w-full flex flex-col items-start gap-3 md:gap-5 z-10 max-w-xl text-left">
            <div className="inline-flex items-center gap-2.5 bg-[#E8F5EE] border-2 border-[#BBE3CB] text-[#1a8b4c] text-[10px] md:text-[11px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a8b4c] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1a8b4c]" />
              </span>
              Accepting New Clients
            </div>

            {city ? (
              <div className="min-h-[120px] md:min-h-[160px] flex items-start w-full overflow-visible">
                <h1 
                  className="text-[25px] sm:text-3xl md:text-[38px] lg:text-[42px] font-bold text-gray-950 leading-relaxed tracking-normal text-left font-lexend"
                  dangerouslySetInnerHTML={{ __html: cityHeroSettings?.title || `Your Website Isn’t Bringing Leads—and It’s Costing You Business in <span class="text-[#1a8b4c]">${city}</span>` }}
                />
              </div>
            ) : (
              <TypingHeadline phrases={heroTexts} />
            )}

            <div className="text-gray-900 text-[14px] md:text-[16px] font-medium max-w-lg leading-relaxed text-left mt-2">
              {city ? (
                <div 
                  className="text-sm md:text-[15px] font-semibold text-gray-700 block city-hero-desc"
                  dangerouslySetInnerHTML={{ __html: cityHeroSettings?.description || `We combine result-oriented Digital Marketing, modern Web Design, and branding strategies to help <span class="text-[#1a8b4c] font-bold">${city}</span> businesses stand out online and grow faster without wasted ad spend.` }}
                />
              ) : (
                <div 
                  className="text-sm md:text-[15px] font-semibold text-gray-700 block homepage-hero-desc"
                  dangerouslySetInnerHTML={{ __html: homepageHeroDesc || "We build AI-integrated websites that generate leads and scale your growth automatically." }}
                />
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-row gap-4 w-full mt-1">
              <a href="tel:+917563901100" className="flex-1 bg-[#1a8b4c] hover:bg-[#14733e] text-white text-[14px] font-bold px-5 py-3.5 md:py-4 rounded-xl transition-all shadow-xl shadow-green-700/20 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap text-center inline-block">
                Free Consultation →
              </a>
              <button onClick={() => setIsAuditOpen(true)} className="flex-1 bg-white border-2 border-[#1a8b4c] text-[#1a8b4c] hover:bg-green-50 text-[14px] font-bold px-5 py-3.5 md:py-4 rounded-xl transition-all shadow-md hover:-translate-y-0.5 cursor-pointer whitespace-nowrap">
                Get Free Audit
              </button>
            </div>

            {/* Badge grid */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-[540px] mt-1">
              {badges.map((badge, i) => (
                <div key={i} className="bg-white p-3.5 md:p-4 rounded-2xl flex items-center gap-3 md:gap-4 border-2 border-gray-200 transition-all hover:border-[#1a8b4c] hover:shadow-lg hover:-translate-y-1 shadow-sm group">
                  <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full flex items-center justify-center border-2 border-gray-100 bg-gray-50 group-hover:bg-green-50 group-hover:border-green-100 transition-colors">
                    {badge.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] md:text-[12.5px] font-black text-gray-950 truncate">{badge.title}</p>
                    <p className="text-[9px] md:text-[10px] font-bold text-gray-500 truncate">{badge.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Phone */}
            <a href="tel:18008905489" className="bg-white border-2 border-gray-200 shadow-sm p-3.5 md:p-4 rounded-2xl flex items-center gap-3 md:gap-4 w-full max-w-[520px] hover:shadow-lg transition-all cursor-pointer group mt-1 hover:border-[#1a8b4c]">
              <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-[#1a8b4c] transition-colors">
                <Phone className="text-[#1a8b4c] group-hover:text-white w-4 h-4 md:w-5 md:h-5 transition-colors" />
              </div>
              <div>
                <p className="text-[8px] md:text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1 text-left">Toll Free Number</p>
                <p className="text-base md:text-lg font-black text-gray-950 group-hover:text-[#1a8b4c] transition-colors tracking-tight text-left">1800-890-5489</p>
              </div>
            </a>
          </div>

          {/* ---- RIGHT COLUMN ---- */}
          <div className="w-full min-[900px]:flex-1 flex justify-center min-[900px]:justify-end relative z-10">
            <div className="hidden md:block w-full">
              <AuditCardDesktop />
            </div>
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
        className="fixed bottom-[80px] md:bottom-4 right-4 z-50 bg-[#25D366] hover:bg-[#1DA851] text-white px-4 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline text-sm">WhatsApp</span>
      </a>
      
      <AuditModal isOpen={isAuditOpen} onClose={() => setIsAuditOpen(false)} />
    </main>
  );
}