"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Search, MapPin, Phone, Clock, Compass, Building2, CheckCircle2, XCircle } from "lucide-react";

// Client-only dynamic load for Leaflet map to prevent SSR window reference error
const DynamicOfficeMap = dynamic(() => import("@/components/maps/OfficeMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 rounded-xl bg-slate-200 dark:bg-neutral-900 animate-pulse flex items-center justify-center text-xs text-neutral-400">
      Loading OpenStreetMap...
    </div>
  ),
});

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
  officeTiming: string;
  status: boolean;
}

export default function OfficesDirectoryClient({ initialOffices }: { initialOffices: Office[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState<string>("ALL");

  const filteredOffices = initialOffices.filter((off) => {
    const matchesSearch =
      off.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      off.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      off.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesState =
      selectedState === "ALL"
        ? true
        : selectedState === "RAJASTHAN"
        ? off.state === "Rajasthan"
        : off.state !== "Rajasthan";

    return matchesSearch && matchesState;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 p-6 sm:p-8 shadow-xl space-y-4">
        <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
          <Building2 className="h-4 w-4" />
          <span>OFFICE NETWORK DIRECTORY</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Pooja Travels & Cargo Branch Network</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
          Find station offices, head offices, and partner branch locations across Rajasthan, Gujarat, Delhi, and Uttar Pradesh. All parcel dispatches must be collected from these designated offices.
        </p>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-neutral-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by city, branch name, or address..."
              className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedState("ALL")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                selectedState === "ALL"
                  ? "bg-amber-500 text-amber-950"
                  : "bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 hover:bg-slate-200"
              }`}
            >
              All Offices ({initialOffices.length})
            </button>
            <button
              onClick={() => setSelectedState("RAJASTHAN")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                selectedState === "RAJASTHAN"
                  ? "bg-amber-500 text-amber-950"
                  : "bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 hover:bg-slate-200"
              }`}
            >
              Inside Rajasthan
            </button>
            <button
              onClick={() => setSelectedState("OUTSIDE")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                selectedState === "OUTSIDE"
                  ? "bg-amber-500 text-amber-950"
                  : "bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 hover:bg-slate-200"
              }`}
            >
              Outside Rajasthan
            </button>
          </div>
        </div>
      </div>

      {/* Offices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffices.map((office) => (
          <div
            key={office.id}
            className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-5 space-y-4 shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Top Title */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{office.name}</h3>
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    {office.city}, {office.state} ({office.pinCode})
                  </span>
                </div>
                {office.status ? (
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
              </div>

              {/* Address */}
              <div className="flex items-start space-x-2 text-xs text-slate-600 dark:text-neutral-400 bg-slate-50 dark:bg-neutral-950 p-2.5 rounded-xl border border-slate-200 dark:border-neutral-800/80">
                <MapPin className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{office.address}</span>
              </div>

              {/* Contacts & Timings */}
              <div className="space-y-1.5 text-xs text-slate-700 dark:text-neutral-300 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-neutral-500">Helpline Phone:</span>
                  <a href={`tel:${office.phone}`} className="font-bold text-amber-600 dark:text-amber-400 hover:underline">
                    {office.phone}
                  </a>
                </div>
                {office.managerName && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-neutral-500">Branch Manager:</span>
                    <span className="font-semibold">{office.managerName}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-neutral-500">Working Hours:</span>
                  <span className="font-medium text-slate-800 dark:text-neutral-200">{office.officeTiming}</span>
                </div>
              </div>
            </div>

            {/* Interactive OpenStreetMap */}
            <div className="pt-2">
              <DynamicOfficeMap
                latitude={office.latitude}
                longitude={office.longitude}
                officeName={office.name}
                address={office.address}
              />
            </div>
          </div>
        ))}
      </div>

      {filteredOffices.length === 0 && (
        <div className="text-center py-12 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 space-y-2">
          <Compass className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Offices Found</h3>
          <p className="text-xs text-slate-500">Try broadening your search term or selecting 'All Offices'.</p>
        </div>
      )}
    </div>
  );
}
