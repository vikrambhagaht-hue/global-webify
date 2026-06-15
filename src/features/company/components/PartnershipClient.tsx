"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Send, CheckCircle2, Building2, 
  Handshake, Globe2, Sparkles, Award, Users2, LineChart, ShieldCheck
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

export default function PartnershipClient({ settings }: PartnershipClientProps) {
  const heroTitle = settings?.partnershipHeroTitle || "Become a GlobalWeblify Partner";
  const heroDesc = settings?.partnershipHeroDesc || "We invite you to become our partner for mutually beneficial collaboration. Our company offers various partnership programs with terms tailored to businesses of all types and sizes.";
  const heading = settings?.partnershipHeading || "Accelerate Growth Together";
  const desc = settings?.partnershipDesc || "Whether you run an agency looking to outsource development, a consultant recommending leading web platforms, or an integration provider, we construct synergistic structures that deliver results.";
  const pageImage = settings?.partnershipPageImage || "/partnership/Partner1.jpg";
  const expandHeading = settings?.partnershipExpandHeading || "Detailed Partnership Program Overview & Dynamic Synergies";
  const expandParagraph = settings?.partnershipExpandParagraph || "At GlobalWeblify, we believe that the most robust digital ecosystems are built on collaboration, mutual trust, and a shared vision for excellence. Our comprehensive Partnership Program is engineered to empower agencies, IT consultants, software developers, independent marketers, and enterprises by providing seamless access to our industry-leading technical and creative capabilities. Over the years, we have built a reputational foundation for delivering top-tier website development, custom CRM development, data-driven SEO campaigns, performance-focused digital marketing, and reliable corporate web hosting solutions. By joining our network, you are not just outsourcing development work—you are integrating a highly skilled, dedicated team of developers, designers, system administrators, and digital strategists into your own business framework, allowing you to scale without the overhead costs of in-house recruitment.\n\nOur partnership structures are categorized into three core models to align perfectly with your organizational workflow:\n1. Referral and Affiliate Network: Ideal for consultants, influencers, and boutique business advisors who encounter clients needing premium digital services. Refer projects to GlobalWeblify and earn lucrative, recurring commissions with zero project management overhead. We handle the discovery, proposal, development, deployment, and ongoing support.\n2. Agency Reseller and White-Label Services: Tailored for design agencies, PR firms, and digital marketing consultancies that want to offer high-end development and deep technical SEO to their clients under their own brand. We operate invisibly behind the scenes, respecting strict NDA guidelines and delivering projects that make your brand shine.\n3. Strategic Co-Development: For technology providers and software integrators seeking custom database engines, APIs, and specialized CMS modifications. Together, we tackle complex architectures, ensuring your clients receive state-of-the-art technological solutions.\n\nAdditionally, as a validated partner, you gain direct access to our prioritized ticketing system, co-marketing support, exclusive pricing discounts, pre-sales technical support (including assistance in pitching to high-value prospects), and advanced roadmap previews. We provide comprehensive marketing collateral, training sessions, and customizable proposal templates to ensure your sales team can position our collective services with absolute confidence. Together, we can transform complex client challenges into streamlined, high-performance web products that accelerate business growth and maximize ROI.";

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    websiteUrl: '',
    partnershipType: '',
    message: ''
  });
  const [showToast, setShowToast] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('/api/partnership', {
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
          companyName: '',
          websiteUrl: '',
          partnershipType: '',
          message: ''
        });
      } else {
        alert('Failed to send inquiry: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: Award,
      title: "Industry Excellence",
      desc: "Deliver premium web development, SEO, and digital marketing services powered by vetted specialists.",
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      icon: Users2,
      title: "Shared Growth",
      desc: "Unlock referral commissions, co-marketing budgets, and exclusive partner pricing models.",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: LineChart,
      title: "Business Support",
      desc: "Get dedicated partner managers, technical support, and premium pre-sales assistance.",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      icon: ShieldCheck,
      title: "Trusted Execution",
      desc: "Guaranteed SLA delivery, non-disclosure compliance, and professional white-label capabilities.",
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    }
  ];

  return (
    <div className="pt-16 pb-16 bg-[#f4fbf7] relative overflow-hidden font-sans">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-200/20 blur-[150px] rounded-full -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#1a8b4c]/10 blur-[150px] rounded-full -ml-64 -mb-64 pointer-events-none" />

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
              <p className="text-xs font-black uppercase tracking-wider text-green-400">Application Received</p>
              <p className="text-xs font-semibold text-gray-300">Thank you! Our Partnership Team will contact you shortly.</p>
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

            <p className="text-gray-600 text-sm md:text-[15px] font-semibold leading-relaxed max-w-xl">
              {heroDesc}
            </p>

            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#0052cc] to-[#0082f0] hover:from-[#0041a3] hover:to-[#006ec7] text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-wider transition-all shadow-md hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0"
              >
                Get in touch
                <svg className="w-4.5 h-4.5 text-white stroke-[2.5] w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
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
                src={pageImage} 
                alt="Become a Partner"
                className="w-full h-auto max-h-[440px] object-contain rounded-2xl drop-shadow-sm hover:scale-[1.02] transition-transform duration-500" 
              />
            </m.div>
          </div>
        </div>

        {/* Expandable Overview Section */}
        {expandParagraph && (
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-[32px] p-6 md:p-10 mb-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <h2 className="text-[20px] md:text-[26px] font-black text-[#1a8b4c] tracking-tight mb-4 font-heading uppercase">
              {expandHeading}
            </h2>
            
            <m.div 
              animate={{ height: isExpanded ? 'auto' : '360px' }}
              transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="relative overflow-hidden"
            >
              <div className="text-gray-600 text-sm md:text-[15px] font-semibold leading-relaxed space-y-4 pr-1">
                {expandParagraph.split('\n').map((para, idx) => (
                  para.trim() && <p key={idx}>{para}</p>
                ))}
              </div>
              
              {/* Fade out effect when collapsed */}
              {!isExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none z-10" />
              )}
            </m.div>
            
            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-2 bg-[#0082f0] hover:bg-[#006ec7] text-white px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                {isExpanded ? (
                  <>
                    See Less
                    <svg className="w-4 h-4 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    See More
                    <svg className="w-4 h-4 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* 2-Column Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: Why Partner Info & Benefits */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-[24px] font-black text-gray-900 tracking-tight font-heading uppercase">
                {heading}
              </h2>
              <p className="text-gray-600 text-sm font-semibold leading-relaxed">
                {desc}
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="space-y-4">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <m.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="flex items-start gap-4 p-5 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className={`p-3 rounded-2xl shrink-0 ${benefit.bg} ${benefit.color}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-gray-500 text-[12px] font-semibold leading-relaxed">
                        {benefit.desc}
                      </p>
                    </div>
                  </m.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Premium Partnership Form */}
          <div className="lg:col-span-7">
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
                      className="w-full px-4 py-3.5 bg-gray-50/50 hover:bg-gray-50/80 focus:bg-white border border-gray-200 rounded-2xl text-[16px] md:text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-green-100 transition-all placeholder-gray-400"
                      placeholder="jane@company.com"
                    />
                  </div>
                </div>

                {/* Company Name & Website URL */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Company Name</label>
                    <input 
                      type="text" 
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      className="w-full px-4 py-3.5 bg-gray-50/50 hover:bg-gray-50/80 focus:bg-white border border-gray-200 rounded-2xl text-[16px] md:text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-green-100 transition-all placeholder-gray-400"
                      placeholder="Acme Corp"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Website URL</label>
                    <input 
                      type="url" 
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
                      className="w-full px-4 py-3.5 bg-gray-50/50 hover:bg-gray-50/80 focus:bg-white border border-gray-200 rounded-2xl text-[16px] md:text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-green-100 transition-all placeholder-gray-400"
                      placeholder="https://company.com"
                    />
                  </div>
                </div>

                {/* Phone & Partnership Type */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3.5 bg-gray-50/50 hover:bg-gray-50/80 focus:bg-white border border-gray-200 rounded-2xl text-[16px] md:text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-green-100 transition-all placeholder-gray-400"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Partnership Model *</label>
                    <div className="relative">
                      <select 
                        required
                        value={formData.partnershipType}
                        onChange={(e) => setFormData({...formData, partnershipType: e.target.value})}
                        className="w-full px-4 py-3.5 bg-gray-50/50 hover:bg-gray-50/80 focus:bg-white border border-gray-200 rounded-2xl text-[16px] md:text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-green-100 transition-all cursor-pointer appearance-none"
                      >
                        <option value="">Select a model...</option>
                        <option value="agency">Agency / Outsourcing Partner</option>
                        <option value="referral">Referral / Affiliate Partner</option>
                        <option value="tech">Technology / Integration Partner</option>
                        <option value="other">Other / Custom Collaboration</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message / Proposal Details */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">How can we work together? *</label>
                  <textarea 
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3.5 bg-gray-50/50 hover:bg-gray-50/80 focus:bg-white border border-gray-200 rounded-2xl text-[16px] md:text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-green-100 transition-all placeholder-gray-400 resize-none"
                    placeholder="Briefly describe your objectives, target audience, and how you see GlobalWeblify helping..."
                  ></textarea>
                </div>

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
