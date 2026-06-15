import React from 'react';
import { getRedirects, getAvailableRoutes } from './actions';
import RedirectListClient from '@/features/admin/components/redirects/RedirectListClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminRedirectsPage() {
  const redirects = await getRedirects();
  const availableRoutes = await getAvailableRoutes();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 font-sans">
        <h2 className="text-xl md:text-2xl font-black text-gray-900 font-poppins uppercase tracking-tight">
          SEO Redirect Manager
        </h2>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
          Safeguard your Google indexed search listings. Redirect obsolete or old site URLs to new Next.js routes.
        </p>
      </div>

      <RedirectListClient initialRedirects={redirects} availableRoutes={availableRoutes} />
    </div>
  );
}
