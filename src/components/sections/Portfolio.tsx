"use client";

import React from 'react';
import Image from 'next/image';
import { m } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Section } from '../layout/Responsive/Section';

export interface FeaturedProject {
  title: string;
  category: string;
  image: string;
  link: string;
}

const defaultProjects: FeaturedProject[] = [
  {
    title: "Firayalal Public School",
    category: "Education Portal",
    image: "/Firayalal_Public_School_Ranchi.webp",
    link: "https://firayalalpublicschool.edu.in/"
  },
  {
    title: "Health Point Ranchi",
    category: "Healthcare Website",
    image: "/Health_Point_Ranchi.webp",
    link: "https://healthpointranchi.com/"
  },
  {
    title: "Dr. Kumar Vishal",
    category: "Healthcare Website",
    image: "/Dr_Kumar_Vishal.webp",
    link: "https://drkumarvishal.com/"
  },
  {
    title: "Kaveri Restaurant",
    category: "Restaurant Website",
    image: "/Kaveri.webp",
    link: "https://kaveri-nextjs.vercel.app/"
  },
  {
    title: "RPS Hospital",
    category: "Healthcare Website",
    image: "/RPS_Hospital.webp",
    link: "https://rpshospital.com/"
  },
  {
    title: "ACS Ranchi",
    category: "Restaurant Website",
    image: "/ACS_Ranchi.webp",
    link: "https://acs-jn.com/"
  }
];

const ProjectCard = ({ project, index, isDesktop }: { project: any, index: number, isDesktop: boolean }) => {
  const cardRef = React.useRef(null);

  return (
    <m.div
      ref={cardRef}
      initial={isDesktop ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
      whileInView={isDesktop ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "150px" }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
      className="relative"
    >
      <a href={project.link} target="_blank" rel="noopener noreferrer" title={`${project.title} - Global Webify`} className="block">
        <div
          className={`group relative bg-[#f0fdf4] rounded-[24px] overflow-hidden shadow-lg hover:shadow-[0_24px_48px_-12px_rgba(26,139,76,0.2)] hover:-translate-y-2 transition-[transform,box-shadow] duration-300 border border-gray-100`}
        >
          {/* Image Container */}
          <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-r from-[#e2f5e9] via-[#f0fdf4] to-[#e2f5e9] bg-[length:200%_100%] animate-[portfolio-shimmer_1.5s_ease-in-out_infinite]">
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300 animate-[fadeIn_0.3s_ease-in]"
              />

            {/* Stronger Green Tinted Bottom Shade */}
            <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#064e3b] via-[#064e3b]/70 to-transparent" />

            {/* Visit Link with Custom Arrow */}
            <div className="absolute inset-0 p-6 md:p-8 pb-4 md:pb-5 flex flex-col justify-end">
              <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full mb-3 shadow-sm border border-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                  <p className="text-white text-[11px] font-semibold uppercase tracking-widest">
                    {project.category}
                  </p>
                </div>

                <h3 className="text-white text-[18px] md:text-[20px] font-semibold leading-[1.1] mb-3 tracking-tight">
                  {project.title}
                </h3>

                <div className="flex items-center gap-3 text-[#4ade80] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[14px] font-bold uppercase tracking-wider">Visit Project</span>
                  <div className="w-8 h-[2px] bg-[#4ade80] relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 rotate-45 w-2 h-2 border-r-2 border-t-2 border-[#4ade80]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a>
    </m.div>
  );
};

export default function Portfolio({ projects = [], sectionTitle, sectionDesc }: { projects?: FeaturedProject[], sectionTitle?: string; sectionDesc?: string }) {
  const displayProjects = projects.length > 0 ? projects : defaultProjects;
  const logos = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 13, 14, 15];
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

  // Preload portfolio images on first scroll (user intent = they'll see more content)
  React.useEffect(() => {
    let done = false;
    const onFirstScroll = () => {
      if (done) return;
      done = true;
      window.removeEventListener('scroll', onFirstScroll);
      displayProjects.forEach(p => {
        const img = new window.Image();
        img.src = p.image;
      });
    };
    window.addEventListener('scroll', onFirstScroll, { passive: true, once: true });
    return () => window.removeEventListener('scroll', onFirstScroll);
  }, [displayProjects]);

  return (
    <Section id="portfolio" variant="gray" className="bg-[#f0fdf4] font-sans relative overflow-hidden">
      {/* Subtle Background Elements - Optimized using radial gradient instead of CSS blur */}
      <div className="hidden lg:block absolute top-0 right-0 w-[600px] h-[600px] rounded-full -mr-64 -mt-64" style={{ background: 'radial-gradient(circle, rgba(187, 247, 208, 0.15) 0%, rgba(187, 247, 208, 0) 70%)' }} />
      <div className="hidden lg:block absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full -ml-64 -mb-64" style={{ background: 'radial-gradient(circle, rgba(187, 247, 208, 0.15) 0%, rgba(187, 247, 208, 0) 70%)' }} />

      <div className="relative z-10">
        <div className="text-center max-w-[1100px] mx-auto mb-10 px-4">
          <m.div
            initial={isDesktop ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
            whileInView={isDesktop ? { opacity: 1, scale: 1 } : undefined}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-green-100/50 border border-green-200 px-4 py-1.5 rounded-full mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#1a8b4c] animate-pulse" />
            <span className="text-[#1a8b4c] text-[12px] font-bold uppercase tracking-widest">Success Stories</span>
          </m.div>

          {sectionTitle ? (
            <m.h2
              initial={isDesktop ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              whileInView={isDesktop ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true }}
              className="text-[24px] md:text-[32px] lg:text-[36px] font-bold text-[#064e3b] leading-tight mb-6 tracking-tight font-heading"
              dangerouslySetInnerHTML={{ __html: sectionTitle }}
            />
          ) : (
            <m.h2
              initial={isDesktop ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              whileInView={isDesktop ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true }}
              className="text-[24px] md:text-[32px] lg:text-[36px] font-bold text-[#064e3b] leading-tight mb-6 tracking-tight font-heading"
            >
              Our Work Speaks for Itself
            </m.h2>
          )}

          {sectionDesc ? (
            <m.p
              initial={isDesktop ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              whileInView={isDesktop ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-[14px] md:text-[18px] font-medium"
              dangerouslySetInnerHTML={{ __html: sectionDesc }}
            />
          ) : (
            <m.p
              initial={isDesktop ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              whileInView={isDesktop ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-[14px] md:text-[18px] font-medium"
            >
              We've successfully delivered <span className="text-[#1a8b4c] font-bold underline decoration-green-200 decoration-4 underline-offset-4">500+ live projects</span>. Explore how we help businesses win online.
            </m.p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 max-w-[1400px] mx-auto px-4">
          {displayProjects.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} isDesktop={isDesktop} />
          ))}
        </div>

        {/* Refined Brand Logos Section */}
        <div className="mt-16 py-14 bg-[#052e16] rounded-[32px] md:rounded-[40px] overflow-hidden relative shadow-2xl border border-green-900/20 px-4">
          <div className="text-center mb-10">
            <m.h3
              initial={isDesktop ? { opacity: 0 } : { opacity: 0.8 }}
              whileInView={isDesktop ? { opacity: 0.8 } : undefined}
              viewport={{ once: true }}
              className="text-[11px] md:text-[13px] font-bold text-green-100 font-heading uppercase tracking-[0.4em]"
            >
              Trusted by Industry Leaders
            </m.h3>
          </div>

          <div className="relative flex overflow-x-hidden">
            <style>{`
              @keyframes logoMarquee {
                0% { transform: translate3d(0, 0, 0); }
                100% { transform: translate3d(-50%, 0, 0); }
              }
              .animate-logo-marquee {
                animation: logoMarquee 60s linear infinite;
                will-change: transform;
              }
            `}</style>
            <div
              className={`flex whitespace-nowrap py-2 animate-logo-marquee`}
            >
              {[...logos, ...logos].map((num, i) => (
                <div key={`${num}-${i}`} className="mx-3 flex-shrink-0">
                  <div className="bg-white rounded-xl w-[140px] md:w-[180px] h-[90px] md:h-[120px] flex items-center justify-center shadow-lg transition-transform hover:scale-105 duration-500 p-2 relative">
                    <Image
                      src={num <= 4 ? `/${num}.avif` : `/${num}.webp`}
                      alt={`Partner Logo ${num}`}
                      title={`Partner Logo ${num}`}
                      width={180}
                      height={120}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#052e16] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#052e16] to-transparent z-10 pointer-events-none" />
        </div>

        <div className="mt-12 text-center">
          <Link href="/portfolio" className="inline-block">
            <m.div
              whileHover={isDesktop ? { scale: 1.05, boxShadow: "0 10px 20px -5px rgba(26,139,76,0.3)" } : undefined}
              whileTap={isDesktop ? { scale: 0.95 } : undefined}
              className="group bg-[#1a8b4c] text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl text-[16px] md:text-[17px] font-bold shadow-md shadow-green-900/10 hover:bg-[#15803d] transition-all flex items-center gap-3 mx-auto cursor-pointer"
            >
              View All Projects
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </m.div>
          </Link>
        </div>
      </div>
    </Section>
  );
}
