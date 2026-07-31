"use client";

import React, { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  className?: string;
  redirectTo?: string;
}

export function LogoutButton({ className, redirectTo = "/" }: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await logoutAction();
      if (res.success) {
        router.push(redirectTo || res.redirectTo || "/");
        router.refresh();
      }
    } catch (err) {
      console.error("Logout Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      title="Sign Out / Leave Session"
      aria-label="Sign Out"
      className={`p-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center ${
        className || ""
      }`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4 stroke-[2.2]" />
      )}
    </button>
  );
}
