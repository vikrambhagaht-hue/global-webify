'use server';

import { db } from '@/lib/db';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/auth';

export async function saveService(formData: {
  id?: number;
  title: string;
  contentTitle?: string;
  slug: string;
  category: string;
  seoTitle?: string;
  seoDescription?: string;
  heroDescription?: string;
  seoKeywords?: string;
  content: string;
  image?: string;
  isActive?: boolean;
}) {
  await requireAdmin();
  const data = {
    title: formData.title,
    contentTitle: formData.contentTitle || null,
    slug: formData.slug.startsWith('/') ? formData.slug : `/${formData.slug}`,
    category: formData.category,
    seoTitle: formData.seoTitle || null,
    seoDescription: formData.seoDescription || null,
    heroDescription: formData.heroDescription || null,
    seoKeywords: formData.seoKeywords || null,
    content: formData.content,
    image: formData.image || null,
    isActive: formData.isActive ?? true,
  };

  let savedRecord;
  if (formData.id) {
    // Update existing service page
    savedRecord = await db.servicePage.update({
      where: { id: formData.id },
      data,
    });
  } else {
    // Create new service page
    savedRecord = await db.servicePage.create({
      data,
    });
  }

  // Trigger path revalidations so updates appear instantly without full rebuilds
  const slugPath = data.slug.startsWith('/') ? data.slug : `/${data.slug}`;
  revalidatePath('/');
  revalidatePath(slugPath);
  revalidatePath('/web-development');
  revalidatePath('/digital-marketing');
  revalidatePath('/branding-pr');
  revalidatePath('/sitemap.ts');
  revalidatePath('/[slug]');
  revalidatePath('/admin/services');
  revalidateTag('services');
  revalidateTag('breadcrumb-dynamic-pages');
  
  return { success: true, id: savedRecord.id, slug: savedRecord.slug };
}

export async function deleteService(id: number) {
  await requireAdmin();
  const service = await db.servicePage.findUnique({
    where: { id },
  });

  if (service) {
    await db.servicePage.delete({
      where: { id },
    });
    
    // Clear cache of deleted slug
    revalidatePath('/');
    revalidatePath(service.slug);
    revalidatePath('/web-development');
    revalidatePath('/digital-marketing');
    revalidatePath('/branding-pr');
    revalidatePath('/[slug]');
    revalidateTag('breadcrumb-dynamic-pages');
  }

  revalidatePath('/admin/services');
  revalidateTag('services');
}

export async function toggleServiceStatus(id: number, active: boolean) {
  await requireAdmin();
  await db.servicePage.update({
    where: { id },
    data: { isActive: active },
  });
  
  const service = await db.servicePage.findUnique({
    where: { id },
    select: { slug: true }
  });
  
  if (service) {
    revalidatePath('/');
    revalidatePath(service.slug);
    revalidatePath('/web-development');
    revalidatePath('/digital-marketing');
    revalidatePath('/branding-pr');
    revalidatePath('/[slug]');
  }
  
  revalidatePath('/admin/services');
  revalidateTag('services');
}

export async function getHostingStatus() {
  const setting = await db.siteSetting.findUnique({
    where: { key: 'hostingMenuEnabled' }
  });
  return setting ? setting.value === 'true' : true;
}

export async function setHostingStatus(enabled: boolean) {
  await requireAdmin();
  await db.siteSetting.upsert({
    where: { key: 'hostingMenuEnabled' },
    update: { value: String(enabled) },
    create: { key: 'hostingMenuEnabled', value: String(enabled) }
  });
  revalidatePath('/');
  revalidateTag('services');
}
