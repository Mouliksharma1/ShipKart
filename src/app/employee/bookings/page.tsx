import React from "react";
import { searchBookingsAction } from "@/app/actions/employee-booking";
import { BookingSearchTable } from "@/components/employee/BookingSearchTable";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Counter Bookings Search | Pooja Travels & Cargo",
  description: "Search and filter all offline and online consignment bookings.",
};

export default async function EmployeeBookingsPage() {
  const initialRes = await searchBookingsAction({});
  const initialBookings = initialRes.data || [];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-neutral-950 p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Consignment Bookings Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
            Search, filter, repeat, and track all LR records across the network.
          </p>
        </div>

        <BookingSearchTable initialBookings={initialBookings} />
      </div>
    </main>
  );
}
