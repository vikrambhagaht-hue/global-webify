"use client";

import React, { useState, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

export default function BlogContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    pageSource: '' // Automatically track the page the user is on
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Capture the exact page URL when the component mounts
    if (typeof window !== 'undefined') {
      setFormData(prev => ({ ...prev, pageSource: window.location.href }));
      
      // Automatically detect user's country code based on IP
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          if (data && data.country_calling_code) {
            setFormData(prev => {
              // Only set if the phone field is currently empty
              if (!prev.phone) {
                return { ...prev, phone: `${data.country_calling_code} ` };
              }
              return prev;
            });
          }
        })
        .catch(err => console.error('Failed to fetch country code', err));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert('Failed to submit form. Please try again later.');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      alert('An error occurred. Please try again later.');
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
                className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-[16px] md:text-[13px] font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-[#1a8b4c]/10 transition-all duration-300 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]"
              />
            </div>
          </div>
          
          {/* Field: Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Your Phone *</label>
            <input 
              type="tel" 
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
              className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-[16px] md:text-[13px] font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-[#1a8b4c]/10 transition-all duration-300 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]"
            />
          </div>
          
          {/* Field: Message */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Message</label>
            <textarea 
              rows={2}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your project..."
              className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-[16px] md:text-[13px] font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-[#1a8b4c]/10 transition-all duration-300 resize-none shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]"
            />
          </div>
          
          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r from-[#1a8b4c] to-[#2ecc71] hover:from-[#15703d] hover:to-[#1a8b4c] text-white font-black py-3.5 px-6 rounded-xl shadow-[0_8px_20px_-6px_rgba(26,139,76,0.4)] transition-all flex items-center justify-center gap-2 text-[13px] tracking-widest uppercase mt-3 group ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_12px_25px_-6px_rgba(26,139,76,0.5)]'}`}
          >
            {isSubmitting ? (
              <>Sending... <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin ml-1" /></>
            ) : (
              <>Submit Request <Send size={14} className="stroke-[2.5] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
