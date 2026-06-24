"use client";

import React from "react";
import { m, useMotionValue, useTransform, useSpring } from 'framer-motion';

// --- Desktop Audit Card with framer-motion 3D hover effect ---
// This is lazy-loaded via dynamic() in Hero.tsx — framer-motion only loads after page paint
export default function AuditCardDesktop() {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [0, 1], [8, -8]);
  const rotateY = useTransform(mouseXSpring, [0, 1], [-8, 8]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width);
    y.set((event.clientY - rect.top) / rect.height);
  }

  return (
    <m.div
      style={{ perspective: 1200 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0.5); y.set(0.5); }}
      className="w-full max-w-[580px] mx-auto cursor-default z-20 relative font-jost"
    >
      <m.div
        style={{ 
          rotateX, 
          rotateY, 
          transformStyle: "preserve-3d",
          willChange: "transform"
        }}
        whileHover={{ scale: 1.02, y: -6, boxShadow: "0px 28px 56px -12px rgba(26,139,76,0.18)" }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative w-full"
      >
        {/* Outer dark bezel */}
        <div className="bg-[#1a2332] rounded-t-[20px] shadow-2xl border border-[#2a3a4e] border-b-0 overflow-hidden">

          {/* Browser chrome - full width at top */}
          <div className="bg-[#f1f5f9] mx-[10px] mt-[10px] rounded-t-[12px] border-b border-slate-200 px-5 py-3 flex items-center gap-4">
            <div className="flex gap-[7px] shrink-0">
              <div className="w-[12px] h-[12px] rounded-full bg-[#ef4444]" />
              <div className="w-[12px] h-[12px] rounded-full bg-[#f59e0b]" />
              <div className="w-[12px] h-[12px] rounded-full bg-[#22c55e]" />
            </div>
            <div className="bg-white border border-slate-200 text-slate-400 text-[11px] px-4 py-[5px] rounded-lg flex-1 text-left font-mono truncate">
              https://audit.globalwebify.com/report
            </div>
          </div>

          {/* Below chrome: sidebar + content side by side */}
          <div className="flex px-[10px] pb-[6px]">
            {/* Left dark sidebar with icons */}
            <div className="w-[46px] shrink-0 flex flex-col items-center pt-5 gap-[10px]">
              <div className="w-[26px] h-[26px] rounded-[7px] bg-[#22C55E] shadow-[0_0_12px_rgba(34,197,94,0.4)]" />
              <div className="w-[30px] h-[1px] bg-slate-700 my-[2px]" />
              <div className="w-[26px] h-[26px] rounded-[7px] bg-[#334155] opacity-60" />
              <div className="w-[26px] h-[26px] rounded-[7px] bg-[#334155] opacity-60" />
              <div className="w-[26px] h-[26px] rounded-[7px] bg-[#22C55E] shadow-[0_0_12px_rgba(34,197,94,0.3)]" />
              <div className="w-[26px] h-[26px] rounded-[7px] bg-[#334155] opacity-60" />
            </div>

            {/* Main white content area */}
            <div className="flex-1 bg-white rounded-b-[12px] overflow-hidden flex flex-col min-w-0 text-left">
              <div className="p-4 md:p-5 flex-1 flex flex-col gap-4">
                {/* Website Audit Report header + Grade A+ */}
                <div className="flex justify-between items-start">
                  <div className="text-left">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em] mb-1">Website Audit Report</p>
                    <h3 className="text-[22px] font-black text-slate-900 leading-tight font-heading">globalwebify.com</h3>
                  </div>
                  <span className="bg-white text-slate-800 text-[15px] font-black px-5 py-2 rounded-xl border-2 border-slate-200 whitespace-nowrap shadow-sm">Grade A+</span>
                </div>

                {/* 4 Score cards */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "PERFORMANCE", val: "98" },
                    { label: "ACCESSIBILITY", val: "100" },
                    { label: "BEST PRACTICES", val: "95" },
                    { label: "SEO", val: "100" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-[#f8fafc] border border-slate-200 rounded-xl p-2.5 text-center shadow-sm flex flex-col items-center gap-2">
                      <div className="w-full bg-slate-100 h-[5px] rounded-full overflow-hidden">
                        <div className="h-full bg-[#22C55E] rounded-full" style={{ width: `${stat.val}%` }} />
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-[28px] font-extrabold text-slate-900 leading-none mb-1 font-heading">{stat.val}</div>
                        <div className="text-[7px] uppercase font-bold text-slate-400 tracking-[0.12em] w-full truncate">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Critical Optimization Opportunities */}
                <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-4 shadow-sm">
                  <p className="text-[14px] font-bold text-slate-900 mb-3 text-left">Critical Optimization Opportunities</p>
                  <div className="flex flex-col gap-0">
                    {[
                      {
                        coreColor: "bg-red-300",
                        ringColor: "border-red-200",
                        title: "Minimize Main-Thread Work",
                        sub: "Reduce JS parse time by 1.2s",
                        badge: "HIGH IMPACT",
                        badgeColor: "bg-red-50 text-red-500 border-red-200"
                      },
                      {
                        coreColor: "bg-amber-300",
                        ringColor: "border-amber-200",
                        title: "Serve Images in Next-Gen Formats",
                        sub: "Potential savings: 145 KiB",
                        badge: "MED IMPACT",
                        badgeColor: "bg-amber-50 text-amber-600 border-amber-200"
                      },
                      {
                        coreColor: "bg-emerald-300",
                        ringColor: "border-emerald-200",
                        title: "Ensure Text Remains Visible",
                        sub: "All fonts loaded correctly",
                        badge: "PASSED",
                        badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200"
                      },
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center justify-between gap-3 text-left py-2.5 ${i < 2 ? 'border-b border-slate-100' : ''}`}>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
                            <span className={`w-4 h-4 rounded-full border-2 ${item.ringColor} bg-white absolute`} />
                            <span className={`w-2 h-2 rounded-full ${item.coreColor} relative z-10`} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-slate-800 leading-tight">{item.title}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{item.sub}</p>
                          </div>
                        </div>
                        <span className={`shrink-0 text-[9px] font-bold px-3 py-1.5 rounded-md border ${item.badgeColor} uppercase tracking-wide`}>{item.badge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom base/stand edge */}
        <div className="bg-[#1f2d3f] h-[8px] rounded-b-[20px] border border-t-0 border-[#2a3a4e]" />
        <div className="bg-[#2d3d52] h-[5px] rounded-b-[10px] mx-5 opacity-60" />
      </m.div>
    </m.div>
  );
}
