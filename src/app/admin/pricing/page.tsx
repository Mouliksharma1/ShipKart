import React from "react";
import { getPricingGroupsAction } from "@/app/actions/pricing";
import { getOfficesAction } from "@/app/actions/offices-routes";
import AdminPricingClient from "./AdminPricingClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dynamic Pricing Engine Admin | ShipKart",
  description: "Manage normalized tariff pricing groups, itemized parcel rules, and test calculations.",
};

export default async function AdminPricingPage() {
  const groupsRes = await getPricingGroupsAction();
  const officesRes = await getOfficesAction(undefined, true);

  const groups = groupsRes.data || [];
  const offices = officesRes.data || [];

  return <AdminPricingClient initialGroups={groups as any} offices={offices} />;
}
