"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  loadBookingsToDispatchAction,
  unloadBookingFromDispatchAction,
  updateDispatchStatusAction,
} from "@/app/actions/dispatch";
import { generateDispatchManifestHtml } from "@/lib/services/dispatch-pdf";
import {
  Truck,
  MapPin,
  Clock,
  Printer,
  Plus,
  Trash2,
  Lock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Package,
  Weight,
  UserCheck,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { DispatchStatus } from "@prisma/client";

export default function DispatchDetailClient({
  dispatch,
  summary,
}: {
  dispatch: any;
  summary: {
    totalLrCount: number;
    totalParcelCount: number;
    totalWeightKg: number;
    totalValue: number;
  };
}) {
  const router = useRouter();

  const [bulkLrInput, setBulkLrInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isLocked = [
    DispatchStatus.DEPARTED,
    DispatchStatus.ARRIVED,
    DispatchStatus.CLOSED,
    DispatchStatus.CANCELLED,
  ].includes(dispatch.status);

  // Bulk Load action
  const handleBulkLoad = async () => {
    if (!bulkLrInput.trim()) return;

    const extracted = bulkLrInput
      .split(/[\s,\n]+/)
      .map((lr) => lr.trim())
      .filter((lr) => lr.length > 0);

    if (extracted.length === 0) {
      setErrorMessage("No valid LR numbers found.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const res = await loadBookingsToDispatchAction({
      dispatchNumber: dispatch.dispatchNumber,
      lrNumbers: extracted,
    });

    setLoading(false);
    if (!res.success) {
      setErrorMessage(res.error || "Failed to load LRs.");
    } else {
      setSuccessMessage(res.message || "Loaded successfully.");
      setBulkLrInput("");
      router.refresh();
    }
  };

  // Unload Single LR
  const handleUnload = async (lrNumber: string) => {
    if (!confirm(`Are you sure you want to unload LR ${lrNumber} from this dispatch?`)) return;

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const res = await unloadBookingFromDispatchAction({
      dispatchNumber: dispatch.dispatchNumber,
      lrNumber,
    });

    setLoading(false);
    if (!res.success) {
      setErrorMessage(res.error || "Failed to unload LR.");
    } else {
      setSuccessMessage(res.message || "Unloaded successfully.");
      router.refresh();
    }
  };

  // Status transition
  const handleStatusChange = async (nextStatus: DispatchStatus) => {
    if (!confirm(`Change dispatch status to ${nextStatus}?`)) return;

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const res = await updateDispatchStatusAction({
      dispatchNumber: dispatch.dispatchNumber,
      nextStatus,
    });

    setLoading(false);
    if (!res.success) {
      setErrorMessage(res.error || "Failed to update status.");
    } else {
      setSuccessMessage(res.message || `Status updated to ${nextStatus}.`);
      router.refresh();
    }
  };

  // Print Manifest
  const handlePrintManifest = () => {
    const manifestData = {
      dispatchNumber: dispatch.dispatchNumber,
      vehicleNumber: dispatch.vehicleNumber,
      driverName: dispatch.driverName,
      driverPhone: dispatch.driverPhone,
      originOfficeName: dispatch.originOffice?.name || "Origin Office",
      destinationOfficeName: dispatch.destinationOffice?.name || "Destination Office",
      status: dispatch.status,
      createdAt: new Date(dispatch.createdAt).toLocaleDateString(),
      totalLrCount: summary.totalLrCount,
      totalParcelCount: summary.totalParcelCount,
      totalWeightKg: summary.totalWeightKg,
      totalValue: summary.totalValue,
      items: dispatch.dispatchItems.map((di: any) => ({
        lrNumber: di.booking.lrNumber,
        senderName: di.booking.senderName,
        senderPhone: di.booking.senderPhone,
        receiverName: di.booking.receiverName,
        receiverPhone: di.booking.receiverPhone,
        parcelTypes: di.booking.items.map((i: any) => i.parcelType).join(", "),
        quantity: di.booking.items.reduce((a: number, c: any) => a + c.quantity, 0),
        weightKg: Math.round(di.booking.items.reduce((a: number, c: any) => a + (c.weightKg || 1), 0) * 10) / 10,
        paymentType: di.booking.paymentType,
        totalAmount: di.booking.totalAmount,
        status: di.booking.status,
      })),
    };

    const html = generateDispatchManifestHtml(manifestData);
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* TOP HEADER */}
      <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-neutral-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20 tracking-wider">
              {dispatch.dispatchNumber}
            </span>
            <span
              className={`text-xs font-extrabold uppercase px-3.5 py-1 rounded-full border tracking-wide ${
                dispatch.status === "CREATED"
                  ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/50"
                  : dispatch.status === "DEPARTED"
                  ? "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50"
                  : dispatch.status === "ARRIVED"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50"
                  : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700"
              }`}
            >
              {dispatch.status}
            </span>
            {isLocked && (
              <span className="inline-flex items-center space-x-1 text-[11px] font-extrabold text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                <Lock className="h-3 w-3 shrink-0" />
                <span>Locked (Post-Departure)</span>
              </span>
            )}
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-3">
            <Truck className="h-7 w-7 text-amber-500 shrink-0" />
            <span>Vehicle: {dispatch.vehicleNumber}</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-neutral-400">
            Driver: <span className="font-bold text-slate-700 dark:text-neutral-200">{dispatch.driverName || "Not assigned"}</span> {dispatch.driverPhone ? `(${dispatch.driverPhone})` : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={handlePrintManifest}
            className="flex-1 md:flex-none inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-slate-900 text-white dark:bg-neutral-800 hover:bg-slate-800 dark:hover:bg-neutral-700 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print Manifest PDF</span>
          </button>

          {/* STATUS ACTION BUTTONS */}
          {dispatch.status === DispatchStatus.CREATED && (
            <button
              disabled={loading || summary.totalLrCount === 0}
              onClick={() => handleStatusChange(DispatchStatus.DEPARTED)}
              className="flex-1 md:flex-none inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-amber-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Truck className="h-4 w-4" />
              <span>Depart Vehicle</span>
            </button>
          )}

          {dispatch.status === DispatchStatus.DEPARTED && (
            <button
              disabled={loading}
              onClick={() => handleStatusChange(DispatchStatus.ARRIVED)}
              className="flex-1 md:flex-none inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-amber-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4 stroke-[3]" />
              <span>Mark Arrived at Dest</span>
            </button>
          )}

          {dispatch.status === DispatchStatus.ARRIVED && (
            <button
              disabled={loading}
              onClick={() => handleStatusChange(DispatchStatus.CLOSED)}
              className="flex-1 md:flex-none inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-amber-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4 stroke-[3]" />
              <span>Close Manifest & Ready Collection</span>
            </button>
          )}
        </div>
      </div>

      {/* MESSAGES */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-xs font-bold flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* DIRECTIVE 6: MANIFEST SUMMARY METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm space-y-2">
          <span className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest">Loaded LRs</span>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{summary.totalLrCount}</p>
          <span className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium">SK Format Standard</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm space-y-2">
          <span className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest">Total Parcels</span>
          <p className="text-3xl font-black text-amber-600 dark:text-amber-400 tracking-tight">{summary.totalParcelCount}</p>
          <span className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium">Individual Items / Boxes</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm space-y-2">
          <span className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest">Total Weight</span>
          <p className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight">{summary.totalWeightKg} kg</p>
          <span className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium">Est. Consignment Weight</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm space-y-2">
          <span className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest">Freight Value</span>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">₹{summary.totalValue}</p>
          <span className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium">Paid + To Pay Total</span>
        </div>
      </div>

      {/* DIRECTIVE 5: BULK LOADING INTERFACE (IF UNLOCKED) */}
      {!isLocked && (
        <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-neutral-800 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">
            Bulk Load Additional LR Numbers
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Paste LR Numbers (e.g. 0001 0002 0003)"
              value={bulkLrInput}
              onChange={(e) => setBulkLrInput(e.target.value)}
              className="flex-1 px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              onClick={handleBulkLoad}
              disabled={loading || !bulkLrInput.trim()}
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-amber-950 font-black text-xs rounded-2xl transition-all shadow-md cursor-pointer disabled:opacity-50 shrink-0"
            >
              Load Selected LRs
            </button>
          </div>
        </div>
      )}

      {/* MANIFEST ITEMS TABLE */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-slate-200/80 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
            Trip Sheet Manifest Items ({dispatch.dispatchItems.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono font-semibold">SK LR Format Standard</span>
        </div>

        {dispatch.dispatchItems.length === 0 ? (
          <div className="p-16 text-center text-slate-400 dark:text-neutral-500 text-xs font-medium space-y-2">
            <Package className="h-10 w-10 mx-auto text-slate-300 dark:text-neutral-700" />
            <p>No parcels loaded into this dispatch trip sheet yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-neutral-950 text-slate-500 dark:text-neutral-400 uppercase font-black text-[10px] tracking-wider border-b border-slate-100 dark:border-neutral-800">
                <tr>
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">LR Number</th>
                  <th className="px-6 py-4">Sender</th>
                  <th className="px-6 py-4">Receiver</th>
                  <th className="px-6 py-4 text-center">Items</th>
                  <th className="px-6 py-4 text-right">Freight</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  {!isLocked && <th className="px-6 py-4 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800 font-medium">
                {dispatch.dispatchItems.map((item: any, idx: number) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-neutral-950/60 transition-colors">
                    <td className="px-6 py-4 text-slate-400 font-bold">{idx + 1}</td>
                    <td className="px-6 py-4 font-mono font-black text-amber-600 dark:text-amber-400">
                      <Link href={`/employee/bookings/${item.booking.lrNumber}`} className="hover:underline">
                        {item.booking.lrNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{item.booking.senderName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.booking.senderPhone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{item.booking.receiverName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.booking.receiverPhone}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-slate-700 dark:text-neutral-300">
                        {item.booking.items.reduce((a: number, c: any) => a + c.quantity, 0)} Pcs
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-emerald-600 dark:text-emerald-400">
                      ₹{item.booking.totalAmount}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-neutral-800 text-[10px] font-extrabold text-slate-600 dark:text-neutral-300">
                        {item.booking.status}
                      </span>
                    </td>
                    {!isLocked && (
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleUnload(item.booking.lrNumber)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                          title="Unload LR from Dispatch"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    )}
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
