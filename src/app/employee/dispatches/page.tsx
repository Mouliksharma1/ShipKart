import { getDispatchesAction as fetchDispatches } from "@/app/actions/dispatch";
import Link from "next/link";
import { Truck, Plus, Search, MapPin, Calendar, ArrowRight, ShieldAlert, CheckCircle2, Clock } from "lucide-react";
import { DispatchStatus } from "@prisma/client";

export default async function EmployeeDispatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status as DispatchStatus | undefined;
  const searchQuery = params.search || "";

  const res = await fetchDispatches({
    status: statusFilter,
    search: searchQuery,
  });

  const dispatches = res.dispatches || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-neutral-800 shadow-md">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            <Truck className="h-4 w-4" />
            <span>Counter Logistics & Operations</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Dispatch & Vehicle Manifests
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-neutral-400 max-w-xl">
            Create vehicle trip sheets, load LR parcels in bulk, manage departures, and print official A4 freight manifests.
          </p>
        </div>

        <Link
          href="/employee/dispatches/new"
          className="inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-amber-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>New Dispatch Run</span>
        </Link>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white dark:bg-neutral-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <form className="w-full md:w-96 relative">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            name="search"
            defaultValue={searchQuery}
            placeholder="Search DSP#, Vehicle#, Driver..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
          />
        </form>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 text-xs font-bold scrollbar-none">
          <Link
            href="/employee/dispatches"
            className={`px-4 py-2 rounded-xl border transition-all whitespace-nowrap ${
              !statusFilter
                ? "bg-slate-900 text-white border-slate-900 dark:bg-amber-500 dark:text-amber-950 dark:border-amber-500 shadow-sm"
                : "border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-400 hover:border-slate-300 dark:hover:border-neutral-700"
            }`}
          >
            All Runs
          </Link>
          {Object.values(DispatchStatus).map((st) => (
            <Link
              key={st}
              href={`/employee/dispatches?status=${st}`}
              className={`px-4 py-2 rounded-xl border transition-all whitespace-nowrap ${
                statusFilter === st
                  ? "bg-amber-500 text-amber-950 border-amber-500 shadow-sm font-extrabold"
                  : "border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-400 hover:border-slate-300 dark:hover:border-neutral-700"
              }`}
            >
              {st}
            </Link>
          ))}
        </div>
      </div>

      {/* DISPATCH LIST GRID */}
      {dispatches.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 p-16 rounded-3xl border border-slate-200/80 dark:border-neutral-800 text-center space-y-4 shadow-sm">
          <div className="h-16 w-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
            <Truck className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">No dispatches found</h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-sm mx-auto font-medium">
              No dispatch runs match your search or filter selection. Create a new vehicle manifest to get started.
            </p>
          </div>
          <Link
            href="/employee/dispatches/new"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-neutral-800 text-white font-bold text-xs hover:bg-slate-800 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Create First Dispatch</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dispatches.map((disp) => {
            const totalLr = disp.dispatchItems.length;

            return (
              <div
                key={disp.id}
                className="bg-white dark:bg-neutral-900 rounded-3xl border border-slate-200/80 dark:border-neutral-800 p-6 shadow-sm hover:shadow-md hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20 tracking-wider">
                      {disp.dispatchNumber}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border tracking-wide ${
                        disp.status === "CREATED"
                          ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/50"
                          : disp.status === "DEPARTED"
                          ? "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50"
                          : disp.status === "ARRIVED"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50"
                          : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700"
                      }`}
                    >
                      {disp.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-2.5">
                      <Truck className="h-5 w-5 text-amber-500 shrink-0" />
                      <span>{disp.vehicleNumber}</span>
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-neutral-400 mt-1">
                      Driver: {disp.driverName || "Not assigned"} {disp.driverPhone ? `(${disp.driverPhone})` : ""}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-100 dark:border-neutral-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-700 dark:text-neutral-300">
                      <span className="flex items-center space-x-1.5">
                        <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span>{disp.originOffice?.city || "Origin"}</span>
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      <span className="flex items-center space-x-1.5">
                        <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>{disp.destinationOffice?.city || "Destination"}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-neutral-800/80 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-black text-slate-900 dark:text-white text-sm">{totalLr}</span>{" "}
                    <span className="text-slate-400 text-xs font-medium">LRs Loaded</span>
                  </div>

                  <Link
                    href={`/employee/dispatches/${disp.id}`}
                    className="inline-flex items-center space-x-1.5 text-xs font-black text-amber-600 hover:text-amber-700 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Manage Trip Sheet</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
