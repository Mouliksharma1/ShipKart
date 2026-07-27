import React from 'react';
import { getActivityLogs } from '@/lib/services/admin/activity.service';
import { Activity, ShieldAlert, FileSpreadsheet, Filter } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminActivityPage() {
  const res = await getActivityLogs({ limit: 50 });
  const logs = res.items || [];

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/admin" className="text-xs text-orange-600 font-bold hover:underline">
              Admin
            </Link>
            <span className="text-xs text-slate-300">/</span>
            <span className="text-xs text-slate-500 font-semibold">Audit Logs</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Immutable Enterprise Activity Log & Audit Trail</h1>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Activity No</th>
                <th className="p-4">Action & Details</th>
                <th className="p-4">Module & Entity</th>
                <th className="p-4">User</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-900">{log.activityNumber || 'ACT-SYS'}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{log.action}</div>
                    {log.ipAddress && <div className="text-[10px] text-slate-400 font-mono">IP: {log.ipAddress}</div>}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full font-extrabold text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                      {log.module}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-1">{log.entity}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-800">{log.user?.name || 'System / Service'}</div>
                    <div className="text-[11px] text-slate-400">{log.userRole || log.user?.role || 'N/A'}</div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        log.severity === 'CRITICAL'
                          ? 'bg-purple-100 text-purple-800'
                          : log.severity === 'ERROR'
                          ? 'bg-rose-100 text-rose-800'
                          : log.severity === 'WARNING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-[11px] text-slate-400">
                    {new Date(log.createdAt).toLocaleString('en-IN')}
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
