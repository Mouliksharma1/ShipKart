import React from "react";
import { Building2, PackageCheck, CheckCircle2, Truck } from "lucide-react";

export default function PartnerDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div className="rounded-2xl border border-neutral-800 bg-gradient-to-r from-neutral-900 via-purple-950/30 to-neutral-900 p-6 shadow-xl">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 mb-2">
          <Building2 className="h-3.5 w-3.5" />
          <span>Partner Office Portal</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Partner Destination Hub</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Inbound bus dispatches intake, mark parcels ready for collection, and process receiver handovers.
        </p>
      </div>
    </div>
  );
}
