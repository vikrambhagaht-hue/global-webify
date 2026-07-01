"use client";
import React, { createContext, useContext } from 'react';
import { formatWhatsAppNumber, getWhatsAppUrl } from './whatsapp';
export { formatWhatsAppNumber, getWhatsAppUrl };

export interface SocialLinksData {
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  youtube: string;
}

export interface ContactInfo {
  phone: string;
  phone2: string;
  usOfficePhone?: string;
  usOfficeAddress?: string;
  dubaiOfficePhone?: string;
  dubaiOfficeAddress?: string;
  whatsapp: string;
  email: string;
  address: string;
  address2?: string;
  mapQuery?: string;
  mapScreenshotUrl?: string;
  socials: SocialLinksData;
}

export const defaultContactInfo: ContactInfo = {
  phone: '+91 75639 01100',
  phone2: '1800-890-5489',
  usOfficePhone: '+1 9175908135',
  usOfficeAddress: '473 Mundet Place, Ste US\nHillside, NJ 07205',
  dubaiOfficePhone: '+97 150 846 1253',
  dubaiOfficeAddress: 'Office 18, 2nd Floor\nAspin Commercial Tower',
  whatsapp: '917563901100',
  email: 'help@globalwebify.com',
  address: '2nd Floor, Alam Complex, Ashok Nagar Road, Kadru, Ranchi, Jharkhand, India-834002',
  address2: '36/1E/1L, Topsia Road, Panchannagram, Kolkata, Pin - 700039, West Bengal, India.',
  mapQuery: 'https://www.google.com/maps/place/Global+Webify/@23.3495578,85.3086946,17z/data=!3m1!5s0x39f4e0528e2c8fa7:0xf0b8c1d5d5dbe41a!4m6!3m5!1s0x39f4e195a816671d:0xa9ebf12893abb828!8m2!3d23.3496601!4d85.3104862!16s%2Fg%2F11wbvkw_tm?entry=ttu&g_ep=EgoyMDI2MDYyOC4wIKXMDSoASAFQAw%3D%3D',
  socials: {
    facebook: 'https://www.facebook.com/global.webify',
    twitter: 'https://x.com/globalwebify',
    linkedin: 'https://www.linkedin.com/company/global-webify/',
    instagram: 'https://www.instagram.com/global.webify/',
    youtube: 'https://www.youtube.com/@globalwebify'
  }
};

const ContactContext = createContext<ContactInfo>(defaultContactInfo);

export function ContactProvider({ children, info }: { children: React.ReactNode; info?: ContactInfo }) {
  const mergedInfo: ContactInfo = {
    ...defaultContactInfo,
    ...(info || {}),
    socials: {
      ...defaultContactInfo.socials,
      ...(info?.socials || {})
    }
  };
  return (
    <ContactContext.Provider value={mergedInfo}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContactInfo(): ContactInfo {
  return useContext(ContactContext);
}

export function getOptimizedMapUrl(mapQuery?: string): string {
  if (!mapQuery || mapQuery.trim() === "23.3496601,85.3104862") {
    return "https://maps.google.com/maps?q=23.3496601,85.3104862&t=&z=16&ie=UTF8&iwloc=&output=embed";
  }
  
  let trimmed = mapQuery.trim();
  if (trimmed.includes("<iframe") && trimmed.includes("src=")) {
    const match = trimmed.match(/src=["']([^"']+)["']/);
    if (match && match[1]) trimmed = match[1];
  }

  // Extract place name from embed code (!2s...) to point to the exact business location
  if (trimmed.includes("google.com/maps/embed")) {
    const placeMatch = trimmed.match(/!2s([^!&]+)/);
    if (placeMatch && placeMatch[1]) {
      const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
    }
  }

  // Extract coordinates from embed code (!2d... !3d...) as fallback
  const embedCoordMatch = trimmed.match(/!2d(-?\d+\.\d+)!3d(-?\d+\.\d+)/);
  if (embedCoordMatch) {
    const lng = embedCoordMatch[1];
    const lat = embedCoordMatch[2];
    return `https://maps.google.com/maps?q=${lat},${lng}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  }
  
  // Extract precise pin coordinates from the !3d (lat) and !4d (lng) parameters in the URL
  const exactCoordMatch = trimmed.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (exactCoordMatch) {
    return `https://maps.google.com/maps?q=${exactCoordMatch[1]},${exactCoordMatch[2]}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  }

  const urlCoordMatch = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (urlCoordMatch) {
    return `https://maps.google.com/maps?q=${urlCoordMatch[1]},${urlCoordMatch[2]}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  }

  const rawCoordMatch = trimmed.match(/^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/);
  if (rawCoordMatch) {
    return `https://maps.google.com/maps?q=${rawCoordMatch[1]},${rawCoordMatch[2]}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  }
  
  if (trimmed.includes("output=embed") || trimmed.includes("google.com/maps/embed")) {
    return trimmed;
  }
  
  const cleanQuery = encodeURIComponent(trimmed);
  return `https://maps.google.com/maps?q=${cleanQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
}

export function getOpenInMapsUrl(mapQuery?: string): string {
  const defaultGlobalWebifyMapUrl = "https://www.google.com/maps/place/Global+Webify/@23.3495578,85.3086946,17z/data=!3m1!5s0x39f4e0528e2c8fa7:0xf0b8c1d5d5dbe41a!4m6!3m5!1s0x39f4e195a816671d:0xa9ebf12893abb828!8m2!3d23.3496601!4d85.3104862!16s%2Fg%2F11wbvkw_tm?entry=ttu&g_ep=EgoyMDI2MDYyOC4wIKXMDSoASAFQAw%3D%3D";
  if (!mapQuery || mapQuery.trim() === "23.3496601,85.3104862") return defaultGlobalWebifyMapUrl;
  
  let trimmed = mapQuery.trim();
  if (trimmed.includes("<iframe") && trimmed.includes("src=")) {
    const match = trimmed.match(/src=["']([^"']+)["']/);
    if (match && match[1]) trimmed = match[1];
  }
  
  // If it's an embed url like /maps/embed?pb=..., convert it to a searchable map link so it doesn't fail in a full browser tab
  if (trimmed.includes("google.com/maps/embed")) {
    const placeMatch = trimmed.match(/!2s([^!&]+)/);
    if (placeMatch && placeMatch[1]) {
      const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`;
    }
    const coordMatch = trimmed.match(/!2d(-?\d+\.\d+)!3d(-?\d+\.\d+)/);
    if (coordMatch) {
      return `https://www.google.com/maps/search/?api=1&query=${coordMatch[2]},${coordMatch[1]}`;
    }
  }
  
  if (trimmed.startsWith("http") && !trimmed.includes("output=embed")) {
    return trimmed;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
}

export const MemoizedMapWidget = React.memo(function MemoizedMapWidget({ mapQuery }: { mapQuery?: string }) {
  const embedUrl = getOptimizedMapUrl(mapQuery);
  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-900 pointer-events-none select-none">
      <iframe
        title="Global Webify Office Map Location"
        src={embedUrl}
        className="border-0 pointer-events-none"
        style={{
          position: 'absolute',
          top: '-9%',
          left: '-9%',
          width: '118%',
          height: '118%',
          transform: 'scale(0.85)',
          transformOrigin: 'center center'
        }}
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
});
