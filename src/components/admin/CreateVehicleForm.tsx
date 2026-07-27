'use client';

import React, { useState } from 'react';
import { createVehicleAction } from '@/app/actions/admin/vehicle';
import { useRouter } from 'next/navigation';
import { Truck, Hash, User, Phone, Gauge, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface CreateVehicleFormProps {
  drivers: Array<{ id: string; name: string; phone: string }>;
}

export function CreateVehicleForm({ drivers }: CreateVehicleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    vehicleNumber: '',
    registrationNumber: '',
    vehicleType: 'TRUCK',
    capacityKg: '1000',
    driverEmployeeId: '',
    driverName: '',
    driverPhone: '',
    odometer: '0',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await createVehicleAction({
        vehicleNumber: formData.vehicleNumber,
        registrationNumber: formData.registrationNumber || formData.vehicleNumber,
        vehicleType: formData.vehicleType,
        capacityKg: parseFloat(formData.capacityKg) || 1000,
        driverEmployeeId: formData.driverEmployeeId || undefined,
        driverName: formData.driverName || undefined,
        driverPhone: formData.driverPhone || undefined,
        odometer: parseFloat(formData.odometer) || 0,
      });

      if (res.success) {
        router.push('/admin/vehicles');
        router.refresh();
      } else {
        setError(res.error || 'Failed to register vehicle');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs">
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-2xl text-rose-700 dark:text-rose-300 font-bold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-zinc-300 flex items-center">
            <Truck className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-zinc-500" /> Vehicle Number *
          </label>
          <input
            type="text"
            required
            value={formData.vehicleNumber}
            onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
            placeholder="e.g. RJ19-GB-1234"
            className="w-full p-3 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white font-mono font-bold"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-zinc-300 flex items-center">
            <Hash className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-zinc-500" /> Registration / Chassis No
          </label>
          <input
            type="text"
            value={formData.registrationNumber}
            onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
            placeholder="e.g. REG-987654"
            className="w-full p-3 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-zinc-300 flex items-center">
            Vehicle Type
          </label>
          <select
            value={formData.vehicleType}
            onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
            className="w-full p-3 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white font-medium"
          >
            <option value="TRUCK">Heavy Cargo Truck</option>
            <option value="BUS">Passenger & Cargo Bus</option>
            <option value="VAN">Delivery Van</option>
            <option value="CONTAINER">Container Semi-Trailer</option>
            <option value="TEMPO">Local Tempo Pickup</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-zinc-300 flex items-center">
            Payload Capacity (Kg)
          </label>
          <input
            type="number"
            value={formData.capacityKg}
            onChange={(e) => setFormData({ ...formData, capacityKg: e.target.value })}
            placeholder="1000"
            className="w-full p-3 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white font-mono"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="font-bold text-slate-700 dark:text-zinc-300 flex items-center">
            <User className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-zinc-500" /> Assigned Company Driver
          </label>
          <select
            value={formData.driverEmployeeId}
            onChange={(e) => setFormData({ ...formData, driverEmployeeId: e.target.value })}
            className="w-full p-3 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white font-medium"
          >
            <option value="">No Company Driver Assigned (or Third-Party Driver)</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.phone})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
        <Link
          href="/admin/vehicles"
          className="flex items-center px-4 py-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Cancel
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-xl font-extrabold shadow-md transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Registering Vehicle...
            </>
          ) : (
            'Complete Vehicle Registration'
          )}
        </button>
      </div>
    </form>
  );
}
