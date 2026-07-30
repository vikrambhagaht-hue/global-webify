import { db } from '@/lib/db';
import { Building2, MapPin } from 'lucide-react';
import FranchiseStatsClient from './FranchiseStatsClient';

export const revalidate = 0;

export const metadata = {
  title: 'Our Franchise Partners | Global Webify',
  description: 'Meet our trusted franchise partners across different regions. Join our growing network of successful franchisees.',
};

export default async function OurFranchiseePage() {
  const partners = await db.franchiseeOnboarding.findMany({
    where: { status: 'APPROVED' },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="bg-gradient-to-b from-[#e2f3ea] to-[#eff9f4] min-h-screen">

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-[#1a8b4c] pt-44 md:pt-52 pb-16 md:pb-24">
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/[0.05] rounded-full" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/[0.03] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-black font-lexend text-white mb-6 uppercase tracking-tight leading-[1.1]">
            Franchise <span className="text-white">Partners</span>
          </h1>

          {/* Divider */}
          <div className="w-24 h-1.5 bg-emerald-300 mx-auto mb-8 rounded-full" />

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-emerald-50 max-w-2xl mx-auto leading-relaxed font-medium">
            Empowering visionary entrepreneurs across India with verified technology hubs & regional partnerships.
          </p>

          {/* Animated Stats Row */}
          <FranchiseStatsClient partnerCount={partners.length} />
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0,50 C360,80 720,20 1440,50 L1440,80 L0,80 Z" fill="#e2f3ea"/>
          </svg>
        </div>
      </section>

      {/* ── Partners Grid ── */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">

        {partners.length === 0 ? (
          <div className="bg-white rounded-3xl border border-emerald-100 p-14 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#1a8b4c] flex items-center justify-center mx-auto mb-5">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Partners Listed Yet</h3>
            <p className="text-gray-500 font-medium leading-relaxed">
              We are currently onboarding new franchise partners across different locations. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {partners.map((partner) => (
              <div 
                key={partner.id}
                className="group relative rounded-[2rem] p-7 md:p-8 bg-gradient-to-b from-white to-[#f4fbf7] border border-emerald-200/80 hover:border-[#1a8b4c]/60 shadow-sm hover:shadow-[0_10px_40px_rgb(26,139,76,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center gap-4"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1a8b4c] to-[#126b38] text-white flex items-center justify-center shadow-md shadow-[#1a8b4c]/20 group-hover:scale-105 transition-transform duration-300">
                  <Building2 className="w-7 h-7" />
                </div>

                {/* Name */}
                <h3 className="text-xl md:text-[22px] font-black text-gray-900 tracking-tight leading-tight group-hover:text-[#1a8b4c] transition-colors">
                  {partner.name}
                </h3>

                {/* Location */}
                {partner.address && (
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold mt-auto pt-3 border-t border-emerald-50 w-full justify-center">
                    <MapPin size={14} className="text-[#1a8b4c] shrink-0" />
                    <span className="truncate max-w-[200px]">{partner.address}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
