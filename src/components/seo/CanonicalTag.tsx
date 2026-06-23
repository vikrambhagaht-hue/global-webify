import React from 'react';

export default function CanonicalTag({ path }: { path: string }) {
  const getSiteUrl = () => {
    if (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')) {
      return process.env.NEXT_PUBLIC_SITE_URL;
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    return 'https://www.globalwebify.com';
  };

  const base = getSiteUrl();
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  const canonicalUrl = `${cleanBase}${cleanPath}`;

  return <link rel="canonical" href={canonicalUrl} />;
}
