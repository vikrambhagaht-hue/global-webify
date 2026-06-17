'use server';

import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getPolicyContent(key: string) {
  try {
    const setting = await db.siteSetting.findUnique({
      where: { key },
    });
    if (setting) {
      return JSON.parse(setting.value);
    }
    // Default fallback values if database key doesn't exist yet
    return {
      title: key === 'policy_return' ? 'Return Policy' : key === 'policy_delivery' ? 'Delivery Policy' : 'Refund Policy',
      content: '<p>Please enter policy content...</p>',
      updatedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
  } catch (error) {
    console.error(`Failed to get policy setting for key ${key}:`, error);
    return {
      title: '',
      content: '',
      updatedAt: ''
    };
  }
}

export async function savePolicyContent(key: string, title: string, content: string) {
  try {
    await requireAdmin();
    const payload = {
      title: title.trim(),
      content: content.trim(),
      updatedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
    const value = JSON.stringify(payload);
    
    await db.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    // Revalidate respective page paths
    const revalidateSlug = key === 'policy_return' ? 'return-policy' : key === 'policy_delivery' ? 'delivery-policy' : 'refund-policy';
    revalidatePath(`/${revalidateSlug}`);
    
    return { success: true };
  } catch (error: any) {
    console.error(`Failed to save policy setting for key ${key}:`, error);
    return { success: false, error: error.message };
  }
}
