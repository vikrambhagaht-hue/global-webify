'use client';

import React, { useState } from 'react';
import { Search, Download, Trash2, Mail, Phone, Calendar, Briefcase, FileText, CheckCircle2, XCircle, Link as LinkIcon, ExternalLink, Settings } from 'lucide-react';
import { deleteApplication, saveLockDuration, deleteAllApplications } from '@/app/admin/(dashboard)/careers/actions';

interface JobApplication {
  id: number;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  resumeUrl: string;
  coverLetter?: string | null;
  linkedin?: string | null;
  portfolio?: string | null;
  createdAt: Date;
}



export default function JobApplicationsListClient({ 
  applications: initialApplications,
  initialLockDays
}: { 
  applications: JobApplication[];
  initialLockDays: number;
}) {
  const [applications, setApplications] = useState<JobApplication[]>(initialApplications);
  const [search, setSearch] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<{ name: string; letter: string } | null>(null);
  const [selectedResume, setSelectedResume] = useState<{ name: string; url: string } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Settings State
  const [lockDays, setLockDays] = useState(initialLockDays);
  const [savingLock, setSavingLock] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveLock = async () => {
    setSavingLock(true);
    try {
      await saveLockDuration(lockDays);
      showToast('Lock duration updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update lock settings.', 'error');
    } finally {
      setSavingLock(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this job application? The resume will also be deleted from Cloudinary. This action cannot be undone.')) {
      setDeletingId(id);
      try {
        await deleteApplication(id);
        setApplications(applications.filter((a) => a.id !== id));
        showToast('Application deleted successfully!', 'success');
      } catch (error) {
        showToast('Failed to delete application.', 'error');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (confirm('Are you sure you want to delete ALL job applications? ALL resumes will also be deleted from Cloudinary. This action cannot be undone.')) {
      setDeletingAll(true);
      try {
        await deleteAllApplications();
        setApplications([]);
        showToast('All applications deleted successfully!', 'success');
        setCurrentPage(1);
      } catch (error) {
        showToast('Failed to delete all applications.', 'error');
      } finally {
        setDeletingAll(false);
      }
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredApplications = applications.filter((app) => {
    return (
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / itemsPerPage));
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-[#1a8b4c] font-lexend uppercase tracking-tight">
            Job Applications
          </h3>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
            Review and manage incoming candidate applications
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-80 group">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 group-hover:text-[#1a8b4c] transition-colors">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search applicants or jobs..."
              className="w-full bg-white border-2 border-gray-150 hover:border-gray-250 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] focus:ring-4 focus:ring-[#1a8b4c]/5 transition-all shadow-sm"
            />
          </div>
          {applications.length > 0 && (
            <button
              onClick={handleDeleteAll}
              disabled={deletingAll}
              className="px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50"
            >
              <Trash2 size={15} />
              {deletingAll ? 'Deleting...' : 'Delete All'}
            </button>
          )}
        </div>
      </div>

      {/* Settings Row */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-left">
          <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider font-lexend flex items-center gap-1.5">
            <Settings size={14} className="text-[#1a8b4c]" />
            Application Lock Settings
          </h4>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed max-w-lg mt-1">
            <span className="text-amber-600 block mb-1">
              Note: This feature prevents users from re-applying for the same job multiple times to block spam.
            </span>
            If you set this to 30 days, candidates cannot submit a new application for the same role until 30 days have passed. You can increase or decrease this limit here.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={lockDays}
              onChange={(e) => setLockDays(parseInt(e.target.value, 10) || 0)}
              className="w-20 bg-gray-50 border border-gray-250 rounded-xl px-3 py-2 text-xs font-black text-center text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:bg-white"
            />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Days</span>
          </div>
          <button
            onClick={handleSaveLock}
            disabled={savingLock}
            className="bg-[#1a8b4c] hover:bg-[#15703d] text-white font-black py-2 px-4 rounded-xl shadow-md transition-all text-xs uppercase tracking-wider disabled:opacity-50"
          >
            {savingLock ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Main Applications List */}
      {applications.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-lg">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-green-50 text-[#1a8b4c] flex items-center justify-center mx-auto text-3xl">
              📄
            </div>
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest font-lexend">
              No Applications Submitted
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed font-semibold">
              Currently there are no job applications submitted. Job postings are live on the website.
            </p>
          </div>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center text-gray-400 font-bold shadow-sm">
          No matching applications found.
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-100 text-[10px] font-black uppercase tracking-wider text-gray-400">
                  <th className="py-4 px-6">Applicant</th>
                  <th className="py-4 px-6">Applied For</th>
                  <th className="py-4 px-6">Experience</th>
                  <th className="py-4 px-6">Links</th>
                  <th className="py-4 px-6">Submission Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-700">
                {paginatedApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Applicant details */}
                    <td className="py-4 px-6 space-y-1">
                      <div className="text-sm font-black text-gray-900">{app.name}</div>
                      <div className="flex flex-col gap-1 text-[10px] text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Mail size={12} className="text-gray-400" />
                          <a href={`mailto:${app.email}`} className="hover:underline">{app.email}</a>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Phone size={12} className="text-gray-400" />
                          <a href={`tel:${app.phone}`} className="hover:underline">{app.phone}</a>
                        </span>
                      </div>
                    </td>

                    {/* Applied For */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-gray-900 font-bold">
                        <Briefcase size={14} className="text-[#1a8b4c]" />
                        {app.jobTitle}
                      </div>
                    </td>

                    {/* Experience level */}
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border bg-gray-50 border-gray-200/80 text-gray-600">
                        {app.experience}
                      </span>
                    </td>

                    {/* Documents & Links */}
                    <td className="py-4 px-6 space-y-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedResume({ name: app.name, url: app.resumeUrl })}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1a8b4c] hover:underline cursor-pointer bg-transparent border-0 p-0"
                      >
                        <FileText size={14} /> Resume/CV <ExternalLink size={10} />
                      </button>
                      <div className="flex items-center gap-3">
                        {app.linkedin && (
                          <a
                            href={app.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="LinkedIn Profile"
                          >
                            <LinkIcon size={13} />
                          </a>
                        )}
                        {app.portfolio && (
                          <a
                            href={app.portfolio}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-400 hover:text-[#1a8b4c] transition-colors"
                            title="Portfolio Website"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Submission date */}
                    <td className="py-4 px-6 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-gray-400" />
                        {new Date(app.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right space-x-2">
                      {app.coverLetter && (
                        <button
                          type="button"
                          onClick={() => setSelectedLetter({ name: app.name, letter: app.coverLetter || '' })}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-[#1a8b4c] hover:text-white rounded-lg border border-gray-150 hover:border-transparent transition-all font-black uppercase tracking-wider text-[10px]"
                        >
                          Cover Letter
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(app.id)}
                        disabled={deletingId === app.id}
                        className="p-2 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-xl transition-all inline-flex align-middle"
                        title="Delete Application"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredApplications.length)} of {filteredApplications.length} entries
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-[10px] font-bold text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-all uppercase tracking-wider"
                >
                  Previous
                </button>
                <div className="text-[10px] font-black text-gray-900 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                  {currentPage} / {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-[10px] font-bold text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-all uppercase tracking-wider"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cover Letter Modal overlay */}
      {selectedLetter && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedLetter(null)}
            className="absolute inset-0 bg-[#0a1911]/60 backdrop-blur-sm transition-opacity"
          />
          <div className="relative bg-white rounded-3xl w-full max-w-xl max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-base font-black text-gray-950 uppercase tracking-wide font-lexend mb-1 border-b border-gray-100 pb-3">
              Cover Letter: {selectedLetter.name}
            </h2>
            <div className="text-xs text-gray-600 font-semibold leading-relaxed whitespace-pre-line py-4">
              {selectedLetter.letter}
            </div>
            <button
              onClick={() => setSelectedLetter(null)}
              className="mt-4 w-full bg-[#1a8b4c] hover:bg-[#15703d] text-white font-black py-2.5 px-4 rounded-xl shadow-sm transition-all text-xs uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Resume Preview Modal overlay */}
      {selectedResume && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedResume(null)}
            className="absolute inset-0 bg-[#0a1911]/60 backdrop-blur-sm transition-opacity"
          />
          <div className="relative bg-white rounded-3xl w-full max-w-4xl h-[90vh] shadow-2xl border border-gray-100 flex flex-col p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div>
                <h2 className="text-base font-black text-gray-950 uppercase tracking-wide font-lexend">
                  Resume Preview: {selectedResume.name}
                </h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  PDF Preview with direct download option
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                  Scroll to view all pages
                </span>
                <a
                  href={selectedResume.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#1a8b4c] hover:bg-[#15703d] text-white font-black py-2 px-4 rounded-xl shadow-md transition-all text-xs uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Download size={14} /> Download
                </a>
                <button
                  onClick={() => setSelectedResume(null)}
                  className="px-3 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-xs uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            </div>
            
            <div className="flex-1 w-full rounded-2xl bg-gray-50 border border-gray-150 overflow-hidden relative">
              {selectedResume.url.toLowerCase().match(/\.(pdf)$/i) ? (
                <embed
                  src={selectedResume.url}
                  type="application/pdf"
                  className="w-full h-full"
                  style={{ minHeight: '100%' }}
                />
              ) : selectedResume.url.toLowerCase().match(/\.(doc|docx)$/i) ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50/50">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#1a8b4c] flex items-center justify-center text-2xl mb-4">
                    📝
                  </div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider font-lexend mb-1">
                    Word Document
                  </h3>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-6 max-w-xs leading-relaxed">
                    Word documents (.doc/.docx) must be downloaded to view.
                  </p>
                  <a
                    href={selectedResume.url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#1a8b4c] hover:bg-[#15703d] text-white font-black py-2.5 px-6 rounded-xl shadow-md transition-all text-xs uppercase tracking-wider flex items-center gap-2"
                  >
                    <Download size={14} /> Download Document
                  </a>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50/50">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#1a8b4c] flex items-center justify-center text-2xl mb-4">
                    📝
                  </div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider font-lexend mb-1">
                    Document Preview Not Available
                  </h3>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-6 max-w-xs leading-relaxed">
                    Please download to view this file type.
                  </p>
                  <a
                    href={selectedResume.url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#1a8b4c] hover:bg-[#15703d] text-white font-black py-2.5 px-6 rounded-xl shadow-md transition-all text-xs uppercase tracking-wider flex items-center gap-2"
                  >
                    <Download size={14} /> Download Document
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast popup */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[9999] px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 border animate-in slide-in-from-bottom-4 duration-300 ${
            toast.type === 'success' ? 'bg-gray-900 text-white border-gray-800' : 'bg-red-600 text-white border-red-700'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 size={18} className="text-[#1a8b4c]" /> : <XCircle size={18} />}
          <span className="text-xs tracking-wide">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
