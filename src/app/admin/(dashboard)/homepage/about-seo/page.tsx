'use client';

import React, { useState, useEffect } from 'react';
import { Save, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { getAboutSeo, saveAboutSeo } from '../actions';
import RichTextInlineEditor from '@/components/admin/RichTextInlineEditor';

export default function AboutSeoSettingsPage() {
  const [aboutSeo, setAboutSeo] = useState<{ title: string; subtitle: string; content: string }>({
    title: '',
    subtitle: '',
    content: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    getAboutSeo()
      .then((data) => {
        setAboutSeo({
          title: data?.title || '',
          subtitle: data?.subtitle || '',
          content: data?.content || ''
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load about seo settings", err);
        setLoading(false);
      });
  }, []);

  const updateField = (field: 'title' | 'subtitle' | 'content', value: string) => {
    setAboutSeo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Since we reverted the city dropdown, we save to the default key
    const res = await saveAboutSeo('default', aboutSeo);
    setSaving(false);
    
    if (res.success) {
      showToast("About SEO settings saved successfully!");
    } else {
      showToast(`Failed to save: ${res.error || 'Unknown error'}`, 'error');
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500 font-semibold font-lexend">Loading About SEO Settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 relative">
      {toast && (
        <div className={`fixed top-4 right-4 md:top-8 md:right-8 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border ${
          toast.type === 'success' ? 'bg-[#1a8b4c] text-white border-[#15703d]' : 'bg-red-600 text-white border-red-700'
        } animate-in slide-in-from-top-2 fade-in duration-300 font-bold font-lexend`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <span className="text-sm tracking-wide">{toast.message}</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 font-lexend flex items-center gap-2">
            <FileText className="text-[#1a8b4c]" /> About SEO Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage the content of the detailed "About & SEO" description section of your homepage.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#1a8b4c] hover:bg-[#157a41] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md disabled:opacity-50 font-lexend"
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2 font-lexend">Section Title</label>
          <RichTextInlineEditor
            placeholder="Section Title..."
            value={aboutSeo.title}
            onChange={(val) => updateField('title', val)}
            singleLine={true}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2 font-lexend">Section Subtitle</label>
          <input
            type="text"
            placeholder="Section Subtitle..."
            value={aboutSeo.subtitle}
            onChange={(e) => updateField('subtitle', e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#1a8b4c]"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2 font-lexend">Unified Body Description Content (HTML Rich Editor)</label>
          <RichTextInlineEditor
            placeholder="Write the full body content here. Press Enter to create new paragraphs. Use formatting like Headings, Lists, Bold, Italic, Links and Green Highlights."
            value={aboutSeo.content}
            onChange={(val) => updateField('content', val)}
            singleLine={false}
          />
          <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
            Tip: Highlight text to apply formatting. Use HTML code toggle mode for manual customization.
          </p>
        </div>
      </div>
    </div>
  );
}
