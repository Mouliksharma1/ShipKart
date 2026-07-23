import React from "react";
import { getOfficesAction } from "@/app/actions/offices-routes";
import CustomerBookingWizard from "./CustomerBookingWizard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Book Consignment Parcel | ShipKart Customer Engine",
  description: "Online consignment booking wizard powered by Pooja Travels & Cargo express logistics.",
};

export default async function CustomerBookPage() {
  const officesRes = await getOfficesAction(undefined, true);
  const offices = officesRes.data || [];

  return <CustomerBookingWizard offices={offices} />;
}
