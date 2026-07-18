"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, CheckCircle2, Image as ImageIcon, ExternalLink, Star, Edit2, ArrowDownRight } from "lucide-react";
import Image from "next/image";
import { adminFetch } from "@/lib/adminFetch";

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

export default function AdminHomepagePortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customImageBase64, setCustomImageBase64] = useState("");
  const [customThumbnailBase64, setCustomThumbnailBase64] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedSizeInfo, setCompressedSizeInfo] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Website");
  const [desc, setDesc] = useState("");
  const [link, setLink] = useState("https://");
  const [displayUrl, setDisplayUrl] = useState("");
  const [tags, setTags] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [order, setOrder] = useState<number>(0);

  // SEO Form State
  const [seoTargetedCountry, setSeoTargetedCountry] = useState("United Arab Emirates");
  const [seoTargetedLocationLabel, setSeoTargetedLocationLabel] = useState("Targeted Country");
  const [seoShowTargetedLocation, setSeoShowTargetedLocation] = useState(true);
  const [seoTotalRanked, setSeoTotalRanked] = useState("");
  const [seoTop10, setSeoTop10] = useState("");
  const [seoTop20, setSeoTop20] = useState("");
  const [seoTop30, setSeoTop30] = useState("");

  const [seoDisplayCategory, setSeoDisplayCategory] = useState("SEO");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await adminFetch("/api/portfolio?featured=true");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch portfolio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (item: PortfolioItem, index: number) => {
    setEditingId(item.id);
    const defaultCategories = ["Website", "E-Commerce", "CRM", "SEO", "Logo", "Graphics", "Videos"];
    if (!defaultCategories.includes(item.category)) {
      setIsCustomCategory(true);
    } else {
      setIsCustomCategory(false);
    }
    
    setTitle(item.title);
    setCategory(item.category);
    setDesc(item.desc);
    setLink(item.link);
    setDisplayUrl(item.displayUrl);
    setTags(item.tags);
    setIsFeatured(item.isFeatured);
    setOrder(index + 1); // Pre-populate with exact visual sequence
    
    if (item.category === "SEO") {
      try {
        const seoData = JSON.parse(item.tags);
        setSeoTargetedCountry(seoData.targetedCountry || "");
        setSeoTargetedLocationLabel(seoData.targetedLocationLabel || "Targeted Country");
        setSeoShowTargetedLocation(seoData.showTargetedLocation !== false);
        setSeoTotalRanked(seoData.totalRanked || "");
        setSeoTop10(seoData.top10 || "");
        setSeoTop20(seoData.top20 || "");
        setSeoTop30(seoData.top30 || "");

        setSeoDisplayCategory(seoData.displayCategory || "SEO");
      } catch (e) {
        setSeoTargetedCountry("");
        setSeoTargetedLocationLabel("Targeted Country");
        setSeoShowTargetedLocation(true);
        setSeoTotalRanked("");
        setSeoTop10("");
        setSeoTop20("");
        setSeoTop30("");

        setSeoDisplayCategory("SEO");
      }
    } else {
      setSeoTargetedCountry("United Arab Emirates");
      setSeoTargetedLocationLabel("Targeted Country");
      setSeoShowTargetedLocation(true);
      setSeoTotalRanked("");
      setSeoTop10("");
      setSeoTop20("");
      setSeoTop30("");

      setSeoDisplayCategory("SEO");
    }
    
    setShowModal(true);
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }
          
          const MAX_WIDTH = 1200;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL("image/webp", 0.8));
        };
        img.onerror = reject;
        img.src = event.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId === null && items.length >= 6) {
      alert("Maximum 6 homepage cards allowed! Please remove or move an existing card first.");
      return;
    }
    setIsSaving(true);
    try {
      let finalTags = tags;
      if (category === "SEO") {
        finalTags = JSON.stringify({
          targetedCountry: seoTargetedCountry,
          targetedLocationLabel: seoTargetedLocationLabel,
          showTargetedLocation: seoShowTargetedLocation,
          totalRanked: seoTotalRanked,
          top10: seoTop10,
          top20: seoTop20,
          top30: seoTop30,

          displayCategory: seoDisplayCategory
        });
      }

      const isEditing = editingId !== null;
      const res = await adminFetch("/api/portfolio", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId, title, category, desc, link, displayUrl, tags: finalTags, isFeatured, imageBase64: customImageBase64, thumbnailBase64: customThumbnailBase64, order: Number(order)
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setToastMessage("✅ Project saved successfully!");
        setTimeout(() => setToastMessage(""), 3000);
        // Reset form
        setEditingId(null); setTitle(""); setDesc(""); setLink("https://"); setDisplayUrl(""); setTags(""); setIsFeatured(true); setIsCustomCategory(false); setCategory("Website"); setCustomImageBase64(""); setCustomThumbnailBase64(""); setCompressedSizeInfo(null); setOrder(0);
        setSeoTargetedCountry("United Arab Emirates"); setSeoTargetedLocationLabel("Targeted Country"); setSeoShowTargetedLocation(true); setSeoTotalRanked(""); setSeoTop10(""); setSeoTop20(""); setSeoTop30(""); setSeoDisplayCategory("SEO");
        fetchItems();
      } else {
        alert("Failed to save portfolio item.");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving portfolio item.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    try {
      await adminFetch(`/api/portfolio?id=${id}`, { method: "DELETE" });
      setToastMessage("🗑️ Item deleted successfully!");
      setTimeout(() => setToastMessage(""), 3000);
      fetchItems();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleMoveToPortfolio = async (item: PortfolioItem) => {
    if (!confirm("Move this card back to the Main Portfolio? (It will be removed from the Homepage)")) return;
    try {
      const res = await adminFetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, isFeatured: false }),
      });
      if (res.ok) {
        setToastMessage("Project removed from Homepage Cards!");
        setTimeout(() => setToastMessage(""), 3000);
        fetchItems();
      } else {
        alert("Failed to move project.");
      }
    } catch (error) {
      console.error(error);
      alert("Error moving project.");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Homepage Cards Management</h1>
          <p className="text-gray-500 mt-1">Manage the 6 featured cards that appear on the homepage.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setTitle(""); setDesc(""); setLink("https://"); setDisplayUrl(""); setTags(""); setIsFeatured(true); setIsCustomCategory(false); setCategory("Website"); setCustomImageBase64(""); setCustomThumbnailBase64(""); setCompressedSizeInfo(null); setOrder(0);
            setSeoTargetedCountry("United Arab Emirates"); setSeoTargetedLocationLabel("Targeted Country"); setSeoShowTargetedLocation(true); setSeoTotalRanked(""); setSeoTop10(""); setSeoTop20(""); setSeoTop30("");
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Featured Project
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group transform-gpu will-change-transform">
              <div className="relative aspect-[16/10] bg-gray-100 border-b border-gray-100">
                {item.thumbnail || item.image ? (
                  <Image
                    src={item.thumbnail || item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={50}
                    className="object-cover object-top transform-gpu"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">No Image</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <div className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-white" />
                    Homepage Card
                  </div>
                  <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md w-fit">
                    Sequence #{index + 1}
                  </div>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                  <button
                    onClick={() => handleMoveToPortfolio(item)}
                    className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-lg shadow-md transition-colors"
                    title="Remove from Homepage (Move to Main Portfolio)"
                  >
                    <ArrowDownRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEditModal(item, index)}
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
              <div className="p-5">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{item.category}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{item.title}</h3>
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-4 truncate"
                >
                  <ExternalLink className="w-3 h-3" />
                  {item.displayUrl}
                </a>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full bg-gray-50 border border-dashed border-gray-300 rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 fill-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No homepage cards yet</h3>
              <p className="text-gray-500">Click "Add Featured Project" to set up your homepage grid.</p>
            </div>
          )}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">{editingId ? "Edit Featured Project" : "Add Featured Project"}</h2>
              <button 
                onClick={() => !isSaving && setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Project Title</label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                    placeholder="e.g. Health Point Ranchi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                  <select
                    value={isCustomCategory ? "Custom" : category}
                    onChange={(e) => {
                      if (e.target.value === "Custom") {
                        setIsCustomCategory(true);
                        setCategory("");
                      } else {
                        setIsCustomCategory(false);
                        setCategory(e.target.value);
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all mb-2"
                  >
                    <option value="Website">Website</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="CRM">CRM</option>
                    <option value="SEO">SEO</option>
                    <option value="Logo">Logo</option>
                    <option value="Graphics">Graphics</option>
                    <option value="Videos">Videos</option>
                    <option value="Custom">Custom...</option>
                  </select>
                  
                  {isCustomCategory && (
                    <input
                      required
                      type="text"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all bg-gray-50"
                      placeholder="Type custom category name..."
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Live Website Link</label>
                  <input
                    required
                    type="url"
                    value={link}
                    onChange={e => setLink(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Display URL (Clean text)</label>
                  <input
                    required
                    type="text"
                    value={displayUrl}
                    onChange={e => setDisplayUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                    placeholder="e.g. healthpointranchi.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                    placeholder="Leave empty for default (goes to bottom)"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Type 1 to make it the first card, 2 for the second card, etc. Unnumbered cards stay at the bottom.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Upload Full-Page Screenshot (Required)</label>
                  <input
                    type="file"
                    accept="image/*"
                    required={!editingId}
                    disabled={isCompressing}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          setIsCompressing(true);
                          setCompressedSizeInfo(null);
                          
                          const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                          const compressedBase64 = await compressImage(file);
                          setCustomImageBase64(compressedBase64);
                          
                          const bytes = Math.round(compressedBase64.length * 0.75);
                          let sizeStr = "";
                          if (bytes > 1024 * 1024) {
                            sizeStr = `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
                          } else {
                            sizeStr = `${(bytes / 1024).toFixed(0)} KB`;
                          }
                          
                          setCompressedSizeInfo(`Reduced from ${originalSizeMB} MB to ${sizeStr} ✅`);
                        } catch (error) {
                          console.error("Compression failed:", error);
                          alert("Failed to process the image.");
                        } finally {
                          setIsCompressing(false);
                        }
                      } else {
                        setCompressedSizeInfo(null);
                        setCustomImageBase64("");
                      }
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm"
                  />
                  <p className="text-[11px] text-gray-500 mt-1 mb-4">
                    {isCompressing ? (
                      <span className="text-blue-600 font-semibold flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Compressing image...
                      </span>
                    ) : compressedSizeInfo ? (
                      <span className="text-green-600 font-semibold">{compressedSizeInfo}</span>
                    ) : (
                      "Auto-compressed instantly in your browser to bypass Vercel limits!"
                    )}
                  </p>

                  {isFeatured && (
                    <div className="pt-2 border-t border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5 text-amber-600 flex items-center gap-1">
                        <Star className="w-3 h-3" /> Upload Homepage Thumbnail (Optional)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const compressedBase64 = await compressImage(file);
                              setCustomThumbnailBase64(compressedBase64);
                            } catch (error) {
                              console.error("Compression failed:", error);
                              alert("Failed to process thumbnail.");
                            }
                          } else {
                            setCustomThumbnailBase64("");
                          }
                        }}
                        className="w-full px-4 py-2 rounded-lg border border-amber-200 bg-amber-50 text-sm"
                      />
                      <p className="text-[11px] text-amber-700 mt-1">This will be the standard hero image displayed on the homepage, while the Full-Page Screenshot will be used on the main portfolio page.</p>
                    </div>
                  )}
                </div>
              </div>

              {category === "SEO" ? (
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 space-y-4">
                  <h3 className="font-bold text-purple-900 mb-2">SEO Specific Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-purple-800 mb-1">Targeted Location Label</label>
                      <input type="text" value={seoTargetedLocationLabel} onChange={e => setSeoTargetedLocationLabel(e.target.value)} className="w-full px-3 py-2 rounded-md border border-purple-200" placeholder="e.g. Targeted Country or Targeted City" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[13px] font-semibold text-purple-800">Location Value</label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <span className="text-[11px] font-bold text-gray-500">Active</span>
                          <input type="checkbox" checked={seoShowTargetedLocation} onChange={e => setSeoShowTargetedLocation(e.target.checked)} className="rounded border-gray-300 text-purple-600 focus:ring-purple-600" />
                        </label>
                      </div>
                      <input type="text" disabled={!seoShowTargetedLocation} value={seoTargetedCountry} onChange={e => setSeoTargetedCountry(e.target.value)} className={`w-full px-3 py-2 rounded-md border border-purple-200 ${!seoShowTargetedLocation ? 'opacity-50 bg-gray-100' : ''}`} placeholder="e.g. United Arab Emirates or Dubai" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-purple-800 mb-1">Display Category Tag (What to show on standard cards)</label>
                    <input type="text" value={seoDisplayCategory} onChange={e => setSeoDisplayCategory(e.target.value)} className="w-full px-3 py-2 rounded-md border border-purple-200" placeholder="e.g. Education Website" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-purple-800 mb-1">Total Ranked</label>
                      <input type="text" value={seoTotalRanked} onChange={e => setSeoTotalRanked(e.target.value)} className="w-full px-3 py-2 rounded-md border border-purple-200" placeholder="e.g. 67/80" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-purple-800 mb-1">Top 10 Ranked</label>
                      <input type="text" value={seoTop10} onChange={e => setSeoTop10(e.target.value)} className="w-full px-3 py-2 rounded-md border border-purple-200" placeholder="e.g. 27" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-purple-800 mb-1">Top 20 Ranked</label>
                      <input type="text" value={seoTop20} onChange={e => setSeoTop20(e.target.value)} className="w-full px-3 py-2 rounded-md border border-purple-200" placeholder="e.g. 6" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-purple-800 mb-1">Top 30 Ranked</label>
                      <input type="text" value={seoTop30} onChange={e => setSeoTop30(e.target.value)} className="w-full px-3 py-2 rounded-md border border-purple-200" placeholder="e.g. 34" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-sm font-semibold text-gray-700">Description (Text Area)</label>
                      <span className={`text-[11px] font-bold ${desc.length >= 500 ? 'text-red-500' : 'text-purple-600'}`}>
                        {desc.length} / 500 max characters (Limits to 5 lines)
                      </span>
                    </div>
                    <textarea
                      required
                      value={desc}
                      onChange={e => setDesc(e.target.value)}
                      maxLength={500}
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-lg border border-purple-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                      placeholder="Paws & Claws Pets is a trusted destination..."
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags (Comma Separated)</label>
                    <input
                      type="text"
                      value={tags}
                      onChange={e => setTags(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                      placeholder="e.g. React, Next.js, Node.js"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                    <textarea
                      required
                      value={desc}
                      onChange={e => setDesc(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                      placeholder="Project description..."
                    />
                  </div>
                </div>
              )}

              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">

                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={e => setIsFeatured(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                />
                <div>
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    Show in Featured Section (Our Website Portfolio)
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  </div>
                  <div className="text-sm text-gray-500">If you uncheck this, it will be removed from the homepage and only appear in the full portfolio.</div>
                </div>
              </label>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isCompressing}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Save Portfolio Project
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-medium animate-bounce z-50 transition-all duration-300">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
