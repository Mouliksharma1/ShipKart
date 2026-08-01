import React from "react";
import { getLRDetailsAction } from "@/app/actions/lr";
import { LRPreview } from "@/components/lr/LRPreview";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lrNumber: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lrNumber = resolvedParams.lrNumber;
  return {
    title: `Digital LR - ${lrNumber} | POOJA TRAVELS & CARGO`,
    description: `Official Digital Lorry Receipt (Builty) ${lrNumber} powered by ShipKart & Pooja Travels & Cargo.`,
  };
}

export default async function PublicLRPage({
  params,
}: {
  params: Promise<{ lrNumber: string }>;
}) {
  const resolvedParams = await params;
  const lrNumber = resolvedParams.lrNumber;

  const result = await getLRDetailsAction(lrNumber);

  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-100">Digital LR Not Found</h1>
          <p className="text-sm text-slate-400">
            {result.error || `Digital LR document with LR Number "${lrNumber}" could not be located.`}
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to ShipKart
        </Link>
        <span className="text-[10px] sm:text-xs text-slate-500 dark:text-neutral-400 font-mono tracking-wider">
          POOJA TRAVELS & CARGO • OFFICIAL DIGITAL LR
        </span>
      </div>

      <LRPreview
        booking={result.data}
        companySettings={result.companySettings}
        qrCodeDataUrl={result.qrCodeDataUrl}
        showActions={true}
      />
    </div>
  );
}
