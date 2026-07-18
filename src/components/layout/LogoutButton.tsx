"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";

export function LogoutButton({ isMobile = false }: { isMobile?: boolean }) {
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await adminFetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch (err) {
      console.error("Logout failed:", err);
      // Fallback
      window.location.href = "/admin/login";
    }
  };

  if (isMobile) {
    return (
      <button
        onClick={handleLogout}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
        title="Sign Out"
      >
        <LogOut size={16} />
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-950/40 text-red-400/90 hover:text-red-400 text-xs md:text-sm font-bold transition-all duration-200 group"
    >
      <LogOut size={18} className="stroke-[2.2] group-hover:scale-110 transition-transform" />
      <span>Sign Out</span>
    </button>
  );
}
