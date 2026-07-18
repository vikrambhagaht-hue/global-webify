import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import cloudinary from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const featuredParam = searchParams.get('featured');
    
    let whereClause: any = { isActive: true };
    if (featuredParam === 'true') {
      whereClause.isFeatured = true;
    } else if (featuredParam === 'false') {
      whereClause.isFeatured = false;
    }

    let items = await db.portfolioItem.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    // Custom sort: treat 0 as 9999 so default items go to the bottom
    items.sort((a, b) => {
      const orderA = a.order === 0 ? 9999 : a.order;
      const orderB = b.order === 0 ? 9999 : b.order;
      
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return 0; // If they have the same order, maintain the createdAt desc order from the DB
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching portfolio items:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio items" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Authentication: Only admins can create portfolio items
    try {
      await requireAdmin(true);
    } catch (authError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, category, desc, link, displayUrl, tags, isFeatured, imageBase64, thumbnailBase64, order, uploadedImageUrl } = body;

    if (title === undefined || !link || !displayUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!imageBase64 && !uploadedImageUrl && category !== "Videos" && category !== "Graphics" && category !== "Logo") {
      return NextResponse.json({ error: "Custom screenshot image is required" }, { status: 400 });
    }

    if (isFeatured) {
      const featuredCount = await db.portfolioItem.count({
        where: { isActive: true, isFeatured: true }
      });
      if (featuredCount >= 6) {
        return NextResponse.json({ error: "Maximum 6 homepage cards allowed! Please remove or unfeature an existing card first." }, { status: 400 });
      }
    }

    let finalImageUrl = "";

    if (uploadedImageUrl) {
      finalImageUrl = uploadedImageUrl;
    } else if (imageBase64) {
      console.log(`Uploading custom image to Cloudinary...`);
      const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
        folder: "portfolio",
        format: "webp",
        resource_type: "image",
      });
      finalImageUrl = uploadResponse.secure_url;
      console.log(`Custom upload successful! URL: ${finalImageUrl}`);
    }

    let finalThumbnailUrl = null;
    if (thumbnailBase64) {
      console.log(`Uploading thumbnail to Cloudinary...`);
      const thumbUploadResponse = await cloudinary.uploader.upload(thumbnailBase64, {
        folder: "portfolio-thumbnails",
        format: "webp",
        resource_type: "image",
      });
      finalThumbnailUrl = thumbUploadResponse.secure_url;
    }

    // 3. Handle Auto-Shifting Sequence!
    // 3. Handle Auto-Shifting Sequence! (Removed redundant updateMany, handled below)

    // 4. Save to database
    let finalOrder = order || 0;
    if (finalOrder > 0) {
      const isVideo = category === "Videos";
      const scopeWhere = isVideo 
        ? { category: "Videos" } 
        : { category: { not: "Videos" }, isFeatured: !!isFeatured };

      // Simple shifting logic: push down items that collide
      await db.portfolioItem.updateMany({
        where: { isActive: true, order: { gte: finalOrder }, ...scopeWhere },
        data: { order: { increment: 1 } }
      });
    }

    const newItem = await db.portfolioItem.create({
      data: {
        title: title || "",
        category: category || "Web Development",
        desc: desc || "",
        link,
        displayUrl,
        tags: tags || "Web Design",
        isFeatured: isFeatured || false,
        image: finalImageUrl,
        thumbnail: finalThumbnailUrl,
        order: finalOrder,
      }
    });

    // Bust the cache for the frontend pages so it updates instantly
    revalidatePath('/portfolio');
    revalidatePath('/');

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating portfolio item:", error);
    return NextResponse.json({ error: "Failed to create portfolio item" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    // Authentication: Only admins can delete portfolio items
    try {
      await requireAdmin(true);
    } catch (authError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await db.portfolioItem.delete({
      where: { id: Number(id) }
    });

    revalidatePath('/portfolio');
    revalidatePath('/');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting portfolio item:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    // Authentication: Only admins can edit portfolio items
    try {
      await requireAdmin(true);
    } catch (authError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, title, category, desc, link, displayUrl, tags, isFeatured, imageBase64, thumbnailBase64, order, uploadedImageUrl } = body;

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    if (isFeatured === true) {
      const existing = await db.portfolioItem.findUnique({ where: { id: Number(id) } });
      if (!existing?.isFeatured) {
        const featuredCount = await db.portfolioItem.count({
          where: { isActive: true, isFeatured: true }
        });
        if (featuredCount >= 6) {
          return NextResponse.json({ error: "Maximum 6 homepage cards allowed! Please remove or unfeature an existing card first." }, { status: 400 });
        }
      }
    }

    let dataToUpdate: any = {
      title,
      category,
      desc,
      link,
      displayUrl,
      tags,
      isFeatured,
      order: order !== undefined ? order : 0
    };

    if (uploadedImageUrl) {
      dataToUpdate.image = uploadedImageUrl;
    } else if (imageBase64) {
      console.log(`Uploading new custom image for edit...`);
      const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
        folder: "portfolio",
        format: "webp",
        resource_type: "image",
      });
      dataToUpdate.image = uploadResponse.secure_url;
    }

    if (thumbnailBase64) {
      console.log(`Uploading new thumbnail for edit...`);
      const thumbUploadResponse = await cloudinary.uploader.upload(thumbnailBase64, {
        folder: "portfolio-thumbnails",
        format: "webp",
        resource_type: "image",
      });
      dataToUpdate.thumbnail = thumbUploadResponse.secure_url;
    }

    // Simple Automatic Shifting Logic
    const newOrder = dataToUpdate.order;
    if (newOrder !== undefined && newOrder > 0) {
      const isVideo = dataToUpdate.category === "Videos";
      const scopeWhere = isVideo 
        ? { category: "Videos" } 
        : { category: { not: "Videos" }, isFeatured: !!dataToUpdate.isFeatured };

      // Only shift items if they are currently occupying the requested spot or higher
      await db.portfolioItem.updateMany({
        where: { 
          isActive: true, 
          order: { gte: newOrder }, 
          id: { not: Number(id) }, // Don't shift the item we are currently editing
          ...scopeWhere 
        },
        data: { order: { increment: 1 } }
      });
    }

    const updatedItem = await db.portfolioItem.update({
      where: { id: Number(id) },
      data: dataToUpdate
    });

    revalidatePath('/portfolio');
    revalidatePath('/');

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating portfolio item:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
