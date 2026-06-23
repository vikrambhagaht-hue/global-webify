"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BlogContactForm from '@/components/forms/BlogContactForm';

export function BlogPostView({ post, isDbPost, headings = [], displayDate, displayAuthor, displayExcerpt }: any) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const getHeadingElements = () => headings.map((h: any) => {
      const slugId = h.text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return document.getElementById(slugId);
    }).filter(Boolean);

    const handleScroll = () => {
      const headingElements = getHeadingElements();
      const viewportTop = 180;

      let currentActiveId = '';
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportTop) {
            currentActiveId = el.id;
            break;
          }
        }
      }

      if (!currentActiveId && headingElements.length > 0) {
        currentActiveId = headingElements[0]?.id || '';
      }

      setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headings]);

  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, slugId: string) => {
    e.preventDefault();
    const element = document.getElementById(slugId);
    if (element) {
      const headerOffset = 140;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      window.history.pushState(null, '', `#${slugId}`);
    }
  };

  return (
    <>
      {/* ===== ALL STYLES — Exact GlobalWebify Replication ===== */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* =============================================
           CSS VARIABLES (exact match from clean-header.css)
           ============================================= */
        :root {
          --primary-green: #2CA65A;
          --primary-green-light: #bbf7d0;
          --primary-green-dark: #166534;
          --primary-blue: #1F6FBC;
          --primary-blue-light: #e0f2fe;
          --primary-blue-dark: #2563eb;
          --neutral-dark: #2D3748;
          --neutral-light: #F5F8FA;
          --white: #ffffff;
          --black: #000000;
          --gray-50: #f9fafb;
          --gray-100: #f3f4f6;
          --gray-200: #e5e7eb;
          --gray-300: #d1d5db;
          --gray-400: #9ca3af;
          --gray-500: #6b7280;
          --gray-600: #4b5563;
          --gray-700: #374151;
          --gray-800: #1f2937;
          --gray-900: #111827;
          --font-xs: 0.75rem;
          --font-sm: 0.875rem;
          --font-base: 1rem;
          --font-md: 1.125rem;
          --font-lg: 1.25rem;
          --font-xl: 1.5rem;
          --font-2xl: 1.875rem;
          --font-3xl: 2.25rem;
          --font-4xl: 3rem;
        }

        /* Global font assignment — exact match to reference site */
        .blog-detail-layout,
        .blog-detail-layout *,
        .blog-cta-section,
        .blog-cta-section * {
          box-sizing: border-box;
        }
        .blog-detail-layout {
          font-family: 'Jost', var(--font-jost), sans-serif;
          font-size: var(--font-base);
          line-height: 1.5;
          color: var(--gray-600);
        }
        .blog-detail-layout h1,
        .blog-detail-layout h2,
        .blog-detail-layout h3,
        .blog-detail-layout h4,
        .blog-detail-layout h5,
        .blog-detail-layout h6 {
          font-family: 'Lexend', var(--font-lexend), sans-serif;
        }

        /* =============================================
           SECTION & LAYOUT
           ============================================= */
        .bg-neutral-light {
          background-color: var(--neutral-light);
        }
        .section-padding {
          padding: 40px 0 60px 0;
        }
        @media (max-width: 768px) {
          .section-padding {
            padding: 24px 0 40px 0;
          }
        }

        .blog-detail-layout {
          display: flex;
          gap: 32px;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          align-items: flex-start;
        }
        @media (max-width: 1024px) {
          .blog-detail-layout {
            flex-direction: column;
            gap: 24px;
            padding: 0 16px;
          }
        }

        .blog-detail-main {
          flex: 7;
          min-width: 0;
        }
        .blog-detail-sidebar {
          flex: 3;
          position: sticky;
          top: 120px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          min-width: 0;
        }
        @media (max-width: 1024px) {
          .blog-detail-main {
            flex: none;
            width: 100%;
          }
          .blog-detail-sidebar {
            flex: none;
            width: 100%;
            position: static;
          }
        }

        /* =============================================
           ARTICLE DETAIL CARD
           ============================================= */
        .article-detail-card {
          background: var(--white);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
          border: 1px solid var(--gray-200);
        }

        /* Hero Image */
        .article-detail-image {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: var(--gray-100);
        }
        .article-detail-img {
          width: 100%;
          height: auto;
          display: block;
        }
        .article-detail-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.08) 50%, transparent 100%);
          pointer-events: none;
        }
        .article-detail-meta-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px 24px;
          z-index: 2;
        }
        .article-detail-meta-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
        }
        .article-detail-category {
          background: var(--primary-green);
          color: var(--white);
          font-size: 11px;
          font-weight: 700;
          padding: 5px 14px;
          border-radius: 50px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .article-detail-author,
        .article-detail-date {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: var(--white);
          font-size: 12px;
          font-weight: 600;
          padding: 5px 14px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .article-detail-author i,
        .article-detail-date i {
          font-size: 11px;
          opacity: 0.8;
        }

        /* Content Area */
        .article-detail-content {
          padding: 32px 28px 28px;
          max-width: 100%;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .article-detail-content {
            padding: 24px 18px 20px;
          }
        }

        .article-detail-title {
          font-family: 'Lexend', var(--font-lexend), sans-serif;
          font-size: 25.712px !important;
          font-weight: 800;
          color: #2CA65A !important;
          line-height: 1.25;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
          word-break: break-word;
          overflow-wrap: break-word;
        }

        .article-detail-excerpt {
          margin-bottom: 8px;
        }
        .excerpt-text {
          font-family: 'Jost', var(--font-jost), sans-serif;
          font-size: var(--font-base);
          font-weight: 500;
          line-height: 1.625;
          color: var(--gray-600);
          font-style: italic;
          background: #f0fdf4;
          border: 1px solid rgba(44,166,90,0.1);
          border-radius: 16px;
          padding: 16px 20px;
        }

        /* =============================================
           CTA ACTION PANEL (4 buttons)
           ============================================= */
        .hero-cta-action-panel {
          margin-top: 25px;
          margin-bottom: 35px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 15px;
          flex-wrap: wrap;
        }
        .hero-cta-mobile-row {
          display: contents;
        }
        .hero-cta-action-btn {
          padding: 12px 28px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
          white-space: nowrap;
          line-height: 1.2;
          border: none;
          font-family: inherit;
        }
        .hero-cta-action-btn i {
          font-size: 1.1rem;
          margin-right: 6px;
        }
        .cta-ac-primary {
          background: #2CA65A;
          color: white;
          box-shadow: 0 4px 12px rgba(44, 166, 90, 0.25);
          border: 2px solid #2CA65A;
        }
        .cta-ac-primary:hover {
          transform: translateY(-2px);
          color: white;
        }
        .cta-ac-call {
          background: transparent;
          color: #2CA65A;
          border: 2px solid #2CA65A;
        }
        .cta-ac-call:hover {
          background: #f0fdf4;
          transform: translateY(-2px);
          color: #2CA65A;
        }
        .cta-ac-wa {
          background: #25D366;
          color: white;
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25);
          border: 2px solid #25D366;
        }
        .cta-ac-wa:hover {
          background: #1ebe5a;
          transform: translateY(-2px);
          color: white;
        }
        .cta-ac-audit {
          background: #3b82f6;
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
          border: 2px solid #3b82f6;
        }
        .cta-ac-audit:hover {
          background: #2563eb;
          transform: translateY(-2px);
          color: white;
        }
        @media (max-width: 768px) {
          .hero-cta-action-panel {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          .cta-ac-primary {
            width: 100%;
            padding: 14px 20px;
            font-size: 1.05rem;
          }
          .hero-cta-mobile-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            width: 100%;
          }
          .hero-cta-mobile-row .hero-cta-action-btn {
            flex-direction: column;
            gap: 8px;
            padding: 12px 5px;
            font-size: 0.85rem;
            white-space: normal;
            text-align: center;
          }
          .hero-cta-mobile-row .hero-cta-action-btn i {
            font-size: 1.4rem;
            margin: 0;
          }
        }
        @media (max-width: 480px) {
          .hero-cta-mobile-row .hero-cta-action-btn {
            font-size: 0.75rem;
            padding: 10px 2px;
          }
          .hero-cta-mobile-row .hero-cta-action-btn i {
            font-size: 1.25rem;
          }
        }

        /* =============================================
           ARTICLE BODY — Content from editor/Word
           ============================================= */
        .article-detail-body {
          word-break: break-word;
          overflow-wrap: break-word;
          max-width: 100%;
        }

        .article-detail-body h1 {
          font-family: 'Lexend', var(--font-lexend), sans-serif !important;
          font-size: 25.712px !important;
          font-weight: 800 !important;
          color: #2CA65A !important;
          margin-top: 2rem !important;
          margin-bottom: 1rem !important;
          line-height: 1.25 !important;
        }

        .article-detail-body h2,
        .article-detail-body h2 * {
          font-family: 'Jost', var(--font-jost), sans-serif !important;
          font-size: 16px !important;
          font-weight: 700 !important;
          color: #1a8b4c !important;
        }
        .article-detail-body h2 {
          text-decoration: underline !important;
          text-decoration-color: rgba(26, 139, 76, 0.6) !important;
          text-underline-offset: 4px;
          margin-top: 2rem !important;
          margin-bottom: 0.75rem !important;
          padding-bottom: 0.5rem !important;
          border-bottom: none !important;
          scroll-margin-top: 120px !important;
          line-height: 1.375 !important;
        }

        .article-detail-body h3,
        .article-detail-body h3 * {
          font-family: 'Jost', var(--font-jost), sans-serif !important;
          font-size: 15px !important;
          font-weight: 700 !important;
          color: #030712 !important; /* gray-950 */
        }
        .article-detail-body h3 {
          margin-top: 1.75rem !important;
          margin-bottom: 0.5rem !important;
          line-height: 1.375 !important;
          border-bottom: none !important;
          padding-bottom: 0 !important;
          scroll-margin-top: 120px !important;
        }

        .article-detail-body h4 {
          font-family: 'Lexend', var(--font-lexend), sans-serif;
          font-size: clamp(16px, 2vw, 18px);
          font-weight: 600;
          color: var(--neutral-dark);
          margin-top: 1.25rem !important;
          margin-bottom: 0.5rem !important;
          line-height: 1.5;
        }

        .article-detail-body p:not([style*="color"]) {
          color: var(--gray-600) !important;
        }
        .article-detail-body p {
          font-family: 'Jost', var(--font-jost), sans-serif !important;
          font-size: 16px !important;
          font-weight: 400 !important;
          line-height: 1.625 !important;
          margin-bottom: 1rem !important;
          margin-top: 0 !important;
        }
        @media (max-width: 480px) {
          .article-detail-body p { font-size: 16px !important; line-height: 1.625 !important; }
        }

        .article-detail-body ul {
          list-style-type: disc;
          padding-left: 1.5rem !important;
          margin-bottom: 1rem !important;
          font-family: 'Jost', var(--font-jost), sans-serif;
        }
        .article-detail-body ol {
          list-style-type: decimal;
          padding-left: 1.5rem !important;
          margin-bottom: 1rem !important;
          font-family: 'Jost', var(--font-jost), sans-serif;
        }
        .article-detail-body li,
        .article-detail-body li * {
          font-weight: 500 !important;
          color: #374151 !important;
        }
        .article-detail-body li {
          font-size: var(--font-base);
          line-height: 1.625;
          margin-bottom: 0.5rem !important;
        }
        .article-detail-body li::marker {
          color: #374151 !important;
        }
        @media (max-width: 480px) {
          .article-detail-body li { font-size: var(--font-sm); line-height: 1.5; }
        }

        .article-detail-body strong,
        .article-detail-body b,
        .article-detail-body strong *,
        .article-detail-body b * {
          font-weight: 700 !important;
        }

        .article-detail-body a,
        .article-detail-body a * {
          color: #1a8b4c !important;
          font-weight: 700 !important;
          text-decoration: none !important;
          transition: color 0.15s ease;
        }
        .article-detail-body a:hover,
        .article-detail-body a:hover * {
          color: #15703d !important;
          text-decoration: underline !important;
        }

        .article-detail-body blockquote {
          border-left: 4px solid var(--primary-green) !important;
          background-color: var(--gray-50) !important;
          padding: 1rem 1.25rem !important;
          border-radius: 0 14px 14px 0 !important;
          font-style: italic;
          font-weight: 500;
          color: var(--gray-600);
          margin: 1rem 0 !important;
          font-family: 'Jost', var(--font-jost), sans-serif;
        }

        .article-detail-body pre {
          background-color: #1e1e2e !important;
          color: #cdd6f4;
          font-family: ui-monospace, monospace;
          padding: 16px 20px !important;
          border-radius: 10px !important;
          font-size: 13.5px;
          line-height: 1.6;
          overflow-x: auto;
          margin: 14px 0 !important;
          border: 1px solid #313244;
        }

        .article-detail-body details {
          background: white !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 16px !important;
          padding: 16px !important;
          margin-bottom: 12px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02) !important;
        }
        .article-detail-body summary {
          font-family: var(--font-lexend), 'Lexend', sans-serif;
          font-weight: 700;
          color: #2CA65A;
          outline: none !important;
          cursor: pointer;
        }

        .article-detail-body img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 16px 0;
        }

        .article-detail-body table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
          font-family: var(--font-jost), 'Jost', sans-serif;
          font-size: 14px;
          display: block;
          overflow-x: auto;
          white-space: nowrap;
        }
        .article-detail-body th {
          background: var(--primary-green);
          color: white;
          font-weight: 700;
          text-align: left;
          padding: 12px 16px;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .article-detail-body td {
          padding: 10px 16px;
          border-bottom: 1px solid var(--gray-200);
          color: #4b5563;
        }
        .article-detail-body tr:nth-child(even) td {
          background: var(--gray-50);
        }
        @media (min-width: 481px) {
          .article-detail-body table { font-size: 15px; }
        }

        /* =============================================
           SIDEBAR CARDS
           ============================================= */
        .blog-sidebar-card {
          background: var(--white);
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
          border: 1px solid var(--gray-200);
        }
        .blog-sidebar-title {
          font-family: 'Lexend', var(--font-lexend), sans-serif;
          font-size: var(--font-base);
          font-weight: 800;
          color: var(--neutral-dark);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--gray-100);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .blog-sidebar-title i {
          color: var(--primary-green);
          font-size: 14px;
        }
        .blog-sidebar-text {
          font-family: 'Jost', var(--font-jost), sans-serif;
          font-size: var(--font-sm);
          line-height: 1.625;
          color: var(--gray-500);
          font-weight: 500;
          margin-bottom: 1rem;
        }

        /* Sidebar CTA Button */
        .btn-universal {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          background: linear-gradient(135deg, var(--primary-green), var(--primary-green-dark));
          color: var(--white);
          font-family: 'Lexend', var(--font-lexend), sans-serif;
          font-size: var(--font-base);
          font-weight: 600;
          padding: 1rem 2rem;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px 0 rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }
        .btn-universal:hover {
          background: linear-gradient(135deg, var(--primary-green-dark), #15803d);
          transform: translateY(-3px);
          box-shadow: 0 8px 25px 0 rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
          color: var(--white);
        }
        .btn-universal i {
          font-size: 13px;
        }

        /* =============================================
           TABLE OF CONTENTS
           ============================================= */
        .blog-toc-nav {
          display: flex;
          flex-direction: column;
          max-height: 420px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .blog-toc-nav::-webkit-scrollbar {
          width: 3px;
        }
        .blog-toc-nav::-webkit-scrollbar-thumb {
          background: var(--gray-300);
          border-radius: 10px;
        }

        .toc-item {
          display: block;
          font-family: 'Jost', var(--font-jost), sans-serif;
          font-size: var(--font-sm);
          font-weight: 500;
          color: var(--gray-600);
          text-decoration: none;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          border-left: 3px solid transparent;
          transition: all 0.2s ease;
          line-height: 1.4;
        }
        .toc-item:hover {
          color: var(--primary-green);
          background: var(--primary-green-light);
          border-left-color: var(--primary-green);
        }
        .toc-item.toc-active {
          color: var(--primary-green-dark);
          background: var(--primary-green-light);
          border-left-color: var(--primary-green);
          font-weight: 700;
        }
        .toc-level-2 {
          padding-left: 0.5rem;
        }
        .toc-level-3 {
          padding-left: 1rem;
          font-size: var(--font-xs);
        }

        /* =============================================
           BOTTOM CTA SECTION
           ============================================= */
        .blog-cta-section {
          padding: 6rem 0;
          background: var(--white);
          position: relative;
          overflow: hidden;
          border-top: 1px solid var(--gray-200);
          font-family: 'Jost', var(--font-jost), sans-serif;
        }
        .blog-cta-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--primary-green), var(--primary-blue));
        }
        .blog-cta-section::after {
          content: '';
          position: absolute;
          top: -150px;
          right: -100px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(44, 166, 90, 0.05) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }
        .blog-cta-shape-2 {
          position: absolute;
          bottom: -150px;
          left: -100px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(31, 111, 188, 0.05) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }
        .blog-cta-inner {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 24px;
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .blog-cta-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--primary-green-light);
          color: var(--primary-green-dark);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0.5rem 1.25rem;
          border-radius: 50px;
          margin-bottom: 2rem;
        }
        .blog-cta-badge .dot {
          width: 8px;
          height: 8px;
          background: var(--primary-green);
          border-radius: 50%;
          animation: cta-blink 1.5s infinite;
        }
        @keyframes cta-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .blog-cta-heading {
          font-family: 'Lexend', var(--font-lexend), sans-serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 800;
          color: var(--neutral-dark);
          line-height: 1.15;
          margin-bottom: 1.25rem;
          letter-spacing: -0.02em;
        }
        .blog-cta-heading span {
          color: var(--primary-green);
        }
        .blog-cta-sub {
          color: var(--gray-600);
          font-size: var(--font-md);
          line-height: 1.8;
          max-width: 650px;
          margin: 0 auto 3rem;
          font-family: 'Jost', var(--font-jost), sans-serif;
        }

        .blog-cta-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 1.25rem;
          justify-content: center;
          margin-bottom: 4rem;
        }
        .blog-cta-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--primary-green);
          color: var(--white);
          font-weight: 600;
          font-size: 1rem;
          padding: 1rem 2rem;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px -5px rgba(44, 166, 90, 0.4);
        }
        .blog-cta-btn-primary:hover {
          background: var(--primary-green-dark);
          transform: translateY(-3px);
          box-shadow: 0 15px 30px -5px rgba(44, 166, 90, 0.5);
          color: var(--white);
        }
        .blog-cta-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--white);
          color: var(--neutral-dark);
          font-weight: 600;
          font-size: 1rem;
          padding: 1rem 2rem;
          border-radius: 12px;
          text-decoration: none;
          border: 1px solid var(--gray-200);
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .blog-cta-btn-secondary:hover {
          border-color: var(--gray-300);
          background: var(--gray-50);
          transform: translateY(-3px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
          color: var(--primary-green);
        }
        .blog-cta-btn-whatsapp {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: #128c7e;
          color: var(--white);
          font-weight: 600;
          font-size: 1rem;
          padding: 1rem 2rem;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px -5px rgba(18, 140, 126, 0.4);
        }
        .blog-cta-btn-whatsapp:hover {
          background: #075e54;
          transform: translateY(-3px);
          box-shadow: 0 15px 30px -5px rgba(18, 140, 126, 0.5);
          color: var(--white);
        }

        .blog-cta-trust {
          display: flex;
          flex-wrap: wrap;
          gap: 3rem;
          justify-content: center;
          align-items: center;
          padding-top: 3rem;
          border-top: 1px solid var(--gray-200);
        }
        .blog-cta-trust-item {
          text-align: center;
        }
        .blog-cta-trust-value {
          display: block;
          font-family: 'Lexend', var(--font-lexend), sans-serif;
          font-size: var(--font-3xl);
          font-weight: 800;
          color: var(--neutral-dark);
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .blog-cta-trust-label {
          font-size: 0.85rem;
          color: var(--gray-600);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }
        .blog-cta-back {
          text-align: center;
          margin-top: 4rem;
        }
        .blog-cta-back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--gray-500);
          font-size: 0.9rem;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .blog-cta-back-link:hover {
          color: var(--primary-green);
        }

        @media (max-width: 768px) {
          .blog-cta-section {
            padding: 4rem 0;
          }
          .blog-cta-trust {
            gap: 2rem;
            padding-top: 2.5rem;
          }
          .blog-cta-buttons {
            flex-direction: column;
            align-items: stretch;
          }
          .blog-cta-btn-primary,
          .blog-cta-btn-secondary,
          .blog-cta-btn-whatsapp {
            justify-content: center;
          }
        }

        /* =============================================
           SIDEBAR CONTACT FORM OVERRIDES
           ============================================= */
        .blog-sidebar-contact-wrapper {
          /* Flatten the existing BlogContactForm styling to fit sidebar card */
        }
      `}} />

      {/* ===== FONT AWESOME CDN (for icon classes) ===== */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />

      <main className="bg-neutral-light">
        <section className="section-padding">
          {/* Blog Detail Layout with Right Sidebar */}
          <div className="blog-detail-layout">

            {/* ===== MAIN CONTENT (70%) ===== */}
            <article className="blog-detail-main">
              <div className="article-detail-card">

                {/* Hero Image with Overlay */}
                {post.image && (
                  <div className="article-detail-image">
                    <img
                      src={post.image}
                      alt={post.title}
                      title={`${post.title} - Global Webify Blog`}
                      className="article-detail-img"
                    />
                    <div className="article-detail-overlay"></div>
                    <div className="article-detail-meta-overlay">
                      <div className="article-detail-meta-tags">
                        <span className="article-detail-category">
                          General
                        </span>
                        <span className="article-detail-author">
                          <i className="fas fa-user"></i>
                          {displayAuthor}
                        </span>
                        <span className="article-detail-date">
                          <i className="fas fa-calendar-alt"></i>
                          {displayDate}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="article-detail-content">
                  {/* Title */}
                  <h1 className="article-detail-title">{post.title}</h1>

                  {/* Excerpt */}
                  {displayExcerpt && (
                    <div className="article-detail-excerpt">
                      <p className="excerpt-text">{displayExcerpt}</p>
                    </div>
                  )}

                  {/* CTA Buttons */}
                  <div className="hero-cta-action-panel">
                    <a href="/contact" className="hero-cta-action-btn cta-ac-primary">
                      Enquire Now <i className="fas fa-arrow-right" style={{ marginLeft: '6px', marginRight: 0 }}></i>
                    </a>
                    <div className="hero-cta-mobile-row">
                      <a href="tel:+917563901100" className="hero-cta-action-btn cta-ac-call">
                        <i className="fas fa-phone"></i> Call
                      </a>
                      <a href="https://wa.me/917563901100" target="_blank" rel="noopener noreferrer" className="hero-cta-action-btn cta-ac-wa">
                        <i className="fab fa-whatsapp"></i> WhatsApp
                      </a>
                      <a href="/contact?subject=Free+Audit" className="hero-cta-action-btn cta-ac-audit">
                        <i className="fas fa-chart-line"></i> Free Audit
                      </a>
                    </div>
                  </div>

                  {/* Blog Content Body */}
                  <div className="article-detail-body" id="blog-content">
                    {isDbPost ? (
                      <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    ) : (
                      post.richContent?.map((section: any, idx: number) => {
                        switch (section.type) {
                          case 'p':
                            return <p key={idx}>{section.text}</p>;
                          case 'h2':
                            return (
                              <h2
                                id={section.text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                                key={idx}
                              >
                                {section.text}
                              </h2>
                            );
                          case 'h3':
                            return (
                              <h3
                                id={section.text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                                key={idx}
                              >
                                {section.text}
                              </h3>
                            );
                          case 'ul':
                            return (
                              <ul key={idx}>
                                {section.items?.map((item: string, itemIdx: number) => (
                                  <li key={itemIdx}>{item}</li>
                                ))}
                              </ul>
                            );
                          default:
                            return null;
                        }
                      })
                    )}
                  </div>
                </div>
              </div>
            </article>

            {/* ===== RIGHT SIDEBAR (30%) ===== */}
            <aside className="blog-detail-sidebar">

              {/* Table of Contents */}
              {headings.length > 0 && (
                <div className="blog-sidebar-card">
                  <h3 className="blog-sidebar-title">
                    <i className="fas fa-list"></i> Table of Contents
                  </h3>
                  <nav className="blog-toc-nav" id="blog-toc-nav">
                    {headings.map((heading: any, index: number) => {
                      const slugId = heading.text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      const isActive = activeId === slugId || (!activeId && index === 0);
                      const levelClass = heading.level === 3 ? 'toc-level-3' : 'toc-level-2';

                      return (
                        <a
                          key={index}
                          href={`#${slugId}`}
                          onClick={(e) => handleTocClick(e, slugId)}
                          className={`toc-item ${levelClass} ${isActive ? 'toc-active' : ''}`}
                        >
                          {heading.text}
                        </a>
                      );
                    })}
                  </nav>
                </div>
              )}

              {/* About Global Webify */}
              <div className="blog-sidebar-card">
                <h3 className="blog-sidebar-title">
                  <i className="fas fa-star"></i> About Global Webify
                </h3>
                <p className="blog-sidebar-text">
                  Founded in 2020, we&apos;ve been providing full-cycle web and mobile app development services to
                  clients from various industries.
                </p>
                <a href="/contact" className="btn-universal">
                  <i className="fas fa-rocket"></i> Let&apos;s Collaborate!
                </a>
              </div>

              {/* Contact Form */}
              <BlogContactForm />
            </aside>

          </div>
        </section>

        {/* ===== BOTTOM CTA SECTION ===== */}
        <section className="blog-cta-section">
          <div className="blog-cta-shape-2"></div>

          <div className="blog-cta-inner">
            {/* Badge */}
            <div className="blog-cta-badge">
              <span className="dot"></span>
              Free Consultation Available
            </div>

            {/* Heading */}
            <h2 className="blog-cta-heading">
              Ready to Grow Your <span>Business Online?</span>
            </h2>

            {/* Subtext */}
            <p className="blog-cta-sub">
              From websites that convert to digital marketing that delivers — let&apos;s build something that actually
              moves the needle for your business.
            </p>

            {/* CTA Buttons */}
            <div className="blog-cta-buttons">
              {/* WhatsApp */}
              <a
                href="https://wa.me/917563901100?text=Hi%20Global%20Webify%2C%20I%20read%20your%20blog%20and%20want%20to%20discuss%20my%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="blog-cta-btn-whatsapp"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Chat on WhatsApp
              </a>

              {/* Free Consultation */}
              <Link href="/contact" className="blog-cta-btn-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                </svg>
                Get Free Consultation
              </Link>

              {/* View Portfolio */}
              <Link href="/portfolio" className="blog-cta-btn-secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
                View Our Work
              </Link>
            </div>

            {/* Trust Stats */}
            <div className="blog-cta-trust">
              <div className="blog-cta-trust-item">
                <span className="blog-cta-trust-value">500+</span>
                <span className="blog-cta-trust-label">Projects Delivered</span>
              </div>
              <div className="blog-cta-trust-item">
                <span className="blog-cta-trust-value">98%</span>
                <span className="blog-cta-trust-label">Client Retention</span>
              </div>
              <div className="blog-cta-trust-item">
                <span className="blog-cta-trust-value">5★</span>
                <span className="blog-cta-trust-label">Average Rating</span>
              </div>
              <div className="blog-cta-trust-item">
                <span className="blog-cta-trust-value">24/7</span>
                <span className="blog-cta-trust-label">Support Available</span>
              </div>
            </div>

            {/* Back to Blogs */}
            <div className="blog-cta-back">
              <Link href="/blog" className="blog-cta-back-link">
                <i className="fas fa-chevron-left"></i> Back to All Blogs
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
