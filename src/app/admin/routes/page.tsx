import React from "react";
import { getRoutesAction, getOfficesAction } from "@/app/actions/offices-routes";
import { db } from "@/lib/db";
import AdminRoutesClient from "./AdminRoutesClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Route Master Admin | ShipKart",
  description: "Manage origin and destination transport routes, ETA, departure timings, and tariffs.",
};

export default async function AdminRoutesPage() {
  const routesRes = await getRoutesAction();
  const officesRes = await getOfficesAction(undefined, true);
  const pricingGroups = await db.pricingGroup.findMany({
    orderBy: { name: "asc" },
  });

  const routes = routesRes.data || [];
  const offices = officesRes.data || [];

  return (
    <AdminRoutesClient
      initialRoutes={routes as any}
      offices={offices}
      pricingGroups={pricingGroups}
    />
  );
}
