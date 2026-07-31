"use client";

import React, { useState } from "react";
import { XCircle, Loader2 } from "lucide-react";
import { cancelBookingAction } from "@/app/actions/employee-booking";
import { useRouter } from "next/navigation";

interface CancelLRButtonProps {
  lrNumber: string;
  isCancelled?: boolean;
  variant?: "button" | "compact";
}

export function CancelLRButton({ lrNumber, isCancelled = false, variant = "button" }: CancelLRButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (isCancelled) {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs border border-red-500/20">
        <XCircle className="h-3.5 w-3.5" />
        <span>Cancelled</span>
      </span>
    );
  }

  const handleCancel = async () => {
    const reason = window.prompt(`Are you sure you want to CANCEL LR ${lrNumber}?\n\nEnter reason for cancellation (optional):`);
    if (reason === null) return; // User clicked Cancel in prompt

    setLoading(true);
    const res = await cancelBookingAction(lrNumber, reason || undefined);
    setLoading(false);

    if (res.success) {
      alert(res.message);
      router.refresh();
    } else {
      alert(res.error || "Failed to cancel LR.");
    }
  };

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={handleCancel}
        disabled={loading}
        className="px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white font-bold text-[11px] transition-colors border border-red-500/20 flex items-center space-x-1 cursor-pointer disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
        <span>Cancel</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCancel}
      disabled={loading}
      className="px-4 py-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs hover:bg-red-500 hover:text-white transition-all flex items-center space-x-1.5 border border-red-500/20 cursor-pointer disabled:opacity-50"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
      <span>Cancel LR</span>
    </button>
  );
}
