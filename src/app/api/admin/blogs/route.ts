import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    try {
      await requireAdmin();
    } catch (authError) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const formData = await request.json();
    
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
      const existingRecord = await db.blogPost.findUnique({
        where: { id: formData.id },
        select: { slug: true }
      });

      // Update existing post
      savedRecord = await db.blogPost.update({
        where: { id: formData.id },
        data,
      });

      // Automatically create a redirect if the slug changed
      if (existingRecord && existingRecord.slug !== data.slug) {
        try {
          await db.redirect.upsert({
            where: { source: existingRecord.slug },
            update: { destination: data.slug },
            create: { source: existingRecord.slug, destination: data.slug }
          });
          
          const allRedirects = await db.redirect.findMany({ orderBy: { createdAt: 'asc' } });
          const fs = require('fs');
          const path = require('path');
          const filePath = path.join(process.cwd(), 'public', 'redirects.json');
          fs.writeFileSync(filePath, JSON.stringify(allRedirects, null, 2));
        } catch (redirectError) {
          console.error("Failed to auto-create redirect on blog slug change:", redirectError);
        }
      }
    } else {
      // Create new post
      savedRecord = await db.blogPost.create({
        data,
      });
    }

    // Revalidate lists and post detail paths
    revalidatePath('/blog');
    revalidatePath(formattedSlug);
    revalidatePath('/blog/[slug]');
    revalidatePath('/sitemap.ts');

    return NextResponse.json({ success: true, id: savedRecord.id, slug: savedRecord.slug });
  } catch (error: any) {
    console.error('API Save Blog Error:', error);
    return NextResponse.json({ error: 'Failed to save blog post. Please try again.' }, { status: 500 });
  }
}
