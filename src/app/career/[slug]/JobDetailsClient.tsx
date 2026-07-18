'use client';

import React, { useState } from 'react';
import { X, MapPin, Clock, Calendar, CheckSquare, MessageSquare } from 'lucide-react';
import { sanitizeHtml } from '@/lib/sanitize';
import CareersFormClient from '../CareersFormClient';

interface Job {
  id: number;
  title: string;
  slug: string;
  location: string;
  type: string;
  experience?: string | null;
  salary?: string | null;
  description: string;
  requirements?: string | null;
}

export default function JobDetailsClient({ job, reqList }: { job: Job; reqList: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
      {/* Job Description Info */}
      <div className="lg:col-span-8 space-y-10 text-left">
        {/* Description */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-wide font-lexend">
            Position Description
          </h2>
          <div
            className="text-gray-600 text-sm md:text-base leading-relaxed space-y-4 font-medium"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.description) }}
          />
        </div>

        {/* Requirements */}
        {reqList.length > 0 && (
          <div className="space-y-4 border-t border-gray-100 pt-8">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-wide font-lexend">
              Requirements & Skills
            </h2>
            <ul className="space-y-3">
              {reqList.map((req, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-gray-600 font-semibold leading-relaxed">
                  <CheckSquare size={16} className="text-[#1a8b4c] shrink-0 mt-0.5" />
                  <span>{req.replace(/^- /, '')}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Quick Apply CTA Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-4 text-left">
          <h3 className="text-sm font-black text-gray-950 uppercase tracking-wider font-lexend">
            Apply for this job
          </h3>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
            Submit your resume and details to apply for this job posting.
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="w-full bg-[#1a8b4c] hover:bg-[#15703d] text-white font-black py-3.5 px-4 rounded-xl shadow-sm hover:shadow-md transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            Apply Now
          </button>
        </div>

        <div className="p-6 bg-[#f0fdf4] border border-green-200/40 rounded-3xl space-y-3 text-left">
          <div className="flex items-center gap-2 text-[#1a8b4c]">
            <MessageSquare size={16} />
            <span className="text-[10px] font-black uppercase tracking-wider">HR Contact</span>
          </div>
          <p className="text-xs font-black text-gray-950">Have questions?</p>
          <p className="text-[11px] text-gray-600 font-semibold leading-relaxed">
            Reach out to us at{' '}
            <a href="mailto:help@globalwebify.com" className="text-[#1a8b4c] underline font-bold">
              help@globalwebify.com
            </a>
            .
          </p>
        </div>
      </div>

      {/* Modern Premium Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
          {/* Backdrop Blur overlay */}
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-[#0a1911]/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal box */}
          <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col p-6 md:p-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-2 mb-8 pr-6">
              <h2 className="text-2xl font-black text-gray-950 uppercase tracking-tight font-lexend">
                Apply for position
              </h2>
              <p className="text-xs text-[#1a8b4c] font-black uppercase tracking-wider">
                {job.title}
              </p>
              <div className="w-12 h-1 bg-[#1a8b4c] mx-auto mt-3 rounded-full"></div>
            </div>

            {/* Application Form */}
            <CareersFormClient
              positions={[{ value: job.slug, label: job.title }]}
              defaultPosition={job.title}
            />
          </div>
        </div>
      )}
    </div>
  );
}
