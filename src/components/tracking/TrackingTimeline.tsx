"use client";

import React from "react";
import { CheckCircle2, Clock, MapPin, Building2, AlertCircle } from "lucide-react";
import { StatusBadge } from "@/components/tracking/StatusBadge";

export type TimelineEvent = {
  id: string;
  status: string;
  title: string;
  publicRemarks?: string | null;
  internalRemarks?: string | null;
  office?: { name: string; city: string } | null;
  createdAt: string | Date;
  receiverNameVerified?: string | null;
};

export type TrackingTimelineProps = {
  timeline: TimelineEvent[];
  currentStatus: string;
  expectedNextStep?: string;
  isStaff?: boolean;
};

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({
  timeline,
  currentStatus,
  expectedNextStep,
  isStaff = false,
}) => {
  return (
    <div className="space-y-6">
      {/* EXPECTED NEXT STEP BANNER */}
      {expectedNextStep && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong className="text-slate-900 dark:text-white uppercase tracking-wider font-black">Expected Next Step:</strong>{" "}
              {expectedNextStep}
            </span>
          </div>
          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 uppercase">
            In Progress
          </span>
        </div>
      )}

      {/* MILESTONE TIMELINE STEPS */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-neutral-800">
        {timeline.map((step, idx) => {
          const formattedTime = new Date(step.createdAt).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          const isLatest = idx === timeline.length - 1;

          return (
            <div key={step.id || idx} className="relative group">
              {/* Node Icon */}
              <div
                className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${
                  isLatest
                    ? "bg-amber-500 border-amber-400 text-amber-950 shadow-md ring-4 ring-amber-500/20"
                    : "bg-slate-100 dark:bg-neutral-900 border-slate-300 dark:border-neutral-700 text-slate-500 dark:text-neutral-400"
                }`}
              >
                {isLatest ? "✓" : "•"}
              </div>

              {/* Event Details Card */}
              <div className="bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800/80 p-4 rounded-2xl space-y-2 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm tracking-wide">
                      {step.title}
                    </span>
                    <StatusBadge status={step.status} size="sm" />
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-neutral-400 font-mono">
                    {formattedTime}
                  </span>
                </div>

                {step.office && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-neutral-300 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>
                      {step.office.name} ({step.office.city})
                    </span>
                  </div>
                )}

                {step.publicRemarks && (
                  <p className="text-xs text-slate-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 p-2.5 rounded-xl border border-slate-200 dark:border-neutral-800">
                    {step.publicRemarks}
                  </p>
                )}

                {/* INTERNAL REMARKS (STAFF ONLY) */}
                {isStaff && step.internalRemarks && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-300 space-y-0.5">
                    <span className="font-black text-[10px] uppercase text-amber-700 dark:text-amber-400 tracking-wider">
                      🔒 Staff Internal Note:
                    </span>
                    <p>{step.internalRemarks}</p>
                  </div>
                )}

                {step.receiverNameVerified && (
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold pt-1">
                    ✓ Verified Collection by:{" "}
                    <strong className="text-slate-900 dark:text-white">{step.receiverNameVerified}</strong>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
