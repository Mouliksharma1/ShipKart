"use client";

import React, { useState } from "react";
import { createRouteAction, updateRouteAction, toggleRouteStatusAction } from "@/app/actions/offices-routes";
import { Route, Plus, Search, Edit3, Power, CheckCircle2, XCircle, ArrowRight, Shield } from "lucide-react";

interface Office {
  id: string;
  name: string;
  city: string;
  state: string;
}

interface PricingGroup {
  id: string;
  name: string;
}

interface RouteItem {
  id: string;
  originOfficeId: string;
  destinationOfficeId: string;
  originOffice: Office;
  destinationOffice: Office;
  distanceKm: number;
  etaHours: number;
  operatingDays: string;
  departureTime?: string | null;
  arrivalTime?: string | null;
  status: boolean;
  routeStatus: string;
  pricingGroupId?: string | null;
  pricingGroup?: PricingGroup | null;
}

export default function AdminRoutesClient({
  initialRoutes,
  offices,
  pricingGroups,
}: {
  initialRoutes: RouteItem[];
  offices: Office[];
  pricingGroups: PricingGroup[];
}) {
  const [routes, setRoutes] = useState<RouteItem[]>(initialRoutes);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form state
  const [originOfficeId, setOriginOfficeId] = useState(offices[0]?.id || "");
  const [destinationOfficeId, setDestinationOfficeId] = useState(offices[1]?.id || "");
  const [distanceKm, setDistanceKm] = useState(300);
  const [etaHours, setEtaHours] = useState(6);
  const [operatingDays, setOperatingDays] = useState("Daily");
  const [departureTime, setDepartureTime] = useState("08:00 PM");
  const [arrivalTime, setArrivalTime] = useState("06:00 AM");
  const [pricingGroupId, setPricingGroupId] = useState(pricingGroups[0]?.id || "");
  const [routeStatus, setRouteStatus] = useState("ACTIVE");

  const openCreateModal = () => {
    setEditingRoute(null);
    setOriginOfficeId(offices[0]?.id || "");
    setDestinationOfficeId(offices[1]?.id || "");
    setDistanceKm(300);
    setEtaHours(6);
    setOperatingDays("Daily");
    setDepartureTime("08:00 PM");
    setArrivalTime("06:00 AM");
    setPricingGroupId(pricingGroups[0]?.id || "");
    setRouteStatus("ACTIVE");
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (r: RouteItem) => {
    setEditingRoute(r);
    setOriginOfficeId(r.originOfficeId);
    setDestinationOfficeId(r.destinationOfficeId);
    setDistanceKm(r.distanceKm);
    setEtaHours(r.etaHours);
    setOperatingDays(r.operatingDays);
    setDepartureTime(r.departureTime || "08:00 PM");
    setArrivalTime(r.arrivalTime || "06:00 AM");
    setPricingGroupId(r.pricingGroupId || "");
    setRouteStatus(r.routeStatus || "ACTIVE");
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const payload = {
      originOfficeId,
      destinationOfficeId,
      distanceKm: Number(distanceKm),
      etaHours: Number(etaHours),
      operatingDays,
      departureTime,
      arrivalTime,
      routeStatus,
      pricingGroupId: pricingGroupId || undefined,
      status: routeStatus === "ACTIVE",
    };

    const res = editingRoute
      ? await updateRouteAction(editingRoute.id, payload)
      : await createRouteAction(payload);

    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || "Operation failed.");
    } else {
      setIsModalOpen(false);
      window.location.reload();
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await toggleRouteStatusAction(id, currentStatus);
    setRoutes(routes.map(r => r.id === id ? { ...r, status: !currentStatus, routeStatus: !currentStatus ? "ACTIVE" : "INACTIVE" } : r));
  };

  const filteredRoutes = routes.filter(r =>
    r.originOffice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.destinationOffice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.originOffice.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.destinationOffice.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2">
            <Shield className="h-3.5 w-3.5" />
            <span>ADMIN CONTROL CENTER</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Route Master Management</h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400">Configure origin & destination pairings, ETA, distance, schedules, and pricing group bindings.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center space-x-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-amber-950 shadow-md hover:bg-amber-400 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Route</span>
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative col-span-1 sm:col-span-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search origin or destination city..."
            className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-3.5 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">Total Routes</span>
          <span className="text-lg font-black text-slate-900 dark:text-white">{routes.length}</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-3.5 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">Active Routes</span>
          <span className="text-lg font-black text-green-600 dark:text-green-400">{routes.filter(r => r.status).length}</span>
        </div>
      </div>

      {/* Routes Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-neutral-950 text-slate-600 dark:text-neutral-400 font-bold border-b border-slate-200 dark:border-neutral-800 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Origin Office</th>
                <th className="py-3.5 px-4">Destination Office</th>
                <th className="py-3.5 px-4">Distance & ETA</th>
                <th className="py-3.5 px-4">Timings / Days</th>
                <th className="py-3.5 px-4">Pricing Group</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-neutral-800 text-slate-800 dark:text-neutral-200">
              {filteredRoutes.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-neutral-950/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    <div>{r.originOffice.name}</div>
                    <span className="text-[10px] text-slate-400">{r.originOffice.city}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center space-x-1">
                      <ArrowRight className="h-3 w-3 text-amber-500 shrink-0" />
                      <span>{r.destinationOffice.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 pl-4">{r.destinationOffice.city}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <div>{r.distanceKm} KM</div>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400">ETA: {r.etaHours} Hours</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div>{r.departureTime} &rarr; {r.arrivalTime}</div>
                    <span className="text-[10px] text-slate-400">{r.operatingDays}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block rounded px-2 py-0.5 text-[10px] font-semibold bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300">
                      {r.pricingGroup?.name || "Standard Group"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {r.status ? (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{r.routeStatus}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                        <XCircle className="h-3 w-3" />
                        <span>INACTIVE</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(r)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 hover:text-amber-500 transition-colors"
                      title="Edit Route"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(r.id, r.status)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        r.status ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                      }`}
                      title={r.status ? "Disable Route" : "Enable Route"}
                    >
                      <Power className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT ROUTE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingRoute ? "Edit Transport Route" : "Create New Transport Route"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-neutral-300 mb-1">Origin Office *</label>
                  <select
                    value={originOfficeId}
                    onChange={(e) => setOriginOfficeId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2 px-3 text-slate-900 dark:text-white"
                  >
                    {offices.map((o) => (
                      <option key={o.id} value={o.id}>{o.name} ({o.city})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-neutral-300 mb-1">Destination Office *</label>
                  <select
                    value={destinationOfficeId}
                    onChange={(e) => setDestinationOfficeId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2 px-3 text-slate-900 dark:text-white"
                  >
                    {offices.map((o) => (
                      <option key={o.id} value={o.id}>{o.name} ({o.city})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-neutral-300 mb-1">Distance (KM) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2 px-3 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-neutral-300 mb-1">Estimated Time (Hours) *</label>
                  <input
                    type="number"
                    required
                    min="0.5"
                    step="0.5"
                    value={etaHours}
                    onChange={(e) => setEtaHours(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2 px-3 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-neutral-300 mb-1">Departure Time</label>
                  <input
                    type="text"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    placeholder="e.g. 08:00 PM"
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2 px-3 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-neutral-300 mb-1">Arrival Time</label>
                  <input
                    type="text"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    placeholder="e.g. 06:00 AM"
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2 px-3 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-neutral-300 mb-1">Pricing Group</label>
                  <select
                    value={pricingGroupId}
                    onChange={(e) => setPricingGroupId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2 px-3 text-slate-900 dark:text-white"
                  >
                    <option value="">Default Tariff</option>
                    {pricingGroups.map((pg) => (
                      <option key={pg.id} value={pg.id}>{pg.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-neutral-300 mb-1">Route Status</label>
                  <select
                    value={routeStatus}
                    onChange={(e) => setRouteStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2 px-3 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="TEMPORARILY_CLOSED">TEMPORARILY CLOSED</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-amber-500 text-amber-950 font-bold shadow-md hover:bg-amber-400 transition-colors"
                >
                  {loading ? "Saving..." : editingRoute ? "Save Changes" : "Create Route"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
