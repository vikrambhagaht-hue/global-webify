"use client";

import React, { useState, useEffect, useRef, startTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { m, AnimatePresence } from 'framer-motion';
import { Menu, X, Facebook, Twitter, Linkedin, Instagram, Youtube, Phone, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  NAV_LINKS, 
  WEBSITE_SERVICES, 
  CRM_SERVICES,
  SEO_SERVICES,
  HOSTING_SERVICES,
  MARKETING_SERVICES, 
  BRANDING_SERVICES, 
  COMPANY_LINKS 
} from '@/constants/navigation';
import { TopBar } from './TopBar';
import { MegaMenu } from './MegaMenu';
import { useContactInfo } from '@/lib/ContactContext';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { CITIES_MAP } from '@/features/services/constants/cities';
import ContactModal from '@/components/ui/ContactModal';

const socialIcons: any = {
  Facebook: Facebook,
  Twitter: Twitter,
  Linkedin: Linkedin,
  Instagram: Instagram,
  Youtube: Youtube
};

const citySlugs = Object.keys(CITIES_MAP);

const getPrefixedHref = (href: string, menuId: string, currentCity: string | null) => {
  if (!currentCity) return href;
  if (menuId === 'company' || menuId === 'partnership' || href === '/contact' || href.startsWith('http') || href === '#') {
    return href;
  }
  return `/${currentCity}${href.startsWith('/') ? href : `/${href}`}`;
};

interface HeaderProps {
  initialSettings?: {
    hostingMenuEnabled: boolean;
    brandingMenuEnabled: boolean;
    partnershipPageSlug: string;
  };
}

export default function Header({ initialSettings }: HeaderProps) {
  const contactInfo = useContactInfo();
  const pathname = usePathname();
  
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0]?.toLowerCase();
  const currentCity = firstSegment && citySlugs.includes(firstSegment) ? firstSegment : null;

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<string | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [menuForceHidden, setMenuForceHidden] = useState(false);
  const [hostingActive, setHostingActive] = useState(initialSettings?.hostingMenuEnabled ?? true);
  const [brandingActive, setBrandingActive] = useState(initialSettings?.brandingMenuEnabled ?? true);
  const [partnershipSlug, setPartnershipSlug] = useState(initialSettings?.partnershipPageSlug ?? 'partnership');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch hosting, branding, and partnership status dynamically
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (typeof data.hostingMenuEnabled === 'boolean') {
            setHostingActive(data.hostingMenuEnabled);
          }
          if (typeof data.brandingMenuEnabled === 'boolean') {
            setBrandingActive(data.brandingMenuEnabled);
          }
          if (data.partnershipPageSlug) {
            setPartnershipSlug(data.partnershipPageSlug);
          }
        }
      })
      .catch(err => console.error("Failed to fetch settings", err));
  }, []);

  const visibleNavLinks = NAV_LINKS.filter(
    link => (link.id !== 'hosting' || hostingActive) && (link.id !== 'branding' || brandingActive)
  );

  // Open a specific dropdown immediately
  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  // When hovering a non-dropdown item (e.g., Contact), instantly close any open menu
  const handleNavItemEnter = (link: any) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (link.hasDropdown) {
      setActiveMenu(link.id);
    } else {
      setActiveMenu(null); // immediately close, no delay
    }
  };

  // Only close when cursor leaves the entire nav/megamenu zone
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 250);
  };

  const handleSetIsOpen = (open: boolean) => {
    startTransition(() => {
      setIsOpen(open);
    });
  };

  const closeMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    startTransition(() => {
      setActiveMenu(null);
      setIsOpen(false);
    });
    setMenuForceHidden(true);
    
    // Automatically lift the force-close lock after 300ms so subsequent hovers work correctly
    setTimeout(() => {
      setMenuForceHidden(false);
    }, 300);
  };

  const toggleMobileMenu = (menu: string) => {
    startTransition(() => {
      setMobileMenuOpen(mobileMenuOpen === menu ? null : menu);
    });
  };

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(null);
    setIsOpen(false);
    setMenuForceHidden(false); // Reset to false on route change so hover menus work immediately on the new page
  }, [pathname]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getSubLinks = (id: string) => {
    switch (id) {
      case 'website': return WEBSITE_SERVICES;
      case 'crm': return CRM_SERVICES;
      case 'seo': return SEO_SERVICES;
      case 'hosting': return HOSTING_SERVICES;
      case 'marketing': return MARKETING_SERVICES;
      case 'branding': return BRANDING_SERVICES;
      case 'company': return COMPANY_LINKS;
      default: return [];
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] bg-white border-b border-gray-200 font-sans">
      {/* Preload the promo background image to ensure instant display on hover */}
      <div className="absolute -left-[9999px] -top-[9999px] w-1 h-1 opacity-0 pointer-events-none" aria-hidden="true">

      </div>

      {/* Top Bar Component */}
      <TopBar isOpen={isOpen} setIsOpen={handleSetIsOpen} onContactClick={() => setIsContactOpen(true)} />

      {/* Main Nav Bar */}
      <nav
        className={cn(
          "hidden lg:block transition-all duration-300 relative z-40 border-t border-gray-100 bg-white",
          scrolled ? "shadow-md" : ""
        )}
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-[1800px] mx-auto px-1 lg:px-2 xl:px-12 flex justify-center items-stretch py-0">
          {visibleNavLinks.map((link, i) => (
            <div
              key={i}
              className="flex items-center px-0.5 xl:px-2 py-3 h-full cursor-pointer shrink"
              onMouseEnter={() => handleNavItemEnter(link)}
            >
              {link.id === 'our_franchise' ? (
                <Link 
                  href="/our-franchisee"
                  title="Our Franchisees"
                  onClick={closeMenu}
                  className="relative group flex items-center justify-center overflow-hidden rounded-full font-sans transition-all duration-300 ml-1 shadow-md shadow-blue-500/20"
                >
                  {/* Base Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-700 via-purple-600 to-violet-700 transition-transform duration-500 group-hover:scale-110"></div>
                  
                  {/* Radar/Ripple Circles on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute w-12 h-12 rounded-full border border-white/30 scale-0 group-hover:animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                    <div className="absolute w-24 h-24 rounded-full border border-white/20 scale-0 group-hover:animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ animationDelay: '0.6s' }}></div>
                  </div>

                  <span className="relative z-10 px-3 lg:px-4 py-2 text-[10.5px] xl:text-[11.5px] font-black text-white whitespace-nowrap tracking-wider uppercase group-hover:scale-105 transition-transform duration-300">
                    {link.name}
                  </span>
                </Link>
              ) : link.id === 'partnership' ? (
                <Link
                  href={`/${partnershipSlug}`}
                  title={`${link.name} - Global Webify`}
                  onClick={closeMenu}
                  className="relative group flex items-center justify-center overflow-hidden rounded-full font-sans transition-all duration-300 ml-2 shadow-lg shadow-indigo-600/30"
                >
                  {/* Base Color (Darkest outer layer) */}
                  <div className="absolute inset-0 bg-[#312581]"></div>
                  
                  {/* Concentric Circles Pattern (Matching the image) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-700 group-hover:scale-110">
                    <div className="absolute w-44 h-44 rounded-full bg-[#3a2ea1]"></div>
                    <div className="absolute w-32 h-32 rounded-full bg-[#4638c4]"></div>
                    <div className="absolute w-20 h-20 rounded-full bg-[#5244e6]"></div>
                    <div className="absolute w-10 h-10 rounded-full bg-[#6255ff]"></div>
                  </div>
                  
                  {/* Radar/Ripple Circles on Hover (Kept for dynamic effect) */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute w-12 h-12 rounded-full border-2 border-white/40 scale-0 group-hover:animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                    <div className="absolute w-24 h-24 rounded-full border-2 border-white/20 scale-0 group-hover:animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ animationDelay: '0.6s' }}></div>
                  </div>

                  <span className="relative z-10 px-3 lg:px-4 py-2 text-[10.5px] xl:text-[11.5px] font-black text-white whitespace-nowrap tracking-wider uppercase group-hover:scale-105 transition-transform duration-300 drop-shadow-md">
                    {link.name}
                  </span>
                </Link>
              ) : (
                <Link
                  href={link.hasDropdown ? "#" : `/${link.id}`}
                  title={`${link.name} - Global Webify`}
                  onClick={(e) => {
                    if (link.hasDropdown) {
                      e.preventDefault();
                    } else {
                      closeMenu();
                    }
                  }}
                  className={cn(
                    "px-1.5 lg:px-2 xl:px-4 py-2 text-[10.5px] xl:text-[12.8px] font-semibold flex items-center gap-1 xl:gap-1.5 rounded-full font-sans transition-all duration-75 whitespace-nowrap",
                    activeMenu === link.id
                      ? "text-white bg-[#1a8b4c]"
                      : "text-[#0a0a0a] hover:text-white hover:bg-[#1a8b4c]"
                  )}
                >
                  {link.name}
                </Link>
              )}

              {link.hasDropdown && (
                <MegaMenu
                  activeMenu={activeMenu}
                  currentMenuId={link.id}
                  onClose={closeMenu}
                  currentCity={currentCity}
                />
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 bg-white z-[10000] flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
             {/* Spacer to push content below the header without showing background */}
             <div className="shrink-0 h-[64px] bg-white" />
             <div className="flex-1 px-5 py-2 pb-4 flex flex-col gap-0.5 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#1a8b4c]/50 pr-4">
                {visibleNavLinks.map((link) => (
                  <div key={link.id} className="border-b border-gray-50">
                    {link.hasDropdown ? (
                      <button 
                        onClick={() => toggleMobileMenu(link.id)} 
                        className="w-full text-left py-3 flex justify-between items-center group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#1a8b4c]" />
                          <span className={cn(
                            "text-[14px] font-semibold tracking-normal transition-colors",
                            mobileMenuOpen === link.id ? "text-[#1a8b4c]" : "text-[#1a1a1a]"
                          )}>
                            {link.name}
                          </span>
                        </div>
                        <div
                          className={cn(
                            "transition-transform duration-300",
                            mobileMenuOpen === link.id ? "rotate-180" : "rotate-0"
                          )}
                        >
                          <svg className={cn("w-4 h-4 transition-colors", mobileMenuOpen === link.id ? "text-[#1a8b4c]" : "text-gray-900")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                    ) : link.id === 'our_franchise' ? (
                      <Link 
                        href="/our-franchisee"
                        onClick={closeMenu}
                        className="w-full text-center my-3 py-3 px-4 flex justify-center items-center group transition-all rounded-2xl relative overflow-hidden shadow-lg shadow-purple-500/20"
                      >
                        {/* Base Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-700 via-purple-600 to-violet-700 transition-transform duration-500 group-active:scale-110"></div>
                        
                        {/* Radar/Ripple Circles on Hover/Active */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="absolute w-16 h-16 rounded-full border border-white/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                          <div className="absolute w-32 h-32 rounded-full border border-white/20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ animationDelay: '0.6s' }}></div>
                        </div>

                        <span className="relative z-10 text-[14px] font-black tracking-widest text-white uppercase group-active:scale-105 transition-transform duration-300">
                          {link.name}
                        </span>
                      </Link>
                    ) : link.id === 'partnership' ? (
                      <Link 
                        href={`/${partnershipSlug}`}
                        onClick={closeMenu}
                        className="w-full text-center my-3 py-3 px-4 flex justify-center items-center group transition-all rounded-2xl relative overflow-hidden shadow-lg shadow-indigo-600/30"
                      >
                        {/* Base Color (Darkest outer layer) */}
                        <div className="absolute inset-0 bg-[#312581]"></div>
                        
                        {/* Concentric Circles Pattern (Matching the image) */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-700 group-active:scale-110">
                          <div className="absolute w-56 h-56 rounded-full bg-[#3a2ea1]"></div>
                          <div className="absolute w-40 h-40 rounded-full bg-[#4638c4]"></div>
                          <div className="absolute w-24 h-24 rounded-full bg-[#5244e6]"></div>
                          <div className="absolute w-12 h-12 rounded-full bg-[#6255ff]"></div>
                        </div>
                        
                        {/* Radar/Ripple Circles on Hover/Active */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="absolute w-16 h-16 rounded-full border-2 border-white/40 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                          <div className="absolute w-32 h-32 rounded-full border-2 border-white/20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ animationDelay: '0.6s' }}></div>
                        </div>

                        <span className="relative z-10 text-[14px] font-black tracking-widest text-white uppercase group-active:scale-105 transition-transform duration-300 drop-shadow-md">
                          {link.name}
                        </span>
                      </Link>
                    ) : (
                      <Link 
                        href={getPrefixedHref('/' + link.id, link.id, currentCity)}
                        onClick={closeMenu}
                        className="w-full text-left py-3 flex justify-between items-center group transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#1a8b4c]" />
                          <span className="text-[14px] font-semibold tracking-normal hover:text-[#1a8b4c] transition-colors text-[#1a1a1a]">
                            {link.name}
                          </span>
                        </div>
                      </Link>
                    )}
                    
                    {/* Mobile Dropdown Content */}
                    <div
                      className={cn(
                        "overflow-hidden bg-gray-50/50 rounded-xl px-4 transition-all duration-300 ease-in-out",
                        link.hasDropdown && mobileMenuOpen === link.id ? "max-h-[1500px] opacity-100 mb-4" : "max-h-0 opacity-0 mb-0"
                      )}
                    >
                          {getSubLinks(link.id).map((item: any, idx: number) => (
                            <div key={idx} className="py-1.5 first:pt-3 last:pb-3 border-b border-gray-100/60 last:border-0">
                              <Link 
                                href={getPrefixedHref(item.href, link.id, currentCity)}
                                onClick={item.subLinks ? (e) => e.preventDefault() : closeMenu}
                                className="flex items-center justify-between text-[13.5px] font-bold text-gray-800 mb-0.5 px-3 py-2.5 rounded-xl hover:bg-[#1a8b4c]/5 hover:text-[#1a8b4c] transition-all active:scale-[0.98]"
                              >
                                {item.name}
                                {item.subLinks && (
                                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                  </svg>
                                )}
                              </Link>
                              
                              {item.subLinks && (
                                <div className="ml-5 border-l-2 border-[#1a8b4c]/15 pl-2 mt-0.5 mb-2 flex flex-col gap-0.5">
                                  {item.subLinks.map((sub: any, sIdx: number) => (
                                    <Link
                                      key={sIdx}
                                      href={getPrefixedHref(sub.href, link.id, currentCity)}
                                      onClick={closeMenu}
                                      className="px-3 py-2 text-[12.5px] font-semibold text-gray-500 hover:text-[#1a8b4c] hover:bg-[#1a8b4c]/5 rounded-xl flex items-center gap-2.5 group/nested transition-all active:scale-[0.98]"
                                    >
                                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/nested:w-2.5 group-hover/nested:bg-[#1a8b4c] transition-all duration-300" />
                                      {sub.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                    </div>
                  </div>
                ))}
             </div>

             {/* Contact Info for Mobile */}
             <div className="mt-auto p-4 bg-gray-50 flex flex-col gap-2 border-t border-gray-100">
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    { num: contactInfo?.phone2 || '1800-890-5489', href: `tel:${contactInfo?.phone2 || '18008905489'}` },
                    { num: contactInfo?.phone || '+91 75639 01100', href: getWhatsAppUrl(contactInfo?.whatsapp) },
                    { num: '+1 917 590 8135', href: 'tel:19175908135' }
                  ].map((item, i) => (
                    <a 
                      key={i}
                      href={item.href}
                      title={item.href.includes('wa.me') ? 'WhatsApp - Global Webify' : `Call ${item.num} - Global Webify`}
                      target={item.href.includes('wa.me') ? "_blank" : undefined}
                      rel={item.href.includes('wa.me') ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white border-2 border-gray-100 shadow-sm transition-all active:scale-[0.98] active:bg-gray-50"
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-50 border border-green-100">
                        <Phone size={14} className="text-[#1a8b4c]" />
                      </div>
                      <span className="text-[16px] font-black tracking-tight text-gray-950">{item.num}</span>
                    </a>
                  ))}
                </div>
           </div>
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </header>
  );
}
