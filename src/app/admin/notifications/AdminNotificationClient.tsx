'use client';

import React, { useState } from 'react';
import {
  triggerWorkerAction,
  retryNotificationAction,
  cancelNotificationAction,
  getNotificationQueueAction,
  testNotificationAction,
} from '@/app/actions/notifications';
// Inline Helper Components
function Button({ children, className = '', variant = 'default', size = 'default', ...props }: any) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none disabled:opacity-50';
  const sizeCls = size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'icon' ? 'p-2' : 'px-4 py-2 text-sm';
  const varCls = variant === 'outline' ? 'border border-slate-200 dark:border-neutral-800 bg-transparent hover:bg-slate-100 dark:hover:bg-neutral-800' : variant === 'ghost' ? 'bg-transparent hover:bg-slate-100 dark:hover:bg-neutral-800' : variant === 'secondary' ? 'bg-slate-100 dark:bg-neutral-800 text-slate-900 dark:text-white' : 'bg-brand-blue text-white hover:bg-brand-darkBlue';
  return <button className={`${base} ${sizeCls} ${varCls} ${className}`} {...props}>{children}</button>;
}

function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue ${className}`} {...props} />;
}

function Badge({ children, className = '', variant = 'default', ...props }: any) {
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variant === 'outline' ? 'border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300' : 'bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-neutral-200'} ${className}`} {...props}>{children}</span>;
}
import {
  Bell,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Send,
  MessageSquare,
  ShieldAlert,
  SlidersHorizontal,
  XCircle,
  FileText,
  Radio,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface AdminNotificationClientProps {
  initialMetrics: any;
  initialQueueData: any;
}

export function AdminNotificationClient({ initialMetrics, initialQueueData }: AdminNotificationClientProps) {
  const [metrics, setMetrics] = useState(initialMetrics);
  const [queueData, setQueueData] = useState(initialQueueData);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [channelFilter, setChannelFilter] = useState<string>('ALL');

  // Test Modal State
  const [showTestModal, setShowTestModal] = useState(false);
  const [testEvent, setTestEvent] = useState('BOOKING_CREATED');
  const [testRecipientName, setTestRecipientName] = useState('John Doe');
  const [testPhone, setTestPhone] = useState('9876543210');
  const [testChannel, setTestChannel] = useState('WHATSAPP');
  const [testStatus, setTestStatus] = useState<string | null>(null);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await getNotificationQueueAction({
        query: searchQuery,
        status: statusFilter !== 'ALL' ? (statusFilter as any) : undefined,
        channel: channelFilter !== 'ALL' ? (channelFilter as any) : undefined,
      });
      setQueueData(res);
    } finally {
      setLoading(false);
    }
  };

  const handleRunWorker = async () => {
    setLoading(true);
    try {
      await triggerWorkerAction();
      await handleRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (id: string) => {
    setLoading(true);
    try {
      await retryNotificationAction(id);
      await handleRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    setLoading(true);
    try {
      await cancelNotificationAction(id);
      await handleRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTestStatus(null);
    try {
      const res = await testNotificationAction({
        event: testEvent as any,
        recipientName: testRecipientName,
        recipientPhone: testPhone,
        channel: testChannel as any,
        variables: {
          receiverName: testRecipientName,
          senderName: 'Pooja Cargo Demo',
          lrNumber: 'SK999999',
          origin: 'Jodhpur HO',
          destination: 'Jaipur Main',
          trackingUrl: 'https://shipkart.app/track/SK999999',
          collectionOffice: 'Jaipur Main Office',
          officeAddress: 'Station Road, Jaipur',
          helpline: '6350603414',
        },
      });
      setTestStatus(`Success! Enqueued & Processed ${res.record.queueNumber}`);
      await handleRefresh();
    } catch (err: any) {
      setTestStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-brand-blue/10 dark:bg-brand-lightBlue/10 text-brand-blue dark:text-brand-lightBlue">
              <Bell className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Enterprise Notification Engine</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">
            Centralized Queue, Channel Fallback, Retry Engine & Webhooks for Pooja Travels & Cargo
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/admin/notifications/templates">
            <Button variant="outline" size="sm" className="gap-2">
              <FileText className="h-4 w-4" /> Templates
            </Button>
          </Link>
          <Link href="/admin/notifications/providers">
            <Button variant="outline" size="sm" className="gap-2">
              <Radio className="h-4 w-4" /> Providers
            </Button>
          </Link>
          <Link href="/admin/notifications/broadcast">
            <Button variant="outline" size="sm" className="gap-2">
              <Sparkles className="h-4 w-4" /> Broadcast
            </Button>
          </Link>
          <Button onClick={() => setShowTestModal(true)} size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Send className="h-4 w-4" /> Test Message
          </Button>
          <Button onClick={handleRunWorker} disabled={loading} size="sm" className="gap-2 bg-brand-blue hover:bg-brand-darkBlue text-white">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Run Queue Worker
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-sm">
          <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Pending Queue</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{metrics.totalPending}</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-sm">
          <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Sent Today</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{metrics.sentToday}</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-sm">
          <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Failed Today</p>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{metrics.failedToday}</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-sm">
          <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Dead Letter DLQ</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{metrics.deadLetterCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-sm">
          <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Success Rate</p>
          <p className="text-2xl font-bold text-brand-blue dark:text-brand-lightBlue mt-1">{metrics.successRate}%</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-sm">
          <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Total Queue Length</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{metrics.queueLength}</p>
        </div>
      </div>

      {/* Queue Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-neutral-900 p-4 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by queue #, LR #, recipient name, phone..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-md border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="SENT">SENT</option>
            <option value="FAILED">FAILED</option>
            <option value="DEAD_LETTER">DEAD_LETTER</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
          <select
            value={channelFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setChannelFilter(e.target.value)}
            className="h-10 px-3 rounded-md border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm"
          >
            <option value="ALL">All Channels</option>
            <option value="WHATSAPP">WHATSAPP</option>
            <option value="SMS">SMS</option>
            <option value="EMAIL">EMAIL</option>
            <option value="PUSH">PUSH</option>
          </select>
          <Button onClick={handleRefresh} variant="secondary" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      {/* Notification Queue Table */}
      <div className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-neutral-950 text-slate-500 dark:text-neutral-400 font-semibold border-b border-slate-200 dark:border-neutral-800">
              <tr>
                <th className="p-3">Queue #</th>
                <th className="p-3">Event / LR #</th>
                <th className="p-3">Recipient</th>
                <th className="p-3">Channel</th>
                <th className="p-3">Status</th>
                <th className="p-3">Message Snippet</th>
                <th className="p-3">Retries</th>
                <th className="p-3">Created</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {queueData.items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    No notification queue items found matching criteria.
                  </td>
                </tr>
              ) : (
                queueData.items.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-950/50">
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                      {item.queueNumber}
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800 dark:text-neutral-200">{item.event}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{item.lrNumber || 'N/A'}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-slate-900 dark:text-white">{item.recipientName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {item.recipientPhone || item.recipientEmail || '-'}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {item.channel}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge
                        className={
                          item.status === 'SENT'
                            ? 'bg-emerald-500'
                            : item.status === 'PENDING'
                            ? 'bg-amber-500'
                            : item.status === 'FAILED'
                            ? 'bg-rose-500'
                            : 'bg-slate-500'
                        }
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="p-3 max-w-xs truncate text-slate-600 dark:text-neutral-400 font-mono">
                      {item.message}
                    </td>
                    <td className="p-3 font-mono">
                      {item.retryCount}/{item.maxRetries}
                    </td>
                    <td className="p-3 text-slate-400 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      {(item.status === 'FAILED' || item.status === 'DEAD_LETTER') && (
                        <Button onClick={() => handleRetry(item.id)} size="sm" variant="ghost" className="h-7 text-xs text-brand-blue">
                          Retry
                        </Button>
                      )}
                      {item.status === 'PENDING' && (
                        <Button onClick={() => handleCancel(item.id)} size="sm" variant="ghost" className="h-7 text-xs text-rose-500">
                          Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Send Test Modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="h-4 w-4 text-brand-blue" /> Send Test Notification
              </h3>
              <button onClick={() => setShowTestModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSendTest} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-neutral-300">Target Event</label>
                <select
                  value={testEvent}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTestEvent(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs mt-1"
                >
                  <option value="BOOKING_CREATED">BOOKING_CREATED</option>
                  <option value="READY_FOR_COLLECTION">READY_FOR_COLLECTION</option>
                  <option value="DISPATCH_DEPARTED">DISPATCH_DEPARTED</option>
                  <option value="COLLECTED">COLLECTED</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-neutral-300">Channel</label>
                <select
                  value={testChannel}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTestChannel(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs mt-1"
                >
                  <option value="WHATSAPP">WHATSAPP</option>
                  <option value="SMS">SMS</option>
                  <option value="EMAIL">EMAIL</option>
                  <option value="PUSH">PUSH</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-neutral-300">Recipient Name</label>
                <Input
                  value={testRecipientName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestRecipientName(e.target.value)}
                  required
                  className="h-9 text-xs mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-neutral-300">Recipient Phone</label>
                <Input
                  value={testPhone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestPhone(e.target.value)}
                  required
                  className="h-9 text-xs mt-1"
                />
              </div>

              {testStatus && (
                <p className={`text-xs p-2 rounded-lg ${testStatus.startsWith('Error') ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {testStatus}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowTestModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} size="sm" className="bg-brand-blue hover:bg-brand-darkBlue text-white">
                  Send Now
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
