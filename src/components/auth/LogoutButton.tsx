"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { LogOut, Loader2, X, AlertTriangle, ArrowRight } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  className?: string;
  redirectTo?: string;
}

export function LogoutButton({ className, redirectTo = "/" }: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const confirmAndLogout = async () => {
    setLoading(true);
    try {
      const res = await logoutAction();
      if (res.success) {
        setShowConfirmModal(false);
        router.push(redirectTo || res.redirectTo || "/");
        router.refresh();
      }
    } catch (err) {
      console.error("Logout Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl pointer-events-auto animate-in fade-in duration-200"
      onClick={() => !loading && setShowConfirmModal(false)}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-neutral-900 border border-red-500/30 dark:border-red-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-red-600/20 space-y-6 relative animate-in zoom-in-95 duration-200 text-center flex flex-col items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* RED AMBIENT GLOW ACCENT */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-56 bg-red-600/20 dark:bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* CLOSE BUTTON */}
        <button
          onClick={() => setShowConfirmModal(false)}
          disabled={loading}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-red-500/10 dark:hover:bg-red-500/20 text-slate-400 hover:text-red-500 transition cursor-pointer disabled:opacity-50 flex items-center justify-center border border-slate-200/60 dark:border-neutral-700/60"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* CRIMSON RED BADGE & HEADER */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 via-rose-500/20 to-red-600/10 text-red-500 dark:text-red-400 flex items-center justify-center shrink-0 border border-red-500/30 shadow-xl shadow-red-500/20">
              <LogOut className="w-8 h-8 stroke-[2.2]" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
            </span>
          </div>

          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-red-500/10 dark:bg-red-500/20 border border-red-500/20 text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 mb-1.5">
              Logout Confirmation
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Are you sure?
            </h3>
          </div>
        </div>

        {/* CONFIRMATION MESSAGE BOX */}
        <div className="bg-red-500/5 dark:bg-red-500/10 p-4 rounded-2xl border border-red-500/20 text-center w-full space-y-1">
          <p className="text-xs font-semibold text-slate-700 dark:text-neutral-200 leading-relaxed">
            Do you really want to log out of your <strong className="text-red-600 dark:text-red-400 font-bold">ShipKart</strong> session?
          </p>
          <p className="text-[11px] text-slate-500 dark:text-neutral-400">
            You will need to sign back in to access staff tools or customer bookings.
          </p>
        </div>

        {/* RED ACTION BUTTONS */}
        <div className="flex items-center gap-3 pt-1 w-full">
          <button
            type="button"
            onClick={() => setShowConfirmModal(false)}
            disabled={loading}
            className="w-1/2 py-3 px-4 rounded-2xl border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 font-extrabold text-xs hover:bg-slate-100 dark:hover:bg-neutral-800 transition disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmAndLogout}
            disabled={loading}
            className="w-1/2 py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-95 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <span>Yes, Log Out</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirmModal(true)}
        disabled={loading}
        title="Sign Out / Leave Session"
        aria-label="Sign Out"
        className={`p-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center ${
          className || ""
        }`}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-red-500" />
        ) : (
          <LogOut className="h-4 w-4 stroke-[2.2]" />
        )}
      </button>

      {/* CONFIRMATION POPUP MODAL VIA PORTAL TO BODY */}
      {showConfirmModal && mounted && createPortal(modalContent, document.body)}
    </>
  );
}
