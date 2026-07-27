import React from 'react';
import { getOfficesAction } from '@/app/actions/admin/office';
import { CreateEmployeeForm } from '@/components/admin/CreateEmployeeForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function NewEmployeePage() {
  const officeRes = await getOfficesAction({ activeOnly: true });
  const offices = officeRes.offices || [];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/admin" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline">
              Admin
            </Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <Link href="/admin/employees" className="text-xs text-slate-500 dark:text-zinc-400 font-semibold hover:underline">
              Employees
            </Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">New</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Register New Staff / Employee</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <CreateEmployeeForm offices={offices} />
      </div>
    </div>
  );
}
