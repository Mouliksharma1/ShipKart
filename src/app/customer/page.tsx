import React from "react";
import { getCustomerBookingsAction } from "@/app/actions/booking";
import CustomerDashboardClient from "./CustomerDashboardClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Customer Dashboard | ShipKart Online Portal",
  description: "Track consignments, manage bookings, and generate digital LR receipts.",
};

export default async function CustomerDashboardPage() {
  const bookingsRes = await getCustomerBookingsAction();
  const bookings = bookingsRes.data || [];

  return <CustomerDashboardClient recentBookings={bookings as any} />;
}
