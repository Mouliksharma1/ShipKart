import React from 'react';
import { prisma } from '@/lib/db';
import { CreateVehicleForm } from '@/components/admin/CreateVehicleForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function NewVehiclePage() {
  const drivers = await prisma.user.findMany({
    where: { role: 'EMPLOYEE' },
    select: { id: true, name: true, phone: true },
  });

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/admin" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline">Admin</Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <Link href="/admin/vehicles" className="text-xs text-slate-500 dark:text-zinc-400 font-semibold hover:underline">Fleet</Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">New</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Register New Fleet Vehicle</h1>
        </div>
      </div>

      <div className="max-w-3xl bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <CreateVehicleForm drivers={drivers} />
      </div>
    </div>
  );
}
