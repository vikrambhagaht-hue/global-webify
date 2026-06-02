import type { Metadata } from "next";
import { Poppins, Lexend, Jost } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileStickyNav from "@/components/layout/MobileStickyNav";
import BreadcrumbWrapper from "@/components/ui/BreadcrumbWrapper";
import NextTopLoader from 'nextjs-toploader';

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins" 
});

const lexend = Lexend({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-lexend"
});

const jost = Jost({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-jost"
});

export const metadata: Metadata = {
  title: "GlobalWebify | Web Development & Digital Marketing Agency",
  description: "Leading Web Development, SEO, and Digital Marketing Agency in India. We build AI-powered solutions for your business growth.",
  keywords: "Web Development, SEO, Digital Marketing, AI Solutions, GlobalWebify",
};

import { headers } from 'next/headers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';
  const isAdmin = pathname.startsWith('/admin');

  return (
    <html lang="en" className={`${poppins.variable} ${lexend.variable} ${jost.variable}`}>
      <body className="font-sans bg-white text-gray-900 antialiased overflow-x-hidden">
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
        {!isAdmin && <Header />}
        {!isAdmin && <BreadcrumbWrapper />}
        <main>{children}</main>
        {!isAdmin && <Footer />}
        {!isAdmin && <MobileStickyNav />}
      </body>
    </html>
  );
}
