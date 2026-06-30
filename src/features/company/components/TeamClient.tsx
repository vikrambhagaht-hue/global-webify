"use client";

import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter, 
  X, 
  GraduationCap, 
  Briefcase
} from 'lucide-react';
import Image from 'next/image';
import teamData from '@/data/team.json';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  education: string;
  experience?: string;
  isExEmployee: boolean;
  order?: number;
  socials: {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
  };
}

// Helper to resolve real social links, falling back to homepage if placeholder or empty
const getSocialLink = (url: string) => {
  if (!url) return "/";
  let clean = url.trim();
  
  const placeholders = [
    "https://globalwebify.com",
    "http://globalwebify.com",
    "https://x.com",
    "http://x.com",
    "https://twitter.com",
    "http://twitter.com",
    "https://www.facebook.com",
    "https://facebook.com",
    "https://www.instagram.com",
    "https://instagram.com"
  ];
  
  if (placeholders.includes(clean.toLowerCase().replace(/\/$/, ""))) {
    return "/";
  }

  // Ensure absolute URL so browser doesn't navigate to local 404 page
  if (!clean.startsWith("http://") && !clean.startsWith("https://") && !clean.startsWith("/")) {
    clean = "https://" + clean;
  }

  return clean;
};

export default function TeamClient() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedMember(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedMember]);

  // Sort members primarily by custom order sequence if defined
  const sortedMembers = [...(teamData as TeamMember[])].sort((a, b) => {
    if (typeof a.order === 'number' && typeof b.order === 'number' && a.order !== b.order) {
      return a.order - b.order;
    }
    if (a.isExEmployee && !b.isExEmployee) return 1;
    if (!a.isExEmployee && b.isExEmployee) return -1;
    return a.id - b.id;
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header Section */}
      <section className="pt-16 md:pt-24 pb-12 bg-[#f1faf5] border-b border-gray-100">
        <div className="container-custom text-center">
          <m.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-black font-lexend text-primary-dark mb-4 uppercase tracking-tight"
          >
            Meet Our Team
          </m.h1>
          <div className="w-16 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
          <m.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Meet the passionate experts, designers, developers, and strategists behind Global Webify's success.
          </m.p>
        </div>
      </section>

      {/* Team Grid Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
            {sortedMembers.map((member, index) => {
              return (
                <div
                  key={member.id}
                  className="relative bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-premium hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Ex-Employee Tag */}
                  {member.isExEmployee && (
                    <div className="absolute top-4 left-4 bg-red-500/95 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full z-10 shadow-sm">
                      Ex-Employee
                    </div>
                  )}

                  {/* Clickable Card Body (Image + Name + Role) */}
                  <div 
                    onClick={() => setSelectedMember(member)}
                    className="cursor-pointer flex-grow flex flex-col"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
                      <Image
                        src={member.image}
                        alt={`${member.name} - ${member.role}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        // Preload the first row of images (index < 4) for LCP optimization, lazy load the rest
                        priority={index < 4}
                        loading={index >= 4 ? "lazy" : undefined}
                        className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                          member.isExEmployee ? 'filter grayscale group-hover:grayscale-0' : ''
                        }`}
                      />
                      {/* Hover Overlay - subtle shade shift */}
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Info Card Content */}
                    <div className="p-5 flex flex-col flex-grow text-center justify-center">
                      <h3 className="font-lexend font-bold text-[#22c55e] text-lg relative inline-block mx-auto cursor-pointer after:content-[''] after:absolute after:bottom-[-2px] after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#22c55e] hover:after:bg-[#0e5e3b] hover:after:w-full after:transition-all after:duration-300 hover:text-[#0e5e3b] hover:scale-[1.04] transition-all duration-300 origin-center">
                        {member.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1.5 line-clamp-1">
                        {member.role} {member.isExEmployee && <span className="text-gray-400 font-normal lowercase">(ex-employee)</span>}
                      </p>
                    </div>
                  </div>

                  {/* Social Links inside Card - Always visible, falls back to homepage redirect */}
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="flex gap-2 justify-center pb-5 px-5 pt-2 mt-auto border-t border-slate-50/60"
                  >
                    <a 
                      href={getSocialLink(member.socials.facebook)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#1a8b4c] hover:text-white hover:border-[#1a8b4c] transition-all duration-200"
                      title={`${member.name} on Facebook`}
                    >
                      <Facebook size={13} />
                    </a>
                    <a 
                      href={getSocialLink(member.socials.instagram)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#1a8b4c] hover:text-white hover:border-[#1a8b4c] transition-all duration-200"
                      title={`${member.name} on Instagram`}
                    >
                      <Instagram size={13} />
                    </a>
                    <a 
                      href={getSocialLink(member.socials.linkedin)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#1a8b4c] hover:text-white hover:border-[#1a8b4c] transition-all duration-200"
                      title={`${member.name} on LinkedIn`}
                    >
                      <Linkedin size={13} />
                    </a>
                    <a 
                      href={getSocialLink(member.socials.twitter)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#1a8b4c] hover:text-white hover:border-[#1a8b4c] transition-all duration-200"
                      title={`${member.name} on Twitter`}
                    >
                      <Twitter size={13} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Qualifications Modal Popup */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Dark Backdrop */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <m.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative bg-white rounded-[32px] shadow-2xl border border-slate-100 w-full max-w-3xl overflow-hidden z-10 max-h-[92vh] overflow-y-auto"
            >
              {/* Close Button: Green X in White Circle */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white border border-slate-100 text-emerald-500 hover:bg-slate-50 flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95 z-50"
                aria-label="Close modal"
              >
                <X size={18} strokeWidth={2.5} />
              </button>

              <div className="p-6 md:p-8 flex flex-col md:grid md:grid-cols-12 gap-8 items-stretch">
                {/* Left Column: Picture, Name, Role, Socials */}
                <div className="md:col-span-5 flex flex-col items-center text-center">
                  <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-[24px] overflow-hidden shadow-lg border border-slate-100/50 bg-slate-50 mt-4 md:mt-2">
                    <Image
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <h3 className="font-lexend font-black text-gray-900 text-2xl mt-5 leading-tight">
                    {selectedMember.name}
                  </h3>
                  <p className="font-bold text-emerald-600 tracking-wider uppercase text-xs mt-1.5">
                    {selectedMember.role}
                  </p>

                  {/* Filled Green Circle Socials */}
                  <div className="flex gap-2.5 justify-center mt-5">
                    <a 
                      href={getSocialLink(selectedMember.socials.facebook)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white flex items-center justify-center shadow-sm hover:shadow transition-all transform hover:-translate-y-0.5"
                      title="Facebook"
                    >
                      <Facebook size={16} className="fill-current text-white" />
                    </a>
                    <a 
                      href={getSocialLink(selectedMember.socials.instagram)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white flex items-center justify-center shadow-sm hover:shadow transition-all transform hover:-translate-y-0.5"
                      title="Instagram"
                    >
                      <Instagram size={16} />
                    </a>
                    <a 
                      href={getSocialLink(selectedMember.socials.linkedin)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white flex items-center justify-center shadow-sm hover:shadow transition-all transform hover:-translate-y-0.5"
                      title="LinkedIn"
                    >
                      <Linkedin size={16} className="fill-current text-white" />
                    </a>
                    <a 
                      href={getSocialLink(selectedMember.socials.twitter)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white flex items-center justify-center shadow-sm hover:shadow transition-all transform hover:-translate-y-0.5"
                      title="Twitter"
                    >
                      <Twitter size={16} className="fill-current text-white" />
                    </a>
                  </div>
                </div>

                {/* Right Column: Qualifications details */}
                <div className="md:col-span-7 flex flex-col justify-between">
                  <div className="bg-[#f4fbf7]/60 border border-emerald-500/5 rounded-3xl p-5 sm:p-6 h-full flex flex-col justify-start">
                    {/* Header */}
                    <div className="flex items-center gap-2 text-[#0e5e3b] font-lexend font-bold text-[17px] mb-5 border-b border-emerald-500/10 pb-3">
                      <GraduationCap size={20} />
                      <span>Education & Qualifications</span>
                    </div>

                    {/* Degree & Experience Side-by-side */}
                    <div className="grid grid-cols-1 gap-4.5 mb-5">
                      {/* Degree */}
                      <div className="border-l-4 border-[#22c55e] pl-3 py-0.5">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">
                          Highest Degree
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {selectedMember.education || 'N/A'}
                        </p>
                      </div>

                      {/* Experience */}
                      <div className="border-l-4 border-blue-500 pl-3 py-0.5">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">
                          Experience
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {selectedMember.experience || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Bio text */}
                    <div className="text-gray-600 leading-relaxed text-[13.5px] sm:text-[14px]">
                      {selectedMember.bio}
                    </div>
                  </div>
                </div>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
