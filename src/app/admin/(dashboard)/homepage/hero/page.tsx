'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ArrowUp, ArrowDown, Type, CheckCircle2, XCircle, Layout } from 'lucide-react';
import { getHeroTexts, saveHeroTexts, getHomepageHeroDesc, saveHomepageHeroDesc } from '../actions';
import RichTextInlineEditor from '@/features/admin/components/shared/RichTextInlineEditor';

export default function HeroSettingsPage() {
  // Global Typing Text states
  const [heroTexts, setHeroTexts] = useState<string[]>([]);
  const [homepageDesc, setHomepageDesc] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingDesc, setSavingDesc] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load global typing texts and description on mount
  useEffect(() => {
    Promise.all([getHeroTexts(), getHomepageHeroDesc()])
      .then(([texts, desc]) => {
        setHeroTexts(texts || []);
        setHomepageDesc(desc || '');
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load hero settings", err);
        setLoading(false);
      });
  }, []);

  // Handlers for typing texts
  const addHeroText = () => {
    setHeroTexts([...heroTexts, '']);
  };

  const removeHeroText = (index: number) => {
    setHeroTexts(heroTexts.filter((_, i) => i !== index));
  };

  const updateHeroText = (index: number, value: string) => {
    const newTexts = [...heroTexts];
    newTexts[index] = value;
    setHeroTexts(newTexts);
  };

  const moveHeroText = (index: number, direction: 'up' | 'down') => {
    const newTexts = [...heroTexts];
    if (direction === 'up' && index > 0) {
      [newTexts[index], newTexts[index - 1]] = [newTexts[index - 1], newTexts[index]];
    } else if (direction === 'down' && index < heroTexts.length - 1) {
      [newTexts[index], newTexts[index + 1]] = [newTexts[index + 1], newTexts[index]];
    }
    setHeroTexts(newTexts);
  };

  const handleSaveTypingTexts = async () => {
    setSaving(true);
    const cleanedHeroTexts = heroTexts.filter(t => t.trim() !== '');
    const res = await saveHeroTexts(cleanedHeroTexts);
    setSaving(false);
    
    if (res.success) {
      setHeroTexts(cleanedHeroTexts);
      showToast("Hero typing texts saved successfully!");
    } else {
      showToast(`Failed to save typing texts: ${res.error || 'Unknown error'}`, 'error');
    }
  };

  const handleSaveHomepageDesc = async () => {
    setSavingDesc(true);
    const res = await saveHomepageHeroDesc(homepageDesc);
    setSavingDesc(false);
    
    if (res.success) {
      showToast("Homepage hero description saved successfully!");
    } else {
      showToast(`Failed to save homepage description: ${res.error || 'Unknown error'}`, 'error');
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500 font-semibold font-poppins">Loading Hero Settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 relative space-y-10">
      {toast && (
        <div className={`fixed top-4 right-4 md:top-8 md:right-8 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border ${
          toast.type === 'success' ? 'bg-[#1a8b4c] text-white border-[#15703d]' : 'bg-red-600 text-white border-red-700'
        } animate-in slide-in-from-top-2 fade-in duration-300 font-bold font-poppins`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <span className="text-sm tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-950 font-poppins flex items-center gap-2">
          <Type className="text-[#1a8b4c]" /> Hero Banner Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">Configure typing texts and descriptions for your main root homepage hero banner.</p>
      </div>

      {/* SECTION 1: Typing Text Settings */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-905 flex items-center gap-2 font-poppins">
              <Layout size={20} className="text-[#1a8b4c]" /> Main Homepage Typing Phrases
            </h2>
            <p className="text-xs text-gray-500 mt-1">These phrases show one by one sequentially with a typing effect on the root homepage main banner.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={addHeroText}
              className="px-3.5 py-2 bg-green-50 text-[#1a8b4c] border border-[#BBE3CB] rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-green-100 transition-colors font-poppins"
            >
              <Plus size={14} /> Add Phrase
            </button>
            <button
              onClick={handleSaveTypingTexts}
              disabled={saving}
              className="bg-[#1a8b4c] hover:bg-[#157a41] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50 font-poppins"
            >
              <Save size={14} /> {saving ? 'Saving...' : 'Save Phrases'}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {heroTexts.map((text, index) => (
            <div key={index} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl bg-gray-50/50 group">
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveHeroText(index, 'up')}
                  className="text-gray-400 hover:text-[#1a8b4c] disabled:opacity-30 disabled:hover:text-gray-400 transition-colors p-1"
                  title="Move Up"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  disabled={index === heroTexts.length - 1}
                  onClick={() => moveHeroText(index, 'down')}
                  className="text-gray-400 hover:text-[#1a8b4c] disabled:opacity-30 disabled:hover:text-gray-400 transition-colors p-1"
                  title="Move Down"
                >
                  <ArrowDown size={16} />
                </button>
              </div>
              
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter typing text phrase (max 65 chars)..."
                  value={text}
                  maxLength={65}
                  onChange={(e) => updateHeroText(index, e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#1a8b4c]"
                />
                <div className="text-right mt-1">
                  <span className={`text-[10px] font-medium ${text.length > 55 ? 'text-red-500' : 'text-gray-400'}`}>
                    {text.length}/65 characters (Optimal length to prevent layout gap)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeHeroText(index)}
                className="text-gray-400 hover:text-red-500 transition-colors p-2.5"
                title="Remove Text"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          
          {heroTexts.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
              No typing texts added yet. Click "Add Phrase" to create one.
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: Homepage Hero Description */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 font-poppins">
              <Layout size={20} className="text-[#1a8b4c]" /> Main Homepage Description
            </h2>
            <p className="text-xs text-gray-500 mt-1">Customize the description sentence displayed under the typing banner on the main homepage.</p>
          </div>
          <button
            onClick={handleSaveHomepageDesc}
            disabled={savingDesc}
            className="bg-[#1a8b4c] hover:bg-[#157a41] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md disabled:opacity-50 font-poppins text-xs"
          >
            <Save size={16} /> {savingDesc ? 'Saving...' : 'Save Description'}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2 font-poppins">Homepage Description (HTML Rich Text)</label>
            <RichTextInlineEditor
              placeholder="Main homepage hero description..."
              value={homepageDesc}
              onChange={(val) => setHomepageDesc(val)}
              singleLine={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
