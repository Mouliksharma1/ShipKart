import React from 'react';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Building, MapPin, Phone, Clock, Users, ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface OfficeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OfficeDetailPage({ params }: OfficeDetailPageProps) {
  const { id } = await params;

  const office = await prisma.officeMaster.findUnique({
    where: { id },
    include: {
      parentOffice: true,
      subOffices: true,
      users: { select: { id: true, name: true, role: true, phone: true } },
    },
  });

  if (!office) {
    notFound();
  }

  const capacityUsed = Math.min(100, Math.round((office.currentStorageCapacity / office.maximumStorageCapacity) * 100));

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/admin" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline">Admin</Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <Link href="/admin/offices" className="text-xs text-slate-500 dark:text-zinc-400 font-semibold hover:underline">Offices</Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">{office.code}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{office.name}</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/admin/offices" className="flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-xl text-xs font-bold transition-colors">
            Edit Office Details &rarr;
          </Link>
          <Link href="/admin/offices" className="flex items-center px-4 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Offices
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {office.officeType}
              </span>
              <span className="font-mono text-xs text-slate-400 dark:text-zinc-500">{office.officeCode || office.code}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-800">
                <div className="text-slate-400 dark:text-zinc-500 font-bold uppercase text-[10px]">Manager</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">{office.managerName || 'Unassigned'}</div>
                <div className="text-slate-500 dark:text-zinc-400">{office.managerPhone}</div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-800">
                <div className="text-slate-400 dark:text-zinc-500 font-bold uppercase text-[10px]">Operating Hours</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">{office.openingTime} - {office.closingTime}</div>
                <div className="text-slate-500 dark:text-zinc-400">{office.workingDays}</div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-800 sm:col-span-2">
                <div className="text-slate-400 dark:text-zinc-500 font-bold uppercase text-[10px]">Address & Contact</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">{office.address}, {office.city}, {office.state} - {office.pinCode}</div>
                <div className="text-slate-500 dark:text-zinc-400">Phone: {office.phone} {office.altPhone ? `| Alt: ${office.altPhone}` : ''}</div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-zinc-400">
                <span>Storage Utilization</span>
                <span>{office.currentStorageCapacity} / {office.maximumStorageCapacity} parcels ({capacityUsed}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div className={`h-full ${capacityUsed > 85 ? 'bg-rose-500' : capacityUsed > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${capacityUsed}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
              <Users className="w-4 h-4 mr-2 text-amber-500" /> Assigned Branch Staff ({office.users.length})
            </h3>
            <div className="space-y-2 text-xs">
              {office.users.map((u) => (
                <div key={u.id} className="p-3 bg-slate-50 dark:bg-zinc-800/40 rounded-xl border border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-zinc-400">{u.phone}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">{u.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white">Hierarchy Mapping</h3>
            <div className="p-3 bg-slate-50 dark:bg-zinc-800/40 rounded-xl border border-slate-100 dark:border-zinc-800">
              <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold">Parent Office</div>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{office.parentOffice?.name || 'Top-Level Head Office'}</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-zinc-800/40 rounded-xl border border-slate-100 dark:border-zinc-800">
              <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold">Child Branches</div>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{office.subOffices.length} Direct Sub-Offices</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
