import React from 'react';
import { getVehiclesAction } from '@/app/actions/admin/vehicle';
import { Truck, Wrench, Shield, Calendar, AlertTriangle, Plus, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminVehiclesPage() {
  const res = await getVehiclesAction({ includeArchived: true });
  const vehicles = res.vehicles || [];

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/admin" className="text-xs text-orange-600 font-bold hover:underline">
              Admin
            </Link>
            <span className="text-xs text-slate-300">/</span>
            <span className="text-xs text-slate-500 font-semibold">Fleet & Vehicles</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Vehicle Fleet & Maintenance Engine</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/vehicles/new"
            className="flex items-center px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
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
              className={`bg-white rounded-3xl border ${
                isArchived ? 'border-slate-200 opacity-60 bg-slate-50' : 'border-slate-200/80 shadow-xs hover:shadow-md'
              } p-6 transition-all space-y-5 flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {v.vehicleType} ({v.capacityKg} kg)
                    </span>
                    <h3 className="text-xl font-black font-mono text-slate-900 mt-1.5">{v.vehicleNumber}</h3>
                    <p className="text-xs text-slate-400">Reg: {v.registrationNumber}</p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      v.status === 'AVAILABLE'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : v.status === 'IN_SERVICE'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {v.status}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 text-xs">
                  <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Driver Assignment</div>
                  {v.driverEmployee ? (
                    <div className="font-bold text-slate-800 flex items-center">
                      <Shield className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      Company Employee: {v.driverEmployee.name} ({v.driverEmployee.phone})
                    </div>
                  ) : (
                    <div className="text-slate-700 font-medium">
                      Third-Party Driver: {v.driverName || 'Unassigned'} ({v.driverPhone || 'No Phone'})
                    </div>
                  )}
                </div>

                {/* Expiries & Maintenance Badges */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-slate-400 text-[10px]">Insurance</div>
                    <div className="font-bold text-slate-800">
                      {v.insuranceExpiry ? new Date(v.insuranceExpiry).toLocaleDateString('en-IN') : 'N/A'}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-slate-400 text-[10px]">Permit Expiry</div>
                    <div className="font-bold text-slate-800">
                      {v.permitExpiry ? new Date(v.permitExpiry).toLocaleDateString('en-IN') : 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 flex justify-between items-center bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                  <span className="flex items-center text-amber-900 font-bold">
                    <Wrench className="w-3.5 h-3.5 mr-1.5 text-amber-600" /> Total Maintenance Cost
                  </span>
                  <span className="font-black font-mono text-slate-900">₹{v.maintenanceCost.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Odometer: {v.odometer} km</span>
                <Link href={`/admin/vehicles/${v.id}`} className="font-bold text-orange-600 hover:text-orange-700">
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
