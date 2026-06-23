import React from 'react';
import { Metadata } from 'next';
import { FileText, Shield } from 'lucide-react';
import { db } from '@/lib/db';

export const revalidate = 60; // Cache page for 60 seconds

export const metadata: Metadata = {
  title: 'Refund Policy | GlobalWeblify',
  description: 'Understand the terms, guidelines, and conditions for service refunds at GlobalWeblify.',
  keywords: ['Refund Policy', 'Cancellation Policy', 'GlobalWeblify Refunds', 'Service Cancellation'],
  alternates: {
    canonical: '/refund-policy'
  }
};

async function getPolicyData() {
  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: 'policy_refund' },
    });
    if (setting) {
      return JSON.parse(setting.value);
    }
  } catch (error) {
    console.error('Failed to get policy_refund:', error);
  }
  return {
    title: 'Refund Policy',
    content: '<p>Our refund policies and billing terms will appear here soon.</p>',
    updatedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  };
}

export default async function RefundPolicyPage() {
  const data = await getPolicyData();

  return (
    <main className="min-h-screen bg-[#fafdfc] font-jost text-left">
      {/* Hero Section */}
      <section className="relative pt-[100px] pb-10 overflow-hidden bg-gradient-to-b from-[#eaf6f0] to-[#fafdfc]">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[-10%] w-[40%] h-[80%] bg-gradient-to-r from-[#1a8b4c]/5 to-transparent rounded-full blur-3xl transform rotate-12"></div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-green-100 text-[#1a8b4c] text-xs font-black uppercase tracking-widest shadow-sm mb-6">
            <Shield size={14} />
            Billing Guidelines
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-black text-gray-950 tracking-tight leading-tight mb-6 font-lexend">
            {data.title || 'Refund Policy'}
          </h1>
          <p className="text-sm md:text-base text-gray-500 font-bold uppercase tracking-wider">
            Last Updated: {data.updatedAt}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-10 md:py-16">
        <div className="max-w-[900px] mx-auto px-6 md:px-12">
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                <FileText className="text-[#1a8b4c]" size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-950 font-lexend">Policy Details</h2>
            </div>

            <div 
              className="text-gray-600 text-[15px] md:text-[16px] leading-relaxed space-y-6 text-left about-seo-content"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />

            <style dangerouslySetInnerHTML={{__html: `
              .about-seo-content h1, .about-seo-content h1 * {
                font-size: 1.75rem !important;
                font-weight: 800 !important;
                color: #111827 !important;
                margin-top: 1.5rem !important;
                margin-bottom: 0.75rem !important;
              }
              .about-seo-content h2, .about-seo-content h2 * {
                font-size: 1.5rem !important;
                font-weight: 800 !important;
                color: #1a8b4c !important;
                margin-top: 1.25rem !important;
                margin-bottom: 0.75rem !important;
              }
              .about-seo-content h3, .about-seo-content h3 * {
                font-size: 1.25rem !important;
                font-weight: 700 !important;
                color: #030712 !important;
                margin-top: 1rem !important;
                margin-bottom: 0.5rem !important;
              }
              .about-seo-content p {
                margin-bottom: 1rem !important;
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
              .about-seo-content li {
                margin-bottom: 0.5rem !important;
              }
              .about-seo-content strong {
                font-weight: 700 !important;
                color: #111827 !important;
              }
            `}} />
          </div>
        </div>
      </section>
    </main>
  );
}
