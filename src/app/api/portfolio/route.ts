import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import cloudinary from '@/lib/cloudinary';

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

    const items = await db.portfolioItem.findMany({
      where: whereClause,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching portfolio items:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio items" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, category, desc, link, displayUrl, tags, isFeatured, imageBase64, order } = body;

    if (!title || !link || !displayUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!imageBase64) {
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

    // Upload custom image directly to Cloudinary
    console.log(`Uploading custom image to Cloudinary...`);
    const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
      folder: "portfolio",
      format: "webp",
      resource_type: "image",
    });
    finalImageUrl = uploadResponse.secure_url;
    console.log(`Custom upload successful! URL: ${finalImageUrl}`);

    // 3. Handle Auto-Shifting Sequence!
    // If user sets this card to e.g. #10, we must shift everything that is >= 10 down by 1.
    const targetOrder = order || 0;
    if (targetOrder > 0) {
      await db.portfolioItem.updateMany({
        where: { order: { gte: targetOrder } },
        data: { order: { increment: 1 } }
      });
    }

    // 4. Save to database
    const newItem = await db.portfolioItem.create({
      data: {
        title,
        category: category || "Web Development",
        desc: desc || "",
        link,
        displayUrl,
        tags: tags || "Web Design",
        isFeatured: isFeatured || false,
        image: finalImageUrl,
        order: order || 0,
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
    const body = await req.json();
    const { id, title, category, desc, link, displayUrl, tags, isFeatured, imageBase64, order } = body;

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

    if (imageBase64) {
      console.log(`Uploading new custom image for edit...`);
      const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
        folder: "portfolio",
        format: "webp",
        resource_type: "image",
      });
      dataToUpdate.image = uploadResponse.secure_url;
    }

    // 3. Handle Auto-Shifting Sequence for Edit!
    // If the user explicitly changes the order number (e.g. they type 10), we push everything else down.
    const targetOrder = order !== undefined ? order : 0;
    if (targetOrder > 0) {
      await db.portfolioItem.updateMany({
        where: {
          order: { gte: targetOrder },
          id: { not: Number(id) } // Don't shift the one we are currently editing
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
