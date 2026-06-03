"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { Section } from "../layout/Responsive/Section";
import dynamic from "next/dynamic";
const AuditModal = dynamic(() => import("../ui/AuditModal"), { ssr: false });

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
    <div className="min-h-[120px] md:min-h-[115px] flex items-start justify-start w-full overflow-visible">
      <h1 className="text-[32px] sm:text-4xl md:text-[44px] font-extrabold md:font-black text-[#171717] leading-tight tracking-tight text-left font-lexend">
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
      className="w-full max-w-[580px] mx-auto cursor-default z-20 relative font-jost"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.02, y: -6, boxShadow: "0px 28px 56px -12px rgba(26,139,76,0.18)" }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative w-full"
      >
        {/* Outer dark bezel */}
        <div className="bg-[#1a2332] rounded-t-[20px] shadow-2xl border border-[#2a3a4e] border-b-0 overflow-hidden">
          
          {/* Browser chrome - full width at top */}
          <div className="bg-[#f1f5f9] mx-[10px] mt-[10px] rounded-t-[12px] border-b border-slate-200 px-5 py-3 flex items-center gap-4">
            <div className="flex gap-[7px] shrink-0">
              <div className="w-[12px] h-[12px] rounded-full bg-[#ef4444]" />
              <div className="w-[12px] h-[12px] rounded-full bg-[#f59e0b]" />
              <div className="w-[12px] h-[12px] rounded-full bg-[#22c55e]" />
            </div>
            <div className="bg-white border border-slate-200 text-slate-400 text-[11px] px-4 py-[5px] rounded-lg flex-1 text-left font-mono truncate">
              https://audit.globalwebify.com/report
            </div>
          </div>

          {/* Below chrome: sidebar + content side by side */}
          <div className="flex px-[10px] pb-[6px]">
            {/* Left dark sidebar with icons */}
            <div className="w-[46px] shrink-0 flex flex-col items-center pt-5 gap-[10px]">
              <div className="w-[26px] h-[26px] rounded-[7px] bg-[#22C55E] shadow-[0_0_12px_rgba(34,197,94,0.4)]" />
              <div className="w-[30px] h-[1px] bg-slate-700 my-[2px]" />
              <div className="w-[26px] h-[26px] rounded-[7px] bg-[#334155] opacity-60" />
              <div className="w-[26px] h-[26px] rounded-[7px] bg-[#334155] opacity-60" />
              <div className="w-[26px] h-[26px] rounded-[7px] bg-[#22C55E] shadow-[0_0_12px_rgba(34,197,94,0.3)]" />
              <div className="w-[26px] h-[26px] rounded-[7px] bg-[#334155] opacity-60" />
            </div>

            {/* Main white content area */}
            <div className="flex-1 bg-white rounded-b-[12px] overflow-hidden flex flex-col min-w-0 text-left">
              <div className="p-4 md:p-5 flex-1 flex flex-col gap-4">
                {/* Website Audit Report header + Grade A+ */}
                <div className="flex justify-between items-start">
                  <div className="text-left">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em] mb-1">Website Audit Report</p>
                    <h3 className="text-[22px] font-black text-slate-900 leading-tight font-heading">globalwebify.com</h3>
                  </div>
                  <span className="bg-white text-slate-800 text-[15px] font-black px-5 py-2 rounded-xl border-2 border-slate-200 whitespace-nowrap shadow-sm">Grade A+</span>
                </div>

                {/* 4 Score cards */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "PERFORMANCE", val: "98" },
                    { label: "ACCESSIBILITY", val: "100" },
                    { label: "BEST PRACTICES", val: "95" },
                    { label: "SEO", val: "100" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-[#f8fafc] border border-slate-200 rounded-xl p-2.5 text-center shadow-sm flex flex-col items-center gap-2">
                      <div className="w-full bg-slate-100 h-[5px] rounded-full overflow-hidden">
                        <div className="h-full bg-[#22C55E] rounded-full" style={{ width: `${stat.val}%` }} />
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-[28px] font-extrabold text-slate-900 leading-none mb-1 font-heading">{stat.val}</div>
                        <div className="text-[7px] uppercase font-bold text-slate-400 tracking-[0.12em] w-full truncate">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Critical Optimization Opportunities */}
                <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-4 shadow-sm">
                  <p className="text-[14px] font-bold text-slate-900 mb-3 text-left">Critical Optimization Opportunities</p>
                  <div className="flex flex-col gap-0">
                    {[
                      { 
                        coreColor: "bg-red-300",
                        ringColor: "border-red-200",
                        title: "Minimize Main-Thread Work", 
                        sub: "Reduce JS parse time by 1.2s", 
                        badge: "HIGH IMPACT", 
                        badgeColor: "bg-red-50 text-red-500 border-red-200" 
                      },
                      { 
                        coreColor: "bg-amber-300",
                        ringColor: "border-amber-200",
                        title: "Serve Images in Next-Gen Formats", 
                        sub: "Potential savings: 145 KiB", 
                        badge: "MED IMPACT", 
                        badgeColor: "bg-amber-50 text-amber-600 border-amber-200" 
                      },
                      { 
                        coreColor: "bg-emerald-300",
                        ringColor: "border-emerald-200",
                        title: "Ensure Text Remains Visible", 
                        sub: "All fonts loaded correctly", 
                        badge: "PASSED", 
                        badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200" 
                      },
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center justify-between gap-3 text-left py-2.5 ${i < 2 ? 'border-b border-slate-100' : ''}`}>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
                            <span className={`w-4 h-4 rounded-full border-2 ${item.ringColor} bg-white absolute`} />
                            <span className={`w-2 h-2 rounded-full ${item.coreColor} relative z-10`} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-slate-800 leading-tight">{item.title}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{item.sub}</p>
                          </div>
                        </div>
                        <span className={`shrink-0 text-[9px] font-bold px-3 py-1.5 rounded-md border ${item.badgeColor} uppercase tracking-wide`}>{item.badge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom base/stand edge */}
        <div className="bg-[#1f2d3f] h-[8px] rounded-b-[20px] border border-t-0 border-[#2a3a4e]" />
        <div className="bg-[#2d3d52] h-[5px] rounded-b-[10px] mx-5 opacity-60" />
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
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="w-full relative overflow-hidden bg-white font-jost text-left">
      {/* Optimized Background Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none w-full h-full translate-y-[55px] md:translate-y-0">
        <Image
          src="/bg-pattern-landing.avif"
          alt="Background Pattern"
          fill
          priority
          sizes="(max-width: 768px) 1200px, 100vw"
          quality={80}
          className="object-cover object-top opacity-[0.65] md:opacity-[0.8] saturate-[1.60] contrast-[1.15]"
        />
      </div>

      <Section 
        id="hero" 
        variant="transparent"
        spacing="hero" 
        className="z-10 pt-[100px] md:pt-[130px] lg:pt-[160px]"
      >
        <div className="flex flex-col min-[900px]:flex-row items-center justify-between gap-6 md:gap-8 lg:gap-10 xl:gap-12">

          {/* ---- LEFT COLUMN ---- */}
          <div className="flex-1 w-full flex flex-col items-center min-[900px]:items-start gap-3 md:gap-5 z-10 max-w-xl text-center min-[900px]:text-left">
            <div className="hidden md:inline-flex items-center gap-2.5 bg-[#E8F5EE] border-2 border-[#BBE3CB] text-[#1a8b4c] text-[10px] md:text-[11px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a8b4c] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1a8b4c]" />
              </span>
              Accepting New Clients
            </div>

            {city ? (
              <div className="min-h-[120px] md:min-h-[115px] flex items-start justify-start w-full overflow-visible">
                <h1 
                  className="text-[32px] sm:text-3xl md:text-[38px] lg:text-[42px] font-extrabold md:font-black text-[#171717] leading-tight tracking-tight text-left font-sans font-lexend"
                  dangerouslySetInnerHTML={{ __html: cityHeroSettings?.title || `Your Website Isn’t Bringing Leads—and It’s Costing You Business in <span class="text-[#1a8b4c]">${city}</span>` }}
                />
              </div>
            ) : (
              <TypingHeadline phrases={heroTexts} />
            )}

            <div className="text-[#545454] text-[18px] md:text-[20px] font-normal max-w-lg leading-relaxed text-center min-[900px]:text-left mt-3 font-jost mx-auto min-[900px]:mx-0">
              {city ? (
                <div 
                  className="block city-hero-desc"
                  dangerouslySetInnerHTML={{ __html: cityHeroSettings?.description || `We combine result-oriented Digital Marketing, modern Web Design, and branding strategies to help <span class="text-[#1a8b4c] font-bold">${city}</span> businesses stand out online and grow faster without wasted ad spend.` }}
                />
              ) : (
                <div 
                  className="block homepage-hero-desc"
                  dangerouslySetInnerHTML={{ __html: homepageHeroDesc || "We build AI-integrated websites that generate leads and scale your growth automatically." }}
                />
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-row gap-4 w-full mt-1">
              <a href="tel:+917563901100" className="flex-1 md:flex-none bg-gradient-to-r from-[#1cb05b] to-[#117846] hover:from-[#21c767] hover:to-[#158e53] text-white text-[14px] md:text-[16px] font-bold px-5 md:px-8 md:py-[18px] py-3 rounded-xl transition-all shadow-xl shadow-green-900/20 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap text-center inline-block">
                Free Consultation
              </a>
              <button onClick={() => setIsAuditOpen(true)} className="flex-1 md:flex-none bg-white border-2 border-[#1a8b4c]/40 hover:border-[#1a8b4c] hover:shadow-none text-[#1a8b4c] hover:bg-green-50 text-[13px] md:text-[15px] font-bold px-4 md:px-7 md:py-4 py-2.5 rounded-xl transition-all shadow-md hover:-translate-y-0.5 cursor-pointer whitespace-nowrap">
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
                <a href="tel:18008905489" className="text-base md:text-lg font-bold text-gray-950 tracking-tight block hover:text-[#1a8b4c] transition-colors">1800-890-5489</a>
              </div>
            </div>
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