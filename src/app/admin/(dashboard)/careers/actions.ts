'use server';

import { db } from '@/lib/db';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/auth';

export async function saveJob(formData: {
  id?: number;
  title: string;
  slug: string;
  description: string;
  requirements?: string;
  location: string;
  type: string;
  experience?: string;
  salary?: string;
  category: string;
  lastDate?: string | Date;
  isActive?: boolean;
}) {
  await requireAdmin();

  const data = {
    title: formData.title,
    slug: formData.slug,
    description: formData.description,
    requirements: formData.requirements || null,
    location: formData.location || 'Ranchi',
    type: formData.type || 'Full-time',
    experience: formData.experience || null,
    salary: formData.salary || null,
    category: formData.category || 'Development',
    lastDate: formData.lastDate ? new Date(formData.lastDate) : null,
    isActive: formData.isActive ?? true,
  };

  let savedRecord;
  if (formData.id) {
    savedRecord = await db.job.update({
      where: { id: formData.id },
      data,
    });
  } else {
    savedRecord = await db.job.create({
      data,
    });
  }

  // Revalidate public career paths
  revalidatePath('/career');
  revalidatePath(`/career/${data.slug}`);
  revalidatePath('/admin/careers');
  revalidateTag('jobs');

  return { success: true, id: savedRecord.id, slug: savedRecord.slug };
}

export async function deleteJob(id: number) {
  await requireAdmin();
  const job = await db.job.findUnique({
    where: { id },
  });

  if (job) {
    await db.job.delete({
      where: { id },
    });
    revalidatePath('/career');
    revalidatePath(`/career/${job.slug}`);
  }

  revalidatePath('/admin/careers');
  revalidateTag('jobs');
}

export async function toggleJobStatus(id: number, active: boolean) {
  await requireAdmin();
  const job = await db.job.update({
    where: { id },
    data: { isActive: active },
  });

  revalidatePath('/career');
  revalidatePath(`/career/${job.slug}`);
  revalidatePath('/admin/careers');
  revalidateTag('jobs');
}

export async function getApplications() {
  await requireAdmin();
  return await db.jobApplication.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

import { v2 as cloudinary } from 'cloudinary';

async function deleteFromCloudinary(url: string) {
  if (!url || !url.includes('cloudinary.com')) return;
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    
    const urlParts = url.split('/upload/');
    if (urlParts.length > 1) {
      const pathPart = urlParts[1];
      let publicIdWithExtension = pathPart;
      if (pathPart.match(/^v\d+\//)) {
        publicIdWithExtension = pathPart.substring(pathPart.indexOf('/') + 1);
      }
      if (publicIdWithExtension) {
        // Resumes are typically uploaded as 'raw' documents
        await cloudinary.uploader.destroy(publicIdWithExtension, { resource_type: 'raw' });
      }
    }
  } catch (error) {
    console.error('Failed to delete file from Cloudinary:', error);
  }
}

export async function deleteApplication(id: number) {
  await requireAdmin();
  const app = await db.jobApplication.findUnique({ where: { id } });
  if (app && app.resumeUrl) {
    await deleteFromCloudinary(app.resumeUrl);
  }
  
  await db.jobApplication.delete({
    where: { id },
  });
  revalidatePath('/admin/careers/applications');
}

export async function deleteAllApplications() {
  await requireAdmin();
  const apps = await db.jobApplication.findMany();
  for (const app of apps) {
    if (app.resumeUrl) {
      await deleteFromCloudinary(app.resumeUrl);
    }
  }
  await db.jobApplication.deleteMany();
  revalidatePath('/admin/careers/applications');
}

export async function getLockDuration() {
  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: 'career_lock_days' },
    });
    return setting ? parseInt(setting.value, 10) : 30;
  } catch (err) {
    return 30;
  }
}

export async function saveLockDuration(days: number) {
  await requireAdmin();
  if (isNaN(days) || days < 0) throw new Error('Invalid number of days');
  
  await db.siteSetting.upsert({
    where: { key: 'career_lock_days' },
    update: { value: days.toString() },
    create: { key: 'career_lock_days', value: days.toString() },
  });
  
  revalidatePath('/career');
  return { success: true };
}
