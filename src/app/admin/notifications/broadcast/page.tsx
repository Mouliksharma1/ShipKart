'use client';

import React, { useState } from 'react';
import { createBroadcastAction } from '@/app/actions/notifications';
function Button({ children, className = '', variant = 'default', size = 'default', ...props }: any) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none disabled:opacity-50';
  const sizeCls = size === 'icon' ? 'p-2' : 'px-4 py-2 text-sm';
  const varCls = variant === 'ghost' ? 'bg-transparent hover:bg-slate-100 dark:hover:bg-neutral-800' : 'bg-brand-blue text-white hover:bg-brand-darkBlue';
  return <button className={`${base} ${sizeCls} ${varCls} ${className}`} {...props}>{children}</button>;
}

function Input({ className = '', ...props }: any) {
  return <input className={`w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue ${className}`} {...props} />;
}
import { Sparkles, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

export default function BroadcastPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState<string>('ALL');
  const [channel, setChannel] = useState<string>('WHATSAPP');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await createBroadcastAction({
        title,
        message,
        targetRole: targetRole !== 'ALL' ? (targetRole as any) : undefined,
        channel: channel as any,
      });
      setStatus(`Success! Broadcast dispatched to ${res.count} users!`);
      setTitle('');
      setMessage('');
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-neutral-800 pb-4">
        <Link href="/admin/notifications">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-brand-blue" /> System Broadcast Announcements
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            Dispatch bulk notifications to customers, employees, or office managers across WhatsApp/SMS/Email
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-neutral-300">Announcement Title</label>
            <Input
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              required
              placeholder="e.g. Festival Holiday Notice / New Route Launch"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 dark:text-neutral-300">Target Role</label>
              <select
                value={targetRole}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTargetRole(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 mt-1"
              >
                <option value="ALL">All Users (Customers + Employees + Offices)</option>
                <option value="CUSTOMER">Customers Only</option>
                <option value="EMPLOYEE">Employees Only</option>
                <option value="PARTNER_OFFICE">Partner Offices Only</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-neutral-300">Primary Channel</label>
              <select
                value={channel}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setChannel(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 mt-1"
              >
                <option value="WHATSAPP">WHATSAPP</option>
                <option value="SMS">SMS</option>
                <option value="EMAIL">EMAIL</option>
                <option value="PUSH">PUSH</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-neutral-300">Broadcast Message Content</label>
            <textarea
              rows={5}
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              required
              placeholder="Enter broadcast message body..."
              className="w-full rounded-md border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 font-mono text-xs mt-1"
            />
          </div>

          {status && (
            <p className={`p-3 rounded-lg font-semibold ${status.startsWith('Error') ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {status}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full bg-brand-blue hover:bg-brand-darkBlue text-white gap-2 py-5">
            <Send className="h-4 w-4" /> Dispatch System Broadcast
          </Button>
        </form>
      </div>
    </div>
  );
}
