'use client';

import React, { useState, useEffect } from 'react';
import { Save, HelpCircle, CheckCircle2, XCircle, Settings, Globe, Type, Layout } from 'lucide-react';
import { getPartnershipSettings, savePartnershipSettings } from '../homepage/actions';

export default function AdminPartnershipPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const [settings, setSettings] = useState({
    partnershipPageSlug: 'partnership',
    partnershipPageTitle: 'Partner Network | GlobalWeblify',
    partnershipHeroTitle: 'Become a GlobalWeblify Partner',
    partnershipHeroDesc: 'We invite you to become our partner for mutually beneficial collaboration. Our company offers various partnership programs with terms tailored to businesses of all types and sizes.',
    partnershipHeading: 'Web Design Franchise of Global Webify in your City',
    partnershipDesc: 'Whether you run an agency looking to outsource development...',
    partnershipPageImage: '/partnership/Partner1.jpg',
    partnershipExpandHeading: 'Website Designing, Ecommerce Website Development, Digital Marketing, SEO - Franchise',
    partnershipExpandParagraph: 'Are you a digital marketing agency, freelancer, entrepreneur, or business professional looking to expand your services? Start your own website designing and digital solutions business with Global Webify without the need to hire a technical team or manage complex development processes.\n\nAs a Global Webify franchise partner, you get complete access to our expert development support, advanced tools, and technical assistance. We deliver modern, conversion-focused websites and powerful CRM solutions while handling full project execution behind the scenes—allowing you to focus entirely on client acquisition, brand growth, and unlimited earning potential.'
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    getPartnershipSettings()
      .then((data) => {
        if (data) {
          setSettings(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load partnership settings", err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Clean and validate slug
    let cleanSlug = settings.partnershipPageSlug.trim().toLowerCase().replace(/^\//, '').replace(/\/$/, '');
    if (!cleanSlug) {
      showToast("URL Slug cannot be empty.", "error");
      setSaving(false);
      return;
    }

    const payload = {
      ...settings,
      partnershipPageSlug: cleanSlug
    };

    const res = await savePartnershipSettings(payload);
    setSaving(false);

    if (res.success) {
      setSettings(payload);
      showToast("Franchise settings saved successfully!");
    } else {
      showToast(`Failed to save settings: ${res.error || 'Unknown error'}`, 'error');
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500 font-semibold font-poppins">Loading Franchise Settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 relative space-y-10">
      {toast && (
        <div className={`fixed top-4 right-4 md:top-8 md:right-8 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border ${
          toast.type === 'success' ? 'bg-[#1a8b4c] text-white border-[#15703d]' : 'bg-red-600 text-white border-red-700'
        } animate-in slide-in-from-top-2 fade-in duration-300 font-bold font-poppins`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <span className="text-sm tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-955 font-poppins flex items-center gap-2">
            <Settings className="text-[#1a8b4c]" /> Franchise Page Editor
          </h1>
          <p className="text-sm text-gray-500 mt-1">Configure titles, descriptions, and the active URL path for the Franchise Opportunity page.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#1a8b4c] hover:bg-[#157a41] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 font-poppins text-xs uppercase tracking-wider"
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <form onSubmit={handleSave} className="grid gap-8">
        {/* URL Slug & Browser Metadata Settings */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 font-poppins border-b border-gray-100 pb-3">
            <Globe size={18} className="text-[#1a8b4c]" /> URL Routing & Browser Metadata
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block font-poppins flex items-center gap-1.5">
                URL Slug / Path
                <span className="text-gray-400 cursor-help" title="The URL address of the franchise page (e.g. 'franchisee' or 'franchise-opportunity')"><HelpCircle size={13} /></span>
              </label>
              <div className="flex items-center">
                <span className="bg-gray-100 border border-r-0 border-gray-200 text-gray-500 px-3 py-2.5 rounded-l-xl text-xs font-semibold">/</span>
                <input
                  type="text"
                  required
                  disabled
                  value={settings.partnershipPageSlug}
                  onChange={(e) => setSettings({...settings, partnershipPageSlug: e.target.value})}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-r-xl px-3 py-2.5 text-xs font-semibold text-gray-400 cursor-not-allowed focus:outline-none"
                  placeholder="franchisee"
                />
              </div>
              <span className="text-[9px] text-amber-600 font-bold uppercase tracking-wider mt-1">
                ⚠️ URL slugs cannot be edited after creation to prevent broken links.
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block font-poppins">Browser Meta Title</label>
              <input
                type="text"
                required
                value={settings.partnershipPageTitle}
                onChange={(e) => setSettings({...settings, partnershipPageTitle: e.target.value})}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#1a8b4c]"
                placeholder="Partner Network | GlobalWeblify"
              />
            </div>
          </div>
        </div>

        {/* Hero Section Config */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 font-poppins border-b border-gray-100 pb-3">
            <Type size={18} className="text-[#1a8b4c]" /> Page Hero Header
          </h2>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block font-poppins">Hero Main Heading</label>
            <input
              type="text"
              required
              value={settings.partnershipHeroTitle}
              onChange={(e) => setSettings({...settings, partnershipHeroTitle: e.target.value})}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#1a8b4c]"
              placeholder="Become a GlobalWeblify Partner"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block font-poppins">Hero Subtitle / Description</label>
            <textarea
              required
              rows={3}
              value={settings.partnershipHeroDesc}
              onChange={(e) => setSettings({...settings, partnershipHeroDesc: e.target.value})}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#1a8b4c] resize-none"
              placeholder="We invite you to become our partner..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block font-poppins">Hero Side Image Path</label>
            <input
              type="text"
              required
              value={settings.partnershipPageImage}
              onChange={(e) => setSettings({...settings, partnershipPageImage: e.target.value})}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#1a8b4c]"
              placeholder="/partnership/Partner1.jpg"
            />
          </div>
        </div>

        {/* 4-Card Franchise Description Config */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 font-poppins border-b border-gray-100 pb-3">
            <Layout size={18} className="text-[#1a8b4c]" /> Franchise Description Section (Below Hero)
          </h2>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block font-poppins">Main Description Title</label>
            <input
              type="text"
              required
              value={settings.partnershipHeading}
              onChange={(e) => setSettings({...settings, partnershipHeading: e.target.value})}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#1a8b4c]"
              placeholder="Web Design Franchise of Global Webify in your City"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block font-poppins">Blue Subtitle</label>
            <textarea
              required
              rows={2}
              value={settings.partnershipExpandHeading}
              onChange={(e) => setSettings({...settings, partnershipExpandHeading: e.target.value})}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#1a8b4c] resize-none"
              placeholder="Website Designing, Ecommerce Website Development..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block font-poppins">Description Paragraphs</label>
              <div className="flex items-center gap-3 text-[11px] font-bold">
                <span className="text-gray-500">
                  Words: <strong className="text-gray-800">{settings.partnershipExpandParagraph ? settings.partnershipExpandParagraph.trim().split(/\s+/).filter(Boolean).length : 0}</strong>
                </span>
                <span className={`px-2 py-0.5 rounded ${
                  (settings.partnershipExpandParagraph?.length || 0) > 1500 ? 'bg-red-100 text-red-700' : 'bg-[#1a8b4c]/10 text-[#1a8b4c]'
                }`}>
                  Chars: <strong>{settings.partnershipExpandParagraph?.length || 0}</strong> / 1621 limit
                </span>
              </div>
            </div>
            <textarea
              required
              rows={8}
              maxLength={1621}
              value={settings.partnershipExpandParagraph}
              onChange={(e) => setSettings({...settings, partnershipExpandParagraph: e.target.value})}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#1a8b4c]"
              placeholder="Write multiple paragraphs separated by new lines..."
            />
          </div>
        </div>




      </form>
    </div>
  );
}
