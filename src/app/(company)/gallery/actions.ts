'use server'

import { db } from '@/lib/db';

export async function toggleFeatured(id: number, isFeatured: boolean) {
  try {
    await db.galleryItem.update({
      where: { id },
      data: { isFeatured },
    });
    return { success: true };
  } catch (error) {
    console.error('Error toggling featured status:', error);
    return { success: false, error: 'Failed to toggle featured status' };
  }
}

export async function updateFeatureOrder(id: number, featureOrder: number) {
  try {
    await db.galleryItem.update({
      where: { id },
      data: { featureOrder },
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating feature order:', error);
    return { success: false, error: 'Failed to update feature order' };
  }
}

export async function fetchGalleryItems(skip: number, take: number, categoryId: number | null) {
  try {
    const items = await db.galleryItem.findMany({
      where: categoryId ? { categoryId } : undefined,
      orderBy: [
        { isFeatured: 'desc' },
        { featureOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      skip,
      take,
      include: { category: true }
    });
    
    return items;
  } catch (error) {
    console.error("Database query failed, did you run prisma db push?", error);
    return [];
  }
}
