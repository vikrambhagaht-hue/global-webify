'use server';

import { db } from '@/lib/db';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';

export async function saveBlogPost(formData: {
  id?: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image?: string;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}) {
  await requireAdmin();
  // Format slug to start with '/blog/' prefix
  let formattedSlug = formData.slug.trim();
  if (!formattedSlug.startsWith('/blog/')) {
    if (formattedSlug.startsWith('/')) {
      formattedSlug = `/blog${formattedSlug}`;
    } else {
      formattedSlug = `/blog/${formattedSlug}`;
    }
  }

  const data = {
    title: formData.title,
    slug: formattedSlug,
    summary: formData.summary,
    content: formData.content,
    image: formData.image || null,
    isActive: formData.isActive,
    seoTitle: formData.seoTitle || null,
    seoDescription: formData.seoDescription || null,
    seoKeywords: formData.seoKeywords || null,
  };

  let savedRecord;
  if (formData.id) {
    // Update existing post
    savedRecord = await db.blogPost.update({
      where: { id: formData.id },
      data,
    });
  } else {
    // Create new post
    savedRecord = await db.blogPost.create({
      data,
    });
  }

  // Revalidate lists and post detail paths
  revalidatePath('/');
  revalidatePath('/blog');
  revalidatePath(formattedSlug);
  revalidatePath('/blog/[slug]');
  revalidatePath('/sitemap.ts');
  revalidateTag('breadcrumb-dynamic-pages');

  return { success: true, id: savedRecord.id };
}

export async function deleteBlogPost(id: number) {
  await requireAdmin();
  const post = await db.blogPost.findUnique({
    where: { id },
  });

  if (post) {
    await db.blogPost.delete({
      where: { id },
    });

    // Revalidate paths
    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath(post.slug);
    revalidatePath('/blog/[slug]');
    revalidateTag('breadcrumb-dynamic-pages');
  }

  revalidatePath('/admin/blogs');
}

export async function toggleBlogPostStatus(id: number, isActive: boolean) {
  await requireAdmin();
  const post = await db.blogPost.update({
    where: { id },
    data: { isActive },
  });

  // Revalidate paths
  revalidatePath('/');
  revalidatePath('/blog');
  revalidatePath(post.slug);
  revalidatePath('/blog/[slug]');
  revalidatePath('/admin/blogs');
}
