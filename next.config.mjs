// Run `node optimize.js` manually in the terminal when you upload new heavy images.
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'globalwebify.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.globalwebify.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  compiler: {
    // Automatically strip all console.log statements in production builds to keep the console completely clean.
    // We exclude 'error' so that actual server crashes still get logged.
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error'],
    } : false,
  },
  async redirects() {
    return [
      {
        source: '/uk',
        destination: '/united-kingdom',
        permanent: true,
      },
      {
        source: '/booking',
        destination: '/bookings',
        permanent: true,
      },
      {
        source: '/uk/:path*',
        destination: '/united-kingdom/:path*',
        permanent: true,
      },
      {
        source: '/careers',
        destination: '/career',
        permanent: true,
      },
      {
        source: '/careers/:path*',
        destination: '/career/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*\\.mp4)',
        headers: [
          {
            key: 'Content-Type',
            value: 'video/mp4',
          },
          {
            key: 'Content-Disposition',
            value: 'inline',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy-Report-Only',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://*.googletagmanager.com https://*.clarity.ms https://*.google.com https://*.googleapis.com; style-src 'self' 'unsafe-inline' https://*.googleapis.com; img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://*.clarity.ms https://*.google.com https://*.gstatic.com https://cdn.simpleicons.org https://img.icons8.com; media-src 'self' https://res.cloudinary.com; font-src 'self' data: https://*.gstatic.com; frame-src 'self' https://*.instagram.com https://*.pinterest.com https://*.youtube.com https://*.google.com; connect-src 'self' blob: https://*.google-analytics.com https://*.analytics.google.com https://*.clarity.ms https://*.googleapis.com;"
          },
        ],
      },
    ];
  },
};

export default nextConfig;
