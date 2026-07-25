"use client";

import React, { useState, useRef } from "react";
import { LRTemplate, LRTemplateProps } from "@/components/lr/LRTemplate";
import { generateLRPDF } from "@/lib/services/lr-pdf";
import { Printer, Download, Share2, Copy, Check, ExternalLink } from "lucide-react";

export type LRPreviewProps = LRTemplateProps & {
  showActions?: boolean;
};

export const LRPreview: React.FC<LRPreviewProps> = ({
  booking,
  companySettings,
  qrCodeDataUrl,
  showActions = true,
}) => {
  const printableRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "https://shipkart.in";

  const publicLrUrl = `${baseUrl}/lr/${booking.lrNumber}`;
  const publicTrackingUrl = `${baseUrl}/track/${booking.lrNumber}`;

  // PRINT HANDLER
  const handlePrint = () => {
    window.print();
  };

  // DOWNLOAD PDF HANDLER
  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPdf(true);
      const blob = await generateLRPDF(booking, companySettings);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ShipKart_Digital_LR_${booking.lrNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF Download Error:", err);
      alert("Failed to download PDF. Please try printing or viewing online.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // COPY LINK HANDLER
  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicLrUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // WHATSAPP MESSAGE FORMATTER
  const generateWhatsAppMessage = () => {
    return (
      `*POOJA TRAVELS & CARGO*\n` +
      `*Booking Successful*\n\n` +
      `*LR Number:* ${booking.lrNumber}\n` +
      `*Status:* ${booking.status.replace(/_/g, " ")}\n` +
      `*Route:* ${booking.originOffice.name} → ${booking.destinationOffice.name}\n` +
      `*Grand Total:* ₹${booking.totalAmount.toFixed(2)} (${booking.paymentType})\n\n` +
      `*Track Parcel:* ${publicTrackingUrl}\n` +
      `*Download Digital LR:* ${publicLrUrl}\n\n` +
      `*Helpline:* 6350603414 | 7852091119 | 0291-2651955\n` +
      `Thank You.`
    );
  };

  const getWhatsAppShareLink = (phone?: string) => {
    const encodedMsg = encodeURIComponent(generateWhatsAppMessage());
    if (phone) {
      // Remove spaces, dashes, plusses and ensure 91 prefix for Indian numbers
      let cleanPhone = phone.replace(/\D/g, "");
      if (cleanPhone.length === 10) {
        cleanPhone = "91" + cleanPhone;
      }
      return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
    }
    return `https://wa.me/?text=${encodedMsg}`;
  };

  return (
    <div className="space-y-6">
      {/* ACTIONS BAR */}
      {showActions && (
        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-lg border border-slate-800 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-sm tracking-wide">
              Digital LR: <span className="font-mono text-blue-300">{booking.lrNumber}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* PRINT BUTTON */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold transition border border-slate-700 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-blue-400" />
              Print LR
            </button>

            {/* DOWNLOAD PDF BUTTON */}
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 disabled:bg-blue-900 text-white text-xs font-semibold transition shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4 text-blue-200" />
              {isGeneratingPdf ? "Generating PDF..." : "Download PDF"}
            </button>

            {/* WHATSAPP SHARE BUTTON */}
            <button
              onClick={() => setShowWhatsAppModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow-xs cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              Share WhatsApp
            </button>

            {/* COPY LINK BUTTON */}
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700 cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  Copy LR Link
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* WHATSAPP MODAL */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 print:hidden">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Share Digital LR via WhatsApp
              </h3>
              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="text-slate-400 hover:text-white font-bold px-2 py-1 rounded text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Select recipient to send the pre-formatted LR receipt & live tracking link:
            </p>

            <div className="space-y-2 pt-1">
              {/* SENDER BUTTON */}
              <a
                href={getWhatsAppShareLink(booking.senderPhone)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-emerald-900/40 border border-slate-700 hover:border-emerald-500/50 transition group"
              >
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-emerald-400">
                    Send to Sender (Consignor)
                  </div>
                  <div className="text-xs text-slate-400">{booking.senderName} ({booking.senderPhone})</div>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-400" />
              </a>

              {/* RECEIVER BUTTON */}
              <a
                href={getWhatsAppShareLink(booking.receiverPhone)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-emerald-900/40 border border-slate-700 hover:border-emerald-500/50 transition group"
              >
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-emerald-400">
                    Send to Receiver (Consignee)
                  </div>
                  <div className="text-xs text-slate-400">{booking.receiverName} ({booking.receiverPhone})</div>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-400" />
              </a>

              {/* BOTH / ANY RECIPIENT */}
              <a
                href={getWhatsAppShareLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 border border-emerald-600 transition group text-white font-semibold text-sm"
              >
                <span>Share via WhatsApp (Choose Contact)</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-mono whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto">
              {generateWhatsAppMessage()}
            </div>

            <button
              onClick={() => setShowWhatsAppModal(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-semibold text-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* SINGLE REUSABLE LR TEMPLATE CONTAINER */}
      <LRTemplate
        booking={booking}
        companySettings={companySettings}
        qrCodeDataUrl={qrCodeDataUrl}
        printableRef={printableRef}
      />
    </div>
  );
};
