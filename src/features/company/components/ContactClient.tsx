"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Send, Facebook, Twitter, 
  Instagram, Linkedin, Youtube, User, Briefcase, 
  Building2, Handshake, Globe2, CheckCircle2, MessageSquare, ShieldAlert, ArrowRight
} from 'lucide-react';
import { SOCIAL_LINKS } from '@/constants/navigation';

// Map widget removed in favor of static image

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
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(0);
  const [phoneDigits, setPhoneDigits] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });
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
      newErrors.phone = "Phone number is required.";
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
      const payload = {
        ...formData,
        service: `/contact:::${formData.service || 'General Inquiry'}`
      };
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.success) {
        triggerToast("Message sent! We'll be in touch shortly.", 'success');
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
        setPhoneDigits('');
        setSelectedCountryIndex(0);
        setErrors({});
      } else {
        setErrors({ submit: data.error || 'Failed to send message. Please try again.' });
        triggerToast(data.error || 'Failed to send message. Please try again.', 'error');
      }
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'An error occurred while sending your message. Please try again.' });
      triggerToast('An error occurred. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 md:pt-24 pb-12 md:pb-20 bg-gray-50 relative overflow-hidden font-sans">
      {/* Premium Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-200/30 blur-[150px] rounded-full -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-200/20 blur-[150px] rounded-full -ml-64 -mb-64 pointer-events-none" />

      {/* Toast Notification */}
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
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#1a8b4c] animate-pulse" />
            <span className="text-gray-600 text-xs font-black uppercase tracking-widest">Connect with Experts</span>
          </m.div>

          <m.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[28px] md:text-[52px] font-black font-heading text-gray-900 leading-tight mb-6"
          >
            Let's Start Your <span className="text-[#1a8b4c]">Success Story</span>
          </m.h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-[15px] md:text-[17px] font-medium leading-relaxed">
            Ready to transform your digital presence? Send us a message or visit one of our global offices. We're here to help you scale.
          </p>
        </div>

        {/* 2-Column Premium Grid */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
          
          {/* LEFT COLUMN: Clean Light Form */}
          <div className="lg:col-span-7">
            <m.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="bg-white p-5 md:p-12 rounded-[32px] border border-gray-100 h-full flex flex-col justify-center relative overflow-hidden group"
            >
              {/* Subtle Form Highlight */}
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-green-50 to-transparent blur-[80px] rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

              <h2 className="text-[26px] font-black text-gray-900 tracking-tight mb-2 font-heading relative z-10">
                Send Us a Message
              </h2>
              <p className="text-gray-500 text-sm font-medium mb-10 relative z-10">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Full Name *</label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-[#1a8b4c] transition-colors">
                        <User size={16} />
                      </div>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-2xl text-[15px] font-medium text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-green-50 transition-all placeholder-gray-400 shadow-sm shadow-gray-100/50"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Email Address *</label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-[#1a8b4c] transition-colors">
                        <Mail size={16} />
                      </div>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={`w-full pl-12 pr-4 py-4 bg-gray-50 hover:bg-white focus:bg-white border rounded-2xl text-[15px] font-medium text-gray-800 focus:outline-none focus:ring-4 transition-all placeholder-gray-400 shadow-sm shadow-gray-100/50 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-[#1a8b4c] focus:ring-green-50'}`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && <span className="text-red-500 text-xs font-semibold mt-1">{errors.email}</span>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                   <div className="flex flex-col gap-2">
                     <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Phone Number *</label>
                     <div className="flex gap-2">
                       {/* Premium Country Code Select */}
                       <div className="relative w-36 shrink-0">
                         <button
                           type="button"
                           onClick={() => setDropdownOpen(!dropdownOpen)}
                           className="w-full flex items-center justify-between pl-3 pr-2.5 py-4 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-2xl text-[13px] font-bold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-green-50 transition-all shadow-sm shadow-gray-100/50"
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
                           className={`w-full px-4 py-4 bg-gray-50 hover:bg-white focus:bg-white border rounded-2xl text-[15px] font-medium text-gray-800 focus:outline-none focus:ring-4 transition-all placeholder-gray-400 shadow-sm shadow-gray-100/50 ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-[#1a8b4c] focus:ring-green-50'}`}
                           placeholder={selectedCountry.placeholder}
                         />
                       </div>
                     </div>
                     {errors.phone && <span className="text-red-500 text-xs font-semibold mt-1">{errors.phone}</span>}
                   </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Interested Service <span className="text-gray-400 font-semibold lowercase tracking-normal">(optional)</span></label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-[#1a8b4c] transition-colors">
                        <Briefcase size={16} />
                      </div>
                      <select 
                        value={formData.service}
                        onChange={(e) => setFormData({...formData, service: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-2xl text-[15px] font-medium text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-green-50 transition-all cursor-pointer appearance-none shadow-sm shadow-gray-100/50"
                      >
                        <option value="">Select a service...</option>
                        <option value="web-dev">Web Development</option>
                        <option value="seo">SEO Services</option>
                        <option value="marketing">Digital Marketing</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Your Message <span className="text-gray-400 font-semibold lowercase tracking-normal">(optional)</span></label>
                  <div className="relative group/input">
                    <div className="absolute top-5 left-4 pointer-events-none text-gray-400 group-focus-within/input:text-[#1a8b4c] transition-colors">
                      <MessageSquare size={16} />
                    </div>
                    <textarea 
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 rounded-2xl text-[15px] font-medium text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-green-50 transition-all placeholder-gray-400 resize-none shadow-sm shadow-gray-100/50"
                      placeholder="Tell us about your project..."
                    ></textarea>
                  </div>
                </div>

                {errors.submit && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                    <span className="text-red-600 text-xs font-semibold block">{errors.submit}</span>
                  </div>
                )}

                <m.button 
                  whileHover={{ scale: 1.01, translateY: -2 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={submitting}
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-[#1a8b4c] text-white py-4 md:py-5 rounded-2xl font-black text-[13px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-gray-900/20 hover:shadow-green-900/30 group/btn mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                  <Send size={15} className="stroke-[2.5] group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </m.button>

              </form>
            </m.div>
          </div>
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="bg-slate-900 rounded-[32px] overflow-hidden h-full flex flex-col relative">
              {/* Premium Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a8b4c]/10 to-transparent opacity-50 pointer-events-none" />

              {/* Static Map Image (Instant Load) */}
              <a 
                href="https://www.google.com/maps/place/Global+Webify/@23.3495578,85.3086946,17.82z/data=!3m1!5s0x39f4e0528e2c8fa7:0xf0b8c1d5d5dbe41a!4m6!3m5!1s0x39f4e195a816671d:0xa9ebf12893abb828!8m2!3d23.3496601!4d85.3104862!16s%2Fg%2F11wbvkw_tm"
                target="_blank"
                rel="noopener noreferrer"
                title="Open Global Webify in Google Maps"
                className="w-full h-[280px] md:h-[350px] relative shrink-0 overflow-hidden group border-b border-slate-700/50 block cursor-pointer"
              >
                {/* User's Map Screenshot */}
                <Image
                  src="/globalwebifymap.png"
                  alt="Global Webify Map Location"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Optional dark edge blending to match original map widget style */}
                <div className="absolute inset-0 bg-slate-900/10 pointer-events-none mix-blend-overlay" />

                {/* Always Visible Corner Button */}
                <div className="absolute top-4 right-4 z-20">
                  <span className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl text-[11px] font-black text-gray-800 shadow-lg shadow-black/10 uppercase tracking-widest border border-green-100 flex items-center gap-2 hover:bg-[#1a8b4c] hover:text-white hover:scale-105 active:scale-95 transition-all duration-300">
                    <MapPin size={14} className="text-[#1a8b4c] group-hover:text-white" />
                    Open in Maps
                    <ArrowRight size={12} className="opacity-70" />
                  </span>
                </div>
              </a>

              {/* Contact Info Content */}
              <div className="p-6 md:p-10 flex-grow flex flex-col justify-between relative z-10">
                <div className="space-y-10">
                  
                  {/* HQ Info */}
                  <div>
                    <h3 className="text-[11px] font-black text-green-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                      <Globe2 size={14} /> Global Webify (HQ)
                    </h3>
                    <div className="space-y-4 text-sm font-medium text-gray-300">
                      <div className="flex items-start gap-4">
                        <MapPin size={18} className="text-gray-500 shrink-0 mt-0.5" />
                        <a href="https://maps.google.com/?q=2nd+Floor,+Alam+Complex,+Ashok+Kunj,+Kadru,+Ranchi,+Jharkhand+834002" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors leading-relaxed">
                          2nd Floor, Alam Complex, Ashok Kunj,<br/> Kadru, Ranchi, Jharkhand 834002
                        </a>
                      </div>
                      <div className="flex items-center gap-4">
                        <Phone size={18} className="text-gray-500" />
                        <a href="tel:+917563901100" className="hover:text-white transition-colors">+91 75639 01100</a>
                      </div>
                      <div className="flex items-center gap-4">
                        <Mail size={18} className="text-gray-500" />
                        <a href="mailto:help@globalwebify.com" className="hover:text-white transition-colors">help@globalwebify.com</a>
                      </div>
                    </div>
                  </div>

                  {/* Other Branches Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 pt-8 border-t border-slate-800">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">
                        US Branch
                      </h4>
                      <p className="text-xs font-medium text-gray-400 mb-1 line-clamp-2" title="473 Mundet Place, Ste US, Hillside, New Jersey 07205">
                        473 Mundet Place, Ste US<br/>Hillside, NJ 07205
                      </p>
                      <a href="tel:+19175908135" className="text-xs text-[#1a8b4c] hover:text-green-400 font-bold">+1 9175908135</a>
                    </div>
                    
                    <div>
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">
                        Dubai Partner
                      </h4>
                      <p className="text-xs font-medium text-gray-400 mb-1 line-clamp-2" title="Office 18, 2nd Floor, Aspin Commercial Tower">
                        Office 18, 2nd Floor<br/>Aspin Commercial Tower
                      </p>
                      <a href="tel:+971508461253" className="text-xs text-[#1a8b4c] hover:text-green-400 font-bold">+97 150 846 1253</a>
                    </div>
                  </div>
                </div>

                {/* Social Links Bottom Bar */}
                <div className="pt-8 mt-8 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Connect Online</span>
                  <div className="flex gap-2.5">
                    {SOCIAL_LINKS.map((social, i) => {
                      const IconMap: Record<string, any> = { Facebook, Twitter, Linkedin, Instagram, Youtube };
                      const Icon = IconMap[social.name] || Facebook;
                      return (
                        <a
                          key={i}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-slate-800/50 hover:bg-[#1a8b4c] flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                        >
                          <Icon size={16} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
