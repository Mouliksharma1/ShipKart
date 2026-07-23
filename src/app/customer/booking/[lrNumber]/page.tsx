import React from "react";
import Link from "next/link";
import { getBookingDetailsAction } from "@/app/actions/booking";
import BookingDetailsClient from "./BookingDetailsClient";

export const dynamic = "force-dynamic";

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ lrNumber: string }>;
}) {
  const { lrNumber } = await params;
  const res = await getBookingDetailsAction(lrNumber);

  if (!res.success || !res.data) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 text-center rounded-2xl border border-red-500/20 bg-red-500/10 space-y-4">
        <h2 className="text-xl font-bold text-red-400">Booking Not Found</h2>
        <p className="text-xs text-neutral-400">{res.error || "Invalid LR Number"}</p>
        <Link href="/customer/history" className="inline-block text-xs font-bold text-amber-400 underline">
          Return to Booking History
        </Link>
      </div>
    );
  }

  return <BookingDetailsClient booking={res.data} />;
}
