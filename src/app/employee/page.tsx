import React from "react";
import Link from "next/link";
import { Shield, Users, MapPin, DollarSign, FileText, Activity } from "lucide-react";

export default function EmployeeDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div className="rounded-2xl border border-neutral-800 bg-gradient-to-r from-neutral-900 via-blue-950/30 to-neutral-900 p-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 mb-2">
            <Shield className="h-3.5 w-3.5" />
            <span>Counter Staff Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Employee Counter Dashboard</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Offline counter booking, LR Builty search, daily closing cash register, and pickup dispatches.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-1">
          <span className="text-xs font-medium text-neutral-400">Today's Counter Bookings</span>
          <p className="text-2xl font-black text-white">0</p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-1">
          <span className="text-xs font-medium text-neutral-400">Pending Pickups</span>
          <p className="text-2xl font-black text-amber-400">0</p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-1">
          <span className="text-xs font-medium text-neutral-400">Ready For Collection</span>
          <p className="text-2xl font-black text-cyan-400">0</p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-1">
          <span className="text-xs font-medium text-neutral-400">Today's Register Cash</span>
          <p className="text-2xl font-black text-green-400">₹0.00</p>
        </div>
      </div>
    </div>
  );
}
