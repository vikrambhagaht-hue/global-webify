import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the old JSON file
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'gallery_scraped.json');
    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json({ message: 'JSON file not found' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(jsonPath, 'utf-8');
    const imageUrls: string[] = JSON.parse(fileContent);

    if (!Array.isArray(imageUrls)) {
      return NextResponse.json({ message: 'Invalid JSON format' }, { status: 400 });
    }

    // Check if we already have items to avoid duplicate seeding
    const existingCount = await db.galleryItem.count();
    if (existingCount > 0) {
      return NextResponse.json({ message: 'Database already has gallery items. Seed aborted to prevent duplicates.' });
    }

    // Create a default category
    const defaultCategory = await db.galleryCategory.create({
      data: {
        name: 'Legacy Gallery',
        order: 0,
      }
    });

    // Create the gallery items
    const itemsToCreate = imageUrls.map((url, index) => ({
      url: url,
      itemType: 'image',
      categoryId: defaultCategory.id,
      order: index,
    }));

    await db.galleryItem.createMany({
      data: itemsToCreate
    });

    return NextResponse.json({ 
      message: 'Successfully migrated existing images to the database!', 
      count: itemsToCreate.length 
    });

  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ message: 'Error migrating data', error: error.message }, { status: 500 });
  }
}
