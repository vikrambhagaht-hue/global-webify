"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Send, CheckCircle2, Building2, 
  Handshake, Globe2, Sparkles, Award, Users2, LineChart, ShieldCheck, ShieldAlert,
  Store, MonitorSmartphone, BadgeCheck, TrendingUp, ArrowRight, MessageCircle
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

export default function PartnershipClient({ settings }: PartnershipClientProps) {
  const heroTitle = settings?.partnershipHeroTitle || "Partner With Global Webify";
  const heroDesc = settings?.partnershipHeroDesc || "Expand your service catalog, increase your revenue, and deliver state-of-the-art technological experiences to your clients.";
  const pageImage = settings?.partnershipPageImage || "/partnership/Partner1.jpg";
  const franchiseTitle = settings?.partnershipHeading || "Web Design Franchise of Global Webify in your City";
  const featuresSubtitle = settings?.partnershipExpandHeading || "Detailed Partnership Program Overview & Dynamic Synergies";
  const defaultFranchiseDesc = "Are you a digital marketing agency, freelancer, entrepreneur, or business professional looking to expand your services? Start your own website designing and digital solutions business with Global Webify without the need to hire a technical team or manage complex development processes.\n\nAs a Global Webify franchise partner, you get complete access to our expert development support, advanced tools, and technical assistance. We deliver modern, conversion-focused websites and powerful CRM solutions while handling full project execution behind the scenes—allowing you to focus entirely on client acquisition, brand growth, and unlimited earning potential.";
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
    message: ''
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
  const expandableRef = useRef<HTMLDivElement>(null);
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

    if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address. Check for typos like '.comm' or 'gamil'.";
      hasError = true;
    }

    if (!phoneDigits) {
      newErrors.phone = "Mobile number is required.";
      hasError = true;
    } else if (phoneDigits.length !== selectedCountry.length) {
      newErrors.phone = `Phone number must be exactly ${selectedCountry.length} digits for ${selectedCountry.name}.`;
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      triggerToast('Please fix the validation errors in the form.', 'error');
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
        triggerToast('Thank you! Our Partnership Team will contact you shortly.', 'success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          companyName: '',
          websiteUrl: '',
          partnershipType: '',
          message: ''
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

      {/* ========== HERO SECTION — DARK PREMIUM ========== */}
      <div className="relative bg-[#0a0a0f] pt-16 md:pt-28 pb-16 md:pb-24 overflow-hidden">
        {/* Animated mesh grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Glowing orbs */}
        <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-gradient-to-br from-blue-600/25 via-cyan-500/15 to-transparent blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-30%] left-[-15%] w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/20 via-indigo-500/10 to-transparent blur-[120px] rounded-full pointer-events-none" />

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

        <div className="container-custom relative z-10 px-4 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Left Text Block */}
            <div className="lg:col-span-6 space-y-4 md:space-y-7 text-left">
              <m.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                <span className="text-cyan-300 font-bold text-[10px] md:text-[11px] uppercase tracking-[0.2em]">Premium Franchise Program</span>
              </m.div>

              <m.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-[38px] md:text-[60px] font-black font-heading leading-[1.08] tracking-tight text-white pb-1"
              >
                {(() => {
                  const match = heroTitle.match(/(Global\s*Weblify|Global\s*Webify)/i);
                  if (match && match.index !== undefined) {
                    const before = heroTitle.substring(0, match.index);
                    const matchedText = heroTitle.substring(match.index, match.index + match[0].length);
                    const after = heroTitle.substring(match.index + match[0].length);
                    return (
                      <>
                        {before}<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{matchedText}</span>{after}
                      </>
                    );
                  }
                  const words = heroTitle.split(' ');
                  if (words.length > 1) {
                    const lastWord = words.pop();
                    const startText = words.join(' ');
                    return (
                      <>
                        {startText} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{lastWord}</span>
                      </>
                    );
                  }
                  return heroTitle;
                })()}
              </m.h1>

              <m.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-slate-400 text-[15px] md:text-[17px] font-medium leading-relaxed max-w-xl"
              >
                {heroDesc}
              </m.p>

              <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-2 flex items-center gap-5"
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('partnership-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-9 py-4 rounded-full font-bold text-[13px] uppercase tracking-wider transition-all duration-300 shadow-[0_8px_30px_-8px_rgba(59,130,246,0.5)] hover:shadow-[0_12px_40px_-8px_rgba(59,130,246,0.6)] hover:-translate-y-0.5 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative z-10">Apply Now</span>
                  <svg className="relative z-10 w-4 h-4 text-white stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </m.div>
            </div>

            {/* Right Image Block */}
            <div className="lg:col-span-6 relative">
              <m.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, type: 'spring' }}
                className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/70 via-transparent to-transparent z-10 pointer-events-none"></div>
                <img 
                  src={pageImage?.toLowerCase().includes('partner1.jpg') ? '/partnership/partner1.jpg' : (pageImage || '/partnership/partner1.jpg')} 
                  alt="Become a Partner"
                  className="w-full h-auto max-h-[480px] object-cover transform-gpu transition-transform duration-1000 group-hover:scale-[1.04]" 
                />
              </m.div>
              {/* Floating glow */}
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-blue-500/30 rounded-full blur-[50px] -z-10"></div>
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-purple-500/20 rounded-full blur-[60px] -z-10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== LIGHT SECTIONS BELOW ========== */}
      <div className="bg-slate-50 relative">
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50 pointer-events-none" />

        <div className="container-custom relative z-10 px-4 sm:px-6 max-w-[1440px] mx-auto">

        {/* ========== FRANCHISE FEATURES SECTION ========== */}
        <div className="pt-10 pb-6">
          <div className="bg-gradient-to-br from-white via-slate-50/80 to-blue-50/40 p-6 sm:p-10 lg:p-12 rounded-[32px] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.06)] border border-slate-200/80 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10">
              {/* Left — Text */}
              <div className="lg:col-span-6 space-y-5 w-full">
                <m.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-[26px] sm:text-[30px] lg:text-[34px] font-black font-heading text-slate-900 tracking-tight leading-snug w-full"
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
                          {before}<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">{matchedText}</span>{after}
                        </>
                      );
                    }
                    return franchiseTitle;
                  })()}
                </m.h2>
                <m.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-[16px] md:text-[17px] font-bold text-blue-600 leading-snug"
                >
                  {featuresSubtitle}
                </m.h3>
                <m.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3.5 text-slate-700 text-[14px] md:text-[15.5px] font-medium leading-relaxed text-justify"
                >
                  {featuresDescText.split('\n').map((para, idx) => (
                    para.trim() && <p key={idx}>{para}</p>
                  ))}
                </m.div>

                {/* Action Buttons below description */}
                <m.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="pt-4 space-y-3.5"
                >
                  <h4 className="text-[15px] md:text-[16px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 tracking-tight">
                    Know More About Global Webify
                  </h4>
                  <div className="flex flex-wrap items-center gap-3.5">
                    <Link
                      href="/portfolio"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs md:text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Portfolio <ArrowRight size={16} />
                    </Link>
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs md:text-sm shadow-md shadow-slate-900/10 hover:bg-slate-800 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      About Us
                    </Link>
                  </div>
                </m.div>
              </div>

              {/* Right — 2x2 Dark & Vibrant Gradient Cards */}
              <div className="lg:col-span-6 w-full mt-0 lg:sticky lg:top-28">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                  {/* Card 1 */}
                  <m.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="group bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl p-8 text-center shadow-lg shadow-blue-500/25 border border-white/20 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-center min-h-[220px]"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner mb-6 group-hover:scale-110 transition-transform duration-300">
                      <MonitorSmartphone size={32} className="text-white drop-shadow-md" />
                    </div>
                    <h4 className="font-black text-white text-[16px] md:text-[17px] leading-snug tracking-tight drop-shadow-sm">No Technical Knowledge Required</h4>
                  </m.div>

                  {/* Card 2 */}
                  <m.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="group bg-gradient-to-br from-violet-600 to-purple-500 rounded-3xl p-8 text-center shadow-lg shadow-purple-500/25 border border-white/20 hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-center min-h-[220px]"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner mb-6 group-hover:scale-110 transition-transform duration-300">
                      <BadgeCheck size={32} className="text-white drop-shadow-md" />
                    </div>
                    <h4 className="font-black text-white text-[16px] md:text-[17px] leading-snug tracking-tight drop-shadow-sm">No Experience<br />Necessary</h4>
                  </m.div>

                  {/* Card 3 */}
                  <m.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="group bg-gradient-to-br from-emerald-600 to-teal-500 rounded-3xl p-8 text-center shadow-lg shadow-emerald-500/25 border border-white/20 hover:shadow-2xl hover:shadow-emerald-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-center min-h-[220px]"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Store size={32} className="text-white drop-shadow-md" />
                    </div>
                    <h4 className="font-black text-white text-[16px] md:text-[17px] leading-snug tracking-tight drop-shadow-sm">Sell Website Packages to Businesses</h4>
                  </m.div>

                  {/* Card 4 */}
                  <m.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="group bg-gradient-to-br from-rose-600 to-orange-500 rounded-3xl p-8 text-center shadow-lg shadow-rose-500/25 border border-white/20 hover:shadow-2xl hover:shadow-rose-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-center min-h-[220px]"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner mb-6 group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp size={32} className="text-white drop-shadow-md" />
                    </div>
                    <h4 className="font-black text-white text-[16px] md:text-[17px] leading-snug tracking-tight drop-shadow-sm">Unlimited Earning<br />Potential</h4>
                  </m.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== PARTNERSHIP FORM ========== */}
        <div id="partnership-form" className="max-w-3xl mx-auto relative z-10 pt-4 pb-16">
          <div className="w-full relative">
            <m.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-b from-white to-slate-50/80 p-8 md:p-12 rounded-[32px] shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] border border-slate-200/80 relative overflow-hidden"
            >
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-[10px] uppercase tracking-[0.15em] mb-5">
                  <Sparkles size={12} /> Apply Today
                </div>
                <h2 className="text-[26px] md:text-[36px] font-black text-slate-900 tracking-tight font-heading leading-tight">
                  Partner With Us
                </h2>
                <p className="text-slate-500 text-[14px] md:text-[15px] font-medium mt-3 max-w-lg mx-auto leading-relaxed">
                  Submit details about your business and goals. We'll review your application and get in touch within 2 business days.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Contact Name & Email */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5 relative group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1 transition-colors group-focus-within:text-blue-500">Contact Name *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-[14px] font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder-slate-300"
                      placeholder="Jane Smith"
                    />
                  </div>

                   <div className="flex flex-col gap-1.5 relative group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1 transition-colors group-focus-within:text-blue-500">Business Email *</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border rounded-xl text-[14px] font-semibold text-slate-900 focus:outline-none focus:ring-2 transition-all placeholder-slate-300 ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'}`}
                      placeholder="jane@company.com"
                    />
                    {errors.email && <span className="text-red-500 text-[11px] font-bold mt-0.5 ml-1">{errors.email}</span>}
                  </div>
                </div>

                {/* Company Name & Website URL */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5 relative group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1 transition-colors group-focus-within:text-blue-500">Company Name <span className="text-slate-300 font-semibold lowercase tracking-normal">(optional)</span></label>
                    <input 
                      type="text" 
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-[14px] font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder-slate-300"
                      placeholder="Acme Corp"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 relative group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1 transition-colors group-focus-within:text-blue-500">Website URL <span className="text-slate-300 font-semibold lowercase tracking-normal">(optional)</span></label>
                    <input 
                      type="url" 
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-[14px] font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder-slate-300"
                      placeholder="https://company.com"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 relative group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1 transition-colors group-focus-within:text-blue-500">Mobile Number *</label>
                  <div className="flex gap-3 relative">
                    {/* Country Code Select */}
                    <div className="relative w-[125px] shrink-0">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-full h-full flex items-center justify-between px-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
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
                          <div className="absolute left-0 mt-2 w-[270px] max-h-[260px] overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 scrollbar-thin scrollbar-thumb-slate-200">
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
                                className={`w-full flex items-center gap-3 px-3.5 py-2 text-left text-[13px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors ${i === selectedCountryIndex ? 'bg-blue-50 text-blue-600' : ''}`}
                              >
                                <FlagIcon iso={c.iso} />
                                <span className="shrink-0 w-11 font-bold">{c.code}</span>
                                <span className="text-slate-400 font-medium truncate">{c.name}</span>
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
                        className={`w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border rounded-xl text-[14px] font-semibold text-slate-900 focus:outline-none focus:ring-2 transition-all placeholder-slate-300 ${errors.phone ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'}`}
                      />
                    </div>
                  </div>
                  {errors.phone && <span className="text-red-500 text-[11px] font-bold mt-0.5 ml-1">{errors.phone}</span>}
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5 relative group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1 transition-colors group-focus-within:text-blue-500">How can we work together? <span className="text-slate-300 font-semibold lowercase tracking-normal">(optional)</span></label>
                  <textarea 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-[14px] font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder-slate-300 resize-none leading-relaxed"
                    placeholder="Briefly describe your objectives, target audience, and how you see GlobalWeblify helping..."
                  ></textarea>
                </div>

                {errors.submit && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <span className="text-red-600 text-sm font-semibold block text-center">{errors.submit}</span>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-1">
                  <m.button 
                    whileHover={{ scale: 1.01, translateY: -1 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={submitting}
                    type="submit"
                    className="group relative w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-4 rounded-xl font-black text-[12px] uppercase tracking-[0.15em] flex items-center justify-center gap-2.5 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <span className="relative z-10">{submitting ? 'Submitting Application...' : 'Submit Partner Request'}</span>
                    <Send size={14} className="relative z-10 stroke-[2.5] group-hover:translate-x-1 transition-transform duration-300" />
                  </m.button>
                </div>

              </form>
            </m.div>
          </div>
        </div>

        </div>{/* end container */}
      </div>{/* end light section */}

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
