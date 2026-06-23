"use client";

import React, { useState, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Section } from '../layout/Responsive/Section';

interface AboutSEOProps {
  data?: {
    title: string;
    subtitle: string;
    paragraphs?: string[];
    content?: string;
  } | null;
}

export default function AboutSEO({ data }: AboutSEOProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const handleToggle = () => {
    if (isExpanded && sectionRef.current) {
      const yOffset = -100; // Offset for sticky header
      const y = sectionRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setIsExpanded(!isExpanded);
  };

  const defaultTitle = "Web Design & Web Development <span class=\"text-[#1a8b4c]\">Services in India</span>";
  const defaultSubtitle = "Professional Web Design Solutions for Global Brands";
  const defaultParagraphs = [
    "Need to lift your online presence? Yes. We at <strong>Global Webify</strong> are your trusted partner to boost your digital growth within the shortest time possible. As a prominent Web Design and Web Development Company in India, we are here to empower businesses worldwide with pioneering, user-focused, and SEO-optimized web solutions. Our team brings global excellence with local proficiency, serving clients across India, UAE, Canada, Australia, USA, and UK.",
    "Based in India, we're not simply a top Web Design Company, but also a preferred Web Development partner for startups and enterprises alike. Our team is dedicated to delivering visually stunning, high-performance websites focused on driving more engagement and conversions. Our expert web developers, web designers, and digital strategists work together to give you the best tailor-made websites that meet the goals of every brand.",
    "Starting from E-commerce to Real Estate, Travel & Tourism to Healthcare, Manufacturing to Fashion, we serve a broad spectrum of industries with accuracy and creativity. Whether you're a startup searching for a digital kickstart or an enterprise focusing on digital transformation, as the best Digital Marketing Agency in India, we have the right solution for you.",
    "But that's not all - <strong>Global Webify</strong> has even driven success as a leading SEO Company and a full-service Digital Marketing Agency. Our data-backed policies in SEO, social media marketing, PPC, email marketing, and content marketing confirm that your brand not only gets noticed but succeeds in the digital space.",
    "At Global Webify, we don't simply develop or design websites - we build highly presentable brands online. We focus on creating digital experiences that resonate with your audience and turn visitors into loyal customers.",
    "So, are you ready to unlock your digital potential? Partner with one of the most reliable and trusted web design and development companies in India - Global Webify. Contact our team today and set your goals to meet new digital heights!"
  ];

  const title = data?.title || defaultTitle;
  const subtitle = data?.subtitle || defaultSubtitle;
  
  // Format HTML content with fallback to legacy paragraphs array
  const rawHtmlContent = data?.content || 
    (data?.paragraphs && data.paragraphs.length > 0 
      ? data.paragraphs.map(p => `<p>${p}</p>`).join('') 
      : defaultParagraphs.map(p => `<p>${p}</p>`).join(''));

  // Clean trailing blank paragraphs, empty lines, &nbsp; and breaks
  const htmlContent = rawHtmlContent.trim()
    .replace(/(?:<p>\s*(?:<br\s*\/?>|&nbsp;)?\s*<\/p>|<br\s*\/?>|\s)+$/, '')
    .trim();

  return (
    <Section id="about-seo" variant="white" className="bg-[#fcfdfc] border-t border-gray-100">
      <article ref={sectionRef} className="max-w-[1000px] mx-auto px-4 text-center">
        
        <h2 
          className="text-[28px] md:text-[36px] font-black text-gray-950 mb-4 leading-tight"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p className="text-[18px] md:text-[22px] font-bold text-gray-600 mb-8">
          {subtitle}
        </p>

        <div className="relative">
          <div 
            className={`text-gray-600 text-[15px] md:text-[16px] leading-relaxed space-y-6 text-left transition-all duration-500 overflow-hidden about-seo-content ${isExpanded ? 'max-h-[3000px]' : 'max-h-[180px]'}`}
            role="region"
            aria-expanded={isExpanded}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          <style dangerouslySetInnerHTML={{__html: `
            .about-seo-content h1, .about-seo-content h1 * {
              font-size: 1.75rem !important;
              font-weight: 800 !important;
              color: #111827 !important;
            }
            .about-seo-content h1 {
              margin-top: 1.5rem !important;
              margin-bottom: 0.75rem !important;
              line-height: 1.25 !important;
            }
            .about-seo-content h2, .about-seo-content h2 * {
              font-size: 1.5rem !important;
              font-weight: 800 !important;
              color: #1a8b4c !important;
            }
            .about-seo-content h2 {
              margin-top: 1.25rem !important;
              margin-bottom: 0.75rem !important;
              line-height: 1.35 !important;
              text-decoration: underline !important;
              text-underline-offset: 4px;
              text-decoration-color: rgba(26, 139, 76, 0.6) !important;
            }
            .about-seo-content h3, .about-seo-content h3 * {
              font-size: 1.25rem !important;
              font-weight: 700 !important;
              color: #030712 !important;
            }
            .about-seo-content h3 {
              margin-top: 1rem !important;
              margin-bottom: 0.5rem !important;
              line-height: 1.4 !important;
            }
            .about-seo-content blockquote {
              border-left: 4px solid #1a8b4c !important;
              padding-left: 1rem !important;
              margin: 1.5rem 0 !important;
              color: #4b5563 !important;
              font-style: italic !important;
              background-color: #f3f4f6 !important;
              padding-top: 0.5rem !important;
              padding-bottom: 0.5rem !important;
              border-radius: 0 4px 4px 0 !important;
            }
            .about-seo-content ul {
              list-style-type: disc !important;
              padding-left: 1.5rem !important;
              margin-bottom: 1rem !important;
            }
            .about-seo-content ol {
              list-style-type: decimal !important;
              padding-left: 1.5rem !important;
              margin-bottom: 1rem !important;
            }
            .about-seo-content li, .about-seo-content li * {
              font-weight: 500 !important;
              color: #374151 !important;
            }
            .about-seo-content a, .about-seo-content a * {
              color: #1a8b4c !important;
              text-decoration: none !important;
              font-weight: 750 !important;
            }
            .about-seo-content a:hover, .about-seo-content a:hover * {
              color: #15703d !important;
              text-decoration: underline !important;
            }
            .about-seo-content strong, .about-seo-content b, .about-seo-content strong *, .about-seo-content b * {
              font-weight: 800 !important;
              color: #111827 !important;
            }
          `}} />

          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#fcfdfc] to-transparent pointer-events-none" />
          )}
        </div>

        <button 
        onClick={handleToggle}
        className="mt-8 inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-[#15703d] text-[#15703d] font-black text-[15px] hover:bg-[#15703d] hover:text-white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#15703d] focus:ring-offset-2"
        aria-label={isExpanded ? "Show less content" : "Show more content about Global Webify services"}
        >
          {isExpanded ? (
            <>Read Less <ChevronUp size={20} /></>
          ) : (
            <>Read More <ChevronDown size={20} /></>
          )}
        </button>
      </article>
    </Section>
  );
}

