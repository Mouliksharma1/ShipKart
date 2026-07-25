import React from "react";
import { BookingStatus } from "@prisma/client";

export type StatusBadgeProps = {
  status: BookingStatus | string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
  className = "",
}) => {
  const getColors = (st: string) => {
    switch (st) {
      case "BOOKED":
      case "DRAFT":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "PICKUP_REQUESTED":
      case "RECEIVED_AT_ORIGIN":
      case "RECEIVED_AT_ORIGIN_OFFICE":
        return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
      case "SORTED":
      case "LOADED":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
      case "IN_TRANSIT":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "ARRIVED_AT_DESTINATION":
      case "ARRIVED_AT_DESTINATION_OFFICE":
      case "UNLOADED":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "READY_FOR_COLLECTION":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "COLLECTED":
      case "COMPLETED":
        return "bg-green-600/10 text-green-700 dark:text-green-400 border-green-600/20";
      case "CANCELLED":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "DELAYED":
      case "HOLD":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
      case "RETURN_REQUESTED":
      case "RETURN_IN_TRANSIT":
      case "RETURNED_TO_ORIGIN":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
    }
  };

  const sizeClasses =
    size === "sm"
      ? "text-[10px] px-2 py-0.5"
      : size === "lg"
      ? "text-xs px-3.5 py-1.5 font-black"
      : "text-[11px] px-2.5 py-1 font-bold";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border uppercase tracking-wider ${sizeClasses} ${getColors(
        String(status)
      )} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      <span>{String(status).replace(/_/g, " ")}</span>
    </span>
  );
};
