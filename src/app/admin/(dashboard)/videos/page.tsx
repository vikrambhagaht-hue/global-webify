"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, CheckCircle2, Edit2, PlayCircle, Video as VideoIcon } from "lucide-react";

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image: string;
  thumbnail?: string | null;
  desc: string;
  link: string;
  displayUrl: string;
  tags: string;
  isFeatured: boolean;
  order: number;
  createdAt: string;
}

export default function AdminVideosPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [desc, setDesc] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [tags, setTags] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  
  const [uploadType, setUploadType] = useState<"instagram" | "file">("instagram");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();
      // Only keep Videos
      setItems(data.filter((i: PortfolioItem) => i.category === "Videos"));
    } catch (error) {
      console.error("Failed to fetch videos:", error);
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
    setLink(item.link);
    setDesc(item.desc || "");
    setOrder(item.order);
    setTags(item.tags || "");
    setMediaFile(null);
    
    if (item.link && item.link.includes('instagram.com')) {
      setUploadType("instagram");
    } else {
      setUploadType("file");
    }
    
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const isEditing = editingId !== null;
      let finalLink = link;
      let finalImage = "";

      if (uploadType === "file") {
        if (mediaFile) {
          const isVideo = mediaFile.type.startsWith("video/");
          
          if (isVideo && mediaFile.size > 50 * 1024 * 1024) { // 50MB max for videos
            setToastMessage("❌ Video file size exceeds 50MB. Please compress it before uploading.");
            setTimeout(() => setToastMessage(""), 5000);
            setIsSaving(false);
            return;
          }

          setIsUploading(true);
          const formData = new FormData();
          formData.append("file", mediaFile);
          
          try {
            const uploadRes = await fetch("/api/upload-media", {
              method: "POST",
              body: formData
            });
            
            if (!uploadRes.ok) throw new Error("Failed to upload video");
            const uploadData = await uploadRes.json();
            finalLink = uploadData.url;
            finalImage = uploadData.url;
          } catch (error) {
            throw new Error("Failed to upload video");
          } finally {
            setIsUploading(false);
          }
        } else if (!isEditing) {
          alert("Please select a video to upload.");
          setIsSaving(false);
          return;
        }
      } else {
        if (!finalLink) {
          alert("Please enter an Instagram link.");
          setIsSaving(false);
          return;
        }
      }

      const payload: any = {
        id: editingId,
        title: title.trim() || "",
        category: "Videos",
        desc,
        link: finalLink,
        displayUrl: "video", 
        tags,
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
        setToastMessage(prev => prev ? prev : "✅ Video saved successfully!");
        setTimeout(() => setToastMessage(""), 3000);
        setEditingId(null); setTitle(""); setLink(""); setDesc(""); setOrder(0); setTags(""); setMediaFile(null);
        fetchItems();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save video.");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving video.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    try {
      await fetch(`/api/portfolio?id=${id}`, { method: "DELETE" });
      fetchItems();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Instagram Videos</h1>
          <p className="text-gray-500 mt-1">Manage Instagram Reels displayed on the portfolio page.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setTitle(""); setDesc(""); setLink(""); setOrder(0); setTags(""); setMediaFile(null); setUploadType("instagram");
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] hover:opacity-90 text-white px-5 py-2.5 rounded-lg font-medium transition-opacity shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add Video / Reel
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-pink-600 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-4">
             <PlayCircle className="w-8 h-8 text-[#E1306C]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No videos yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">You haven't added any Instagram Reels yet. Click the button above to add your first video.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
          {items.map((item, index) => {
            const isSquare = item.tags === "square";
            return (
              <div key={item.id} className="break-inside-avoid mb-4 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                <div className={`relative ${isSquare ? 'aspect-square' : 'aspect-[4/5] sm:aspect-[3/4]'} overflow-hidden bg-gray-50 p-2 sm:p-3 flex items-center justify-center group/img transition-all duration-300 border-b border-gray-100`}>
                   <div className="absolute top-2 left-2 z-10">
                   <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md w-fit opacity-80 group-hover:opacity-100 transition-opacity">
                     Order #{index + 1}
                   </div>
                 </div>
                 
                 <div className="w-full h-full relative rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 bg-white">
                   <iframe 
                     src={getInstagramEmbedUrl(item.link)}
                     className="absolute inset-0 w-full h-full border-0 bg-transparent"
                     scrolling="no"
                     loading="lazy"
                   />
                 </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2 z-20">
                  <button
                    onClick={() => openEditModal(item)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-md transition-colors"
                    title="Edit Item"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-md transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  {item.title && item.title !== "Instagram Reel" && (
                    <h3 className="text-[18px] md:text-[20px] font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#E1306C] transition-colors duration-300 line-clamp-2">{item.title}</h3>
                  )}
                </div>
                {item.desc && (
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.desc}</p>
                )}
                {item.order > 0 && (
                   <p className="text-xs text-blue-600 font-bold mt-2">Custom Priority: #{item.order}</p>
                )}
                {isSquare && (
                   <span className="inline-block mt-2 bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-md">Square Format</span>
                )}
              </div>
            </div>
          )})}
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 animate-[slideIn_0.3s_ease-out]">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {editingId ? (
                  <>
                    <Edit2 className="w-5 h-5 text-[#E1306C]" />
                    Edit Instagram Reel
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-[#E1306C]" />
                    Add Instagram Reel
                  </>
                )}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Video Title (Optional)</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  placeholder="e.g. AI Product Demo"
                />
              </div>

              <div className="pt-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Media Source</label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${uploadType === 'instagram' ? 'bg-pink-50 border-pink-500 text-pink-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                    <input type="radio" checked={uploadType === 'instagram'} onChange={() => setUploadType('instagram')} className="hidden" />
                    <PlayCircle className="w-4 h-4" /> Instagram Link
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${uploadType === 'file' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                    <input type="radio" checked={uploadType === 'file'} onChange={() => setUploadType('file')} className="hidden" />
                    <VideoIcon className="w-4 h-4" /> Upload Video
                  </label>
                </div>
              </div>

              {uploadType === "instagram" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Instagram Reel URL</label>
                  <input
                    required={uploadType === "instagram"}
                    type="url"
                    value={link}
                    onChange={e => setLink(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                    placeholder="https://www.instagram.com/reel/..."
                  />
                </div>
              )}

              {uploadType === "file" && (
                <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Video (MP4/WebM)</label>
                  <input 
                    type="file" 
                    accept="video/mp4,video/webm"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setMediaFile(e.target.files[0]);
                      }
                    }}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer file:cursor-pointer" 
                  />
                  
                  {mediaFile && (
                    <div className="mt-3 bg-blue-50/50 px-3 py-2 rounded-lg border border-blue-100 flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-blue-500" />
                      <span className="text-[11px] font-semibold text-blue-800">
                        Video will be automatically transcoded to 1080p by the server after upload.
                      </span>
                    </div>
                  )}

                  {editingId && !mediaFile && (
                    <p className="text-xs text-gray-500 mt-2 italic">Leave empty to keep the existing uploaded video.</p>
                  )}
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tags === "square"}
                    onChange={e => setTags(e.target.checked ? "square" : "")}
                    className="w-5 h-5 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                  />
                  <div>
                    <span className="block text-sm font-semibold text-gray-900">Is this a Square Post? (1:1 format)</span>
                    <span className="block text-[11px] text-gray-500 mt-0.5">Check this if the Instagram video is square instead of a tall vertical reel.</span>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Priority / Sort Order (Optional)</label>
                <input
                  type="number"
                  min="1"
                  value={order || ""}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === "") setOrder(0);
                    else setOrder(Math.max(1, Number(val)));
                  }}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  placeholder="Leave empty for default (goes to bottom)"
                />
                <p className="text-[11px] text-gray-500 mt-1">Type 1 to make it the first card, 2 for the second card, etc. Unnumbered cards stay at the bottom.</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description (Optional)</label>
                <textarea
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  placeholder="Brief description about the reel..."
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] hover:opacity-90 shadow-md shadow-pink-500/20 transition-all flex items-center gap-2"
                >
                  {isSaving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  ) : (
                    <>{editingId ? "Update Reel" : "Add Reel"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
