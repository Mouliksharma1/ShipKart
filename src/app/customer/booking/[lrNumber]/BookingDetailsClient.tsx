"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LRPreview } from "@/components/lr/LRPreview";
import { ArrowLeft } from "lucide-react";
import { generateQRCodeDataUrl } from "@/lib/services/qrcode";

export default function BookingDetailsClient({ booking: b }: { booking: any }) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  useEffect(() => {
    generateQRCodeDataUrl(b.lrNumber)
      .then(setQrCodeDataUrl)
      .catch((err) => console.error("QR Error:", err));
  }, [b.lrNumber]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header Navigation */}
      <div className="flex items-center justify-between print:hidden">
        <Link
          href="/customer/history"
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-amber-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to My Bookings</span>
        </Link>
        <span className="text-xs font-mono text-slate-400">
          Official Digital LR • {b.lrNumber}
        </span>
      </div>

      {/* SINGLE REUSABLE DIGITAL LR PREVIEW WITH PRINT, PDF DOWNLOAD & WHATSAPP SHARE */}
      <LRPreview
        booking={b}
        qrCodeDataUrl={qrCodeDataUrl}
        showActions={true}
      />
    </div>
  );
}
