import React from "react";
import { User, Phone, Mail, Shield, Building, Key, Save } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 space-y-8">
      <div className="border-b border-neutral-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Account Profile & Settings</h1>
        <p className="text-xs text-neutral-400 mt-1">Manage your account information, contact details, and password.</p>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <User className="h-4 w-4 text-amber-400" />
          <span>Personal Information</span>
        </h2>

        <form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Full Name</label>
              <input
                type="text"
                defaultValue="Pooja Customer"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-2.5 px-4 text-xs text-neutral-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Mobile Number</label>
              <input
                type="text"
                defaultValue="6350603414"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-2.5 px-4 text-xs text-neutral-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Email Address</label>
            <input
              type="email"
              defaultValue="customer@poojatravels.com"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-2.5 px-4 text-xs text-neutral-100 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="flex items-center space-x-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-amber-950 shadow-md hover:bg-amber-400 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
