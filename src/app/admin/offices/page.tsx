import React from 'react';
import { getOfficesAction } from '@/app/actions/admin/office';
import { Building, MapPin, Phone, Users, Clock, Plus, ShieldCheck, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminOfficesPage() {
  const res = await getOfficesAction({ includeArchived: true });
  const offices = res.offices || [];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/admin" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline">
              Admin
            </Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Offices</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Branch & Office Operations</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/offices/new"
            className="flex items-center px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add New Office
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offices.map((office) => {
          const isArchived = !office.isActive;
          const capacityUsed = Math.min(100, Math.round((office.currentStorageCapacity / office.maximumStorageCapacity) * 100));

          return (
            <div
              key={office.id}
              className={`bg-white dark:bg-zinc-900 rounded-3xl border ${
                isArchived ? 'border-slate-200 dark:border-zinc-800/80 opacity-60 bg-slate-50 dark:bg-zinc-900/50' : 'border-slate-200/80 dark:border-zinc-800 shadow-xs hover:shadow-md'
              } p-6 transition-all space-y-5 flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {office.officeType}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1.5">{office.name}</h3>
                    <p className="text-xs font-mono text-slate-400 dark:text-zinc-500">{office.officeCode || office.code}</p>
                  </div>
                  {isArchived ? (
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 px-2 py-0.5 rounded-full">
                      Archived
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>

                {office.parentOffice && (
                  <div className="text-xs text-slate-500 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-800/40 p-2 rounded-xl border border-slate-100 dark:border-zinc-800 flex items-center space-x-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 shrink-0" />
                    <span>Parent: <strong className="text-slate-700 dark:text-zinc-200">{office.parentOffice.name}</strong></span>
                  </div>
                )}

                <div className="space-y-2 text-xs text-slate-600 dark:text-zinc-300">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
                    <span className="truncate">{office.address}, {office.city}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
                    <span>{office.phone} {office.managerName ? `(${office.managerName})` : ''}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
                    <span>Timing: {office.openingTime} - {office.closingTime} ({office.workingDays})</span>
                  </div>
                </div>

                {/* Storage Capacity Gauge */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                    <span>Storage Capacity</span>
                    <span>{office.currentStorageCapacity} / {office.maximumStorageCapacity} parcels ({capacityUsed}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        capacityUsed > 85 ? 'bg-rose-500' : capacityUsed > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${capacityUsed}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-zinc-400 flex items-center font-medium">
                  <Users className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-zinc-500" /> {office._count?.users || 0} Staff
                </span>
                <Link
                  href={`/admin/offices/${office.id}`}
                  className="font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center"
                >
                  Manage Office &rarr;
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
