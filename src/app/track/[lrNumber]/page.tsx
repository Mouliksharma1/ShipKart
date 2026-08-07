import React from "react";
import { getTrackingTimelineAction } from "@/app/actions/tracking";
import { TrackingTimeline } from "@/components/tracking/TrackingTimeline";
import { StatusBadge } from "@/components/tracking/StatusBadge";
import { DigitalLRVerificationModal } from "@/components/tracking/DigitalLRVerificationModal";
import { Metadata } from "next";
import Link from "next/link";
import {
  PackageCheck,
  MapPin,
  Clock,
  Building2,
  CheckCircle2,
  ShieldCheck,
  FileText,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import { redirect } from "next/navigation";

import { SITE_URL } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lrNumber: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lr = decodeURIComponent(resolvedParams.lrNumber).toUpperCase();

  return {
    title: `Track Parcel ${lr}`,
    description: `Track parcel ${lr} in real time with ShipKart – POOJA TRAVELS & CARGO. View current status, dispatch history, and estimated delivery.`,
    alternates: { canonical: `${SITE_URL}/track/${resolvedParams.lrNumber}` },
    openGraph: {
      title: `Track Parcel ${lr} | ShipKart`,
      description: `Live tracking for consignment ${lr} on ShipKart by POOJA TRAVELS & CARGO.`,
      url: `${SITE_URL}/track/${resolvedParams.lrNumber}`,
    },
    robots: { index: false, follow: true },
  };
}

export default async function PublicTrackingPage({
  params,
}: {
  params: Promise<{ lrNumber: string }>;
}) {
  const resolvedParams = await params;
  const lrNumberParam = resolvedParams.lrNumber;

  const result = await getTrackingTimelineAction(lrNumberParam, false);

  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-100">Parcel Not Found</h1>
          <p className="text-sm text-slate-400">
            {result.error || `No consignment record found for "${lrNumberParam}". Please check your tracking number.`}
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
            >
              Back to ShipKart Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { booking, timeline, expectedNextStep } = result.data;

  // Auto-redirect URL to canonical Booking UUID if user visited via LR number (e.g. /track/0006 -> /track/01bd870f-17a9-4eef-9134-9deff384b50c)
  if (booking.id && lrNumberParam !== booking.id) {
    redirect(`/track/${booking.id}`);
  }

  const formattedBookedDate = new Date(booking.createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formattedLastUpdated = new Date(booking.lastUpdatedAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-neutral-950 dark:text-neutral-100 py-8 px-4 sm:px-6 lg:px-8 font-sans space-y-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* BRANDING HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-amber-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20">
              SK
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                POOJA TRAVELS & CARGO
              </h1>
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-wide uppercase">
                Official Real-Time Consignment Tracking Page
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right bg-slate-50 dark:bg-neutral-950 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-neutral-800">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-neutral-400">
              LR Number
            </div>
            <div className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono tracking-wider">
              {booking.lrNumber}
            </div>
          </div>
        </div>

        {/* CURRENT STATUS CARD */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white dark:from-amber-500/10 dark:via-neutral-900 dark:to-neutral-900 border border-amber-500/30 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-300">
                  Current Status:
                </span>
                <StatusBadge status={booking.status} size="sm" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {booking.status.replace(/_/g, " ")}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <DigitalLRVerificationModal lrNumber={booking.lrNumber} status={booking.status} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-neutral-300 border-t border-amber-500/20 pt-3">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Booked on: {formattedBookedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:justify-end">
              <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Last Updated: {formattedLastUpdated}</span>
            </div>
          </div>
        </div>

        {/* OFFICE LOCATIONS & NEXT STEP SUMMARY */}
        <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
            Logistics Movement Summary
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center sm:text-left">
            <div className="bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-3.5 rounded-2xl space-y-1">
              <span className="text-[10px] font-black text-slate-500 dark:text-neutral-400 uppercase">Current Office</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{booking.currentOffice.name}</p>
              <p className="text-xs text-slate-500 dark:text-neutral-400">{booking.currentOffice.city}</p>
            </div>

            <div className="bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-3.5 rounded-2xl space-y-1">
              <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase">Expected Next Office</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{booking.nextOffice.name}</p>
              <p className="text-xs text-slate-500 dark:text-neutral-400">{booking.nextOffice.city}</p>
            </div>

            <div className="bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-3.5 rounded-2xl space-y-1">
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase">Final Destination Office</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{booking.destinationOffice.name}</p>
              <p className="text-xs text-slate-500 dark:text-neutral-400">{booking.destinationOffice.city}</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-neutral-950 p-4 rounded-2xl border border-slate-200 dark:border-neutral-800 text-xs text-slate-600 dark:text-neutral-300">
            <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-1">
              Office Hours for Collection:
            </span>
            <p>
              {booking.destinationOffice.name} ({booking.destinationOffice.city}):{" "}
              <strong className="text-amber-600 dark:text-amber-400">{booking.destinationOffice.openingTime} - {booking.destinationOffice.closingTime}</strong>
            </p>
          </div>
        </div>

        {/* PARCEL ITEMS SUMMARY */}
        <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 p-6 rounded-3xl shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
            Consignment Items ({booking.items.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {booking.items.map((item: any, idx: number) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-neutral-950 p-3 rounded-2xl border border-slate-200 dark:border-neutral-800 flex items-center justify-between text-xs"
              >
                <span className="font-bold text-slate-900 dark:text-white uppercase">
                  {item.parcelType.replace(/_/g, " ")}
                </span>
                <span className="font-mono font-bold text-slate-600 dark:text-neutral-300">
                  Qty: {item.quantity} {item.weightKg ? `(${item.weightKg}kg)` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* REAL-TIME TIMELINE */}
        <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
            Live Event History & Milestones
          </h3>

          <TrackingTimeline
            timeline={timeline}
            currentStatus={booking.status}
            expectedNextStep={expectedNextStep}
            isStaff={false}
          />
        </div>

        {/* FOOTER */}
        <div className="bg-white/60 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 p-4 rounded-2xl text-center space-y-2 text-xs text-slate-500 dark:text-neutral-400">
          <div className="flex items-center justify-center gap-1.5 text-slate-700 dark:text-neutral-200 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Official ShipKart Verified Public Tracking Page</span>
          </div>
          <p>
            Helpline: <span className="font-mono font-bold text-slate-900 dark:text-neutral-200">6350603414</span> |{" "}
            <span className="font-mono font-bold text-slate-900 dark:text-neutral-200">7852091119</span> |{" "}
            <span className="font-mono font-bold text-slate-900 dark:text-neutral-200">0291-2651955</span>
          </p>
        </div>
      </div>
    </div>
  );
}
