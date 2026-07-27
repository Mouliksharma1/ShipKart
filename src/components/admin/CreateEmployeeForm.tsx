'use client';

import React, { useState } from 'react';
import { createEmployeeAction } from '@/app/actions/admin/employee';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail, Building, Shield, FileText, Loader2, ArrowLeft, KeyRound } from 'lucide-react';
import Link from 'next/link';

interface CreateEmployeeFormProps {
  offices: Array<{ id: string; name: string; city: string }>;
}

export function CreateEmployeeForm({ offices }: CreateEmployeeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'EMPLOYEE',
    designation: 'Staff',
    officeId: offices[0]?.id || '',
    emergencyContact: '',
    aadhaarDoc: '',
    panDoc: '',
    drivingLicenseDoc: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await createEmployeeAction({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        role: formData.role as any,
        designation: formData.designation,
        officeId: formData.officeId || undefined,
        emergencyContact: formData.emergencyContact || undefined,
        aadhaarDoc: formData.aadhaarDoc || undefined,
        panDoc: formData.panDoc || undefined,
        drivingLicenseDoc: formData.drivingLicenseDoc || undefined,
      });

      if (res.success) {
        router.push('/admin/employees');
        router.refresh();
      } else {
        setError(res.error || 'Failed to create employee');
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
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-zinc-300 flex items-center">
            <User className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-zinc-500" /> Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Ramesh Kumar"
            className="w-full p-3 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
          />
        </div>

        {/* Mobile Phone */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-zinc-300 flex items-center">
            <Phone className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-zinc-500" /> Phone Number *
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="e.g. 9829012345"
            className="w-full p-3 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
          />
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-zinc-300 flex items-center">
            <Mail className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-zinc-500" /> Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g. ramesh@poojatravels.com"
            className="w-full p-3 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
          />
        </div>

        {/* Custom Password (Optional) */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-zinc-300 flex items-center justify-between">
            <span className="flex items-center"><KeyRound className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-zinc-500" /> Initial Password</span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Default: Phone Number</span>
          </label>
          <input
            type="text"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Leave empty to use Phone Number"
            className="w-full p-3 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
          />
        </div>

        {/* Assigned Branch Office */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-zinc-300 flex items-center">
            <Building className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-zinc-500" /> Assigned Branch Office
          </label>
          <select
            value={formData.officeId}
            onChange={(e) => setFormData({ ...formData, officeId: e.target.value })}
            className="w-full p-3 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
          >
            <option value="">Unassigned</option>
            {offices.map((off) => (
              <option key={off.id} value={off.id}>
                {off.name} ({off.city})
              </option>
            ))}
          </select>
        </div>

        {/* Role Selection */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-zinc-300 flex items-center">
            <Shield className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-zinc-500" /> Enterprise Role
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full p-3 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
          >
            <option value="EMPLOYEE">Field Employee / Driver</option>
            <option value="COUNTER_EMPLOYEE">Counter Booking Employee</option>
            <option value="MANAGER">Branch Manager</option>
            <option value="ACCOUNTANT">Accountant</option>
            <option value="PARTNER_OFFICE">Partner Office Manager</option>
            <option value="ADMIN">System Administrator</option>
          </select>
        </div>

        {/* Designation */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-zinc-300 flex items-center">
            <FileText className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-zinc-500" /> Job Designation
          </label>
          <input
            type="text"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            placeholder="e.g. Senior Counter Executive"
            className="w-full p-3 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
          />
        </div>
      </div>

      {/* Verification Documents Grid */}
      <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-4">
        <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-[11px]">
          Identity & Emergency Verification Details
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">Emergency Phone</label>
            <input
              type="tel"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              placeholder="e.g. 9829099999"
              className="w-full p-2.5 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">Aadhaar Card No</label>
            <input
              type="text"
              value={formData.aadhaarDoc}
              onChange={(e) => setFormData({ ...formData, aadhaarDoc: e.target.value })}
              placeholder="XXXX-XXXX-XXXX"
              className="w-full p-2.5 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">Driving License No</label>
            <input
              type="text"
              value={formData.drivingLicenseDoc}
              onChange={(e) => setFormData({ ...formData, drivingLicenseDoc: e.target.value })}
              placeholder="RJ-19-2023-XXXXX"
              className="w-full p-2.5 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
        <Link
          href="/admin/employees"
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
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Registering Staff...
            </>
          ) : (
            'Complete Staff Registration'
          )}
        </button>
      </div>
    </form>
  );
}
