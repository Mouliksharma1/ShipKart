import React from "react";
import { getEmployeeDashboardMetricsAction } from "@/app/actions/employee-booking";
import { EmployeeDashboard } from "@/components/employee/EmployeeDashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Employee Counter Dashboard | Pooja Travels & Cargo",
  description: "Offline Counter Booking Terminal for Pooja Travels & Cargo office staff.",
};

export default async function EmployeeDashboardPage() {
  const res = await getEmployeeDashboardMetricsAction();
  const metrics = res.data || {
    todayBookingsCount: 0,
    todayRevenue: 0,
    pendingPaymentsCount: 0,
    pendingCollectionsCount: 0,
    todayLrCount: 0,
    recentBookings: [],
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-neutral-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <EmployeeDashboard metrics={metrics} />
      </div>
    </main>
  );
}
