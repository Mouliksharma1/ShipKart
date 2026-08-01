"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyLRPhoneAction } from "@/app/actions/lr";
import {
  FileText,
  Lock,
  X,
  ShieldCheck,
  AlertOctagon,
  Loader2,
  Phone,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

interface DigitalLRVerificationModalProps {
  lrNumber: string;
  status?: string;
}

export function DigitalLRVerificationModal({
  lrNumber,
  status,
}: DigitalLRVerificationModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{
    text: string;
    type: "error" | "cancelled" | "success";
  } | null>(null);

  // Auto hide toast after 6 seconds
  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => {
        setToastMsg(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  const handleOpenModal = () => {
    // Reset state on modal open
    setPhone("");
    setErrorMsg(null);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setErrorMsg(null);
    setPhone("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const clean = phone.replace(/\D/g, "");
    if (clean.length < 10) {
      const msg = "Please enter a valid 10-digit mobile number.";
      setErrorMsg(msg);
      setToastMsg({ text: msg, type: "error" });
      return;
    }

    setLoading(true);

    try {
      const res = await verifyLRPhoneAction(lrNumber, phone);

      if (!res.success) {
        const message = res.error || "Verification failed. Please try again.";
        setErrorMsg(message);
        setToastMsg({
          text: message,
          type: res.isCancelled ? "cancelled" : "error",
        });
        setLoading(false);
        return;
      }

      setToastMsg({
        text: "Verification successful! Redirecting to Digital LR...",
        type: "success",
      });

      // Redirect user to the 12-char/alphanumeric Digital LR page
      setTimeout(() => {
        router.push(res.targetUrl!);
      }, 400);
    } catch (err: any) {
      console.error("Verification error:", err);
      const msg = "Something went wrong. Please try again.";
      setErrorMsg(msg);
      setToastMsg({ text: msg, type: "error" });
      setLoading(false);
    }
  };

  return (
    <>
      {/* FLOATING TOAST NOTIFICATION CONTAINER */}
      {toastMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[92vw] sm:w-full animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
          <div
            className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md transition-all ${
              toastMsg.type === "cancelled"
                ? "bg-rose-950/95 text-rose-100 border-rose-600/80 shadow-rose-950/50"
                : toastMsg.type === "error"
                ? "bg-amber-950/95 text-amber-100 border-amber-500/80 shadow-amber-950/50"
                : "bg-emerald-950/95 text-emerald-100 border-emerald-500/80 shadow-emerald-950/50"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                toastMsg.type === "cancelled"
                  ? "bg-rose-500/20 text-rose-400"
                  : toastMsg.type === "error"
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-emerald-500/20 text-emerald-400"
              }`}
            >
              {toastMsg.type === "cancelled" ? (
                <AlertOctagon className="w-5 h-5" />
              ) : toastMsg.type === "error" ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 pr-2">
              <h4
                className={`text-xs font-black uppercase tracking-wider ${
                  toastMsg.type === "cancelled"
                    ? "text-rose-400"
                    : toastMsg.type === "error"
                    ? "text-amber-400"
                    : "text-emerald-400"
                }`}
              >
                {toastMsg.type === "cancelled"
                  ? "LR Status Notification"
                  : toastMsg.type === "error"
                  ? "Access Denied"
                  : "Verified"}
              </h4>
              <p className="text-xs font-semibold leading-snug mt-0.5">
                {toastMsg.text}
              </p>
            </div>

            <button
              onClick={() => setToastMsg(null)}
              className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TRIGGER BUTTON */}
      <button
        type="button"
        onClick={handleOpenModal}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer"
      >
        <FileText className="w-4 h-4 stroke-[2.5]" />
        View Digital LR
      </button>

      {/* MODAL DIALOG */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={handleCloseModal}
              disabled={loading}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 flex items-center justify-center text-slate-500 dark:text-neutral-400 transition"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* HEADER */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Security Verification
                </h3>
                <p className="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-wide uppercase">
                  Digital LR Access • {lrNumber}
                </p>
              </div>
            </div>

            {/* DESCRIPTION */}
            <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed bg-slate-50 dark:bg-neutral-950 p-3.5 rounded-2xl border border-slate-200/80 dark:border-neutral-800">
              To view the official <strong>Digital LR (Builty)</strong>, please verify your identity by entering either the <strong>Sender</strong> or <strong>Receiver</strong> registered mobile number.
            </p>

            {/* INLINE ERROR ALERT BOX */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-start gap-2.5">
                <AlertOctagon className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <span className="leading-snug">{errorMsg}</span>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-neutral-300">
                  Mobile Number (Sender or Receiver)
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500 font-mono text-xs font-bold border-r border-slate-200 dark:border-neutral-700 pr-2.5">
                    <Phone className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                    +91
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={13}
                    disabled={loading}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full pl-24 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 text-sm font-bold font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition disabled:opacity-50"
                  />
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={loading}
                  className="w-1/2 py-3 px-4 rounded-2xl border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-neutral-800 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-amber-950 font-black text-xs transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify & View
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
