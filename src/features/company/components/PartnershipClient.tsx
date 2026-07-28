"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Send, CheckCircle2, Building2, 
  Handshake, Globe2, Sparkles, Award, Users2, LineChart, ShieldCheck, ShieldAlert,
  Store, MonitorSmartphone, BadgeCheck, TrendingUp, ArrowRight, MessageCircle, ChevronLeft, ChevronRight, X
} from 'lucide-react';

interface PartnershipClientProps {
  settings?: {
    partnershipPageTitle?: string;
    partnershipPageSlug?: string;
    partnershipHeroTitle?: string;
    partnershipHeroDesc?: string;
    partnershipHeading?: string;
    partnershipDesc?: string;
    partnershipPageImage?: string;
    partnershipExpandHeading?: string;
    partnershipExpandParagraph?: string;
  };
  franchisees?: {
    id: number;
    photo: string | null;
    name: string;
    companyName: string | null;
    address: string | null;
    experience: string | null;
    createdAt: Date | string;
  }[];
}
const COUNTRIES = [
  { name: "India", code: "+91", iso: "IN", length: 10, placeholder: "98765 43210" },
  { name: "UAE", code: "+971", iso: "AE", length: 9, placeholder: "50 123 4567" },
  { name: "Saudi Arabia", code: "+966", iso: "SA", length: 9, placeholder: "50 123 4567" },
  { name: "Qatar", code: "+974", iso: "QA", length: 8, placeholder: "5555 5555" },
  { name: "Oman", code: "+968", iso: "OM", length: 8, placeholder: "9123 4567" },
  { name: "Kuwait", code: "+965", iso: "KW", length: 8, placeholder: "5123 4567" },
  { name: "Bahrain", code: "+973", iso: "BH", length: 8, placeholder: "3123 4567" },
  { name: "USA", code: "+1", iso: "US", length: 10, placeholder: "201 555 0123" },
  { name: "Canada", code: "+1", iso: "CA", length: 10, placeholder: "201 555 0123" },
  { name: "United Kingdom", code: "+44", iso: "GB", length: 10, placeholder: "7911 123456" },
  { name: "Singapore", code: "+65", iso: "SG", length: 8, placeholder: "8123 4567" },
  { name: "Sri Lanka", code: "+94", iso: "LK", length: 9, placeholder: "77 123 4567" }
];

const FlagIcon = ({ iso }: { iso: string }) => {
  switch (iso) {
    case 'IN':
      return (
        <svg className="w-5 h-3.5 rounded-sm shadow-sm shrink-0" viewBox="0 0 9 6">
          <path fill="#FF9933" d="M0 0h9v2H0z"/>
          <path fill="#FFF" d="M0 2h9v2H0z"/>
          <path fill="#128807" d="M0 4h9v2H0z"/>
          <circle cx="4.5" cy="3" r=".4" fill="none" stroke="#000080" strokeWidth=".08"/>
        </svg>
      );
    case 'AE':
      return (
        <svg className="w-5 h-3.5 rounded-sm shadow-sm shrink-0" viewBox="0 0 6 3">
          <path fill="#00732F" d="M0 0h6v1H0z"/>
          <path fill="#FFF" d="M0 1h6v1H0z"/>
          <path fill="#000" d="M0 2h6v1H0z"/>
          <path fill="#FF0000" d="M0 0h1.5v3H0z"/>
        </svg>
      );
    case 'SA':
      return (
        <svg className="w-5 h-3.5 rounded-sm shadow-sm shrink-0" viewBox="0 0 3 2">
          <path fill="#006C35" d="M0 0h3v2H0z"/>
          <path fill="#FFF" d="M0.6 1.3h1.8v.1H0.6zm.5-.5h.8v.2h-.8z"/>
        </svg>
      );
    case 'QA':
      return (
        <svg className="w-5 h-3.5 rounded-sm shadow-sm shrink-0" viewBox="0 0 28 11">
          <path fill="#8D1B3D" d="M0 0h28v11H0z"/>
          <path fill="#FFF" d="M0 0h6.5l2 1.2-2 1-2 1.2 2 1.2-2 1.2 2 1.2-2 1.2 2 1.2-2 1.2v.6H0z"/>
        </svg>
      );
    case 'OM':
      return (
        <svg className="w-5 h-3.5 rounded-sm shadow-sm shrink-0" viewBox="0 0 2 1">
          <path fill="#FFF" d="M0 0h2v.33H0z"/>
          <path fill="#D21034" d="M0 .33h2v.34H0z"/>
          <path fill="#00843D" d="M0 .67h2v.33H0z"/>
          <path fill="#D21034" d="M0 0h.5v1H0z"/>
        </svg>
      );
    case 'KW':
      return (
        <svg className="w-5 h-3.5 rounded-sm shadow-sm shrink-0" viewBox="0 0 2 1">
          <path fill="#007A3D" d="M0 0h2v.33H0z"/>
          <path fill="#FFF" d="M0 .33h2v.34H0z"/>
          <path fill="#CE1126" d="M0 .67h2v.33H0z"/>
          <path fill="#000" d="M0 0l.5.33v.34L0 1z"/>
        </svg>
      );
    case 'BH':
      return (
        <svg className="w-5 h-3.5 rounded-sm shadow-sm shrink-0" viewBox="0 0 5 3">
          <path fill="#CE1126" d="M0 0h5v3H0z"/>
          <path fill="#FFF" d="M0 0h1.25l.5.3-.5.3.5.3-.5.3.5.3-.5.3.5.3-.5.3.5.3V3H0z"/>
        </svg>
      );
    case 'US':
      return (
        <svg className="w-5 h-3.5 rounded-sm shadow-sm shrink-0" viewBox="0 0 7410 3900">
          <rect width="7410" height="3900" fill="#B22234"/>
          <path fill="#FFF" d="M0 300h7410v300H0zm0 600h7410v300H0zm0 600h7410v300H0zm0 600h7410v300H0zm0 600h7410v300H0zm0 600h7410v300H0z"/>
          <rect width="2964" height="2100" fill="#3C3B6E"/>
        </svg>
      );
    case 'CA':
      return (
        <svg className="w-5 h-3.5 rounded-sm shadow-sm shrink-0" viewBox="0 0 2 1">
          <path fill="#FF0000" d="M0 0h2v1H0z"/>
          <path fill="#FFF" d="M.5 0h1v1h-1z"/>
          <path fill="#FF0000" d="M.9.3l.1-.2.1.2.2-.1v.2l.2.1-.2.1v.2l-.2-.1-.1.2-.1-.2-.2.1v-.2l-.2-.1.2-.1z"/>
        </svg>
      );
    case 'GB':
      return (
        <svg className="w-5 h-3.5 rounded-sm shadow-sm shrink-0" viewBox="0 0 60 30">
          <path fill="#00247D" d="M0 0h60v30H0z"/>
          <path fill="#FFF" d="M0 0l60 30M60 0L0 30M0 12h60v6H0zm27-12v30h6V0z" stroke="#FFF" strokeWidth="3"/>
          <path fill="#CF142B" d="M0 13h60v4H0zm28-13v30h4V0z"/>
        </svg>
      );
    case 'SG':
      return (
        <svg className="w-5 h-3.5 rounded-sm shadow-sm shrink-0" viewBox="0 0 3 2">
          <path fill="#ED2E38" d="M0 0h3v1H0z"/>
          <path fill="#FFF" d="M0 1h3v1H0z"/>
          <circle cx="0.5" cy="0.4" r="0.2" fill="#FFF"/>
        </svg>
      );
    case 'LK':
      return (
        <svg className="w-5 h-3.5 rounded-sm shadow-sm shrink-0" viewBox="0 0 2 1">
          <path fill="#FFBE29" d="M0 0h2v1H0z"/>
          <path fill="#1E5C46" d="M.1.15h.2v.7h-.2z"/>
          <path fill="#EB7A23" d="M.4.15h.2v.7h-.2z"/>
          <path fill="#8D153B" d="M.7.15h1.1v.7H.7z"/>
        </svg>
      );
    default:
      return null;
  }
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
  if (!emailRegex.test(email)) return false;

  const lower = email.toLowerCase().trim();
  const parts = lower.split('@');
  if (parts.length !== 2) return false;
  
  const domain = parts[1];
  
  const invalidDomains = [
    'gamil.com', 'gmal.com', 'gmeil.com', 'gmail.con', 'gmail.coom',
    'gmail.comm', 'gmail.commm', 'gmail.co.im', 'gmail.om',
    'yaho.com', 'yhoo.com', 'yaho.co.in', 'yhoo.co.in'
  ];
  if (invalidDomains.includes(domain)) return false;

  if (domain.includes('gamil') || domain.includes('gmeil') || domain.includes('gmal') || domain.includes('yaho')) {
    return false;
  }

  const domainParts = domain.split('.');
  if (domainParts.length < 2) return false;
  
  const tld = domainParts[domainParts.length - 1];
  
  if (/m{2,}/.test(tld) || /o{2,}/.test(tld) || /c{2,}/.test(tld)) {
    return false;
  }

  if (domain.includes('gmail')) {
    const allowedGmailSuffixes = ['gmail.com', 'gmail.co.in', 'gmail.co'];
    if (!allowedGmailSuffixes.some(suffix => domain === suffix)) {
      return false;
    }
  }

  return true;
};

export default function PartnershipClient({ settings, franchisees }: PartnershipClientProps) {
  const heroTitle = settings?.partnershipHeroTitle || "Partner With Global Webify";
  const heroDesc = settings?.partnershipHeroDesc || "Expand your service catalog, increase your revenue, and deliver state-of-the-art technological experiences to your clients.";
  const pageImage = settings?.partnershipPageImage || "/partnership/Partner1.jpg";
  const franchiseTitle = settings?.partnershipHeading || "Web Design Franchise of Global Webify in your City";
  const featuresSubtitle = settings?.partnershipExpandHeading || "Detailed Partnership Program Overview & Dynamic Synergies";
  const defaultFranchiseDesc = "Are you a digital marketing agency, freelancer, entrepreneur, or business professional looking to expand your services? Start your own website designing and digital solutions business with Global Webify without the need to hire a technical team or manage complex development processes. Grow your business with the support of an experienced technology partner and achieve your goals with confidence.\n\nGlobal Webify is a trusted web development and SEO company in India, helping businesses build a strong online presence through innovative and result-oriented solutions. Our franchise program allows digital agencies and freelancers to offer professional website design, ecommerce website development, SEO services, and CRM solutions to their clients under a reliable technology partnership.\n\nAs a Global Webify franchise partner, you get access to expert development support, advanced tools, technical assistance, and a skilled team that handles project execution while you focus on client acquisition and business growth.\n\nOur experienced team delivers modern, responsive, and conversion-focused websites along with powerful CRM solutions that help businesses improve customer management, automate processes, and generate better results. With complete backend support and guidance, you can expand your service offerings without investing heavily in technical infrastructure.";
  let rawDesc = settings?.partnershipExpandParagraph || defaultFranchiseDesc;
  if (rawDesc.includes('3. Strategic Co-Development:')) {
    rawDesc = defaultFranchiseDesc;
  }
  const featuresDescText = rawDesc;


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    websiteUrl: '',
    partnershipType: '',
    message: '',
    preferredDate: '',
    preferredTime: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(0);
  const [phoneDigits, setPhoneDigits] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });
  const [submitting, setSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<{preferredDate: string, preferredTime: string}[]>([]);
  const [availability, setAvailability] = useState({ daysToShow: 10, blockedDates: [] as string[], blockedTimes: [] as string[] });
  const [selectedFranchisee, setSelectedFranchisee] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/partnership/slots?t=${new Date().getTime()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.bookedSlots) {
          setBookedSlots(data.bookedSlots);
        }
      })
      .catch(console.error);

    fetch(`/api/partnership/availability?t=${new Date().getTime()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setAvailability(data.settings);
        }
      })
      .catch(console.error);

    // Auto-scroll to form if coming from video redirect
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('scrollToForm') === 'true') {
        setTimeout(() => {
          document.getElementById('partnership-form')?.scrollIntoView({ behavior: 'smooth' });
        }, 500); // Small delay to ensure the page has rendered
      }
    }
  }, []);
  const expandableRef = useRef<HTMLDivElement>(null);
  const dateScrollRef = useRef<HTMLDivElement>(null);
  const timeScrollRef = useRef<HTMLDivElement>(null);

  const scrollDates = (direction: 'left' | 'right') => {
    if (dateScrollRef.current) {
      const scrollAmount = 216; // 3 items (60px width + 12px gap)
      dateScrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollTimes = (direction: 'left' | 'right') => {
    if (timeScrollRef.current) {
      const scrollAmount = 228; // 3 items (70px width + 6px gap)
      timeScrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const selectedCountry = COUNTRIES[selectedCountryIndex];

  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    let hasError = false;
    const newErrors: Record<string, string> = {};

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address. Check for typos like '.comm' or 'gamil'.";
      hasError = true;
    }

    if (phoneDigits && phoneDigits.length !== selectedCountry.length) {
      newErrors.phone = `Phone number must be exactly ${selectedCountry.length} digits for ${selectedCountry.name}.`;
      hasError = true;
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = "Please select a preferred date.";
      hasError = true;
    }

    if (!formData.preferredTime) {
      newErrors.preferredTime = "Please select a preferred time.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors)[0];
      triggerToast(firstError, 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/partnership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        triggerToast('Your call has been scheduled! Our team will contact you at your selected time.', 'success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          companyName: '',
          websiteUrl: '',
          partnershipType: '',
          message: '',
          preferredDate: '',
          preferredTime: ''
        });
        setPhoneDigits('');
        setSelectedCountryIndex(0);
        setErrors({});
      } else {
        setErrors({ submit: data.error || 'Failed to send inquiry. Please try again.' });
        triggerToast(data.error || 'Failed to send inquiry. Please try again.', 'error');
      }
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'An error occurred. Please try again.' });
      triggerToast('An error occurred. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <div className="relative overflow-hidden font-sans selection:bg-[#0082f0] selection:text-white min-h-screen">

      {/* ========== HERO SECTION — VIBRANT MOUNTAIN & WAVE THEME ========== */}
      <div className="relative bg-gradient-to-b from-[#2e1065] via-[#4c1d95] to-[#1e1b4b] pt-16 md:pt-24 text-white overflow-hidden shadow-2xl">
        {/* Animated mesh grid */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Glowing Orbs */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Custom Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <m.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`fixed top-24 md:top-36 right-4 left-4 md:left-auto md:right-8 md:w-auto max-w-sm mx-auto md:mx-0 z-[9999] px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border font-semibold text-xs text-white ${
              toast.type === 'success' 
                ? 'bg-emerald-600 border-emerald-500 shadow-emerald-900/20' 
                : 'bg-red-600 border-red-500 shadow-red-900/20'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-white/20`}>
              {toast.type === 'success' ? <CheckCircle2 size={14} /> : <ShieldAlert size={14} />}
            </div>
            <div>
              <p className="font-black uppercase tracking-wider text-[10px] text-white/80">
                {toast.type === 'success' ? 'Success' : 'Failed'}
              </p>
              <p className="text-white mt-0.5">{toast.message}</p>
            </div>
          </m.div>
        )}
      </AnimatePresence>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          {/* Badge */}
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wider uppercase mb-6 shadow-xl"
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span className="text-purple-200 font-extrabold">Premium Franchise Program</span>
          </m.div>

          {/* Dynamic Hero Title */}
          <m.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tight leading-tight mb-4 drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)]"
          >
            {(() => {
              const match = heroTitle.match(/(Global\s*Weblify|Global\s*Webify)/i);
              if (match && match.index !== undefined) {
                const before = heroTitle.substring(0, match.index);
                const matchedText = heroTitle.substring(match.index, match.index + match[0].length);
                const after = heroTitle.substring(match.index + match[0].length);
                return (
                  <>
                    {before}<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300">{matchedText}</span>{after}
                  </>
                );
              }
              const words = heroTitle.split(' ');
              if (words.length > 1) {
                const lastWord = words.pop();
                const startText = words.join(' ');
                return (
                  <>
                    {startText} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300">{lastWord}</span>
                  </>
                );
              }
              return heroTitle;
            })()}
          </m.h1>

          {/* Dynamic Hero Description */}
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-purple-100/90 max-w-3xl font-medium tracking-wide mb-8 drop-shadow"
          >
            {heroDesc}
          </m.p>

          {/* Apply Now Button */}
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('partnership-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white px-9 py-4 rounded-full font-bold text-[13px] uppercase tracking-wider transition-all duration-300 shadow-[0_8px_30px_-8px_rgba(168,85,247,0.5)] hover:shadow-[0_12px_40px_-8px_rgba(168,85,247,0.7)] hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative z-10">Apply Now</span>
              <svg className="relative z-10 w-4 h-4 text-white stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </m.div>

          {/* Mountain Card Box */}
          <div className="w-full max-w-3xl bg-gradient-to-b from-[#1e1b4b] to-[#0f172a] rounded-t-3xl md:rounded-t-[40px] pt-8 pb-10 px-6 shadow-2xl border-t border-x border-purple-400/30 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08)_0,transparent_70%)] pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 text-xs md:text-sm font-black tracking-widest text-purple-300 uppercase mb-2">
                <TrendingUp className="w-4 h-4 text-purple-300" />
                <span>Established & Growing</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight drop-shadow">
                SCALING IT TOGETHER
              </h2>
            </div>
          </div>
        </div>

        {/* Clean Curved SVG Wave Transition */}
        <div className="w-full overflow-hidden leading-none relative z-20 -mt-1">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-10 md:h-14 text-[#f8fafc] fill-current">
            <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,40 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </div>




      {/* ========== APPLE-STYLE ULTRA-LUXURY FRESH LIGHT CANVAS ========== */}
      <div className="bg-[#f8fafc] text-slate-900 relative min-h-screen overflow-hidden">
        {/* Ambient aura glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-purple-200/40 via-fuchsia-100/50 to-indigo-200/40 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] pointer-events-none" />

        {/* ========== CONTINUOUS DIAGONAL MARQUEE RIBBON TAPES ========== */}
        <div className="relative z-30 pt-4 pb-2 overflow-hidden pointer-events-none">
          <style>{`
            @keyframes marqueeLeft {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-50%, 0, 0); }
            }
            @keyframes marqueeRight {
              0% { transform: translate3d(-50%, 0, 0); }
              100% { transform: translate3d(0, 0, 0); }
            }
            .animate-tape-left {
              animation: marqueeLeft 28s linear infinite;
              will-change: transform;
            }
            .animate-tape-right {
              animation: marqueeRight 28s linear infinite;
              will-change: transform;
            }
          `}</style>

          {/* Tape 1 (Vibrant Electric Blue Gradient Tape - Left) */}
          <div className="w-[140%] -ml-[20%] bg-gradient-to-r from-blue-600 via-sky-500 to-blue-700 text-white font-black text-sm md:text-base uppercase tracking-widest py-3.5 md:py-4 shadow-xl rotate-[-2.5deg] border-y border-white/40 whitespace-nowrap overflow-hidden flex">
            <div className="flex shrink-0 items-center gap-8 animate-tape-left pr-8">
              <span>WEB DEVELOPMENT FRANCHISE</span>
              <span>★</span>
              <span>CUSTOM CRM SOLUTIONS</span>
              <span>★</span>
              <span>SEO & DIGITAL GROWTH</span>
              <span>★</span>
              <span>AUTHORIZED GLOBAL WEBIFY PARTNER</span>
              <span>★</span>
              <span>START YOUR DIGITAL BUSINESS TODAY</span>
            </div>
            <div className="flex shrink-0 items-center gap-8 animate-tape-left pr-8" aria-hidden="true">
              <span>WEB DEVELOPMENT FRANCHISE</span>
              <span>★</span>
              <span>CUSTOM CRM SOLUTIONS</span>
              <span>★</span>
              <span>SEO & DIGITAL GROWTH</span>
              <span>★</span>
              <span>AUTHORIZED GLOBAL WEBIFY PARTNER</span>
              <span>★</span>
              <span>START YOUR DIGITAL BUSINESS TODAY</span>
            </div>
          </div>

          {/* Tape 2 (Dark Slate / Amber Gold Tape - Right) */}
          <div className="w-[140%] -ml-[20%] bg-slate-900 text-amber-300 font-black text-sm md:text-base uppercase tracking-widest py-3.5 md:py-4 shadow-2xl rotate-[2.5deg] -mt-8 md:-mt-9 border-y border-amber-400/40 whitespace-nowrap overflow-hidden flex">
            <div className="flex shrink-0 items-center gap-8 animate-tape-right pr-8">
              <span>★ ZERO TECHNICAL TEAM NEEDED</span>
              <span>•</span>
              <span>COMPLETE PROJECT EXECUTION</span>
              <span>•</span>
              <span>HIGH EARNING POTENTIAL</span>
              <span>•</span>
              <span>100% BACKEND DEVELOPMENT SUPPORT</span>
              <span>•</span>
              <span>GROW YOUR DIGITAL AGENCY</span>
              <span>•</span>
              <span>ZERO TECHNICAL TEAM NEEDED</span>
              <span>•</span>
              <span>COMPLETE PROJECT EXECUTION</span>
            </div>
            <div className="flex shrink-0 items-center gap-8 animate-tape-right pr-8" aria-hidden="true">
              <span>★ ZERO TECHNICAL TEAM NEEDED</span>
              <span>•</span>
              <span>COMPLETE PROJECT EXECUTION</span>
              <span>•</span>
              <span>HIGH EARNING POTENTIAL</span>
              <span>•</span>
              <span>100% BACKEND DEVELOPMENT SUPPORT</span>
              <span>•</span>
              <span>GROW YOUR DIGITAL AGENCY</span>
              <span>•</span>
              <span>ZERO TECHNICAL TEAM NEEDED</span>
              <span>•</span>
              <span>COMPLETE PROJECT EXECUTION</span>
            </div>
          </div>
        </div>

        <div className="container-custom relative z-10 px-4 sm:px-6 max-w-[1440px] mx-auto">

        {/* ========== FRANCHISE FEATURES SECTION ========== */}
        <div className="pt-12 md:pt-16 pb-4">
          <div className="relative p-[2px] rounded-[36px] bg-gradient-to-r from-purple-300 via-fuchsia-200 to-indigo-300 shadow-[0_20px_60px_-15px_rgba(147,51,234,0.15)]">
            <div className="bg-gradient-to-br from-[#f4efff] via-[#e8e0fe] to-[#f6f1ff] p-6 sm:p-10 lg:p-12 rounded-[34px] relative overflow-hidden text-slate-900 border border-purple-200/80">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none" />
              
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-start relative z-10">
                {/* Left — Text Content */}
                <div className="lg:col-span-6 space-y-6 w-full">
                  <m.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-[26px] sm:text-[30px] lg:text-[36px] font-black font-heading tracking-tight leading-snug w-full"
                  >
                    {(() => {
                      const matchRegex = /of Global Webify/i;
                      const match = franchiseTitle.match(matchRegex);
                      if (match && match.index !== undefined) {
                        const before = franchiseTitle.substring(0, match.index);
                        const matchedText = franchiseTitle.substring(match.index, match.index + match[0].length);
                        const after = franchiseTitle.substring(match.index + match[0].length);
                        return (
                          <>
                            <span className="text-slate-800">{before}</span>
                            <span className="text-emerald-600 font-black drop-shadow-sm">{matchedText}</span>
                            <span className="text-slate-800 font-black">{after}</span>
                          </>
                        );
                      }
                      return <span className="text-emerald-700 font-black drop-shadow-sm">{franchiseTitle}</span>;
                    })()}
                  </m.h2>
                  <m.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-[16px] md:text-[17px] font-extrabold text-purple-800 leading-snug"
                  >
                    {featuresSubtitle}
                  </m.h3>
                  
                  <m.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`relative p-6 sm:p-7 rounded-2xl bg-white/90 border border-purple-200/80 shadow-md backdrop-blur-md text-slate-700 transition-all duration-500 ease-in-out custom-scrollbar-purple overflow-x-hidden lg:overflow-y-auto lg:max-h-[550px] ${!isExpanded ? 'max-h-[280px] overflow-hidden' : 'max-h-[1000px] overflow-visible'}`}
                  >
                    {/* Left glowing gradient accent bar */}
                    <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-gradient-to-b from-purple-600 via-fuchsia-500 to-indigo-600 rounded-r-full shadow-sm" />

                    <div className="pl-3 space-y-4 text-slate-700 text-[15px] md:text-[16.5px] font-medium leading-relaxed text-justify [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-3 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-3 [&_ol]:space-y-1.5 [&_li]:text-slate-700 [&_strong]:font-bold [&_strong]:text-slate-900 [&_p]:mb-3 [&_p:last-child]:mb-0">
                      {/<[a-z][\s\S]*>/i.test(featuresDescText) ? (
                        <div dangerouslySetInnerHTML={{ __html: featuresDescText }} />
                      ) : (
                        featuresDescText.split('\n').map((para, idx) => (
                          para.trim() && <p key={idx}>{para}</p>
                        ))
                      )}
                    </div>
                    
                    {/* Fade effect on mobile when collapsed */}
                    {!isExpanded && (
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/95 to-transparent lg:hidden pointer-events-none rounded-b-2xl" />
                    )}
                  </m.div>

                  {/* See More / See Less Button for Mobile/Tablet */}
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="flex justify-center mt-2 lg:hidden"
                  >
                    <button 
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-full font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                    >
                      {isExpanded ? (
                        <>See Less <ChevronRight className="w-3.5 h-3.5 -rotate-90" /></>
                      ) : (
                        <>See More <ChevronRight className="w-3.5 h-3.5 rotate-90" /></>
                      )}
                    </button>
                  </m.div>

                  {/* Action Buttons below description */}
                  <m.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="pt-2 space-y-3.5"
                  >
                    <h4 className="text-[15px] md:text-[16px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-fuchsia-600 to-indigo-600 tracking-tight">
                      Know More About Global Webify
                    </h4>
                    <div className="flex flex-wrap items-center gap-3.5">
                      <Link
                        href="/portfolio"
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white font-bold text-xs md:text-sm shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40 hover:-translate-y-0.5 transition-all duration-300"
                      >
                        Portfolio <ArrowRight size={16} />
                      </Link>
                      <Link
                        href="/about"
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-xs md:text-sm shadow-md hover:bg-slate-800 hover:-translate-y-0.5 transition-all duration-300"
                      >
                        About Us
                      </Link>
                      <Link
                        href="/our-franchisee"
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs md:text-sm shadow-sm hover:bg-purple-100 hover:-translate-y-0.5 transition-all duration-300"
                      >
                        Our Franchise
                      </Link>
                    </div>
                  </m.div>
                </div>

                {/* Right — 2x2 Vibrant Gradient Feature Cards */}
                <div className="lg:col-span-6 w-full pt-10 lg:pt-28 lg:sticky lg:top-36">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                    {/* Card 1 */}
                    <m.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="group bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-7 text-center shadow-xl shadow-blue-600/20 border border-white/20 hover:shadow-2xl hover:shadow-blue-600/35 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-center min-h-[210px]"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner mb-4 group-hover:scale-110 transition-transform duration-300">
                        <MonitorSmartphone size={32} className="text-white drop-shadow-md" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-200/90 mb-1">Easy Setup</span>
                      <h4 className="font-bold text-white text-[15px] sm:text-[16px] leading-snug tracking-wide">
                        No Technical Knowledge Required
                      </h4>
                    </m.div>

                    {/* Card 2 */}
                    <m.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="group bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-700 rounded-3xl p-7 text-center shadow-xl shadow-purple-600/20 border border-white/20 hover:shadow-2xl hover:shadow-purple-600/35 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-center min-h-[210px]"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner mb-4 group-hover:scale-110 transition-transform duration-300">
                        <BadgeCheck size={32} className="text-white drop-shadow-md" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-purple-200/90 mb-1">Zero Barrier</span>
                      <h4 className="font-bold text-white text-[15px] sm:text-[16px] leading-snug tracking-wide">
                        No Experience Necessary
                      </h4>
                    </m.div>

                    {/* Card 3 */}
                    <m.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="group bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-7 text-center shadow-xl shadow-emerald-600/20 border border-white/20 hover:shadow-2xl hover:shadow-emerald-600/35 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-center min-h-[210px]"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Store size={32} className="text-white drop-shadow-md" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-200/90 mb-1">High Demand</span>
                      <h4 className="font-bold text-white text-[15px] sm:text-[16px] leading-snug tracking-wide">
                        Sell Website Packages to Businesses
                      </h4>
                    </m.div>

                    {/* Card 4 */}
                    <m.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="group bg-gradient-to-br from-rose-600 via-pink-600 to-orange-600 rounded-3xl p-7 text-center shadow-xl shadow-rose-600/20 border border-white/20 hover:shadow-2xl hover:shadow-rose-600/35 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-center min-h-[210px]"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner mb-4 group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp size={32} className="text-white drop-shadow-md" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-rose-200/90 mb-1">High Returns</span>
                      <h4 className="font-bold text-white text-[15px] sm:text-[16px] leading-snug tracking-wide">
                      Unlimited Earning Potential
                    </h4>
                  </m.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



        {/* ========== PARTNERSHIP FORM ========== */}
        <div id="partnership-form" className="max-w-3xl mx-auto relative z-10 pt-4 pb-12">
          <div className="w-full relative">
            <m.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-[#fcfaff] via-[#f2ebff] to-[#f6f1ff] p-8 md:p-12 rounded-[32px] shadow-2xl shadow-purple-950/10 border border-purple-200/90 relative overflow-hidden text-slate-900"
            >
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-200/60 border border-purple-300 text-purple-900 font-bold text-[10px] uppercase tracking-[0.15em] mb-5 shadow-sm">
                  <Sparkles size={12} /> Schedule a Call
                </div>
                <h2 className="text-[26px] md:text-[36px] font-black text-slate-900 tracking-tight font-heading leading-tight">
                  Schedule a Call With Us
                </h2>
                <p className="text-slate-600 text-[14px] md:text-[15px] font-medium mt-3 max-w-lg mx-auto leading-relaxed">
                  Pick your preferred date & time, and our franchisee team will call you.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Contact Name & Email */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5 relative group">
                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.1em] ml-1 transition-colors group-focus-within:text-purple-700">Contact Name *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-white hover:bg-white focus:bg-white border border-purple-200/90 rounded-xl text-[14px] font-semibold text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/10 transition-all placeholder-slate-400 shadow-sm"
                      placeholder="Jane Smith"
                    />
                  </div>

                   <div className="flex flex-col gap-1.5 relative group">
                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.1em] ml-1 transition-colors group-focus-within:text-purple-700">Business Email *</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full px-4 py-3 bg-white hover:bg-white focus:bg-white border rounded-xl text-[14px] font-semibold text-slate-900 focus:outline-none focus:ring-2 transition-all placeholder-slate-400 shadow-sm ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-purple-200/90 focus:border-purple-600 focus:ring-purple-600/10'}`}
                      placeholder="jane@company.com"
                    />
                    {errors.email && <span className="text-red-500 text-[11px] font-bold mt-0.5 ml-1">{errors.email}</span>}
                  </div>
                </div>

                {/* Company Name & Website URL */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5 relative group">
                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.1em] ml-1 transition-colors group-focus-within:text-purple-700">Company Name <span className="text-slate-400 font-semibold lowercase tracking-normal">(optional)</span></label>
                    <input 
                      type="text" 
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      className="w-full px-4 py-3 bg-white hover:bg-white focus:bg-white border border-purple-200/90 rounded-xl text-[14px] font-semibold text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/10 transition-all placeholder-slate-400 shadow-sm"
                      placeholder="Acme Corp"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 relative group">
                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.1em] ml-1 transition-colors group-focus-within:text-purple-700">Website URL <span className="text-slate-400 font-semibold lowercase tracking-normal">(optional)</span></label>
                    <input 
                      type="url" 
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
                      className="w-full px-4 py-3 bg-white hover:bg-white focus:bg-white border border-purple-200/90 rounded-xl text-[14px] font-semibold text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/10 transition-all placeholder-slate-400 shadow-sm"
                      placeholder="https://company.com"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 relative group">
                  <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.1em] ml-1 transition-colors group-focus-within:text-purple-700">Mobile Number *</label>
                  <div className="flex gap-3 relative">
                    {/* Country Code Select */}
                    <div className="relative w-[125px] shrink-0">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-full h-full flex items-center justify-between px-3.5 bg-white hover:bg-white focus:bg-white border border-purple-200/90 rounded-xl text-[13px] font-bold text-slate-900 focus:outline-none focus:border-purple-600 transition-all shadow-sm"
                      >
                        <span className="flex items-center gap-2">
                          <FlagIcon iso={selectedCountry.iso} />
                          {selectedCountry.code}
                        </span>
                        <svg className={`w-3 h-3 text-slate-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>

                      {dropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                          <div className="absolute left-0 mt-2 w-[270px] max-h-[260px] overflow-y-auto bg-white border border-purple-200 rounded-xl shadow-xl z-50 py-1.5 scrollbar-thin scrollbar-thumb-purple-200">
                            {COUNTRIES.map((c, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => {
                                  setSelectedCountryIndex(i);
                                  setDropdownOpen(false);
                                  const truncatedDigits = phoneDigits.slice(0, c.length);
                                  setPhoneDigits(truncatedDigits);
                                  setFormData(prev => ({ ...prev, phone: truncatedDigits ? `${c.code} ${truncatedDigits}` : '' }));
                                }}
                                className={`w-full flex items-center gap-3 px-3.5 py-2 text-left text-[13px] font-semibold text-slate-700 hover:bg-purple-50 transition-colors ${i === selectedCountryIndex ? 'bg-purple-100/80 text-purple-700' : ''}`}
                              >
                                <FlagIcon iso={c.iso} />
                                <span className="shrink-0 w-11 font-bold">{c.code}</span>
                                <span className="text-slate-500 font-medium truncate">{c.name}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Phone Input */}
                    <div className="relative flex-grow">
                      <input 
                        type="tel" 
                        required
                        value={phoneDigits}
                        maxLength={selectedCountry.length}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, selectedCountry.length);
                          setPhoneDigits(val);
                          setFormData(prev => ({ ...prev, phone: val ? `${selectedCountry.code} ${val}` : '' }));
                        }}
                        placeholder={selectedCountry.placeholder}
                        className={`w-full px-4 py-3 bg-white hover:bg-white focus:bg-white border rounded-xl text-[14px] font-semibold text-slate-900 focus:outline-none focus:ring-2 transition-all placeholder-slate-400 shadow-sm ${errors.phone ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-purple-200/90 focus:border-purple-600 focus:ring-purple-600/10'}`}
                      />
                    </div>
                  </div>
                  {errors.phone && <span className="text-red-500 text-[11px] font-bold mt-0.5 ml-1">{errors.phone}</span>}
                </div>

                {/* ========== DATE & TIME PICKER (DEFAULT BLUE / ACTIVE PURPLE-FUCHSIA) ========== */}
                <div className="space-y-5 pt-3">
                  {/* Preferred Date */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.1em] ml-1 flex items-center gap-1.5">
                      <span className="text-purple-600">📅</span> Preferred Date *
                    </label>
                    <div className="flex items-center gap-2 group/scroll w-full">
                      <button 
                        type="button" 
                        onClick={() => scrollDates('left')} 
                        className="flex-shrink-0 p-1.5 bg-white border border-purple-200 rounded-full text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-all hidden sm:flex shadow-sm"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      
                      <div 
                        ref={dateScrollRef} 
                        className="flex gap-3 overflow-x-auto snap-x snap-proximity py-4 w-full flex-grow px-1"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        <style>{`
                          div::-webkit-scrollbar { display: none; }
                        `}</style>
                        {(() => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const blockSize = availability.daysToShow || 10;
                          const dates: Date[] = [];
                          let offset = 1;
                          while (dates.length < blockSize) {
                            const d = new Date(today);
                            d.setDate(today.getDate() + offset);
                            if (d.getDay() !== 0) { // Skip Sundays completely
                              dates.push(d);
                            }
                            offset++;
                          }
                          
                          const actualTomorrow = new Date(today);
                          actualTomorrow.setDate(today.getDate() + 1);

                          return dates.map((d, i) => {
                            const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                            const dayName = d.toLocaleDateString('en-IN', { weekday: 'short' });
                            const isSelected = formData.preferredDate === dateStr;
                            const isBlocked = availability.blockedDates.includes(dateStr);
                            const isTomorrow = d.getTime() === actualTomorrow.getTime();
                            
                            return (
                              <div key={i} className="relative shrink-0 flex items-center justify-center">
                                <button
                                  type="button"
                                  disabled={isBlocked}
                                  onClick={() => setFormData(prev => ({ ...prev, preferredDate: dateStr }))}
                                  className={`relative flex flex-col items-center w-[62px] h-[72px] rounded-[14px] transition-all duration-300 ${
                                    isBlocked
                                      ? 'opacity-70 cursor-not-allowed'
                                      : isSelected
                                        ? 'scale-[1.10] z-20'
                                        : 'hover:-translate-y-1 hover:shadow-lg cursor-pointer'
                                  }`}
                                >
                                  {/* Ring holes / Binders */}
                                  <div className="absolute -top-1.5 left-2.5 w-1 h-3 bg-gradient-to-b from-slate-300 to-slate-500 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.5)] z-20"></div>
                                  <div className="absolute -top-1.5 right-2.5 w-1 h-3 bg-gradient-to-b from-slate-300 to-slate-500 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.5)] z-20"></div>

                                  <div className={`w-full h-full flex flex-col rounded-[14px] border-2 shadow-sm overflow-hidden ${
                                     isBlocked 
                                       ? 'border-red-200 bg-red-50/50' 
                                       : isSelected 
                                         ? 'border-purple-600 shadow-xl shadow-purple-500/40 bg-purple-50/90 ring-4 ring-purple-400/30' 
                                         : 'border-blue-300/80 hover:border-blue-500 bg-white'
                                  }`}>
                                    {/* Calendar Top Header (Month) */}
                                    <div className={`w-full py-1 flex items-center justify-center border-b ${
                                      isBlocked 
                                        ? 'bg-red-500 border-red-600 text-white' 
                                        : isSelected 
                                          ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 border-purple-600 text-white font-black' 
                                          : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 border-blue-700 text-white font-black'
                                    }`}>
                                      <span className="text-[9px] font-black uppercase tracking-widest leading-none mt-0.5">
                                        {d.toLocaleDateString('en-IN', { month: 'short' })}
                                      </span>
                                    </div>
                                    
                                    {/* Calendar Body (Date & Day) */}
                                    <div className={`w-full flex-grow flex flex-col items-center justify-center gap-[1px] ${
                                      isBlocked 
                                        ? 'bg-red-50/30' 
                                        : isSelected 
                                          ? 'bg-purple-50/90' 
                                          : 'bg-white'
                                    }`}>
                                      <span className={`text-[20px] font-black leading-none mt-0.5 ${
                                        isBlocked 
                                          ? 'text-red-400 line-through decoration-red-300' 
                                          : isSelected 
                                            ? 'text-purple-800' 
                                            : 'text-slate-900 font-black'
                                      }`}>
                                        {d.getDate()}
                                      </span>
                                      <span className={`text-[9px] font-bold uppercase tracking-wider ${
                                        isBlocked 
                                          ? 'text-red-400' 
                                          : isSelected 
                                            ? 'text-purple-700 font-black' 
                                            : 'text-blue-600 font-extrabold'
                                      }`}>
                                        {dayName}
                                      </span>
                                    </div>
                                  </div>
                                </button>
                                {/* Tomorrow badge outside the button scaling to stay aligned */}
                                {isTomorrow && (
                                   <span className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-[1.5px] text-white text-[7px] font-black uppercase tracking-widest rounded-full shadow-md whitespace-nowrap z-20 ${
                                     isBlocked ? 'bg-red-600' : isSelected ? 'bg-purple-700' : 'bg-blue-700'
                                   }`}>
                                     Tomorrow
                                   </span>
                                )}
                              </div>
                            );
                          });
                        })()}
                      </div>

                      <button 
                        type="button" 
                        onClick={() => scrollDates('right')} 
                        className="flex-shrink-0 p-1.5 bg-white border border-purple-200 rounded-full text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-all hidden sm:flex shadow-sm"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                    {errors.preferredDate && <span className="text-red-500 text-[11px] font-bold mt-0.5 ml-1">{errors.preferredDate}</span>}
                  </div>

                  {/* Preferred Time */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.1em] ml-1 flex items-center gap-1.5">
                      <span className="text-purple-600">🕐</span> Preferred Time *
                    </label>
                    <div className="flex items-center gap-2 group/scroll w-full">
                      <button 
                        type="button" 
                        onClick={() => scrollTimes('left')} 
                        className="flex-shrink-0 p-1.5 bg-white border border-purple-200 rounded-full text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-all hidden sm:flex shadow-sm"
                      >
                        <ChevronLeft size={18} />
                      </button>

                      <div 
                        ref={timeScrollRef}
                        className="flex gap-2 overflow-x-auto snap-x snap-proximity py-2 w-full flex-grow"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        {(() => {
                          const slots: { timeStr: string, h: number, m: number }[] = [];
                          for (let h = 11; h <= 18; h++) {
                            for (let m = 0; m < 60; m += 30) {
                              if (h === 18 && m > 30) break; // Stop at 6:30 PM
                              const hour12 = h > 12 ? h - 12 : h;
                              const ampm = h >= 12 ? 'PM' : 'AM';
                              const timeStr = `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
                              slots.push({ timeStr, h, m });
                            }
                          }
                          
                          const now = new Date();
                          const currentH = now.getHours();
                          const currentM = now.getMinutes();
                          const isToday = formData.preferredDate === now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

                          return slots.map(({ timeStr: time, h, m }) => {
                            const isSelected = formData.preferredTime === time;
                            const isBlockedGlobally = availability.blockedTimes.includes(time);
                            const isAlreadyBooked = formData.preferredDate 
                              ? bookedSlots.some(slot => slot.preferredDate === formData.preferredDate && slot.preferredTime === time)
                              : false;
                            
                            const isPastTime = isToday && (h < currentH || (h === currentH && m <= currentM));
                            
                            const isBooked = isBlockedGlobally || isAlreadyBooked || isPastTime;
                            const blockedLabel = isBlockedGlobally ? 'Unavailable' : isPastTime ? '' : 'Booked';
                              
                            return (
                              <button
                                key={time}
                                type="button"
                                disabled={isBooked}
                                onClick={() => setFormData(prev => ({ ...prev, preferredTime: time }))}
                                className={`flex-shrink-0 snap-start px-3.5 py-2 rounded-xl text-[12px] font-bold border transition-all duration-200 min-w-[76px] flex flex-col items-center justify-center ${
                                  isBooked 
                                    ? 'bg-red-50/50 border-red-100 opacity-60 cursor-not-allowed'
                                    : isSelected
                                      ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white border-purple-600 shadow-md shadow-purple-500/20'
                                      : 'bg-white text-slate-700 border-purple-200/80 hover:border-purple-400 hover:bg-purple-50'
                                }`}
                              >
                                {isBooked ? (
                                  <>
                                    <span className="text-slate-400 line-through text-[11px] font-medium leading-none mb-1">{time}</span>
                                    {blockedLabel && <span className="text-red-500 text-[8px] font-black uppercase tracking-wider leading-none">{blockedLabel}</span>}
                                  </>
                                ) : (
                                  time
                                )}
                              </button>
                            );
                          });
                        })()}
                      </div>

                      <button 
                        type="button" 
                        onClick={() => scrollTimes('right')} 
                        className="flex-shrink-0 p-1.5 bg-white border border-purple-200 rounded-full text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-all hidden sm:flex shadow-sm"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                    {errors.preferredTime && <span className="text-red-500 text-[11px] font-bold mt-0.5 ml-1">{errors.preferredTime}</span>}
                  </div>
                </div>

                {errors.submit && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl">
                    <span className="text-red-600 text-sm font-semibold block text-center">{errors.submit}</span>
                  </div>
                )}

                {/* Submit Button (Electric Blue) */}
                <div className="pt-2">
                  <m.button 
                    whileHover={{ scale: 1.01, translateY: -1 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={submitting}
                    type="submit"
                    className="group relative w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white py-4 rounded-xl font-black text-[13px] uppercase tracking-[0.15em] flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <span className="relative z-10">{submitting ? 'Scheduling Call...' : 'Schedule a Call'}</span>
                    <Send size={15} className="relative z-10 stroke-[2.5] group-hover:translate-x-1 transition-transform duration-300" />
                  </m.button>
                </div>

              </form>
            </m.div>
          </div>
        </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/917563901100?text=Hello%20Global%20Webify%2C%20I%20am%20interested%20in%20the%20Franchisee%2FPartnership%20Program"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50 bg-[#25D366] hover:bg-[#1ebd59] text-white p-3.5 md:px-5 md:py-3.5 rounded-full shadow-2xl flex items-center justify-center md:gap-2.5 font-extrabold text-sm sm:text-base tracking-wide transition-all duration-300 transform hover:scale-105 active:scale-95 group border-2 border-white/20"
      >
        <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <MessageCircle size={26} className="fill-white stroke-none shrink-0" />
        <span className="hidden md:inline">WhatsApp</span>
      </a>
    </div>
  );
}
