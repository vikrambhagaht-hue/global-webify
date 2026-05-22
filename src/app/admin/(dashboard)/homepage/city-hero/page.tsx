'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, XCircle, Globe, ChevronDown } from 'lucide-react';
import { getCityHeroSettings, saveCityHeroSettings } from '../actions';
import { CITIES } from '../cities';
import RichTextInlineEditor from '@/components/admin/RichTextInlineEditor';

export default function CityHeroSettingsPage() {
  const [selectedCity, setSelectedCity] = useState<string>('delhi');
  const [cityHero, setCityHero] = useState<{ title: string; description: string }>({
    title: '',
    description: ''
  });
  const [cityLoading, setCityLoading] = useState(true);
  const [citySaving, setCitySaving] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load city specific hero settings whenever selectedCity changes
  useEffect(() => {
    setCityLoading(true);
    getCityHeroSettings(selectedCity)
      .then((data) => {
        setCityHero({
          title: data?.title || '',
          description: data?.description || ''
        });
        setCityLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load city hero settings", err);
        setCityLoading(false);
      });
  }, [selectedCity]);

  const updateCityHeroField = (field: 'title' | 'description', value: string) => {
    setCityHero(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveCityHero = async () => {
    setCitySaving(true);
    const res = await saveCityHeroSettings(selectedCity, cityHero);
    setCitySaving(false);
    
    if (res.success) {
      const city = CITIES.find(c => c.key === selectedCity);
      showToast(`Hero settings for ${city ? city.name : selectedCity} saved successfully!`);
    } else {
      showToast(`Failed to save city settings: ${res.error || 'Unknown error'}`, 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 relative space-y-10">
      {toast && (
        <div className={`fixed top-4 right-4 md:top-8 md:right-8 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border ${
          toast.type === 'success' ? 'bg-[#1a8b4c] text-white border-[#15703d]' : 'bg-red-600 text-white border-red-700'
        } animate-in slide-in-from-top-2 fade-in duration-300 font-bold font-lexend`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <span className="text-sm tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 font-lexend flex items-center gap-2">
          <Globe className="text-[#1a8b4c]" /> City Landing Hero Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">Configure static Titles and Descriptions for each location-specific landing page hero banner.</p>
      </div>

      {/* City Landing Page Hero Title & Description */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 font-lexend">
              <Globe size={20} className="text-[#1a8b4c]" /> Customize City Landing Content
            </h2>
            <p className="text-xs text-gray-500 mt-1">Select a city page to edit its specific title and description text.</p>
          </div>
          
          <div className="flex items-center gap-3 self-start md:self-center">
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-white border-2 border-gray-200 text-gray-800 text-xs font-bold rounded-xl px-4 py-2.5 outline-none focus:border-[#1a8b4c] transition-all cursor-pointer font-lexend appearance-none pr-10"
              >
                {CITIES.map(c => (
                  <option key={c.key} value={c.key}>{c.name} City Page</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <ChevronDown size={14} />
              </div>
            </div>

            <button
              onClick={handleSaveCityHero}
              disabled={citySaving || cityLoading}
              className="bg-[#1a8b4c] hover:bg-[#157a41] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md disabled:opacity-50 font-lexend text-xs"
            >
              <Save size={16} /> {citySaving ? 'Saving...' : 'Save City Hero'}
            </button>
          </div>
        </div>

        {cityLoading ? (
          <div className="p-12 text-center text-gray-500 font-semibold font-lexend">
            Loading Hero configuration for {selectedCity.toUpperCase()}...
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-green-50 border-2 border-green-100 rounded-2xl flex items-start gap-3">
              <Globe className="text-[#1a8b4c] shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-xs font-extrabold text-[#1a8b4c] uppercase tracking-wider font-lexend">
                  Currently Editing: {selectedCity.toUpperCase()} Hero Content
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  Customize the title and descriptions shown on /{selectedCity} page. Highlight text in the Title to color it Brand Green.
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2 font-lexend">City Hero Title (HTML Rich Text)</label>
              <RichTextInlineEditor
                placeholder="City Hero Title..."
                value={cityHero.title}
                onChange={(val) => updateCityHeroField('title', val)}
                singleLine={true}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2 font-lexend">City Hero Description (HTML Rich Text)</label>
              <RichTextInlineEditor
                placeholder="City Hero Description..."
                value={cityHero.description}
                onChange={(val) => updateCityHeroField('description', val)}
                singleLine={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
