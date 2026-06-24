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
  if (menuId === 'company' || href === '/contact' || href.startsWith('http') || href === '#') {
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
              <Link
                href={
                  link.hasDropdown 
                    ? "#" 
                    : link.id === 'partnership' 
                      ? `/${partnershipSlug}` 
                      : `/${link.id}`
                }
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
                  link.id === 'partnership'
                    ? "text-white border-2 border-[#1a8b4c]/50 font-bold shadow-sm animate-premium-dark-glow hover:animate-none hover:bg-[#1a8b4c] hover:border-transparent"
                    : activeMenu === link.id
                      ? "text-white bg-[#1a8b4c]"
                      : "text-[#0a0a0a] hover:text-white hover:bg-[#1a8b4c]"
                )}
              >
                {link.name}
              </Link>

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
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="lg:hidden fixed inset-0 bg-white z-[10000] flex flex-col pt-[100px]"
          >
             <div className="p-6 flex flex-col gap-1 overflow-y-auto">
                {visibleNavLinks.map((link) => (
                  <div key={link.id} className="border-b border-gray-50">
                    {link.hasDropdown ? (
                      <button 
                        onClick={() => toggleMobileMenu(link.id)} 
                        className="w-full text-left py-4 flex justify-between items-center group"
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
                        <m.div
                          animate={{ rotate: mobileMenuOpen === link.id ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <svg className={cn("w-4 h-4 transition-colors", mobileMenuOpen === link.id ? "text-[#1a8b4c]" : "text-gray-900")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </m.div>
                      </button>
                    ) : (
                      <Link 
                        href={getPrefixedHref('/' + (link.id === 'partnership' ? partnershipSlug : link.id), link.id, currentCity)}
                        onClick={closeMenu}
                        className={cn(
                          "w-full text-left py-4 flex justify-between items-center group transition-all",
                          link.id === 'partnership' ? "my-2 px-4 py-3 rounded-2xl border border-[#1a8b4c]/40 animate-premium-dark-glow" : ""
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn("w-1.5 h-1.5 rounded-full", link.id === 'partnership' ? "bg-white" : "bg-[#1a8b4c]")} />
                          <span className={cn(
                            "text-[14px] font-semibold tracking-normal hover:text-[#1a8b4c] transition-colors",
                            link.id === 'partnership' ? "text-white font-black hover:text-white" : "text-[#1a1a1a]"
                          )}>
                            {link.name}
                          </span>
                        </div>
                      </Link>
                    )}
                    
                    {/* Mobile Dropdown Content */}
                    <AnimatePresence>
                      {link.hasDropdown && mobileMenuOpen === link.id && (
                        <m.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-gray-50/50 rounded-xl mb-4 px-4"
                        >
                          {getSubLinks(link.id).map((item: any, idx: number) => (
                            <div key={idx} className="py-2 first:pt-4 last:pb-4 border-b border-gray-100 last:border-0">
                              <Link 
                                href={getPrefixedHref(item.href, link.id, currentCity)}
                                onClick={item.subLinks ? (e) => e.preventDefault() : closeMenu}
                                className="block text-[13px] font-medium text-gray-700 mb-1.5 px-2 hover:text-[#1a8b4c] transition-colors"
                              >
                                {item.name}
                              </Link>
                              
                              {item.subLinks && (
                                <div className="ml-4 border-l-2 border-[#1a8b4c]/20 pl-2 mt-1 mb-2 flex flex-col gap-1">
                                  {item.subLinks.map((sub: any, sIdx: number) => (
                                    <Link
                                      key={sIdx}
                                      href={getPrefixedHref(sub.href, link.id, currentCity)}
                                      onClick={closeMenu}
                                      className="px-2 py-1 text-[12px] font-normal text-gray-500 hover:text-[#16a34a] rounded-md flex items-center gap-2 group/nested transition-colors"
                                    >
                                      <div className="w-1 h-1 rounded-full bg-gray-400 group-hover/nested:bg-[#1a8b4c]" />
                                      {sub.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </m.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
             </div>

             {/* Contact Info for Mobile */}
             <div className="mt-auto p-6 bg-gray-50 flex flex-col gap-2">
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { num: '1800-890-5489', href: 'tel:18008905489' },
                    { num: '+91 75639 01100', href: 'https://wa.me/917563901100' },
                    { num: '+1 917 590 8135', href: 'tel:19175908135' }
                  ].map((item, i) => (
                    <a 
                      key={i}
                      href={item.href}
                      title={item.href.includes('wa.me') ? 'WhatsApp - Global Webify' : `Call ${item.num} - Global Webify`}
                      target={item.href.includes('wa.me') ? "_blank" : undefined}
                      rel={item.href.includes('wa.me') ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-3 p-4 rounded-xl bg-white border-2 border-gray-100 shadow-sm transition-all active:scale-[0.98] active:bg-gray-50"
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-50 border border-green-100">
                        <Phone size={14} className="text-[#1a8b4c]" />
                      </div>
                      <span className="text-[16px] font-black tracking-tight text-gray-950">{item.num}</span>
                    </a>
                  ))}
                </div>
             </div>
          </m.div>
        )}
      </AnimatePresence>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </header>
  );
}
