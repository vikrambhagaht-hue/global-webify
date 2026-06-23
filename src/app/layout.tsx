import type { Metadata } from "next";
import { Poppins, Lexend, Jost } from "next/font/google";
import "./globals.css";
// Removed unused direct imports of Header, Footer, MobileStickyNav, and BreadcrumbWrapper since they are now handled by PublicLayoutWrapper or imported further down
import NextTopLoader from 'nextjs-toploader';
import { db } from "@/lib/db";
import PublicLayoutWrapper from "@/components/layout/PublicLayoutWrapper";
import BreadcrumbWrapper from "@/components/ui/BreadcrumbWrapper";


const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "600", "700", "900"],
  variable: "--font-poppins",
  display: "swap"
});

const lexend = Lexend({ 
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-lexend",
  display: "swap"
});

const jost = Jost({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-jost",
  display: "swap"
});

// NOTE: We intentionally do NOT call headers() here.
// Using headers() in the root layout forces EVERY page on the site to be
// dynamically server-rendered on every request (no caching), which
// overwhelms the DB connection pool and causes 500 errors in production.
// Instead we read from NEXT_PUBLIC_SITE_URL env var — change domain anytime without code changes.

const getSiteUrl = () => {
  // If NEXT_PUBLIC_SITE_URL is set and valid, use it
  if (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  // Fallback to Vercel URL if deployed there
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Default fallback
  return 'https://globalwebify.com';
};

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Global Webify | Web Development & Digital Marketing Agency",
  description: "Leading Web Development, SEO, and Digital Marketing Agency in India. We build AI-powered solutions for your business growth.",
  keywords: "Web Development, SEO, Digital Marketing, AI Solutions, Global Webify",
  authors: [{ name: "Global Webify" }],
  publisher: "Global Webify",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "Global Webify | Web Development & Digital Marketing Agency",
    description: "Leading Web Development, SEO, and Digital Marketing Agency in India. We build AI-powered solutions for your business growth.",
    url: SITE_URL,
    siteName: "Global Webify",
    images: [
      {
        url: "/global_webify_logo.png",
        width: 1200,
        height: 630,
        alt: "Logo - Global Webify",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Webify | Web Development & Digital Marketing Agency",
    description: "Leading Web Development, SEO, and Digital Marketing Agency in India. We build AI-powered solutions for your business growth.",
    images: ["/global_webify_logo.png"],
  }
};



export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Removed unstable_cache because it deadlocks Prisma connection pools in Vercel Serverless
async function getSiteSettings() {
  return await db.siteSetting.findMany();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialSettings = {
    hostingMenuEnabled: true,
    brandingMenuEnabled: true,
    partnershipPageSlug: 'partnership'
  };

  try {
    const allSettings = await getSiteSettings();
    const settingsMap = allSettings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    initialSettings = {
      hostingMenuEnabled: settingsMap['hostingMenuEnabled'] !== 'false',
      brandingMenuEnabled: settingsMap['brandingMenuEnabled'] !== 'false',
      partnershipPageSlug: settingsMap['partnershipPageSlug'] || 'partnership'
    };
  } catch (error) {
    console.error("Failed to load settings in layout:", error);
  }

  return (
    <html lang="en" className={`${poppins.variable} ${lexend.variable} ${jost.variable}`}>
      <body className={`${jost.className} font-sans bg-white text-gray-900 antialiased overflow-x-hidden`}>
        <NextTopLoader 
          color="#1a8b4c"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #1a8b4c,0 0 5px #1a8b4c"
          zIndex={1600000}
        />
        <PublicLayoutWrapper breadcrumb={<BreadcrumbWrapper />} initialSettings={initialSettings}>
          {children}
        </PublicLayoutWrapper>
      </body>
    </html>
  );
}
