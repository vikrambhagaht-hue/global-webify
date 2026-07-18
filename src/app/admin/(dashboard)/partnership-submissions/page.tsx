import React from 'react';
import { db } from '@/lib/db';
import PartnershipSubmissionsClient from '@/features/admin/components/contacts/PartnershipSubmissionsClient';

export const revalidate = 0;

async function fetchSubmissions() {
  try {
    const data = await db.$queryRaw<any[]>`SELECT * FROM PartnershipSubmission ORDER BY createdAt DESC`;
    return data.map(sub => ({
      ...sub,
      createdAt: sub.createdAt ? new Date(sub.createdAt).toISOString() : new Date().toISOString()
    }));
  } catch (e) {
    console.error(e);
    return [];
  }
}

export default async function PartnershipSubmissionsPage() {
  const submissions = await fetchSubmissions();
  return (
    <div className="font-sans text-left space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-gray-900 font-poppins uppercase tracking-tight">
          Partnership Requests
        </h2>
        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mt-1">
          Review and manage incoming partnership proposals
        </p>
      </div>
      <PartnershipSubmissionsClient initialSubmissions={submissions} />
    </div>
  );
}
