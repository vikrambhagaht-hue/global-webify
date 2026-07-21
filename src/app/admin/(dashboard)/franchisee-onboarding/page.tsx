import React from 'react';
import FranchiseeOnboardingClient from '@/features/admin/components/franchisee-onboarding/FranchiseeOnboardingClient';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminFranchiseeOnboardingPage() {
  const records = await db.franchiseeOnboarding.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <FranchiseeOnboardingClient initialRecords={records} />;
}
