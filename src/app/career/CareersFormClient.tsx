'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Upload } from 'lucide-react';

interface PositionOption {
  value: string;
  label: string;
}

export default function CareersFormClient({ positions, defaultPosition }: { positions: PositionOption[]; defaultPosition?: string }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState(defaultPosition || '');
  const [experience, setExperience] = useState('');
  const [resume, setResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [agreed, setAgreed] = useState(false);

  const [uploadingResume, setUploadingResume] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setStatus(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload-public', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setResume(data.url);
        setStatus({ message: 'CV uploaded successfully!', type: 'success' });
      } else {
        setStatus({ message: 'Upload failed: ' + data.message, type: 'error' });
      }
    } catch (err) {
      setStatus({ message: 'Failed to upload CV. Please try again.', type: 'error' });
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !phone || !position || !resume || !agreed) {
      setStatus({ message: 'Please fill out all required fields (including CV upload) and agree to the terms.', type: 'error' });
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setStatus({ message: 'Phone number must be exactly 10 digits.', type: 'error' });
      return;
    }

    if (/https?:\/\//i.test(coverLetter) || /\bwww\./i.test(coverLetter)) {
      setStatus({ message: 'Links and URLs are not allowed in the cover letter.', type: 'error' });
      return;
    }

    setSubmitting(true);
    setStatus(null);

    const messageText = `
Experience: ${experience}
Resume URL: ${resume}
LinkedIn: ${linkedin || 'Not Provided'}
Portfolio: ${portfolio || 'Not Provided'}

Cover Letter:
${coverLetter || 'None'}
    `.trim();

    try {
      const response = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          phone: cleanPhone,
          jobTitle: position,
          experience,
          resumeUrl: resume,
          coverLetter: coverLetter || null,
          linkedin: linkedin || null,
          portfolio: portfolio || null,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setStatus({ message: 'Application submitted successfully! Our HR team will contact you soon.', type: 'success' });
        // Reset form
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setPosition(defaultPosition || '');
        setExperience('');
        setResume('');
        setCoverLetter('');
        setLinkedin('');
        setPortfolio('');
        setAgreed(false);
      } else {
        throw new Error(result.error || 'Server rejected application submission');
      }
    } catch (error: any) {
      console.error(error);
      setStatus({ message: error.message || 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {status && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 text-xs font-bold leading-relaxed ${
            status.type === 'success' ? 'bg-[#f0fdf4] border-green-200 text-[#1a8b4c]' : 'bg-red-50 border-red-200 text-red-600'
          }`}
        >
          {status.type === 'success' ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : <XCircle size={18} className="shrink-0 mt-0.5" />}
          <span>{status.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">First Name *</label>
          <input
            type="text"
            required
            maxLength={50}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"
            className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Last Name *</label>
          <input
            type="text"
            required
            maxLength={50}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"
            className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Email Address *</label>
          <input
            type="email"
            required
            maxLength={80}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Phone Number *</label>
          <input
            type="tel"
            required
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder=""
            className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Position Applied For *</label>
        <select
          required
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all"
        >
          <option value="">Select a position</option>
          {positions.map((pos) => (
            <option key={pos.value} value={pos.label}>
              {pos.label}
            </option>
          ))}
          <option value="General Application">General / Other Positions</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Years of Experience *</label>
        <select
          required
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all"
        >
          <option value="">Select experience level</option>
          <option value="0-1 Years">0-1 Years</option>
          <option value="1-3 Years">1-3 Years</option>
          <option value="3-5 Years">3-5 Years</option>
          <option value="5-10 Years">5-10 Years</option>
          <option value="10+ Years">10+ Years</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Upload Resume/CV (PDF, DOC, DOCX) *</label>
        <div className="flex gap-2">
          <input
            type="file"
            required={!resume}
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            disabled={uploadingResume}
            className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-black file:uppercase file:bg-green-50 file:text-[#1a8b4c] file:cursor-pointer hover:file:bg-green-100 disabled:opacity-50"
          />
        </div>
        {uploadingResume && (
          <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Uploading your CV... Please wait.</p>
        )}
        {resume && (
          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">✓ CV uploaded successfully!</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">LinkedIn Profile URL</label>
        <input
          type="url"
          maxLength={150}
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          placeholder="https://linkedin.com/in/yourprofile"
          className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs font-mono font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Portfolio / Website URL</label>
        <input
          type="url"
          maxLength={150}
          value={portfolio}
          onChange={(e) => setPortfolio(e.target.value)}
          placeholder="https://yourportfolio.com"
          className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs font-mono font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Cover Letter (Max 1000 characters)</label>
        <textarea
          rows={5}
          maxLength={1000}
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Introduce yourself and tell us why you are a great fit..."
          className="w-full bg-gray-50/50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a8b4c] focus:bg-white transition-all resize-none"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <input
          type="checkbox"
          id="terms"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="w-4 h-4 rounded text-[#1a8b4c] focus:ring-[#1a8b4c]/20 border-gray-300"
        />
        <label htmlFor="terms" className="text-xs font-bold text-gray-700 uppercase tracking-wide cursor-pointer select-none">
          I agree to the terms & conditions of applying *
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting || uploadingResume}
        className="w-full bg-[#1a8b4c] hover:bg-[#15703d] text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-[#1a8b4c]/10 hover:shadow-2xl transition-all text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting Application...' : 'Submit Application'}
      </button>
    </form>
  );
}
