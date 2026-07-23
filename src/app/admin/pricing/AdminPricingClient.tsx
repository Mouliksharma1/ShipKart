"use client";

import React, { useState } from "react";
import {
  createPricingGroupAction,
  updatePricingGroupAction,
  togglePricingGroupStatusAction,
  duplicatePricingGroupAction,
  deletePricingGroupAction,
  calculatePriceAction,
} from "@/app/actions/pricing";
import { ParcelType, PickupMethod } from "@prisma/client";
import {
  DollarSign,
  Plus,
  Search,
  Edit3,
  Copy,
  Trash2,
  Power,
  Calculator,
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Info,
} from "lucide-react";

interface PricingRuleItem {
  id?: string;
  parcelType: ParcelType;
  selfPrice: number;
  taxiPrice: number | null;
  displayOrder: number;
}

interface PricingGroupItem {
  id: string;
  name: string;
  description?: string | null;
  isRajasthan: boolean;
  status: boolean;
  pricingRules: PricingRuleItem[];
  _count?: {
    routes: number;
    destOffices: number;
  };
}

interface OfficeOption {
  id: string;
  name: string;
  city: string;
  state: string;
}

export default function AdminPricingClient({
  initialGroups,
  offices,
}: {
  initialGroups: PricingGroupItem[];
  offices: OfficeOption[];
}) {
  const [groups, setGroups] = useState<PricingGroupItem[]>(initialGroups);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<PricingGroupItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isRajasthan, setIsRajasthan] = useState(true);
  const [status, setStatus] = useState(true);

  // Default Normalized Rules (Envelope, Box, Medium, Large)
  const [rules, setRules] = useState<PricingRuleItem[]>([
    { parcelType: ParcelType.ENVELOPE, selfPrice: 99, taxiPrice: null, displayOrder: 1 },
    { parcelType: ParcelType.BOX, selfPrice: 149, taxiPrice: 169, displayOrder: 2 },
    { parcelType: ParcelType.MEDIUM_PARCEL, selfPrice: 199, taxiPrice: 219, displayOrder: 3 },
    { parcelType: ParcelType.LARGE_BUNDLE, selfPrice: 249, taxiPrice: 269, displayOrder: 4 },
  ]);

  // LIVE CALCULATOR SIMULATOR STATE
  const headOffice = offices.find(o => o.name.includes("Head Office") || o.city === "Jodhpur") || offices[0];
  const firstBranch = offices.find(o => o.id !== headOffice?.id) || offices[1] || offices[0];

  const [calcOrigin, setCalcOrigin] = useState(headOffice?.id || offices[0]?.id || "");
  const [calcDest, setCalcDest] = useState(firstBranch?.id || offices[1]?.id || "");
  const [calcParcel, setCalcParcel] = useState<ParcelType>(ParcelType.BOX);
  const [calcPickup, setCalcPickup] = useState<PickupMethod>(PickupMethod.SELF_DROP);
  const [calcQty, setCalcQty] = useState(5);
  const [calcPickupDist, setCalcPickupDist] = useState(3.0);
  const [calcResult, setCalcResult] = useState<any | null>(null);
  const [calcLoading, setCalcLoading] = useState(false);

  const openCreateModal = () => {
    setEditingGroup(null);
    setName("");
    setDescription("");
    setIsRajasthan(true);
    setStatus(true);
    setRules([
      { parcelType: ParcelType.ENVELOPE, selfPrice: 99, taxiPrice: null, displayOrder: 1 },
      { parcelType: ParcelType.BOX, selfPrice: 149, taxiPrice: 169, displayOrder: 2 },
      { parcelType: ParcelType.MEDIUM_PARCEL, selfPrice: 199, taxiPrice: 219, displayOrder: 3 },
      { parcelType: ParcelType.LARGE_BUNDLE, selfPrice: 249, taxiPrice: 269, displayOrder: 4 },
    ]);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (group: PricingGroupItem) => {
    setEditingGroup(group);
    setName(group.name);
    setDescription(group.description || "");
    setIsRajasthan(group.isRajasthan);
    setStatus(group.status);
    
    // Ensure all 4 parcel types exist in editable state
    const sortedRules = [...group.pricingRules].sort((a, b) => a.displayOrder - b.displayOrder);
    setRules(sortedRules);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleRuleChange = (index: number, field: "selfPrice" | "taxiPrice", value: string) => {
    const updated = [...rules];
    if (field === "taxiPrice" && value === "") {
      updated[index].taxiPrice = null;
    } else {
      const num = parseFloat(value) || 0;
      updated[index][field] = num;
    }
    setRules(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const payload = {
      name,
      description,
      isRajasthan,
      status,
      rules,
    };

    const res = editingGroup
      ? await updatePricingGroupAction(editingGroup.id, payload)
      : await createPricingGroupAction(payload);

    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || "Operation failed.");
    } else {
      setIsModalOpen(false);
      window.location.reload();
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await togglePricingGroupStatusAction(id, currentStatus);
    setGroups(groups.map(g => g.id === id ? { ...g, status: !currentStatus } : g));
  };

  const handleDuplicate = async (id: string) => {
    const res = await duplicatePricingGroupAction(id);
    if (res.success) window.location.reload();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this pricing group?")) {
      const res = await deletePricingGroupAction(id);
      if (!res.success) alert(res.error);
      else setGroups(groups.filter(g => g.id !== id));
    }
  };

  const handleSimulateCalculation = async () => {
    setCalcLoading(true);
    const result = await calculatePriceAction({
      originOfficeId: calcOrigin,
      destinationOfficeId: calcDest,
      parcelType: calcParcel,
      pickupMethod: calcPickup,
      quantity: Number(calcQty),
      pickupDistanceKm: Number(calcPickupDist),
    });
    setCalcLoading(false);
    setCalcResult(result);
  };

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (g.description && g.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2">
            <Shield className="h-3.5 w-3.5" />
            <span>DYNAMIC PRICING ENGINE</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Tariff & Pricing Master</h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400">Configure database-driven pricing groups, itemized parcel surcharges, and test calculations.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center space-x-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-amber-950 shadow-md hover:bg-amber-400 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Pricing Group</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-4 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">Total Tariffs</span>
          <span className="text-xl font-black text-slate-900 dark:text-white">{groups.length}</span>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-4 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">Rajasthan Groups</span>
          <span className="text-xl font-black text-amber-600 dark:text-amber-400">{groups.filter(g => g.isRajasthan).length}</span>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-4 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">Outside Rajasthan</span>
          <span className="text-xl font-black text-blue-600 dark:text-blue-400">{groups.filter(g => !g.isRajasthan).length}</span>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-4 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">Active Tariffs</span>
          <span className="text-xl font-black text-green-600 dark:text-green-400">{groups.filter(g => g.status).length}</span>
        </div>
      </div>

      {/* INTERACTIVE LIVE PRICE CALCULATOR SANDBOX */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/5 via-amber-500/10 to-amber-500/5 p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
          <Calculator className="h-4 w-4" />
          <span>LIVE PRICING CALCULATOR SANDBOX</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-neutral-300 font-semibold mb-1">Origin Office</label>
            <select
              value={calcOrigin}
              onChange={(e) => setCalcOrigin(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-2 text-slate-900 dark:text-white"
            >
              {offices.map(o => (
                <option key={o.id} value={o.id}>{o.name} ({o.city})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-neutral-300 font-semibold mb-1">Destination Office</label>
            <select
              value={calcDest}
              onChange={(e) => setCalcDest(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-2 text-slate-900 dark:text-white"
            >
              {offices.map(o => (
                <option key={o.id} value={o.id}>{o.name} ({o.city})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-neutral-300 font-semibold mb-1">Parcel Type</label>
            <select
              value={calcParcel}
              onChange={(e) => setCalcParcel(e.target.value as ParcelType)}
              className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-2 text-slate-900 dark:text-white font-bold"
            >
              <option value="ENVELOPE">ENVELOPE</option>
              <option value="BOX">BOX</option>
              <option value="MEDIUM_PARCEL">MEDIUM PARCEL</option>
              <option value="LARGE_BUNDLE">LARGE BUNDLE</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-neutral-300 font-semibold mb-1">Pickup Method</label>
            <select
              value={calcPickup}
              onChange={(e) => setCalcPickup(e.target.value as PickupMethod)}
              className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-2 text-slate-900 dark:text-white font-bold"
            >
              <option value="SELF_DROP">SELF DROP</option>
              <option value="TAXI_PICKUP">TAXI PICKUP</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-neutral-300 font-semibold mb-1">Customer Dist (KM)</label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={calcPickupDist}
              onChange={(e) => setCalcPickupDist(Number(e.target.value))}
              placeholder="e.g. 3.0"
              className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-2 text-slate-900 dark:text-white font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-neutral-300 font-semibold mb-1">Quantity</label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="1"
                value={calcQty}
                onChange={(e) => setCalcQty(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-2 text-slate-900 dark:text-white font-bold"
              />
              <button
                onClick={handleSimulateCalculation}
                disabled={calcLoading}
                className="px-3 py-2 rounded-xl bg-amber-500 text-amber-950 font-bold hover:bg-amber-400 transition-colors shrink-0"
              >
                {calcLoading ? "..." : "Calculate"}
              </button>
            </div>
          </div>
        </div>

        {/* Calculation Result Display */}
        {calcResult && (
          <div className="rounded-xl border border-amber-500/40 bg-white dark:bg-neutral-900 p-4 space-y-2 text-xs">
            {calcResult.success ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      Grand Total: ₹{calcResult.grandTotal}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
                      {calcResult.pricingGroupName} ({calcResult.resolutionStage})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                    Unit Price: ₹{calcResult.unitPrice} × {calcResult.quantity} items | Subtotal: ₹{calcResult.subtotal} | Taxi Charge: ₹{calcResult.pickupCharge}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center space-x-1 text-[11px] font-semibold ${calcResult.taxiEligible ? "text-green-600" : "text-amber-500"}`}>
                    <Info className="h-3.5 w-3.5" />
                    <span>{calcResult.taxiMessage}</span>
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-red-500 font-bold">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{calcResult.error}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* PRICING GROUPS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-5 space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{group.name}</h3>
                  <span className="text-[11px] text-slate-500 dark:text-neutral-400">
                    {group.isRajasthan ? "Rajasthan Region Tariff" : "Outside Rajasthan Tariff"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {group.status ? (
                    <span className="text-[10px] font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">ACTIVE</span>
                  ) : (
                    <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">DISABLED</span>
                  )}
                </div>
              </div>

              {/* Normalized Rules Table */}
              <div className="rounded-xl border border-slate-200 dark:border-neutral-800 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 dark:bg-neutral-950 text-slate-600 dark:text-neutral-400 font-bold border-b border-slate-200 dark:border-neutral-800">
                    <tr>
                      <th className="py-2 px-3">Parcel Type</th>
                      <th className="py-2 px-3">Self Drop</th>
                      <th className="py-2 px-3">Taxi Pickup</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-neutral-800">
                    {group.pricingRules.map((rule) => (
                      <tr key={rule.parcelType}>
                        <td className="py-2 px-3 font-semibold text-slate-800 dark:text-neutral-200">
                          {rule.parcelType}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-900 dark:text-white font-bold">
                          ₹{rule.selfPrice}
                        </td>
                        <td className="py-2 px-3 font-mono">
                          {rule.taxiPrice !== null ? (
                            <span className="text-amber-600 dark:text-amber-400 font-bold">₹{rule.taxiPrice}</span>
                          ) : (
                            <span className="text-slate-400 dark:text-neutral-600 font-semibold italic text-[11px]">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-neutral-800 text-xs">
              <span className="text-[11px] text-slate-400">
                Assigned Routes: {group._count?.routes || 0}
              </span>

              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(group)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 hover:text-amber-500"
                  title="Edit Tariff"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDuplicate(group.id)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 hover:text-blue-500"
                  title="Duplicate Group"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleToggleStatus(group.id, group.status)}
                  className={`p-1.5 rounded-lg ${group.status ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-600"}`}
                  title={group.status ? "Disable Tariff" : "Enable Tariff"}
                >
                  <Power className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(group.id)}
                  className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20"
                  title="Delete Group"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT TARIFF MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingGroup ? "Edit Pricing Tariff Group" : "Create New Pricing Tariff Group"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-neutral-300 mb-1">Pricing Group Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rajasthan Express Group"
                  className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2 px-3 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-neutral-300 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tariff scope description"
                  className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2 px-3 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isRajasthan}
                    onChange={(e) => setIsRajasthan(e.target.checked)}
                    className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="font-semibold text-slate-800 dark:text-neutral-200">Inside Rajasthan Region</span>
                </label>
              </div>

              {/* Normalized Rules Surcharges Inputs */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-neutral-800 pb-1">
                  Parcel Tariff Rules (Normalized)
                </h4>

                {rules.map((r, idx) => (
                  <div key={r.parcelType} className="grid grid-cols-3 gap-3 items-center bg-slate-50 dark:bg-neutral-950 p-3 rounded-xl border border-slate-200 dark:border-neutral-800">
                    <span className="font-bold text-slate-800 dark:text-neutral-200">{r.parcelType}</span>
                    
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Self Drop (₹)</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={r.selfPrice}
                        onChange={(e) => handleRuleChange(idx, "selfPrice", e.target.value)}
                        className="w-full rounded-lg border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-1 px-2 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Taxi Pickup (₹)</label>
                      <input
                        type="text"
                        placeholder="null for N/A"
                        value={r.taxiPrice === null ? "" : r.taxiPrice}
                        onChange={(e) => handleRuleChange(idx, "taxiPrice", e.target.value)}
                        className="w-full rounded-lg border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-1 px-2 font-mono"
                      />
                    </div>
                  </div>
                ))}
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
                  {loading ? "Saving..." : editingGroup ? "Save Changes" : "Create Pricing Group"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
