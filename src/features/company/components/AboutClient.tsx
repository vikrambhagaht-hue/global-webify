"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, Star, FolderKanban, PhoneCall, Target, Eye, Heart, Sparkles, Shield, Zap, Globe, Code, TrendingUp, Award, Users, Rocket, ArrowRight, ChevronRight, Building2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

/* ─── Animated Counter ─── */
interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

const Counter: React.FC<CounterProps> = ({ value, suffix = "", duration = 1500 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView || !ref.current) return;
    let start = 0;
    if (value > 1000) start = value - 150;
    const end = value;
    if (start === end) {
      ref.current.textContent = `${end}${suffix}`;
      return;
    }
    let startTimestamp: number | null = null;
    let animationFrameId: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(start + (end - start) * easeProgress);
      
      if (ref.current) {
        ref.current.textContent = `${currentCount}${suffix}`;
      }

      if (progress < 1) animationFrameId = requestAnimationFrame(step);
      else if (ref.current) ref.current.textContent = `${end}${suffix}`;
    };
    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, value, duration, suffix]);

  return <span ref={ref} className="tabular-nums">0{suffix}</span>;
};

export default function AboutClient() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };
  const scaleIn = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  };

  const services = [
    { icon: Code, title: "Website Design & Development", desc: "Modern, responsive, and conversion-focused websites", bg: "bg-gradient-to-br from-emerald-500 to-teal-600", iconBg: "bg-emerald-400/30" },
    { icon: TrendingUp, title: "Search Engine Optimisation (SEO)", desc: "Improve rankings, visibility, and organic growth", bg: "bg-gradient-to-br from-violet-500 to-purple-600", iconBg: "bg-violet-400/30" },
    { icon: Zap, title: "Pay-Per-Click (PPC) Advertising", desc: "Generate high-quality leads with targeted campaigns", bg: "bg-gradient-to-br from-amber-500 to-orange-600", iconBg: "bg-amber-400/30" },
    { icon: Sparkles, title: "Branding & Identity Design", desc: "Build a strong, consistent, and memorable brand", bg: "bg-gradient-to-br from-rose-500 to-pink-600", iconBg: "bg-rose-400/30" },
    { icon: Rocket, title: "Lead Generation & Performance Marketing", desc: "Turn visitors into customers with data-driven campaigns", bg: "bg-gradient-to-br from-teal-500 to-emerald-600", iconBg: "bg-teal-400/30" },
    { icon: Shield, title: "CRM Software Development", desc: "Streamline customer management and automate workflows", bg: "bg-gradient-to-br from-teal-500 to-emerald-600", iconBg: "bg-teal-400/30" },
  ];

  const trustPoints = [
    "Over 10+ years of industry experience",
    "Transparent processes and honest communication",
    "Customized strategies, not one-size-fits-all plans",
    "Proven results across multiple industries",
    "Dedicated support and long-term partnerships"
  ];

  return (
    <div className="overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════
          HERO — Rich gradient, immersive feel
      ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-12 md:pt-16 pb-20 md:pb-28 bg-[#1a8b4c] text-white">
        {/* Liquid blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none transform-gpu z-0">
          <div className="absolute -top-[15%] -right-[10%] w-[50vw] max-w-[600px] aspect-square rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-emerald-400/20 via-green-500/5 to-transparent animate-float-1" />
          <div className="absolute top-[50%] -left-[10%] w-[40vw] max-w-[500px] aspect-square rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-teal-400/15 via-emerald-300/5 to-transparent animate-float-2" />
          <div className="absolute -bottom-[15%] right-[15%] w-[30vw] max-w-[400px] aspect-square rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-green-400/15 via-emerald-400/5 to-transparent animate-float-3" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.06]">
          <svg width="100%" height="100%"><defs><pattern id="hGrid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs><rect width="100%" height="100%" fill="url(#hGrid)" /></svg>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none transform-gpu">
          {[
            { s: 5, x: '15%', y: '25%', d: 0 },
            { s: 3, x: '80%', y: '20%', d: 1 },
            { s: 4, x: '60%', y: '65%', d: 1.8 },
            { s: 6, x: '30%', y: '70%', d: 0.6 },
            { s: 3, x: '50%', y: '40%', d: 2.5 },
          ].map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/20"
              style={{ width: p.s, height: p.s, left: p.x, top: p.y }}
              animate={{ y: [0, -25, 0], opacity: [0.15, 0.5, 0.15] }}
              transition={{ duration: 3 + i * 0.8, repeat: Infinity, ease: "easeInOut", delay: p.d }}
            />
          ))}
        </div>

        <div className="container-custom relative z-10">
          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center justify-center gap-2 mb-6">
            <Link href="/" className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/50" />
            <span className="text-white font-semibold text-sm">About Us</span>
          </motion.div>

          <div className="text-center max-w-4xl mx-auto">
            {/* Eyebrow */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-white">Since 2015 • End-to-End Digital Solutions</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl sm:text-5xl md:text-7xl font-black font-lexend text-white mb-7 tracking-tight leading-[1.05]">
              About{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-100 to-white">Global Webify</span>
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }} className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-medium mb-14">
              From high-performance websites to data-driven marketing — Global Webify transforms businesses into digital powerhouses.
            </motion.p>

            {/* Hero Stats */}
            <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7 }} className="grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
              {[
                { label: 'Projects Delivered', value: 500, suffix: '+', color: 'from-white to-green-100' },
                { label: 'Happy Clients', value: 500, suffix: '+', color: 'from-white to-green-100' },
                { label: 'Years Experience', value: 10, suffix: '+', color: 'from-white to-green-100' },
              ].map((stat, i) => (
                <div key={i} className="group relative bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl px-3 sm:px-5 py-6 shadow-sm hover:border-white/40 hover:bg-white/15 transition-all duration-500 transform-gpu">
                  <div className={`text-2xl sm:text-3xl md:text-4xl font-black font-lexend text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[10px] sm:text-xs text-white/80 font-bold mt-2 uppercase tracking-[0.12em]">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom blend */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f8fafc] to-transparent z-10" />
      </section>

         <section className="pt-10 md:pt-14 pb-10 md:pb-14 relative" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none transform-gpu">
          <div className="absolute -top-20 right-0 w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-emerald-400/15 to-transparent" />
          <div className="absolute bottom-0 -left-20 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-teal-400/10 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-green-300/10 to-transparent" />
        </div>

        <div className="container-custom relative z-10">
          {/* Section Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14 md:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-xs font-bold uppercase tracking-[0.15em] text-emerald-700 mb-5">
              <Globe className="w-3.5 h-3.5" />
              Our Story
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold font-lexend text-slate-900 tracking-tight leading-tight">
              Transforming Ideas Into<br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600">Digital Reality</span>
            </h2>
          </motion.div>

          {/* ── Bento Grid Layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Bento: Main intro card — spans 2 cols */}
            <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="lg:col-span-2 relative overflow-hidden rounded-3xl p-8 md:p-10 border border-slate-200 bg-slate-100 shadow-sm">
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-white/40 to-transparent rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-400/10 to-transparent" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a8b4c] to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold font-lexend text-slate-900">About Global Webify</h3>
                </div>
                <p className="text-slate-700 text-base md:text-lg leading-relaxed mb-4">
                  At <span className="font-bold text-slate-900">Global Webify</span>, we believe that a strong digital presence is not a luxury—it&apos;s a necessity for business growth. Since <span className="text-[#1a8b4c] font-bold">2015</span>, we have been helping businesses across India and beyond build powerful brands, create high-performing websites, and achieve measurable results.
                </p>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                  Our team combines deep technical expertise with creative problem-solving. Whether it&apos;s developing a scalable e-commerce platform, designing a corporate identity, or launching a targeted marketing campaign, we are committed to delivering excellence at every step.
                </p>
              </div>
            </motion.div>

            {/* Bento: Stats stack */}
            <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col gap-5 lg:col-span-1">
              <div className="relative overflow-hidden rounded-3xl p-7 flex-1 bg-gradient-to-br from-emerald-600 to-green-700 shadow-lg">
                <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-bl-full" />
                <div className="relative z-10">
                  <p className="text-4xl md:text-5xl font-black text-white font-lexend mb-1"><Counter value={2015} /></p>
                  <p className="text-xs font-bold text-emerald-200/80 uppercase tracking-[0.12em]">Established</p>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-3xl p-7 flex-1 bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg border border-slate-700">
                <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-bl-full" />
                <div className="relative z-10">
                  <p className="text-4xl md:text-5xl font-black text-white font-lexend mb-1"><Counter value={100} suffix="%" /></p>
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-[0.12em]">Client Focused</p>
                </div>
              </div>
            </motion.div>

            {/* Bento: Who We Are — spans 2 cols */}
            <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }} className="lg:col-span-2 relative overflow-hidden rounded-3xl p-8 md:p-10 bg-gradient-to-br from-slate-50 via-white to-gray-50 border border-slate-200/60 shadow-lg shadow-slate-200/30">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-slate-200/25 to-transparent rounded-bl-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a8b4c] to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold font-lexend text-slate-900">Who We Are</h3>
                </div>
                <div className="space-y-3 text-slate-600 leading-relaxed text-[15px] md:text-base">
                  <p>
                    Global Webify is a full-service digital marketing, web development, and web designing company built on trust, innovation, and performance. Over the years, we have earned our reputation as one of the <span className="font-bold text-slate-800">Top 5 Best Web Development Company in Ranchi, Jharkhand</span> by consistently delivering results-focused solutions tailored to each client&apos;s business goals.
                  </p>
                  <p>
                    Our team consists of experienced strategists, designers, developers, and digital marketers who work collaboratively to create impactful digital experiences.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Bento: Trust — right col */}
            <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="relative overflow-hidden rounded-3xl p-7 md:p-8 bg-white border border-gray-200 shadow-sm">
              <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-white/8 to-transparent rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-400/10 to-transparent" />
              <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Award className="w-4 h-4 text-amber-900" />
                  </div>
                  <h3 className="text-base font-bold font-lexend text-slate-900">Why Clients Trust Us</h3>
                </div>
                <div className="space-y-2">
                  {trustPoints.map((item, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.06 * idx }} className="flex items-center gap-2.5">
                      <div className="w-4.5 h-4.5 rounded-full bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={11} className="text-emerald-400" />
                      </div>
                      <span className="text-[13px] text-slate-600 font-medium leading-snug">{item}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs font-semibold text-slate-500">
                    We measure success by the <span className="text-[#1a8b4c]">growth our clients achieve</span>.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          OUR EXPERTISE — Own dark section with gradient cards
      ═══════════════════════════════════════════════════ */}
      <section className="pt-14 md:pt-20 pb-16 md:pb-24 relative overflow-hidden bg-white">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none transform-gpu">
          <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-emerald-500/10 to-transparent" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-teal-500/10 to-transparent" />
          <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-green-500/8 to-transparent" />
        </div>
        {/* Grid overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]">
          <svg width="100%" height="100%"><defs><pattern id="sGrid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs><rect width="100%" height="100%" fill="url(#sGrid)" /></svg>
        </div>

        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 md:mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-bold uppercase tracking-[0.15em] text-emerald-700 mb-5">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              What We Do
            </span>
            <h3 className="text-2xl md:text-4xl font-extrabold font-lexend text-slate-900">Our Expertise & Services</h3>
            <p className="text-slate-600 text-sm md:text-base mt-3 max-w-2xl mx-auto">
              End-to-end digital solutions designed to solve real business challenges like low traffic, poor conversions, and weak online presence.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {services.map((svc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }} className="group h-full hover:-translate-y-1.5 transition-transform duration-300 transform-gpu"
              >
                <div className="relative overflow-hidden rounded-[28px] bg-white border border-emerald-100 transition-all duration-500 h-full transform-gpu shadow-xl shadow-emerald-900/5">
                  {/* Liquid glow fading in the background */}
                  <div className={`absolute top-[-20%] right-[-10%] w-[180px] h-[180px] rounded-full ${svc.bg} opacity-15 blur-[60px] transition-opacity duration-700 pointer-events-none`} />
                  <div className={`absolute bottom-[-10%] left-[-10%] w-[140px] h-[140px] rounded-full ${svc.bg} opacity-10 blur-[50px] transition-opacity duration-700 pointer-events-none`} />
                  
                  {/* Subtle glass reflection line */}
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-100 transition-opacity duration-700" />
                  
                  <div className="relative z-10 p-7 md:p-8 flex flex-col h-full items-center text-center">
                    {/* Icon */}
                    <div className="relative w-14 h-14 mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                      <div className={`absolute inset-0 rounded-2xl ${svc.bg} shadow-lg z-10 flex items-center justify-center transform-gpu`}>
                        <svc.icon className="w-6 h-6 text-white drop-shadow-md" size={24} />
                      </div>
                      <div className={`absolute inset-0 rounded-2xl ${svc.bg} opacity-30 blur-md pointer-events-none`} />
                    </div>
                    
                    {/* Title */}
                    <h4 className="font-bold text-slate-900 text-lg md:text-xl mb-3 leading-snug font-lexend transition-all duration-300">
                      {svc.title}
                    </h4>
                    
                    {/* Description */}
                    <p className="text-sm text-slate-600 leading-relaxed">{svc.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Callout bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-10">
            <div className="relative overflow-hidden rounded-2xl p-6 bg-slate-900/[0.06] backdrop-blur-sm border border-slate-900/10">
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm md:text-base font-medium text-slate-600 italic">
                  <TrendingUp className="w-4 h-4 text-emerald-600 inline mr-2 -mt-0.5" />
                  Every service we offer is backed by strategy, analytics, and a clear focus on ROI.
                </p>
                <Link href="/contact" className="shrink-0 inline-flex items-center gap-2 bg-white border border-slate-200 text-emerald-700 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 hover:border-emerald-400/50 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 transform-gpu">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          MISSION & VISION
      ═══════════════════════════════════════════════════ */}
      <section id="vision" className="py-16 md:py-24 relative bg-slate-50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none transform-gpu">
          <div className="absolute top-20 right-0 w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-rose-400/20 to-transparent" />
          <div className="absolute bottom-20 left-0 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-teal-400/20 to-transparent" />
        </div>
        <div className="container-custom relative z-10 space-y-12 md:space-y-16">

          {/* ── Mission ── */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative overflow-hidden rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-sm bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/40 border border-blue-100/60">
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-white/8 via-transparent to-transparent rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-52 h-52 bg-gradient-to-tr from-green-300/10 via-transparent to-transparent" />

              <div className="space-y-6 pt-2 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Target size={22} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-lexend text-slate-900">Our Mission</h3>
                </div>
                <p className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed">
                  Our mission is to empower businesses with innovative digital solutions that drive growth and success. We aim to deliver high-quality web designing, CRM solutions, web development, SEO, and marketing services that enhance brand visibility, improve performance, and create lasting value for clients through creativity, technology, and result-driven strategies.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  {[{ val: 500, sfx: '+', lbl: 'Projects Delivered' }, { val: 98, sfx: '%', lbl: 'Client Satisfaction' }].map((s, i) => (
                    <div key={i} className="bg-white/60 backdrop-blur-sm border border-white p-5 rounded-2xl text-center hover:bg-white shadow-sm transition-colors duration-300">
                      <p className="text-2xl sm:text-3xl font-black text-slate-900 font-lexend mb-1"><Counter value={s.val} suffix={s.sfx} /></p>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-[0.12em]">{s.lbl}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Mission Image */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative rounded-3xl overflow-hidden shadow-2xl shadow-green-900/10 border border-green-100/40 group hover:-translate-y-1.5 transition-transform duration-300 transform-gpu">
              <div className="absolute top-4 right-4 bg-gradient-to-br from-rose-500 to-pink-600 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30 z-10">
                <Heart size={16} className="fill-white text-white" />
              </div>
              <div className="relative aspect-[3/2] w-full overflow-hidden h-full min-h-[300px]">
                <Image src="/Aboutus/our-mission.jpeg" alt="Global Webify Mission" fill quality={85} priority className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          </div>

          {/* ── Vision ── */}
          <div id="vision-card" className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* Vision Image */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200/40 order-first lg:order-none group hover:-translate-y-1.5 transition-transform duration-300 transform-gpu">
              <div className="absolute top-4 right-4 bg-gradient-to-br from-amber-500 to-orange-500 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 z-10">
                <Star size={16} className="fill-white text-white" />
              </div>
              <div className="relative aspect-[3/2] w-full overflow-hidden h-full min-h-[300px]">
                <Image src="/Aboutus/our-vision.png" alt="Global Webify Vision" fill quality={85} priority className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>

            {/* Vision Text — Warm gradient card */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative overflow-hidden rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/30 border border-emerald-100/50">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-slate-200/30 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-green-200/20 via-transparent to-transparent" />

              <div className="space-y-6 pt-2 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <Eye size={22} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-lexend text-slate-900">Our Vision</h3>
                </div>
                <p className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed">
                  Global Webify, founded by Mr. Vikram Bhagat (Co-Founder and CEO) and Mr. Shakti Singh (Co-Founder & CTO), envisions empowering startups, SMEs, corporations, and non-profits to build a strong digital identity. We help businesses move beyond third-party platforms and grow through their own websites, enhancing visibility, generating quality leads, and achieving long-term digital success.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  {[
                    { val: 10, sfx: '+', lbl: 'Years Experience', grad: 'from-slate-700 to-slate-800' },
                    { val: 500, sfx: '+', lbl: 'Happy Clients', grad: 'from-emerald-500 to-teal-600' },
                  ].map((s, i) => (
                    <div key={i} className={`bg-gradient-to-br ${s.grad} p-5 rounded-2xl text-center shadow-lg`}>
                      <p className="text-2xl sm:text-3xl font-black text-white font-lexend mb-1"><Counter value={s.val} suffix={s.sfx} /></p>
                      <p className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-[0.12em]">{s.lbl}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          LEADERSHIP — Colorful accent cards
      ═══════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #022c22 0%, #064e3b 50%, #022c22 100%)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none transform-gpu">
          <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-emerald-500/10 to-transparent" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-teal-500/10 to-transparent" />
        </div>
        {/* Grid overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]">
          <svg width="100%" height="100%"><defs><pattern id="lGrid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs><rect width="100%" height="100%" fill="url(#lGrid)" /></svg>
        </div>

        <div className="container-custom relative z-10 space-y-10 md:space-y-16">
          <div className="text-center max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-xs font-bold uppercase tracking-[0.15em] text-emerald-300 mb-5 backdrop-blur-sm">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                Global Webify Leaders
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold font-lexend text-white mb-4 tracking-tight">Our Leadership Team</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-rose-400 mx-auto mb-6 rounded-full" />
              <p className="text-emerald-100/70 text-sm md:text-base leading-relaxed">
                Meet the visionaries guiding Global Webify&apos;s mission to drive digital growth and deliver excellence.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {[
              {
                name: "Vikram Bhagat", role: "Co-Founder & CEO",
                image: "/Aboutus/vikrambhagatsir.jpeg", alt: "Vikram Bhagat - Co-Founder & CEO",
                desc: "Vikram Bhagat brings strong leadership and entrepreneurial vision to Global Webify. As Co-Founder and CEO, he drives the company's overall strategy, growth, and client success. With a sharp business acumen and a commitment to innovation, Vikram has been instrumental in shaping Global Webify's journey from a dynamic startup to a trusted digital solutions provider.",
                pills: ["Strategic Leadership", "Brand Building"],
                roleGrad: "from-amber-400 to-orange-500", cardAccent: "from-[#d2ea23]/10 via-transparent to-transparent",
              },
              {
                name: "Shakti Singh", role: "Co-Founder & CTO",
                image: "/Aboutus/ShaktiSir.avif", alt: "Shakti Singh - Co-Founder & CTO",
                desc: "Shakti Singh brings intensive technical expertise and strategic vision to Global Webify. With a deep understanding of emerging technologies and a passion for innovation, he leads the company's technical initiatives and product development. His expertise in full-stack development, cloud architecture, and digital transformation has been instrumental in delivering cutting-edge solutions to clients.",
                pills: ["Technical Excellence", "Innovation Leader"],
                roleGrad: "from-teal-400 to-emerald-500", cardAccent: "from-[#d2ea23]/10 via-transparent to-transparent",
              },
              {
                name: "Abhishek Kumar", role: "Center Head",
                image: "/Aboutus/Abhishek-Sir.avif", alt: "Abhishek Kumar - Center Head",
                desc: "Abhishek Kumar brings dedicated leadership and operational excellence to Global Webify. As Center Head, he oversees day-to-day operations, team management, and client delivery, ensuring smooth functioning across all verticals. With a strong focus on efficiency, collaboration, and service quality, Abhishek plays a key role in aligning business objectives with execution, leveraging his deep expertise from tenure at leading firms such as Accenture, Cognizant, and Wipro.",
                pills: ["Team Leadership", "Business Alignment"],
                roleGrad: "from-rose-400 to-pink-500", cardAccent: "from-[#d2ea23]/10 via-transparent to-transparent",
              },
            ].map((leader, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.7 }} className="w-full group">
                <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-b from-emerald-800/40 to-emerald-900/60 backdrop-blur-md border border-emerald-400/[0.15] hover:border-emerald-400/50 transition-all duration-500 h-full flex flex-col hover:-translate-y-1 transform-gpu shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-emerald-400/20">
                  {/* Colored accent glow */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${leader.cardAccent} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                  {/* Image */}
                  <div className="relative h-[280px] sm:h-[320px] w-full overflow-hidden shrink-0 bg-emerald-950">
                    <Image src={leader.image} alt={leader.alt} fill className="object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                  </div>

                  {/* Content */}
                  <div className="relative p-7 md:p-8 z-20 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[20px] font-bold font-lexend text-white tracking-tight">{leader.name}</h3>
                        
                        {/* Liquid Glassmorphism Badge */}
                        <div className="relative group/badge">
                          <div className={`absolute inset-0 bg-gradient-to-r ${leader.roleGrad} opacity-40 blur-md rounded-full pointer-events-none transition-opacity duration-500 group-hover:opacity-70`} />
                          <span className="relative bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-sm flex items-center justify-center whitespace-nowrap">
                            {leader.role}
                          </span>
                        </div>
                      </div>
                      <p className="text-emerald-50/70 text-[13px] font-light leading-[1.8] mb-6 group-hover:text-white transition-colors duration-500">
                        {leader.desc}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {leader.pills.map((pill, pi) => (
                        <span key={pi} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-900/50 border border-emerald-500/20 text-[11px] font-medium text-emerald-100/80 hover:bg-emerald-800/60 transition-colors duration-300">
                          {pi === 0 && <Star size={11} className="text-amber-400 fill-amber-400" />}
                          {pill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          CERTIFICATIONS
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-slate-100">
        {/* Holographic Glowing Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none transform-gpu">
          <div className="absolute top-[-15%] right-[5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-teal-400/20 to-transparent" />
          <div className="absolute bottom-[-10%] left-[5%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-emerald-400/20 to-transparent" />
          <div className="absolute top-[30%] left-[40%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-violet-400/15 to-transparent" />
        </div>
        
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
          <svg width="100%" height="100%"><defs><pattern id="cGrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0f172a" strokeWidth="1" /></pattern></defs><rect width="100%" height="100%" fill="url(#cGrid)" /></svg>
        </div>

        <div className="container-custom relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            
            {/* Left side: Premium Text Card */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="w-full lg:w-1/2">
              <div className="relative rounded-[32px] p-8 md:p-12 bg-white/50 backdrop-blur-lg border border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-teal-100/50 transition-shadow duration-500 transform-gpu">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-100/60 to-transparent rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-100/60 to-transparent rounded-tr-full" />
                
                <div className="relative z-10">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-teal-100 text-xs font-bold uppercase tracking-[0.15em] text-teal-600 mb-6 shadow-sm">
                    <Shield className="w-4 h-4 text-teal-500" />
                    Accredited & Trusted
                  </span>
                  
                  <h2 className="text-3xl md:text-5xl font-black font-lexend text-slate-900 mb-6 leading-tight tracking-tight">
                    Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600">Certifications</span>
                  </h2>
                  
                  <div className="space-y-4 text-slate-600 text-sm md:text-[15px] leading-relaxed">
                    <p>At Global Webify, our certifications reflect our unwavering commitment to quality, security, and professional excellence. We are officially registered with the Ministry of Corporate Affairs and recognized under MSME Udyam.</p>
                    <p>With a valid GST Registration and Import & Export Code (IEC), we operate confidently and transparently across both domestic and global markets.</p>
                    <p>We are internationally certified with <strong>ISO 27001:2022</strong> (Information Security) and <strong>ISO 9001:2015</strong> (Quality Management), accredited by London Cert Ltd.</p>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-slate-200/60">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      </div>
                      <p className="font-bold text-slate-800 text-sm leading-snug">
                        Proof that we follow the highest standards of security, quality, and compliance at every step of your project.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right side: Floating Certificates Grid */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5 w-full max-w-[450px] lg:max-w-[500px]">
                {[
                  { src: "/Certificate1.avif", alt: "Certificate of Registration" },
                  { src: "/Certificate2.avif", alt: "Import & Export Code (IEC)" },
                  { src: "/Certificate3.avif", alt: "GST Registration Certificate" },
                  { src: "/Certificate4.avif", alt: "MSME Udyam Registration" },
                  { src: "/Certificate5.avif", alt: "ISO 27001:2022 (Information Security)" },
                  { src: "/Certificate6.avif", alt: "ISO 9001:2015 (Quality Management)" },
                  { src: "/Certificate7.avif", alt: "Certificate of Registration of Firm" },
                ].map((cert, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                    whileInView={{ opacity: 1, scale: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ delay: index * 0.08, type: "spring", stiffness: 200, damping: 20 }}
                    whileHover={{ y: -8, scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }} 
                    className={`relative aspect-[1131/1600] w-full rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl hover:shadow-teal-500/20 border-2 border-white group transition-all duration-300 z-10 hover:z-20 transform-gpu ${index === 6 ? 'col-span-2 sm:col-span-1 sm:col-start-2 w-[60%] sm:w-full mx-auto' : ''}`}
                  >
                    <Image src={cert.src} alt={cert.alt} fill quality={90} className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 33vw, 20vw" />
                    
                    {/* Glass Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out pointer-events-none" />
                    
                    {/* Inner Shadow for depth */}
                    <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.05)] rounded-2xl pointer-events-none" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          PAYMENT PARTNERS
      ═══════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #1e293b 0%, #334155 100%)' }}>
        {/* Lime Green Background Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none transform-gpu">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-emerald-500/15 to-transparent" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-emerald-500/10 to-transparent" />
        </div>
        
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
          <svg width="100%" height="100%"><defs><pattern id="pGrid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs><rect width="100%" height="100%" fill="url(#pGrid)" /></svg>
        </div>

        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm text-xs font-bold uppercase tracking-[0.15em] text-emerald-400 mb-5 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
              <Shield className="w-3.5 h-3.5" />
              Secure Transactions
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-lexend text-white mb-4">Our Payment Partners</h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              We support secure, reliable, and convenient payment methods to facilitate both domestic and international transactions.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-6 w-full max-w-5xl mx-auto">
            {[
              { src: "/Razorpay.avif", alt: "Razorpay", label: "Razorpay" },
              { src: "/PhonePe.avif", alt: "PhonePe", label: "PhonePe" },
              { src: "/PayPal.avif", alt: "PayPal", label: "PayPal" },
              { src: "/BankOfBaroda.avif", alt: "Bank of Baroda", label: "Bank of Baroda" },
              { src: "/IndianOverseasBank.avif", alt: "Indian Overseas Bank", label: "IOB" },
            ].map((partner, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="group bg-white/[0.06] hover:bg-white/[0.08] rounded-[24px] p-5 border border-white/[0.08] hover:border-emerald-400/50 shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-emerald-400/20 transition-all duration-500 flex flex-col items-center justify-between text-center transform-gpu hover:-translate-y-1.5">
                {/* Logo White Box */}
                <div className="w-full bg-white rounded-xl p-3 shadow-inner flex items-center justify-center min-h-[75px] max-h-[85px] relative">
                  <Image src={partner.src} alt={partner.alt} width={130} height={50} quality={90} className="object-contain max-h-[50px] w-auto" />
                </div>
                {/* Text Label */}
                <div className="mt-4">
                  <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-400 transition-colors duration-300 block">{partner.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
