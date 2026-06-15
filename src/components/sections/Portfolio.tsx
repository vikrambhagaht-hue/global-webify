"use client";

import React from 'react';
import Image from 'next/image';
import { m, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Section } from '../layout/Responsive/Section';

const projects = [
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

const ProjectCard = ({ project, index }: { project: any, index: number }) => {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [0, 1], [5, -5]);
  const rotateY = useTransform(mouseXSpring, [0, 1], [-5, 5]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width);
    y.set((event.clientY - rect.top) / rect.height);
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "300px" }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
      className="relative"
      style={{ perspective: 1000 }}
    >
      <Link href={project.link} target="_blank" rel="noopener noreferrer" title={`${project.title} - Global Webify`}>
        <m.div
          onMouseMove={handleMouse}
          onMouseLeave={() => { x.set(0.5); y.set(0.5); }}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="group relative bg-white rounded-[24px] overflow-hidden shadow-lg hover:shadow-[0_24px_48px_-12px_rgba(26,139,76,0.2)] transition-shadow duration-500 border border-gray-100"
        >
          {/* Image Container */}
          <div className="relative aspect-[16/10] overflow-hidden" style={{ transform: "translateZ(0px)" }}>
            <Image
              src={project.image}
              alt={project.title}
              fill
              quality={80}
              className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-[1.05] contrast-[1.05]"
              sizes="(max-width: 768px) 480px, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Stronger Green Tinted Bottom Shade */}
            <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#064e3b] via-[#064e3b]/70 to-transparent opacity-100 transition-opacity duration-500" />

            {/* Visit Link with Custom Arrow */}
            <div className="absolute inset-0 p-6 md:p-8 pb-4 md:pb-5 flex flex-col justify-end" style={{ transform: "translateZ(40px)" }}>
              <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                  <p className="text-white text-[11px] font-semibold uppercase tracking-widest">
                    {project.category}
                  </p>
                </div>

                <h3 className="text-white text-[18px] md:text-[20px] font-semibold leading-[1.1] mb-3 tracking-tight">
                  {project.title}
                </h3>

                <div className="flex items-center gap-3 text-[#4ade80] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                  <span className="text-[14px] font-bold uppercase tracking-wider">Visit Project</span>
                  <div className="w-8 h-[2px] bg-[#4ade80] relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 rotate-45 w-2 h-2 border-r-2 border-t-2 border-[#4ade80]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </m.div>
      </Link>
    </m.div>
  );
};

export default function Portfolio({ sectionTitle, sectionDesc }: { sectionTitle?: string; sectionDesc?: string }) {
  const logos = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 13, 14, 15];

  return (
    <Section id="portfolio" variant="gray" className="bg-[#f0fdf4] font-sans relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-200/20 blur-[120px] rounded-full -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-200/20 blur-[120px] rounded-full -ml-64 -mb-64" />

      <div className="relative z-10">
        <div className="text-center max-w-[1100px] mx-auto mb-10 px-4">
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-green-100/50 border border-green-200 px-4 py-1.5 rounded-full mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#1a8b4c] animate-pulse" />
            <span className="text-[#1a8b4c] text-[12px] font-bold uppercase tracking-widest">Success Stories</span>
          </m.div>

          {sectionTitle ? (
            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[24px] md:text-[32px] lg:text-[36px] font-bold text-[#1a8b4c] leading-tight mb-6 tracking-tight font-heading xl:whitespace-nowrap"
              dangerouslySetInnerHTML={{ __html: sectionTitle }}
            />
          ) : (
            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[24px] md:text-[32px] lg:text-[36px] font-bold text-[#1a8b4c] leading-tight mb-6 tracking-tight font-heading xl:whitespace-nowrap"
            >
              Our Work Speaks for Itself
            </m.h2>
          )}

          {sectionDesc ? (
            <m.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-[14px] md:text-[18px] font-medium lg:whitespace-nowrap"
              dangerouslySetInnerHTML={{ __html: sectionDesc }}
            />
          ) : (
            <m.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-[14px] md:text-[18px] font-medium lg:whitespace-nowrap"
            >
              We've successfully delivered <span className="text-[#1a8b4c] font-bold underline decoration-green-200 decoration-4 underline-offset-4">500+ live projects</span>. Explore how we help businesses win online.
            </m.p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 max-w-[1400px] mx-auto px-4">
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} />
          ))}
        </div>

        {/* Refined Brand Logos Section */}
        <div className="mt-16 py-14 bg-[#052e16] rounded-[32px] md:rounded-[40px] overflow-hidden relative shadow-2xl border border-green-900/20 px-4">
          <div className="text-center mb-10">
            <m.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.8 }}
              viewport={{ once: true }}
              className="text-[11px] md:text-[13px] font-bold text-green-100 font-heading uppercase tracking-[0.4em]"
            >
              Trusted by Industry Leaders
            </m.h3>
          </div>

          <div className="relative flex overflow-x-hidden">
            <m.div
              className="flex whitespace-nowrap py-2"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 60,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[...logos, ...logos].map((num, i) => (
                <div key={`${num}-${i}`} className="mx-3 flex-shrink-0">
                  <div className="bg-white rounded-xl w-[120px] md:w-[150px] h-[80px] md:h-[110px] flex items-center justify-center shadow-lg transition-transform hover:scale-105 duration-500 p-4 relative">
                    <Image
                      src={num <= 4 ? `/${num}.avif` : `/${num}.webp`}
                      alt={`Partner Logo ${num}`}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 768px) 120px, 150px"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </m.div>
          </div>

          <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#052e16] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#052e16] to-transparent z-10 pointer-events-none" />
        </div>

        <div className="mt-12 text-center">
          <Link href="/portfolio" className="inline-block">
            <m.div
              whileHover={{ scale: 1.05, boxShadow: "0 10px 20px -5px rgba(26,139,76,0.3)" }}
              whileTap={{ scale: 0.95 }}
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
