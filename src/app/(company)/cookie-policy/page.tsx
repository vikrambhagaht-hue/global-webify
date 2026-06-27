import React from 'react';
import { Metadata } from 'next';
import { Info, List, Shield, BarChart, Megaphone, Settings, Table, Sliders, LayoutTemplate, Mail, Phone, MapPin, User, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy | Global Webify – How We Use Cookies & Data Protection',
  description: 'Learn about how Global Webify uses cookies on our website to improve user experience, analyze traffic, and enhance services. Read our Cookie Policy for full details.',
  keywords: ['Cookie Policy', 'Global Webify Cookie Policy', 'Data Protection'],
  robots: 'index, follow',
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-[#fafdfc] font-jost text-left">
      {/* Hero Section */}
      <section className="relative pt-[140px] pb-20 overflow-hidden bg-gradient-to-b from-[#eaf6f0] to-[#fafdfc]">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[120%] bg-gradient-to-r from-[#1a8b4c]/5 to-transparent rounded-full blur-3xl transform rotate-12"></div>
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[80%] bg-gradient-to-l from-[#1a8b4c]/5 to-transparent rounded-full blur-3xl transform -rotate-12"></div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-green-100 text-[#1a8b4c] text-xs font-black uppercase tracking-widest shadow-sm mb-6">
            <Shield size={14} />
            Privacy & Trust
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-black text-gray-950 tracking-tight leading-tight mb-6 font-lexend">
            Cookie <span className="text-[#1a8b4c]">Policy</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Understanding how we use cookies and similar technologies to improve your experience on our website.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-[900px] mx-auto px-6 md:px-12">
          
          {/* 1. What Are Cookies */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                <Info className="text-[#1a8b4c]" size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-950 font-lexend">What Are Cookies?</h2>
            </div>
            <div className="prose prose-lg text-gray-600 max-w-none">
              <p className="mb-4">
                Cookies are small text files that are stored on your device when you visit a website. They help websites remember information about your visit, such as your preferred language and other settings, which can make your next visit easier and the site more useful to you.
              </p>
              <p>
                At Global Webify, we use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and understand where our visitors are coming from.
              </p>
            </div>
          </div>

          {/* 2. Types of Cookies We Use */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                <List className="text-[#1a8b4c]" size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-950 font-lexend">Types of Cookies We Use</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Essential */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:-translate-y-1 transition-transform">
                <Shield className="text-[#1a8b4c] mb-4" size={32} />
                <h3 className="text-xl font-bold text-gray-950 mb-3">Essential Cookies</h3>
                <p className="text-sm text-gray-600 mb-4 h-10">Necessary for the website to function properly and cannot be disabled.</p>
                <ul className="space-y-2">
                  {['Session management', 'Security features', 'Form submissions', 'User authentication'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1a8b4c]"></div> {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Analytics */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:-translate-y-1 transition-transform">
                <BarChart className="text-[#3b82f6] mb-4" size={32} />
                <h3 className="text-xl font-bold text-gray-950 mb-3">Analytics Cookies</h3>
                <p className="text-sm text-gray-600 mb-4 h-10">Help us understand how visitors interact with our website.</p>
                <ul className="space-y-2">
                  {['Page visit statistics', 'User behavior analysis', 'Traffic source tracking', 'Performance monitoring'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></div> {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Marketing */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:-translate-y-1 transition-transform">
                <Megaphone className="text-[#f59e0b] mb-4" size={32} />
                <h3 className="text-xl font-bold text-gray-950 mb-3">Marketing Cookies</h3>
                <p className="text-sm text-gray-600 mb-4 h-10">Used to deliver relevant advertisements and content.</p>
                <ul className="space-y-2">
                  {['Ad personalization', 'Social media integration', 'Retargeting campaigns', 'Lead generation'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></div> {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Preference */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:-translate-y-1 transition-transform">
                <Settings className="text-[#8b5cf6] mb-4" size={32} />
                <h3 className="text-xl font-bold text-gray-950 mb-3">Preference Cookies</h3>
                <p className="text-sm text-gray-600 mb-4 h-10">Remember your choices and preferences.</p>
                <ul className="space-y-2">
                  {['Language preferences', 'Theme settings', 'Font size preferences', 'Accessibility options'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]"></div> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 3. Specific Cookies We Use */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-16 overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                <Table className="text-[#1a8b4c]" size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-950 font-lexend">Specific Cookies We Use</h2>
            </div>
            
            <div className="overflow-x-auto -mx-8 px-8 md:mx-0 md:px-0">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="py-4 px-4 font-bold text-gray-900">Cookie Name</th>
                    <th className="py-4 px-4 font-bold text-gray-900">Purpose</th>
                    <th className="py-4 px-4 font-bold text-gray-900">Duration</th>
                    <th className="py-4 px-4 font-bold text-gray-900">Type</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 font-mono text-sm">PHPSESSID</td>
                    <td className="py-4 px-4">Session management and security</td>
                    <td className="py-4 px-4">Session</td>
                    <td className="py-4 px-4"><span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Essential</span></td>
                  </tr>
                  <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 font-mono text-sm">_ga</td>
                    <td className="py-4 px-4">Google Analytics tracking</td>
                    <td className="py-4 px-4">2 years</td>
                    <td className="py-4 px-4"><span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Analytics</span></td>
                  </tr>
                  <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 font-mono text-sm">_gid</td>
                    <td className="py-4 px-4">Google Analytics user identification</td>
                    <td className="py-4 px-4">24 hours</td>
                    <td className="py-4 px-4"><span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Analytics</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 font-mono text-sm">cookie_consent</td>
                    <td className="py-4 px-4">Remember cookie preferences</td>
                    <td className="py-4 px-4">1 year</td>
                    <td className="py-4 px-4"><span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">Preference</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Managing Preferences */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                <Sliders className="text-[#1a8b4c]" size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-950 font-lexend">Managing Your Cookie Preferences</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-8 rounded-3xl">
                <LayoutTemplate className="text-gray-700 mb-4" size={28} />
                <h3 className="text-lg font-bold text-gray-900 mb-3">Browser Settings</h3>
                <p className="text-sm text-gray-600 mb-4">You can control cookies through your browser settings:</p>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li><strong>Chrome:</strong> Settings &gt; Privacy &gt; Cookies</li>
                  <li><strong>Firefox:</strong> Options &gt; Privacy &gt; Cookies</li>
                  <li><strong>Safari:</strong> Preferences &gt; Privacy &gt; Cookies</li>
                  <li><strong>Edge:</strong> Settings &gt; Permissions &gt; Cookies</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-8 rounded-3xl">
                <Settings className="text-gray-700 mb-4" size={28} />
                <h3 className="text-lg font-bold text-gray-900 mb-3">Cookie Preferences</h3>
                <p className="text-sm text-gray-600 mb-4">You can change your cookie preferences at any time:</p>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[#1a8b4c]"/> Accept all cookies</li>
                  <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[#1a8b4c]"/> Accept essential cookies only</li>
                  <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[#1a8b4c]"/> Customize cookie categories</li>
                  <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[#1a8b4c]"/> Withdraw consent anytime</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6 text-sm text-yellow-800">
              <strong>Note:</strong> Disabling certain cookies may affect the functionality of our website. Essential cookies cannot be disabled as they are necessary for the website to function properly.
            </div>
          </div>

          {/* 5. Contact Section */}
          <div className="bg-[#1a8b4c] rounded-[40px] p-8 md:p-12 text-white shadow-2xl shadow-green-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-black mb-4 font-lexend">Questions About Cookies?</h2>
              <p className="text-green-50 mb-10 max-w-2xl text-lg">
                If you have any questions about our use of cookies or this Cookie Policy, please don't hesitate to contact us. Our privacy team is here to help.
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
