import AdminGalleryClient from './AdminGalleryClient';
import { getGalleryData } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage() {
  const { categories, items } = await getGalleryData();
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 font-poppins">Gallery Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage gallery images, videos, categories, and sequencing.</p>
        </div>
      </div>
      
      <AdminGalleryClient initialCategories={categories} initialItems={items} />
    </div>
  );
}
