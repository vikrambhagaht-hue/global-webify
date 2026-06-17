'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { FileText, Save, CheckCircle2, XCircle } from 'lucide-react';
import { getPolicyContent, savePolicyContent } from './actions';

export default function PoliciesAdminPage() {
  const [activeTab, setActiveTab] = useState<'refund'>('refund');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadPolicy = async (tab: 'refund') => {
    setLoading(true);
    const key = `policy_${tab}`;
    try {
      const data = await getPolicyContent(key);
      setTitle(data?.title || '');
      setContent(data?.content || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolicy(activeTab);
  }, [activeTab]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast('Title and content are required.', 'error');
      return;
    }

    startTransition(async () => {
      const key = `policy_${activeTab}`;
      const res = await savePolicyContent(key, title, content);
      if (res.success) {
        showToast('Policy content saved successfully!');
      } else {
        showToast(res.error || 'Failed to save policy.', 'error');
      }
    });
  };

  const tabs = [
    { key: 'refund' as const, label: 'Refund Policy' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 flex flex-col gap-8 font-sans text-left">
      {toast && (
        <div
          className={`fixed top-4 right-4 md:top-8 md:right-8 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border ${
            toast.type === 'success'
              ? 'bg-[#1a8b4c] text-white border-[#15703d]'
              : 'bg-red-600 text-white border-red-700'
          } animate-in slide-in-from-top-2 fade-in duration-300 font-bold`}
        >
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <span className="text-sm tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-gray-900 font-poppins uppercase tracking-tight flex items-center gap-2">
          <FileText className="text-[#1a8b4c]" /> Policy Pages Manager
        </h2>
        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mt-1">
          Manage the layout and contents of the Refund policy on the website.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3.5 text-xs md:text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === tab.key
                ? 'border-[#1a8b4c] text-[#1a8b4c]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400 font-bold font-poppins">
          Loading content database...
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/80 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Policy Page Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Return Policy | GlobalWeblify"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a8b4c]/20 focus:border-[#1a8b4c] transition-all bg-white"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="content" className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Policy Page Content (HTML / Rich Text)
            </label>
            <textarea
              id="content"
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write or paste your policy content using standard HTML tag markup (e.g. <p>, <h2>, <ul>, etc.)..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a8b4c]/20 focus:border-[#1a8b4c] transition-all bg-white font-mono"
              required
            />
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              HTML formatting: Use tags like &lt;h2&gt; for subheadings, &lt;p&gt; for paragraphs, &lt;ul&gt;&lt;li&gt; for bullet lists.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="bg-[#1a8b4c] hover:bg-[#15803d] text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <Save size={16} />
              {isPending ? 'Saving...' : 'Save Policy'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
