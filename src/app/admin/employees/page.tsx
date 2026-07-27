import React from 'react';
import { getEmployeesAction } from '@/app/actions/admin/employee';
import { Users, Shield, Lock, Unlock, KeyRound, Plus, CheckCircle, AlertOctagon } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminEmployeesPage() {
  const res = await getEmployeesAction({ includeArchived: true });
  const employees = res.employees || [];

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/admin" className="text-xs text-orange-600 font-bold hover:underline">
              Admin
            </Link>
            <span className="text-xs text-slate-300">/</span>
            <span className="text-xs text-slate-500 font-semibold">Employees</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Employee Directory & Account Security</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/employees/new"
            className="flex items-center px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add New Staff
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Employee</th>
                <th className="p-4">Role & Designation</th>
                <th className="p-4">Assigned Branch</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Account Security Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{emp.name}</div>
                        <div className="text-[11px] font-mono text-slate-400">{emp.employeeCode || 'No Code'}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full font-extrabold text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                      {emp.role}
                    </span>
                    <div className="text-[11px] text-slate-500 mt-1">{emp.designation || 'Staff'}</div>
                  </td>

                  <td className="p-4">
                    <div className="font-semibold text-slate-800">{emp.office?.name || 'Unassigned'}</div>
                    <div className="text-[11px] text-slate-400">{emp.office?.city}</div>
                  </td>

                  <td className="p-4">
                    <div>{emp.phone}</div>
                    <div className="text-[11px] text-slate-400">{emp.email || 'No email'}</div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {emp.accountLocked ? (
                        <span className="flex items-center text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                          <Lock className="w-3.5 h-3.5 mr-1" /> Locked ({emp.failedLoginAttempts} failed)
                        </span>
                      ) : emp.passwordResetRequired ? (
                        <span className="flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          <KeyRound className="w-3.5 h-3.5 mr-1" /> Reset Required
                        </span>
                      ) : (
                        <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Active
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/employees/${emp.id}`}
                      className="font-bold text-orange-600 hover:text-orange-700 hover:underline"
                    >
                      Manage Security &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
