import type { Metadata } from "next";
import { Poppins, Lexend, Jost } from "next/font/google";
import "./globals.css";
// Removed unused direct imports of Header, Footer, MobileStickyNav, and BreadcrumbWrapper since they are now handled by PublicLayoutWrapper or imported further down
import NextTopLoader from 'nextjs-toploader';
import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";


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


export const metadata: Metadata = {
  title: "GlobalWeblify | Web Development & Digital Marketing Agency",
  description: "Leading Web Development, SEO, and Digital Marketing Agency in India. We build AI-powered solutions for your business growth.",
  keywords: "Web Development, SEO, Digital Marketing, AI Solutions, GlobalWebify",
  openGraph: {
    title: "GlobalWeblify | Web Development & Digital Marketing Agency",
    description: "Leading Web Development, SEO, and Digital Marketing Agency in India. We build AI-powered solutions for your business growth.",
    url: "https://globalwebify.com",
    siteName: "GlobalWeblify",
    images: [
      {
        url: "https://globalwebify.com/global_webify_logo.png",
        width: 1200,
        height: 630,
        alt: "GlobalWebify Logo",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GlobalWeblify | Web Development & Digital Marketing Agency",
    description: "Leading Web Development, SEO, and Digital Marketing Agency in India. We build AI-powered solutions for your business growth.",
    images: ["https://globalwebify.com/global_webify_logo.png"],
  }
};

import PublicLayoutWrapper from "@/components/layout/PublicLayoutWrapper";
import BreadcrumbWrapper from "@/components/ui/BreadcrumbWrapper";

// Cache site settings for 60 seconds — avoids a DB hit on every page request
const getCachedSiteSettings = unstable_cache(
  async () => {
    return await db.siteSetting.findMany();
  },
  ["site-settings"],
  { revalidate: 60, tags: ["site-settings"] }
);

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
    const allSettings = await getCachedSiteSettings();
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
