"use client";

import React, { useEffect, useState } from "react";
import { getGlobalContactInfo, saveGlobalContactInfo, GlobalContactInfoData } from "@/app/admin/(dashboard)/homepage/actions";
import { Phone, MessageCircle, Mail, MapPin, Save, CheckCircle2, AlertCircle, Share2, Globe, HelpCircle } from "lucide-react";

export default function AdminContactInfoPage() {
  const [formData, setFormData] = useState<GlobalContactInfoData>({
    phone: "+91 75639 01100",
    phone2: "1800-890-5489",
    usOfficePhone: "+1 9175908135",
    whatsapp: "917563901100",
    email: "help@globalwebify.com",
    address: "2nd Floor, Alam Complex, Ashok Nagar Road, Kadru, Ranchi, Jharkhand, India-834002",
    address2: "36/1E/1L, Topsia Road, Panchannagram, Kolkata, Pin - 700039, West Bengal, India.",
    mapQuery: "https://www.google.com/maps/place/Global+Webify/@23.3495578,85.3086946,17z/data=!3m1!5s0x39f4e0528e2c8fa7:0xf0b8c1d5d5dbe41a!4m6!3m5!1s0x39f4e195a816671d:0xa9ebf12893abb828!8m2!3d23.3496601!4d85.3104862!16s%2Fg%2F11wbvkw_tm?entry=ttu&g_ep=EgoyMDI2MDYyOC4wIKXMDSoASAFQAw%3D%3D",
    socials: {
      facebook: "https://www.facebook.com/global.webify",
      twitter: "https://x.com/globalwebify",
      linkedin: "https://www.linkedin.com/company/global-webify/",
      instagram: "https://www.instagram.com/global.webify/",
      youtube: "https://www.youtube.com/@globalwebify"
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingMap, setUploadingMap] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    getGlobalContactInfo().then((data) => {
      setFormData(data);
      setLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("social_")) {
      const socialKey = name.replace("social_", "") as keyof NonNullable<GlobalContactInfoData["socials"]>;
      setFormData((prev) => ({
        ...prev,
        socials: {
          ...(prev.socials || {
            facebook: "",
            twitter: "",
            linkedin: "",
            instagram: "",
            youtube: ""
          }),
          [socialKey]: value
        }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await saveGlobalContactInfo(formData);
      if (res.success) {
        setStatusMessage({ type: "success", text: "Settings updated successfully!" });
      } else {
        setStatusMessage({ type: "error", text: res.error || "Failed to update settings." });
      }
    } catch (err) {
      setStatusMessage({ type: "error", text: "An unexpected error occurred." });
    } finally {
      setSaving(false);
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 font-sans pb-24">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <span className="p-3 bg-green-50 text-green-600 rounded-2xl">
              <Phone className="w-6 h-6" />
            </span>
            Global Contact, TopBar & Social Settings
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Manage your header TopBar contact numbers, toll-free number, WhatsApp link, office coordinates/map, and social media links.
          </p>
        </div>

        {/* Floating Toast Notification */}
        {statusMessage && (
          <div className="fixed top-24 right-8 z-[100] animate-in slide-in-from-right-5 fade-in duration-300">
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg border ${
              statusMessage.type === 'success' 
                ? 'bg-green-600 border-green-700 text-white' 
                : 'bg-red-500 border-red-600 text-white'
            }`}>
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-white" />
              ) : (
                <AlertCircle className="w-4 h-4 text-white" />
              )}
              <span className="font-medium text-sm tracking-wide">{statusMessage.text}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* SECTION 1: TOPBAR & GENERAL CONTACT */}
          <div className="space-y-6 bg-gray-50/60 p-6 rounded-2xl border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
              <Phone className="w-5 h-5 text-green-600" />
              TopBar Phone Numbers & Email
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone 1 */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800">
                  Primary Phone Number (TopBar Phone 1)
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 7563901100"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition font-medium"
                  required
                />
                <p className="text-xs text-gray-400">Displayed first on TopBar & contact buttons</p>
              </div>

              {/* Phone 2 */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800">
                  Toll-Free / Secondary Phone (TopBar Phone 2)
                </label>
                <input
                  type="text"
                  name="phone2"
                  value={formData.phone2 || ""}
                  onChange={handleChange}
                  placeholder="1800-890-5489"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition font-medium"
                />
              </div>

              {/* US Office Phone */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-bold text-gray-800">
                  US Office Phone (Displayed in Footer)
                </label>
                <input
                  type="text"
                  name="usOfficePhone"
                  value={formData.usOfficePhone || ""}
                  onChange={handleChange}
                  placeholder="+1 9175908135"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition font-medium"
                />
                <p className="text-xs text-gray-400">Displayed in Footer Get In Touch section</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* WhatsApp */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-500" />
                  WhatsApp Chat Number (wa.me)
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="917563901100"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition font-medium"
                  required
                />
                <p className="text-xs text-gray-500">Enter your 10-digit mobile number (e.g. 7563901100) or with country code (917563901100). The system automatically prepends 91 for WhatsApp links!</p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  Official Email Address (TopBar Email)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="help@globalwebify.com"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition font-medium"
                  required
                />
                <p className="text-xs text-gray-400">Displayed on TopBar & contact pages</p>
              </div>
            </div>
          </div>

          {/* SECTION 2: MAP LOCATION & ADDRESS */}
          <div className="space-y-6 bg-gray-50/60 p-6 rounded-2xl border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
              <MapPin className="w-5 h-5 text-red-500" />
              Office Location & Google Map Optimization
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 flex items-center justify-between">
                  <span>Google Map Coordinates or Embed URL / Query</span>
                  <span className="text-xs font-normal text-green-700 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Memoized & Auto-Optimized
                  </span>
                </label>
                <input
                  type="text"
                  name="mapQuery"
                  value={formData.mapQuery || ""}
                  onChange={handleChange}
                  placeholder="https://www.google.com/maps/place/Global+Webify/..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition font-medium text-sm"
                />
                <div className="bg-amber-50/90 p-5 rounded-2xl border border-amber-200/80 text-[13px] text-amber-900 space-y-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="leading-relaxed w-full">
                      <strong className="text-[14px] text-amber-950 block mb-2">⚠️ Important: How to get the correct Map URL</strong>
                      <ul className="space-y-2 list-disc list-outside ml-4">
                        <li><strong>Always do a FRESH search:</strong> Type the location name in the Google Maps search bar and press Enter. Alternatively, Right-click anywhere to &quot;Drop a pin&quot;.</li>
                        <li><strong>Never just drag the map!</strong> If you only drag the map without a fresh search, the URL will still contain data of the previous location.</li>
                        <li><strong className="text-red-700">DO NOT use the "Share" button short URL (maps.app.goo.gl)!</strong> Google blocks short URLs from loading on websites. Always copy the <strong>FULL URL</strong> from the top address bar of your browser.</li>
                      </ul>

                      <div className="mt-4 p-3 bg-white/60 rounded-xl border border-amber-200/60">
                        <strong className="text-amber-950 block mb-1">📌 Why is the Business Name missing on the map?</strong>
                        <p className="text-[12px] text-amber-800">
                          By design, this live map only shows the exact red pin coordinates and intentionally hides the bulky white Google &quot;Place Card&quot; to keep your website looking clean and premium. <strong>If you want to show your business name and reviews beautifully</strong>, take a screenshot of Google Maps from your PC and upload it in <strong>Option B</strong> below!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* OPTION B: CUSTOM MAP SCREENSHOT */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <label className="block text-sm font-bold text-gray-800 flex items-center justify-between">
                  <span>Option B: Custom Map Screenshot (Highly Recommended)</span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-widest">
                    Best Visuals
                  </span>
                </label>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Upload a screenshot of your map location with your business name clearly visible. If uploaded, this image will be shown instead of the Google Maps iframe. This makes your website <strong>load 10x faster</strong>, looks perfectly clean, and clicking it will still open the live Google Map in a new tab!
                </p>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingMap}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setStatusMessage(null);
                      setUploadingMap(true);
                      const uploadData = new FormData();
                      uploadData.append('file', file);
                      
                      try {
                        const res = await fetch('/api/upload', {
                          method: 'POST',
                          body: uploadData,
                        });
                        const data = await res.json();
                        if (data.success) {
                          setFormData(prev => ({ ...prev, mapScreenshotUrl: data.url }));
                          setStatusMessage({ type: 'success', text: 'Map screenshot uploaded! Don\'t forget to click Save at the bottom.' });
                        } else {
                          setStatusMessage({ type: 'error', text: 'Image upload failed: ' + data.message });
                        }
                      } catch (err) {
                        setStatusMessage({ type: 'error', text: 'Error uploading image.' });
                      } finally {
                        setUploadingMap(false);
                      }
                    }}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer file:cursor-pointer disabled:opacity-50 transition-colors"
                  />
                  {uploadingMap && (
                    <div className="flex items-center gap-2 text-indigo-600 shrink-0 bg-indigo-50 px-3 py-1.5 rounded-full text-xs font-bold animate-pulse border border-indigo-100">
                      <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </div>
                  )}
                  {formData.mapScreenshotUrl && !uploadingMap && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-indigo-100 shrink-0 relative shadow-sm group">
                      <img src={formData.mapScreenshotUrl} alt="Map Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <button 
                        type="button" 
                        onClick={() => setFormData(prev => ({ ...prev, mapScreenshotUrl: undefined }))}
                        className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-[14px] font-black shadow-md hover:bg-red-600 transition-colors"
                        title="Remove Image"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-6 border-t border-gray-100">
                <label className="block text-sm font-bold text-gray-800">
                  Primary Office Address (Ranchi / Main Office)
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  placeholder="2nd Floor, Alam Complex, Ashok Nagar Road, Kadru, Ranchi, Jharkhand, India-834002"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition font-medium resize-none"
                  required
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-sm font-bold text-gray-800">
                  Secondary Office Address (Kolkata Office / Branch)
                </label>
                <textarea
                  name="address2"
                  value={formData.address2 || ""}
                  onChange={handleChange}
                  rows={2}
                  placeholder="36/1E/1L, Topsia Road, Panchannagram, Kolkata, Pin - 700039, West Bengal, India."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition font-medium resize-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2.5: INTERNATIONAL BRANCHES */}
          <div className="space-y-6 bg-emerald-50/60 p-6 rounded-2xl border border-emerald-100">
            <h2 className="text-lg font-bold text-emerald-900 flex items-center gap-2 border-b border-emerald-200 pb-3">
              <Globe className="w-5 h-5 text-emerald-600" />
              International Branches (Optional)
            </h2>
            <p className="text-xs text-emerald-700 font-medium">Leave these blank if you want to hide the US Branch or Dubai Partner sections on the Contact Us and Booking pages.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* US Branch */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-800">US Branch Address</label>
                  <textarea
                    name="usOfficeAddress"
                    value={formData.usOfficeAddress || ""}
                    onChange={handleChange}
                    rows={2}
                    placeholder="473 Mundet Place, Ste US&#10;Hillside, NJ 07205"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition font-medium resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-800">US Branch Phone</label>
                  <input
                    type="text"
                    name="usOfficePhone"
                    value={formData.usOfficePhone || ""}
                    onChange={handleChange}
                    placeholder="+1 9175908135"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition font-medium"
                  />
                </div>
              </div>

              {/* Dubai Partner */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-800">Dubai Partner Address</label>
                  <textarea
                    name="dubaiOfficeAddress"
                    value={formData.dubaiOfficeAddress || ""}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Office 18, 2nd Floor&#10;Aspin Commercial Tower"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition font-medium resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-800">Dubai Partner Phone</label>
                  <input
                    type="text"
                    name="dubaiOfficePhone"
                    value={formData.dubaiOfficePhone || ""}
                    onChange={handleChange}
                    placeholder="+97 150 846 1253"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6 bg-gray-50/60 p-6 rounded-2xl border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
              <Share2 className="w-5 h-5 text-indigo-600" />
              Social Media Links
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800">Facebook Page URL</label>
                <input
                  type="url"
                  name="social_facebook"
                  value={formData.socials?.facebook || ""}
                  onChange={handleChange}
                  placeholder="https://www.facebook.com/global.webify"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800">Twitter / X URL</label>
                <input
                  type="url"
                  name="social_twitter"
                  value={formData.socials?.twitter || ""}
                  onChange={handleChange}
                  placeholder="https://x.com/globalwebify"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800">LinkedIn Company Page URL</label>
                <input
                  type="url"
                  name="social_linkedin"
                  value={formData.socials?.linkedin || ""}
                  onChange={handleChange}
                  placeholder="https://www.linkedin.com/company/global-webify/"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800">Instagram Profile URL</label>
                <input
                  type="url"
                  name="social_instagram"
                  value={formData.socials?.instagram || ""}
                  onChange={handleChange}
                  placeholder="https://www.instagram.com/global.webify/"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition font-medium"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-bold text-gray-800">YouTube Channel URL</label>
                <input
                  type="url"
                  name="social_youtube"
                  value={formData.socials?.youtube || ""}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/@globalwebify"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition font-medium"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end sticky bottom-6 z-30">
            <button
              type="submit"
              disabled={saving}
              className="px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-green-600/25 hover:shadow-green-600/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center gap-3"
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving All Settings..." : "Save All Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
