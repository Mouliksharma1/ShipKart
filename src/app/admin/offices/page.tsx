import React from "react";
import { getOfficesAction } from "@/app/actions/offices-routes";
import AdminOfficesClient from "./AdminOfficesClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Office Master Admin | ShipKart",
  description: "Manage branch office locations, coordinates, managers, and operational status.",
};

export default async function AdminOfficesPage() {
  const res = await getOfficesAction();
  const offices = res.data || [];

  return <AdminOfficesClient initialOffices={offices} />;
}
