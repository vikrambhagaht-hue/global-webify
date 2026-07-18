'use client';

import React, { useState, useEffect } from 'react';
import { saveBlogPost } from '@/app/admin/(dashboard)/blogs/actions';
import { Upload, ArrowLeft, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { adminFetch } from '@/lib/adminFetch';
import ContentEditor from '@/features/admin/components/shared/ContentEditor';

interface BlogPost {
  id?: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image?: string;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}


export default function BlogPostForm({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug ? post.slug.replace('/blog/', '') : '');
  const [summary, setSummary] = useState(post?.summary || '');
  const [content, setContent] = useState(post?.content || '');
  const [image, setImage] = useState(post?.image || '');
  const [isActive, setIsActive] = useState(post ? post.isActive : true);
  
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription || '');
  const [seoKeywords, setSeoKeywords] = useState(post?.seoKeywords || '');

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  // TOC Injector State
  const [tocTitle, setTocTitle] = useState('');
  const [tocLevel, setTocLevel] = useState<'h2'|'h3'|'h4'>('h2');
  const [tocColor, setTocColor] = useState('#2CA65A');

  // Helper to extract H2 and H3 headings from content HTML string for TOC preview
  const extractHeadings = (html: string): { text: string; level: number }[] => {
    if (!html) return [];
    
    const headingRegex = /<h([23])[^>]*>(.*?)<\/h\1>/gi;
    const headings: { text: string; level: number }[] = [];
    let match;
    
    while ((match = headingRegex.exec(html)) !== null) {
      const cleanText = match[2].replace(/<[^>]+>/g, '').trim();
      if (cleanText) {
        headings.push({
          text: cleanText,
          level: parseInt(match[1], 10)
        });
      }
    }
    return headings;
  };

  const getProcessedPreviewHtml = (html: string) => {
    if (!html) return '';
    // Replace location placeholders
    let processed = html.replace(/\{\s*location\s*\}/gi, 'Ranchi'); // Fallback location
    // Inject IDs into H2 and H3 tags for preview targeting
    processed = processed.replace(/<(h2|h3)([^>]*)>([\s\S]*?)<\/h[23]>/gi, (match, tag, attrs, innerHtml) => {
      const text = innerHtml.replace(/<[^>]*>/g, '').trim();
      const slugId = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const cleanAttrs = attrs.replace(/\bid\s*=\s*['"][^'"]*['"]/gi, '').trim();
      return `<${tag} id="preview-${slugId}" ${cleanAttrs}>${innerHtml}</${tag}>`;
    });
    return processed;
  };

  const handlePreviewTocClick = (e: React.MouseEvent, slugId: string) => {
    e.preventDefault();
    const element = document.getElementById(`preview-${slugId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Auto slug suggestor on title changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!post?.id) {
      const suggestedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(suggestedSlug);
    }
  };

  const compressImage = (file: File): Promise<Blob | null> => {
    return new Promise((resolve, reject) => {
      // Don't compress SVGs or non-images
      if (!file.type.startsWith("image/") || file.type === "image/svg+xml" || file.type === "image/gif") {
        resolve(file);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(file);
            return;
          }
          
          // strictly preserve original dimensions so UI doesn't break
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);

          // Convert to WebP at 85% quality to reduce file size without altering dimensions
          canvas.toBlob((blob) => {
            resolve(blob);
          }, "image/webp", 0.85);
        };
        img.onerror = reject;
        img.src = event.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Image uploader handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    try {
      const compressedBlob = await compressImage(file);
      const fileToUpload = compressedBlob ? new File([compressedBlob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: "image/webp" }) : file;
      
      const formData = new FormData();
      formData.append('file', fileToUpload);

      const res = await adminFetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        throw new Error(`The file is too large for Vercel's 4.5MB limit. Please upload a smaller image.`);
      }
      
      if (data.success) {
        setImage(data.url);
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (err) {
      alert(`Upload failed: ${err instanceof Error ? err.message : 'Please check connection.'}\n\nSolution: Try picking an image smaller than 4MB, or compress it before uploading.`);
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !summary || !content) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setSaving(true);
    try {
      const response = await adminFetch('/api/admin/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: post?.id,
          title,
          slug,
          summary,
          content,
          image,
          isActive,
          seoTitle,
          seoDescription,
          seoKeywords,
        }),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.error || 'Failed to save blog post');
      }

      showToast('Blog post saved successfully!', 'success');
      
      // If it is a newly created blog post, transition to its edit view to stay on the editor page
      if (!post?.id && res.success && res.slug) {
        setTimeout(() => {
          const cleanSlug = res.slug.replace(/^\/blog\//, '').replace(/^\//, '');
          router.push(`/admin/blogs/${cleanSlug}`);
        }, 1500);
      }
    } catch (err) {
      console.error('Form Submit:', err);
      showToast('Failed to save blog post: ' + (err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm font-sans relative">
      
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
          href="/admin/blogs"
          className="inline-flex items-center gap-2 text-[#1a8b4c] font-black text-xs uppercase tracking-wider hover:gap-3 transition-all"
        >
          <ArrowLeft size={14} /> Back to Blogs CMS
        </Link>
      </div>

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
        
        {/* Dynamic Location Tip */}
        <div className="bg-[#f0fdf4] border border-green-200/50 rounded-2xl p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#1a8b4c] shrink-0 mt-0.5" />
          <div>
            <p className="text-[12px] font-black text-gray-950 mb-0.5">SEO Pro Tip: Dynamic Location Pages</p>
            <p className="text-[11px] text-gray-600 font-semibold leading-relaxed">
              Use the placeholder <code className="bg-[#e4f8ec] px-1.5 py-0.5 rounded font-mono font-black text-[#1a8b4c]">{"{location}"}</code> inside your blog title, summary, meta descriptions, or content editor. When viewed under market-area URL paths (e.g. <code className="font-mono">/delhi/blog-slug</code>), it will automatically render the target city name (e.g. "Delhi")!
            </p>
          </div>
        </div>

        {/* Core fields grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">
              Post Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. 5 SEO Strategies to Triple Your Business Traffic"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] transition-colors"
            />
          </div>

          {/* Slug */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">
              Post Slug (URL Path) *
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs text-gray-400 font-bold select-none font-mono">
                /blog/
              </span>
              <input
                type="text"
                required
                disabled={!!post?.id}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="5-seo-strategies"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-16 pr-4 py-3 text-xs md:text-sm font-mono font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              />
            </div>
            {post?.id && (
              <span className="text-[9px] text-amber-600 font-bold uppercase tracking-wider mt-1">
                ⚠️ Blog post slugs cannot be edited after creation to prevent broken links.
              </span>
            )}
          </div>

          {/* Image Banner */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">
                Post Cover Image URL
              </label>
              {image !== (post?.image || '') && (
                <button
                  type="button"
                  onClick={() => {
                    setImage(post?.image || '');
                    showToast('Uploaded photo removed. Reverted to default.', 'success');
                  }}
                  className="text-[10px] font-bold text-red-500 hover:text-red-700 hover:underline uppercase tracking-wider transition-colors"
                >
                  Remove Uploaded Photo
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                disabled={saving || uploading}
                placeholder="/uploads/blog-banner.png"
                className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm font-mono font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] transition-colors disabled:opacity-50"
              />
              <label className={`bg-gray-100 border border-gray-200 px-4 rounded-xl flex items-center justify-center transition-colors text-gray-600 ${
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
                <input
                  type="file"
                  accept="image/*"
                  disabled={saving || uploading}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            {image && (
              <div className="mt-2 relative w-48 h-28 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                <img
                  src={image}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          {/* Summary Excerpt */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">
              Summary / Excerpt * (Brief overview displayed in lists)
            </label>
            <textarea
              required
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Provide a catchphrase or brief preview of this article..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] transition-colors resize-none"
            />
          </div>

          {/* Active status */}
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 p-4 rounded-2xl md:col-span-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4.5 h-4.5 text-[#1a8b4c] border-gray-300 rounded focus:ring-[#1a8b4c] focus:ring-2 accent-[#1a8b4c]"
            />
            <div className="flex flex-col">
              <label htmlFor="isActive" className="text-xs font-black text-gray-900 uppercase tracking-wider cursor-pointer">
                Publish Active status
              </label>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                Deactivating hide this post from the public listing index and routes
              </span>
            </div>
          </div>
        </div>

        {/* SEO Collapsible Section */}
        <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-5">
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#1a8b4c]" /> SEO Metadata Properties
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">SEO Title (Overrides heading) <span className="text-[#1a8b4c] normal-case tracking-normal font-semibold ml-1">Supports {'{location}'}</span></label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="SEO Friendly Blog Title"
                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] transition-colors"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">SEO Keywords (Comma separated)</label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="seo audit, digital strategy, branding"
                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">SEO Meta Description <span className="text-[#1a8b4c] normal-case tracking-normal font-semibold ml-1">Supports {'{location}'}</span></label>
              <textarea
                rows={2}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Write an SEO descriptive content summary..."
                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Quick TOC Heading Injector */}
        <div className="bg-[#f8fafc] border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row items-end md:items-center gap-3 shadow-sm">
          <div className="flex items-center gap-2 mb-2 md:mb-0 mr-auto">
            <Sparkles size={16} className="text-[#1a8b4c]" />
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">Quick Add Heading</h4>
          </div>
          
          <input
            type="text"
            value={tocTitle}
            onChange={(e) => setTocTitle(e.target.value)}
            placeholder="Enter heading title..."
            className="flex-1 w-full md:w-auto bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c]"
          />
          
          <select
            value={tocLevel}
            onChange={(e) => setTocLevel(e.target.value as any)}
            className="w-full md:w-auto bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none cursor-pointer"
          >
            <option value="h2">H2 (Main TOC)</option>
            <option value="h3">H3 (Sub)</option>
            <option value="h4">H4</option>
          </select>
          
          <select
            value={tocColor}
            onChange={(e) => setTocColor(e.target.value)}
            className="w-full md:w-auto bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none cursor-pointer"
          >
            <option value="#2CA65A">Green (#2CA65A)</option>
            <option value="#1a1a1a">Black (#1a1a1a)</option>
            <option value="#3b82f6">Blue (#3b82f6)</option>
          </select>

          <button
            type="button"
            onClick={() => {
              if (!tocTitle.trim()) {
                showToast('Please enter a heading title', 'error');
                return;
              }
              const slugId = tocTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              const newHtml = `\n<${tocLevel} id="${slugId}" style="color: ${tocColor};" class="toc-heading">${tocTitle}</${tocLevel}>\n<p><br></p>\n`;
              setContent((prev) => prev + newHtml);
              setTocTitle('');
              showToast('Heading added to editor!', 'success');
            }}
            className="w-full md:w-auto bg-gray-900 hover:bg-[#1a8b4c] text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors whitespace-nowrap"
          >
            Add to Editor ↓
          </button>
        </div>

        {/* Content Pane with Live Preview Tab */}
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">
              Blog Content HTML *
            </label>
            <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
              <button 
                type="button"
                onClick={() => setActiveTab('write')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  activeTab === 'write'
                    ? 'bg-white text-[#2CA65A] shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Write / Edit
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  activeTab === 'preview'
                    ? 'bg-white text-[#2CA65A] shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Live Preview & TOC ({extractHeadings(content).length})
              </button>
            </div>
          </div>

          {activeTab === 'write' ? (
            <ContentEditor 
              content={content} 
              setContent={setContent} 
              placeholder="Write your blog post content here. Use the Quick Add Heading tool above to insert formatted titles..."
              isBlog={true}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gray-50/50 border border-gray-200/60 rounded-3xl p-5 md:p-6 min-h-[450px]">
              {/* Left sidebar: TOC Preview */}
              <div className="lg:col-span-4 bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm h-fit">
                <h4 className="text-xs font-black text-gray-950 uppercase tracking-widest mb-3 pb-2.5 border-b border-gray-100 flex items-center gap-1.5">
                  <span className="text-[#1a8b4c]">📖</span> Generated TOC
                </h4>
                {extractHeadings(content).length === 0 ? (
                  <p className="text-[11px] text-gray-400 italic">
                    Add H2, H3, or H4 headings in your content to automatically generate a Table of Contents.
                  </p>
                ) : (
                  <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto pr-1">
                    {extractHeadings(content).map((heading: any, idx: number) => {
                      const slugId = heading.text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      const indentClass = heading.level === 3 ? 'pl-5 text-[11px]' : heading.level === 4 ? 'pl-8 text-[10.5px]' : 'pl-2.5';
                      return (
                        <a
                          key={idx}
                          href={`#preview-${slugId}`}
                          onClick={(e) => handlePreviewTocClick(e, slugId)}
                          className={`font-bold text-gray-600 hover:text-[#2CA65A] hover:bg-green-50/20 p-2 rounded-lg transition-all text-left block leading-snug border-l-2 border-transparent hover:border-[#2CA65A] ${indentClass}`}
                        >
                          {heading.level > 2 && <span className="text-gray-400 mr-1">↳</span>}
                          {heading.text}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right side: HTML Content Preview */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm max-h-[600px] overflow-y-auto scrollbar-thin">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                  Article Preview
                </h4>
                <div 
                  className="prose prose-sm max-w-none text-gray-700 leading-relaxed font-sans admin-preview-content"
                  dangerouslySetInnerHTML={{ __html: getProcessedPreviewHtml(content) }}
                />
              </div>

              {/* Local styling for Admin Article Preview */}
              <style dangerouslySetInnerHTML={{__html: `
                .admin-preview-content h1 {
                  font-family: var(--font-poppins), sans-serif;
                  font-size: 30px;
                  font-weight: 800;
                  color: #111827;
                  margin-top: 32px !important;
                  margin-bottom: 16px !important;
                  line-height: 1.25;
                }
                @media (min-width: 481px) {
                  .admin-preview-content h1 {
                    font-size: 36px;
                  }
                }
                @media (min-width: 769px) {
                  .admin-preview-content h1 {
                    font-size: 48px;
                  }
                }

                /* Direct overrides for Tailwind prose to ensure H2 headings are green & underlined in preview */
                .admin-preview-content.prose h2:not([style*="color"]) {
                  color: #2CA65A !important;
                }
                .admin-preview-content.prose h2 {
                  font-family: var(--font-poppins), sans-serif !important;
                  font-size: 24px !important;
                  font-weight: 700 !important;
                  margin-top: 32px !important;
                  margin-bottom: 16px !important;
                  padding-bottom: 8px !important;
                  border-bottom: 2px solid currentColor !important;
                  line-height: 1.375 !important;
                }
                .admin-preview-content.prose h2 strong,
                .admin-preview-content.prose h2 b {
                  color: inherit !important;
                }
                @media (min-width: 481px) {
                  .admin-preview-content.prose h2 {
                    font-size: 30px !important;
                  }
                }
                @media (min-width: 769px) {
                  .admin-preview-content.prose h2 {
                    font-size: 36px !important;
                  }
                }

                /* Direct overrides for Tailwind prose to ensure H3 headings are dark and NOT underlined in preview */
                .admin-preview-content.prose h3 {
                  font-family: var(--font-poppins), sans-serif !important;
                  font-size: 16px !important;
                  font-weight: 600 !important;
                  color: #1a8b4c !important;
                  text-transform: uppercase !important;
                  letter-spacing: 0.05em !important;
                  margin-top: 24px !important;
                  margin-bottom: 10px !important;
                  border-left: 4px solid #1a8b4c !important;
                  padding-left: 12px !important;
                  line-height: 1.375 !important;
                  border-bottom: none !important;
                  padding-bottom: 0 !important;
                }
                .admin-preview-content.prose h3 strong,
                .admin-preview-content.prose h3 b {
                  color: inherit !important;
                }
                @media (min-width: 481px) {
                  .admin-preview-content.prose h3 {
                    font-size: 24px !important;
                  }
                }
                @media (min-width: 769px) {
                  .admin-preview-content.prose h3 {
                    font-size: 24px !important;
                  }
                }

                .admin-preview-content h4 {
                  font-family: var(--font-poppins), sans-serif;
                  font-size: 18px;
                  font-weight: 600;
                  color: #374151;
                  margin-top: 20px !important;
                  margin-bottom: 10px !important;
                  line-height: 1.5;
                }
                @media (min-width: 481px) {
                  .admin-preview-content h4 {
                    font-size: 20px;
                  }
                }
                @media (min-width: 769px) {
                  .admin-preview-content h4 {
                    font-size: 20px;
                  }
                }

                .admin-preview-content p {
                  font-family: var(--font-jost), sans-serif;
                  font-size: 14px;
                  font-weight: 400;
                  line-height: 1.5;
                  color: #4b5563;
                  margin-bottom: 16px !important;
                  margin-top: 0 !important;
                }
                @media (min-width: 481px) {
                  .admin-preview-content p {
                    font-size: 16px;
                    line-height: 1.5;
                  }
                }
                @media (min-width: 769px) {
                  .admin-preview-content p {
                    font-size: 16px;
                    line-height: 1.625;
                  }
                }

                .admin-preview-content ul,
                .admin-preview-content ol {
                  font-family: var(--font-jost), sans-serif;
                  padding-left: 24px !important;
                  margin-top: 4px !important;
                  margin-bottom: 8px !important;
                }
                .admin-preview-content ul {
                  list-style-type: disc;
                }
                .admin-preview-content ol {
                  list-style-type: decimal;
                }
                .admin-preview-content ul li::marker {
                  color: #2CA65A;
                  font-size: 1.1em;
                }
                .admin-preview-content ol li::marker {
                  color: #2CA65A;
                  font-weight: 700;
                }
                .admin-preview-content li {
                  font-family: var(--font-jost), sans-serif;
                  font-size: 14px;
                  font-weight: 400;
                  line-height: 1.5;
                  color: #4b5563;
                  margin-bottom: 4px !important;
                }
                .admin-preview-content li p {
                  margin: 0 !important;
                  padding: 0 !important;
                  display: inline !important;
                }
                @media (min-width: 481px) {
                  .admin-preview-content li {
                    font-size: 16px;
                    line-height: 1.5;
                  }
                }
                @media (min-width: 769px) {
                  .admin-preview-content li {
                    font-size: 16px;
                    line-height: 1.625;
                  }
                }
                .admin-preview-content blockquote {
                  font-family: var(--font-jost), sans-serif;
                  border-left: 4px solid #1a8b4c !important;
                  padding: 12px 16px !important;
                  font-style: italic;
                  color: #6b7280;
                  margin: 10px 0 !important;
                  background: #f9fafb;
                  border-radius: 0 8px 8px 0;
                }
                .admin-preview-content pre {
                  background-color: #1e1e2e !important;
                  color: #cdd6f4;
                  font-family: ui-monospace, monospace;
                  padding: 14px 18px !important;
                  border-radius: 10px !important;
                  font-size: 13px;
                  line-height: 1.6;
                  margin: 10px 0 !important;
                  border: 1px solid #313244;
                }
              `}} />
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <Link
            href="/admin/blogs"
            className={`border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-2.5 px-5 rounded-xl text-xs uppercase tracking-wider ${
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
              'Save Blog Post'
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
