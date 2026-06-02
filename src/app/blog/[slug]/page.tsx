import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { blogPosts as staticBlogPosts } from '@/data/posts';
import { Metadata } from 'next';
import { replaceLocation } from '@/lib/replaceLocation';
import { BlogPostView } from '@/features/blog/components/BlogPostView';

export const revalidate = 3600; // Cache page and revalidate at most every hour or on-demand

interface Props {
  params: { slug: string };
}

// Generate dynamic static params (ISR)
export async function generateStaticParams() {
  try {
    const dbPosts = await db.blogPost.findMany({ select: { slug: true } });
    const dbSlugs = dbPosts.map(p => ({ slug: p.slug.replace('/blog/', '') }));
    const staticSlugs = staticBlogPosts.map(p => ({ slug: p.slug.replace('/blog/', '') }));
    return [...dbSlugs, ...staticSlugs];
  } catch (error) {
    return staticBlogPosts.map(p => ({ slug: p.slug.replace('/blog/', '') }));
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slugWithPrefix = `/blog/${params.slug}`;
  const locationName = "";
  
  try {
    const dbPost = await db.blogPost.findUnique({
      where: { slug: slugWithPrefix }
    });

    if (dbPost) {
      const title = replaceLocation(dbPost.seoTitle || dbPost.title || '', locationName);
      const description = replaceLocation(dbPost.seoDescription || dbPost.summary || '', locationName);
      return {
        title: title,
        description: description,
        keywords: dbPost.seoKeywords ? dbPost.seoKeywords.split(',').map(k => k.trim()) : undefined
      };
    }
  } catch (e) {}

  const staticPost = staticBlogPosts.find((p) => p.slug === slugWithPrefix);
  if (staticPost) {
    return {
      title: `${staticPost.title} | GlobalWebify`,
      description: staticPost.excerpt,
    };
  }

  return {};
}

export default async function BlogPostPage({ params }: Props) {
  const slugWithPrefix = `/blog/${params.slug}`;
  
  let post: any = null;
  let isDbPost = false;

  try {
    post = await db.blogPost.findFirst({
      where: {
        slug: slugWithPrefix,
        isActive: true
      }
    });
    if (post) {
      isDbPost = true;
    }
  } catch (error) {
    console.error("Failed to query DB blog:", error);
  }

  if (!post) {
    post = staticBlogPosts.find((p) => p.slug === slugWithPrefix);
  }

  if (!post) {
    return notFound();
  }

  const locationName = "";
  if (post.title) post.title = replaceLocation(post.title, locationName);
  if (post.summary) post.summary = replaceLocation(post.summary, locationName);
  if (post.seoTitle) post.seoTitle = replaceLocation(post.seoTitle, locationName);
  if (post.seoDescription) post.seoDescription = replaceLocation(post.seoDescription, locationName);
  if (post.content) {
    let content = replaceLocation(post.content, locationName);
    content = content.replace(/<(h2|h3)([^>]*)>([\s\S]*?)<\/h[23]>/gi, (match, tag, attrs, innerHtml) => {
      const text = innerHtml.replace(/<[^>]*>/g, '').trim();
      const slugId = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const cleanAttrs = attrs.replace(/\bid\s*=\s*['"][^'"]*['"]/gi, '').trim();
      return `<${tag} id="${slugId}" class="scroll-mt-24" ${cleanAttrs}>${innerHtml}</${tag}>`;
    });
    post.content = content;
  }

  const displayDate = isDbPost 
    ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
    : post.date;

  const displayAuthor = isDbPost ? 'Admin' : post.author;
  const displayExcerpt = isDbPost ? post.summary : post.excerpt;

  let headings: { text: string; level: number }[] = [];
  if (isDbPost) {
    const headingMatches = post.content.match(/<(h2|h3)[^>]*>([\s\S]*?)<\/h[23]>/gi);
    if (headingMatches) {
      headings = headingMatches.map((m: string) => {
        const tagMatch = m.match(/<(h2|h3)/i);
        const level = tagMatch ? parseInt(tagMatch[1].substring(1)) : 2;
        const text = m.replace(/<[^>]*>/g, '').trim();
        return { text, level };
      });
    }
  } else {
    headings = post.richContent
      ?.filter((section: any) => ['h2', 'h3'].includes(section.type))
      .map((s: any) => ({
        text: s.text,
        level: parseInt(s.type.substring(1))
      })) || [];
  }

  return (
    <BlogPostView 
      post={post}
      isDbPost={isDbPost}
      headings={headings}
      displayDate={displayDate}
      displayAuthor={displayAuthor}
      displayExcerpt={displayExcerpt}
    />
  );
}
