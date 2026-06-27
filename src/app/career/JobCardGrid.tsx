'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Briefcase, Calendar, Clock, DollarSign, ArrowRight, X, AlertCircle } from 'lucide-react';
import CareersFormClient from './CareersFormClient';

interface Job {
  id: number;
  title: string;
  slug: string;
  location: string;
  type: string;
  experience?: string | null;
  salary?: string | null;
  category: string;
  lastDate?: Date | string | null;
  isActive: boolean;
  createdAt: Date | string;
}

export default function JobCardGrid({ jobs }: { jobs: Job[] }) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  function formatSalary(salary: string | null | undefined) {
    if (!salary) return 'Competitive';
    return salary.trim().replace(/^(₹|rs\.?)\s*/i, '');
  }

  // Get color configuration for different job categories
  function getCategoryColor(category: string) {
    const cat = category.toLowerCase();
    if (cat.includes('dev')) {
      return 'bg-blue-50 border-blue-100 text-blue-600';
    } else if (cat.includes('marketing') || cat.includes('seo')) {
      return 'bg-amber-50 border-amber-100 text-amber-600';
    } else if (cat.includes('design') || cat.includes('ux') || cat.includes('ui')) {
      return 'bg-purple-50 border-purple-100 text-purple-600';
    } else if (cat.includes('content') || cat.includes('writ')) {
      return 'bg-pink-50 border-pink-100 text-pink-600';
    }
    return 'bg-emerald-50 border-emerald-100 text-emerald-600';
  }

  return (
    <div className="space-y-12">
      {/* Grid container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobs.map((job) => {
          const isExpired = job.lastDate ? new Date(job.lastDate) < new Date() : false;
          return (
            <div
              key={job.id}
              className="group bg-white border border-gray-100/80 hover:border-[#1a8b4c]/30 rounded-3xl p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_rgba(26,139,76,0.08)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-[340px]"
            >
              <div className="space-y-4">
                {/* Badge Category and Expiry */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border ${getCategoryColor(job.category)}`}>
                    {job.category}
                  </span>
                  {job.lastDate && (
                    <span className="text-[9px] font-bold text-rose-500 bg-rose-50 border border-rose-100/50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <AlertCircle size={10} />
                      {new Date(job.lastDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>

                {/* Job Title */}
                <div>
                  <h3 className="text-lg font-black text-gray-900 group-hover:text-[#1a8b4c] transition-colors leading-tight font-lexend">
                    {job.title}
                  </h3>
                  <span className="inline-block mt-1 text-[9px] font-black uppercase text-gray-400 tracking-wider bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
                    {job.type}
                  </span>
                </div>

                {/* Details list */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2.5 text-xs text-gray-600 font-semibold font-jost">
                    <MapPin size={15} className="text-[#1a8b4c]/70 shrink-0" />
                    <span>{job.location}</span>
                  </div>
                  
                  {job.experience && (
                    <div className="flex items-center gap-2.5 text-xs text-gray-600 font-semibold font-jost">
                      <Clock size={15} className="text-[#1a8b4c]/70 shrink-0" />
                      <span>{job.experience}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2.5 text-xs text-gray-600 font-bold font-jost text-emerald-700">
                    {job.salary ? (
                      <span className="text-base font-black text-[#1a8b4c]/90 shrink-0 select-none leading-none">₹</span>
                    ) : (
                      <DollarSign size={15} className="text-[#1a8b4c]/70 shrink-0" />
                    )}
                    <span>{formatSalary(job.salary)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-50 pt-5 flex gap-3">
                <Link
                  href={`/career/${job.slug}`}
                  className="flex-1 text-center border-2 border-gray-150 hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-black py-3 rounded-xl transition-all text-[11px] uppercase tracking-wider font-jost"
                >
                  View Details
                </Link>
                <button
                  onClick={() => setSelectedJob(job)}
                  className="flex-1 bg-[#1a8b4c] hover:bg-[#15703d] text-white font-black py-3 rounded-xl shadow-lg shadow-[#1a8b4c]/10 hover:shadow-xl hover:shadow-[#1a8b4c]/20 transition-all text-[11px] uppercase tracking-wider font-jost"
                >
                  Apply Now
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modern Apply Modal overlay */}
      {selectedJob && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedJob(null)}
            className="absolute inset-0 bg-[#0a1911]/60 backdrop-blur-sm transition-opacity"
          />

          <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col p-6 md:p-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              onClick={() => setSelectedJob(null)}
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
                {selectedJob.title}
              </p>
              <div className="w-12 h-1 bg-[#1a8b4c] mx-auto mt-3 rounded-full"></div>
            </div>

            {/* Application Form */}
            <CareersFormClient
              positions={[{ value: selectedJob.slug, label: selectedJob.title }]}
              defaultPosition={selectedJob.title}
            />
          </div>
        </div>
      )}
    </div>
  );
}
