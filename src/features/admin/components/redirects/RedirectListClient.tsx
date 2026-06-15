'use client';

import React, { useState, useMemo } from 'react';
import { Save, Plus, Trash2, ShieldAlert, CheckCircle, RefreshCw, Search, Edit2 } from 'lucide-react';
import { saveSingleRedirect, deleteRedirect } from '@/app/admin/(dashboard)/redirects/actions';

interface RedirectItem {
  id?: number;
  source: string;
  destination: string;
}

export default function RedirectListClient({
  initialRedirects,
  availableRoutes,
}: {
  initialRedirects: RedirectItem[];
  availableRoutes: { url: string; label: string }[];
}) {
  const [redirects, setRedirects] = useState<RedirectItem[]>(initialRedirects);
  const [currentRedirect, setCurrentRedirect] = useState<RedirectItem>({ source: '', destination: '' });
  const [searchQuery, setSearchQuery] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showStatus = (type: 'success' | 'error', message: string) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRedirect.source.trim() || !currentRedirect.destination.trim()) {
      showStatus('error', 'Both Old URL and New URL must be filled.');
      return;
    }

    setSaving(true);
    try {
      const res = await saveSingleRedirect(currentRedirect);
      if (res.success) {
        showStatus('success', 'Redirect rule saved successfully!');
        // Reload to get fresh data and IDs from server
        window.location.reload();
      } else {
        showStatus('error', res.error || 'Failed to save redirect.');
      }
    } catch (err: any) {
      showStatus('error', err.message || 'An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this redirect?')) return;
    
    setDeletingId(id);
    try {
      const res = await deleteRedirect(id);
      if (res?.success) {
        showStatus('success', 'Redirect deleted successfully!');
        window.location.reload();
      } else {
        showStatus('error', 'Failed to delete redirect.');
      }
    } catch (err: any) {
      showStatus('error', err.message || 'Error deleting redirect.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (item: RedirectItem) => {
    setCurrentRedirect(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setCurrentRedirect({ source: '', destination: '' });
  };

  const filteredRedirects = useMemo(() => {
    if (!searchQuery.trim()) return redirects;
    const lowerQuery = searchQuery.toLowerCase();
    return redirects.filter(
      r => r.source.toLowerCase().includes(lowerQuery) || r.destination.toLowerCase().includes(lowerQuery)
    );
  }, [redirects, searchQuery]);

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm font-sans max-w-5xl mx-auto overflow-hidden">
      
      {/* HEADER & FORM SECTION (GLOBAL SAVE AT TOP) */}
      <div className="p-6 md:p-8 bg-gray-50/30 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-black text-gray-900 uppercase font-heading tracking-tight">
              {currentRedirect.id ? 'Edit Redirect Mapping' : 'Add New Redirect Mapping'}
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Create permanent HTTP 301 redirects to preserve SEO rankings for changed URLs.
            </p>
          </div>
          {currentRedirect.id && (
            <button
              onClick={resetForm}
              className="text-xs font-bold text-gray-500 hover:text-gray-900 bg-white border border-gray-200 px-4 py-2 rounded-xl"
            >
              Cancel Edit / Add New
            </button>
          )}
        </div>

        {status && (
          <div
            className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 text-xs md:text-sm font-semibold transition-all ${
              status.type === 'success'
                ? 'bg-green-50 text-green-700 border-green-100'
                : 'bg-red-50 text-red-700 border-red-100'
            }`}
          >
            {status.type === 'success' ? <CheckCircle size={18} /> : <ShieldAlert size={18} />}
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">

          {/* Old URL */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
              Old URL (Source)
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={currentRedirect.source}
                onChange={(e) => setCurrentRedirect({ ...currentRedirect, source: e.target.value })}
                placeholder="e.g. https://www.globalwebify.com/webdevelopment.index"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#1a8b4c] focus:ring-1 focus:ring-[#1a8b4c] transition-all"
              />
            </div>
          </div>

          <div className="hidden md:flex md:col-span-1 justify-center pb-3 text-gray-300 font-black text-lg">
            →
          </div>

          {/* New URL */}
          <div className="md:col-span-4 space-y-2">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block whitespace-nowrap">
                New URL
              </label>
              <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full xl:w-auto">
                <select
                  className="text-xs font-semibold text-gray-700 bg-white border border-gray-200 shadow-sm rounded-xl px-3 py-2 outline-none cursor-pointer hover:bg-gray-50 hover:border-gray-300 focus:border-[#1a8b4c] focus:ring-1 focus:ring-[#1a8b4c] w-full sm:max-w-[180px] truncate transition-all"
                  onChange={(e) => {
                    if (e.target.value) {
                      setCurrentRedirect({ ...currentRedirect, destination: e.target.value });
                      e.target.value = ''; // Reset select so it acts like a button
                    }
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>✨ Select Page...</option>
                  {availableRoutes
                    .filter(r => !r.label.startsWith('Blog:') && !r.label.startsWith('Job:'))
                    .map(r => (
                      <option key={`page-${r.url}`} value={r.url}>{r.label}</option>
                    ))
                  }
                </select>

                <select
                  className="text-xs font-semibold text-[#1a8b4c] bg-white border border-gray-200 shadow-sm rounded-xl px-3 py-2 outline-none cursor-pointer hover:bg-gray-50 hover:border-[#1a8b4c] focus:border-[#1a8b4c] focus:ring-1 focus:ring-[#1a8b4c] w-full sm:max-w-[180px] truncate transition-all"
                  onChange={(e) => {
                    if (e.target.value) {
                      setCurrentRedirect({ ...currentRedirect, destination: e.target.value });
                      e.target.value = ''; // Reset select so it acts like a button
                    }
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>📝 Select Blog...</option>
                  {availableRoutes
                    .filter(r => r.label.startsWith('Blog:'))
                    .map(r => (
                      <option key={`blog-${r.url}`} value={r.url}>{r.label.replace('Blog: ', '')}</option>
                    ))
                  }
                </select>
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                required
                value={currentRedirect.destination}
                onChange={(e) => setCurrentRedirect({ ...currentRedirect, destination: e.target.value })}
                placeholder="e.g. /new-page or https://external-site.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#1a8b4c] focus:ring-1 focus:ring-[#1a8b4c] transition-all"
              />
            </div>
          </div>

          {/* Global Save Action */}
          <div className="md:col-span-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#1a8b4c] hover:bg-[#15703d] text-white font-black py-3 px-4 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              <span>{currentRedirect.id ? 'Update' : 'Save'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* LIST & SEARCH SECTION */}
      <div className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-tight flex items-center gap-2">
            All Redirects
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">
              {filteredRedirects.length} total
            </span>
          </h4>
          
          <div className="relative max-w-xs w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search Old or New URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-16">Sl No</th>
                <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Old URL</th>
                <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">New URL</th>
                <th className="py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRedirects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400 text-xs font-medium">
                    No redirects found matching your search.
                  </td>
                </tr>
              ) : (
                filteredRedirects.map((item, idx) => (
                  <tr key={item.id || idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                    <td className="py-3 px-4 text-xs font-bold text-gray-400">
                      #{idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                        {item.source}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs text-[#1a8b4c] bg-[#1a8b4c]/10 px-2 py-1 rounded-md">
                        {item.destination}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(item)}
                          disabled={saving || deletingId === item.id}
                          className="p-1.5 text-gray-400 hover:text-[#1a8b4c] hover:bg-[#1a8b4c]/10 rounded-lg transition-colors"
                          title="Edit Redirect"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={saving || deletingId === item.id}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Redirect"
                        >
                          {deletingId === item.id ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
