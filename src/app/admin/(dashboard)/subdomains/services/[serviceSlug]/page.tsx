'use client';

import React, { useState, useEffect } from 'react';
import { Save, Sparkles, ArrowLeft, CheckCircle2, XCircle, Plus, Trash2, GripVertical } from 'lucide-react';
import Link from 'next/link';
import { getSubdomainContent, saveSubdomainContent } from '../../actions';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/features/admin/components/shared/ContentEditor'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-50 animate-pulse rounded-xl border-2 border-gray-100 flex items-center justify-center text-gray-400 font-bold font-poppins">Loading Editor...</div>
});

export default function SubdomainServicesSettings({ params }: { params: { serviceSlug: string } }) {
  const selectedSlug = params.serviceSlug;
  
  const [data, setData] = useState({ 
    title: '', 
    heroTitle: '',
    heroDescription: '', 
    seoTitle: '', 
    seoDescription: '', 
    seoKeywords: '',
    content: '' 
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);

  // Removed global services list fetch since we use params.serviceSlug

  useEffect(() => {
    if (!selectedSlug) return;
    setLoading(true);
    getSubdomainContent(selectedSlug)
      .then(res => {
        if (res) {
          let parsedFaqs = [];
          let rawContent = res.content || '';
          
          const matches = Array.from(rawContent.matchAll(/<!-- FAQ_DATA: (.*?) -->/g));
          if (matches && matches.length > 0) {
            const lastMatch = matches[matches.length - 1];
            try {
              parsedFaqs = JSON.parse(lastMatch[1]);
            } catch (e) {
              console.error("Failed to parse FAQ data", e);
            }
            rawContent = rawContent.replace(/<!-- FAQ_DATA: (.*?) -->/g, '');
          }

          if (parsedFaqs.length === 0) {
            parsedFaqs = [
              { question: '', answer: '' },
              { question: '', answer: '' },
              { question: '', answer: '' }
            ];
          }
          setFaqs(parsedFaqs);

          setData({
            title: res.title || '',
            heroTitle: res.heroTitle || '',
            heroDescription: res.heroDescription || '',
            seoTitle: res.seoTitle || '',
            seoDescription: res.seoDescription || '',
            seoKeywords: res.seoKeywords || '',
            content: rawContent,
          });
        } else {
          // Reset if no template exists yet
          setData({ title: '', heroTitle: '', heroDescription: '', seoTitle: '', seoDescription: '', seoKeywords: '', content: '' });
          setFaqs([
              { question: '', answer: '' },
              { question: '', answer: '' },
              { question: '', answer: '' }
          ]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load subdomain service content", err);
        setLoading(false);
      });
  }, [selectedSlug]);

  const handleSave = async () => {
    if (!selectedSlug) return;
    setSaving(true);
    
    const filteredFaqs = faqs.filter(f => f.question.trim() !== '' && f.answer.trim() !== '');
    const finalContent = data.content + (filteredFaqs.length > 0 ? `\n<!-- FAQ_DATA: ${JSON.stringify(filteredFaqs)} -->` : '');
    
    const res = await saveSubdomainContent({ pageType: selectedSlug, ...data, content: finalContent });
    setSaving(false);
    if (res.success) {
      showToast("Service Subdomain Template saved!");
    } else {
      showToast(`Error: ${res.error || 'Failed to save'}`, 'error');
    }
  };

  return (
    <div className="w-full font-sans relative">
      {toast && (
        <div className={`fixed top-6 right-6 z-[9999] px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 border ${
          toast.type === 'success' ? 'bg-[#1a8b4c] text-white border-[#15703d]' : 'bg-red-600 text-white border-red-700'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <span className="text-sm tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Back button */}
      <div className="mb-6 flex justify-between items-center">
        <Link
          href="/admin/subdomains/services"
          className="inline-flex items-center gap-2 text-[#1a8b4c] font-black text-xs uppercase tracking-wider hover:gap-3 transition-all font-poppins"
        >
          <ArrowLeft size={14} className="stroke-[2.5]" /> Back to Service Templates
        </Link>
        <button
          onClick={handleSave}
          disabled={saving || loading || !selectedSlug}
          className="bg-[#1a8b4c] hover:bg-[#157a41] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md disabled:opacity-50 font-poppins text-xs uppercase tracking-wider whitespace-nowrap"
        >
          <Save size={14} /> {saving ? 'Saving...' : 'Save Template'}
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400 font-semibold font-poppins">Loading Template...</div>
      ) : (
        <div className="flex flex-col gap-6">
          
          {/* Core Details Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest font-poppins">
                Market Area Details
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                Service template for {selectedSlug}
              </p>
            </div>

            {/* Dynamic Location Tip */}
            <div className="bg-[#f0fdf4] border border-green-200/50 rounded-2xl p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#1a8b4c] shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] font-black text-gray-950 mb-0.5">SEO Pro Tip: Dynamic Location Pages</p>
                <p className="text-[11px] text-gray-600 font-semibold leading-relaxed">
                  Use the placeholder <code className="bg-[#e4f8ec] px-1.5 py-0.5 rounded font-mono font-black text-[#1a8b4c]">{"{location}"}</code> inside your title, headlines, description, or content editor. When viewed under market-area URL paths, it will automatically render the location name!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              
              {/* Hero Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                  Hero Section Title * <span className="text-[#1a8b4c] normal-case tracking-normal font-semibold ml-1">Supports {'{location}'}</span>
                </label>
                <input
                  type="text"
                  required
                  value={data.heroTitle}
                  onChange={(e) => setData({...data, heroTitle: e.target.value})}
                  placeholder="e.g. Web Development in {location}"
                  className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all"
                />
              </div>

              {/* Hero Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                  Hero Section Description <span className="text-[#1a8b4c] normal-case tracking-normal font-semibold ml-1">Supports {'{location}'}</span>
                </label>
                <textarea
                  rows={2}
                  value={data.heroDescription}
                  onChange={(e) => setData({...data, heroDescription: e.target.value})}
                  maxLength={260}
                  placeholder="Description text shown in the hero section..."
                  className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all resize-none"
                />
                <div className="flex justify-between items-center w-full mt-0.5 px-1">
                  <span className="text-[10px] text-[#1a8b4c] font-semibold tracking-wide flex items-center gap-1">
                    ⚠️ Note: Hero descriptions are limited to 260 characters to fit perfectly within the hero banner and avoid breaking the UI layout.
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">
                    {data.heroDescription.length} / 260 characters
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* SEO Settings Card - HIGHLIGHTED */}
          <div className="bg-gradient-to-br from-blue-50 to-[#f0f9ff] border-2 border-blue-200 rounded-2xl p-7 shadow-lg shadow-blue-100/50 space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-xl uppercase tracking-widest shadow-md">
              High Priority SEO
            </div>
            <div className="border-b border-blue-200/60 pb-3">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest font-poppins flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#1a8b4c]" /> SEO Metadata Properties
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                Search engine optimization and rankings
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">SEO Title <span className="text-[#1a8b4c] normal-case tracking-normal font-semibold ml-1">Supports {'{location}'}</span></label>
                <input
                  type="text"
                  value={data.seoTitle}
                  onChange={(e) => setData({...data, seoTitle: e.target.value})}
                  placeholder="SEO Friendly Page Title"
                  className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all"
                />
              </div>
              
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">SEO Meta Description <span className="text-[#1a8b4c] normal-case tracking-normal font-semibold ml-1">Supports {'{location}'}</span></label>
                <textarea
                  rows={2}
                  value={data.seoDescription}
                  onChange={(e) => setData({...data, seoDescription: e.target.value})}
                  placeholder="A compelling summary of the page for search result listings..."
                  className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all resize-none"
                />
                <div className="flex justify-end items-center w-full mt-0.5 px-1">
                  <span className="text-[10px] font-bold text-gray-400">
                    {data.seoDescription.length} characters
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">SEO Keywords <span className="text-[#1a8b4c] normal-case tracking-normal font-semibold ml-1">Comma separated. Supports {'{location}'}</span></label>
                <textarea
                  rows={2}
                  value={data.seoKeywords}
                  onChange={(e) => setData({...data, seoKeywords: e.target.value})}
                  placeholder="e.g. Web Development {location}, SEO {location}"
                  className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all resize-none"
                />
              </div>
              
            </div>
          </div>

          {/* Content Pane Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest font-poppins">
                Page Content HTML *
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                Main body content. Use <span className="text-[#1a8b4c]">{'{location}'}</span> directly in the text!
              </p>
            </div>
            
            {/* Title / Content Section Headline */}
            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                Content Section Headline (H1 Title) * <span className="text-[#1a8b4c] normal-case tracking-normal font-semibold ml-1">Supports {'{location}'}</span>
              </label>
              <input
                type="text"
                required
                value={data.title}
                onChange={(e) => setData({...data, title: e.target.value})}
                placeholder="e.g. Professional Services in {location}"
                className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all"
              />
            </div>
            
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">
                  Service Content HTML *
                </label>
                <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all bg-white text-[#2CA65A] shadow-sm"
                  >
                    Write / Edit
                  </button>
                </div>
              </div>

              <Editor 
                content={data.content} 
                setContent={(val) => setData({...data, content: val})} 
                placeholder={`Start drafting your premium ${selectedSlug} template here...`}
              />
            </div>
          </div>

          {/* FAQs Pane Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest font-poppins">
                  Frequently Asked Questions
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  Manage FAQs for this market area service template. Supports <span className="text-[#1a8b4c]">{'{location}'}</span> placeholder.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}
                className="px-3 py-1.5 bg-green-50 text-[#1a8b4c] border border-green-200 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-green-100 transition-colors"
              >
                <Plus size={14} /> Add FAQ
              </button>
            </div>
            
            <div className="space-y-4 pt-2">
              {faqs.map((faq, index) => (
                <div key={index} className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50 group">
                  <div className="pt-2 cursor-grab text-gray-300">
                    <GripVertical size={16} />
                  </div>
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      placeholder="Question... (e.g. Do you offer services in {location}?)"
                      value={faq.question}
                      onChange={(e) => {
                        const newFaqs = [...faqs];
                        newFaqs[index].question = e.target.value;
                        setFaqs(newFaqs);
                      }}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-[#1a8b4c]"
                    />
                    <textarea
                      placeholder="Answer..."
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => {
                        const newFaqs = [...faqs];
                        newFaqs[index].answer = e.target.value;
                        setFaqs(newFaqs);
                      }}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a8b4c] resize-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setFaqs(faqs.filter((_, i) => i !== index))}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    title="Remove FAQ"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {faqs.length === 0 && (
                <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
                  No FAQs added for this service template.
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
