'use client';

import React, { useState, useRef } from 'react';
import { Upload, Plus, Trash2, Image as ImageIcon, Film, Save, RefreshCw, Edit2, Check, X as XIcon, Star } from 'lucide-react';
import { createCategory, deleteCategory, updateCategory, addGalleryItem, deleteGalleryItem, updateItemCategory, toggleFeatured, updateFeatureOrder } from './actions';
import Image from 'next/image';

type Category = {
  id: number;
  name: string;
  order: number;
};

type GalleryItem = {
  id: number;
  url: string;
  itemType: string;
  isFeatured: boolean;
  featureOrder: number;
  categoryId: number | null;
  category?: Category | null;
};

export default function AdminGalleryClient({ 
  initialCategories, 
  initialItems 
}: { 
  initialCategories: Category[], 
  initialItems: GalleryItem[] 
}) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  
  const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items');
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingSeq, setIsSavingSeq] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [editingCatName, setEditingCatName] = useState('');
  const [activeFilterCat, setActiveFilterCat] = useState<number | null>(null);
  const [uploadCategoryId, setUploadCategoryId] = useState<number | null>(null);
  
  // Directly pull a tiny 100x100 compressed thumbnail from Cloudinary
  const getThumbnailUrl = (url: string) => {
    if (url.includes('cloudinary.com') && !url.includes('f_auto')) {
      return url.replace('/upload/', '/upload/f_auto,q_auto,w_100,h_100,c_fill/');
    }
    return url;
  };

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  
  const sortedItems = [...items].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    if (a.isFeatured && b.isFeatured) return (a.featureOrder || 0) - (b.featureOrder || 0);
    return 0; // The initialItems are already sorted by createdAt DESC from actions.ts
  });

  const filteredItems = activeFilterCat 
    ? sortedItems.filter(it => it.categoryId === activeFilterCat) 
    : sortedItems;
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CATEGORY MANAGEMENT
  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    const res = await createCategory(newCatName.trim());
    if (res.success && res.category) {
      setCategories([...categories, res.category as Category]);
      setNewCatName('');
      showToast('Category created successfully!');
    } else {
      showToast('Failed to add category', 'error');
    }
  };

  const handleSaveEditCategory = async (id: number) => {
    if (!editingCatName.trim()) return;
    const res = await updateCategory(id, editingCatName.trim());
    if (res.success) {
      setCategories(categories.map(c => c.id === id ? { ...c, name: editingCatName.trim() } : c));
      setEditingCatId(null);
      showToast('Category updated successfully!');
    } else {
      showToast('Failed to update category', 'error');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category? Your photos will NOT be deleted, they will just be moved to the "All" view.')) return;
    const res = await deleteCategory(id);
    if (res.success) {
      setCategories(categories.filter(c => c.id !== id));
      setItems(items.map(it => it.categoryId === id ? { ...it, categoryId: null } : it));
      showToast('Category deleted successfully!');
    } else {
      showToast('Failed to delete category', 'error');
    }
  };

  // ITEM MANAGEMENT
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's a video and warn
    const isVideo = file.type.startsWith('video/');
    if (isVideo) {
      const confirmVideo = confirm("🚨 STOP: Please DO NOT upload videos right now!\n\nWe are currently using the Cloudinary Free Plan, which will break if you upload heavy videos. Please wait until the site is shifted to Hostinger/Cloud storage before uploading videos.\n\nAre you absolutely sure you want to proceed?");
      if (!confirmVideo) return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.url) {
        const addRes = await addGalleryItem({
          url: data.url,
          itemType: isVideo ? 'video' : 'image',
          categoryId: uploadCategoryId || undefined
        });
        if (addRes.success && addRes.item) {
          setItems([...items, addRes.item]);
          showToast('Media uploaded successfully!');
        } else {
          showToast('Failed to save media', 'error');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Upload failed', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Delete this item?')) return;
    const res = await deleteGalleryItem(id);
    if (res.success) {
      setItems(items.filter(it => it.id !== id));
      showToast('Media deleted!');
    } else {
      showToast('Failed to delete media', 'error');
    }
  };

  const handleCategoryChange = async (itemId: number, catId: string) => {
    const parsedId = catId ? parseInt(catId, 10) : null;
    const res = await updateItemCategory(itemId, parsedId);
    if (res.success) {
      setItems(items.map(it => it.id === itemId ? { ...it, categoryId: parsedId } : it));
      showToast('Category updated!');
    } else {
      showToast('Failed to update category', 'error');
    }
  };

  const handleToggleFeatured = async (item: GalleryItem) => {
    const newVal = !item.isFeatured;
    const res = await toggleFeatured(item.id, newVal);
    if (res.success) {
      setItems(items.map(it => it.id === item.id ? { ...it, isFeatured: newVal, featureOrder: newVal ? 0 : it.featureOrder } : it));
      showToast(newVal ? 'Item featured!' : 'Item un-featured');
    } else {
      showToast('Failed to update featured status', 'error');
    }
  };

  const handleUpdateFeatureOrder = async (item: GalleryItem, newOrder: string) => {
    let val = parseInt(newOrder, 10);
    if (isNaN(val)) return;
    val = Math.max(0, val); // Prevent negative numbers
    
    const res = await updateFeatureOrder(item.id, val);
    if (res.success) {
      setItems(items.map(it => it.id === item.id ? { ...it, featureOrder: val } : it));
    } else {
      showToast('Failed to update order', 'error');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-xl shadow-lg border ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5 fade-in duration-300`}>
          {toast.message}
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-100 pb-4 mb-6">
        <button 
          onClick={() => setActiveTab('items')}
          className={`font-semibold px-4 py-2 rounded-lg transition-colors ${activeTab === 'items' ? 'bg-[#1a8b4c] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
        >
          Manage Items & Sequence
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`font-semibold px-4 py-2 rounded-lg transition-colors ${activeTab === 'categories' ? 'bg-[#1a8b4c] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
        >
          Manage Categories
        </button>
      </div>

      {activeTab === 'categories' && (
        <div className="space-y-6 max-w-2xl">
          <div className="flex gap-2">
            <input 
              type="text"
              placeholder="New Category Name (e.g., Office Events)"
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#1a8b4c] outline-none"
            />
            <button 
              onClick={handleAddCategory}
              className="bg-[#1a8b4c] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-[#15703d]"
            >
              <Plus size={18} /> Add
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-100 divide-y divide-gray-100">
            {categories.length === 0 && <p className="p-4 text-gray-500 text-sm">No categories found.</p>}
            {categories.map(cat => (
              <div key={cat.id} className="flex justify-between items-center p-4">
                {editingCatId === cat.id ? (
                  <div className="flex-1 flex gap-2 mr-4">
                    <input 
                      type="text"
                      value={editingCatName}
                      onChange={e => setEditingCatName(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#1a8b4c] outline-none text-sm"
                      autoFocus
                    />
                    <button 
                      onClick={() => handleSaveEditCategory(cat.id)}
                      className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                      title="Save"
                    >
                      <Check size={18} />
                    </button>
                    <button 
                      onClick={() => setEditingCatId(null)}
                      className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Cancel"
                    >
                      <XIcon size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-semibold text-gray-700">{cat.name}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingCatId(cat.id);
                          setEditingCatName(cat.name);
                        }}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Category Name"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'items' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <h3 className="font-bold text-gray-800">Upload New Media</h3>
              <p className="text-xs text-gray-500 mt-1 mb-2">Supports images and videos.</p>
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2.5 rounded-lg flex items-start gap-2 max-w-md shadow-sm">
                <span className="font-bold whitespace-nowrap">🚫 DO NOT UPLOAD VIDEOS YET:</span> 
                <span>We are currently using the Cloudinary Free Plan, which cannot handle video storage. Please wait until the site is fully hosted on Hostinger/Cloud before uploading videos here!</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <select
                value={uploadCategoryId || ''}
                onChange={e => setUploadCategoryId(e.target.value ? parseInt(e.target.value) : null)}
                className="text-sm border border-gray-300 rounded-xl px-3 py-2.5 bg-white focus:ring-2 focus:ring-[#1a8b4c] outline-none min-w-[160px]"
              >
                <option value="">Upload to: All (No Category)</option>
                {categories.map(c => <option key={c.id} value={c.id}>Upload to: {c.name}</option>)}
              </select>
              
              <input 
                type="file" 
                accept="image/*,video/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <button 
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#1a8b4c] w-full sm:w-auto text-white px-5 py-2.5 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-[#15703d] disabled:opacity-50"
              >
                {isUploading ? <RefreshCw className="animate-spin" size={18} /> : <Upload size={18} />}
                {isUploading ? 'Uploading...' : 'Upload Media'}
              </button>
            </div>
          </div>

          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4">
              <div>
                <h3 className="font-bold text-gray-800">Gallery Items Sequence</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Drag items to reorder them {activeFilterCat !== null && "within this category"}.
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                <div className="flex flex-wrap items-center gap-2 mr-4">
                  <button
                    onClick={() => setActiveFilterCat(null)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                      activeFilterCat === null 
                        ? 'bg-[#1a8b4c] text-white shadow-md' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1a8b4c] hover:text-[#1a8b4c]'
                    }`}
                  >
                    All
                  </button>
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setActiveFilterCat(c.id)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                        activeFilterCat === c.id 
                          ? 'bg-[#1a8b4c] text-white shadow-md' 
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1a8b4c] hover:text-[#1a8b4c]'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
                </div>
              </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item, index) => (
                <div 
                  key={item.id}
                  className={`bg-white border ${item.isFeatured ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.2)]' : 'border-gray-200'} rounded-xl overflow-hidden shadow-sm flex items-center gap-3 p-3 transition-all`}
                >
                  
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                    {item.itemType === 'video' ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                        <Film size={24} />
                      </div>
                    ) : (
                      <Image 
                        src={getThumbnailUrl(item.url)} 
                        alt="thumbnail" 
                        width={64}
                        height={64}
                        unoptimized={item.url.includes('cloudinary.com')}
                        className="w-full h-full object-cover" 
                      />
                    )}
                  </div>
                  
                  <div className="flex-1 py-1 flex flex-col gap-2">
                    <select 
                      value={item.categoryId || ''} 
                      onChange={(e) => handleCategoryChange(item.id, e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:border-[#1a8b4c] bg-gray-50"
                    >
                      <option value="">No Category (All)</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleFeatured(item)}
                        className={`p-1.5 rounded-lg transition-colors ${item.isFeatured ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                        title={item.isFeatured ? "Un-feature" : "Feature at front"}
                      >
                        <Star size={16} fill={item.isFeatured ? "currentColor" : "none"} />
                      </button>

                      {item.isFeatured && (
                        <input
                          key={item.featureOrder}
                          type="number"
                          defaultValue={item.featureOrder.toString()}
                          onBlur={(e) => {
                            let val = parseInt(e.target.value) || 0;
                            val = Math.max(0, val);
                            e.target.value = val.toString(); // Update visual input immediately
                            if (val !== item.featureOrder) {
                              handleUpdateFeatureOrder(item, val.toString());
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === '-' || e.key === 'e') {
                              e.preventDefault(); // Prevent typing negative sign or 'e' (scientific notation)
                            }
                            if (e.key === 'Enter') {
                              e.currentTarget.blur();
                            }
                          }}
                          className="w-16 text-xs border border-gray-300 rounded-lg p-1.5 text-center focus:ring-1 focus:ring-yellow-400 outline-none"
                          title="Sequence Number"
                          min="1"
                        />
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 self-start mt-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              
              {filteredItems.length === 0 && (
                <div className="col-span-full p-8 text-center text-gray-500 border border-dashed border-gray-300 rounded-xl">
                  {activeFilterCat !== null ? "No items in this category." : "No items in gallery. Upload some media!"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
