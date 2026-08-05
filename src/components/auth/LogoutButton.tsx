"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { LogOut, Loader2, X, ArrowRight } from "lucide-react";
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
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Lock body scroll when modal is open */
  useEffect(() => {
    if (showConfirmModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showConfirmModal]);

  const closeModal = useCallback(() => {
    if (loading) return;
    setIsClosing(true);
    setTimeout(() => {
      setShowConfirmModal(false);
      setIsClosing(false);
    }, 150);
  }, [loading]);

  /* Close on Escape key */
  useEffect(() => {
    if (!showConfirmModal) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showConfirmModal, closeModal]);

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
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-150 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      onClick={closeModal}
    >
      {/* Simple Dark Overlay without Blur */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Clean & Simple Modal Card */}
      <div
        className="relative w-full max-w-[400px] rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-2xl p-6 space-y-5 transition-transform duration-150 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          disabled={loading}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 dark:text-neutral-500 hover:text-slate-700 dark:hover:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-40"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-200 dark:border-red-900/50">
            <LogOut className="w-7 h-7 stroke-[2.2]" />
          </div>

          <div className="space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-[10px] font-black uppercase tracking-wider">
              Session Logout
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Are you sure?
            </h3>
          </div>

          <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed max-w-xs">
            Do you really want to log out of your <strong className="text-slate-900 dark:text-white font-bold">ShipKart</strong> session? You&apos;ll need to sign back in to access customer or staff features.
          </p>
        </div>

        {/* Simple Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={closeModal}
            disabled={loading}
            className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-neutral-700 active:scale-[0.98] transition-all disabled:opacity-40 cursor-pointer text-center"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={confirmAndLogout}
            disabled={loading}
            className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md active:scale-[0.98] transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Logging out…</span>
              </>
            ) : (
              <>
                <span>Yes, Log Out</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
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
