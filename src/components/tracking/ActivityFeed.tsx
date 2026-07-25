"use client";

import React from "react";
import { Activity, Clock, Building2, User } from "lucide-react";
import { StatusBadge } from "@/components/tracking/StatusBadge";

export type ActivityEvent = {
  id: string;
  lrNumber: string;
  status: string;
  title: string;
  publicRemarks?: string | null;
  officeName: string;
  officeCity: string;
  staffName: string;
  createdAt: string | Date;
};

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  if (!events || events.length === 0) {
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 text-center text-xs text-slate-400 dark:text-neutral-500">
        No recent tracking activity recorded yet.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 p-6 rounded-3xl shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500" />
          <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Live Office Activity Audit Stream
          </h2>
        </div>
        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          Latest 20 Events
        </span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-neutral-800 text-xs space-y-3">
        {events.map((e) => {
          const formattedTime = new Date(e.createdAt).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div key={e.id} className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-xs">{e.lrNumber}</span>
                  <StatusBadge status={e.status} size="sm" />
                </div>
                <p className="text-slate-700 dark:text-neutral-200 font-medium">{e.publicRemarks || e.title}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-blue-500" />
                    {e.officeName} ({e.officeCity})
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    {e.staffName}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 shrink-0" suppressHydrationWarning>
                <Clock className="w-3 h-3 text-slate-400" />
                {formattedTime}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
