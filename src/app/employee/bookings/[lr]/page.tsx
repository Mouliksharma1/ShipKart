import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { getBookingAction } from "@/app/actions/employee-booking";
import { getLRDetailsAction } from "@/app/actions/lr";
import { LRPreview } from "@/components/lr/LRPreview";
import { CancelLRButton } from "@/components/lr/CancelLRButton";

export const metadata = {
  title: "Consignment Digital LR | Pooja Travels & Cargo",
};

export default async function EmployeeBookingDetailPage({
  params,
}: {
  params: Promise<{ lr: string }>;
}) {
  const { lr } = await params;
  const res = await getLRDetailsAction(lr, true);

  if (!res.success || !res.data) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto font-bold text-xl">
            !
          </div>
          <h1 className="text-xl font-bold text-slate-100">Consignment Lookup Failed</h1>
          <p className="text-sm text-slate-400">
            {res.error || `LR record "${lr}" could not be retrieved.`}
          </p>
          <div className="pt-2">
            <Link
              href="/employee"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-amber-950 text-xs font-bold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Staff Terminal
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const booking = res.data;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-neutral-950 p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
          <Link
            href="/employee/bookings"
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-neutral-400 hover:text-amber-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Bookings</span>
          </Link>

          <div className="flex items-center space-x-3">
            <CancelLRButton lrNumber={booking.lrNumber} isCancelled={booking.status === 'CANCELLED'} />
            <Link
              href={`/employee/book?repeatLr=${booking.lrNumber}`}
              className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs hover:bg-emerald-500 hover:text-white transition-all flex items-center space-x-1.5"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Repeat Booking</span>
            </Link>
          </div>
        </div>

        {/* UNIFIED DIGITAL LR PREVIEW WITH PRINT, DOWNLOAD & WHATSAPP */}
        <LRPreview
          booking={booking}
          companySettings={res.companySettings}
          qrCodeDataUrl={res.qrCodeDataUrl}
          showActions={true}
        />
      </div>
    </main>
  );
}
