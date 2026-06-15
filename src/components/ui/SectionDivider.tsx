"use client";

import React from 'react';
import { m } from 'framer-motion';

export const SectionDivider = () => {
  return (
    <div className="relative w-full h-24 overflow-hidden pointer-events-none -my-12 z-20">
      {/* Soft Green Glow that "bleeds" from one section to the next */}
      <m.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-green-100/30 to-transparent blur-[40px]"
      />
      
      {/* Optional: A very thin, elegant line */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-green-200/50 to-transparent" />
    </div>
  );
};
