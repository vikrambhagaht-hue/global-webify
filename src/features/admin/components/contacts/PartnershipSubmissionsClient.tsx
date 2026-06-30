'use client';

import React, { useState } from 'react';
import { 
  Search, Trash2, Calendar, Phone, Mail, 
  MessageSquare, X, AlertCircle, Copy, Check, Briefcase
} from 'lucide-react';

interface PartnershipSubmission {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  companyName?: string | null;
  websiteUrl?: string | null;
  partnershipType?: string | null;
  message: string;
  createdAt: string;
}

interface PartnershipSubmissionsClientProps {
  initialSubmissions: PartnershipSubmission[];
}

export default function PartnershipSubmissionsClient({ initialSubmissions }: PartnershipSubmissionsClientProps) {
  const [submissions, setSubmissions] = useState<PartnershipSubmission[]>(initialSubmissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSub, setSelectedSub] = useState<PartnershipSubmission | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleteAllConfirmOpen, setDeleteAllConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const executeDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/partnership?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setSubmissions(submissions.filter(sub => sub.id !== id));
        triggerToast('Submission deleted successfully');
        if (selectedSub?.id === id) {
          setSelectedSub(null);
        }
      } else {
        triggerToast(data.error || 'Failed to delete submission');
      }
    } catch (e) {
      console.error(e);
      triggerToast('An error occurred while deleting the submission.');
    }
  };

  const executeDeleteAll = async () => {
    try {
      const response = await fetch('/api/partnership?id=all', {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setSubmissions([]);
        setSelectedSub(null);
        triggerToast('All submissions deleted successfully');
      } else {
        triggerToast(data.error || 'Failed to delete all submissions');
      }
    } catch (e) {
      console.error(e);
      triggerToast('An error occurred while deleting all submissions.');
    }
  };

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDisplayType = (type: string | null | undefined) => {
    if (!type || type.trim() === '') return '/franchisee';
    return type;
  };

  // Filter logic
  const filteredSubmissions = submissions.filter(sub => {
    return (
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub.phone && sub.phone.includes(searchTerm))
    );
  });

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate statistics
  const totalCount = submissions.length;
  const affiliateCount = submissions.filter(s => s.partnershipType && s.partnershipType.toLowerCase().includes('affiliate')).length;
  const resellerCount = submissions.filter(s => s.partnershipType && s.partnershipType.toLowerCase().includes('reseller')).length;
  const strategicCount = submissions.filter(s => s.partnershipType && s.partnershipType.toLowerCase().includes('strategic')).length;

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Total Requests</span>
          <span className="text-2xl font-black text-gray-900 mt-1 block">{totalCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <span className="text-[10px] font-black text-purple-600 uppercase tracking-wider block">Affiliates</span>
          <span className="text-2xl font-black text-purple-900 mt-1 block">{affiliateCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block">Resellers</span>
          <span className="text-2xl font-black text-emerald-900 mt-1 block">{resellerCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider block">Strategic Co-Dev</span>
          <span className="text-2xl font-black text-blue-900 mt-1 block">{strategicCount}</span>
        </div>
      </div>

      {/* Control Bar: Search & Delete All */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search partnerships by name, company, email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all text-gray-800"
          />
        </div>

        {submissions.length > 0 && (
          <button
            onClick={() => setDeleteAllConfirmOpen(true)}
            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start md:self-auto"
          >
            <Trash2 size={13} />
            Delete All
          </button>
        )}
      </div>

      {/* Submissions Datatable */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Partner Details</th>
                <th className="py-4 px-6">Company / Type</th>
                <th className="py-4 px-6">Submitted Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400 text-xs font-semibold">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle size={24} className="text-gray-300" />
                      <span>No partnership submissions found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedSubmissions.map((sub) => {
                  const isNew = new Date().getTime() - new Date(sub.createdAt).getTime() < 24 * 60 * 60 * 1000;
                  const displayType = getDisplayType(sub.partnershipType);
                  const typeLower = displayType.toLowerCase();
                  
                  let badgeStyle = 'bg-gray-50 text-gray-600 border-gray-200';
                  if (typeLower.includes('affiliate')) badgeStyle = 'bg-purple-50 text-purple-700 border-purple-100';
                  else if (typeLower.includes('reseller')) badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                  else if (typeLower.includes('strategic')) badgeStyle = 'bg-blue-50 text-blue-700 border-blue-100';

                  return (
                    <tr key={sub.id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Sender Column */}
                      <td className="py-4 px-6 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#eef2ff] text-[#4f46e5] flex items-center justify-center font-bold text-xs">
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

                      {/* Company Column */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {sub.companyName ? (
                            <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                              <Briefcase size={10} className="text-gray-400" />
                              {sub.companyName}
                            </span>
                          ) : null}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider border lowercase w-fit ${badgeStyle}`}>
                            {displayType}
                          </span>
                        </div>
                      </td>

                      {/* Submitted Date Column */}
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
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="py-4 px-6 whitespace-nowrap text-right text-xs">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedSub(sub)}
                            className="px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 font-bold transition-all text-[11px]"
                          >
                            Read Proposal
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

      {/* Floating Detailed Message View Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-[9999] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">
                    Partnership Proposal Detail
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

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              {/* Contact Card */}
              <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Sender Name</span>
                    <span className="text-sm font-black text-gray-900">{selectedSub.name}</span>
                  </div>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full tracking-wider border lowercase bg-indigo-50 text-indigo-700 border-indigo-100">
                    {getDisplayType(selectedSub.partnershipType)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100/80">
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Email Address</span>
                    <a href={`mailto:${selectedSub.email}`} className="text-xs font-bold text-indigo-600 hover:underline break-all">{selectedSub.email}</a>
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
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100/80">
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Company Name</span>
                    <span className="text-xs font-bold text-gray-900">{selectedSub.companyName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Website URL</span>
                    {selectedSub.websiteUrl ? (
                      <a href={selectedSub.websiteUrl.startsWith('http') ? selectedSub.websiteUrl : `https://${selectedSub.websiteUrl}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-600 hover:underline">{selectedSub.websiteUrl}</a>
                    ) : (
                      <span className="text-xs font-semibold text-gray-400">N/A</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Proposal Content</span>
                  <button
                    onClick={() => handleCopy(selectedSub.message, selectedSub.id)}
                    className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-indigo-600 font-bold"
                  >
                    {copiedId === selectedSub.id ? <Check size={11} className="text-indigo-600" /> : <Copy size={11} />}
                    <span>{copiedId === selectedSub.id ? 'Copied' : 'Copy text'}</span>
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 text-xs font-semibold text-gray-700 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {selectedSub.message}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between gap-2.5">
              <button
                onClick={() => setDeleteConfirmId(selectedSub.id)}
                className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                Delete Proposal
              </button>
              <div className="flex gap-2">
                <a
                  href={`mailto:${selectedSub.email}?subject=Regarding your Partnership Proposal to GlobalWeblify`}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-900/10"
                >
                  Reply via Email
                </a>
                <button
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-2 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold transition-all"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Delete Single Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[10000] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200 p-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-2">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-lg font-black text-gray-900">Delete Submission?</h3>
              <p className="text-xs text-gray-500 font-semibold mb-2">
                Are you sure you want to delete this submission? This action cannot be undone.
              </p>
              <div className="flex w-full gap-3 mt-4">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 font-bold rounded-xl text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    executeDelete(deleteConfirmId);
                    setDeleteConfirmId(null);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-red-900/10"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Confirmation Modal */}
      {deleteAllConfirmOpen && (
        <div className="fixed inset-0 z-[10000] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200 p-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-2">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-lg font-black text-gray-900">Delete All Submissions?</h3>
              <p className="text-xs text-gray-500 font-semibold mb-2">
                Are you sure you want to delete <strong>ALL</strong> partnership submissions? This will permanently remove all data and cannot be undone.
              </p>
              <div className="flex w-full gap-3 mt-4">
                <button
                  onClick={() => setDeleteAllConfirmOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 font-bold rounded-xl text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    executeDeleteAll();
                    setDeleteAllConfirmOpen(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-red-900/10"
                >
                  Delete All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
