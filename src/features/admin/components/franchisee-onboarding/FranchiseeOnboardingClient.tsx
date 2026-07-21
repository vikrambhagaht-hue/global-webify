'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Save, Check, AlertCircle, Upload, X, Building, Phone, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';

interface FranchiseeRecord {
  id: number;
  photo: string | null;
  name: string;
  email: string;
  phone: string;
  companyName: string | null;
  address: string | null;
  experience: string | null;
  status: string;
  notes: string | null;
  createdAt: Date;
}

export default function FranchiseeOnboardingClient({ initialRecords }: { initialRecords: any[] }) {
  const [records, setRecords] = useState<FranchiseeRecord[]>(
    initialRecords.map((r) => ({
      ...r,
      createdAt: new Date(r.createdAt),
    }))
  );
  
  const [isPending, setIsPending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [id, setId] = useState<number | undefined>(undefined);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [experience, setExperience] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState('');
  const [compressStats, setCompressStats] = useState<{ original: number; compressed: number } | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    fetch('/api/auth/csrf')
      .then(res => res.json())
      .then(data => {
        if (data.csrfToken) setCsrfToken(data.csrfToken);
      })
      .catch(() => {});
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleReset = () => {
    setId(undefined);
    setName('');
    setEmail('');
    setPhone('');
    setCompanyName('');
    setAddress('');
    setExperience('');
    setStatus('PENDING');
    setNotes('');
    setPhoto('');
    setCompressStats(null);
    setIsCompressing(false);
    setStatusMsg(null);
  };

  const handleOpenAddNew = () => {
    handleReset();
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      setCompressStats(null);

      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 800; // max width for franchisee photos
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context error');
      ctx.drawImage(img, 0, 0, width, height);

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.8));
      if (!blob) throw new Error('Blob creation failed');

      setCompressStats({
        original: file.size,
        compressed: blob.size,
      });

      const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: 'image/webp' });

      setIsCompressing(false);
      setIsPending(true);

      const formData = new FormData();
      formData.append('file', compressedFile);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': csrfToken,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setPhoto(data.url);
        setStatusMsg({ type: 'success', text: 'Photo compressed & uploaded successfully!' });
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Upload failed' });
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'error', text: 'Upload or compression error occurred' });
    } finally {
      setIsCompressing(false);
      setIsPending(false);
    }
  };

  const handleEdit = (r: FranchiseeRecord) => {
    setId(r.id);
    setName(r.name);
    setEmail(r.email);
    setPhone(r.phone);
    setCompanyName(r.companyName || '');
    setAddress(r.address || '');
    setExperience(r.experience || '');
    setStatus(r.status);
    setNotes(r.notes || '');
    setPhoto(r.photo || '');
    setCompressStats(null);
    setIsCompressing(false);
    setStatusMsg(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setStatusMsg({ type: 'error', text: 'Name, Email, and Phone are required.' });
      return;
    }

    setIsPending(true);
    try {
      const payload = {
        id,
        name,
        email,
        phone,
        companyName,
        address,
        experience,
        status,
        notes,
        photo,
      };

      const method = id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/franchisee-onboarding', {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        if (id) {
          setRecords((prev) => prev.map((r) => (r.id === id ? { ...data.record, createdAt: new Date(data.record.createdAt) } : r)));
        } else {
          setRecords((prev) => [{ ...data.record, createdAt: new Date(data.record.createdAt) }, ...prev]);
        }
        setShowModal(false);
        handleReset();
        setStatusMsg({ type: 'success', text: 'Record saved successfully!' });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Failed to save.' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'An error occurred.' });
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async (recordId: number, recordName: string) => {
    if (!confirm(`Are you sure you want to delete ${recordName}?`)) return;

    setIsPending(true);
    try {
      const res = await fetch(`/api/admin/franchisee-onboarding?id=${recordId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': csrfToken,
        },
      });
      const data = await res.json();
      if (data.success) {
        setRecords(records.filter((r) => r.id !== recordId));
        setStatusMsg({ type: 'success', text: 'Record deleted.' });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Failed to delete.' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Delete error occurred.' });
    } finally {
      setIsPending(false);
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'APPROVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-16">
      <div className="bg-gradient-to-r from-[#132a1d] to-[#1a8b4c] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Users size={28} className="text-emerald-400" />
            <h1 className="text-2xl md:text-3xl font-black font-lexend">Franchisee Onboarding</h1>
          </div>
          <p className="text-emerald-100/80 text-sm mt-1">
            Manage franchisee applications, approve partners, and update contact details.
          </p>
        </div>
        <button
          onClick={handleOpenAddNew}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg hover:scale-105"
        >
          <Plus size={20} />
          <span>Add Franchisee</span>
        </button>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 font-semibold text-sm ${
          statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {statusMsg.type === 'success' ? <Check size={18} className="text-emerald-600" /> : <AlertCircle size={18} className="text-red-600" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 space-y-6">
        <h3 className="font-black text-gray-900 text-lg font-lexend border-b border-gray-100 pb-4">
          All Franchisees ({records.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {records.map((r) => (
            <div key={r.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#1a8b4c] opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gray-200 bg-white">
                    {r.photo ? (
                      <Image src={r.photo} alt={r.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold">N/A</div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 leading-tight">{r.name}</h4>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border inline-block mt-1 ${getStatusColor(r.status)}`}>
                      {r.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(r)} className="p-1.5 text-gray-400 hover:text-[#1a8b4c] bg-white rounded-md border border-gray-100 shadow-sm"><Edit2 size={14}/></button>
                  <button onClick={() => handleDelete(r.id, r.name)} className="p-1.5 text-gray-400 hover:text-red-600 bg-white rounded-md border border-gray-100 shadow-sm"><Trash2 size={14}/></button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2"><Mail size={14} className="text-gray-400"/> {r.email}</div>
                <div className="flex items-center gap-2"><Phone size={14} className="text-gray-400"/> {r.phone}</div>
                {r.companyName && <div className="flex items-center gap-2"><Building size={14} className="text-gray-400"/> {r.companyName}</div>}
                {r.address && <div className="flex items-center gap-2"><MapPin size={14} className="text-gray-400"/> <span className="truncate">{r.address}</span></div>}
              </div>

              {r.notes && (
                <div className="bg-yellow-50 border border-yellow-100 p-2.5 rounded-lg text-xs text-yellow-800 line-clamp-2 mt-auto">
                  <span className="font-bold mr-1">Notes:</span>{r.notes}
                </div>
              )}
            </div>
          ))}
          {records.length === 0 && (
            <div className="col-span-full py-10 text-center text-gray-400 font-semibold">
              No franchisee records found.
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden my-8 animate-scaleUp border border-gray-100">
            <div className="bg-gradient-to-r from-[#132a1d] to-[#1a8b4c] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-black font-lexend">{id ? `Edit Franchisee: ${name}` : 'Add New Franchisee'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-full hover:bg-white/10 text-white/80 transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
              
              <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-100 pb-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                  {photo ? (
                    <Image src={photo} alt="Photo" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <Users size={24} />
                      <span className="text-[10px] font-bold mt-1">Photo</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Upload Photo</label>
                  <label className="cursor-pointer bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all text-xs w-full sm:w-auto">
                    <Upload size={16} />
                    <span>{isCompressing ? 'Compressing...' : isPending ? 'Uploading...' : 'Choose File'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isPending || isCompressing} />
                  </label>
                  {compressStats && (
                    <div className="mt-2.5 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-inner">
                      <div className="flex items-center gap-2">
                        <span className="opacity-70">Original:</span>
                        <strong className="text-sm">{formatBytes(compressStats.original)}</strong>
                      </div>
                      <span className="text-emerald-400 rotate-90 sm:rotate-0">→</span>
                      <div className="flex items-center gap-2">
                        <span className="opacity-70">Compressed:</span>
                        <strong className="text-sm">{formatBytes(compressStats.compressed)}</strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name *</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1a8b4c] outline-none text-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1a8b4c] outline-none text-sm font-semibold bg-white">
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email *</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1a8b4c] outline-none text-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number *</label>
                  <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1a8b4c] outline-none text-sm font-semibold" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Company Name</label>
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1a8b4c] outline-none text-sm font-semibold" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Address</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1a8b4c] outline-none text-sm font-semibold" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Experience</label>
                <input type="text" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g. 5 years in Sales" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1a8b4c] outline-none text-sm font-semibold" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Internal Notes</label>
                <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Private notes for admins only..." className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1a8b4c] outline-none text-sm font-semibold resize-none bg-yellow-50/30" />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 font-bold text-xs transition-colors">Cancel</button>
                <button type="submit" disabled={isPending} className="bg-[#1a8b4c] hover:bg-[#15703d] text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 text-xs disabled:opacity-50">
                  <Save size={16} />
                  <span>{isPending ? 'Saving...' : 'Save Record'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
