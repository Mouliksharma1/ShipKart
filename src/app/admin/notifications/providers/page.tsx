import React from 'react';
function Button({ children, className = '', variant = 'default', size = 'default', ...props }: any) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none disabled:opacity-50';
  const sizeCls = size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'icon' ? 'p-2' : 'px-4 py-2 text-sm';
  const varCls = variant === 'ghost' ? 'bg-transparent hover:bg-slate-100 dark:hover:bg-neutral-800' : 'bg-brand-blue text-white';
  return <button className={`${base} ${sizeCls} ${varCls} ${className}`} {...props}>{children}</button>;
}

function Badge({ children, className = '', ...props }: any) {
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`} {...props}>{children}</span>;
}
import { Radio, ArrowLeft, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import Link from 'next/link';
import { WhatsAppProvider } from '@/lib/providers/whatsapp';
import { SMSProvider } from '@/lib/providers/sms';
import { MockWhatsAppProvider } from '@/lib/providers/mock-whatsapp';
import { MockSMSProvider } from '@/lib/providers/mock-sms';
import { EmailProvider } from '@/lib/providers/email';
import { PushProvider } from '@/lib/providers/push';
import { NOTIFICATION_CONFIG } from '@/config/notification.config';

export const revalidate = 0;

export default async function ProviderHealthPage() {
  const isMock = NOTIFICATION_CONFIG.MODE === 'mock';
  const wa = isMock ? MockWhatsAppProvider : WhatsAppProvider;
  const sms = isMock ? MockSMSProvider : SMSProvider;

  const [waHealth, smsHealth, emailHealth, pushHealth] = await Promise.all([
    wa.healthCheck(),
    sms.healthCheck(),
    EmailProvider.healthCheck(),
    PushProvider.healthCheck(),
  ]);

  const providers = [
    {
      name: wa.providerName,
      channel: 'WHATSAPP',
      status: waHealth.status,
      latency: waHealth.responseTimeMs,
      rateLimit: '100 msgs/min',
      fallback: 'SMS',
    },
    {
      name: sms.providerName,
      channel: 'SMS',
      status: smsHealth.status,
      latency: smsHealth.responseTimeMs,
      rateLimit: '500 msgs/min',
      fallback: 'EMAIL',
    },
    {
      name: EmailProvider.providerName,
      channel: 'EMAIL',
      status: emailHealth.status,
      latency: emailHealth.responseTimeMs,
      rateLimit: '1000 msgs/min',
      fallback: 'PUSH',
    },
    {
      name: PushProvider.providerName,
      channel: 'PUSH',
      status: pushHealth.status,
      latency: pushHealth.responseTimeMs,
      rateLimit: '1000 msgs/min',
      fallback: 'None (Final Chain Node)',
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/notifications">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Radio className="h-6 w-6 text-brand-blue" /> Provider Health & Channel Fallback Matrix
            </h1>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Real-time Channel Status, Latency & Automatic Priority Failover
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map((p) => (
          <div key={p.channel} className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{p.name}</h3>
                <p className="text-xs text-slate-400 font-mono">
                  Channel: {p.channel} {p.channel === 'EMAIL' ? `| Host: ${NOTIFICATION_CONFIG.SMTP_HOST}:${NOTIFICATION_CONFIG.SMTP_PORT} (${NOTIFICATION_CONFIG.MODE.toUpperCase()})` : ''}
                </p>
              </div>
              <Badge className={p.status === 'HEALTHY' ? 'bg-emerald-500 gap-1 text-white' : 'bg-amber-500 gap-1 text-white'}>
                <CheckCircle2 className="h-3 w-3" /> {p.status}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-neutral-950 p-4 rounded-xl text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">LATENCY</span>
                <span className="font-bold text-slate-900 dark:text-white">{p.latency} ms</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">{p.channel === 'EMAIL' ? 'HOST / PORT' : 'RATE LIMIT'}</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {p.channel === 'EMAIL' ? `${NOTIFICATION_CONFIG.SMTP_HOST}:${NOTIFICATION_CONFIG.SMTP_PORT}` : p.rateLimit}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">FAILOVER NODE</span>
                <span className="font-bold text-brand-blue">{p.fallback}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>
                {p.status === 'HEALTHY'
                  ? 'Provider health check ping executed successfully.'
                  : 'Provider health status degraded or service currently unavailable.'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
