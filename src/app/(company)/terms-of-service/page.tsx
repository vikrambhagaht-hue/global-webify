import React from 'react';
import { Metadata } from 'next';
import { FileText, Code, TrendingUp, UserCheck, CreditCard, Shield, Mail, Phone, MapPin, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | Global Webify – Website Usage & Legal Guidelines',
  description: 'Review the Terms of Service of Global Webify to understand the rules, guidelines, and conditions for using our website and services. Stay informed about your rights and responsibilities while using our platform.',
  keywords: ['Terms of Service of Global Webify', 'Terms of Service', 'Global Webify'],
  alternates: {
    canonical: '/terms-of-service',
  },
  robots: 'index, follow',
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[#fafdfc] font-jost text-left">
      {/* Hero Section */}
      <section className="relative pt-[140px] pb-20 overflow-hidden bg-gradient-to-b from-[#eaf6f0] to-[#fafdfc]">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[120%] bg-gradient-to-l from-[#1a8b4c]/5 to-transparent rounded-full blur-3xl transform -rotate-12"></div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-green-100 text-[#1a8b4c] text-xs font-black uppercase tracking-widest shadow-sm mb-6">
            <FileText size={14} />
            Legal Agreement
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-black text-gray-950 tracking-tight leading-tight mb-6 font-lexend">
            Terms of <span className="text-[#1a8b4c]">Service</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before using our services. These terms govern your relationship with Global Webify.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-[900px] mx-auto px-6 md:px-12">
          
          {/* 1. Agreement to Terms */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                <FileText className="text-[#1a8b4c]" size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-950 font-lexend">Agreement to Terms</h2>
            </div>
            <div className="prose prose-lg text-gray-600 max-w-none">
              <p className="mb-4">
                By accessing and using the services provided by Global Webify ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement.
              </p>
              <p>
                These Terms of Service ("Terms") govern your use of our website and services, including web development, SEO, digital marketing, and related services.
              </p>
            </div>
          </div>

          {/* 2. Our Services */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-gray-950 font-lexend mb-8">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <Code className="text-[#1a8b4c] mb-4" size={32} />
                <h3 className="text-xl font-bold text-gray-950 mb-4">Web Development</h3>
                <ul className="space-y-3">
                  {['Custom website development', 'E-commerce solutions', 'WordPress development', 'Responsive design', 'Website maintenance'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-700">
                      <CheckCircle2 className="text-[#1a8b4c] shrink-0 mt-0.5" size={16} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <TrendingUp className="text-[#1a8b4c] mb-4" size={32} />
                <h3 className="text-xl font-bold text-gray-950 mb-4">Digital Marketing</h3>
                <ul className="space-y-3">
                  {['SEO optimization', 'Social media marketing', 'Content marketing', 'PPC advertising', 'Email marketing'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-700">
                      <CheckCircle2 className="text-[#1a8b4c] shrink-0 mt-0.5" size={16} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 3. User Responsibilities */}
          <div className="bg-[#f8fbf9] rounded-3xl p-8 md:p-12 border border-green-50 mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <UserCheck className="text-[#1a8b4c]" size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-950 font-lexend">User Responsibilities</h2>
            </div>
            
            <div className="space-y-6">
              {[
                { title: 'Provide Accurate Information', desc: 'You must provide accurate, current, and complete information when using our services.' },
                { title: 'Comply with Laws', desc: 'You agree to use our services in compliance with all applicable laws and regulations.' },
                { title: 'Respect Intellectual Property', desc: 'You must not infringe on the intellectual property rights of others or our company.' },
                { title: 'Maintain Security', desc: 'You are responsible for maintaining the security of your account and login credentials.' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#1a8b4c] text-white flex items-center justify-center shrink-0 mt-1">
                    <span className="text-sm font-bold">{i + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1 text-lg">{item.title}</h4>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Payment Terms */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                <CreditCard className="text-[#1a8b4c]" size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-950 font-lexend">Payment Terms</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                <h4 className="font-bold text-gray-900 mb-4 text-lg">Payment Methods</h4>
                <p className="text-gray-600 mb-6">We accept various payment methods including credit cards, bank transfers, and digital payment platforms.</p>
                <div className="flex flex-wrap gap-3">
                  {['Visa', 'Mastercard', 'PayPal', 'UPI'].map(method => (
                    <span key={method} className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700">
                      {method}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="text-[#1a8b4c]" size={20} />
                    Payment Schedule
                  </h4>
                  <ul className="space-y-3">
                    {['50% upfront for new projects', '25% at project milestone', '25% upon completion', 'Monthly billing for ongoing services'].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="text-[#1a8b4c] shrink-0 font-bold">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6 md:p-8">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="text-orange-500" size={20} />
                    Late Payments
                  </h4>
                  <ul className="space-y-3">
                    {['5% late fee after 7 days', 'Service suspension after 30 days', 'Legal action after 60 days'].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <span className="text-orange-500 shrink-0 font-bold">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Intellectual Property */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                <Shield className="text-[#1a8b4c]" size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-950 font-lexend">Intellectual Property Rights</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Our Rights</h3>
                <ul className="space-y-3">
                  {['Website design and code ownership', 'Custom graphics and branding', 'Proprietary tools and systems', 'Service methodologies and processes', 'Company trademarks and logos'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <CheckCircle2 className="text-[#1a8b4c] shrink-0 mt-0.5" size={16} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Rights</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Upon full payment, you receive ownership rights to the final deliverables as outlined in your specific project agreement.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We retain the right to showcase completed work in our portfolio unless a Non-Disclosure Agreement (NDA) is signed.
                </p>
              </div>
            </div>
          </div>

          {/* 6. Contact Section */}
          <div className="bg-[#1a8b4c] rounded-[40px] p-8 md:p-12 text-white shadow-2xl shadow-green-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-black mb-4 font-lexend">Questions About Terms?</h2>
              <p className="text-green-50 mb-10 max-w-2xl text-lg">
                If you have any questions or concerns about these Terms of Service, please contact us.
              </p>
              
              <div className="space-y-4">
                <p className="flex items-center gap-3"><Mail className="text-green-200" size={18} /> <a href="mailto:contact@globalwebify.com" className="hover:text-green-200 transition-colors">contact@globalwebify.com</a></p>
                <p className="flex items-center gap-3"><Phone className="text-green-200" size={18} /> +91 7563901100</p>
                <p className="flex items-center gap-3"><MapPin className="text-green-200" size={18} /> Ranchi, India</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
