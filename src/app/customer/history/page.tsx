import React from "react";
import Link from "next/link";
import { getCustomerBookingsAction } from "@/app/actions/booking";
import { Search, Package, ArrowRight, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Booking History | ShipKart Customer Engine",
  description: "View and search your online consignment bookings history.",
};

export default async function CustomerHistoryPage() {
  const bookingsRes = await getCustomerBookingsAction();
  const bookings = bookingsRes.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-1">
            <Shield className="h-3.5 w-3.5" />
            <span>BOOKING HISTORY</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Your Consignment Bookings</h1>
        </div>

        <Link
          href="/customer/book"
          className="px-4 py-2.5 rounded-xl bg-amber-500 text-amber-950 font-bold text-xs hover:bg-amber-400"
        >
          Book New Consignment
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4 shadow-xl">
        {bookings.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 space-y-3">
            <Package className="h-10 w-10 mx-auto text-slate-400" />
            <p>No past bookings found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-neutral-800 text-xs">
            {bookings.map((b: any) => (
              <div key={b.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-sm">
                      {b.lrNumber}
                    </span>
                    <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded border border-green-500/20">
                      {b.status}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-neutral-400 font-medium">
                    {b.originOffice.name} → {b.destinationOffice.name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Receiver: {b.receiverName} ({b.receiverPhone})
                  </p>
                </div>

                <div className="flex items-center space-x-4 shrink-0">
                  <div className="text-right">
                    <span className="block font-mono font-bold text-slate-900 dark:text-white text-sm">
                      ₹{b.totalAmount}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Link
                    href={`/customer/booking/${b.lrNumber}`}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 hover:text-amber-500 transition-colors"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
