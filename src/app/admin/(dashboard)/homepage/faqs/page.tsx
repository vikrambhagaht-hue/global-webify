'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ArrowUp, ArrowDown, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import { getHomepageFaqs, saveHomepageFaqs } from '../actions';

export default function FaqsSettingsPage() {
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    getHomepageFaqs()
      .then((data) => {
        setFaqs(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load FAQs", err);
        setLoading(false);
      });
  }, []);

  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const moveFaq = (index: number, direction: 'up' | 'down') => {
    const newFaqs = [...faqs];
    if (direction === 'up' && index > 0) {
      [newFaqs[index], newFaqs[index - 1]] = [newFaqs[index - 1], newFaqs[index]];
    } else if (direction === 'down' && index < faqs.length - 1) {
      [newFaqs[index], newFaqs[index + 1]] = [newFaqs[index + 1], newFaqs[index]];
    }
    setFaqs(newFaqs);
  };

  const handleSave = async () => {
    setSaving(true);
    // Clean up empty questions/answers
    const cleanedFaqs = faqs.filter(faq => faq.question.trim() !== '' || faq.answer.trim() !== '');
    const res = await saveHomepageFaqs(cleanedFaqs);
    setSaving(false);
    
    if (res.success) {
      setFaqs(cleanedFaqs);
      showToast("Homepage FAQs saved successfully!");
    } else {
      showToast(`Failed to save: ${res.error || 'Unknown error'}`, 'error');
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500 font-semibold font-lexend">Loading FAQ Settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 relative">
      {toast && (
        <div className={`fixed top-4 right-4 md:top-8 md:right-8 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border ${
          toast.type === 'success' ? 'bg-[#1a8b4c] text-white border-[#15703d]' : 'bg-red-600 text-white border-red-700'
        } animate-in slide-in-from-top-2 fade-in duration-300 font-bold font-lexend`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <span className="text-sm tracking-wide">{toast.message}</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 font-lexend flex items-center gap-2">
            <HelpCircle className="text-[#1a8b4c]" /> FAQ Accordions
          </h1>
          <p className="text-sm text-gray-500 mt-1">Configure the frequently asked questions segment visible at the bottom of the homepage.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#1a8b4c] hover:bg-[#157a41] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md disabled:opacity-50 font-lexend"
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-gray-900">Manage FAQs</h2>
            <p className="text-xs text-gray-500 mt-0.5">Add, edit, or reorder frequently asked questions.</p>
          </div>
          <button
            onClick={addFaq}
            className="px-3.5 py-2 bg-green-50 text-[#1a8b4c] border border-green-200 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-green-100 transition-colors font-lexend"
          >
            <Plus size={14} /> Add FAQ
          </button>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="flex items-start gap-3 p-4 border border-gray-100 rounded-xl bg-gray-50/50 group">
              <div className="flex flex-col items-center gap-1 mt-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveFaq(index, 'up')}
                  className="text-gray-400 hover:text-[#1a8b4c] disabled:opacity-30 disabled:hover:text-gray-400 transition-colors p-1"
                  title="Move Up"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  disabled={index === faqs.length - 1}
                  onClick={() => moveFaq(index, 'down')}
                  className="text-gray-400 hover:text-[#1a8b4c] disabled:opacity-30 disabled:hover:text-gray-400 transition-colors p-1"
                  title="Move Down"
                >
                  <ArrowDown size={16} />
                </button>
              </div>
              
              <div className="flex-1 space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1 font-lexend">
                    Question #{index + 1}
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the question..."
                    value={faq.question}
                    onChange={(e) => updateFaq(index, 'question', e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2 text-sm font-semibold focus:outline-none focus:border-[#1a8b4c]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1 font-lexend">
                    Answer
                  </label>
                  <textarea
                    placeholder="Enter the answer..."
                    rows={3}
                    value={faq.answer}
                    onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#1a8b4c] resize-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeFaq(index)}
                className="text-gray-400 hover:text-red-500 transition-colors p-2 mt-4"
                title="Remove FAQ"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          
          {faqs.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
              No FAQs added yet. Click "Add FAQ" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
