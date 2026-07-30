import React from 'react';
import { getOfficesAction } from '@/app/actions/admin/office';
import AdminOfficesClient from './AdminOfficesClient';

export const dynamic = 'force-dynamic';

export default async function AdminOfficesPage() {
  const res = await getOfficesAction({ includeArchived: true });
  const offices = res.offices || [];

  const formattedOffices = offices.map((o: any) => ({
    id: o.id,
    name: o.name,
    code: o.code || o.officeCode,
    address: o.address,
    city: o.city,
    state: o.state || 'Rajasthan',
    pinCode: o.pinCode || '342001',
    phone: o.phone,
    altPhone: o.altPhone,
    managerName: o.managerName,
    managerPhone: o.managerPhone,
    latitude: o.latitude || 26.285498,
    longitude: o.longitude || 73.018264,
    openingTime: o.openingTime || '04:00 AM',
    closingTime: o.closingTime || '11:00 PM',
    status: o.status !== false && o.isActive !== false,
  }));

  return <AdminOfficesClient initialOffices={formattedOffices} />;
}
