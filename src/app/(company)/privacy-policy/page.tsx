import React from 'react';
import { Metadata } from 'next';
import { Shield, Database, Settings, Lock, Eye, Edit, Trash, Mail, Phone, MapPin, User, CheckCircle, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Global Webify – Data Protection, Security & User Privacy Guidelines',
  description: 'Learn how Global Webify handles, stores, and protects your personal information. Read our Privacy Policy to understand data usage, security practices, and user rights while using our services.',
  keywords: ['Privacy Policy', 'Global Webify Privacy Policy', 'Data Protection', 'Data Security'],
  alternates: {
    canonical: '/privacy-policy'
  },
  robots: 'index, follow',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#fafdfc] font-jost text-left">
      {/* Hero Section */}
      <section className="relative pt-[140px] pb-20 overflow-hidden bg-gradient-to-b from-[#eaf6f0] to-[#fafdfc]">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[-10%] w-[40%] h-[80%] bg-gradient-to-r from-[#1a8b4c]/5 to-transparent rounded-full blur-3xl transform rotate-12"></div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-green-100 text-[#1a8b4c] text-xs font-black uppercase tracking-widest shadow-sm mb-6">
            <Shield size={14} />
            Data Protection
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-black text-gray-950 tracking-tight leading-tight mb-6 font-lexend">
            Privacy <span className="text-[#1a8b4c]">Policy</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We respect your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-[900px] mx-auto px-6 md:px-12">
          
          {/* 1. Introduction */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                <Shield className="text-[#1a8b4c]" size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-950 font-lexend">Introduction</h2>
            </div>
            <div className="prose prose-lg text-gray-600 max-w-none">
              <p className="mb-4">
                Global Webify ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
              <p>
                By using our services, you agree to the collection and use of information in accordance with this policy. We believe in total transparency when it comes to your data.
              </p>
            </div>
          </div>

          {/* 2. Information We Collect */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                <Database className="text-[#1a8b4c]" size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-950 font-lexend">Information We Collect</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:-translate-y-1 transition-transform">
                <User className="text-[#1a8b4c] mb-4" size={32} />
                <h3 className="text-xl font-bold text-gray-950 mb-4">Personal Information</h3>
                <ul className="space-y-3">
                  {['Name and contact information', 'Email address and phone number', 'Company name and job title', 'Project requirements and preferences'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1a8b4c]"></div> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:-translate-y-1 transition-transform">
                <TrendingUp className="text-[#1a8b4c] mb-4" size={32} />
                <h3 className="text-xl font-bold text-gray-950 mb-4">Usage Information</h3>
                <ul className="space-y-3">
                  {['Website usage and analytics', 'Device and browser information', 'IP address and location data', 'Cookies and tracking technologies'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1a8b4c]"></div> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 3. How We Use Your Information */}
          <div className="bg-[#f8fbf9] rounded-3xl p-8 md:p-12 border border-green-50 mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <Settings className="text-[#1a8b4c]" size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-950 font-lexend">How We Use Your Information</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Provide Services', desc: 'To deliver web development, SEO, and digital marketing services as requested.' },
                { title: 'Communication', desc: 'To respond to inquiries, provide support, and send important updates about our services.' },
                { title: 'Improve Services', desc: 'To analyze usage patterns and enhance our website and service offerings.' }
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 text-center">
                  <div className="w-10 h-10 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="text-[#1a8b4c]" size={20} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Data Security */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                <Lock className="text-[#1a8b4c]" size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-950 font-lexend">Data Security</h2>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
              <h3 className="text-xl font-bold text-gray-950 mb-6 flex items-center gap-2">
                <Shield className="text-[#1a8b4c]" size={24} />
                Our Security Measures
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {['SSL encryption for data transmission', 'Secure servers and infrastructure', 'Regular security audits and updates', 'Access controls and authentication', 'Data backup and recovery procedures'].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
                    <Shield className="text-[#1a8b4c] shrink-0 mt-0.5" size={16} />
                    <span className="text-sm font-medium text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Your Rights */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                <User className="text-[#1a8b4c]" size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-950 font-lexend">Your Rights</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: <Eye size={24} />, title: 'Access & Review', desc: 'You have the right to access and review the personal information we hold about you.' },
                { icon: <Edit size={24} />, title: 'Update Information', desc: 'You can update or correct your personal information at any time.' },
                { icon: <Mail size={24} />, title: 'Opt-Out', desc: 'You can opt-out of marketing communications and certain data collection.' },
                { icon: <Trash size={24} />, title: 'Data Deletion', desc: 'You can request deletion of your personal information, subject to legal requirements.' }
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow">
                  <div className="text-[#1a8b4c] mb-4">{item.icon}</div>
                  <h4 className="font-bold text-gray-900 mb-2 text-lg">{item.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Contact Us */}
          <div className="bg-[#1a8b4c] rounded-[40px] p-8 md:p-12 text-white shadow-2xl shadow-green-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-black mb-4 font-lexend">Questions About Privacy?</h2>
              <p className="text-green-50 mb-10 max-w-2xl text-lg">
                If you have any questions or concerns about this Privacy Policy, please don't hesitate to contact our privacy team.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xl font-bold mb-4 border-b border-white/20 pb-2">Global Webify</h4>
                  <p className="flex items-center gap-3"><Mail className="text-green-200" size={18} /> <a href="mailto:contact@globalwebify.com" className="hover:text-green-200 transition-colors">contact@globalwebify.com</a></p>
                  <p className="flex items-center gap-3"><Phone className="text-green-200" size={18} /> +91 7563901100</p>
                  <p className="flex items-center gap-3"><MapPin className="text-green-200" size={18} /> Ranchi, India</p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xl font-bold mb-4 border-b border-white/20 pb-2">Privacy Team</h4>
                  <p className="flex items-center gap-3"><User className="text-green-200" size={18} /> Privacy Officer</p>
                  <p className="flex items-center gap-3"><Mail className="text-green-200" size={18} /> <a href="mailto:privacy@globalwebify.com" className="hover:text-green-200 transition-colors">privacy@globalwebify.com</a></p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
