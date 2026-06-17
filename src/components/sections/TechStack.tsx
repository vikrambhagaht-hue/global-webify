"use client";

import React from 'react';
import { m } from 'framer-motion';
import Image from 'next/image';
import { Section } from '../layout/Responsive/Section';

const techStack = [
  { 
    name: "Shopify", 
    icon: "https://cdn.simpleicons.org/shopify/96BF48",
    desc: "E-commerce",
    color: "#96BF48",
    bg: "bg-[#96BF48]/5"
  },
  { 
    name: "PHP", 
    icon: "https://cdn.simpleicons.org/php/777BB4",
    desc: "Backend",
    color: "#777BB4",
    bg: "bg-[#777BB4]/5"
  },
  { 
    name: "WordPress", 
    icon: "https://cdn.simpleicons.org/wordpress/21759B",
    desc: "CMS",
    color: "#21759B",
    bg: "bg-[#21759B]/5"
  },
  { 
    name: "Node.js", 
    icon: "https://cdn.simpleicons.org/nodedotjs/339933",
    desc: "Backend",
    color: "#339933",
    bg: "bg-[#339933]/5"
  },
  { 
    name: "React", 
    icon: "https://cdn.simpleicons.org/react/61DAFB",
    desc: "Library",
    color: "#61DAFB",
    bg: "bg-[#61DAFB]/5"
  },
  { 
    name: "CodeIgniter", 
    icon: "https://cdn.simpleicons.org/codeigniter/EE4323",
    desc: "PHP Framework",
    color: "#EE4323",
    bg: "bg-[#EE4323]/5"
  },
  { 
    name: "Android", 
    icon: "https://cdn.simpleicons.org/android/3DDC84",
    desc: "Mobile",
    color: "#3DDC84",
    bg: "bg-[#3DDC84]/5"
  },
  { 
    name: "Next.js", 
    icon: "https://cdn.simpleicons.org/nextdotjs/FFFFFF",
    desc: "React Framework",
    color: "#FFFFFF",
    bg: "bg-white/5"
  },
  { 
    name: "Google Ads", 
    icon: "https://cdn.simpleicons.org/googleads/4285F4",
    desc: "Marketing",
    color: "#4285F4",
    bg: "bg-[#4285F4]/5"
  }
];

export default function TechStack({ sectionTitle, sectionDesc }: { sectionTitle?: string; sectionDesc?: string }) {
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const checkDevice = () => {
      const isLargeHover = window.innerWidth >= 1024 && window.matchMedia('(hover: hover)').matches;
      setIsDesktop(prev => (prev !== isLargeHover ? isLargeHover : prev));
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return (
    <Section id="tech-stack" variant="dark" className="bg-gradient-to-br from-[#064e3b] to-[#022c22] relative overflow-hidden font-sans border-t border-[#064e3b]">
      {/* Decorative liquid glass lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#1a8b4c]/10 blur-[120px] rounded-full pointer-events-none -ml-48 -mb-48" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <div className="text-center max-w-[1100px] mx-auto mb-8 md:mb-12 px-4">
          <m.span 
            initial={isDesktop ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
            animate={isDesktop ? { opacity: 1, y: 0 } : undefined}
            className="inline-flex items-center gap-2 bg-green-50 border border-green-100 text-[#1a8b4c] text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a8b4c] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1a8b4c]" />
            </span>
            Powering Innovation
          </m.span>
          {sectionTitle ? (
            <h2 
              className="text-[28px] md:text-[36px] font-bold text-white leading-tight tracking-tight mb-4"
              dangerouslySetInnerHTML={{ __html: sectionTitle }}
            />
          ) : (
            <h2 className="text-[28px] md:text-[36px] font-bold text-white leading-tight tracking-tight mb-4">
              Our <span className="text-[#1cb05b]">Cutting-Edge</span> Tech Stack
            </h2>
          )}
          {sectionDesc ? (
            <p 
              className="text-gray-400 text-[13px] md:text-[15px] font-medium mx-auto"
              dangerouslySetInnerHTML={{ __html: sectionDesc }}
            />
          ) : (
            <p className="text-gray-400 text-[13px] md:text-[15px] font-medium mx-auto">
              We use the most powerful and modern technologies to build scalable, high-performance digital solutions for your business.
            </p>
          )}
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3 md:gap-4 max-w-[1400px] mx-auto">
          {techStack.map((tech, i) => (
            <m.div
              key={tech.name}
              initial={isDesktop ? { opacity: 0, y: 15 } : { opacity: 1, y: 0 }}
              whileInView={isDesktop ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true, margin: "300px" }}
              transition={{ delay: i * 0.015, duration: 0.3 }}
              whileHover={isDesktop ? { y: -5, transition: { duration: 0.2 } } : undefined}
              className="group flex flex-col items-center transform-gpu will-change-transform"
              style={{ '--tech-color': tech.color } as React.CSSProperties}
            >
              <div 
                className="w-full aspect-square border border-white/30 md:border-white/20 rounded-[36px] p-3 md:p-5 flex items-center justify-center transition-all duration-500 shadow-[0_10px_25px_rgba(0,0,0,0.25)] md:shadow-[0_15px_35px_rgba(0,0,0,0.4),inset_0_0_20px_rgba(255,255,255,0.05),inset_0_2px_5px_rgba(255,255,255,0.3)] backdrop-blur-none md:backdrop-blur-2xl group-hover:-translate-y-2 relative overflow-hidden group/card"
                style={{ backgroundColor: `${tech.color}10` }}
              >
                
                {/* Dynamic Colored Border Overlay on Hover */}
                <div 
                  className="absolute inset-0 rounded-[36px] border opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none z-20"
                  style={{ borderColor: tech.color }}
                />

                {/* Unique Water Droplet Bottom Glow */}
                <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[60%] pointer-events-none opacity-60 group-hover/card:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(to top, ${tech.color}30, transparent)` }}
                />
                
                <Image 
                  src={tech.icon} 
                  alt={tech.name} 
                  width={56}
                  height={56}
                  className="w-11 h-11 md:w-12 md:h-12 object-contain filter transition-all duration-300 group-hover:scale-110 relative z-10"
                  unoptimized={tech.icon.includes('.org')}
                />
                
                {/* Unique Subtle Glow on Hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover/card:opacity-100 rounded-[36px] transition-opacity pointer-events-none"
                  style={{ backgroundColor: `${tech.color}25` }}
                />
              </div>
              
              <div className="mt-3 text-center">
                <p className="text-[11px] md:text-[13px] font-semibold text-white/90 group-hover:text-[var(--tech-color)] transition-colors line-clamp-1">{tech.name}</p>
                <p className="hidden md:block text-[9px] font-medium text-gray-400 uppercase tracking-widest mt-0.5">{tech.desc}</p>
              </div>
            </m.div>
          ))}
        </div>

      </div>
    </Section>
  );
}
