'use client';

import React, { useEffect, useState } from 'react';
import { getIncomingDispatchesAction, receivePartnerDispatchAction } from '@/app/actions/partner';
import { Truck, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PartnerIncomingDispatchesPage() {
  const [dispatches, setDispatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIncoming = async () => {
    setLoading(true);
    const res = await getIncomingDispatchesAction();
    if (res.success && res.data) {
      setDispatches(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIncoming();
  }, []);

  const handleReceive = async (dispatchId: string) => {
    await receivePartnerDispatchAction(dispatchId, 'PARTNER_STAFF');
    fetchIncoming();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/partner/dashboard" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline inline-flex items-center">
              <ArrowLeft className="w-3 h-3 mr-1" /> Partner Dashboard
            </Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Incoming Dispatches</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Incoming Bus & Fleet Dispatches</h1>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200/60 dark:border-zinc-800">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">In-Transit & Arriving Dispatches</h3>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading incoming dispatches...</p>
        ) : dispatches.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No incoming dispatches currently assigned to this office.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-zinc-300">
              <thead className="bg-slate-50 dark:bg-zinc-950 text-slate-400 dark:text-zinc-500 uppercase text-[10px] tracking-wider border-b border-slate-200/80 dark:border-zinc-800 font-extrabold">
                <tr>
                  <th className="p-4">Manifest #</th>
                  <th className="p-4">Origin Office</th>
                  <th className="p-4">Vehicle</th>
                  <th className="p-4">Parcels</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-zinc-800/60 font-medium">
                {dispatches.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
                    <td className="p-4 font-mono font-extrabold text-slate-900 dark:text-white">{d.dispatchNumber}</td>
                    <td className="p-4 font-bold">{d.originOffice?.name || 'Origin'}</td>
                    <td className="p-4 font-mono">{d.vehicle?.registrationNumber || 'Bus Fleet'}</td>
                    <td className="p-4 font-extrabold text-amber-600 dark:text-amber-400">{d.bookings?.length || 0} Consignments</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        {d.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {d.status === 'ARRIVED' ? (
                        <span className="text-xs font-bold text-emerald-600 flex items-center justify-end">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Received
                        </span>
                      ) : (
                        <button
                          onClick={() => handleReceive(d.id)}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold transition inline-flex items-center shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Mark Received
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
