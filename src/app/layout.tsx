import type { Metadata } from "next";
import { Poppins, Lexend, Jost } from "next/font/google";
import Script from "next/script";
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
  return 'https://www.globalwebify.com';
};

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Global Webify | Web Development & Digital Marketing Agency",
  description: "Leading Web Development, SEO, and Digital Marketing Agency in India. We build AI-powered solutions for your business growth.",
  verification: {
    google: "hjJg2ll5Lf7k7q7hkj7dzwjiPrP-xcEWO37GUsoyYLA",
  },
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
  const isProduction = process.env.NODE_ENV === 'production' && !SITE_URL.includes('vercel.app') && !SITE_URL.includes('localhost');

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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "ProfessionalService"],
      "name": "Global Webify - Website Development Company in Ranchi",
      "image": `${SITE_URL}/assets/images/uploads/global_webify_logo.png`,
      "@id": `${SITE_URL}/`,
      "url": `${SITE_URL}/`,
      "telephone": "+91 7563901100",
      "priceRange": "₹₹",
      "description": "Global Webify is a leading website development and digital marketing company in Ranchi offering SEO services, web development, CRM software solutions, and online marketing services to help businesses grow online.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2nd Floor, Alam Complex, Ashok Nagar Road, Kadru",
        "addressLocality": "Ranchi",
        "addressRegion": "Jharkhand",
        "postalCode": "834002",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "23.3482818",
        "longitude": "85.3130765"
      },
      "hasMap": "https://www.google.com/maps?q=23.3482818,85.3130765",
      "areaServed": {
        "@type": "City",
        "name": "Ranchi"
      },
      "serviceType": [
        "Website Development",
        "SEO Services",
        "Digital Marketing",
        "CRM Software Development",
        "Social Media Marketing"
      ],
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "10:00",
        "closes": "19:00"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91 7563901100",
        "contactType": "customer service"
      },
      "sameAs": [
        "https://www.facebook.com/global.webify",
        "https://www.instagram.com/global.webify/",
        "https://www.youtube.com/@globalwebify",
        "https://www.linkedin.com/company/global-webify/",
        "https://x.com/globalwebify"
      ]
    },
    {
      "@type": "Organization",
      "name": "Global Webify",
      "alternateName": "Web Design and Development Company",
      "url": "https://www.globalwebify.com/",
      "logo": "https://www.globalwebify.com/_next/image?url=%2Fglobal_webify_logo.png&w=256&q=85",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91 7563901100",
        "contactType": "technical support",
        "contactOption": ["HearingImpairedSupported","TollFree"],
        "areaServed": "IN",
        "availableLanguage": ["en","Hindi"]
      }
    },
    {
      "@type": "BreadcrumbList", 
      "itemListElement": [{
        "@type": "ListItem", 
        "position": 1, 
        "name": "Website",
        "item": "https://www.globalwebify.com/web-development"  
      },{
        "@type": "ListItem", 
        "position": 2, 
        "name": "CRM Solutions",
        "item": "https://www.globalwebify.com/crm-software-development"  
      },{
        "@type": "ListItem", 
        "position": 3, 
        "name": "SEO Services",
        "item": "https://www.globalwebify.com/seo-services"  
      },{
        "@type": "ListItem", 
        "position": 4, 
        "name": "Digital Marketing",
        "item": "https://www.globalwebify.com/digital-marketing"  
      }]
    }
  ]
};

  return (
    <html lang="en" className={`${poppins.variable} ${lexend.variable} ${jost.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${jost.className} font-sans bg-white text-gray-900 antialiased overflow-x-hidden`} suppressHydrationWarning>
        {isProduction && (
          <>
            <Script strategy="lazyOnload" src="https://www.googletagmanager.com/gtag/js?id=G-R148XST9BP" />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-R148XST9BP');
              `}
            </Script>
            <Script id="microsoft-clarity" strategy="lazyOnload">
              {`
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "t7j6gx53tz");
              `}
            </Script>
          </>
        )}
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
