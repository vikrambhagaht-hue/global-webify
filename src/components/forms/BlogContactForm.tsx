"use client";

import React, { useState, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

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

interface BlogContactFormProps {
  sourcePrefix?: string;
}

export default function BlogContactForm({ sourcePrefix }: BlogContactFormProps = {}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    pageSource: '' // Automatically track the page the user is on
  });
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(0);
  const [phoneDigits, setPhoneDigits] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const selectedCountry = COUNTRIES[selectedCountryIndex];

  useEffect(() => {
    // Capture the exact page URL when the component mounts
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const formattedSource = sourcePrefix
        ? `${sourcePrefix}:::General Inquiry`
        : `${path === '/' ? '/ [Homepage]' : path}:::General Inquiry`;
      setFormData(prev => ({ ...prev, pageSource: formattedSource }));
      
      // Automatically detect user's country code based on IP
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          if (data && data.country_calling_code) {
            const detectedCode = data.country_calling_code;
            const idx = COUNTRIES.findIndex(c => c.code === detectedCode);
            if (idx !== -1) {
              setSelectedCountryIndex(idx);
            }
          }
        })
        .catch(err => console.error('Failed to fetch country code', err));
    }
  }, []);

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
      return;
    }

    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.pageSource, // Sends the URL to the admin panel
          message: formData.message
        })
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', message: '', pageSource: formData.pageSource });
        setPhoneDigits('');
        setSelectedCountryIndex(0);
        setErrors({});
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        const data = await res.json();
        setErrors({ submit: data.error || 'Failed to submit form. Please try again later.' });
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setErrors({ submit: 'An error occurred. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-[24px] p-6 md:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-gray-100/80 relative overflow-hidden group">
      {/* Premium subtle glow effect in the corner */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#1a8b4c]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <h3 className="text-[15px] font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2 pb-3 border-b border-gray-100/80 relative z-10">
        <span className="text-[#1a8b4c]"><Sparkles size={16} strokeWidth={2.5} /></span> Request a Free Quote
      </h3>
      
      {submitted ? (
        <div className="p-4 bg-green-50/80 backdrop-blur-sm border border-green-100 text-green-700 rounded-xl text-xs font-bold text-center shadow-sm">
          Thank you! Your message has been sent successfully. We will get back to you shortly.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field: Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Your Name *</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
                className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-[16px] md:text-[13px] font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-[#1a8b4c]/10 transition-all duration-300 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]"
              />
            </div>
            
            {/* Field: Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Your Email *</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
                className={`w-full bg-white/50 border rounded-xl px-4 py-3 text-[16px] md:text-[13px] font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all duration-300 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-[#1a8b4c] focus:ring-[#1a8b4c]/10'}`}
              />
              {errors.email && <span className="text-red-500 text-[11px] font-semibold mt-0.5 ml-1">{errors.email}</span>}
            </div>
          </div>
          
          {/* Field: Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Your Phone *</label>
            <div className="flex gap-2">
              {/* Premium Country Code Select */}
              <div className="relative w-32 shrink-0">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full flex items-center justify-between pl-3 pr-2.5 py-3 bg-white/50 border border-gray-200 rounded-xl text-[13px] font-bold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-[#1a8b4c]/10 transition-all shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]"
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
                  placeholder={selectedCountry.placeholder}
                  className={`w-full bg-white/50 border rounded-xl px-4 py-3 text-[16px] md:text-[13px] font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all duration-300 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-[#1a8b4c] focus:ring-[#1a8b4c]/10'}`}
                />
              </div>
            </div>
            {errors.phone && <span className="text-red-500 text-[11px] font-semibold mt-0.5 ml-1">{errors.phone}</span>}
          </div>
          
          {/* Field: Message */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Message <span className="text-gray-400 font-semibold lowercase tracking-normal">(optional)</span></label>
            <textarea 
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Describe your requirements"
              className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-[16px] md:text-[13px] font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-[#1a8b4c]/10 transition-all duration-300 resize-none shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]"
            />
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <span className="text-red-600 text-xs font-semibold block">{errors.submit}</span>
            </div>
          )}
          
          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-900 hover:bg-[#1a8b4c] text-white rounded-xl py-3.5 text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-[0_4px_15px_-3px_rgba(0,0,0,0.1)] active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending Request...' : 'Get Free Quote'}
            <Send size={12} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </button>
        </form>
      )}
    </div>
  );
}
