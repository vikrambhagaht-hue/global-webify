"use client";

import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Send, Facebook, Twitter, 
  Instagram, Linkedin, Youtube, User, Briefcase, 
  Building2, Handshake, Globe2, CheckCircle2, MessageSquare
} from 'lucide-react';
import { SOCIAL_LINKS } from '@/constants/navigation';

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 4000);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: ''
        });
      } else {
        alert('Failed to send message: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while sending your message. Please try again.');
    }
  };

  return (
    <div className="pt-24 pb-20 bg-[#f4fbf7] relative overflow-hidden font-sans">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-200/20 blur-[150px] rounded-full -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-200/20 blur-[150px] rounded-full -ml-64 -mb-64 pointer-events-none" />

      {/* Custom Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <m.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[9999] bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-800"
          >
            <div className="w-8 h-8 rounded-full bg-[#1a8b4c] flex items-center justify-center text-white shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-green-400">Success</p>
              <p className="text-xs font-semibold text-gray-300">Message sent! We'll get back within 24 hours.</p>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <div className="container-custom relative z-10 px-4 max-w-7xl mx-auto">
        
        {/* Title Header */}
        <div className="text-center mb-8">
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-[#dcfce7] border border-green-200 px-4 py-1.5 rounded-full mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-[#1a8b4c] animate-pulse" />
            <span className="text-[#1a8b4c] text-[11px] font-black uppercase tracking-widest">Connect with Experts</span>
          </m.div>

          <m.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[32px] md:text-[44px] font-black font-heading text-gray-900 leading-none mb-4"
          >
            Let's Start Your <span className="text-[#1a8b4c]">Success Story</span>
          </m.h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-[15px] font-medium leading-relaxed">
            Have a project in mind or want to consult with our experts? Send us a query or call us at any of our global offices.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Premium Contact Form */}
          <div className="lg:col-span-7">
            <m.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 md:p-10 rounded-[32px] shadow-[0_12px_40px_-15px_rgba(26,139,76,0.08)] border border-gray-100/80"
            >
              <h2 className="text-[22px] font-black text-gray-900 tracking-tight mb-2 font-heading">
                Send Us a Message
              </h2>
              <p className="text-gray-500 text-xs font-semibold mb-8">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name and Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Full Name *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <User size={15} />
                      </div>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 hover:bg-gray-50/80 focus:bg-white border border-gray-200 rounded-2xl text-[16px] md:text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-green-100 transition-all placeholder-gray-400"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Email Address *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Mail size={15} />
                      </div>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 hover:bg-gray-50/80 focus:bg-white border border-gray-200 rounded-2xl text-[16px] md:text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-green-100 transition-all placeholder-gray-400"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone and Service Dropdown */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Phone size={15} />
                      </div>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 hover:bg-gray-50/80 focus:bg-white border border-gray-200 rounded-2xl text-[16px] md:text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-green-100 transition-all placeholder-gray-400"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Interested Service</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Briefcase size={15} />
                      </div>
                      <select 
                        value={formData.service}
                        onChange={(e) => setFormData({...formData, service: e.target.value})}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 hover:bg-gray-50/80 focus:bg-white border border-gray-200 rounded-2xl text-[16px] md:text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-green-100 transition-all cursor-pointer appearance-none"
                      >
                        <option value="">Select a service...</option>
                        <option value="web-dev">Web Development</option>
                        <option value="seo">SEO Services</option>
                        <option value="marketing">Digital Marketing</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Your Message *</label>
                  <div className="relative">
                    <div className="absolute top-4 left-4 pointer-events-none text-gray-400">
                      <MessageSquare size={15} />
                    </div>
                    <textarea 
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 hover:bg-gray-50/80 focus:bg-white border border-gray-200 rounded-2xl text-[16px] md:text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-green-100 transition-all placeholder-gray-400 resize-none"
                      placeholder="Tell us about your project..."
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <m.button 
                  whileHover={{ scale: 1.01, translateY: -1 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="w-full bg-[#1a8b4c] hover:bg-[#157a41] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-md shadow-green-900/10"
                >
                  Send Message
                  <Send size={13} className="stroke-[2.5]" />
                </m.button>

              </form>
            </m.div>
          </div>

          {/* RIGHT COLUMN: Contact Details & Map */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Interactive Map Widget */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-[32px] overflow-hidden shadow-[0_12px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100"
            >
              <div className="w-full h-[220px] relative bg-gray-100">
                <iframe
                  title="Global Webify HQ Map Location"
                  src="https://maps.google.com/maps?q=Alam%20Complex,%20Ashok%20Nagar%20Road,%20Kadru,%20Ranchi,%20Jharkhand%20834002&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 transition-all duration-500"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </m.div>

            {/* Our Offices Card */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 md:p-8 rounded-[32px] shadow-[0_12px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-[#1a8b4c]">
                  <Globe2 size={18} />
                </div>
                <h3 className="text-base font-black text-gray-900 uppercase tracking-wider font-heading">
                  Our Offices
                </h3>
              </div>

              <div className="space-y-6">
                {/* Global Webify (HQ) */}
                <div>
                  <h4 className="text-xs font-black text-[#1a8b4c] uppercase tracking-wider mb-2">
                    Global Webify (HQ)
                  </h4>
                  <div className="space-y-2 text-xs font-semibold text-gray-600">
                    <div className="flex items-start gap-2.5">
                      <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                      <a href="https://maps.google.com/?q=2nd+Floor,+Alam+Complex,+Ashok+Nagar+Road,+Kadru,+Ranchi,+Jharkhand+834002" target="_blank" rel="noopener noreferrer" title="View Ranchi HQ on Google Maps - Global Webify" className="hover:text-[#1a8b4c] transition-colors">2nd Floor, Alam Complex, Ashok Nagar Road, Kadru, Ranchi, Jharkhand 834002</a>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone size={14} className="text-gray-400" />
                      <a href="tel:+917563901100" className="hover:text-[#1a8b4c] transition-colors">+91 75639 01100</a>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Mail size={14} className="text-gray-400" />
                      <a href="mailto:help@globalwebify.com" className="hover:text-[#1a8b4c] transition-colors">help@globalwebify.com</a>
                    </div>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-100" />

                {/* US Branch */}
                <div>
                  <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-2">
                    US Branch
                  </h4>
                  <div className="space-y-2 text-xs font-semibold text-gray-600">
                    <div className="flex items-start gap-2.5">
                      <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                      <a href="https://maps.google.com/?q=473+Mundet+Place,+Ste+US,+Hillside,+New+Jersey+07205" target="_blank" rel="noopener noreferrer" title="View US Office on Google Maps - Global Webify" className="hover:text-[#1a8b4c] transition-colors">473 Mundet Place, Ste US, Hillside, New Jersey 07205</a>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone size={14} className="text-gray-400" />
                      <a href="tel:+19175908135" className="hover:text-[#1a8b4c] transition-colors">+1 9175908135</a>
                    </div>
                  </div>
                </div>
              </div>
            </m.div>

            {/* Partner Offices Card */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 md:p-8 rounded-[32px] shadow-[0_12px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-[#1a8b4c]">
                  <Handshake size={18} />
                </div>
                <h3 className="text-base font-black text-gray-900 uppercase tracking-wider font-heading">
                  Partner Offices
                </h3>
              </div>

              <div className="space-y-6">
                {/* Skill Power (Kolkata) */}
                <div>
                  <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-2">
                    Skill Power (Kolkata)
                  </h4>
                  <div className="space-y-2 text-xs font-semibold text-gray-600">
                    <div className="flex items-start gap-2.5">
                      <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                      <a href="https://maps.google.com/?q=36/1E/1L,+Topsia+Road,+Kolkata+-+700039" target="_blank" rel="noopener noreferrer" title="View Kolkata Partner Office on Google Maps - Global Webify" className="hover:text-[#1a8b4c] transition-colors">36/1E/1L, Topsia Road, Kolkata - 700039</a>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone size={14} className="text-gray-400" />
                      <a href="tel:+913335637354" className="hover:text-[#1a8b4c] transition-colors">+91 33 35637354</a>
                    </div>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-100" />

                {/* FutureNxt (Dubai) */}
                <div>
                  <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-2">
                    FutureNxt (Dubai)
                  </h4>
                  <div className="space-y-2 text-xs font-semibold text-gray-600">
                    <div className="flex items-start gap-2.5">
                      <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                      <span>Office 18, 2nd Floor, Aspin Commercial Tower</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone size={14} className="text-gray-400" />
                      <a href="tel:+971508461253" className="hover:text-[#1a8b4c] transition-colors">+97 150 846 1253</a>
                    </div>
                  </div>
                </div>
              </div>
            </m.div>

            {/* Connect With Us Card */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-6 rounded-[32px] shadow-[0_12px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 text-center"
            >
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                Connect With Us
              </h3>
              <div className="flex justify-center gap-3">
                {SOCIAL_LINKS.map((social, i) => {
                  const IconMap: Record<string, any> = {
                    Facebook: Facebook,
                    Twitter: Twitter,
                    Linkedin: Linkedin,
                    Instagram: Instagram,
                    Youtube: Youtube
                  };
                  const Icon = IconMap[social.name] || Facebook;
                  return (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-50 border border-gray-100 hover:border-green-200 rounded-xl flex items-center justify-center text-gray-500 hover:bg-green-50 hover:text-[#1a8b4c] transition-all"
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            </m.div>

          </div>

        </div>

      </div>
    </div>
  );
}
