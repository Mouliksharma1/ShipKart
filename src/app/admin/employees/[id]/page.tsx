import React from 'react';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { EmployeeSecurityControls } from '@/components/admin/EmployeeSecurityControls';
import { User, Phone, Mail, Building, Shield, Lock, KeyRound, Calendar, FileText, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface EmployeeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EmployeeDetailPage({ params }: EmployeeDetailPageProps) {
  const { id } = await params;

  const employee = await prisma.user.findUnique({
    where: { id },
    include: {
      office: true,
      attendances: {
        take: 10,
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!employee) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      {/* Header Bar */}
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
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">{employee.employeeCode || 'Employee'}</span>
          </div>
          <div className="flex items-center space-x-3 mt-1">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{employee.name}</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {employee.role}
            </span>
          </div>
        </div>
        <Link
          href="/admin/employees"
          className="flex items-center px-4 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Directory
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Security Action Controls */}
        <div className="lg:col-span-1 space-y-6">
          <EmployeeSecurityControls employee={employee} />
        </div>

        {/* Right Column: Detailed Profile Info & Attendance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Information Card */}
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
              <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Profile Information</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Master employment and contact details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-800 space-y-1">
                <div className="text-slate-400 dark:text-zinc-500 font-bold uppercase text-[10px]">Employee Code</div>
                <div className="text-sm font-mono font-bold text-slate-900 dark:text-white">{employee.employeeCode || 'N/A'}</div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-800 space-y-1">
                <div className="text-slate-400 dark:text-zinc-500 font-bold uppercase text-[10px]">Designation</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{employee.designation || 'Staff'}</div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-800 space-y-1">
                <div className="text-slate-400 dark:text-zinc-500 font-bold uppercase text-[10px]">Mobile Phone</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{employee.phone}</div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-800 space-y-1">
                <div className="text-slate-400 dark:text-zinc-500 font-bold uppercase text-[10px]">Email Address</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{employee.email || 'Not provided'}</div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-800 space-y-1">
                <div className="text-slate-400 dark:text-zinc-500 font-bold uppercase text-[10px]">Assigned Office</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{employee.office?.name || 'Unassigned'}</div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-800 space-y-1">
                <div className="text-slate-400 dark:text-zinc-500 font-bold uppercase text-[10px]">Emergency Phone</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{employee.emergencyContact || 'Not provided'}</div>
              </div>
            </div>

            {/* Document IDs */}
            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-3">
              <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-[11px]">Identity Documents</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-zinc-800/40 rounded-xl border border-slate-100 dark:border-zinc-800">
                  <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold">Aadhaar</div>
                  <div className="font-mono font-bold text-slate-900 dark:text-zinc-200 mt-0.5">{employee.aadhaarDoc || 'N/A'}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-zinc-800/40 rounded-xl border border-slate-100 dark:border-zinc-800">
                  <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold">PAN Card</div>
                  <div className="font-mono font-bold text-slate-900 dark:text-zinc-200 mt-0.5">{employee.panDoc || 'N/A'}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-zinc-800/40 rounded-xl border border-slate-100 dark:border-zinc-800">
                  <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold">Driving License</div>
                  <div className="font-mono font-bold text-slate-900 dark:text-zinc-200 mt-0.5">{employee.drivingLicenseDoc || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Attendance Logs */}
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-4">
            <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
              <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Attendance Logs</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Recent 10 shift clock-ins & clock-outs</p>
              </div>
            </div>

            {employee.attendances.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-zinc-500 py-4 text-center">No attendance logs recorded for this employee.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {employee.attendances.map((att) => (
                  <div key={att.id} className="p-3 bg-slate-50 dark:bg-zinc-800/40 rounded-xl border border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold font-mono text-slate-900 dark:text-white">{att.date}</span>
                      <span className="ml-2 font-semibold text-emerald-600 dark:text-emerald-400">({att.status})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                      In: {att.clockIn ? new Date(att.clockIn).toLocaleTimeString('en-IN') : 'N/A'} | Out: {att.clockOut ? new Date(att.clockOut).toLocaleTimeString('en-IN') : 'Active'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
