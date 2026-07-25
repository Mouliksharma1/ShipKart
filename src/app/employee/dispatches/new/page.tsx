import { getOfficesAction } from "@/app/actions/offices-routes";
import NewDispatchClient from "./NewDispatchClient";

export default async function NewDispatchPage() {
  const officesRes = await getOfficesAction();
  const offices = officesRes.data || [];

  return (
    <NewDispatchClient
      offices={offices.map((o) => ({
        id: o.id,
        name: o.name,
        city: o.city,
      }))}
    />
  );
}
