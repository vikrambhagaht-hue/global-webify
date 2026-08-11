import React from 'react';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Briefcase, MapPin, Clock, ArrowRight, ShieldCheck, Heart, GraduationCap, Award, Compass, Zap, Flame, UserCheck } from 'lucide-react';
import CareersFormClient from './CareersFormClient';
import JobCardGrid from './JobCardGrid';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Careers | Web Development & Digital Marketing Jobs at Global Webify',
  description: 'Explore exciting career opportunities at Global Webify and become part of a dynamic digital team. Join us to grow your skills in web development, SEO, digital marketing, and innovative technology solutions. Apply now!',
  keywords: ['Web Development Jobs in Ranchi', 'Digital Marketing Jobs in Ranchi', 'Join Global Webify Team', 'Careers at Global Webify'],
  alternates: {
    canonical: '/career'
  }
};

export default async function CareersPage() {
  let jobs: any[] = [];
  try {
    const today = new Date();
    jobs = await db.job.findMany({
      where: {
        isActive: true,
        OR: [
          { lastDate: null },
          { lastDate: { gte: today } }
        ]
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to load active jobs:', error);
  }

  const cultureItems = [
    { title: 'Innovation', desc: 'We encourage creative thinking and embrace new ideas that push boundaries.', icon: Zap, bg: 'from-amber-500/10 to-orange-500/10 text-amber-600' },
    { title: 'Collaboration', desc: 'Teamwork is at the heart of everything we do. We believe in collective intelligence.', icon: UserCheck, bg: 'from-emerald-500/10 to-teal-500/10 text-emerald-600' },
    { title: 'Learning', desc: 'Continuous learning and skill development are encouraged and supported.', icon: GraduationCap, bg: 'from-blue-500/10 to-indigo-500/10 text-blue-600' },
    { title: 'Passion', desc: "We're passionate about digital excellence and delivering exceptional results.", icon: Flame, descShort: 'Passion', bg: 'from-red-500/10 to-rose-500/10 text-red-600' },
    { title: 'Integrity', desc: 'We operate with honesty, transparency, and ethical practices in all our dealings.', icon: ShieldCheck, bg: 'from-purple-500/10 to-violet-500/10 text-purple-600' },
    { title: 'Excellence', desc: 'We strive for excellence in everything we do, from concept to delivery.', icon: Award, bg: 'from-pink-500/10 to-fuchsia-500/10 text-pink-600' },
  ];

  const benefitItems = [
    { title: 'Career Growth', desc: 'Clear career progression paths and opportunities for advancement.', icon: Compass },
    { title: 'Challenging Projects', desc: 'Work on exciting projects that challenge your skills and creativity.', icon: Briefcase },
    { title: 'Competitive Pay', desc: 'We offer competitive salaries and performance-based incentives.', icon: Award },
    { title: 'Flexible Hours', desc: 'Enjoy a healthy work-life balance with flexible working hours.', icon: Clock },
    { title: 'Recognition', desc: 'Your contributions are valued and recognized regularly.', icon: Heart },
    { title: 'Supportive Team', desc: 'Be part of a supportive, collaborative, and fun team environment.', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-[#f8fbfa] font-sans selection:bg-[#1a8b4c] selection:text-white pb-20">
      {/* ========== HERO SECTION — BRAND GREEN THEME ========== */}
      <section className="relative bg-[#1a8b4c] text-white pt-24 md:pt-32 pb-0 overflow-hidden mb-12">
        {/* Subtle Background Circles matching brand */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/[0.05] rounded-full pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/[0.03] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10 flex flex-col items-center">
          {/* Clean Hero Title */}
          <h1 className="text-3xl md:text-[44px] font-black text-white uppercase tracking-tight mb-4 mt-2">
            JOIN OUR EXPERT TEAM
          </h1>
          
          <div className="w-12 md:w-16 h-1 bg-green-300 rounded-full mb-5 md:mb-6"></div>

          <p className="text-sm md:text-[15.5px] text-white/95 max-w-2xl font-medium tracking-wide mb-8">
            We help businesses grow online with custom web development, SEO, and digital marketing solutions. Be a part of a lively environment where creativity and innovation flourish.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 md:mb-12">
            <a href="#open-positions" className="bg-white hover:bg-gray-100 text-[#1a8b4c] font-black px-8 py-3.5 rounded-xl shadow-md transition-all text-[11px] md:text-[12px] uppercase tracking-widest text-center">
              View Open Positions
            </a>
            <a href="#apply" className="bg-[#146c3b] border border-[#146c3b] hover:bg-[#105c31] text-white font-black px-8 py-3.5 rounded-xl transition-all text-[11px] md:text-[12px] uppercase tracking-widest shadow-sm text-center">
              Submit General Application
            </a>
          </div>
        </div>

        {/* Clean Curved SVG Wave Transition seamlessly blending into the page background */}
        <div className="w-full overflow-hidden leading-none relative z-20">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-8 md:h-12 text-[#f8fbfa] fill-current">
            <path d="M0,0 C150,50 350,-20 500,20 C650,60 900,10 1200,30 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="open-positions" className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight font-lexend">
            Current Opportunities
          </h2>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
            Explore open roles and find your next career step
          </p>
          <div className="w-16 h-1 bg-[#1a8b4c] mx-auto mt-4 rounded-full"></div>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-lg max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-green-50 text-[#1a8b4c] flex items-center justify-center mx-auto text-3xl mb-4">
              💼
            </div>
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest font-heading mb-2">
              No Open Positions Right Now
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed font-semibold mb-6">
              We aren't actively hiring for specific roles at the moment. However, we're always looking for outstanding talent! Please submit a general application below.
            </p>
            <a href="#apply" className="bg-[#1a8b4c] hover:bg-[#15703d] text-white font-black px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider">
              Send Your CV
            </a>
          </div>
        ) : (
          <JobCardGrid jobs={jobs} />
        )}
      </section>

      {/* Culture Section */}
      <section className="bg-white border-y border-gray-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight font-lexend">
              Our Culture & Values
            </h2>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
              What it's like to work at GlobalWebify
            </p>
            <div className="w-16 h-1 bg-[#1a8b4c] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cultureItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="p-8 bg-[#f4fcf7] border border-[#d1ebd9] rounded-3xl hover:shadow-xl shadow-sm transition-all duration-300 flex items-start gap-4 group hover:border-[#1a8b4c]/40 hover:bg-[#ebf8f0] hover:-translate-y-1">
                  <div className={`p-3.5 rounded-2xl shrink-0 bg-gradient-to-br ${item.bg}`}>
                    <Icon size={24} className="stroke-[2.5]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-black text-gray-900 uppercase tracking-wide group-hover:text-[#1a8b4c] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight font-lexend">
            Why Work With Us
          </h2>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
            Benefits and perks we offer our team
          </p>
          <div className="w-16 h-1 bg-[#1a8b4c] mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefitItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="p-8 bg-[#f4fcf7] border border-[#d1ebd9] rounded-3xl hover:shadow-xl shadow-sm transition-all duration-300 flex items-start gap-4 group hover:border-[#1a8b4c]/40 hover:bg-[#ebf8f0] hover:-translate-y-1">
                <div className="p-3.5 rounded-2xl shrink-0 bg-[#f0fdf4] text-[#1a8b4c]">
                  <Icon size={24} className="stroke-[2.5]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-black text-gray-900 uppercase tracking-wide group-hover:text-[#1a8b4c] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Application Form Section */}
      <section id="apply" className="max-w-7xl mx-auto px-4 py-16 border-t border-gray-100">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight font-lexend">
            Apply Now
          </h2>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
            Fill out the form below to apply for a position
          </p>
          <div className="w-16 h-1 bg-[#1a8b4c] mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-3xl p-6 md:p-12 shadow-xl shadow-gray-100/40">
          <CareersFormClient positions={[
            { value: 'web-development', label: 'Web Development' },
            { value: 'senior-web-developer', label: 'Senior Web Developer' },
            { value: 'digital-marketing-specialist', label: 'Digital Marketing Specialist' },
            { value: 'ui-ux-designer', label: 'UI/UX Designer' },
            { value: 'content-writer', label: 'Content Writer' }
          ]} />
        </div>
      </section>
    </div>
  );
}
