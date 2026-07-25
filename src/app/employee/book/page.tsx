import React from "react";
import { db } from "@/lib/db";
import { EmployeeBookingWizard } from "@/components/employee/EmployeeBookingWizard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "New Counter Booking | Pooja Travels & Cargo",
  description: "Create fast offline counter bookings.",
};

export default async function EmployeeBookPage() {
  const offices = await db.officeMaster.findMany({
    where: { status: true },
    select: { id: true, name: true, city: true, state: true },
    orderBy: { city: "asc" },
  });

  const defaultOrigin = offices[0]?.id || "";

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-neutral-950 p-4 sm:p-6 lg:p-8">
      <EmployeeBookingWizard offices={offices} defaultOriginId={defaultOrigin} />
    </main>
  );
}
