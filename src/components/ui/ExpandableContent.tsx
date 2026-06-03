"use client";

import React, { useState, useRef, useEffect } from 'react';

export function ExpandableContent({ 
  htmlContent,
  maxHeight = 162, // Exactly 6 lines of standard body text
}: { 
  htmlContent?: string;
  maxHeight?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsButton, setNeedsButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // Natural height of content without layout constraint
      const naturalHeight = contentRef.current.scrollHeight;
      setNeedsButton(naturalHeight > maxHeight + 15);
    }
  }, [htmlContent, maxHeight]);

  if (!htmlContent || htmlContent.trim() === "" || htmlContent === "<p></p>" || htmlContent === "<p><br></p>") {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Outer wrapper applying height restriction */}
      <div
        className="relative overflow-hidden transition-[max-height] duration-500 ease-in-out"
        style={{ maxHeight: isExpanded ? '10000px' : `${maxHeight}px` }}
      >
        {/* Inner container with no restriction, used for measurement */}
        <div
          ref={contentRef}
          className="
            !font-jost !text-[15px] md:!text-[16px] text-gray-600 !leading-[1.6] text-left
            [&_*]:!font-jost
            [&_p]:!mb-3 [&_p]:!leading-[1.6] [&_p]:!text-[15px] md:[&_p]:!text-[16px] [&_p]:!text-left
            [&_span]:text-gray-600 [&_span]:!text-[15px] md:[&_span]:!text-[16px] [&_span]:!leading-[1.6]
            [&_strong]:!font-bold [&_strong]:text-gray-900
            [&_b]:!font-bold [&_b]:text-gray-900
            [&_li]:text-gray-600 [&_li]:mb-1.5 [&_li]:leading-[1.7] [&_li]:list-item
            [&_h1]:text-2xl md:text-3xl [&_h1]:font-black [&_h1]:text-gray-900 [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:leading-tight
            [&_h2]:text-xl md:text-2xl [&_h2]:font-extrabold [&_h2]:text-gray-900 [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:leading-snug
            [&_h3]:text-lg md:text-xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mb-2 [&_h3]:mt-5
            [&_h4]:text-base md:text-lg [&_h4]:font-bold [&_h4]:text-gray-900 [&_h4]:mb-2 [&_h4]:mt-4
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1 [&_ul]:text-left
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1 [&_ol]:text-left
            [&_a]:!text-[#2CA65A] [&_a]:!font-bold [&_a]:!no-underline hover:[&_a]:!text-[#166534] hover:[&_a]:!underline
            [&_blockquote]:border-l-4 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_blockquote]:my-4
          "
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Fade overlay when collapsed */}
        {needsButton && !isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none z-10" />
        )}
      </div>

      {/* Read More / Read Less button */}
      {needsButton && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 bg-[#2563eb] hover:bg-blue-700 active:scale-95 text-white font-semibold py-2 px-6 rounded-full transition-all shadow-sm text-xs md:text-sm z-20"
          >
            {isExpanded ? (
              <>Read Less <span className="text-xs">↑</span></>
            ) : (
              <>Read More <span className="text-xs">↓</span></>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
