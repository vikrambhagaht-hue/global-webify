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

    const totalFrames = Math.min(Math.ceil(duration / 16), 120);
    const increment = (end - start) / totalFrames;
    let currentFrame = 0;

    const timer = setInterval(() => {
      currentFrame++;
      const nextVal = Math.floor(start + increment * currentFrame);
      if (currentFrame >= totalFrames) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(nextVal);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
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
    <div className="bg-white">
      {/* Top Header Section */}
      <section className="pt-0 pb-6 bg-white border-b border-gray-100">
        <div className="container-custom text-center">
          <m.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-black font-lexend text-primary-dark mb-4 uppercase tracking-tight"
          >
            About Global Webify
          </m.h1>
          <div className="w-16 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
          <m.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            We help businesses grow online with custom web development, SEO, and digital marketing solutions.
          </m.p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-white via-slate-50/50 to-[#f4fbf7]/40">
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
                    Global Webify is a full-service digital marketing, web development, and web designing company built on trust, innovation, and performance. Over the years, we have earned our reputation as one of the <span className="font-bold text-primary-dark">Top 3 Web Designing Digital Marketing Company in India</span> by consistently delivering results-focused solutions tailored to each client’s business goals.
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
            <m.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 lg:sticky lg:top-24 space-y-6 w-full max-w-[420px] mx-auto lg:ml-auto lg:mr-0"
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
                className="relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-gray-100 bg-white"
              >
                <video 
                  src="/Aboutus/demo-about-video.mp4" 
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  controls
                  className="w-full h-auto object-cover rounded-3xl"
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
      </section>

      {/* Mission & Vision Section */}
      <section id="vision" className="py-12 md:py-16 border-t border-gray-100 bg-[#f4fbf7]/10">
        <div className="container-custom space-y-10 md:space-y-12">
          {/* Row 1: Our Mission */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
            {/* Mission Text Card */}
            <m.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 relative flex flex-col justify-between"
            >
              {/* Floating Green Target Badge */}
              <div className="absolute -top-5 left-6 lg:-left-5 bg-emerald-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Target size={24} />
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl sm:text-3xl font-extrabold font-lexend text-primary-dark mt-2">
                  Our Mission
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Empowering businesses through digital innovation and accessible technology.
                </p>
                
                {/* Stats Container */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl text-center">
                    <p className="text-2xl sm:text-3xl font-black text-emerald-700 font-lexend mb-1">
                      <Counter value={500} suffix="+" />
                    </p>
                    <p className="text-[10px] sm:text-xs font-bold text-emerald-600 uppercase tracking-wider">Projects Delivered</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl text-center">
                    <p className="text-2xl sm:text-3xl font-black text-blue-700 font-lexend mb-1">
                      <Counter value={95} suffix="%" />
                    </p>
                    <p className="text-[10px] sm:text-xs font-bold text-blue-600 uppercase tracking-wider">Client Satisfaction</p>
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
              className="relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-gray-100 bg-white"
            >
              {/* Red Heart Badge */}
              <div className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20 z-10">
                <Heart size={16} className="fill-white text-white" />
              </div>

              <div className="relative aspect-[3/2] w-full overflow-hidden h-full min-h-[300px]">
                <Image 
                  src="/Aboutus/AbhishekKumar.avif" 
                  alt="Abhishek Kumar - Global Webify" 
                  fill
                  quality={85}
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
              className="relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-gray-100 bg-white order-first lg:order-none"
            >
              {/* Red Star Badge */}
              <div className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20 z-10">
                <Star size={16} className="fill-white text-white" />
              </div>

              <div className="relative aspect-[3/2] w-full overflow-hidden h-full min-h-[300px]">
                <Image 
                  src="/Aboutus/About2.avif" 
                  alt="Global Webify Team" 
                  fill
                  quality={85}
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
              className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 relative flex flex-col justify-between"
            >
              {/* Floating Blue Eye Badge */}
              <div className="absolute -top-5 left-6 lg:-left-5 bg-blue-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Eye size={24} />
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl sm:text-3xl font-extrabold font-lexend text-primary-dark mt-2">
                  Our Vision
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  To be the leading digital agency that transforms businesses through innovative technology solutions.
                </p>
                
                {/* Stats Container */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl text-center">
                    <p className="text-2xl sm:text-3xl font-black text-blue-700 font-lexend mb-1">
                      <Counter value={10} suffix="+" />
                    </p>
                    <p className="text-[10px] sm:text-xs font-bold text-blue-600 uppercase tracking-wider">Years Experience</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl text-center">
                    <p className="text-2xl sm:text-3xl font-black text-emerald-700 font-lexend mb-1">
                      <Counter value={50} suffix="+" />
                    </p>
                    <p className="text-[10px] sm:text-xs font-bold text-emerald-600 uppercase tracking-wider">Happy Clients</p>
                  </div>
                </div>
              </div>
            </m.div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-12 md:py-16 bg-white border-t border-gray-100">
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
                {/* Circle Type Animation in Top-Left Corner */}
                <div className="absolute -top-6 -left-6 w-20 h-20 pointer-events-none z-0">
                  <m.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                    className="w-full h-full rounded-full border border-dashed border-emerald-400/20"
                  />
                  <m.div 
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="absolute inset-4 rounded-full bg-emerald-500/10 blur-[2px]"
                  />
                </div>

                {/* 3D Glossy Bouncing Ball with Shadow (Repositioned to bottom-right to avoid button overlap) */}
                <div className="absolute right-8 bottom-8 w-16 h-24 pointer-events-none z-0 flex flex-col items-center justify-between">
                  {/* Bouncing Sphere */}
                  <m.div 
                    animate={{ y: [0, -35, 0] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2.5, 
                      ease: "easeInOut" 
                    }}
                    className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-400 to-green-300 shadow-lg shadow-emerald-400/50 border border-emerald-300/30"
                  />
                  {/* Bouncing Shadow */}
                  <m.div 
                    animate={{ scale: [1, 0.5, 1], opacity: [0.6, 0.2, 0.6] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2.5, 
                      ease: "easeInOut" 
                    }}
                    className="w-10 h-1.5 rounded-full bg-black/40 blur-[3px]"
                  />
                </div>

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
                {/* Circle Type Animation in Top-Left Corner */}
                <div className="absolute -top-6 -left-6 w-20 h-20 pointer-events-none z-0">
                  <m.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                    className="w-full h-full rounded-full border border-dashed border-blue-400/20"
                  />
                  <m.div 
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="absolute inset-4 rounded-full bg-blue-500/10 blur-[2px]"
                  />
                </div>

                {/* 3D Glossy Bouncing Ball with Shadow (Repositioned to bottom-right to avoid button overlap) */}
                <div className="absolute right-8 bottom-8 w-16 h-24 pointer-events-none z-0 flex flex-col items-center justify-between">
                  {/* Bouncing Sphere */}
                  <m.div 
                    animate={{ y: [0, -35, 0] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2.8, 
                      ease: "easeInOut" 
                    }}
                    className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-300 shadow-lg shadow-blue-400/50 border border-blue-300/30"
                  />
                  {/* Bouncing Shadow */}
                  <m.div 
                    animate={{ scale: [1, 0.5, 1], opacity: [0.6, 0.2, 0.6] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2.8, 
                      ease: "easeInOut" 
                    }}
                    className="w-10 h-1.5 rounded-full bg-black/40 blur-[3px]"
                  />
                </div>

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
                {/* Circle Type Animation in Top-Left Corner */}
                <div className="absolute -top-6 -left-6 w-20 h-20 pointer-events-none z-0">
                  <m.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                    className="w-full h-full rounded-full border border-dashed border-emerald-400/20"
                  />
                  <m.div 
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="absolute inset-4 rounded-full bg-emerald-500/10 blur-[2px]"
                  />
                </div>

                {/* 3D Glossy Bouncing Ball with Shadow (Repositioned to bottom-right to avoid button overlap) */}
                <div className="absolute right-8 bottom-8 w-16 h-24 pointer-events-none z-0 flex flex-col items-center justify-between">
                  {/* Bouncing Sphere */}
                  <m.div 
                    animate={{ y: [0, -35, 0] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2.6, 
                      ease: "easeInOut" 
                    }}
                    className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-400 to-green-300 shadow-lg shadow-emerald-400/50 border border-emerald-300/30"
                  />
                  {/* Bouncing Shadow */}
                  <m.div 
                    animate={{ scale: [1, 0.5, 1], opacity: [0.6, 0.2, 0.6] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2.6, 
                      ease: "easeInOut" 
                    }}
                    className="w-10 h-1.5 rounded-full bg-black/40 blur-[3px]"
                  />
                </div>

                <div className="relative z-10 space-y-6 flex flex-col justify-between h-full w-full">
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest block mt-2">Center Head</span>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-3xl font-extrabold font-lexend text-white">
                        Abhishek Kumar
                      </h3>
                      {/* Ex-Employee Badge */}
                      <span className="text-[10px] sm:text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-800/50 rounded-full px-3 py-1 shadow-sm block">
                        EX- Employee
                      </span>
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
      <section className="py-12 md:py-16 bg-gradient-to-b from-[#f4fbf7]/10 to-white border-t border-gray-100">
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

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 w-full max-w-6xl mx-auto">
            {[
              { src: "/Razorpay.avif", alt: "Razorpay" },
              { src: "/PhonePe.avif", alt: "PhonePe" },
              { src: "/PayPal.avif", alt: "PayPal" },
              { src: "/BankOfBaroda.avif", alt: "Bank of Baroda" },
              { src: "/IndianOverseasBank.avif", alt: "Indian Overseas Bank" },
            ].map((partner, index) => (
              <m.div
                key={index}
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative h-28 sm:h-32 w-48 sm:w-56 lg:w-64 flex items-center justify-center bg-white shadow-md hover:shadow-lg rounded-2xl p-3 border border-gray-100 hover:border-gray-200 transition-all duration-300 shrink-0"
              >
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  width={220}
                  height={90}
                  className="object-contain max-h-full max-w-full"
                />
              </m.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
