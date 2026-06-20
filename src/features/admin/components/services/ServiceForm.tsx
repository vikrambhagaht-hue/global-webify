'use client';

import React, { useState } from 'react';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { saveService } from '@/app/admin/(dashboard)/services/actions';
import { Upload, ArrowLeft, Sparkles, CheckCircle2, XCircle, Plus, Trash2, GripVertical } from 'lucide-react';
import Link from 'next/link';
import ContentEditor from '@/features/admin/components/shared/ContentEditor';

import { useSearchParams, useRouter } from 'next/navigation';

interface Service {
  id?: number;
  title: string;
  contentTitle?: string;
  slug: string;
  category: string;
  seoTitle?: string;
  seoDescription?: string;
  heroDescription?: string;
  seoKeywords?: string;
  content: string;
  image?: string;
  bgType?: string;
  bgColor?: string;
  bgGradientStart?: string;
  bgGradientEnd?: string;
  mobileImage?: string;
  bgImage?: string;
}

export default function ServiceForm({ service }: { service?: Service }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryCat = searchParams.get('category') || 'website';

  const [title, setTitle] = useState(service?.title || '');
  const [contentTitle, setContentTitle] = useState(service?.contentTitle || '');
  const [slug, setSlug] = useState(service?.slug || '');
  const [category, setCategory] = useState(service?.category || queryCat);
  const [seoTitle, setSeoTitle] = useState(service?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(service?.seoDescription || '');
  const [heroDescription, setHeroDescription] = useState(service?.heroDescription || '');
  const [seoKeywords, setSeoKeywords] = useState(service?.seoKeywords || '');
  const [bgType, setBgType] = useState(service?.bgType || 'image');
  const [bgColor, setBgColor] = useState(service?.bgColor || '#062013');
  const [bgGradientStart, setBgGradientStart] = useState(service?.bgGradientStart || '#062013');
  const [bgGradientEnd, setBgGradientEnd] = useState(service?.bgGradientEnd || '#0c3e25');
  const [mobileImage, setMobileImage] = useState(service?.mobileImage || '');
  const [bgImage, setBgImage] = useState(service?.bgImage || '');
  let initialFaqs = [];
  let initialContent = service?.content || '';

  if (initialContent) {
    const matches = Array.from(initialContent.matchAll(/<!-- FAQ_DATA: (.*?) -->/g));
    if (matches && matches.length > 0) {
      const lastMatch = matches[matches.length - 1];
      try {
        initialFaqs = JSON.parse(lastMatch[1]);
      } catch (e) {
        console.error("Failed to parse FAQ data", e);
      }
    }
    initialContent = initialContent.replace(/<!-- FAQ_DATA: (.*?) -->/g, '');
  }

  if (!service?.id && initialFaqs.length === 0) {
    initialFaqs = [
      { question: '', answer: '' },
      { question: '', answer: '' },
      { question: '', answer: '' },
      { question: '', answer: '' },
    ];
  }

  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>(initialFaqs);
  const [content, setContent] = useState(initialContent);
  const [image, setImage] = useState(service?.image || '');
  
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Auto-suggest slug based on title (only if we're creating a new service)
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!service?.id) {
      const suggestedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(suggestedSlug ? `/${suggestedSlug}` : '');
    }
  };

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImage(data.url);
        showToast('Image uploaded successfully!', 'success');
      } else {
        showToast('Upload failed: ' + data.message, 'error');
      }
    } catch (err) {
      showToast('Upload failed. Please check XAMPP connection.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Desktop Background Image upload handler
  const handleBgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setBgImage(data.url);
        showToast('Desktop background image uploaded successfully!', 'success');
      } else {
        showToast('Upload failed: ' + data.message, 'error');
      }
    } catch (err) {
      showToast('Upload failed. Please check connection.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setSaving(true);
    try {
      const filteredFaqs = faqs.filter(f => f.question.trim() !== '' && f.answer.trim() !== '');

      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: service?.id,
          title,
          contentTitle,
          slug,
          category,
          seoTitle,
          seoDescription,
          heroDescription,
          seoKeywords,
          content: content + (filteredFaqs.length > 0 ? `\n<!-- FAQ_DATA: ${JSON.stringify(filteredFaqs)} -->` : ''),
          image,
          bgType,
          bgColor,
          bgGradientStart,
          bgGradientEnd,
          mobileImage,
          bgImage,
        }),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.error || 'Failed to save service page');
      }
      
      showToast('Service page saved successfully!', 'success');
      router.refresh();
      
      // If it is a newly created service, transition to its edit view to stay on the editor page
      if (!service?.id && res.success && res.slug) {
        setTimeout(() => {
          const cleanSlug = res.slug.replace(/^\//, '');
          router.push(`/admin/services/${cleanSlug}`);
        }, 1500);
      }
      
    } catch (err) {
      if (isRedirectError(err)) {
        throw err;
      }
      console.error('Form Submit Error:', err);
      showToast('Error saving content: ' + (err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBackground = async () => {
    if (!service?.id) {
      showToast('Please save the page first before configuring a custom background.', 'error');
      return;
    }
    setSaving(true);
    try {
      const response = await fetch('/api/admin/services/background', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: service.id,
          bgType,
          bgColor,
          bgGradientStart,
          bgGradientEnd,
          mobileImage,
          bgImage,
          slug: service.slug
        }),
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.error || 'Failed to save background settings');
      }
      showToast('Hero background style saved successfully!', 'success');
      router.refresh();
    } catch (err) {
      console.error(err);
      showToast('Error saving background: ' + (err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full font-sans relative">
      
      {/* Toast Notification Overlay */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[9999] px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 border ${
          toast.type === 'success' ? 'bg-[#1a8b4c] text-white border-[#15703d]' : 'bg-red-600 text-white border-red-700'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <span className="text-sm tracking-wide">{toast.message}</span>
        </div>
      )}
      
      {/* Back button */}
      <div className="mb-6">
        <Link
          href={`/admin/services?category=${category}`}
          className="inline-flex items-center gap-2 text-[#1a8b4c] font-black text-xs uppercase tracking-wider hover:gap-3 transition-all font-poppins"
        >
          <ArrowLeft size={14} className="stroke-[2.5]" /> Back to {category} services
        </Link>
      </div>

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
        
        {/* Core Details Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest font-poppins">
              Service Details
            </h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              General settings and page routing
            </p>
          </div>

          {/* Dynamic Location Tip */}
          <div className="bg-[#f0fdf4] border border-green-200/50 rounded-2xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#1a8b4c] shrink-0 mt-0.5" />
            <div>
              <p className="text-[12px] font-black text-gray-950 mb-0.5">SEO Pro Tip: Dynamic Location Pages</p>
              <p className="text-[11px] text-gray-600 font-semibold leading-relaxed">
                Use the placeholder <code className="bg-[#e4f8ec] px-1.5 py-0.5 rounded font-mono font-black text-[#1a8b4c]">{"{location}"}</code> inside your title, headlines, description, or content editor. When viewed under market-area URL paths (e.g. <code className="font-mono">/delhi/web-development</code>), it will automatically render the location name (e.g. "Delhi")!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                Hero Section Title (Page Title) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Instagram Marketing Services"
                className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all"
              />
            </div>

            {/* Hero Description */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Hero Section Description <span className="text-[#1a8b4c] normal-case tracking-normal font-semibold ml-1">Supports {'{location}'}</span></label>
              <textarea
                rows={2}
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                maxLength={260}
                placeholder="Description text shown in the hero section (e.g. Get dynamic, high-performance services...)"
                className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all resize-none"
              />
              <div className="flex justify-between items-center w-full mt-0.5 px-1">
                <span className="text-[10px] text-[#1a8b4c] font-semibold tracking-wide flex items-center gap-1">
                  ⚠️ Note: Hero descriptions are limited to 260 characters to fit perfectly within the hero banner and avoid breaking the UI layout.
                </span>
                <span className="text-[10px] font-bold text-gray-400">
                  {heroDescription.length} / 260 characters
                </span>
              </div>
            </div>

            {/* Slug */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                Page Slug (URL Path) *
              </label>
              <input
                type="text"
                required
                disabled={!!service?.id}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. /instagram-marketing"
                className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs md:text-sm font-mono font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              />
              {service?.id && (
                <span className="text-[9px] text-amber-600 font-bold uppercase tracking-wider">
                  ⚠️ URL slugs cannot be edited after page creation to prevent broken links.
                </span>
              )}
            </div>


            {/* Image banner upload */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                  Banner / Icon Image URL
                </label>
                <div className="flex gap-3">
                  {image !== (service?.image || '') && (
                    <button
                      type="button"
                      onClick={() => {
                        setImage(service?.image || '');
                        showToast('Reverted to original photo settings.', 'success');
                      }}
                      className="text-[10px] font-bold text-amber-600 hover:text-amber-800 hover:underline uppercase tracking-wider transition-colors"
                    >
                      Revert changes
                    </button>
                  )}
                  {image && (
                    <button
                      type="button"
                      onClick={() => {
                        setImage('');
                        showToast('Image cleared. Card will now fall back to default icon.', 'success');
                      }}
                      className="text-[10px] font-bold text-red-600 hover:text-red-800 hover:underline uppercase tracking-wider transition-colors"
                    >
                      Delete / Clear Image
                    </button>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  disabled={saving || uploading}
                  placeholder="/uploads/banner.png"
                  className="flex-grow bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs md:text-sm font-mono font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all disabled:opacity-50"
                />
                <label htmlFor="card-thumbnail-upload" className={`bg-gray-100 border border-gray-200 px-4 rounded-xl flex items-center justify-center transition-colors text-gray-600 ${
                  saving || uploading ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-200 cursor-pointer'
                }`}>
                  {uploading ? (
                    <svg className="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Upload size={16} />
                  )}
                </label>
                <input
                  id="card-thumbnail-upload"
                  type="file"
                  accept="image/*"
                  disabled={saving || uploading}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              {image && (
                <div className="mt-2 relative w-48 h-28 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center p-2 group">
                  <img
                    src={image}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage('');
                      showToast('Image cleared. Card will now fall back to default icon.', 'success');
                    }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 animate-fadeIn"
                    title="Delete / Clear Image"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Hero Background Type Select & Config */}
            <div className="flex flex-col gap-3 md:col-span-2 border-t border-gray-100 pt-5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                Select Active Hero Background Style (Tick Option)
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {[
                  { id: 'default', label: 'Use default fallback banner image', desc: 'Shows standard site-wide banner (/web-dev-banner-bg.png)' },
                  { id: 'image', label: 'Use custom uploaded background image', desc: 'Allows setting a custom background image file (responsive on all devices)' },
                  { id: 'color', label: 'Use solid background color', desc: 'Shows solid hex color code on the banner' },
                  { id: 'gradient', label: 'Use gradient background colors', desc: 'Creates a linear transition between two hex colors' },
                ].map((type) => (
                  <label
                    key={type.id}
                    className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                      bgType === type.id
                        ? 'bg-green-50/50 border-[#1a8b4c] shadow-sm'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="bgType"
                      checked={bgType === type.id}
                      onChange={() => setBgType(type.id)}
                      className="mt-0.5 w-4.5 h-4.5 text-[#1a8b4c] border-gray-300 focus:ring-[#1a8b4c] cursor-pointer"
                    />
                    <div className="flex flex-col gap-0.5 select-none">
                      <span className="text-xs font-bold text-gray-900">{type.label}</span>
                      <span className="text-[10px] text-gray-500 font-semibold">{type.desc}</span>
                    </div>
                  </label>
                ))}
              </div>

              {bgType === 'image' && (
                <div className="flex flex-col gap-4 mt-2">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/50 flex flex-col gap-1.5">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                      Background Image Design Guidelines
                    </span>
                    <ul className="text-[11px] text-gray-600 font-semibold space-y-1 pl-4 list-disc">
                      <li>Recommended Size: <strong>1920px (Width) x 1080px (Height) [16:9]</strong> or similar widescreen banner resolution.</li>
                      <li>For best page speed (SEO), upload modern <strong>WebP</strong> images compressed under <strong>150 KB</strong>.</li>
                      <li>The hero section automatically fits and centers whatever resolution is uploaded responsively across all screens using standard cover scaling.</li>
                    </ul>
                  </div>

                  {/* Desktop Background Image Upload */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                        Desktop Background Image URL *
                      </label>
                      <div className="flex gap-3">
                        {bgImage !== (service?.bgImage || '') && (
                          <button
                            type="button"
                            onClick={() => {
                              setBgImage(service?.bgImage || '');
                              showToast('Reverted to original desktop photo settings.', 'success');
                            }}
                            className="text-[10px] font-bold text-amber-600 hover:text-amber-800 hover:underline uppercase tracking-wider transition-colors"
                          >
                            Revert changes
                          </button>
                        )}
                        {bgImage && (
                          <button
                            type="button"
                            onClick={() => {
                              setBgImage('');
                              showToast('Desktop background image cleared.', 'success');
                            }}
                            className="text-[10px] font-bold text-red-600 hover:text-red-800 hover:underline uppercase tracking-wider transition-colors"
                          >
                            Delete / Clear
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={bgImage}
                        onChange={(e) => setBgImage(e.target.value)}
                        disabled={saving || uploading}
                        placeholder="/uploads/banner.png"
                        className="flex-grow bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs md:text-sm font-mono font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all disabled:opacity-50"
                      />
                      <label htmlFor="desktop-bg-upload" className={`bg-gray-100 border border-gray-200 px-4 rounded-xl flex items-center justify-center transition-colors text-gray-600 ${
                        saving || uploading ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-200 cursor-pointer'
                      }`}>
                        {uploading ? (
                          <svg className="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <Upload size={16} />
                        )}
                      </label>
                      <input
                        id="desktop-bg-upload"
                        type="file"
                        accept="image/*"
                        disabled={saving || uploading}
                        onChange={handleBgImageUpload}
                        className="hidden"
                      />
                    </div>

                    {bgImage && (
                      <div className="mt-2 relative w-48 h-28 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center p-2 group">
                        <img
                          src={bgImage}
                          alt="Desktop Preview"
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setBgImage('');
                            showToast('Desktop image cleared.', 'success');
                          }}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 animate-fadeIn"
                          title="Delete / Clear Desktop Image"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {bgType === 'color' && (
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                      Select Solid Color
                    </label>
                    {bgColor !== (service?.bgColor || '#062013') && (
                      <button
                        type="button"
                        onClick={() => {
                          setBgColor(service?.bgColor || '#062013');
                          showToast('Reverted to original color settings.', 'success');
                        }}
                        className="text-[10px] font-bold text-amber-600 hover:text-amber-800 hover:underline uppercase tracking-wider transition-colors"
                      >
                        Revert changes
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-10 border-0 rounded-lg cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      placeholder="#062013"
                      className="bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2 text-xs md:text-sm font-mono font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c]"
                    />
                  </div>
                </div>
              )}

              {bgType === 'gradient' && (
                <div className="flex flex-col gap-4 mt-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                      Gradient Configuration
                    </label>
                    {(bgGradientStart !== (service?.bgGradientStart || '#062013') || bgGradientEnd !== (service?.bgGradientEnd || '#0c3e25')) && (
                      <button
                        type="button"
                        onClick={() => {
                          setBgGradientStart(service?.bgGradientStart || '#062013');
                          setBgGradientEnd(service?.bgGradientEnd || '#0c3e25');
                          showToast('Reverted to original gradient settings.', 'success');
                        }}
                        className="text-[10px] font-bold text-amber-600 hover:text-amber-800 hover:underline uppercase tracking-wider transition-colors"
                      >
                        Revert changes
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                        Gradient Start Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={bgGradientStart}
                          onChange={(e) => setBgGradientStart(e.target.value)}
                          className="w-10 h-10 border-0 rounded-lg cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={bgGradientStart}
                          onChange={(e) => setBgGradientStart(e.target.value)}
                          placeholder="#062013"
                          className="bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2 text-xs md:text-sm font-mono font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                        Gradient End Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={bgGradientEnd}
                          onChange={(e) => setBgGradientEnd(e.target.value)}
                          className="w-10 h-10 border-0 rounded-lg cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={bgGradientEnd}
                          onChange={(e) => setBgGradientEnd(e.target.value)}
                          placeholder="#0c3e25"
                          className="bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2 text-xs md:text-sm font-mono font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Separate Background Save Button */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                {service?.id ? (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSaveBackground}
                      disabled={saving}
                      className="bg-gray-950 hover:bg-gray-800 text-white font-bold px-4 py-2.5 rounded-xl transition-all text-xs uppercase tracking-wider shadow-sm flex items-center gap-2"
                    >
                      <span>Save Background Style Only</span>
                    </button>
                    {(bgType !== 'image' || bgImage || mobileImage || bgColor !== '#062013' || bgGradientStart !== '#062013' || bgGradientEnd !== '#0c3e25') && (
                      <button
                        type="button"
                        onClick={() => {
                          setBgType('image');
                          setBgImage('');
                          setMobileImage('');
                          setBgColor('#062013');
                          setBgGradientStart('#062013');
                          setBgGradientEnd('#0c3e25');
                          showToast('Reset background to site-wide default fallback image. Make sure to click save.', 'success');
                        }}
                        className="px-4 py-2.5 text-xs font-bold rounded-xl border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-50 transition-all uppercase tracking-wider"
                      >
                        Reset to Default Background
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-400 font-semibold italic">
                    Note: Save the page once globally to enable separate background styling updates.
                  </span>
                )}
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
          
          <div className="grid grid-cols-1 gap-5">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">SEO Title (Overrides heading) <span className="text-[#1a8b4c] normal-case tracking-normal font-semibold ml-1">Supports {'{location}'}</span></label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                maxLength={255}
                placeholder="SEO Friendly Page Title"
                className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all"
              />
            </div>
            
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">SEO Keywords (Comma separated)</label>
              <textarea
                rows={2}
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
                className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">SEO Meta Description <span className="text-[#1a8b4c] normal-case tracking-normal font-semibold ml-1">Supports {'{location}'}</span></label>
              <textarea
                rows={2}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                maxLength={500}
                placeholder="A compelling summary of the page for search result listings..."
                className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all resize-none"
              />
              <div className="flex justify-end items-center w-full mt-0.5 px-1">
                <span className="text-[10px] font-bold text-gray-400">
                  {seoDescription.length} / 500 characters
                </span>
              </div>
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
              Draft and structure the main body of the service page
            </p>
          </div>

          {/* Content Headline */}
          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
              Content Section Headline (H2 Title)
            </label>
            <input
              type="text"
              value={contentTitle}
              onChange={(e) => setContentTitle(e.target.value)}
              placeholder="e.g. Professional Web Design Services to Build a Strong Online Presence"
              className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all"
            />
          </div>

          <div className="mt-2 border-t border-gray-100 pt-4">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2 block">
              Body Content
            </label>
            <ContentEditor 
              content={content} 
              setContent={setContent} 
              placeholder="Start drafting your premium page content here..."
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
                Manage FAQs that appear at the bottom of the page
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
                    placeholder="Question..."
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
                No FAQs added for this service.
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 mt-4">
          <Link
            href={`/admin/services?category=${category}`}
            className={`border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-2.5 px-5 rounded-xl text-xs uppercase tracking-wider font-poppins flex items-center gap-1 ${
              saving || uploading ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || uploading}
            className="bg-[#1a8b4c] hover:bg-[#15703d] text-white font-black py-2.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Page Content'
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
