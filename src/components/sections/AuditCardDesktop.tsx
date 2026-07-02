"use client";

import React from "react";

// --- Desktop Audit Card — 3D Tilt with Scroll-Lag Prevention ---
export default function AuditCardDesktop() {
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // SCROLL LAG FIX: If the mouse didn't actually move (user is just scrolling the page 
    // and the card moved under the static mouse), IGNORE the event.
    if (Math.abs(e.movementX) === 0 && Math.abs(e.movementY) === 0) return;

    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    cardRef.current.style.setProperty('--rx', `${-y * 16}deg`);
    cardRef.current.style.setProperty('--ry', `${x * 16}deg`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--rx', '0deg');
    cardRef.current.style.setProperty('--ry', '0deg');
  };

  return (
    <div className="w-full max-w-[580px] mx-auto cursor-default z-20 relative font-jost" style={{ perspective: '1200px' }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full hover:shadow-[0px_28px_56px_-12px_rgba(26,139,76,0.18)]"
        style={{
          transform: 'rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
          transition: 'transform 0.15s ease-out, box-shadow 0.3s ease-out'
        }}
      >
        {/* Outer dark bezel */}
        <div className="bg-[#1a2332] rounded-t-[20px] shadow-2xl border border-[#2a3a4e] border-b-0 overflow-hidden relative">

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
                    <div className="text-[22px] font-black text-slate-900 leading-tight font-heading">globalwebify.com</div>
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
      </div>
    </div>
  );
}
