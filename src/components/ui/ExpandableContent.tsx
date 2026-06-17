"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export function ExpandableContent({ 
  htmlContent,
  maxHeight = 162, // Exactly 6 lines of standard body text
}: { 
  htmlContent?: string;
  maxHeight?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsButton, setNeedsButton] = useState(false);
  const [actualHeight, setActualHeight] = useState(10000);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const h = contentRef.current.scrollHeight;
      setActualHeight(h);
      setNeedsButton(h > maxHeight + 15);
    }
  }, [htmlContent, maxHeight]);

  if (!htmlContent || htmlContent.trim() === "" || htmlContent === "<p></p>" || htmlContent === "<p><br></p>") {
    return null;
  }

  const cleanHtml = htmlContent
    .replace(/<p[^>]*>(?:\s|&nbsp;|<br>|<br\s*\/>)*<\/p>/gi, '')
    .replace(/<div[^>]*>(?:\s|&nbsp;|<br>|<br\s*\/>)*<\/div>/gi, '')
    .replace(/<\/ul>\s*<ul[^>]*>/gi, '')
    .replace(/<\/ol>\s*<ol[^>]*>/gi, '');

  const handleToggle = () => {
    if (isExpanded) {
      if (containerRef.current) {
        const yOffset = -100;
        const y = containerRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
        
        // Smooth scroll to the top of the section first
        window.scrollTo({ top: y, behavior: 'smooth' });

        // Let the scroll finish or get close to finishing before collapsing the content.
        // This prevents the page height from suddenly shrinking while the scroll viewport is below the new page bottom,
        // which causes the browser to snap to the footer.
        setTimeout(() => {
          setIsExpanded(false);
        }, 350);
      } else {
        setIsExpanded(false);
      }
    } else {
      setIsExpanded(true);
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : maxHeight }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="relative overflow-hidden w-full"
      >
        {/* Inner container with no restriction, used for measurement */}
        <div
          ref={contentRef}
          className="expandable-content-wrapper font-jost text-[15px] md:text-[16px] text-gray-600 leading-[1.6] text-left"
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />

          {/* Guaranteed CSS Injection */}
          <style dangerouslySetInnerHTML={{__html: `
            .expandable-content-wrapper * {
              font-family: var(--font-jost), sans-serif !important;
            }
            .expandable-content-wrapper p {
              margin-bottom: 12px !important;
              color: #757575 !important;
              line-height: 1.6 !important;
              font-size: 15px !important;
              text-align: left !important;
              font-weight: 400 !important;
            }
            @media (min-width: 768px) {
              .expandable-content-wrapper p { font-size: 16px !important; }
            }
            .expandable-content-wrapper span {
              color: #757575 !important;
              line-height: 1.6 !important;
            }
            .expandable-content-wrapper strong,
            .expandable-content-wrapper b {
              font-weight: 700 !important;
              color: #212121 !important;
            }
            .expandable-content-wrapper h1 {
              font-size: 24px !important;
              font-weight: 900 !important;
              color: #212121 !important;
              margin-bottom: 16px !important;
              margin-top: 32px !important;
              line-height: 1.25 !important;
            }
            .expandable-content-wrapper h1 * { color: #212121 !important; }
            @media (min-width: 768px) { .expandable-content-wrapper h1 { font-size: 30px !important; } }
            
            .expandable-content-wrapper h2 {
              font-size: 20px !important;
              font-weight: 700 !important;
              color: #1a8b4c !important;
              margin-bottom: 12px !important;
              margin-top: 24px !important;
              line-height: 1.375 !important;
            }
            .expandable-content-wrapper h2 * { color: #1a8b4c !important; }
            @media (min-width: 768px) { .expandable-content-wrapper h2 { font-size: 24px !important; } }

            .expandable-content-wrapper h3 {
              font-size: 16px !important;
              font-weight: 600 !important;
              color: #1a8b4c !important;
              margin-bottom: 10px !important;
              margin-top: 24px !important;
              text-transform: uppercase !important;
              letter-spacing: 0.05em !important;
              border-left: 4px solid #1a8b4c !important;
              padding-left: 12px !important;
            }
            .expandable-content-wrapper h3 * { color: #1a8b4c !important; }
            @media (min-width: 768px) { .expandable-content-wrapper h3 { font-size: 17px !important; } }

            .expandable-content-wrapper h4 {
              font-size: 15px !important;
              font-weight: 700 !important;
              color: #212121 !important;
              margin-bottom: 8px !important;
              margin-top: 16px !important;
            }
            .expandable-content-wrapper h4 * { color: #212121 !important; }
            @media (min-width: 768px) { .expandable-content-wrapper h4 { font-size: 16px !important; } }

            .expandable-content-wrapper ul,
            .expandable-content-wrapper ol {
              margin-top: 1rem !important;
              margin-bottom: 1rem !important;
              padding-left: 1.5rem !important;
              list-style-position: outside !important;
            }
            .expandable-content-wrapper ul {
              list-style-type: disc !important;
            }
            .expandable-content-wrapper ol {
              list-style-type: decimal !important;
            }
            .expandable-content-wrapper ul li::marker,
            .expandable-content-wrapper ol li::marker {
              color: #1a8b4c !important;
              font-weight: 700 !important;
            }
 
            .expandable-content-wrapper li {
              margin-bottom: 0.375rem !important;
              padding-left: 0 !important;
              color: #000000 !important;
              font-weight: 600 !important;
              line-height: 1.7 !important;
            }
            .expandable-content-wrapper li p {
              margin: 0 !important;
              padding: 0 !important;
              display: inline !important;
            }
            
            /* Beautiful Table Formatting for ChatGPT/Word Pastes */
            .expandable-content-wrapper table {
              width: 100% !important;
              border-collapse: collapse !important;
              margin-top: 2rem !important;
              margin-bottom: 2rem !important;
              border-radius: 8px !important;
              overflow: hidden !important;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
              border: 1px solid #e5e7eb !important;
            }
            .expandable-content-wrapper th, 
            .expandable-content-wrapper td {
              border: 1px solid #e5e7eb !important;
              padding: 14px 18px !important;
              text-align: left !important;
            }
            .expandable-content-wrapper th {
              background-color: #f9fafb !important;
              font-weight: 800 !important;
              color: #111827 !important;
              text-transform: uppercase !important;
              font-size: 0.85rem !important;
              letter-spacing: 0.05em !important;
              border-bottom: 2px solid #e5e7eb !important;
            }
            .expandable-content-wrapper td {
              color: #545454 !important;
              font-size: 0.95rem !important;
              line-height: 1.5 !important;
            }
            .expandable-content-wrapper tr:nth-child(even) td {
              background-color: #fafafa !important;
            }
            .expandable-content-wrapper tr:hover td {
              background-color: #f3f4f6 !important;
            }
            
            /* Responsive wrapper for tables so they scroll on mobile instead of breaking layout */
            .expandable-content-wrapper .table-responsive {
              overflow-x: auto !important;
              -webkit-overflow-scrolling: touch !important;
              margin-bottom: 2rem !important;
            }

            .expandable-content-wrapper a {
              color: #1a8b4c !important;
              font-weight: 700 !important;
              text-decoration: none !important;
            }
            .expandable-content-wrapper a * { color: #1a8b4c !important; }
            .expandable-content-wrapper a:hover {
              color: #15703d !important;
              text-decoration: underline !important;
            }
            .expandable-content-wrapper a:hover * { color: #15703d !important; }

            .expandable-content-wrapper blockquote {
              border-left: 4px solid #e5e7eb !important;
              padding-left: 16px !important;
              font-style: italic !important;
              color: #6b7280 !important;
              margin-top: 16px !important;
              margin-bottom: 16px !important;
            }
          `}} />

        {/* Fade overlay when collapsed */}
        {needsButton && !isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none z-10" />
        )}
      </motion.div>

      {/* Read More / Read Less button */}
      {needsButton && (
        <div className="flex justify-center mt-4">
          <button
            ref={buttonRef}
            onClick={handleToggle}
            className="inline-flex items-center gap-1.5 bg-[#2563eb] hover:bg-blue-700 active:scale-95 text-white font-semibold py-2 px-6 rounded-full transition-all shadow-sm text-xs md:text-sm z-20"
          >
            {isExpanded ? (
              <>See Less <span className="text-xs">↑</span></>
            ) : (
              <>See More <span className="text-xs">↓</span></>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
