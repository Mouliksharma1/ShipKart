import React from 'react';
import { getSettingsAction } from '@/app/actions/admin/settings';
import { Shield, Building, Globe, Bell, DollarSign, Lock, Sliders, ToggleLeft, ToggleRight, HardDrive } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const res = await getSettingsAction();
  const settings = res.settings;
  const flags = res.flags || [];

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/admin" className="text-xs text-orange-600 font-bold hover:underline">
              Admin
            </Link>
            <span className="text-xs text-slate-300">/</span>
            <span className="text-xs text-slate-500 font-semibold">Settings</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Enterprise Configuration & Feature Flags</h1>
        </div>
      </div>

      {/* Feature Flags Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Dynamic Feature Flags</h2>
            <p className="text-xs text-slate-500">Toggle system capabilities live without code redeployment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flags.map((flag) => (
            <div key={flag.key} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-xs font-mono text-slate-400 font-bold">{flag.key}</span>
                <h3 className="text-sm font-bold text-slate-800">{flag.name}</h3>
                <p className="text-[11px] text-slate-500">{flag.description}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${flag.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                {flag.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Categorized Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Company Branding', icon: Building, desc: 'Logo, Favicon, GST, Helplines, Website', data: settings?.company },
          { title: 'Booking Prefixes', icon: Globe, desc: 'LR prefix, Dispatch prefix, Auto-assign', data: settings?.booking },
          { title: 'Branding Theme', icon: Sliders, desc: 'Primary & secondary colors, banners', data: settings?.branding },
          { title: 'Multi-Channel Notifications', icon: Bell, desc: 'WhatsApp, SMS, Email, Push toggles', data: settings?.notification },
          { title: 'Finance & Tax', icon: DollarSign, desc: 'Currency (₹), Tax percentage, UPI ID', data: settings?.finance },
          { title: 'Security & Auth', icon: Lock, desc: 'Session timeout, Lockout attempts, 2FA', data: settings?.security },
        ].map((cat) => (
          <div key={cat.title} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="p-3 bg-slate-100 text-slate-700 rounded-2xl w-fit">
                <cat.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{cat.title}</h3>
              <p className="text-xs text-slate-500">{cat.desc}</p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-xs font-mono text-slate-400 truncate">
              {JSON.stringify(cat.data || {}).substring(0, 60)}...
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
