import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let blogCount = 0;
    const blogs = await db.blogPost.findMany();
    for (const blog of blogs) {
      if (blog.content.includes('nofollow')) {
        const newContent = blog.content.replace(/rel="([^"]*)nofollow([^"]*)"/gi, (match, p1, p2) => {
          const newRel = (p1 + p2).trim().replace(/\s+/g, ' ');
          return newRel ? `rel="${newRel}"` : '';
        });
        
        if (newContent !== blog.content) {
          await db.blogPost.update({
            where: { id: blog.id },
            data: { content: newContent },
          });
          blogCount++;
        }
      }
    }

    let serviceCount = 0;
    const services = await db.servicePage.findMany();
    for (const service of services) {
      if (service.content.includes('nofollow')) {
        const newContent = service.content.replace(/rel="([^"]*)nofollow([^"]*)"/gi, (match, p1, p2) => {
          const newRel = (p1 + p2).trim().replace(/\s+/g, ' ');
          return newRel ? `rel="${newRel}"` : '';
        });
        
        if (newContent !== service.content) {
          await db.servicePage.update({
            where: { id: service.id },
            data: { content: newContent },
          });
          serviceCount++;
        }
      }
    }

    let subCount = 0;
    const subdomains = await db.subdomainContent.findMany();
    for (const sub of subdomains) {
      if (sub.content.includes('nofollow')) {
        const newContent = sub.content.replace(/rel="([^"]*)nofollow([^"]*)"/gi, (match, p1, p2) => {
          const newRel = (p1 + p2).trim().replace(/\s+/g, ' ');
          return newRel ? `rel="${newRel}"` : '';
        });
        
        if (newContent !== sub.content) {
          await db.subdomainContent.update({
            where: { id: sub.id },
            data: { content: newContent },
          });
          subCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${blogCount} blogs, ${serviceCount} service pages, ${subCount} subdomain contents using GET.`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
