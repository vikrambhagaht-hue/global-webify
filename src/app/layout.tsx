import type { Metadata } from "next";
import { Poppins, Lexend, Jost } from "next/font/google";
import "./globals.css";
// Removed unused direct imports of Header, Footer, MobileStickyNav, and BreadcrumbWrapper since they are now handled by PublicLayoutWrapper or imported further down
import NextTopLoader from 'nextjs-toploader';
import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { headers } from 'next/headers';
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

export async function generateMetadata(): Promise<Metadata> {
  let host = 'globalwebify.com';
  // TEMPORARILY COMMENTED OUT FOR VERCEL TESTING
  // WILL BE UNCOMMENTED FOR HOSTINGER
  /*
  try {
    const headerList = headers();
    const hostHeader = headerList.get('host');
    if (hostHeader) host = hostHeader;
  } catch (error: any) {
    if (error && error.digest === 'DYNAMIC_SERVER_USAGE') {
      throw error;
    }
    // Ignore other errors during static generation
  }
  */
  
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const siteUrl = `${protocol}://${host}`;

  return {
    metadataBase: new URL(siteUrl),
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
      url: siteUrl,
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
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

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
