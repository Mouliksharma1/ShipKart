import React from 'react';
import { getVehiclesAction } from '@/app/actions/admin/vehicle';
import { Truck, Wrench, Shield, Calendar, AlertTriangle, Plus, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminVehiclesPage() {
  const res = await getVehiclesAction({ includeArchived: true });
  const vehicles = res.vehicles || [];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/admin" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline">
              Admin
            </Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Fleet & Vehicles</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Vehicle Fleet & Maintenance Engine</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/vehicles/new"
            className="flex items-center px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Register Vehicle
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => {
          const isArchived = !v.isActive;

          return (
            <div
              key={v.id}
              className={`bg-white dark:bg-zinc-900 rounded-3xl border ${
                isArchived ? 'border-slate-200 dark:border-zinc-800/80 opacity-60 bg-slate-50 dark:bg-zinc-900/50' : 'border-slate-200/80 dark:border-zinc-800 shadow-xs hover:shadow-md'
              } p-6 transition-all space-y-5 flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {v.vehicleType} ({v.capacityKg} kg)
                    </span>
                    <h3 className="text-xl font-black font-mono text-slate-900 dark:text-white mt-1.5">{v.vehicleNumber}</h3>
                    <p className="text-xs text-slate-400 dark:text-zinc-500">Reg: {v.registrationNumber}</p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      v.status === 'AVAILABLE'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                        : v.status === 'IN_SERVICE'
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
                    }`}
                  >
                    {v.status}
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-zinc-800/40 p-3 rounded-2xl border border-slate-100 dark:border-zinc-800 space-y-1 text-xs">
                  <div className="text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Driver Assignment</div>
                  {v.driverEmployee ? (
                    <div className="font-bold text-slate-800 dark:text-zinc-200 flex items-center">
                      <Shield className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
                      Company Employee: {v.driverEmployee.name} ({v.driverEmployee.phone})
                    </div>
                  ) : (
                    <div className="text-slate-700 dark:text-zinc-300 font-medium">
                      Third-Party Driver: {v.driverName || 'Unassigned'} ({v.driverPhone || 'No Phone'})
                    </div>
                  )}
                </div>

                {/* Expiries & Maintenance Badges */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 dark:text-zinc-300">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800">
                    <div className="text-slate-400 dark:text-zinc-500 text-[10px]">Insurance</div>
                    <div className="font-bold text-slate-800 dark:text-zinc-200">
                      {v.insuranceExpiry ? new Date(v.insuranceExpiry).toLocaleDateString('en-IN') : 'N/A'}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800">
                    <div className="text-slate-400 dark:text-zinc-500 text-[10px]">Permit Expiry</div>
                    <div className="font-bold text-slate-800 dark:text-zinc-200">
                      {v.permitExpiry ? new Date(v.permitExpiry).toLocaleDateString('en-IN') : 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-zinc-400 flex justify-between items-center bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                  <span className="flex items-center text-amber-900 dark:text-amber-200 font-bold">
                    <Wrench className="w-3.5 h-3.5 mr-1.5 text-amber-600 dark:text-amber-400" /> Total Maintenance Cost
                  </span>
                  <span className="font-black font-mono text-slate-900 dark:text-white">₹{v.maintenanceCost.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 dark:text-zinc-500 font-mono">Odometer: {v.odometer} km</span>
                <Link href={`/admin/vehicles/${v.id}`} className="font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300">
                  View Fleet Record &rarr;
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
