import React from 'react';
import HomeView from '@/features/home/components/HomeView';

export const revalidate = 3600; // Cache page and revalidate at most every hour or on-demand via revalidatePath

export default async function Home() {
  return <HomeView />;
}
