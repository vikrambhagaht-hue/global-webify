"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Send, CheckCircle2, Building2, 
  Handshake, Globe2, Sparkles, Award, Users2, LineChart, ShieldCheck, ShieldAlert,
  Store, MonitorSmartphone, BadgeCheck, TrendingUp
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
  const heroTitle = settings?.partnershipHeroTitle || "Become a GlobalWeblify Partner";
  const heroDesc = settings?.partnershipHeroDesc || "We invite you to become our partner for mutually beneficial collaboration. Our company offers various partnership programs with terms tailored to businesses of all types and sizes.";
  const pageImage = settings?.partnershipPageImage || "/partnership/Partner1.jpg";
  const featuresSubtitle = settings?.partnershipExpandHeading || "Website Designing, Ecommerce Website Development, Digital Marketing, SEO - Franchise";
  const featuresDescText = settings?.partnershipExpandParagraph || "Start your very own website designing company without having liability of a technical team and developing any website. So set your goals as high as you want.\n\nGlobalWeblify is an awarded best web designing company. We offer high quality websites with our innovative and modern approach for our clients, to ensure superb promotion on Google. When you join us, you'll join hundreds of happy franchisees from all over the world.\n\nOur highly skilled team develops result-oriented websites, which generate business and make big money for our clients. Throughout the past years, GlobalWeblify has been able to deliver more than 3000+ projects, from almost all industries, for clients globally.";


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
    <div className="pt-16 pb-16 bg-[#f4fbf7] relative overflow-hidden font-sans">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-200/20 blur-[150px] rounded-full -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#1a8b4c]/10 blur-[150px] rounded-full -ml-64 -mb-64 pointer-events-none" />

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
        
        {/* Title Header: Premium 2-Column Hero block */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-12">
          {/* Left Text Block */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <m.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[36px] md:text-[52px] font-black font-heading text-gray-900 leading-[1.1]"
            >
              {(() => {
                const words = heroTitle.split(' ');
                if (words.length > 1) {
                  const lastWord = words.pop();
                  const startText = words.join(' ');
                  return (
                    <>
                      {startText} <span className="text-[#0082f0]">{lastWord}</span>
                    </>
                  );
                }
                return heroTitle;
              })()}
            </m.h1>

            <p className="text-gray-600 text-sm md:text-[15px] font-normal leading-relaxed max-w-xl">
              {heroDesc}
            </p>

            <div className="pt-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('partnership-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#0052cc] to-[#0082f0] hover:from-[#0041a3] hover:to-[#006ec7] text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-wider transition-all shadow-md hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0"
              >
                Get in touch
                <svg className="w-4.5 h-4.5 text-white stroke-[2.5] w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Image Block */}
          <div className="lg:col-span-6">
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-tr from-blue-50/50 to-indigo-50/50 border border-gray-100 rounded-[32px] p-2 shadow-sm overflow-hidden flex items-center justify-center"
            >
              <img 
                src={pageImage?.toLowerCase().includes('partner1.jpg') ? '/partnership/partner1.jpg' : (pageImage || '/partnership/partner1.jpg')} 
                alt="Become a Partner"
                className="w-full h-auto max-h-[440px] object-cover rounded-2xl drop-shadow-sm hover:scale-[1.02] transition-transform duration-500" 
              />
            </m.div>
          </div>
        </div>

        {/* 4-Card Franchise Description Block */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-16 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          {/* Left Text Block */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <m.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#0082f0] flex items-center justify-center shrink-0 shadow-lg border-4 border-white">
                <Store size={32} className="text-white" />
              </div>
              <h2 className="text-[28px] md:text-[32px] font-black font-heading text-gray-800 leading-[1.2]">
                Web Design Franchise of <br/><span className="text-[#0082f0]">GlobalWeblify</span> in your City
              </h2>
            </m.div>

            <m.h3 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[18px] md:text-[20px] font-bold text-[#0082f0] leading-snug"
            >
              {featuresSubtitle}
            </m.h3>

            <m.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 text-gray-600 text-sm md:text-[15px] font-medium leading-relaxed"
            >
              {featuresDescText.split('\n').map((para, idx) => (
                para.trim() && <p key={idx}>{para}</p>
              ))}
            </m.div>
          </div>

          {/* Right Cards Block */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
              {/* Card 1 */}
              <m.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 p-8 flex flex-col items-center justify-center text-center gap-5 hover:-translate-y-2 transition-transform duration-300 border border-gray-50"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-cyan-50 flex items-center justify-center shadow-inner">
                  <MonitorSmartphone size={36} className="text-[#0082f0]" />
                </div>
                <h4 className="font-black text-gray-800 text-[16px] leading-snug">No Technical Knowledge Required</h4>
              </m.div>

              {/* Card 2 */}
              <m.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 p-8 flex flex-col items-center justify-center text-center gap-5 hover:-translate-y-2 transition-transform duration-300 border border-gray-50 transform sm:translate-y-8"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-cyan-50 flex items-center justify-center shadow-inner">
                  <BadgeCheck size={36} className="text-[#0082f0]" />
                </div>
                <h4 className="font-black text-gray-800 text-[16px] leading-snug">No Experience Necessary</h4>
              </m.div>

              {/* Card 3 */}
              <m.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 p-8 flex flex-col items-center justify-center text-center gap-5 hover:-translate-y-2 transition-transform duration-300 border border-gray-50"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-cyan-50 flex items-center justify-center shadow-inner">
                  <Store size={36} className="text-[#0082f0]" />
                </div>
                <h4 className="font-black text-gray-800 text-[16px] leading-snug">Sell Website Packages to Businesses</h4>
              </m.div>

              {/* Card 4 */}
              <m.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl shadow-2xl shadow-blue-900/10 p-8 flex flex-col items-center justify-center text-center gap-5 hover:-translate-y-2 transition-transform duration-300 border border-gray-50 transform sm:translate-y-8 sm:rotate-[3deg]"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-cyan-50 flex items-center justify-center shadow-inner">
                  <TrendingUp size={36} className="text-[#0082f0]" />
                </div>
                <h4 className="font-black text-gray-800 text-[16px] leading-snug">Unlimited Earning Potential</h4>
              </m.div>
            </div>
            
            {/* Background glowing blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#0082f0]/10 to-purple-500/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
          </div>
        </div>

        {/* Centered Premium Partnership Form */}
        <div id="partnership-form" className="max-w-3xl mx-auto items-start">
          <div className="w-full">
            <m.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 md:p-10 rounded-[32px] shadow-[0_12px_40px_-15px_rgba(26,139,76,0.08)] border border-gray-100/80"
            >
              <h2 className="text-[22px] font-black text-gray-900 tracking-tight mb-2 font-heading uppercase">
                Apply for Partnership
              </h2>
              <p className="text-gray-500 text-xs font-semibold mb-8">
                Submit details about your business and goals. We'll review your application and get in touch within 2 business days.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Contact Name & Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Contact Name *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3.5 bg-gray-50/50 hover:bg-gray-50/80 focus:bg-white border border-gray-200 rounded-2xl text-[16px] md:text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-green-100 transition-all placeholder-gray-400"
                      placeholder="Jane Smith"
                    />
                  </div>

                   <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Business Email *</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full px-4 py-3.5 bg-gray-50/50 hover:bg-gray-50/80 focus:bg-white border rounded-2xl text-[16px] md:text-xs font-semibold text-gray-800 focus:outline-none focus:ring-4 transition-all placeholder-gray-400 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-[#1a8b4c] focus:ring-green-100'}`}
                      placeholder="jane@company.com"
                    />
                    {errors.email && <span className="text-red-500 text-xs font-semibold mt-1">{errors.email}</span>}
                  </div>
                </div>

                {/* Company Name & Website URL */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Company Name <span className="text-gray-400 font-semibold lowercase tracking-normal">(optional)</span></label>
                    <input 
                      type="text" 
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      className="w-full px-4 py-3.5 bg-gray-50/50 hover:bg-gray-50/80 focus:bg-white border border-gray-200 rounded-2xl text-[16px] md:text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-green-100 transition-all placeholder-gray-400"
                      placeholder="Acme Corp"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Website URL <span className="text-gray-400 font-semibold lowercase tracking-normal">(optional)</span></label>
                    <input 
                      type="url" 
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
                      className="w-full px-4 py-3.5 bg-gray-50/50 hover:bg-gray-50/80 focus:bg-white border border-gray-200 rounded-2xl text-[16px] md:text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-green-100 transition-all placeholder-gray-400"
                      placeholder="https://company.com"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Mobile Number *</label>
                  <div className="flex gap-2">
                    {/* Premium Country Code Select */}
                    <div className="relative w-32 shrink-0">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-full flex items-center justify-between pl-3 pr-2.5 py-3.5 bg-gray-50/50 hover:bg-gray-50/80 focus:bg-white border border-gray-200 rounded-2xl text-[13px] font-bold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-green-100 transition-all shadow-sm"
                      >
                        <span className="flex items-center gap-2">
                          <FlagIcon iso={selectedCountry.iso} />
                          {selectedCountry.code}
                        </span>
                        <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>

                      {dropdownOpen && (
                        <>
                          {/* Backdrop overlay to close when clicking outside */}
                          <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                          
                          {/* Dropdown Menu Options */}
                          <div className="absolute left-0 mt-1.5 w-64 max-h-60 overflow-y-auto bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1.5 scrollbar-thin scrollbar-thumb-gray-200">
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
                                className={`w-full flex items-center gap-3 px-3 py-2 text-left text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors ${i === selectedCountryIndex ? 'bg-green-50/50 text-[#1a8b4c]' : ''}`}
                              >
                                <FlagIcon iso={c.iso} />
                                <span className="shrink-0">{c.code}</span>
                                <span className="text-gray-400 font-medium truncate">{c.name}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Phone Input Box */}
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
                        className={`w-full px-4 py-3.5 bg-gray-50/50 hover:bg-gray-50/80 focus:bg-white border rounded-2xl text-[16px] md:text-xs font-semibold text-gray-800 focus:outline-none focus:ring-4 transition-all placeholder-gray-400 ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-[#1a8b4c] focus:ring-green-100'}`}
                      />
                    </div>
                  </div>
                  {errors.phone && <span className="text-red-500 text-xs font-semibold mt-1">{errors.phone}</span>}
                </div>

                {/* Message / Proposal Details */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">How can we work together? <span className="text-gray-400 font-semibold lowercase tracking-normal">(optional)</span></label>
                  <textarea 
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3.5 bg-gray-50/50 hover:bg-gray-50/80 focus:bg-white border border-gray-200 rounded-2xl text-[16px] md:text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-green-100 transition-all placeholder-gray-400 resize-none"
                    placeholder="Briefly describe your objectives, target audience, and how you see GlobalWeblify helping..."
                  ></textarea>
                </div>

                {errors.submit && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                    <span className="text-red-600 text-xs font-semibold block">{errors.submit}</span>
                  </div>
                )}

                {/* Submit Button */}
                <m.button 
                  whileHover={{ scale: 1.01, translateY: -1 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={submitting}
                  type="submit"
                  className="w-full bg-[#1a8b4c] hover:bg-[#157a41] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-md shadow-green-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting Application...' : 'Submit Partner Request'}
                  <Send size={13} className="stroke-[2.5]" />
                </m.button>

              </form>
            </m.div>
          </div>

        </div>

      </div>
    </div>
  );
}
