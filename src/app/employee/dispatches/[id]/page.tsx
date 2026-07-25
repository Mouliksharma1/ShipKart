import { getDispatchDetailsAction } from "@/app/actions/dispatch";
import DispatchDetailClient from "./DispatchDetailClient";
import { notFound } from "next/navigation";

export default async function DispatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getDispatchDetailsAction(id);

  if (!res.success || !res.dispatch) {
    notFound();
  }

  return (
    <DispatchDetailClient
      dispatch={res.dispatch}
      summary={res.summary || { totalLrCount: 0, totalParcelCount: 0, totalWeightKg: 0, totalValue: 0 }}
    />
  );
}
