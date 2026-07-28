'use client';

import React, { useEffect, useState } from 'react';
import { getOperationalAlertsAction, acknowledgeAlertAction, resolveAlertAction } from '@/app/actions/admin/monitoring';
import { AlertCard } from '@/components/monitoring/AlertCard';
import { LiveStatusIndicator } from '@/components/monitoring/LiveStatusIndicator';
import { Bell, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function AlertManagementPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ active: 0, acknowledged: 0, resolved: 0, critical: 0 });
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    const res = await getOperationalAlertsAction();
    if (res.success && res.data) {
      setAlerts(res.data.alerts);
      setStats(res.data.stats);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAcknowledge = async (id: string) => {
    await acknowledgeAlertAction(id, 'SYSTEM_USER', 'Admin User');
    fetchAlerts();
  };

  const handleResolve = async (id: string) => {
    await resolveAlertAction(id, 'SYSTEM_USER', 'Admin User');
    fetchAlerts();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/admin/monitoring" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline">
              Operations
            </Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Alert Management</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Operational Alert Management Center</h1>
        </div>
        <LiveStatusIndicator />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Active Alerts</span>
          <span className="text-3xl font-black text-rose-600 dark:text-rose-400 block mt-1">{stats.active}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Acknowledged</span>
          <span className="text-3xl font-black text-amber-600 dark:text-amber-400 block mt-1">{stats.acknowledged}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Resolved Alerts</span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 block mt-1">{stats.resolved}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Critical Alerts</span>
          <span className="text-3xl font-black text-purple-600 dark:text-purple-400 block mt-1">{stats.critical}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xs">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Active & Acknowledged Alerts Feed</h3>
        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading operational alerts...</p>
        ) : alerts.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No active operational alerts detected. All network systems operating normally.</p>
        ) : (
          alerts.map(alt => (
            <AlertCard
              key={alt.id}
              alert={alt}
              onAcknowledge={handleAcknowledge}
              onResolve={handleResolve}
            />
          ))
        )}
      </div>
    </div>
  );
}
