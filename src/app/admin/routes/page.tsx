import React from 'react';
import { getRoutesAction } from '@/app/actions/admin/routes';
import { getOfficesAction } from '@/app/actions/admin/office';
import { getPricingGroupsAction } from '@/app/actions/admin/pricing';
import AdminRoutesClient from './AdminRoutesClient';

export const dynamic = 'force-dynamic';

export default async function AdminRoutesPage() {
  const routesRes = await getRoutesAction({ includeArchived: true });
  const officesRes = await getOfficesAction({ includeArchived: false });
  const pricingGroupsRes = await getPricingGroupsAction({ includeArchived: false });

  const routes = routesRes.routes || [];
  const offices = officesRes.offices || [];
  const pricingGroups = pricingGroupsRes.pricingGroups || [];

  return (
    <AdminRoutesClient
      initialRoutes={routes}
      offices={offices}
      pricingGroups={pricingGroups}
    />
  );
}
