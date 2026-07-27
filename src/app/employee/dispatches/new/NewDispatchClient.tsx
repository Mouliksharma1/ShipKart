"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDispatchAction } from "@/app/actions/dispatch";
import { Truck, PlusCircle, Trash2, QrCode, Search, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface OfficeOption {
  id: string;
  name: string;
  city: string;
}

export default function NewDispatchClient({ offices }: { offices: OfficeOption[] }) {
  const router = useRouter();

  const [originOfficeId, setOriginOfficeId] = useState(offices[0]?.id || "");
  const [destinationOfficeId, setDestinationOfficeId] = useState(offices[1]?.id || offices[0]?.id || "");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");

  const [lrInput, setLrInput] = useState("");
  const [lrList, setLrList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle Bulk LR addition (space, comma, or newline separated)
  const handleAddLrs = () => {
    const text = lrInput.trim();
    if (!text) return;

    const extracted = text
      .split(/[\s,\n]+/)
      .map((lr) => lr.trim())
      .filter((lr) => lr.length > 0);

    if (extracted.length === 0) {
      setErrorMessage("No valid LR numbers entered.");
      return;
    }

    setErrorMessage("");
    setLrList((prev) => Array.from(new Set([...prev, ...extracted])));
    setLrInput("");
  };

  const handleRemoveLr = (lr: string) => {
    setLrList((prev) => prev.filter((item) => item !== lr));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originOfficeId || !destinationOfficeId) {
      setErrorMessage("Please select origin and destination office counters.");
      return;
    }
    if (originOfficeId === destinationOfficeId) {
      setErrorMessage("Origin and Destination offices cannot be identical.");
      return;
    }
    if (!vehicleNumber.trim()) {
      setErrorMessage("Vehicle registration number is required.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await createDispatchAction({
        originOfficeId,
        destinationOfficeId,
        vehicleNumber,
        driverName,
        driverPhone,
        initialLrNumbers: lrList,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to create dispatch.");
        setLoading(false);
        return;
      }

      router.push(`/employee/dispatches/${res.dispatchId}`);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <Truck className="h-4 w-4" />
            <span>Trip Sheet Creation</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Create New Dispatch Run
          </h1>
          <p className="text-xs text-slate-500">
            Dispatch numbers (DSP000000001) are automatically generated upon save.
          </p>
        </div>

        <Link
          href="/employee/dispatches"
          className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          Cancel
        </Link>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-xs font-bold flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* VEHICLE & ROUTE SELECTION */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-neutral-800 pb-2">
            1. Route & Vehicle Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                Origin Office Counter *
              </label>
              <select
                value={originOfficeId}
                onChange={(e) => setOriginOfficeId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              >
                {offices.map((off) => (
                  <option key={off.id} value={off.id}>
                    {off.name} ({off.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                Destination Office Counter *
              </label>
              <select
                value={destinationOfficeId}
                onChange={(e) => setDestinationOfficeId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              >
                {offices.map((off) => (
                  <option key={off.id} value={off.id}>
                    {off.name} ({off.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                Vehicle Registration Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. RJ19 PA 1234"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                  Driver Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">
                  Driver Phone
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9829012345"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* BULK PARCEL ATTACHMENT */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              2. Bulk Load SK LR Consignments
            </h3>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md">
              {lrList.length} LRs Queued
            </span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300">
            Scan QR or Paste Multiple LR Numbers (Space, Comma, or Line Separated)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <textarea
                rows={3}
                placeholder="Paste LR Numbers (e.g. 0001 0002 0003)"
                value={lrInput}
                onChange={(e) => setLrInput(e.target.value)}
                className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddLrs();
                }}
                className="sm:w-28 py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-amber-950 font-black text-xs rounded-xl self-stretch sm:self-auto flex items-center justify-center transition-all shadow-md cursor-pointer shrink-0 z-10"
              >
                Add LRs
              </button>
            </div>
          </div>

          {/* QUEUED LRs LIST */}
          {lrList.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800">
                {lrList.map((lr) => (
                  <span
                    key={lr}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-xs font-mono font-bold text-slate-900 dark:text-white shadow-xs"
                  >
                    <span>{lr}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLr(lr)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-black text-base shadow-lg transition-all active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? "Creating Dispatch Run & Validating LRs..." : "Create Dispatch Run & Load LRs"}
        </button>
      </form>
    </div>
  );
}
