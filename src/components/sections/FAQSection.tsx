'use client';

import React, { useState, startTransition } from 'react';
import { Plus, Minus } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSection({ faqs, sectionTitle, sectionDesc }: { faqs: FAQItem[]; sectionTitle?: string; sectionDesc?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  const toggle = (index: number) => {
    startTransition(() => {
      setOpenIndex(openIndex === index ? null : index);
    });
  };

  const isGrid = faqs.length > 4;

  return (
    <section className="py-10 md:py-14 bg-white font-lexend">
      <div className="w-full max-w-[95%] lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          {sectionTitle ? (
            <h2 
              className="text-[24px] md:text-[32px] lg:text-[36px] font-bold text-gray-950 leading-tight tracking-tight font-heading"
              dangerouslySetInnerHTML={{ __html: sectionTitle }}
            />
          ) : (
            <h2 className="text-[24px] md:text-[32px] lg:text-[36px] font-bold text-gray-950 leading-tight tracking-tight font-heading">
              Frequently Asked <span className="text-[#1a8b4c]">Questions</span>
            </h2>
          )}
          {sectionDesc ? (
            <p 
              className="mt-4 text-[14px] md:text-[16px] text-gray-500 max-w-[800px] mx-auto font-medium leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sectionDesc }}
            />
          ) : (
            <p className="mt-4 text-[14px] md:text-[16px] text-gray-500 max-w-[800px] mx-auto font-medium leading-relaxed">
              Everything you need to know about our process and booking.
            </p>
          )}
        </div>

        <div className="w-full space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#1a8b4c]/40 transition-all duration-200"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between py-3 px-5 md:py-4 md:px-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a8b4c]/50 group bg-[#f6faf8] transition-colors hover:bg-[#e2f2e8]"
                >
                  <span className="font-semibold text-gray-700 text-sm md:text-base pr-4 leading-snug transition-colors group-hover:text-[#0b5e28]">
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 bg-[#0b5e28] text-white border border-[#0b5e28] group-hover:bg-[#094d20] group-hover:border-[#094d20] shadow-sm">
                    {isOpen ? <Minus size={14} strokeWidth={2.5} /> : <Plus size={14} strokeWidth={2.5} />}
                  </div>
                </button>
                
                {isOpen && (
                  <div className="px-5 md:px-6 pb-6 text-gray-600 text-sm md:text-[14.5px] leading-relaxed border-t border-gray-200 pt-4 font-normal bg-white">
                    <div dangerouslySetInnerHTML={{ __html: faq.answer.replace(/\n/g, '<br />') }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
