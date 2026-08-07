import React from "react";
import { getOfficesAction } from "@/app/actions/offices-routes";
import OfficesDirectoryClient from "./OfficesDirectoryClient";
import { generatePageMetadata, breadcrumbJsonLd, SITE_URL } from "@/lib/seo/metadata";
import { StructuredData } from "@/components/seo/StructuredData";

export const dynamic = "force-dynamic";

export const metadata = generatePageMetadata({
  title: "Branch Office & Station Directory",
  description:
    "Find all POOJA TRAVELS & CARGO branch offices, station pickup points & cargo counters across Rajasthan. View addresses, phone numbers, timings & Google Maps directions.",
  path: "/offices",
});

export default async function OfficesPage() {
  const result = await getOfficesAction(undefined, true);
  const offices = result.data || [];

  return (
    <>
      <StructuredData
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Offices", url: `${SITE_URL}/offices` },
        ])}
      />
      <OfficesDirectoryClient initialOffices={offices} />
    </>
  );
}
