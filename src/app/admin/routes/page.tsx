import React from 'react';
import { getRoutesAction } from '@/app/actions/admin/routes';
import { getOfficesAction } from '@/app/actions/admin/office';
import { getPricingGroupsAction } from '@/app/actions/pricing';
import AdminRoutesClient from './AdminRoutesClient';

export const dynamic = 'force-dynamic';

export default async function AdminRoutesPage() {
  const routesRes = await getRoutesAction({ includeArchived: true });
  const officesRes = await getOfficesAction({ includeArchived: false });
  const pricingGroupsRes = await getPricingGroupsAction();

  const routes = (routesRes.routes || []) as any[];
  const offices = (officesRes.offices || []) as any[];
  const pricingGroups = (pricingGroupsRes.data || []) as any[];

  return (
    <AdminRoutesClient
      initialRoutes={routes}
      offices={offices}
      pricingGroups={pricingGroups}
    />
  );
}
