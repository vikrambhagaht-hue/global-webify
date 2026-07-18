'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Edit2, Trash2, Plus, Search, ExternalLink, 
  Globe, TrendingUp, Palette, Server, CheckCircle2, XCircle,
  FolderSync, LayoutGrid, ChevronRight
} from 'lucide-react';
import { adminFetch } from '@/lib/adminFetch';
import { deleteService, toggleServiceStatus } from '@/app/admin/(dashboard)/services/actions';
import { useSearchParams } from 'next/navigation';
import { getSlugTitle } from '@/lib/replaceLocation';

interface Service {
  id: number;
  title: string;
  slug: string;
  category: string;
  isActive: boolean;
  updatedAt: Date;
}

export default function ServiceListClient({ services }: { services: Service[] }) {
  const searchParams = useSearchParams();
  const queryCat = searchParams.get('category') || 'website';

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(queryCat);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [hostingActive, setHostingActive] = useState(true);
  const [brandingActive, setBrandingActive] = useState(true);

  // Load category toggle status
  useEffect(() => {
    if (selectedCategory === 'hosting' || selectedCategory === 'branding') {
      adminFetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          if (data) {
            if (typeof data.hostingMenuEnabled === 'boolean') {
              setHostingActive(data.hostingMenuEnabled);
            }
            if (typeof data.brandingMenuEnabled === 'boolean') {
              setBrandingActive(data.brandingMenuEnabled);
            }
          }
        })
        .catch(err => console.error(err));
    }
  }, [selectedCategory]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Sync state if query parameters change from sidebar navigation
  useEffect(() => {
    const currentQueryCat = searchParams.get('category') || 'website';
    setSelectedCategory(currentQueryCat);
  }, [searchParams]);

  const categories = [
    { key: 'website', label: 'Website Services', icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { key: 'crm', label: 'CRM Solutions', icon: LayoutGrid, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { key: 'seo', label: 'SEO Services', icon: Search, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
    { key: 'marketing', label: 'Digital Marketing', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { key: 'branding', label: 'Branding & PR', icon: Palette, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    { key: 'hosting', label: 'Hosting & Server', icon: Server, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  ];

  // Helper to count services in each category
  const getCount = (catKey: string) => {
    return services.filter((s) => s.category === catKey).length;
  };

  const triggerSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast('Database seeded successfully! Reloading...', 'success');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        showToast('Seeding failed: ' + data.message, 'error');
      }
    } catch (err) {
      showToast('Failed to connect to seeding API.', 'error');
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this service page? This action cannot be undone.')) {
      setDeletingId(id);
      try {
        await deleteService(id);
        showToast('Service page deleted successfully!', 'success');
      } catch (error) {
        showToast('Failed to delete service page.', 'error');
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Filter services by search and selected category
  const filteredServices = services.filter((service) => {
    const matchesSearch = 
      service.title.toLowerCase().includes(search.toLowerCase()) ||
      service.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryInfo: Record<string, { label: string; slug: string }> = {
    website: { label: 'Website Services', slug: '/web-development' },
    crm: { label: 'CRM Solutions', slug: '/crm-software-development' },
    seo: { label: 'SEO Services', slug: '/seo-services' },
    marketing: { label: 'Digital Marketing', slug: '/digital-marketing' },
    branding: { label: 'Branding & PR', slug: '/branding-and-pr' },
    hosting: { label: 'Hosting & Server', slug: '/hosting' },
    all: { label: 'All Services', slug: '/services' }
  };
  const currentCat = categoryInfo[selectedCategory] || categoryInfo.all;

  return (
    <div className="space-y-8 font-sans">
      
      {/* Page Title & Search Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xl md:text-2xl font-black text-[#1a8b4c] font-poppins uppercase tracking-tight">
            {currentCat.label}
          </h3>
          <Link
            href={`/admin/services/new?category=${selectedCategory !== 'all' ? selectedCategory : 'website'}`}
            className="px-3 py-1.5 bg-green-50 text-[#1a8b4c] border border-green-200 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-green-100 transition-colors"
          >
            <Plus size={14} /> Add New Page
          </Link>
        </div>

        
        {/* Advanced Search Input Bar */}
        <div className="relative w-full sm:w-80 group">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 group-hover:text-[#1a8b4c] transition-colors">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search within ${currentCat.label.toLowerCase()}...`}
            className="w-full bg-white border-2 border-gray-150 hover:border-gray-250 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-[#1a8b4c]/5 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Hosting dynamic menu config block */}
      {selectedCategory === 'hosting' && (
        <div className="bg-gradient-to-br from-amber-50/60 to-amber-100/30 border-2 border-amber-200/60 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide">
              Public Navbar Hosting Menu Status
            </h4>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              Toggle whether the Hosting menu category and submenus are visible to public visitors in the main navbar.
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              const nextVal = !hostingActive;
              try {
                const res = await adminFetch('/api/settings', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ hostingMenuEnabled: nextVal })
                });
                const data = await res.json();
                if (data.success) {
                  setHostingActive(nextVal);
                  showToast(`Hosting menu successfully ${nextVal ? 'enabled' : 'disabled'}!`, 'success');
                } else {
                  throw new Error(data.error);
                }
              } catch (err) {
                showToast("Failed to update hosting status.", 'error');
              }
            }}
            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all ${
              hostingActive 
                ? 'bg-green-50 text-[#1a8b4c] border-green-200 hover:bg-green-100' 
                : 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100'
            }`}
          >
            {hostingActive ? 'Active (Visible)' : 'Inactive (Hidden)'}
          </button>
        </div>
      )}

      {/* Branding dynamic menu config block */}
      {selectedCategory === 'branding' && (
        <div className="bg-gradient-to-br from-indigo-50/60 to-indigo-100/30 border-2 border-indigo-200/60 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide">
              Public Navbar Branding & PR Menu Status
            </h4>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              Toggle whether the Branding & PR menu category and submenus are visible to public visitors in the main navbar.
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              const nextVal = !brandingActive;
              try {
                const res = await adminFetch('/api/settings', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ brandingMenuEnabled: nextVal })
                });
                const data = await res.json();
                if (data.success) {
                  setBrandingActive(nextVal);
                  showToast(`Branding & PR menu successfully ${nextVal ? 'enabled' : 'disabled'}!`, 'success');
                } else {
                  throw new Error(data.error);
                }
              } catch (err) {
                showToast("Failed to update branding status.", 'error');
              }
            }}
            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all ${
              brandingActive 
                ? 'bg-green-50 text-[#1a8b4c] border-green-200 hover:bg-green-100' 
                : 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100'
            }`}
          >
            {brandingActive ? 'Active (Visible)' : 'Inactive (Hidden)'}
          </button>
        </div>
      )}

      {/* Main Service List Grid */}
      {services.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-lg">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-green-50 text-[#1a8b4c] flex items-center justify-center mx-auto text-3xl">
              📂
            </div>
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest font-heading">
              No Content Pages Seeded
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed font-semibold">
              The services database is empty. Get started by seeding standard pre-defined system modules.
            </p>
            <button
              type="button"
              onClick={triggerSeed}
              disabled={seeding}
              className="bg-green-50 text-[#1a8b4c] border border-green-200 px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-green-100 transition-colors disabled:opacity-50"
            >
              {seeding ? 'Seeding Database...' : 'Seed Default Templates'}
            </button>
          </div>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center text-gray-400 font-bold shadow-sm">
          No matching subpages found. Try modifying your search or select another folder.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const isWeb = service.category === 'website';
            const isMark = service.category === 'marketing';
            const isBrand = service.category === 'branding';
            
            let catColor = 'bg-amber-50 text-amber-700 border-amber-100';
            if (isWeb) catColor = 'bg-purple-50 text-purple-700 border-purple-100';
            else if (isMark) catColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';
            else if (isBrand) catColor = 'bg-indigo-50 text-indigo-700 border-indigo-100';

            return (
              <div 
                key={service.id} 
                className="bg-white border border-gray-100 hover:border-gray-250 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-[180px] group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2.5">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border ${catColor}`}>
                      {service.category}
                    </span>
                    
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await toggleServiceStatus(service.id, !service.isActive);
                          showToast(`Page ${service.isActive ? 'deactivated' : 'activated'} successfully!`, 'success');
                        } catch (err) {
                          showToast("Failed to toggle status.", 'error');
                        }
                      }}
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border transition-all flex-shrink-0 ${
                        service.isActive 
                          ? 'bg-green-50 text-[#1a8b4c] border-green-200 hover:bg-green-100/80' 
                          : 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100/80'
                      }`}
                      title={service.isActive ? "Deactivate Page" : "Activate Page"}
                    >
                      {service.isActive ? 'Active' : 'Draft'}
                    </button>
                  </div>
                  
                  <h4 className="text-base font-black text-gray-900 mt-3 line-clamp-1 group-hover:text-[#1a8b4c] transition-colors leading-tight">
                    {getSlugTitle(service.slug)}
                  </h4>
                  <span className="text-[10px] font-mono text-gray-400 block mt-1.5">
                    {service.slug}
                  </span>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-3">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                    {new Date(service.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={service.slug}
                      target="_blank"
                      className="p-2 hover:bg-gray-50 text-gray-400 hover:text-gray-700 rounded-xl border border-gray-100 transition-colors"
                      title="View Live Page"
                    >
                      <ExternalLink size={14} />
                    </Link>

                    <Link
                      href={`/admin/services/${service.slug.replace(/^\//, '')}`}
                      className="p-2 bg-gray-50 hover:bg-[#1a8b4c] text-gray-600 hover:text-white rounded-xl border border-transparent transition-all"
                      title="Edit CMS Details"
                    >
                      <Edit2 size={14} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(service.id)}
                      disabled={deletingId === service.id}
                      className="p-2 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-xl transition-all"
                      title="Delete Page"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Toast Alert Popups */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[9999] px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 border animate-in slide-in-from-bottom-4 duration-300 ${
          toast.type === 'success' ? 'bg-gray-900 text-white border-gray-800' : 'bg-red-600 text-white border-red-700'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} className="text-[#1a8b4c]" /> : <XCircle size={18} />}
          <span className="text-xs tracking-wide">{toast.message}</span>
        </div>
      )}

    </div>
  );
}
