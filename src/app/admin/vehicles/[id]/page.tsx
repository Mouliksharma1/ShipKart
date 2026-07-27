import React from 'react';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Truck, Wrench, Shield, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface VehicleDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const { id } = await params;

  const vehicle = await prisma.vehicleMaster.findUnique({
    where: { id },
    include: {
      driverEmployee: true,
      maintenanceHistory: {
        take: 10,
        orderBy: { serviceDate: 'desc' },
      },
    },
  });

  if (!vehicle) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/admin" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline">Admin</Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <Link href="/admin/vehicles" className="text-xs text-slate-500 dark:text-zinc-400 font-semibold hover:underline">Fleet</Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">{vehicle.vehicleNumber}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{vehicle.vehicleNumber} ({vehicle.vehicleType})</h1>
        </div>
        <Link href="/admin/vehicles" className="flex items-center px-4 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Fleet
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {vehicle.vehicleType} ({vehicle.capacityKg} kg)
              </span>
              <span className="font-mono text-xs text-slate-400 dark:text-zinc-500">Status: {vehicle.status}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-800">
                <div className="text-slate-400 dark:text-zinc-500 font-bold uppercase text-[10px]">Registration Number</div>
                <div className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-1">{vehicle.registrationNumber}</div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-800">
                <div className="text-slate-400 dark:text-zinc-500 font-bold uppercase text-[10px]">Current Odometer</div>
                <div className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-1">{vehicle.odometer} km</div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-800 sm:col-span-2">
                <div className="text-slate-400 dark:text-zinc-500 font-bold uppercase text-[10px]">Driver Assignment</div>
                {vehicle.driverEmployee ? (
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">Company Driver: {vehicle.driverEmployee.name} ({vehicle.driverEmployee.phone})</div>
                ) : (
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">Third-Party Driver: {vehicle.driverName || 'Unassigned'} ({vehicle.driverPhone || 'No Phone'})</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-zinc-800/40 rounded-xl border border-slate-100 dark:border-zinc-800">
                <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold">Insurance Expiry</div>
                <div className="font-mono font-bold text-slate-900 dark:text-zinc-200 mt-0.5">{vehicle.insuranceExpiry ? new Date(vehicle.insuranceExpiry).toLocaleDateString('en-IN') : 'N/A'}</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-zinc-800/40 rounded-xl border border-slate-100 dark:border-zinc-800">
                <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold">Permit Expiry</div>
                <div className="font-mono font-bold text-slate-900 dark:text-zinc-200 mt-0.5">{vehicle.permitExpiry ? new Date(vehicle.permitExpiry).toLocaleDateString('en-IN') : 'N/A'}</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-zinc-800/40 rounded-xl border border-slate-100 dark:border-zinc-800">
                <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold">Fitness Expiry</div>
                <div className="font-mono font-bold text-slate-900 dark:text-zinc-200 mt-0.5">{vehicle.fitnessExpiry ? new Date(vehicle.fitnessExpiry).toLocaleDateString('en-IN') : 'N/A'}</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-zinc-800/40 rounded-xl border border-slate-100 dark:border-zinc-800">
                <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold">Pollution Expiry</div>
                <div className="font-mono font-bold text-slate-900 dark:text-zinc-200 mt-0.5">{vehicle.pollutionExpiry ? new Date(vehicle.pollutionExpiry).toLocaleDateString('en-IN') : 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center">
              <Wrench className="w-4 h-4 mr-2 text-amber-500" /> Maintenance Summary
            </h3>
            <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
              <div className="text-[10px] text-amber-900 dark:text-amber-200 font-semibold">Total Cumulative Maintenance Cost</div>
              <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">₹{vehicle.maintenanceCost.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
