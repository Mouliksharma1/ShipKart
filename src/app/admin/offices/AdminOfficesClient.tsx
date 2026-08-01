"use client";

import React, { useState } from "react";
import { createOfficeAction, updateOfficeAction, toggleOfficeStatusAction } from "@/app/actions/offices-routes";
import { Building2, Plus, Search, Edit3, Power, MapPin, CheckCircle2, XCircle, Clock, Shield } from "lucide-react";

interface Office {
  id: string;
  name: string;
  code?: string | null;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  altPhone?: string | null;
  managerName?: string | null;
  managerPhone?: string | null;
  latitude: number;
  longitude: number;
  googleMapsUrl?: string | null;
  mapEmbedUrl?: string | null;
  openingTime: string;
  closingTime: string;
  status: boolean;
}

export default function AdminOfficesClient({ initialOffices }: { initialOffices: Office[] }) {
  const [offices, setOffices] = useState<Office[]>(initialOffices);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState<Office | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Jodhpur");
  const [state, setState] = useState("Rajasthan");
  const [pinCode, setPinCode] = useState("342001");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerPhone, setManagerPhone] = useState("");
  const [latitude, setLatitude] = useState(26.285498);
  const [longitude, setLongitude] = useState(73.018264);
  const [mapEmbedUrl, setMapEmbedUrl] = useState("");
  const [openingTime, setOpeningTime] = useState("04:00 AM");
  const [closingTime, setClosingTime] = useState("11:00 PM");

  const openCreateModal = () => {
    setEditingOffice(null);
    setName("");
    setCode("");
    setAddress("");
    setCity("Jodhpur");
    setState("Rajasthan");
    setPinCode("342001");
    setPhone("");
    setAltPhone("");
    setManagerName("");
    setManagerPhone("");
    setLatitude(26.285498);
    setLongitude(73.018264);
    setMapEmbedUrl("");
    setOpeningTime("04:00 AM");
    setClosingTime("11:00 PM");
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (off: Office) => {
    setEditingOffice(off);
    setName(off.name);
    setCode(off.code || "");
    setAddress(off.address);
    setCity(off.city);
    setState(off.state);
    setPinCode(off.pinCode);
    setPhone(off.phone);
    setAltPhone(off.altPhone || "");
    setManagerName(off.managerName || "");
    setManagerPhone(off.managerPhone || "");
    setLatitude(off.latitude);
    setLongitude(off.longitude);
    setMapEmbedUrl(off.mapEmbedUrl || off.googleMapsUrl || "");
    setOpeningTime(off.openingTime);
    setClosingTime(off.closingTime);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const payload = {
      name,
      code,
      address,
      city,
      state,
      pinCode,
      phone,
      altPhone,
      managerName,
      managerPhone,
      latitude: Number(latitude),
      longitude: Number(longitude),
      mapEmbedUrl,
      googleMapsUrl: mapEmbedUrl,
      openingTime,
      closingTime,
      status: editingOffice ? editingOffice.status : true,
    };

    const res = editingOffice
      ? await updateOfficeAction(editingOffice.id, payload)
      : await createOfficeAction(payload);

    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || "Operation failed.");
    } else {
      setIsModalOpen(false);
      window.location.reload();
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await toggleOfficeStatusAction(id, currentStatus);
    setOffices(offices.map(o => o.id === id ? { ...o, status: !currentStatus } : o));
  };

  const filteredOffices = offices.filter(o =>
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.phone.includes(searchTerm)
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
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Office Master Management</h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400">Configure station offices, geo-coordinates, branch managers, and operational hours.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center space-x-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-amber-950 shadow-md hover:bg-amber-400 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Office</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search office name, city, or phone..."
            className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-3.5 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">Total Offices</span>
          <span className="text-lg font-black text-slate-900 dark:text-white">{offices.length}</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-3.5 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">Active Offices</span>
          <span className="text-lg font-black text-green-600 dark:text-green-400">{offices.filter(o => o.status).length}</span>
        </div>
      </div>

      {/* Offices Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-neutral-950 text-slate-600 dark:text-neutral-400 font-bold border-b border-slate-200 dark:border-neutral-800 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Office Name / Code</th>
                <th className="py-3.5 px-4">City & State</th>
                <th className="py-3.5 px-4">Phone / Manager</th>
                <th className="py-3.5 px-4">Coordinates</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-neutral-800 text-slate-800 dark:text-neutral-200">
              {filteredOffices.map((off) => (
                <tr key={off.id} className="hover:bg-slate-50 dark:hover:bg-neutral-950/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    <div>{off.name}</div>
                    {off.code && <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">[{off.code}]</span>}
                  </td>
                  <td className="py-3.5 px-4">
                    <div>{off.city}, {off.state}</div>
                    <span className="text-[10px] text-slate-400">{off.pinCode}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold">{off.phone}</div>
                    {off.managerName && <span className="text-[10px] text-slate-400">Mgr: {off.managerName}</span>}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 dark:text-neutral-400">
                    {off.latitude.toFixed(4)}, {off.longitude.toFixed(4)}
                  </td>
                  <td className="py-3.5 px-4">
                    {off.status ? (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>ACTIVE</span>
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
                      onClick={() => openEditModal(off)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 hover:text-amber-500 transition-colors"
                      title="Edit Office"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(off.id, off.status)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        off.status ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                      }`}
                      title={off.status ? "Disable Office" : "Enable Office"}
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

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingOffice ? "Edit Office Master" : "Create New Branch Office"}
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
                  <label className="block font-medium text-slate-700 dark:text-neutral-300 mb-1">Office Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jaipur Branch Office"
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2 px-3 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-neutral-300 mb-1">Office Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. JPR01"
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2 px-3 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-neutral-300 mb-1">Full Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, building, landmark"
                  className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2 px-3 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-neutral-300 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2 px-3 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-neutral-300 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2 px-3 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-neutral-300 mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    pattern="[0-9]{6}"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2 px-3 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-neutral-300 mb-1">Primary Helpline Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit number"
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2 px-3 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-neutral-300 mb-1">Manager Name</label>
                  <input
                    type="text"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder="Branch manager"
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2 px-3 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-neutral-300 mb-1">Latitude (Geo-Location)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2 px-3 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-neutral-300 mb-1">Longitude (Geo-Location)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2 px-3 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-neutral-300 mb-1 flex items-center justify-between">
                  <span>Google Maps Embed URL / iFrame Link</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">100% Free • No API Key</span>
                </label>
                <input
                  type="text"
                  value={mapEmbedUrl}
                  onChange={(e) => setMapEmbedUrl(e.target.value)}
                  placeholder='Paste Google Maps Embed URL or full <iframe> tag (e.g. https://www.google.com/maps/embed?...)'
                  className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2 px-3 text-slate-900 dark:text-white font-mono text-[11px]"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  How to get: Go to Google Maps → Search office landmark → Share → Embed a map → Copy HTML / URL.
                </p>
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
                  {loading ? "Saving..." : editingOffice ? "Save Changes" : "Create Office"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
