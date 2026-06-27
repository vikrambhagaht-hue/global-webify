import React from 'react';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Briefcase, MapPin, Clock, ArrowRight, ShieldCheck, Heart, GraduationCap, Award, Compass, Zap, Flame, UserCheck } from 'lucide-react';
import CareersFormClient from './CareersFormClient';
import JobCardGrid from './JobCardGrid';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Careers | GlobalWebify',
  description: 'Join the GlobalWebify team. Explore open positions and career opportunities.',
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
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0a1911] via-[#0d2218] to-[#122c1f] text-white py-24 md:py-32">
        {/* Animated Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#1a8b4c]/10 blur-[120px] pointer-events-none animate-pulse duration-[8000ms]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none animate-pulse duration-[6000ms]"></div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10 space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest">
            Careers at GlobalWebify
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight uppercase font-lexend bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-emerald-400">
            Join Our Expert Team
          </h1>
          <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto font-semibold leading-relaxed">
            We help businesses grow online with custom web development, SEO, and digital marketing solutions. Be a part of a lively environment where creativity and innovation flourish.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <a href="#open-positions" className="bg-[#1a8b4c] hover:bg-[#15703d] text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-[#1a8b4c]/10 transition-all text-xs uppercase tracking-wider">
              View Open Positions
            </a>
            <a href="#apply" className="border border-white/20 hover:bg-white/5 text-white font-black px-8 py-4 rounded-2xl transition-all text-xs uppercase tracking-wider">
              Submit General Application
            </a>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="open-positions" className="max-w-7xl mx-auto px-4 py-20">
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
      <section className="bg-white border-y border-gray-100 py-24">
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
                <div key={index} className="p-8 bg-white border border-gray-100 rounded-3xl hover:shadow-xl transition-all duration-300 flex items-start gap-4 group hover:border-[#1a8b4c]/20">
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
      <section className="max-w-7xl mx-auto px-4 py-24">
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
              <div key={index} className="p-8 bg-white border border-gray-100 rounded-3xl hover:shadow-xl transition-all duration-300 flex items-start gap-4 group hover:border-[#1a8b4c]/20">
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
