'use client';

import React, { useState, useTransition } from 'react';
import { Users, Plus, Edit2, Trash2, Save, RotateCcw, ArrowUp, ArrowDown, Check, AlertCircle, Share2, Award, Briefcase, Upload, Instagram, Linkedin, Facebook, Twitter, X } from 'lucide-react';
import Image from 'next/image';
import { TeamMember, saveTeamMember, deleteTeamMember, reorderTeamMembers } from './actions';

interface Props {
  initialMembers: TeamMember[];
}

export default function AdminTeamClient({ initialMembers }: Props) {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [id, setId] = useState<number | undefined>(undefined);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState('');
  const [bio, setBio] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [isExEmployee, setIsExEmployee] = useState(false);
  const [order, setOrder] = useState<number | undefined>(undefined);
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');

  const handleReset = () => {
    setId(undefined);
    setName('');
    setRole('');
    setImage('');
    setBio('');
    setEducation('');
    setExperience('');
    setIsExEmployee(false);
    setOrder(undefined);
    setFacebook('');
    setInstagram('');
    setLinkedin('');
    setTwitter('');
    setStatusMsg(null);
  };

  const handleOpenAddNew = () => {
    handleReset();
    setShowModal(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 500;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setImage(event.target?.result as string);
          return;
        }
        // Center crop to 1:1 square
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
        const webpDataUrl = canvas.toDataURL("image/webp", 0.85);
        setImage(webpDataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = (m: TeamMember) => {
    setId(m.id);
    setName(m.name);
    setRole(m.role);
    setImage(m.image);
    setBio(m.bio);
    setEducation(m.education || '');
    setExperience(m.experience || '');
    setIsExEmployee(Boolean(m.isExEmployee));
    setOrder(m.order);
    setFacebook(m.socials?.facebook || '');
    setInstagram(m.socials?.instagram || '');
    setLinkedin(m.socials?.linkedin || '');
    setTwitter(m.socials?.twitter || '');
    setStatusMsg(null);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !image.trim()) {
      setStatusMsg({ type: 'error', text: 'Name, Role, and Image path are required.' });
      return;
    }

    const payload: TeamMember = {
      id: id || 0,
      name: name.trim(),
      role: role.trim(),
      image: image.trim(),
      bio: bio.trim(),
      education: education.trim(),
      experience: experience.trim(),
      isExEmployee,
      order: order || members.length + 1,
      socials: {
        facebook: facebook.trim(),
        instagram: instagram.trim(),
        linkedin: linkedin.trim(),
        twitter: twitter.trim(),
      }
    };

    startTransition(async () => {
      try {
        await saveTeamMember(payload);
        // Update local state
        let updated: TeamMember[];
        if (id) {
          updated = members.map((m) => (m.id === id ? { ...payload, id } : m));
        } else {
          const newId = members.length > 0 ? Math.max(...members.map((m) => m.id)) + 1 : 1;
          updated = [...members, { ...payload, id: newId }];
        }
        updated.sort((a, b) => (a.order || 0) - (b.order || 0));
        setMembers(updated);
        setStatusMsg({ type: 'success', text: id ? 'Team member updated successfully!' : 'Team member added successfully!' });
        setShowModal(false);
        handleReset();
      } catch (err) {
        setStatusMsg({ type: 'error', text: 'Failed to save team member.' });
      }
    });
  };

  const handleDelete = (memberId: number, memberName: string) => {
    if (!confirm(`Are you sure you want to delete ${memberName}?`)) return;

    startTransition(async () => {
      try {
        await deleteTeamMember(memberId);
        setMembers(members.filter((m) => m.id !== memberId));
        setStatusMsg({ type: 'success', text: 'Team member deleted.' });
        if (id === memberId) {
          setShowModal(false);
          handleReset();
        }
      } catch (err) {
        setStatusMsg({ type: 'error', text: 'Failed to delete member.' });
      }
    });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === members.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newMembers = [...members];
    const temp = newMembers[index];
    newMembers[index] = newMembers[targetIndex];
    newMembers[targetIndex] = temp;

    // Update order numbers
    newMembers.forEach((m, idx) => {
      m.order = idx + 1;
    });

    setMembers(newMembers);

    startTransition(async () => {
      try {
        await reorderTeamMembers(newMembers.map((m) => m.id));
        setStatusMsg({ type: 'success', text: 'Team sequence updated!' });
      } catch (err) {
        setStatusMsg({ type: 'error', text: 'Failed to reorder sequence.' });
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#132a1d] to-[#1a8b4c] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Users size={28} className="text-emerald-400" />
            <h1 className="text-2xl md:text-3xl font-black font-lexend">Manage Team & Sequence</h1>
          </div>
          <p className="text-emerald-100/80 text-sm mt-1">
            Add members, upload photo links, manage Ex-Employee tags, and change display sequence on Team page.
          </p>
        </div>
        <button
          onClick={handleOpenAddNew}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg hover:scale-105"
        >
          <Plus size={20} />
          <span>Add New Member</span>
        </button>
      </div>

      {/* Status Message */}
      {statusMsg && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 font-semibold text-sm ${
          statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {statusMsg.type === 'success' ? <Check size={18} className="text-emerald-600" /> : <AlertCircle size={18} className="text-red-600" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Full Width List Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-black text-gray-900 text-lg font-lexend">
              All Team Members ({members.length})
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Click Edit on any card to modify photo, role, socials or Ex-Employee status.</p>
          </div>
          <span className="text-xs font-bold bg-emerald-50 text-[#1a8b4c] px-3 py-1.5 rounded-xl border border-emerald-200">
            Use ⬆ ⬇ arrows to change display sequence
          </span>
        </div>

        <div className="flex flex-col gap-3.5">
          {members.map((m, idx) => (
            <div
              key={m.id}
              className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/80 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md hover:bg-white"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Sequence Arrows + Number */}
                <div className="flex flex-col items-center gap-1 border-r border-gray-200 pr-3 shrink-0">
                  <button
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0 || isPending}
                    title="Move Up in Sequence"
                    className="p-1 rounded-lg hover:bg-gray-200 text-gray-600 disabled:opacity-20 disabled:hover:bg-transparent"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <span className="text-xs font-black text-gray-700 w-8 text-center bg-white border border-gray-200 py-0.5 rounded-md">
                    #{idx + 1}
                  </span>
                  <button
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === members.length - 1 || isPending}
                    title="Move Down in Sequence"
                    className="p-1 rounded-lg hover:bg-gray-200 text-gray-600 disabled:opacity-20 disabled:hover:bg-transparent"
                  >
                    <ArrowDown size={16} />
                  </button>
                </div>

                {/* Avatar */}
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-200 shrink-0 border border-gray-200 shadow-sm">
                  {m.image ? (
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      className={`object-cover ${m.isExEmployee ? 'grayscale' : ''}`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">N/A</div>
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-gray-900 text-base sm:text-lg">{m.name}</h4>
                    {m.isExEmployee && (
                      <span className="bg-red-100 text-red-700 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Ex-Employee
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#1a8b4c] mt-0.5">{m.role}</p>
                  {m.bio && (
                    <p className="text-xs text-gray-500 line-clamp-1 mt-1 font-normal max-w-2xl">{m.bio}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleEdit(m)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-emerald-100 hover:text-[#1a8b4c] text-gray-700 font-bold text-xs border border-gray-200 transition-all flex items-center gap-1.5 shadow-sm"
                  title="Edit Member"
                >
                  <Edit2 size={15} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(m.id, m.name)}
                  className="p-2.5 rounded-xl bg-white hover:bg-red-100 hover:text-red-600 text-gray-600 border border-gray-200 transition-all shadow-sm"
                  title="Delete Member"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup Modal for Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden my-8 animate-scaleUp border border-gray-100">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#132a1d] to-[#1a8b4c] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Users className="text-emerald-400" size={22} />
                <h2 className="text-lg font-black font-lexend">
                  {id ? `Edit Member: ${name}` : 'Add New Team Member'}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikram Bhagat"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1a8b4c] outline-none text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Role / Designation *</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Managing Director"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1a8b4c] outline-none text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Display Sequence</label>
                  <input
                    type="number"
                    value={order ?? ''}
                    onChange={(e) => setOrder(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder={`Auto (${members.length + 1})`}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1a8b4c] outline-none text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Photo Image URL / Path / Upload from Computer *
                </label>
                <div className="space-y-2.5">
                  <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                    <input
                      type="text"
                      required
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="/assets/images/team/... or click upload button ->"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1a8b4c] outline-none text-xs sm:text-sm font-semibold truncate bg-white"
                    />
                    <label className="cursor-pointer bg-gradient-to-r from-[#1a8b4c] to-[#0e5e3b] hover:from-[#15703d] hover:to-[#094128] text-white font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 shrink-0 transition-all text-xs">
                      <Upload size={16} />
                      <span>Upload from Computer</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {image && (
                    <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0">
                        <Image src={image} alt="Preview" fill className="object-cover" />
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-bold text-gray-800 block">Preview Loaded</span>
                        <span>Auto-cropped to 1:1 Square (500x500px WebP)</span>
                      </div>
                    </div>
                  )}
                  <p className="text-[11px] text-gray-500 italic">
                    * Recommended format: 1:1 Square (e.g. 500x500px). When uploaded from computer, it automatically crops to square & optimizes to WebP format!
                  </p>
                </div>
              </div>

              {/* Ex-Employee Checkbox */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-gray-800 block">Mark as Ex-Employee</span>
                  <span className="text-xs text-gray-500">Shows Ex-Employee badge and gray photo filter</span>
                </div>
                <input
                  type="checkbox"
                  checked={isExEmployee}
                  onChange={(e) => setIsExEmployee(e.target.checked)}
                  className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Bio Description</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Brief introduction about the team member..."
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1a8b4c] outline-none text-sm font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Education</label>
                  <input
                    type="text"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="e.g. MBA in Marketing"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1a8b4c] outline-none text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Experience</label>
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 10+ years experience"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1a8b4c] outline-none text-xs font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Social Media Links</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-pink-600 pointer-events-none">
                      <Instagram size={16} />
                    </div>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="Instagram URL"
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#1a8b4c] font-medium"
                    />
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-blue-600 pointer-events-none">
                      <Linkedin size={16} />
                    </div>
                    <input
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="LinkedIn URL"
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#1a8b4c] font-medium"
                    />
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-gray-800 pointer-events-none">
                      <Twitter size={16} />
                    </div>
                    <input
                      type="text"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="Twitter / X URL"
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#1a8b4c] font-medium"
                    />
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-blue-500 pointer-events-none">
                      <Facebook size={16} />
                    </div>
                    <input
                      type="text"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder="Facebook URL"
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#1a8b4c] font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-[#1a8b4c] hover:bg-[#15703d] text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 text-xs disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{isPending ? 'Saving...' : id ? 'Update Team Member' : 'Save New Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
