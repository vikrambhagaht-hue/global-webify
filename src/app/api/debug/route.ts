import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const services = await db.servicePage.findMany({
      select: { slug: true, isActive: true, title: true }
    });
    
    const blogs = await db.blogPost.findMany({
      select: { slug: true, isActive: true, title: true }
    });

    const redirects = await db.redirect.findMany();

    return NextResponse.json({
      services,
      blogs,
      redirects
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
