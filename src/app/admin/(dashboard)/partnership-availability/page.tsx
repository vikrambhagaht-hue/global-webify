"use client";

import React, { useState, useEffect } from 'react';
import { Save, Calendar, Clock, Loader2, Plus, X, CheckCircle2, ShieldAlert } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';

export default function PartnershipAvailabilityAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const [daysToShow, setDaysToShow] = useState(10);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<string[]>([]);
  
  const [newDateInput, setNewDateInput] = useState('');

  // Generate all possible time slots for the checkboxes
  const allTimeSlots: string[] = [];
  for (let h = 11; h <= 18; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 18 && m > 30) break; // Stop at 6:30 PM
      const hour12 = h > 12 ? h - 12 : h;
      const ampm = h >= 12 ? 'PM' : 'AM';
      allTimeSlots.push(`${hour12}:${m.toString().padStart(2, '0')} ${ampm}`);
    }
  }

  useEffect(() => {
    fetch('/api/partnership/availability')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setDaysToShow(data.settings.daysToShow || 10);
          setBlockedDates(data.settings.blockedDates || []);
          setBlockedTimes(data.settings.blockedTimes || []);
        }
      })
      .catch(err => {
        console.error('Failed to load settings:', err);
        triggerToast('Failed to load settings from server.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/partnership/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          daysToShow,
          blockedDates,
          blockedTimes
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerToast('Settings saved successfully!', 'success');
      } else {
        triggerToast(data.error || 'Failed to save settings.', 'error');
      }
    } catch (error) {
      console.error(error);
      triggerToast('An error occurred while saving.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddDate = () => {
    if (!newDateInput) return;
    
    // Parse YYYY-MM-DD from input[type="date"]
    // Note: input[type="date"] returns a string "YYYY-MM-DD"
    // To ensure we don't get timezone shifts, we create a date at noon
    const [year, month, day] = newDateInput.split('-').map(Number);
    const d = new Date(year, month - 1, day, 12, 0, 0);
    
    const formatted = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    
    if (!blockedDates.includes(formatted)) {
      setBlockedDates([...blockedDates, formatted]);
    }
    setNewDateInput('');
  };

  const removeDate = (dateToRemove: string) => {
    setBlockedDates(blockedDates.filter(d => d !== dateToRemove));
  };

  const toggleTime = (time: string) => {
    if (blockedTimes.includes(time)) {
      setBlockedTimes(blockedTimes.filter(t => t !== time));
    } else {
      setBlockedTimes([...blockedTimes, time]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Custom Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <m.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`fixed top-24 right-4 z-[9999] px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border font-semibold text-xs text-white ${
              toast.type === 'success' 
                ? 'bg-emerald-600 border-emerald-500 shadow-emerald-900/20' 
                : 'bg-red-600 border-red-500 shadow-red-900/20'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-white/20`}>
              {toast.type === 'success' ? <CheckCircle2 size={14} /> : <ShieldAlert size={14} />}
            </div>
            <div>
              <p className="font-black uppercase tracking-wider text-[10px] text-white/80">
                {toast.type === 'success' ? 'Success' : 'Failed'}
              </p>
              <p className="text-white mt-0.5">{toast.message}</p>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <div>
        <h1 className="text-3xl font-bold text-slate-900">Partnership Availability</h1>
        <p className="text-slate-500 mt-2">Manage the calendar schedule and availability for Franchisee/Partnership requests.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Days to Show */}
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            Calendar Window
          </h2>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Days to Show</label>
            <p className="text-xs text-slate-500 mb-2">How many days into the future can users select?</p>
            <input 
              type="number" 
              min="1" 
              max="60"
              value={daysToShow}
              onChange={(e) => setDaysToShow(parseInt(e.target.value) || 10)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg max-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
            />
          </div>
        </div>

        {/* Blocked Dates */}
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-red-500" />
            Blocked Dates (Holidays / Days Off)
          </h2>
          <p className="text-xs text-slate-500 mb-4">Add specific dates where you are completely unavailable. These dates will appear greyed out on the form.</p>
          
          <div className="flex items-center gap-3 mb-6">
            <input 
              type="date"
              value={newDateInput}
              onChange={(e) => setNewDateInput(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
            />
            <button
              onClick={handleAddDate}
              disabled={!newDateInput}
              className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              <Plus size={16} /> Add Date
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {blockedDates.length === 0 && <span className="text-sm text-slate-400 italic">No dates blocked.</span>}
            {blockedDates.map(date => (
              <div key={date} className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm font-bold">
                {date}
                <button onClick={() => removeDate(date)} className="p-0.5 hover:bg-red-200 rounded-md transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Blocked Times */}
        <div className="p-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-orange-500" />
            Blocked Times (Recurring)
          </h2>
          <p className="text-xs text-slate-500 mb-4">Select times that should be greyed out EVERY day (e.g. daily break times).</p>
          
          <div className="flex flex-wrap gap-2">
            {allTimeSlots.map(time => {
              const isBlocked = blockedTimes.includes(time);
              return (
                <button
                  key={time}
                  onClick={() => toggleTime(time)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                    isBlocked 
                      ? 'bg-red-50 text-red-600 border-red-200 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

    </div>
  );
}
