import React from 'react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Clock, Calendar, CheckSquare, MessageSquare } from 'lucide-react';
import JobDetailsClient from './JobDetailsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: { slug: string };
}

export default async function JobDetailsPage({ params }: Props) {
  let job = null;
  try {
    job = await db.job.findUnique({
      where: { slug: params.slug },
    });
  } catch (error) {
    console.error("Prisma error in job.findUnique:", error);
  }

  if (!job || !job.isActive) {
    notFound();
  }

  // Split requirements text by newline for rendering checklist if needed
  const reqList = job.requirements
    ? job.requirements.split('\n').filter((r) => r.trim() !== '')
    : [];

  return (
    <div className="min-h-screen bg-[#f8fbfa] font-sans selection:bg-[#1a8b4c] selection:text-white pb-20">
      {/* Job Details Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0a1911] via-[#0d2218] to-[#122c1f] text-white py-16 md:py-24">
        {/* Animated Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#1a8b4c]/10 blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
          <Link
            href="/career"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-black text-xs uppercase tracking-wider transition-all"
          >
            <ArrowLeft size={14} className="stroke-[2.5]" /> Back to Careers portal
          </Link>

          <div className="space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              {job.type}
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight uppercase font-lexend text-white">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 pt-2 text-xs md:text-sm text-gray-300 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-emerald-400" />
                {job.location}
              </span>
              {job.experience && (
                <span className="flex items-center gap-2">
                  <Clock size={16} className="text-emerald-400" />
                  {job.experience}
                </span>
              )}
              {job.salary && (
                <span className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">₹</span>
                  {job.salary.trim().replace(/^(₹|rs\.?)\s*/i, '')}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main content grid */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <JobDetailsClient job={job as any} reqList={reqList} />
      </section>
    </div>
  );
}
