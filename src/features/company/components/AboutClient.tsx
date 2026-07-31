"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, Star, FolderKanban, PhoneCall, Target, Eye, Heart, Sparkles, Shield, Zap, Globe, Code, TrendingUp, Award, Users, Rocket, ArrowRight, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

/* ─── Animated Counter ─── */
interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

const Counter: React.FC<CounterProps> = ({ value, suffix = "", duration = 1500 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    if (value > 1000) start = value - 150;
    const end = value;
    if (start === end) { setCount(end); return; }
    let startTimestamp: number | null = null;
    let animationFrameId: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(start + (end - start) * easeProgress));
      if (progress < 1) animationFrameId = requestAnimationFrame(step);
      else setCount(end);
    };
    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, value, duration]);

  return <span ref={ref} className="tabular-nums">{count}{suffix}</span>;
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
    { icon: Code, title: "Website Design & Development", desc: "Modern, responsive, and conversion-focused websites", bg: "bg-gradient-to-br from-indigo-500 to-blue-600", iconBg: "bg-indigo-400/30" },
    { icon: TrendingUp, title: "Search Engine Optimisation (SEO)", desc: "Improve rankings, visibility, and organic growth", bg: "bg-gradient-to-br from-violet-500 to-purple-600", iconBg: "bg-violet-400/30" },
    { icon: Zap, title: "Pay-Per-Click (PPC) Advertising", desc: "Generate high-quality leads with targeted campaigns", bg: "bg-gradient-to-br from-amber-500 to-orange-600", iconBg: "bg-amber-400/30" },
    { icon: Sparkles, title: "Branding & Identity Design", desc: "Build a strong, consistent, and memorable brand", bg: "bg-gradient-to-br from-rose-500 to-pink-600", iconBg: "bg-rose-400/30" },
    { icon: Rocket, title: "Lead Generation & Performance Marketing", desc: "Turn visitors into customers with data-driven campaigns", bg: "bg-gradient-to-br from-teal-500 to-emerald-600", iconBg: "bg-teal-400/30" },
    { icon: Shield, title: "CRM Software Development", desc: "Streamline customer management and automate workflows", bg: "bg-gradient-to-br from-cyan-500 to-sky-600", iconBg: "bg-cyan-400/30" },
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
      <section className="relative overflow-hidden pt-12 md:pt-16 pb-20 md:pb-28" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #3730a3 50%, #4338ca 70%, #4f46e5 100%)' }}>
        {/* Liquid blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none transform-gpu z-0">
          <div className="absolute -top-[15%] -right-[10%] w-[50vw] max-w-[600px] aspect-square rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-violet-500/20 via-purple-500/5 to-transparent animate-float-1" />
          <div className="absolute top-[50%] -left-[10%] w-[40vw] max-w-[500px] aspect-square rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-sky-400/15 via-cyan-300/5 to-transparent animate-float-2" />
          <div className="absolute -bottom-[15%] right-[15%] w-[30vw] max-w-[400px] aspect-square rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-rose-500/15 via-pink-400/5 to-transparent animate-float-3" />
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
            <Link href="/" className="flex items-center gap-1.5 text-indigo-200/60 hover:text-white transition-colors text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-indigo-300/40" />
            <span className="text-white font-semibold text-sm">About Us</span>
          </motion.div>

          <div className="text-center max-w-4xl mx-auto">
            {/* Eyebrow */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-100/90">Since 2015 • End-to-End Digital Solutions</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl sm:text-5xl md:text-7xl font-black font-lexend text-white mb-7 tracking-tight leading-[1.05]">
              About{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">Global Webify</span>
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }} className="text-base sm:text-lg md:text-xl text-indigo-100/70 max-w-2xl mx-auto leading-relaxed font-medium mb-14">
              From high-performance websites to data-driven marketing — Global Webify transforms businesses into digital powerhouses.
            </motion.p>

            {/* Hero Stats */}
            <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7 }} className="grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
              {[
                { label: 'Projects Delivered', value: 500, suffix: '+', color: 'from-white to-white/70' },
                { label: 'Happy Clients', value: 500, suffix: '+', color: 'from-white to-white/70' },
                { label: 'Years Experience', value: 10, suffix: '+', color: 'from-white to-white/70' },
              ].map((stat, i) => (
                <div key={i} className="group relative bg-white/[0.07] backdrop-blur-md border border-white/[0.12] rounded-2xl px-3 sm:px-5 py-6 hover:bg-white/[0.12] hover:border-white/20 transition-all duration-500 transform-gpu">
                  <div className={`text-2xl sm:text-3xl md:text-4xl font-black font-lexend text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[10px] sm:text-xs text-indigo-200/50 font-bold mt-2 uppercase tracking-[0.12em]">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom blend */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f5f3ff] to-transparent z-10" />
      </section>

         <section className="pt-10 md:pt-14 pb-10 md:pb-14 relative" style={{ background: 'linear-gradient(180deg, #f5f3ff 0%, #ede9fe 100%)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none transform-gpu">
          <div className="absolute -top-20 right-0 w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-violet-400/20 to-transparent" />
          <div className="absolute bottom-0 -left-20 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-indigo-400/15 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-rose-300/10 to-transparent" />
        </div>

        <div className="container-custom relative z-10">
          {/* Section Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14 md:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-xs font-bold uppercase tracking-[0.15em] text-indigo-600 mb-5">
              <Globe className="w-3.5 h-3.5" />
              Our Story
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold font-lexend text-slate-900 tracking-tight leading-tight">
              Transforming Ideas Into<br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">Digital Reality</span>
            </h2>
          </motion.div>

          {/* ── Bento Grid Layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Bento: Main intro card — spans 2 cols */}
            <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="lg:col-span-2 relative overflow-hidden rounded-3xl p-8 md:p-10 border border-indigo-100/50 shadow-lg" style={{ background: 'linear-gradient(135deg, #312e81, #3730a3, #4338ca)' }}>
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-white/8 to-transparent rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-violet-400/10 to-transparent" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-200/70">About Global Webify</span>
                </div>
                <p className="text-white/90 text-base md:text-lg leading-relaxed mb-4">
                  At <span className="font-bold text-white">Global Webify</span>, we believe that a strong digital presence is not a luxury—it&apos;s a necessity for business growth. Since <span className="text-amber-300 font-bold">2015</span>, we have been helping businesses across India and beyond build powerful brands, create high-performing websites, and achieve measurable results.
                </p>
                <p className="text-indigo-100/70 text-base md:text-lg leading-relaxed">
                  Our team combines deep technical expertise with creative problem-solving. Whether it&apos;s developing a scalable e-commerce platform, designing a corporate identity, or launching a targeted marketing campaign, we are committed to delivering excellence at every step.
                </p>
              </div>
            </motion.div>

            {/* Bento: Stats stack */}
            <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col gap-5 lg:col-span-1">
              <div className="relative overflow-hidden rounded-3xl p-7 flex-1 bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
                <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-bl-full" />
                <div className="relative z-10">
                  <p className="text-4xl md:text-5xl font-black text-white font-lexend mb-1"><Counter value={2015} /></p>
                  <p className="text-xs font-bold text-violet-200/80 uppercase tracking-[0.12em]">Established</p>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-3xl p-7 flex-1 bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-bl-full" />
                <div className="relative z-10">
                  <p className="text-4xl md:text-5xl font-black text-white font-lexend mb-1"><Counter value={100} suffix="%" /></p>
                  <p className="text-xs font-bold text-amber-100/80 uppercase tracking-[0.12em]">Client Focused</p>
                </div>
              </div>
            </motion.div>

            {/* Bento: Who We Are — spans 2 cols */}
            <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }} className="lg:col-span-2 relative overflow-hidden rounded-3xl p-8 md:p-10 bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 border border-indigo-100/60 shadow-lg shadow-indigo-100/30">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-200/25 to-transparent rounded-bl-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
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
            <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="relative overflow-hidden rounded-3xl p-7 md:p-8" style={{ background: 'linear-gradient(145deg, #312e81 0%, #3730a3 40%, #4338ca 100%)' }}>
              <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-white/8 to-transparent rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-violet-400/10 to-transparent" />
              <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Award className="w-4 h-4 text-amber-900" />
                  </div>
                  <h3 className="text-base font-bold font-lexend text-white">Why Clients Trust Us</h3>
                </div>
                <div className="space-y-2">
                  {trustPoints.map((item, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.06 * idx }} className="flex items-center gap-2.5">
                      <div className="w-4.5 h-4.5 rounded-full bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={11} className="text-emerald-400" />
                      </div>
                      <span className="text-[13px] text-indigo-100/80 font-medium leading-snug">{item}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs font-semibold text-indigo-100/60">
                    We measure success by the <span className="text-amber-300">growth our clients achieve</span>.
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
      <section className="pt-14 md:pt-20 pb-16 md:pb-24 relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)' }}>
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none transform-gpu">
          <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-violet-500/15 to-transparent" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-indigo-500/15 to-transparent" />
          <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-rose-500/10 to-transparent" />
        </div>
        {/* Grid overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]">
          <svg width="100%" height="100%"><defs><pattern id="sGrid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs><rect width="100%" height="100%" fill="url(#sGrid)" /></svg>
        </div>

        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 md:mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm text-xs font-bold uppercase tracking-[0.15em] text-indigo-200 mb-5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              What We Do
            </span>
            <h3 className="text-2xl md:text-4xl font-extrabold font-lexend text-white">Our Expertise & Services</h3>
            <p className="text-indigo-200/60 text-sm md:text-base mt-3 max-w-2xl mx-auto">
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
                <div className="relative overflow-hidden rounded-[28px] bg-[#312e81]/70 backdrop-blur-lg border border-[#d2ea23]/30 hover:border-cyan-400/60 hover:bg-[#3730a3]/80 transition-all duration-500 h-full transform-gpu shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-cyan-400/20">
                  {/* Liquid glow fading in the background */}
                  <div className={`absolute top-[-20%] right-[-10%] w-[180px] h-[180px] rounded-full ${svc.bg} opacity-30 group-hover:opacity-50 blur-[60px] transition-opacity duration-700 pointer-events-none`} />
                  <div className={`absolute bottom-[-10%] left-[-10%] w-[140px] h-[140px] rounded-full ${svc.bg} opacity-15 group-hover:opacity-40 blur-[50px] transition-opacity duration-700 pointer-events-none`} />
                  
                  {/* Subtle glass reflection line */}
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="relative z-10 p-7 md:p-8 flex flex-col h-full items-center text-center">
                    {/* Icon */}
                    <div className="relative w-14 h-14 mb-6 mx-auto">
                      <div className="absolute inset-0 rounded-2xl bg-white/[0.08] border border-white/[0.15] backdrop-blur-md group-hover:scale-110 transition-transform duration-500 shadow-lg z-10 flex items-center justify-center transform-gpu">
                        <svc.icon className="w-6 h-6 text-white" size={24} />
                      </div>
                      <div className={`absolute inset-0 rounded-2xl ${svc.bg} opacity-40 blur-md group-hover:scale-110 group-hover:opacity-70 transition-all duration-500 pointer-events-none`} />
                    </div>
                    
                    {/* Title */}
                    <h4 className="font-bold text-white text-lg md:text-xl mb-3 leading-snug font-lexend group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/80 transition-all duration-300">
                      {svc.title}
                    </h4>
                    
                    {/* Description */}
                    <p className="text-sm text-indigo-100/60 leading-relaxed">{svc.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Callout bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-10">
            <div className="relative overflow-hidden rounded-2xl p-6 bg-white/[0.06] backdrop-blur-sm border border-white/10">
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm md:text-base font-medium text-indigo-100/70 italic">
                  <Sparkles className="w-4 h-4 text-amber-400 inline mr-2 -mt-0.5" />
                  Every service we offer is backed by strategy, analytics, and a clear focus on ROI.
                </p>
                <Link href="/contact" className="shrink-0 inline-flex items-center gap-2 bg-white/[0.05] backdrop-blur-sm border border-white/20 text-emerald-400 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-white/[0.12] hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all duration-300 hover:-translate-y-0.5 transform-gpu">
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
          <div className="absolute bottom-20 left-0 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-sky-400/20 to-transparent" />
        </div>
        <div className="container-custom relative z-10 space-y-12 md:space-y-16">

          {/* ── Mission ── */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative overflow-hidden rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl" style={{ background: 'linear-gradient(145deg, #312e81, #3730a3, #4f46e5)' }}>
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-white/8 via-transparent to-transparent rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-52 h-52 bg-gradient-to-tr from-violet-300/10 via-transparent to-transparent" />

              <div className="space-y-6 pt-2 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Target size={22} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-lexend text-white">Our Mission</h3>
                </div>
                <p className="text-indigo-100/75 font-medium text-sm sm:text-base leading-relaxed">
                  Our mission is to empower businesses with innovative digital solutions that drive growth and success. We aim to deliver high-quality web designing, CRM solutions, web development, SEO, and marketing services that enhance brand visibility, improve performance, and create lasting value for clients through creativity, technology, and result-driven strategies.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  {[{ val: 500, sfx: '+', lbl: 'Projects Delivered' }, { val: 98, sfx: '%', lbl: 'Client Satisfaction' }].map((s, i) => (
                    <div key={i} className="bg-white/10 border border-white/15 p-5 rounded-2xl text-center backdrop-blur-sm hover:bg-white/15 transition-colors duration-300">
                      <p className="text-2xl sm:text-3xl font-black text-white font-lexend mb-1"><Counter value={s.val} suffix={s.sfx} /></p>
                      <p className="text-[10px] sm:text-xs font-bold text-indigo-200/70 uppercase tracking-[0.12em]">{s.lbl}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Mission Image */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative rounded-3xl overflow-hidden shadow-2xl shadow-indigo-900/10 border border-indigo-100/40 group hover:-translate-y-1.5 transition-transform duration-300 transform-gpu">
              <div className="absolute top-4 right-4 bg-gradient-to-br from-rose-500 to-pink-600 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30 z-10">
                <Heart size={16} className="fill-white text-white" />
              </div>
              <div className="relative aspect-[3/2] w-full overflow-hidden h-full min-h-[300px]">
                <Image src="/Aboutus/our-mission.jpeg" alt="Global Webify Mission" fill quality={85} priority className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          </div>

          {/* ── Vision ── */}
          <div id="vision-card" className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* Vision Image */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative rounded-3xl overflow-hidden shadow-2xl shadow-indigo-900/10 border border-indigo-100/40 order-first lg:order-none group hover:-translate-y-1.5 transition-transform duration-300 transform-gpu">
              <div className="absolute top-4 right-4 bg-gradient-to-br from-amber-500 to-orange-500 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 z-10">
                <Star size={16} className="fill-white text-white" />
              </div>
              <div className="relative aspect-[3/2] w-full overflow-hidden h-full min-h-[300px]">
                <Image src="/Aboutus/our-vision.png" alt="Global Webify Vision" fill quality={85} priority className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>

            {/* Vision Text — Warm gradient card */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative overflow-hidden rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 border border-indigo-100/50">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-violet-200/30 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-sky-200/20 via-transparent to-transparent" />

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
                    { val: 10, sfx: '+', lbl: 'Years Experience', grad: 'from-indigo-500 to-violet-600' },
                    { val: 500, sfx: '+', lbl: 'Happy Clients', grad: 'from-emerald-500 to-teal-600' },
                  ].map((s, i) => (
                    <div key={i} className={`bg-gradient-to-br ${s.grad} p-5 rounded-2xl text-center shadow-lg`}>
                      <p className="text-2xl sm:text-3xl font-black text-white font-lexend mb-1"><Counter value={s.val} suffix={s.sfx} /></p>
                      <p className="text-[10px] sm:text-xs font-bold text-white/70 uppercase tracking-[0.12em]">{s.lbl}</p>
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
      <section className="py-16 md:py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none transform-gpu">
          <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-violet-500/15 to-transparent" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-indigo-500/15 to-transparent" />
        </div>
        {/* Grid overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]">
          <svg width="100%" height="100%"><defs><pattern id="lGrid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs><rect width="100%" height="100%" fill="url(#lGrid)" /></svg>
        </div>

        <div className="container-custom relative z-10 space-y-10 md:space-y-16">
          <div className="text-center max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold uppercase tracking-[0.15em] text-indigo-200 mb-5 backdrop-blur-sm">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                Global Webify Leaders
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold font-lexend text-white mb-4 tracking-tight">Our Leadership Team</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-rose-400 mx-auto mb-6 rounded-full" />
              <p className="text-indigo-200/60 text-sm md:text-base leading-relaxed">
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
                roleGrad: "from-sky-400 to-cyan-500", cardAccent: "from-[#d2ea23]/10 via-transparent to-transparent",
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
                <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-b from-[#3730a3]/60 to-[#1e1b4b]/80 backdrop-blur-md border border-white/[0.1] hover:border-[#d2ea23]/50 transition-all duration-500 h-full flex flex-col hover:-translate-y-1 transform-gpu shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-[#d2ea23]/10">
                  {/* Colored accent glow */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${leader.cardAccent} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                  {/* Image */}
                  <div className="relative h-[280px] sm:h-[320px] w-full overflow-hidden shrink-0 bg-[#1e1b4b]">
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
                      <p className="text-indigo-50/80 text-[13px] font-light leading-[1.8] mb-6 group-hover:text-white transition-colors duration-500">
                        {leader.desc}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {leader.pills.map((pill, pi) => (
                        <span key={pi} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.07] border border-white/[0.08] text-[11px] font-medium text-indigo-200/80 hover:bg-white/[0.12] transition-colors duration-300">
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
          <div className="absolute bottom-[-10%] left-[5%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-400/20 to-transparent" />
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
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-100/60 to-transparent rounded-tr-full" />
                
                <div className="relative z-10">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-teal-100 text-xs font-bold uppercase tracking-[0.15em] text-teal-600 mb-6 shadow-sm">
                    <Shield className="w-4 h-4 text-teal-500" />
                    Accredited & Trusted
                  </span>
                  
                  <h2 className="text-3xl md:text-5xl font-black font-lexend text-slate-900 mb-6 leading-tight tracking-tight">
                    Our <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-blue-600">Certifications</span>
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
      <section className="py-16 md:py-24 relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 100%)' }}>
        {/* Lime Green Background Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none transform-gpu">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-[#d2ea23]/15 to-transparent" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-[#d2ea23]/10 to-transparent" />
        </div>
        
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
          <svg width="100%" height="100%"><defs><pattern id="pGrid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs><rect width="100%" height="100%" fill="url(#pGrid)" /></svg>
        </div>

        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d2ea23]/10 border border-[#d2ea23]/20 backdrop-blur-sm text-xs font-bold uppercase tracking-[0.15em] text-[#d2ea23] mb-5 shadow-[0_0_15px_rgba(210,234,35,0.15)]">
              <Shield className="w-3.5 h-3.5" />
              Secure Transactions
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-lexend text-white mb-4">Our Payment Partners</h2>
            <p className="text-indigo-200/60 text-sm md:text-base leading-relaxed">
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
              <motion.div key={index} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="group bg-white/[0.06] hover:bg-white/[0.08] rounded-[24px] p-5 border border-white/[0.08] hover:border-[#d2ea23]/50 shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-[#d2ea23]/20 transition-all duration-500 flex flex-col items-center justify-between text-center transform-gpu hover:-translate-y-1.5">
                {/* Logo White Box */}
                <div className="w-full bg-white rounded-xl p-3 shadow-inner flex items-center justify-center min-h-[75px] max-h-[85px] relative">
                  <Image src={partner.src} alt={partner.alt} width={130} height={50} quality={90} className="object-contain max-h-[50px] w-auto" />
                </div>
                {/* Text Label */}
                <div className="mt-4">
                  <span className="text-xs font-bold text-indigo-100/60 group-hover:text-[#d2ea23] transition-colors duration-300 block">{partner.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
