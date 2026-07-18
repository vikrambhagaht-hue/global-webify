"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Lock, User, RefreshCw } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Force fully reload/redirect to main admin dashboard
        router.refresh();
        router.push('/admin');
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gray-950 font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#1a8b4c]/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-900/10 blur-[150px] pointer-events-none" />

      <div className="w-full max-w-[420px] mx-4 relative z-10">
        <div className="bg-gray-900/80 backdrop-blur-md rounded-[32px] p-8 md:p-10 border border-gray-800 shadow-2xl text-center">
          
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white flex items-center justify-center p-1.5 mx-auto mb-6 shadow-lg shadow-[#1a8b4c]/10 border border-gray-800">
            <img src="/global_webify_logo.png" alt="GlobalWebify Logo" className="w-full h-full object-contain" />
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight mb-2 uppercase font-poppins">
            Admin CMS Panel
          </h1>
          <p className="text-gray-400 text-xs font-semibold tracking-wider uppercase mb-8">
            GlobalWebify Management Console
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-950/50 border border-red-800/50 text-red-400 rounded-2xl text-xs font-bold flex items-center gap-2.5 text-left">
              <ShieldAlert size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5 text-left">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-xs md:text-sm font-semibold text-white placeholder-gray-600 focus:outline-none focus:border-[#1a8b4c] transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-xs md:text-sm font-semibold text-white placeholder-gray-600 focus:outline-none focus:border-[#1a8b4c] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a8b4c] hover:bg-[#15703d] text-white font-black py-4 rounded-xl shadow-lg shadow-[#1a8b4c]/10 hover:shadow-[#1a8b4c]/20 hover:translate-y-[-1px] active:translate-y-[0px] transition-all flex items-center justify-center gap-2 text-xs tracking-wider uppercase mt-4 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
