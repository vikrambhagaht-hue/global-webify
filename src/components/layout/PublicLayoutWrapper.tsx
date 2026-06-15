"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileStickyNav from "@/components/layout/MobileStickyNav";
import { LazyMotion, domAnimation } from 'framer-motion';

interface PublicLayoutWrapperProps {
  children: React.ReactNode;
  breadcrumb: React.ReactNode;
  initialSettings?: {
    hostingMenuEnabled: boolean;
    brandingMenuEnabled: boolean;
    partnershipPageSlug: string;
  };
}

export default function PublicLayoutWrapper({ children, breadcrumb, initialSettings }: PublicLayoutWrapperProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <LazyMotion features={domAnimation}>
      {!isAdmin && <Header initialSettings={initialSettings} />}
      {!isAdmin && breadcrumb}
      <main>{children}</main>
      {!isAdmin && <Footer />}
      {!isAdmin && <MobileStickyNav />}
    </LazyMotion>
  );
}
