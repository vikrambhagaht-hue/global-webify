"use client";

import { useState, useEffect, Suspense } from "react";
import { Plus, Trash2, Loader2, CheckCircle2, Edit2, PlayCircle, Image as ImageIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image: string;
  link: string;
  displayUrl: string;
  tags: string;
  isFeatured: boolean;
  order: number;
  createdAt: string;
}

function MediaPortfolioContent() {
  const searchParams = useSearchParams();
  const defaultType = searchParams?.get("type") || "Graphics"; // 'Logo' or 'Graphics'
  
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [uploadType, setUploadType] = useState<"file" | "instagram">("file");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [instagramLink, setInstagramLink] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [defaultType]);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/portfolio");
      const data = await res.json();
      setItems(data.filter((i: PortfolioItem) => i.category === defaultType));
    } catch (error) {
      console.error(`Failed to fetch ${defaultType}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInstagramEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('instagram.com')) {
        urlObj.search = '';
        let pathname = urlObj.pathname;
        if (!pathname.endsWith('/')) pathname += '/';
        return `${urlObj.origin}${pathname}embed?hidecaption=true`;
      }
    } catch (e) {}
    return url;
  };

  const openEditModal = (item: PortfolioItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setOrder(item.order);
    setMediaFile(null);
    if (item.link && item.link.includes('instagram.com')) {
      setUploadType("instagram");
      setInstagramLink(item.link);
    } else {
      setUploadType("file");
      setInstagramLink("");
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const isEditing = editingId !== null;
      let finalLink = instagramLink;
      let finalImage = "";

      if (uploadType === "file") {
        if (mediaFile) {
          setIsUploading(true);
          const formData = new FormData();
          formData.append("file", mediaFile);
          
          const uploadRes = await fetch("/api/upload-media", {
            method: "POST",
            body: formData
          });
          
          if (!uploadRes.ok) throw new Error("Failed to upload media");
          const uploadData = await uploadRes.json();
          finalLink = uploadData.url;
          finalImage = uploadData.url;
          setIsUploading(false);
        } else if (!isEditing) {
          alert("Please select a file to upload.");
          setIsSaving(false);
          return;
        }
      } else {
        if (!instagramLink) {
          alert("Please enter an Instagram link.");
          setIsSaving(false);
          return;
        }
      }

      // If editing and didn't upload a new file, we retain existing values in backend if we don't send them.
      // But /api/portfolio POST/PUT needs imageBase64 for Images if we aren't sending a new one, wait...
      // The API expects `imageBase64` if creating a new non-video. Since we upload to Cloudinary directly,
      // we can trick the API by sending a dummy base64 and then just updating the DB manually, OR
      // we can update the API to accept `uploadedUrl` directly!
      // To avoid modifying the API, we can just send the Cloudinary URL in `displayUrl` or wait...
      // Actually, if we just use the existing API, it requires `imageBase64` for Graphics.
      // Let's modify the API /api/portfolio to accept `existingImageUrl`!
      
      const payload: any = {
        id: editingId,
        title: title.trim() || "",
        category: defaultType,
        desc: "",
        link: finalLink,
        displayUrl: defaultType, // Dummy required field
        tags: "",
        isFeatured: false,
        order: Number(order)
      };

      if (uploadType === "file" && mediaFile) {
        payload.uploadedImageUrl = finalImage;
      } else if (uploadType === "instagram") {
        payload.uploadedImageUrl = ""; 
      }

      const res = await fetch("/api/portfolio", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        setToastMessage(`✅ ${defaultType} saved successfully!`);
        setTimeout(() => setToastMessage(""), 3000);
        setEditingId(null); setTitle(""); setOrder(0); setMediaFile(null); setInstagramLink("");
        fetchItems();
      } else {
        const data = await res.json();
        alert(data.error || `Failed to save ${defaultType}.`);
      }
    } catch (error) {
      console.error(error);
      alert(`Error saving ${defaultType}.`);
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(`Are you sure you want to delete this ${defaultType}?`)) return;
    try {
      await fetch(`/api/portfolio?id=${id}`, { method: "DELETE" });
      fetchItems();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const isVideoUrl = (url: string) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg)$/i) || (url.includes('cloudinary') && url.includes('/video/upload/'));
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage {defaultType}</h1>
          <p className="text-gray-500 mt-1">Upload image files, video files, or Instagram reels for the {defaultType} tab.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setTitle(""); setOrder(0); setMediaFile(null); setInstagramLink("");
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-[#1a8b4c] hover:bg-[#15703d] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add {defaultType}
        </button>
      </div>

      {toastMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No {defaultType} items found</h3>
          <p className="text-gray-500 max-w-sm mx-auto">Upload your first image, video, or Instagram reel to display in the {defaultType} portfolio tab.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const isInsta = item.link?.includes('instagram.com');
            const isVid = isVideoUrl(item.image || item.link);
            
            return (
              <div key={item.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden flex items-center justify-center">
                  {isInsta ? (
                    <div className="w-full h-full p-2 relative">
                       <div className="absolute inset-0 z-10 pointer-events-none"></div>
                       <iframe src={getInstagramEmbedUrl(item.link)} className="w-full h-full border-0 rounded-xl" />
                    </div>
                  ) : isVid ? (
                    <video src={item.image || item.link} className="w-full h-full object-cover" controls={false} muted />
                  ) : (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  )}
                  
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md">
                    Order: {item.order || 0}
                  </div>
                </div>
                
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{isInsta ? "Instagram Embed" : isVid ? "Video File" : "Image File"}</p>
                  </div>
                  
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => openEditModal(item)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-200"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-200"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? `Edit ${defaultType}` : `Add New ${defaultType}`}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="media-form" onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title (Optional)</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1a8b4c] focus:border-[#1a8b4c] transition-all"
                    placeholder={`e.g. AI Generated ${defaultType} Concept`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Order / Priority</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={order}
                    onChange={e => setOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1a8b4c] focus:border-[#1a8b4c] transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">Position in the list (1 = 1st, 2 = 2nd). 0 means default order.</p>
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Media Source</label>
                  <div className="flex gap-4">
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${uploadType === 'file' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                      <input type="radio" checked={uploadType === 'file'} onChange={() => setUploadType('file')} className="hidden" />
                      <ImageIcon className="w-4 h-4" /> Upload File
                    </label>
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${uploadType === 'instagram' ? 'bg-pink-50 border-pink-500 text-pink-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                      <input type="radio" checked={uploadType === 'instagram'} onChange={() => setUploadType('instagram')} className="hidden" />
                      <PlayCircle className="w-4 h-4" /> Instagram Link
                    </label>
                  </div>
                </div>

                {uploadType === "file" && (
                  <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Image or Video (MP4)</label>
                    <input 
                      type="file" 
                      accept="image/*,video/mp4,video/webm"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setMediaFile(e.target.files[0]);
                        }
                      }}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 cursor-pointer" 
                    />
                    {editingId && !mediaFile && (
                      <p className="text-xs text-gray-500 mt-2 italic">Leave empty to keep the existing uploaded file.</p>
                    )}
                  </div>
                )}

                {uploadType === "instagram" && (
                  <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Instagram Reel Link</label>
                    <input
                      required={uploadType === "instagram"}
                      type="url"
                      value={instagramLink}
                      onChange={e => setInstagramLink(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                      placeholder="https://www.instagram.com/reel/..."
                    />
                  </div>
                )}
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="media-form"
                disabled={isSaving}
                className="flex items-center gap-2 bg-[#1a8b4c] hover:bg-[#15703d] text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isUploading ? "Uploading..." : "Saving..."}
                  </>
                ) : (
                  <>Save {defaultType}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminMediaPortfolioPage() {
  return (
    <Suspense fallback={<div className="p-10 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-gray-400" /></div>}>
      <MediaPortfolioContent />
    </Suspense>
  );
}
