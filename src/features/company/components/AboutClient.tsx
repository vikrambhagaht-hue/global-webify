"use client";

import React, { useEffect, useRef, useState } from 'react';
import { m, useInView } from 'framer-motion';
import { CheckCircle2, Star, FolderKanban, PhoneCall, Target, Eye, Heart, ArrowRight, Crown, Code2, Leaf } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
    if (value > 1000) {
      start = value - 150;
    }
    const end = value;
    
    if (start === end) {
      setCount(end);
      return;
    }

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutQuart for smooth deceleration
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      
      const nextVal = Math.floor(start + (end - start) * easeProgress);
      setCount(nextVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
};

export default function AboutClient() {
  // Fade-in animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="bg-[#f0f9f4]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#1a8b4c] pt-16 md:pt-20 pb-20 md:pb-28">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/[0.03] rounded-full" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-400/[0.06] rounded-full" />
        </div>

        <div className="container-custom relative z-10 text-center">
          {/* Breadcrumb */}
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-2 mb-8"
          >
            <Link href="/" className="flex items-center gap-1.5 text-emerald-200 hover:text-white transition-colors text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
              Home
            </Link>
            <span className="text-emerald-300/60">/</span>
            <span className="text-white font-semibold text-sm">About Us</span>
          </m.div>

          {/* Title */}
          <m.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-black font-lexend text-white mb-6 uppercase tracking-tight leading-[1.1]"
          >
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-green-300">Global Webify</span>
          </m.h1>

          {/* Divider */}
          <m.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-24 h-1.5 bg-gradient-to-r from-emerald-300 to-green-400 mx-auto mb-8 rounded-full origin-center"
          />

          {/* Subtitle */}
          <m.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-emerald-100/90 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            We help businesses grow online with custom web development, SEO, and digital marketing solutions.
          </m.p>

          {/* Stats Row */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-12"
          >
            {[
              { label: 'Projects Delivered', value: 500, suffix: '+' },
              { label: 'Happy Clients', value: 500, suffix: '+' },
              { label: 'Years Experience', value: 10, suffix: '+' },
            ].map((stat, i) => (
              <div key={i} className="text-center bg-[#22a15c] border-2 border-[#3bb573] rounded-2xl px-6 py-3 shadow-lg min-w-[160px]">
                <div className="text-2xl md:text-3xl font-black text-white">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[10px] text-emerald-50 font-bold mt-1 uppercase tracking-wider whitespace-nowrap">{stat.label}</div>
              </div>
            ))}
          </m.div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0,50 C360,80 720,20 1440,50 L1440,80 L0,80 Z" fill="#f0f9f4"/>
          </svg>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-12 md:py-16 bg-[#f0f9f4]">
        <div className="container-custom">
          {/* Centered Main Section Heading */}
          <m.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-extrabold font-lexend text-primary-dark tracking-wide uppercase leading-tight">
              Transforming Ideas Into Digital Reality
            </h2>
          </m.div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Rich Copy Content */}
            <m.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-7 space-y-8"
            >
              {/* Introduction Paragraphs */}
              <m.div variants={fadeInUp} className="space-y-4 text-gray-700 leading-relaxed text-sm md:text-base">
                <p>
                  At <span className="font-semibold text-gray-900">Global Webify</span>, we believe that a strong digital presence is not a luxury—it’s a necessity for business growth. Since 2015, we have been helping businesses across India and beyond build powerful brands, create high-performing websites, and achieve measurable results through strategic digital marketing.
                </p>
                <p>
                  With over two decades of industry experience, Global Webify has evolved alongside the digital landscape, adapting to new technologies, search algorithms, and user behaviors. Our focus has always remained the same: delivering value-driven solutions that help our clients grow, compete, and succeed online.
                </p>
              </m.div>

              {/* Who We Are */}
              <m.div variants={fadeInUp} className="space-y-3">
                <h3 className="text-xl md:text-2xl font-bold font-lexend text-primary-dark border-l-4 border-primary pl-3">
                  Who We Are
                </h3>
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm md:text-base">
                  <p>
                    Global Webify is a full-service digital marketing, web development, and web designing company built on trust, innovation, and performance. Over the years, we have earned our reputation as one of the <span className="font-bold text-primary-dark">Top 5 Best Web Development Company in Ranchi, Jharkhand</span> by consistently delivering results-focused solutions tailored to each client’s business goals.
                  </p>
                  <p>
                    Our team consists of experienced strategists, designers, developers, and digital marketers who work collaboratively to create impactful digital experiences.
                  </p>
                </div>
              </m.div>

              {/* Our Expertise & Services */}
              <m.div variants={fadeInUp} className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold font-lexend text-primary-dark border-l-4 border-primary pl-3">
                  Our Expertise & Services
                </h3>
                <p className="text-gray-700 text-sm md:text-base">
                  We offer end-to-end digital solutions designed to solve real business challenges such as low traffic, poor conversions, and weak online presence.
                </p>
                
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-gray-900 text-sm md:text-base">Our Core Services Include:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-primary shrink-0"><CheckCircle2 size={18} className="fill-primary-light" /></span>
                      <p className="text-sm md:text-base text-gray-700">
                        <strong className="text-gray-900 font-semibold">Website Design & Development</strong> – Modern, responsive, and conversion-focused websites
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-primary shrink-0"><CheckCircle2 size={18} className="fill-primary-light" /></span>
                      <p className="text-sm md:text-base text-gray-700">
                        <strong className="text-gray-900 font-semibold">Search Engine Optimisation (SEO)</strong> – Improve rankings, visibility, and organic growth
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-primary shrink-0"><CheckCircle2 size={18} className="fill-primary-light" /></span>
                      <p className="text-sm md:text-base text-gray-700">
                        <strong className="text-gray-900 font-semibold">Pay-Per-Click (PPC) Advertising</strong> – Generate high-quality leads with targeted campaigns
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-primary shrink-0"><CheckCircle2 size={18} className="fill-primary-light" /></span>
                      <p className="text-sm md:text-base text-gray-700">
                        <strong className="text-gray-900 font-semibold">Branding & Identity Design</strong> – Build a strong, consistent, and memorable brand
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-primary shrink-0"><CheckCircle2 size={18} className="fill-primary-light" /></span>
                      <p className="text-sm md:text-base text-gray-700">
                        <strong className="text-gray-900 font-semibold">Lead Generation & Performance Marketing</strong> – Turn visitors into customers
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-primary shrink-0"><CheckCircle2 size={18} className="fill-primary-light" /></span>
                      <p className="text-sm md:text-base text-gray-700">
                        <strong className="text-gray-900 font-semibold">CRM Software Development</strong> – Streamline customer management, automate workflows, and improve business relationships for better efficiency and growth
                      </p>
                    </li>
                  </ul>
                </div>

                {/* Callout Box */}
                <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-xl mt-4">
                  <p className="text-sm md:text-base font-medium text-primary-dark italic">
                    Every service we offer is backed by strategy, analytics, and a clear focus on ROI.
                  </p>
                </div>
              </m.div>

              {/* Why Clients Trust Global Webify */}
              <m.div variants={fadeInUp} className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold font-lexend text-primary-dark border-l-4 border-primary pl-3">
                  Why Clients Trust Global Webify
                </h3>
                <p className="text-gray-700 text-sm md:text-base">
                  Client trust is at the heart of everything we do. Businesses choose Global Webify because we offer more than just service: we deliver solutions.
                </p>

                <ul className="space-y-2.5 pl-1 pt-1">
                  {[
                    "Over 10+ years of industry experience",
                    "Transparent processes and honest communication",
                    "Customized strategies, not one-size-fits-all plans",
                    "Proven results across multiple industries",
                    "Dedicated support and long-term partnerships"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className="text-yellow-500 shrink-0"><Star size={16} className="fill-yellow-500" /></span>
                      <span className="text-sm md:text-base text-gray-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-sm md:text-base font-semibold text-gray-950 pt-2 border-t border-gray-100">
                  We measure success not just by rankings or traffic, but by the growth our clients achieve.
                </p>
              </m.div>

              {/* Action Buttons */}
              <m.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
                <Link 
                  href="/portfolio"
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 text-sm md:text-base"
                >
                  <FolderKanban size={18} />
                  Our Portfolio
                </Link>
                <Link 
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary hover:bg-primary/5 px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:-translate-y-0.5 text-sm md:text-base"
                >
                  <PhoneCall size={18} />
                  Contact Us
                </Link>
              </m.div>
            </m.div>

            {/* Right Column: Premium Visual & About1 Image (Reduced size, centered on mobile, right-aligned on desktop) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 w-full max-w-[420px] mx-auto lg:ml-auto lg:mr-0 h-max z-10">
              <m.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6 w-full"
              >
              {/* Premium Image Container with Framer Motion Hover Lift Effect */}
              <m.div 
                whileHover={{ y: -8, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="relative group rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-gray-100 bg-white"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden">
                  <Image 
                    src="/Aboutus/About1.avif" 
                    alt="Global Webify - We Are Your Digital Partner" 
                    fill
                    quality={85}
                    className="object-cover transition-transform duration-700 ease-out"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                  />
                </div>
              </m.div>

              {/* Premium Video Container with Hover Lift Effect */}
              <m.div 
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-gray-100 bg-white aspect-video"
              >
                <video 
                  src="/Aboutus/demo-about-video.mp4" 
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  controls
                  className="w-full h-full object-cover rounded-3xl absolute inset-0"
                />
              </m.div>

              {/* Accompanying Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-premium border border-gray-100 text-center hover-shadow-premium transition-all duration-300">
                  <p className="text-3xl font-black text-primary mb-1">
                    <Counter value={2015} />
                  </p>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Established</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-premium border border-gray-100 text-center hover-shadow-premium transition-all duration-300">
                  <p className="text-3xl font-black text-primary mb-1">
                    <Counter value={100} suffix="%" />
                  </p>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Client Focused</p>
                </div>
              </div>
              </m.div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section id="vision" className="py-12 md:py-16 bg-[#e8f5ee]">
        <div className="container-custom space-y-10 md:space-y-12">
          {/* Row 1: Our Mission */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
            {/* Mission Text Card */}
            <m.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#ff7e40] via-[#ff5b7f] to-[#b066fe] text-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 relative flex flex-col justify-between"
            >
              {/* Floating Target Badge */}
              <div className="absolute -top-5 left-6 lg:-left-5 bg-white text-[#ff5b7f] w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20 z-20">
                <Target size={24} />
              </div>

              <div className="space-y-6 pt-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold font-lexend text-white mt-2">
                  Our Mission
                </h3>
                <p className="text-white/95 text-sm sm:text-base leading-relaxed">
                  Our mission is to empower businesses with innovative digital solutions that drive growth and success. We aim to deliver high-quality web designing, CRM solutions, web development, SEO, and marketing services that enhance brand visibility, improve performance, and create lasting value for clients through creativity, technology, and result-driven strategies.
                </p>
                
                {/* Stats Container */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-white/10 border border-white/20 p-5 rounded-2xl text-center backdrop-blur-sm">
                    <p className="text-2xl sm:text-3xl font-black text-white font-lexend mb-1">
                      <Counter value={500} suffix="+" />
                    </p>
                    <p className="text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider">Projects Delivered</p>
                  </div>
                  <div className="bg-white/10 border border-white/20 p-5 rounded-2xl text-center backdrop-blur-sm">
                    <p className="text-2xl sm:text-3xl font-black text-white font-lexend mb-1">
                      <Counter value={98} suffix="%" />
                    </p>
                    <p className="text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider">Client Satisfaction</p>
                  </div>
                </div>
              </div>
            </m.div>

            {/* Mission Image Card */}
            <m.div 
              whileHover={{ y: -8, scale: 1.015 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-gray-100 bg-transparent"
            >
              {/* Red Heart Badge */}
              <div className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20 z-10">
                <Heart size={16} className="fill-white text-white" />
              </div>

              <div className="relative aspect-[3/2] w-full overflow-hidden h-full min-h-[300px]">
                <Image 
                  src="/Aboutus/our-mission.jpeg" 
                  alt="Global Webify Mission" 
                  fill
                  quality={85}
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </m.div>
          </div>

          {/* Row 2: Our Vision */}
          <div id="vision-card" className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch pt-8">
            {/* Vision Image Card */}
            <m.div 
              whileHover={{ y: -8, scale: 1.015 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-gray-100 bg-transparent order-first lg:order-none"
            >
              {/* Red Star Badge */}
              <div className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20 z-10">
                <Star size={16} className="fill-white text-white" />
              </div>

              <div className="relative aspect-[3/2] w-full overflow-hidden h-full min-h-[300px]">
                <Image 
                  src="/Aboutus/our-vision.png" 
                  alt="Global Webify Vision" 
                  fill
                  quality={85}
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </m.div>

            {/* Vision Text Card */}
            <m.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white via-[#f0f9f4] to-[#e2f3ea] text-slate-800 p-8 sm:p-10 rounded-3xl shadow-xl border border-emerald-100 relative flex flex-col justify-between"
            >
              {/* Floating Green Eye Badge */}
              <div className="absolute -top-5 left-6 lg:-left-5 bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 z-20">
                <Eye size={24} />
              </div>

              <div className="space-y-6 pt-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold font-lexend text-[#1a8b4c] mt-2">
                  Our Vision
                </h3>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  Global Webify, founded by Mr. Vikram Bhagat (Co-Founder and CEO) and Mr. Shakti Singh (Co-Founder & CTO), envisions empowering startups, SMEs, corporations, and non-profits to build a strong digital identity. We help businesses move beyond third-party platforms and grow through their own websites, enhancing visibility, generating quality leads, and achieving long-term digital success.
                </p>
                
                {/* Stats Container */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-white/70 border border-emerald-100 p-5 rounded-2xl text-center backdrop-blur-sm">
                    <p className="text-2xl sm:text-3xl font-black text-[#1a8b4c] font-lexend mb-1">
                      <Counter value={10} suffix="+" />
                    </p>
                    <p className="text-[10px] sm:text-xs font-bold text-emerald-700 uppercase tracking-wider">Years Experience</p>
                  </div>
                  <div className="bg-white/70 border border-emerald-100 p-5 rounded-2xl text-center backdrop-blur-sm">
                    <p className="text-2xl sm:text-3xl font-black text-[#1a8b4c] font-lexend mb-1">
                      <Counter value={500} suffix="+" />
                    </p>
                    <p className="text-[10px] sm:text-xs font-bold text-emerald-700 uppercase tracking-wider">Happy Clients</p>
                  </div>
                </div>
              </div>
            </m.div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-12 md:py-16 bg-[#f0f9f4]">
        <div className="container-custom space-y-10 md:space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-primary mb-2 block">
              Global Webify Leaders
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-lexend text-primary-dark mb-4">
              Our Leadership Team
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Meet the visionaries guiding Global Webify's mission to drive digital growth and deliver excellence.
            </p>
          </div>

          <div className="space-y-12 md:space-y-16">
            {/* Card 1: Vikram Bhagat */}
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Text Card */}
              <m.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-5 bg-gradient-to-br from-[#0e5e3b] via-[#0b432a] to-[#052516] text-white p-8 sm:p-10 rounded-3xl shadow-xl border border-emerald-800/50 relative flex flex-col justify-between h-full overflow-hidden"
              >
                {/* Decorative static accent */}
                <div className="absolute -top-6 -left-6 w-20 h-20 pointer-events-none z-0 rounded-full border border-dashed border-emerald-400/20 bg-emerald-500/5 blur-[2px]" />

                <div className="relative z-10 space-y-6 flex flex-col justify-between h-full w-full">
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest block mt-2">Co-Founder & CEO</span>
                    <h3 className="text-3xl font-extrabold font-lexend text-white">
                      Vikram Bhagat
                    </h3>
                    <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
                      Vikram Bhagat brings strong leadership and entrepreneurial vision to Global Webify. As Co-Founder and CEO, he drives the company's overall strategy, growth, and client success. With a sharp business acumen and a commitment to innovation, Vikram has been instrumental in shaping Global Webify's journey from a dynamic startup to a trusted digital solutions provider.
                    </p>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="bg-emerald-950/50 border border-emerald-800/40 p-5 rounded-2xl text-center">
                        <p className="text-xl sm:text-2xl font-black text-white font-lexend mb-1">Strategic</p>
                        <p className="text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-wider">Leadership</p>
                      </div>
                      <div className="bg-blue-950/50 border border-blue-900/40 p-5 rounded-2xl text-center">
                        <p className="text-xl sm:text-2xl font-black text-white font-lexend mb-1">Brand</p>
                        <p className="text-[10px] sm:text-xs font-bold text-blue-400 uppercase tracking-wider">Building</p>
                      </div>
                    </div>
                  </div>
                </div>
              </m.div>

              {/* Image Card */}
              <m.div 
                whileHover={{ y: -8, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="lg:col-span-7 relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-gray-100 bg-white w-full max-w-[640px] mx-auto lg:ml-auto lg:mr-0"
              >
                {/* Red Star Badge */}
                <div className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20 z-10">
                  <Star size={16} className="fill-white text-white" />
                </div>

                <div className="relative aspect-[3/2] w-full overflow-hidden">
                  <Image 
                    src="/Aboutus/VikramBhagat.avif" 
                    alt="Vikram Bhagat - Co-Founder & CEO" 
                    fill
                    quality={85}
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
              </m.div>
            </div>

            {/* Card 2: Shakti Singh */}
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Image Card */}
              <m.div 
                whileHover={{ y: -8, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="lg:col-span-7 relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-gray-100 bg-white w-full max-w-[640px] mx-auto lg:mr-auto lg:ml-0 order-last lg:order-none"
              >
                {/* Red Star Badge */}
                <div className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20 z-10">
                  <Star size={16} className="fill-white text-white" />
                </div>

                <div className="relative aspect-[3/2] w-full overflow-hidden">
                  <Image 
                    src="/Aboutus/ShaktiSingh.avif" 
                    alt="Shakti Singh - Co-Founder & CTO" 
                    fill
                    quality={85}
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
              </m.div>

              {/* Text Card */}
              <m.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-5 bg-gradient-to-br from-[#0f1e36] via-[#0b1629] to-[#070f1d] text-white p-8 sm:p-10 rounded-3xl shadow-xl border border-blue-900/50 relative flex flex-col justify-between h-full overflow-hidden"
              >
                {/* Decorative static accent */}
                <div className="absolute -top-6 -left-6 w-20 h-20 pointer-events-none z-0 rounded-full border border-dashed border-blue-400/20 bg-blue-500/5 blur-[2px]" />

                <div className="relative z-10 space-y-6 flex flex-col justify-between h-full w-full">
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-blue-300 uppercase tracking-widest block mt-2">Co-Founder & CTO</span>
                    <h3 className="text-3xl font-extrabold font-lexend text-white">
                      Shakti Singh
                    </h3>
                    <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed">
                      Shakti Singh brings intensive technical expertise and strategic vision to Global Webify. With a deep understanding of emerging technologies and a passion for innovation, he leads the company's technical initiatives and product development. His expertise in full-stack development, cloud architecture, and digital transformation has been instrumental in delivering cutting-edge solutions to clients.
                    </p>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="bg-blue-950/50 border border-blue-900/40 p-5 rounded-2xl text-center">
                        <p className="text-xl sm:text-2xl font-black text-white font-lexend mb-1">Technical</p>
                        <p className="text-[10px] sm:text-xs font-bold text-blue-400 uppercase tracking-wider">Excellence</p>
                      </div>
                      <div className="bg-emerald-950/50 border border-emerald-800/40 p-5 rounded-2xl text-center">
                        <p className="text-xl sm:text-2xl font-black text-white font-lexend mb-1">Innovation</p>
                        <p className="text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-wider">Leader</p>
                      </div>
                    </div>
                  </div>
                </div>
              </m.div>
            </div>

            {/* Card 3: Abhishek Kumar */}
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Text Card */}
              <m.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-5 bg-gradient-to-br from-[#0e5e3b] via-[#0b432a] to-[#052516] text-white p-8 sm:p-10 rounded-3xl shadow-xl border border-emerald-800/50 relative flex flex-col justify-between h-full overflow-hidden"
              >
                {/* Decorative static accent */}
                <div className="absolute -top-6 -left-6 w-20 h-20 pointer-events-none z-0 rounded-full border border-dashed border-emerald-400/20 bg-emerald-500/5 blur-[2px]" />

                <div className="relative z-10 space-y-6 flex flex-col justify-between h-full w-full">
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest block mt-2">Center Head</span>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-3xl font-extrabold font-lexend text-white">
                        Abhishek Kumar
                      </h3>
                    </div>
                    <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
                      Abhishek Kumar brings dedicated leadership and operational excellence to Global Webify. As Center Head, he oversees day-to-day operations, team management, and client delivery, ensuring smooth functioning across all verticals. With a strong focus on efficiency, collaboration, and service quality, Abhishek plays a key role in aligning business objectives with execution, leveraging his deep expertise from tenure at leading firms such as Accenture, Cognizant, and Wipro.
                    </p>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="bg-emerald-950/50 border border-emerald-800/40 p-5 rounded-2xl text-center">
                        <p className="text-xl sm:text-2xl font-black text-white font-lexend mb-1">Team</p>
                        <p className="text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-wider">Leadership</p>
                      </div>
                      <div className="bg-blue-950/50 border border-blue-900/40 p-5 rounded-2xl text-center">
                        <p className="text-xl sm:text-2xl font-black text-white font-lexend mb-1">Business</p>
                        <p className="text-[10px] sm:text-xs font-bold text-blue-400 uppercase tracking-wider">Alignment</p>
                      </div>
                    </div>
                  </div>
                </div>
              </m.div>

              {/* Image Card */}
              <m.div 
                whileHover={{ y: -8, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="lg:col-span-7 relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-gray-100 bg-white w-full max-w-[640px] mx-auto lg:ml-auto lg:mr-0"
              >
                {/* Red Star Badge */}
                <div className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20 z-10">
                  <Star size={16} className="fill-white text-white" />
                </div>

                <div className="relative aspect-[3/2] w-full overflow-hidden">
                  <Image 
                    src="/Aboutus/AbhishekKumar.avif" 
                    alt="Abhishek Kumar - Center Head" 
                    fill
                    quality={85}
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
              </m.div>
            </div>
          </div>
        </div>
      </section>
      {/* Certifications Section */}
      <section className="py-12 md:py-16 bg-[#e8f5ee]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* Left Side: Certificates (4-Column Grid: 4 in first row, 3 in second row) */}
            <div className="order-last lg:order-first flex justify-center lg:justify-start">
              <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-[380px] sm:max-w-[540px] w-full">
                {[
                  { src: "/Certificate1.avif", alt: "Certificate of Registration" },
                  { src: "/Certificate2.avif", alt: "Import & Export Code (IEC)" },
                  { src: "/Certificate3.avif", alt: "GST Registration Certificate" },
                  { src: "/Certificate4.avif", alt: "MSME Udyam Registration" },
                  { src: "/Certificate5.avif", alt: "ISO 27001:2022 (Information Security)" },
                  { src: "/Certificate6.avif", alt: "ISO 9001:2015 (Quality Management)" },
                  { src: "/Certificate7.avif", alt: "Certificate of Registration of Firm" },
                ].map((cert, index) => (
                  <m.div
                    key={index}
                    whileHover={{ y: -6, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative aspect-[1131/1600] w-full rounded-lg overflow-hidden shadow-md hover:shadow-xl border border-gray-100 bg-white"
                  >
                    <Image
                      src={cert.src}
                      alt={cert.alt}
                      fill
                      quality={85}
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 15vw"
                    />
                  </m.div>
                ))}
              </div>
            </div>

            {/* Right Side: Text Copy (No sticky scroll, scrolls normally) */}
            <div className="space-y-6">
              <div>
                <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-primary mb-2 block">
                  Accredited & Trusted
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold font-lexend text-primary-dark mb-4 leading-tight">
                  Our Certifications
                </h2>
                <div className="w-16 h-1 bg-primary mb-6 rounded-full"></div>
              </div>
              
              <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed">
                <p>
                  At Global Webify, our certifications reflect our commitment to quality, security, and professional excellence. We are officially registered with the Ministry of Corporate Affairs (Certificate of Registration) and recognized under the MSME Udyam Registration.
                </p>
                <p>
                  With a valid GST Registration Certificate and Import & Export Code (IEC), we are authorized to operate not only across India but also in global markets.
                </p>
                <p>
                  To further ensure trust and reliability, we are internationally certified with ISO 27001:2022 for Information Security Management and ISO 9001:2015 for Quality Management, accredited by London Cert Ltd.
                </p>
                <p className="font-semibold text-gray-900 pt-4 border-t border-gray-100">
                  These certifications stand as proof that we follow the highest standards, giving our clients confidence that their projects are handled with security, quality, and compliance at every step.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Payment Partners Section */}
      <section className="py-12 md:py-16 bg-white border-t border-gray-100">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-primary mb-2 block">
              Secure Transactions
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-lexend text-primary-dark mb-4">
              Our Payment Partner
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              We support secure, reliable, and convenient payment methods to facilitate both domestic and international transactions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-6 w-full max-w-6xl mx-auto">
            {[
              { src: "/Razorpay.avif", alt: "Razorpay", label: "Razorpay" },
              { src: "/PhonePe.avif", alt: "PhonePe", label: "PhonePe" },
              { src: "/PayPal.avif", alt: "PayPal", label: "PayPal" },
              { src: "/BankOfBaroda.avif", alt: "Bank of Baroda", label: "Bank of Baroda" },
              { src: "/IndianOverseasBank.avif", alt: "Indian Overseas Bank", label: "IOB" },
            ].map((partner, index) => (
              <m.div
                key={index}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative bg-[#f0f9f4] hover:bg-[#e4f4ea] rounded-2xl p-4 border border-emerald-200/80 shadow-sm hover:shadow-md hover:border-[#1a8b4c]/40 transition-all duration-300 flex flex-col items-center justify-between text-center overflow-hidden"
              >
                {/* Logo Frame Container with Soft Color & Border */}
                <div className="w-full bg-[#fafdfb] rounded-xl p-3 border border-emerald-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] group-hover:bg-white group-hover:border-[#1a8b4c]/30 transition-all duration-300 flex items-center justify-center h-20 md:h-24">
                  <Image
                    src={partner.src}
                    alt={partner.alt}
                    width={180}
                    height={70}
                    className="object-contain max-h-full max-w-full transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Label */}
                <div className="mt-3 w-full">
                  <span className="text-[11px] md:text-xs font-bold text-gray-700 group-hover:text-[#1a8b4c] transition-colors duration-300 uppercase tracking-wider block truncate">
                    {partner.label}
                  </span>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
