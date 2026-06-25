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
    console.log('API Save Service Request Body:', formData);
    
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
      bgType: formData.bgType || 'image',
      bgColor: formData.bgColor || null,
      bgGradientStart: formData.bgGradientStart || null,
      bgGradientEnd: formData.bgGradientEnd || null,
      mobileImage: formData.mobileImage || null,
      bgImage: formData.bgImage || null,
    };

    let savedRecord;
    if (formData.id) {
      const existingRecord = await db.servicePage.findUnique({
        where: { id: formData.id },
        select: { slug: true }
      });

      // Update existing service page
      savedRecord = await db.servicePage.update({
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
          console.error("Failed to auto-create redirect on slug change:", redirectError);
        }
      }
    } else {
      // Create new service page
      savedRecord = await db.servicePage.create({
        data,
      });
    }

    // Trigger path revalidations so updates appear instantly without full rebuilds
    const slugPath = data.slug.startsWith('/') ? data.slug : `/${data.slug}`;
    revalidatePath(slugPath);
    revalidatePath('/web-development');
    revalidatePath('/sitemap.ts');
    revalidatePath('/[slug]');
    revalidatePath('/[slug]/[serviceSlug]');
    revalidatePath('/admin/services');
    revalidatePath(`/admin/services/${data.slug.replace(/^\//, '')}`);
    revalidatePath('/admin/services/[slug]', 'page');

    return NextResponse.json({ success: true, id: savedRecord.id, slug: savedRecord.slug });
  } catch (error: any) {
    console.error('API Save Service Error:', error);
    return NextResponse.json({ error: 'Failed to save service page. Please try again.' }, { status: 500 });
  }
}
