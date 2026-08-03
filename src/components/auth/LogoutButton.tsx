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
    }, 180);
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
    <>
      {/* Scoped keyframe animations */}
      <style>{`
        @keyframes logout-backdrop-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes logout-backdrop-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes logout-modal-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes logout-modal-out {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.92) translateY(12px);
          }
        }
        @keyframes logout-pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.35); opacity: 0; }
        }
        @keyframes logout-icon-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes logout-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div
        style={{
          animation: isClosing
            ? "logout-backdrop-out 180ms ease-in forwards"
            : "logout-backdrop-in 250ms ease-out forwards",
        }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-auto"
        onClick={closeModal}
      >
        {/* Backdrop layers */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-red-950/30 via-transparent to-transparent" />

        {/* Modal card */}
        <div
          style={{
            animation: isClosing
              ? "logout-modal-out 180ms ease-in forwards"
              : "logout-modal-in 320ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
          className="relative w-full max-w-[420px] rounded-[28px] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Card background with subtle grain */}
          <div className="absolute inset-0 bg-white dark:bg-[#111] border border-slate-200/80 dark:border-white/[0.06] rounded-[28px]" />

          {/* Ambient glow at top */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/15 dark:bg-red-500/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative p-7 sm:p-8 flex flex-col items-center text-center gap-5">
            {/* Close button */}
            <button
              onClick={closeModal}
              disabled={loading}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-white/[0.06] hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 cursor-pointer disabled:opacity-40 flex items-center justify-center group"
              aria-label="Close dialog"
            >
              <X className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-90" />
            </button>

            {/* Icon badge */}
            <div className="relative mt-1">
              {/* Pulse ring */}
              <div
                style={{ animation: "logout-pulse-ring 2.5s ease-in-out infinite" }}
                className="absolute inset-0 rounded-full border-2 border-red-500/40"
              />
              <div
                style={{ animation: "logout-icon-breathe 3s ease-in-out infinite" }}
                className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-xl shadow-red-500/25"
              >
                <LogOut className="w-8 h-8 text-white stroke-[2]" />
              </div>
            </div>

            {/* Title section */}
            <div className="space-y-1.5">
              <span className="inline-block px-3 py-1 rounded-full bg-red-500/10 dark:bg-red-500/15 border border-red-500/20 text-[10px] font-bold uppercase tracking-[0.15em] text-red-600 dark:text-red-400">
                Session Logout
              </span>
              <h3 className="text-[22px] sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Are you sure?
              </h3>
            </div>

            {/* Info card */}
            <div className="w-full rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.06] p-4 space-y-2">
              <p className="text-[13px] font-medium text-slate-700 dark:text-neutral-200 leading-relaxed">
                Do you really want to log out of your{" "}
                <strong className="text-red-600 dark:text-red-400 font-bold">ShipKart</strong>{" "}
                session?
              </p>
              <p className="text-xs text-slate-500 dark:text-neutral-500 leading-relaxed">
                You&apos;ll need to sign back in to access staff tools or customer bookings.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 w-full pt-1">
              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.06] text-slate-700 dark:text-neutral-300 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-white/[0.1] active:scale-[0.97] transition-all duration-200 disabled:opacity-40 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAndLogout}
                disabled={loading}
                className="flex-1 relative py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:scale-[0.97] text-white font-bold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-red-600/25 hover:shadow-red-500/40 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer overflow-hidden group"
              >
                {/* Shimmer effect on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                    animation: "logout-shimmer 1.5s ease-in-out infinite",
                  }}
                />
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Logging out…</span>
                  </>
                ) : (
                  <>
                    <span>Yes, Log Out</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
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

