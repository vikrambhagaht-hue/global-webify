import { db } from '@/lib/db';
import { Building2, MapPin, Sparkles, TrendingUp } from 'lucide-react';

export const revalidate = 0; // Instant server-side data fetching

export const metadata = {
  title: 'Our Franchise Partners | Global Webify',
  description: 'Meet our trusted franchise partners across different regions. Join our growing network of successful franchisees.',
};

export default async function OurFranchiseePage() {
  // Fetch only APPROVED franchisees
  const partners = await db.franchiseeOnboarding.findMany({
    where: { status: 'APPROVED' },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-[#edf2f7] text-slate-900 pt-20 pb-24 font-sans">
      {/* Hero Section - Clean Warm Sunset Theme */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#ff6b00] via-[#ff4500] to-[#c91818] pt-16 md:pt-24 text-white">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/25 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wider uppercase mb-6">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Global Webify Network</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tight leading-tight mb-4 drop-shadow-md">
            OUR FRANCHISE <span className="text-amber-200">PARTNERS</span>
          </h1>

          <p className="text-lg md:text-xl text-amber-100 max-w-2xl font-medium tracking-wide mb-10">
            Empowering Visionary Entrepreneurs & Building Success Stories Worldwide
          </p>

          {/* Mountain Card Box - Fully Solid with Crisp Typography */}
          <div className="w-full max-w-3xl bg-gradient-to-b from-[#7a0c0c] to-[#4f0606] rounded-t-3xl md:rounded-t-[40px] pt-8 pb-10 px-6 shadow-2xl border-t border-x border-amber-400/30 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08)_0,transparent_70%)] pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 text-xs md:text-sm font-black tracking-widest text-amber-300 uppercase mb-2">
                <TrendingUp className="w-4 h-4 text-amber-300" />
                <span>Established & Growing</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight drop-shadow">
                SCALING IT TOGETHER
              </h2>
            </div>
          </div>
        </div>

        {/* Clean Curved SVG Wave Transition */}
        <div className="w-full overflow-hidden leading-none relative z-20 -mt-1">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-10 md:h-14 text-[#edf2f7] fill-current">
            <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,40 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* Overlapping Diagonal Ribbon Tape Marquee Section (Continuous Infinite Scroll) */}
      <div className="relative z-30 -mt-4 mb-6 overflow-hidden py-4 pointer-events-none">
        <style>{`
          @keyframes marqueeLeft {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
          @keyframes marqueeRight {
            0% { transform: translate3d(-50%, 0, 0); }
            100% { transform: translate3d(0, 0, 0); }
          }
          .animate-tape-left {
            animation: marqueeLeft 28s linear infinite;
            will-change: transform;
          }
          .animate-tape-right {
            animation: marqueeRight 28s linear infinite;
            will-change: transform;
          }
        `}</style>

        {/* Diagonal Tape 1 (Scrolling Left - Sunset Gradient Tape) */}
        <div className="w-[140%] -ml-[20%] bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white font-black text-xs md:text-sm uppercase tracking-widest py-2.5 shadow-xl rotate-[-2.5deg] border-y border-white/30 whitespace-nowrap overflow-hidden flex">
          <div className="flex shrink-0 items-center gap-8 animate-tape-left pr-8">
            <span>★ GLOBAL WEBIFY NETWORK</span>
            <span>•</span>
            <span>AUTHORIZED FRANCHISE PARTNERS</span>
            <span>•</span>
            <span>VERIFIED REGIONAL HUBS</span>
            <span>•</span>
            <span>GLOBAL WEBIFY NETWORK</span>
            <span>•</span>
            <span>AUTHORIZED FRANCHISE PARTNERS</span>
            <span>•</span>
            <span>VERIFIED REGIONAL HUBS</span>
          </div>
          <div className="flex shrink-0 items-center gap-8 animate-tape-left pr-8" aria-hidden="true">
            <span>★ GLOBAL WEBIFY NETWORK</span>
            <span>•</span>
            <span>AUTHORIZED FRANCHISE PARTNERS</span>
            <span>•</span>
            <span>VERIFIED REGIONAL HUBS</span>
            <span>•</span>
            <span>GLOBAL WEBIFY NETWORK</span>
            <span>•</span>
            <span>AUTHORIZED FRANCHISE PARTNERS</span>
            <span>•</span>
            <span>VERIFIED REGIONAL HUBS</span>
          </div>
        </div>

        {/* Diagonal Tape 2 (Scrolling Right - Overlapping Dark Ribbon Tape) */}
        <div className="w-[140%] -ml-[20%] bg-slate-900 text-amber-300 font-black text-xs md:text-sm uppercase tracking-widest py-2.5 shadow-2xl rotate-[2deg] -mt-7 border-y border-amber-400/40 whitespace-nowrap overflow-hidden flex">
          <div className="flex shrink-0 items-center gap-8 animate-tape-right pr-8">
            <span>OFFICIAL NETWORK</span>
            <span>★</span>
            <span>100% VERIFIED PARTNERS</span>
            <span>★</span>
            <span>SCALING IT TOGETHER</span>
            <span>★</span>
            <span>OFFICIAL NETWORK</span>
            <span>★</span>
            <span>100% VERIFIED PARTNERS</span>
            <span>★</span>
            <span>SCALING IT TOGETHER</span>
          </div>
          <div className="flex shrink-0 items-center gap-8 animate-tape-right pr-8" aria-hidden="true">
            <span>OFFICIAL NETWORK</span>
            <span>★</span>
            <span>100% VERIFIED PARTNERS</span>
            <span>★</span>
            <span>SCALING IT TOGETHER</span>
            <span>★</span>
            <span>OFFICIAL NETWORK</span>
            <span>★</span>
            <span>100% VERIFIED PARTNERS</span>
            <span>★</span>
            <span>SCALING IT TOGETHER</span>
          </div>
        </div>
      </div>

      {/* Partners Grid Section */}
      <section className="max-w-7xl mx-auto px-6 pt-6 relative z-20">
        {partners.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-12 text-center max-w-2xl mx-auto">
            <Building2 className="w-16 h-16 text-sky-500/60 mx-auto mb-4 animate-pulse" />
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No Partners Listed Yet</h3>
            <p className="text-slate-500 font-medium">We are currently onboarding new franchise partners across different locations. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-8">
            {partners.map((partner) => (
              <div 
                key={partner.id}
                className="group relative rounded-[32px] md:rounded-[36px] p-7 md:p-8 border border-white/90 bg-gradient-to-b from-white/95 via-slate-50/90 to-[#e0f2fe]/70 shadow-xl shadow-cyan-900/5 hover:shadow-2xl hover:shadow-cyan-900/10 hover:-translate-y-1.5 transition-all duration-300 backdrop-blur-md overflow-hidden flex flex-col items-center text-center justify-between"
              >
                <div className="flex flex-col items-center text-center w-full">
                  {/* Top Center IT Icon Box */}
                  <div className="flex justify-center mx-auto mb-3">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20 ring-4 ring-sky-100/80 group-hover:scale-105 transition-transform duration-300">
                      <Building2 className="w-8 h-8 text-white drop-shadow-xs" />
                    </div>
                  </div>

                  {/* Name & Role */}
                  <h3 className="text-2xl md:text-[26px] font-black text-slate-900 tracking-tight leading-tight mt-3 mb-0.5 group-hover:text-sky-600 transition-colors text-center w-full">
                    {partner.name}
                  </h3>
                  <p className="text-slate-500 font-medium text-sm md:text-[15px] text-center">
                    Franchise Partner
                  </p>

                  {/* Location Tag */}
                  {partner.address && (
                    <div className="flex justify-center mt-3.5 w-full">
                      <span className="px-3.5 py-1.5 bg-white/90 border border-slate-200/60 rounded-full text-xs font-semibold text-slate-700 shadow-2xs flex items-center gap-1.5">
                        <MapPin size={13} className="text-sky-500" />
                        <span className="truncate max-w-[190px]">{partner.address}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
