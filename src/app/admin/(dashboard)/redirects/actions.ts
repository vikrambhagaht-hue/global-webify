'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { CITIES_LIST } from '@/features/services/constants/cities';
import { replaceLocation, getSlugTitle } from '@/lib/replaceLocation';

export async function getRedirects() {
  await requireAdmin();
  try {
    return await db.redirect.findMany({
      orderBy: { createdAt: 'asc' },
    });
  } catch (error) {
    console.error('Failed to fetch redirects:', error);
    return [];
  }
}

export async function getAvailableRoutes() {
  await requireAdmin();
  try {
    const services = await db.servicePage.findMany({ select: { slug: true, title: true } });
    const blogs = await db.blogPost.findMany({ select: { slug: true, title: true } });
    const jobs = await db.job.findMany({ select: { slug: true, title: true } });

    const routes: { url: string; label: string }[] = [
      { url: '/', label: 'Home (Static)' },
      { url: '/about', label: 'About Us (Static)' },
      { url: '/contact', label: 'Contact Us (Static)' },
      { url: '/portfolio', label: 'Portfolio (Static)' },
      { url: '/team', label: 'Team (Static)' },
      { url: '/gallery', label: 'Gallery (Static)' },
      { url: '/franchisee', label: 'Franchise Opportunity (Static)' },
      { url: '/career', label: 'Careers (Static)' },
      { url: '/blog', label: 'Blog Directory (Static)' },
    ];

    services.forEach(s => routes.push({ url: s.slug.startsWith('/') ? s.slug : `/${s.slug}`, label: `Service: ${s.title}` }));
    blogs.forEach(b => routes.push({ url: b.slug.startsWith('/') ? b.slug : `/blog/${b.slug.replace(/^blog\//, '')}`, label: `Blog: ${b.title}` }));
    jobs.forEach(j => routes.push({ url: j.slug.startsWith('/') ? j.slug : `/career/${j.slug.replace(/^career\//, '')}`, label: `Job: ${j.title}` }));

    CITIES_LIST.forEach(city => {
      routes.push({ url: `/${city.slug}`, label: `Market Area: ${city.name} (Homepage)` });
      
      // Add all service pages for this city
      services.forEach(s => {
        const cleanSlug = s.slug.startsWith('/') ? s.slug.substring(1) : s.slug;
        const baseTitle = getSlugTitle(s.slug);
        const localizedTitle = `${baseTitle} in ${city.name}`;
        routes.push({ url: `/${city.slug}/${cleanSlug}`, label: `Market Area: ${city.name} -> ${localizedTitle}` });
      });
    });

    return routes;
  } catch (error) {
    console.error('Failed to fetch available routes:', error);
    return [];
  }
}

export async function saveRedirects(
  redirectList: { id?: number; source: string; destination: string }[]
) {
  await requireAdmin();

  // No limit on redirects as per user request

  // Validate inputs
  const formattedList = redirectList.map((item) => {
    let src = item.source.trim();
    let dest = item.destination.trim();

    if (!src.startsWith('/')) {
      src = `/${src}`;
    }
    if (!dest.startsWith('/') && !dest.startsWith('http://') && !dest.startsWith('https://')) {
      dest = `/${dest}`;
    }

    return {
      id: item.id,
      source: src,
      destination: dest,
    };
  });

  try {
    // We can run this in a transaction:
    // 1. Find existing redirects
    const existing = await db.redirect.findMany();
    const existingIds = existing.map((r) => r.id);
    
    // 2. Identify IDs to delete (not present in incoming list)
    const incomingIds = formattedList.filter((item) => item.id).map((item) => item.id!);
    const idsToDelete = existingIds.filter((id) => !incomingIds.includes(id));

    await db.$transaction(async (tx) => {
      // Delete removed redirects
      if (idsToDelete.length > 0) {
        await tx.redirect.deleteMany({
          where: { id: { in: idsToDelete } },
        });
      }

      // Upsert incoming redirects
      for (const item of formattedList) {
        if (item.id) {
          await tx.redirect.update({
            where: { id: item.id },
            data: { source: item.source, destination: item.destination },
          });
        } else {
          await tx.redirect.create({
            data: { source: item.source, destination: item.destination },
          });
        }
      }
    });

    // Fetch all redirects to save them statically to public/redirects.json
    const allRedirects = await db.redirect.findMany({
      orderBy: { createdAt: 'asc' }
    });
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'public', 'redirects.json');
      fs.writeFileSync(filePath, JSON.stringify(allRedirects, null, 2));
    } catch (fsError) {
      console.error('Failed to write static redirects.json file:', fsError);
    }

    // Clear caches so the new paths/redirects are reflected
    revalidatePath('/', 'layout');

    return { success: true };
  } catch (error: any) {
    console.error('Failed to save redirects:', error);
    return { success: false, error: error.message || 'Database error occurred' };
  }
}

export async function deleteRedirect(id: number) {
  await requireAdmin();
  try {
    await db.redirect.delete({
      where: { id },
    });

    // Sync static JSON file
    const allRedirects = await db.redirect.findMany({
      orderBy: { createdAt: 'asc' }
    });
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'public', 'redirects.json');
      fs.writeFileSync(filePath, JSON.stringify(allRedirects, null, 2));
    } catch (fsError) {
      console.error('Failed to sync redirects.json after deletion:', fsError);
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete redirect:', error);
  }
}

export async function saveSingleRedirect(data: { id?: number; source: string; destination: string }) {
  await requireAdmin();
  
  let src = data.source.trim();
  let dest = data.destination.trim();

  // If user pasted a full URL for the old source, we only want the pathname for our Next.js middleware router
  try {
    if (src.startsWith('http')) {
      src = new URL(src).pathname;
    }
  } catch (e) {
    // Ignore invalid URL parse errors
  }

  if (!src.startsWith('/')) src = `/${src}`;
  if (!dest.startsWith('/') && !dest.startsWith('http://') && !dest.startsWith('https://')) dest = `/${dest}`;

  try {
    if (data.id) {
      await db.redirect.update({
        where: { id: data.id },
        data: { source: src, destination: dest },
      });
    } else {
      await db.redirect.create({
        data: { source: src, destination: dest },
      });
    }

    // Sync static JSON file
    const allRedirects = await db.redirect.findMany({ orderBy: { createdAt: 'asc' } });
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'public', 'redirects.json');
      fs.writeFileSync(filePath, JSON.stringify(allRedirects, null, 2));
    } catch (fsError) {
      console.error('Failed to sync redirects.json after save:', fsError);
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to save individual redirect:', error);
    return { success: false, error: error.message || 'Database error occurred' };
  }
}
