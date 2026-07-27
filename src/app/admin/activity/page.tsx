import React from 'react';
import { getActivityLogs } from '@/lib/services/admin/activity.service';
import { Activity, ShieldAlert, FileSpreadsheet, Filter } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminActivityPage() {
  const res = await getActivityLogs({ limit: 50 });
  const logs = res.items || [];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/admin" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline">
              Admin
            </Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Audit Logs</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Immutable Enterprise Activity Log & Audit Trail</h1>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-zinc-800/60 border-b border-slate-200/80 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
                <th className="p-4">Activity No</th>
                <th className="p-4">Action & Details</th>
                <th className="p-4">Module & Entity</th>
                <th className="p-4">User</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-medium text-slate-700 dark:text-zinc-300">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{log.activityNumber || 'ACT-SYS'}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{log.action}</div>
                    {log.ipAddress && <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">IP: {log.ipAddress}</div>}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full font-extrabold text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                      {log.module}
                    </span>
                    <div className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">{log.entity}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-800 dark:text-zinc-200">{log.user?.name || 'System / Service'}</div>
                    <div className="text-[11px] text-slate-400 dark:text-zinc-500">{log.userRole || log.user?.role || 'N/A'}</div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                        log.severity === 'CRITICAL'
                          ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60'
                          : log.severity === 'ERROR'
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
                          : log.severity === 'WARNING'
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-[11px] text-slate-400 dark:text-zinc-500">
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
