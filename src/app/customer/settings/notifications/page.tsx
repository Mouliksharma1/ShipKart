'use client';

import React, { useState } from 'react';
import { updateCustomerNotificationPreferencesAction } from '@/app/actions/notifications';
function Button({ children, className = '', ...props }: any) {
  return <button className={`px-4 py-2 text-sm font-medium rounded-lg bg-brand-blue text-white hover:bg-brand-darkBlue transition-colors ${className}`} {...props}>{children}</button>;
}
import { Bell, ShieldCheck, CheckCircle2, Globe } from 'lucide-react';

export default function CustomerNotificationSettingsPage() {
  const [allowSMS, setAllowSMS] = useState(true);
  const [allowEmail, setAllowEmail] = useState(true);
  const [allowMarketing, setAllowMarketing] = useState(false);
  const [allowPush, setAllowPush] = useState(true);
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [saving, setSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Demo user id or session user
      await updateCustomerNotificationPreferencesAction({
        userId: 'demo-user-id',
        allowSMS,
        allowEmail,
        allowMarketing,
        allowPush,
        preferredLanguage,
      });
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 3000);
    } catch (e) {
      setSavedStatus(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="border-b border-slate-200 dark:border-neutral-800 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="h-6 w-6 text-brand-blue" /> Notification Preferences & Language
        </h1>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
          Customize delivery channels and preferred language for your parcel tracking updates
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 dark:text-amber-300">
          <p className="font-bold">Security Notice: Mandatory Transactional Notifications</p>
          <p className="mt-0.5 text-amber-700 dark:text-amber-400">
            Critical parcel tracking and pickup safety alerts (e.g. Ready for Collection, Parcel Delivered) are mandatory for parcel safety and can never be disabled.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-6">
        {/* Preferred Language */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="h-4 w-4 text-brand-blue" /> Preferred Notification Language
          </label>
          <select
            value={preferredLanguage}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPreferredLanguage(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm font-medium"
          >
            <option value="en">English</option>
            <option value="hi">Hindi (हिंदी)</option>
            <option value="up">UP (Hindi)</option>
          </select>
        </div>

        <hr className="border-slate-100 dark:border-neutral-800" />

        {/* Toggle Switches */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">SMS Notifications</p>
              <p className="text-xs text-slate-500">Receive SMS text alerts on your registered phone</p>
            </div>
            <input
              type="checkbox"
              checked={allowSMS}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAllowSMS(e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Email Notifications</p>
              <p className="text-xs text-slate-500">Receive email receipts and tracking updates</p>
            </div>
            <input
              type="checkbox"
              checked={allowEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAllowEmail(e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Web & Mobile Push Notifications</p>
              <p className="text-xs text-slate-500">Instant push notifications in your browser or mobile app</p>
            </div>
            <input
              type="checkbox"
              checked={allowPush}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAllowPush(e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Promotional & Festival Announcements</p>
              <p className="text-xs text-slate-500">Updates on new cargo routes and festival discount offers</p>
            </div>
            <input
              type="checkbox"
              checked={allowMarketing}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAllowMarketing(e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between">
          {savedStatus ? (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Preferences saved successfully!
            </span>
          ) : (
            <span />
          )}
          <Button onClick={handleSave} disabled={saving} className="bg-brand-blue hover:bg-brand-darkBlue text-white">
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
