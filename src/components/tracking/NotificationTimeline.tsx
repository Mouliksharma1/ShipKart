'use client';

import React from 'react';
function Badge({ children, variant = 'default', className = '', ...props }: any) {
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${variant === 'outline' ? 'border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300' : 'bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-neutral-200'} ${className}`} {...props}>{children}</span>;
}
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  MessageSquare,
  Mail,
  Send,
  Smartphone,
  ShieldAlert,
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  queueNumber: string;
  recipientType: string;
  recipientName: string;
  recipientPhone?: string | null;
  channel: string;
  status: string;
  event: string;
  message: string;
  failureReason?: string | null;
  retryCount: number;
  maxRetries: number;
  scheduledAt: string | Date;
  processedAt?: string | Date | null;
  createdAt: string | Date;
}

interface NotificationTimelineProps {
  notifications: NotificationItem[];
}

export function NotificationTimeline({ notifications }: NotificationTimelineProps) {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 dark:border-neutral-800 p-6 text-center">
        <Bell className="mx-auto h-8 w-8 text-slate-400 mb-2" />
        <p className="text-sm text-slate-500 dark:text-neutral-400 font-medium">
          No notifications enqueued for this parcel yet.
        </p>
      </div>
    );
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'WHATSAPP':
        return <MessageSquare className="h-4 w-4 text-emerald-500" />;
      case 'SMS':
        return <Smartphone className="h-4 w-4 text-blue-500" />;
      case 'EMAIL':
        return <Mail className="h-4 w-4 text-indigo-500" />;
      case 'PUSH':
        return <Send className="h-4 w-4 text-amber-500" />;
      default:
        return <Bell className="h-4 w-4 text-slate-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SENT':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-2.5 py-0.5 text-xs font-semibold">
            <CheckCircle2 className="h-3 w-3" /> Delivered
          </span>
        );
      case 'PENDING':
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 px-2.5 py-0.5 text-xs font-semibold animate-pulse">
            <Clock className="h-3 w-3" /> Queued
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 px-2.5 py-0.5 text-xs font-semibold">
            <AlertTriangle className="h-3 w-3" /> Retrying
          </span>
        );
      case 'DEAD_LETTER':
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 px-2.5 py-0.5 text-xs font-semibold">
            <ShieldAlert className="h-3 w-3" /> Failed
          </span>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="h-4 w-4 text-brand-blue dark:text-brand-lightBlue" />
          Notification Delivery Log ({notifications.length})
        </h3>
      </div>

      <div className="relative pl-6 border-l-2 border-slate-200 dark:border-neutral-800 space-y-6">
        {notifications.map((item) => (
          <div key={item.id} className="relative group">
            {/* Timeline node */}
            <div className="absolute -left-[31px] top-0 rounded-full bg-white dark:bg-neutral-900 p-1 border-2 border-slate-300 dark:border-neutral-700 shadow-sm">
              {getChannelIcon(item.channel)}
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-sm transition-all hover:border-brand-blue/30">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.recipientName} ({item.recipientType})
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">
                      #{item.queueNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 font-mono mt-0.5">
                    {item.recipientPhone || item.channel}
                  </p>
                </div>
                {getStatusBadge(item.status)}
              </div>

              <p className="text-xs text-slate-700 dark:text-neutral-300 bg-slate-50 dark:bg-neutral-950 p-2.5 rounded-lg border border-slate-100 dark:border-neutral-800 font-mono">
                {item.message}
              </p>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 dark:text-neutral-500">
                <span>
                  Event: <strong className="text-slate-600 dark:text-neutral-300">{item.event}</strong>
                </span>
                <span>
                  {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {item.failureReason && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-md">
                  <XCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{item.failureReason}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
