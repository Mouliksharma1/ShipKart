import React from "react";
import { getOfficesAction } from "@/app/actions/offices-routes";
import OfficesDirectoryClient from "./OfficesDirectoryClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Office Network Directory | Pooja Travels & Cargo",
  description: "View all head office, branch office, and station pickup locations for Pooja Travels & Cargo.",
};

export default async function OfficesPage() {
  const result = await getOfficesAction(undefined, true);
  const offices = result.data || [];

  return <OfficesDirectoryClient initialOffices={offices} />;
}
