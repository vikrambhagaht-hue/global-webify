// Run `node optimize.js` manually in the terminal when you upload new heavy images.
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
        ],
      },
    ];
  },
};

export default nextConfig;
