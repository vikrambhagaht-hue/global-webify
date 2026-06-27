"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Facebook, Twitter, Instagram, Linkedin, Youtube, 
  Mail, Phone, MapPin, Code, ShoppingCart, Globe, 
  Smartphone, Settings, Search, Share2, FileText, 
  Megaphone, BarChart3, Headphones, Clock,
  ExternalLink, Palette, RefreshCw, Wrench, Target, MessageCircle
} from 'lucide-react';
import { SOCIAL_LINKS } from '@/constants/navigation';
import { usePathname } from 'next/navigation';
import { CITIES_MAP } from '@/features/services/constants/cities';

const serviceCol1 = [
  { name: "Custom Web Development", href: "/web-development", icon: Code, color: "text-teal-500 bg-teal-50" },
  { name: "E-commerce Solutions", href: "/ecommerce-web-designing", icon: ShoppingCart, color: "text-orange-500 bg-orange-50" },
  { name: "Web Design Services", href: "/web-design-services", icon: Palette, color: "text-purple-500 bg-purple-50" },
  { name: "Responsive Design", href: "/responsive-web-designing", icon: Smartphone, color: "text-blue-500 bg-blue-50" },
  { name: "Website Redesigning", href: "/website-redesigning", icon: RefreshCw, color: "text-cyan-500 bg-cyan-50" },
  { name: "Website Maintenance", href: "/website-maintenance", icon: Wrench, color: "text-gray-500 bg-gray-100" },
  { name: "Small Business Website", href: "/small-business-website", icon: Globe, color: "text-emerald-500 bg-emerald-50" },
  { name: "Customised Website", href: "/customised-website-designing", icon: Settings, color: "text-indigo-500 bg-indigo-50" },
];

const serviceCol2 = [
  { name: "SEO Services", href: "/seo-services", icon: Search, color: "text-orange-500 bg-orange-50" },
  { name: "Social Media Marketing", href: "/social-media-marketing", icon: Share2, color: "text-pink-500 bg-pink-50" },
  { name: "Content Marketing", href: "/content-marketing", icon: FileText, color: "text-teal-500 bg-teal-50" },
  { name: "Google Ads Management", href: "/google-ads-management", icon: Target, color: "text-red-500 bg-red-50" },
  { name: "Digital Marketing", href: "/digital-marketing", icon: BarChart3, color: "text-blue-500 bg-blue-50" },
  { name: "AI SEO Services", href: "/ai-seo-services", icon: Search, color: "text-violet-500 bg-violet-50" },
  { name: "SMO Services", href: "/smo-services", icon: Megaphone, color: "text-amber-500 bg-amber-50" },
  { name: "WhatsApp Marketing", href: "/whatsapp-marketing", icon: MessageCircle, color: "text-green-500 bg-green-50" },
];

const crmCol = [
  { name: "CRM Software Development", href: "/crm-software-development", icon: Settings, color: "text-indigo-500 bg-indigo-50" },
  { name: "Lead Management Software", href: "/lead-management-software", icon: Target, color: "text-red-500 bg-red-50" },
  { name: "Hotel Management Software", href: "/hotel-management-software", icon: Wrench, color: "text-gray-500 bg-gray-100" },
  { name: "Hospital Management Software", href: "/hospital-management-software", icon: Globe, color: "text-emerald-500 bg-emerald-50" },
  { name: "HR Management Software", href: "/hr-management-software", icon: Code, color: "text-teal-500 bg-teal-50" },
  { name: "School Management Software", href: "/school-management-software", icon: ShoppingCart, color: "text-orange-500 bg-orange-50" }
];


const contactDetails = [
  { type: "Email", value: "help@globalwebify.com", icon: <Mail size={16} />, color: "bg-blue-50 text-blue-500" },
  { type: "Main", value: "+91 7563901100", icon: <Phone size={16} />, color: "bg-pink-50 text-pink-500" },
  { type: "Toll Free", value: "1800-890-5489", icon: <Phone size={16} />, color: "bg-pink-50 text-pink-500" },
  { type: "US Office", value: "+1 9175908135", icon: <Phone size={16} />, color: "bg-pink-50 text-pink-500" },
];

export default function Footer() {
  const pathname = usePathname();
  const citySlugs = Object.keys(CITIES_MAP);
  const segments = pathname.split('/').filter(Boolean);
  const isCityHome = segments.length === 1 && citySlugs.includes(segments[0].toLowerCase());
  const isHomepage = pathname === '/' || isCityHome;

  const currentCity = segments.length > 0 && citySlugs.includes(segments[0].toLowerCase()) 
    ? segments[0].toLowerCase() 
    : null;

  const [shouldLoadImages, setShouldLoadImages] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoadImages(true);
          observer.disconnect();
        }
      },
      { rootMargin: '1000px' }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getDynamicLink = (href: string) => {
    if (currentCity) {
      const cleanHref = href.startsWith('/') ? href : `/${href}`;
      return `/${currentCity}${cleanHref}`;
    }
    return href;
  };

  return (
    <footer ref={footerRef} className={`bg-[#f8fbfa] pt-12 ${isHomepage ? 'pb-[75px]' : 'pb-12'} md:pt-20 md:pb-12 font-sans border-t border-gray-100`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-12 lg:mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-3 space-y-8 text-center lg:text-left">
            <Link href="/" className="inline-block relative w-[180px] h-[80px] mx-auto lg:mx-0">
              <Image 
                src="/global_webify_logo.png" 
                alt="Logo - Global Webify" 
                title="Logo - Global Webify"
                fill
                className="object-contain" 
                sizes="180px"
              />
            </Link>
            <p className="text-[15px] text-gray-600 font-medium leading-relaxed max-w-sm mx-auto lg:mx-0">
              Your trusted digital partner for web development, digital marketing, and branding. We help businesses grow with modern, effective, and affordable digital solutions.
            </p>

            {/* Business Hours & Trust Info */}
            <div className="pt-6 border-t border-gray-100/80 space-y-4 max-w-sm mx-auto lg:mx-0 text-left">
              {/* Business Hours */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700 font-semibold text-[13px]">
                  <Clock size={16} className="text-[#1a8b4c]" />
                  <span>Business Hours</span>
                </div>
                <div className="pl-6 text-[12px] text-gray-500 font-medium space-y-1">
                  <p>Monday - Saturday: 11:00 AM - 07:00 PM</p>
                  <p className="text-red-600 font-semibold">Sunday: Closed</p>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-100 rounded-xl shadow-xs">
                  <span className="text-[11px] font-black text-amber-600">★ 4.7/5</span>
                  <span className="text-[10px] font-bold text-gray-600">Google Rating</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-100 rounded-xl shadow-xs">
                  <span className="text-[10px] font-bold text-gray-600">ISO 9001:2015</span>
                </div>
              </div>
            </div>
          </div>

          {/* Our Services - 2 icon columns */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
               <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#1a8b4c]">
                 <Settings size={20} className="animate-spin-slow" />
               </div>
               <h3 className="text-[20px] font-black text-gray-950 uppercase tracking-tight">Our Services</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-x-6">
              {/* Left service column */}
              <div className="space-y-3.5">
                {serviceCol1.map((service, i) => {
                  const Icon = service.icon;
                  return (
                    <Link 
                      key={i}
                      href={getDynamicLink(service.href)} 
                      className="group flex items-center gap-2.5 hover:translate-x-1 transition-transform duration-200"
                    >
                      <div className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center ${service.color} transition-transform group-hover:scale-110`}>
                        <Icon size={14} />
                      </div>
                      <span className="text-[13px] text-gray-600 font-semibold group-hover:text-[#1a8b4c] transition-colors leading-tight">{service.name}</span>
                    </Link>
                  );
                })}
              </div>
              {/* Right service column */}
              <div className="space-y-3.5">
                {serviceCol2.map((service, i) => {
                  const Icon = service.icon;
                  return (
                    <Link 
                      key={i}
                      href={getDynamicLink(service.href)} 
                      className="group flex items-center gap-2.5 hover:translate-x-1 transition-transform duration-200"
                    >
                      <div className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center ${service.color} transition-transform group-hover:scale-110`}>
                        <Icon size={14} />
                      </div>
                      <span className="text-[13px] text-gray-600 font-semibold group-hover:text-[#1a8b4c] transition-colors leading-tight">{service.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* CRM Solutions section under services */}
            <div className="mt-8 pt-6 border-t border-gray-100/50">
              <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                 <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#1a8b4c]">
                   <Code size={20} />
                 </div>
                 <h3 className="text-[20px] font-black text-gray-950 uppercase tracking-tight">CRM Solutions</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
                {crmCol.map((service, i) => {
                  const Icon = service.icon;
                  return (
                    <Link 
                      key={i}
                      href={getDynamicLink(service.href)} 
                      title={`${service.name} - Global Webify`}
                      className="group flex items-center gap-2.5 hover:translate-x-1 transition-transform duration-200"
                    >
                      <div className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center ${service.color} transition-transform group-hover:scale-110`}>
                        <Icon size={14} />
                      </div>
                      <span className="text-[13px] text-gray-600 font-semibold group-hover:text-[#1a8b4c] transition-colors leading-tight">{service.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>


          {/* Contact Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3 mb-8 justify-center lg:justify-start">
               <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#1a8b4c]">
                 <Headphones size={20} />
               </div>
               <h3 className="text-[20px] font-black text-gray-950 uppercase tracking-tight">Get In Touch</h3>
            </div>
            
            <div className="space-y-3">
              {contactDetails.map((contact, i) => {
                const getHref = () => {
                  if (contact.type === "Email") return `mailto:${contact.value}`;
                  if (contact.type === "Main") return `tel:+917563901100`;
                  if (contact.type === "Toll Free") return `tel:18008905489`;
                  if (contact.type === "US Office") return `tel:+19175908135`;
                  return "#";
                };

                return (
                  <a 
                    key={i} 
                    href={getHref()} 
                    title={`${contact.type === 'Email' ? 'Email' : 'Call'} ${contact.value} - Global Webify`}
                    className="flex items-center gap-4 p-3 bg-white border border-gray-50 rounded-2xl shadow-sm hover:border-[#1a8b4c]/30 hover:shadow-md transition-all duration-300 group w-full"
                  >
                    <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${contact.color} transition-transform group-hover:scale-110`}>
                      {contact.icon}
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">{contact.type}</p>
                      <p className="text-[14px] font-bold text-gray-800 group-hover:text-[#1a8b4c] transition-colors">{contact.value}</p>
                    </div>
                  </a>
                );
              })}

              <a 
                href="https://maps.google.com/?q=2nd+Floor,+Alam+Complex,+Ashok+Nagar+Road,+Kadru,+Ranchi,+Jharkhand,+India-834002"
                target="_blank"
                rel="noopener noreferrer"
                title="View Ranchi Office on Google Maps - Global Webify"
                className="flex items-start gap-4 p-4 bg-white border border-gray-50 rounded-2xl shadow-sm hover:border-[#1a8b4c]/30 hover:shadow-md transition-all duration-300 group text-left w-full"
              >
                <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-green-50 text-green-500 mt-1 transition-transform group-hover:scale-110">
                  <MapPin size={18} />
                </div>
                <p className="text-[13px] font-bold text-gray-700 leading-relaxed group-hover:text-[#1a8b4c] transition-colors">
                  2nd Floor, Alam Complex, Ashok Nagar Road, Kadru, Ranchi, Jharkhand, India-834002
                </p>
              </a>

              <a 
                href="https://maps.google.com/?q=36/1E/1L,+Topsia+Road,+Panchannagram,+Kolkata,+Pin+-+700039,+West+Bengal,+India."
                target="_blank"
                rel="noopener noreferrer"
                title="View Kolkata Office on Google Maps - Global Webify"
                className="flex items-start gap-4 p-4 bg-white border border-gray-50 rounded-2xl shadow-sm hover:border-[#1a8b4c]/30 hover:shadow-md transition-all duration-300 group text-left w-full"
              >
                <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-green-50 text-green-500 mt-1 transition-transform group-hover:scale-110">
                  <MapPin size={18} />
                </div>
                <p className="text-[13px] font-bold text-gray-700 leading-relaxed group-hover:text-[#1a8b4c] transition-colors">
                  36/1E/1L, Topsia Road, Panchannagram, Kolkata, Pin - 700039, West Bengal, India.
                </p>
              </a>

              <Link 
                href="/market-area" 
                className="group flex items-center justify-between p-4 bg-white border border-gray-50 rounded-2xl shadow-sm hover:shadow-md hover:border-[#1a8b4c]/20 transition-all duration-300 w-full"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-green-50 text-[#1a8b4c] transition-transform group-hover:scale-110">
                    <MapPin size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Locations</p>
                    <p className="text-[14px] font-bold text-gray-800 group-hover:text-[#1a8b4c] transition-colors">Our Market Areas</p>
                  </div>
                </div>
                <ExternalLink size={16} className="text-gray-400 group-hover:text-[#1a8b4c] transition-colors mr-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 mb-8 lg:mb-12">
          {/* Projects Card */}
          <div className="lg:col-span-2 bg-[#f0fdf4] border border-green-100 rounded-2xl p-4 text-center flex flex-col items-center justify-center group hover:border-[#1a8b4c]/40 transition-all shadow-sm">
            <h3 className="text-[30px] font-extrabold text-[#1a8b4c] leading-none mb-1.5">500+</h3>
            <p className="text-[#15803d] text-[10px] font-bold uppercase tracking-[0.15em]">Projects Delivered</p>
          </div>

          {/* Satisfaction Card */}
          <div className="lg:col-span-2 bg-[#f0f9ff] border border-sky-100 rounded-2xl p-4 text-center flex flex-col items-center justify-center group hover:border-[#0284c7]/40 transition-all shadow-sm">
            <h3 className="text-[30px] font-extrabold text-[#0284c7] leading-none mb-1.5">98%</h3>
            <p className="text-[#0369a1] text-[10px] font-bold uppercase tracking-[0.15em]">Client Satisfaction</p>
          </div>

          {/* Social Card */}
          <div className="lg:col-span-3 bg-[#f5f3ff] border border-violet-100 rounded-2xl p-4 text-center flex flex-col items-center justify-center shadow-sm hover:border-[#7c3aed]/40 transition-all">
            <h4 className="text-[12px] font-bold text-[#6d28d9] uppercase tracking-wider mb-3">Follow Us</h4>
            <div className="flex gap-2">
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
                     className="w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-[#7c3aed] hover:text-white transition-all transform hover:-translate-y-0.5"
                   >
                     <span className="sr-only">Visit our {social.name} page</span>
                     <Icon size={14} aria-hidden="true" />
                   </a>
                 );
               })}
            </div>
          </div>

          {/* Payment Card */}
          <div className="lg:col-span-5 bg-[#fffbeb] border border-amber-100 rounded-2xl p-4 text-center flex flex-col items-center justify-center shadow-sm hover:border-[#d97706]/40 transition-all">
            <h4 className="text-[12px] font-bold text-[#b45309] uppercase tracking-wider mb-3">Secure Payment Methods</h4>
            <div className="flex flex-row flex-nowrap justify-center items-center gap-1.5 sm:gap-2 w-full">
               {/* Bank of Baroda */}
               <div className="w-[54px] h-[38px] sm:w-[76px] sm:h-[50px] relative bg-white border border-gray-100 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                 {shouldLoadImages && <Image src="/BankOfBaroda.avif" alt="Bank of Baroda" title="Bank of Baroda - Global Webify" fill unoptimized className="object-contain p-0.5" sizes="(max-width: 640px) 54px, 76px" />}
               </div>
               {/* Indian Overseas Bank */}
               <div className="w-[54px] h-[38px] sm:w-[76px] sm:h-[50px] relative bg-white border border-gray-100 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                 {shouldLoadImages && <Image src="/IndianOverseasBank.avif" alt="Indian Overseas Bank" title="Indian Overseas Bank - Global Webify" fill unoptimized className="object-contain p-0.5" sizes="(max-width: 640px) 54px, 76px" />}
               </div>
               {/* PayPal */}
               <div className="w-[54px] h-[38px] sm:w-[76px] sm:h-[50px] relative bg-white border border-gray-100 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                 {shouldLoadImages && <Image src="/PayPal.avif" alt="PayPal" title="PayPal - Global Webify" fill unoptimized className="object-contain p-0.5" sizes="(max-width: 640px) 54px, 76px" />}
               </div>
               {/* Razorpay */}
               <div className="w-[54px] h-[38px] sm:w-[76px] sm:h-[50px] relative bg-white border border-gray-100 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                 {shouldLoadImages && <Image src="/Razorpay.avif" alt="Razorpay" title="Razorpay - Global Webify" fill unoptimized className="object-contain p-0.5" sizes="(max-width: 640px) 54px, 76px" />}
               </div>
               {/* PhonePe */}
               <div className="w-[54px] h-[38px] sm:w-[76px] sm:h-[50px] relative bg-white border border-gray-100 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                 {shouldLoadImages && <Image src="/PhonePe.avif" alt="PhonePe" title="PhonePe - Global Webify" fill unoptimized className="object-contain p-0.5" sizes="(max-width: 640px) 54px, 76px" />}
               </div>
             </div>
          </div>
        </div>

        {/* Final Bottom Bar */}
        <div className="pt-12 border-t border-gray-100 flex flex-col items-center justify-center gap-4 text-center">
           <p className="text-[14px] font-bold text-gray-500">
             © {new Date().getFullYear()} Global Webify. All rights reserved.
           </p>
           <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 sm:gap-x-8 text-center">
             {["Privacy Policy", "Terms of Service", "Cookie Policy", "Refund Policy", "Delivery Policy", "Return Policy", "Booking", "Sitemap"].map((link) => {
               const slugMap: Record<string, string> = {
                 "Privacy Policy": "/privacy-policy",
                 "Terms of Service": "/terms-of-service",
                 "Cookie Policy": "/cookie-policy",
                 "Refund Policy": "/refund-policy",
                 "Delivery Policy": "/delivery-policy",
                 "Return Policy": "/return-policy",
                 "Booking": "/bookings",
                 "Sitemap": "/sitemap"
               };
               return (
                 <Link 
                   key={link} 
                   href={slugMap[link] || "#"} 
                   title={`${link} - Global Webify`}
                   className="text-[13px] font-bold text-gray-500 hover:text-[#1a8b4c] transition-colors"
                 >
                   {link}
                 </Link>
               );
             })}
           </div>
        </div>
      </div>
    </footer>
  );
}
