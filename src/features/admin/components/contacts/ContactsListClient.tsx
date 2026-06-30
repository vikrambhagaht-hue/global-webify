'use client';

import React, { useState } from 'react';
import { Mail, Phone, Calendar, Trash2, Search, Filter, MessageSquare, X, Copy, Check, AlertCircle } from 'lucide-react';

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  service?: string | null;
  message: string;
  createdAt: string;
}

interface ContactsListClientProps {
  initialSubmissions: ContactSubmission[];
}

export default function ContactsListClient({ initialSubmissions }: ContactsListClientProps) {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(initialSubmissions);
  const [selectedSub, setSelectedSub] = useState<ContactSubmission | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleteAllConfirmOpen, setDeleteAllConfirmOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/contact?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setSubmissions(submissions.filter((sub) => sub.id !== id));
        if (selectedSub?.id === id) setSelectedSub(null);
        setDeleteConfirmId(null);
        triggerToast('Submission deleted successfully');
      } else {
        triggerToast(data.error || 'Failed to delete submission');
      }
    } catch (e) {
      console.error(e);
      triggerToast('An error occurred while deleting.');
    }
  };

  const handleDeleteAll = async () => {
    try {
      const response = await fetch('/api/contact?id=all', {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setSubmissions([]);
        setSelectedSub(null);
        setDeleteAllConfirmOpen(false);
        triggerToast('All submissions deleted successfully');
      } else {
        triggerToast(data.error || 'Failed to delete all submissions');
      }
    } catch (e) {
      console.error(e);
      triggerToast('An error occurred while deleting all.');
    }
  };

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getFormSource = (service?: string | null) => {
    if (!service || service.trim() === '') return '/contact';
    let str = service.trim();
    if (str.startsWith('http')) {
      try {
        const p = new URL(str).pathname;
        str = p === '/' ? 'Contact Us Modal' : p;
      } catch (e) {}
    }
    if (str.includes('Contact Us Modal')) return 'Contact Us Modal';
    if (str.includes(':::')) {
      const parts = str.split(':::');
      let src = parts[0].trim();
      if (src.startsWith('http')) {
        try { src = new URL(src).pathname; } catch (e) {}
      }
      if (src.includes('Contact Us Modal')) return 'Contact Us Modal';
      return src === '/' ? 'Contact Us Modal' : src;
    }
    if (str === '/') return 'Contact Us Modal';
    if (str === 'Booking') return '/booking';
    if (str === 'seo' || str === 'web-dev' || str === 'marketing' || str.toLowerCase() === 'other') return '/contact';
    return str;
  };

  const getSelectedService = (service?: string | null) => {
    if (!service || service.trim() === '') return 'None / General Inquiry';
    const str = service.trim();
    if (str.includes(':::')) {
      const parts = str.split(':::');
      const svc = parts[1]?.trim();
      if (!svc || svc === '' || svc === 'General Inquiry') return 'None / General Inquiry';
      if (svc === 'web-dev') return 'Web Development';
      if (svc === 'seo') return 'SEO Services';
      if (svc === 'marketing') return 'Digital Marketing';
      if (svc.toLowerCase() === 'other') return 'Other Services';
      return svc;
    }
    if (str === 'seo') return 'SEO Services';
    if (str === 'web-dev' || str === 'web') return 'Web Development';
    if (str === 'marketing') return 'Digital Marketing';
    if (str === 'Booking') return 'Consultation Booking';
    if (str.toLowerCase() === 'other') return 'Other Services';
    return 'None / General Inquiry';
  };

  // Filter logic
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub.phone && sub.phone.includes(searchTerm));

    const matchesService = 
      serviceFilter === 'all' || 
      (sub.service && sub.service.toLowerCase() === serviceFilter.toLowerCase());

    return matchesSearch && matchesService;
  });

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate statistics
  const totalCount = submissions.length;
  const webDevCount = submissions.filter(s => s.service === 'web-dev' || (s.service && s.service.toLowerCase().includes('web'))).length;
  const marketingCount = submissions.filter(s => s.service === 'marketing' || (s.service && s.service.toLowerCase().includes('market'))).length;
  const seoCount = submissions.filter(s => s.service === 'seo' || (s.service && s.service.toLowerCase().includes('seo'))).length;
  const otherCount = totalCount - webDevCount - marketingCount - seoCount;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-24 md:top-36 right-4 left-4 md:left-auto md:right-8 md:w-auto max-w-sm mx-auto md:mx-0 z-[9999] bg-gray-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-gray-800 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-2 h-2 rounded-full bg-[#1a8b4c] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Stats Counter Panels */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Total Submissions</span>
          <span className="text-2xl font-black text-gray-900 mt-1 block">{totalCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <span className="text-[10px] font-black text-purple-600 uppercase tracking-wider block">Web Development</span>
          <span className="text-2xl font-black text-purple-900 mt-1 block">{webDevCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block">Digital Marketing</span>
          <span className="text-2xl font-black text-emerald-900 mt-1 block">{marketingCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider block">SEO Services</span>
          <span className="text-2xl font-black text-blue-900 mt-1 block">{seoCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)] col-span-2 lg:col-span-1">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">Other/General</span>
          <span className="text-2xl font-black text-gray-800 mt-1 block">{otherCount}</span>
        </div>
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search submissions by name, email, keyword..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all text-gray-800"
          />
        </div>

        {/* Filter Dropdown & Delete All Button */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider whitespace-nowrap">Filter Service:</label>
            <select
              value={serviceFilter}
              onChange={(e) => {
                setServiceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1a8b4c] cursor-pointer text-gray-800"
            >
              <option value="all">All Services</option>
              <option value="web-dev">Web Development</option>
              <option value="seo">SEO Services</option>
              <option value="marketing">Digital Marketing</option>
              <option value="other">Other / General</option>
            </select>
          </div>
          
          {submissions.length > 0 && (
            <button
              onClick={() => setDeleteAllConfirmOpen(true)}
              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Trash2 size={13} />
              Delete All
            </button>
          )}
        </div>

      </div>

      {/* Submissions Datatable */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Sender Details</th>
                <th className="py-4 px-6">Form Source (Page)</th>
                <th className="py-4 px-6">Requested Service</th>
                <th className="py-4 px-6">Submitted Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-xs font-semibold">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle size={24} className="text-gray-300" />
                      <span>No contact submissions found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedSubmissions.map((sub) => {
                  const isNew = new Date().getTime() - new Date(sub.createdAt).getTime() < 24 * 60 * 60 * 1000;
                  const formSource = getFormSource(sub.service);
                  const selectedSvc = getSelectedService(sub.service);
                  const serviceLower = selectedSvc.toLowerCase();
                  let badgeStyle = 'bg-gray-50 text-gray-700 border-gray-200';
                  if (serviceLower.includes('web')) badgeStyle = 'bg-purple-50 text-purple-700 border-purple-100';
                  else if (serviceLower.includes('market')) badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                  else if (serviceLower.includes('seo')) badgeStyle = 'bg-blue-50 text-blue-700 border-blue-100';
                  else if (serviceLower.includes('booking')) badgeStyle = 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold';

                  return (
                    <tr key={sub.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-6 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#dcfce7] text-[#1a8b4c] flex items-center justify-center font-bold text-xs">
                            {sub.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-gray-900">{sub.name}</h4>
                              {isNew && (
                                <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-[8px] font-black uppercase tracking-widest rounded-md shadow-sm border border-red-100 animate-pulse">
                                  New
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col text-[10px] text-gray-400 font-semibold mt-0.5 space-y-0.5">
                              <span className="flex items-center gap-1"><Mail size={10} /> {sub.email}</span>
                              {sub.phone && <span className="flex items-center gap-1"><Phone size={10} /> {sub.phone}</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-xs font-bold text-gray-700">
                        <span className="px-2 py-1 bg-amber-50/80 text-amber-900 rounded-lg border border-amber-200/60 text-[11px]">
                          {formSource}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider border ${badgeStyle}`}>
                          {selectedSvc}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-xs text-gray-500 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-gray-400" />
                          <span>
                            {new Date(sub.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(sub.createdAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-right text-xs">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedSub(sub)}
                            className="px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 font-bold transition-all text-[11px]"
                          >
                            Read Message
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(sub.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete submission"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <span className="text-xs font-semibold text-gray-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSubmissions.length)} of {filteredSubmissions.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-gray-900 px-2">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Detailed Message View Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-[9999] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-[#1a8b4c]">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">
                    Contact Message Detail
                  </h3>
                  <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">
                    Submitted on {new Date(selectedSub.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Sender Name</span>
                      <span className="text-sm font-black text-gray-900">{selectedSub.name}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Requested Service</span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        getSelectedService(selectedSub.service).toLowerCase().includes('web') 
                          ? 'bg-purple-50 text-purple-700 border-purple-100'
                          : getSelectedService(selectedSub.service).toLowerCase().includes('market')
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {getSelectedService(selectedSub.service)}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-100/80 flex justify-between items-center">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Form Source Page</span>
                    <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                      {getFormSource(selectedSub.service)}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100/80">
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Email Address</span>
                    <a href={`mailto:${selectedSub.email}`} className="text-xs font-bold text-[#1a8b4c] hover:underline break-all">{selectedSub.email}</a>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Phone Number</span>
                    {selectedSub.phone ? (
                      <a href={`tel:${selectedSub.phone}`} className="text-xs font-bold text-gray-900 hover:underline">{selectedSub.phone}</a>
                    ) : (
                      <span className="text-xs font-semibold text-gray-400">N/A</span>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Message Content</span>
                  <button
                    onClick={() => handleCopy(selectedSub.message, selectedSub.id)}
                    className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-[#1a8b4c] font-bold"
                  >
                    {copiedId === selectedSub.id ? <Check size={11} className="text-[#1a8b4c]" /> : <Copy size={11} />}
                    <span>{copiedId === selectedSub.id ? 'Copied' : 'Copy text'}</span>
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 text-xs font-semibold text-gray-700 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {selectedSub.message}
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between gap-2.5">
              <button
                onClick={() => setDeleteConfirmId(selectedSub.id)}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                <span>Delete Lead</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-bold transition-colors"
                >
                  Close
                </button>
                <a
                  href={`mailto:${selectedSub.email}?subject=Regarding your request for ${selectedSub.service || 'GlobalWebify services'}`}
                  className="px-5 py-2 bg-[#1a8b4c] hover:bg-[#15703d] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Mail size={14} />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Single Submission Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-[99999] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 text-center animate-in zoom-in-95 duration-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">Delete Lead?</h3>
              <p className="text-xs text-gray-500 mt-1">This action cannot be undone. Are you sure you want to delete this submission?</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold border border-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete ALL Confirmation Modal */}
      {deleteAllConfirmOpen && (
        <div className="fixed inset-0 z-[99999] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 text-center animate-in zoom-in-95 duration-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">Delete ALL Leads?</h3>
              <p className="text-xs text-gray-500 mt-1">Are you absolutely sure you want to permanently delete ALL contact submissions?</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteAllConfirmOpen(false)}
                className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold border border-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
