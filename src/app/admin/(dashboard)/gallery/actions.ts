'use server';

import { db } from '@/lib/db';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function getGalleryData() {
  const categories = await db.galleryCategory.findMany({
    orderBy: { order: 'asc' },
  });

  const items = await db.galleryItem.findMany({
    orderBy: [
      { isFeatured: 'desc' },
      { featureOrder: 'asc' },
      { createdAt: 'desc' }
    ],
    take: 24,
    include: { category: true },
  });

  return { categories, items };
}

export async function fetchAdminGalleryItems(skip: number, take: number, categoryId: number | null) {
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
    console.error('Failed to fetch admin gallery items:', error);
    return [];
  }
}

export async function createCategory(name: string) {
  try {
    const lastCategory = await db.galleryCategory.findFirst({
      orderBy: { order: 'desc' },
    });
    
    const newOrder = lastCategory ? lastCategory.order + 1 : 0;

    const newCategory = await db.galleryCategory.create({
      data: { name, order: newOrder },
    });
    
    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    return { success: true, category: newCategory };
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, error: 'Failed to create category' };
  }
}

export async function updateCategory(id: number, name: string) {
  try {
    const updatedCategory = await db.galleryCategory.update({
      where: { id },
      data: { name },
    });
    
    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    return { success: true, category: updatedCategory };
    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    return { success: true };
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, error: 'Failed to update category' };
  }
}

export async function toggleFeatured(id: number, isFeatured: boolean) {
  try {
    await db.galleryItem.update({
      where: { id },
      data: { isFeatured },
    });
    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
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
    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    return { success: true };
  } catch (error) {
    console.error('Error updating feature order:', error);
    return { success: false, error: 'Failed to update feature order' };
  }
}

export async function deleteCategory(id: number) {
  try {
    await db.galleryCategory.delete({
      where: { id },
    });
    
    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: 'Failed to delete category' };
  }
}

export async function addGalleryItem(data: { url: string; itemType: string; categoryId?: number }) {
  try {
    const lastItem = await db.galleryItem.findFirst({
      orderBy: { order: 'desc' },
    });
    
    const newOrder = lastItem ? lastItem.order + 1 : 0;
    
    // Also get the last category order
    const lastCatItem = data.categoryId ? await db.galleryItem.findFirst({
      where: { categoryId: data.categoryId },
      orderBy: { categoryOrder: 'desc' },
    }) : null;
    
    const newCatOrder = lastCatItem ? lastCatItem.categoryOrder + 1 : 0;

    const newItem = await db.galleryItem.create({
      data: {
        url: data.url,
        itemType: data.itemType,
        categoryId: data.categoryId || null,
        order: newOrder,
        categoryOrder: newCatOrder,
      },
    });
    
    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    return { success: true, item: newItem };
  } catch (error) {
    console.error('Error adding gallery item:', error);
    return { success: false, error: 'Failed to add item' };
  }
}

export async function deleteGalleryItem(id: number) {
  try {
    await db.galleryItem.delete({
      where: { id },
    });
    
    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    return { success: true };
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return { success: false, error: 'Failed to delete item' };
  }
}

export async function updateItemCategory(id: number, categoryId: number | null) {
  try {
    await db.galleryItem.update({
      where: { id },
      data: { categoryId },
    });
    
    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    return { success: true };
  } catch (error) {
    console.error('Error updating item category:', error);
    return { success: false, error: 'Failed to update item' };
  }
}

export async function updateGallerySequence(itemIds: number[], isCategorySequence: boolean = false) {
  try {
    const updates = itemIds.map((id, index) => 
      db.galleryItem.update({
        where: { id },
        data: isCategorySequence ? { categoryOrder: index } : { order: index },
      })
    );
    
    await db.$transaction(updates);
    
    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    return { success: true };
  } catch (error) {
    console.error('Error updating sequence:', error);
    return { success: false, error: 'Failed to update sequence' };
  }
}
