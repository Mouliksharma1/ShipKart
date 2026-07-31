'use client';

import React, { useState } from 'react';
import { createTemplateVersionAction, testTemplateRenderAction } from '@/app/actions/notifications';
function Button({ children, className = '', variant = 'default', size = 'default', ...props }: any) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none disabled:opacity-50';
  const sizeCls = size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'icon' ? 'p-2' : 'px-4 py-2 text-sm';
  const varCls = variant === 'outline' ? 'border border-slate-200 dark:border-neutral-800 bg-transparent hover:bg-slate-100 dark:hover:bg-neutral-800' : variant === 'ghost' ? 'bg-transparent hover:bg-slate-100 dark:hover:bg-neutral-800' : 'bg-brand-blue text-white hover:bg-brand-darkBlue';
  return <button className={`${base} ${sizeCls} ${varCls} ${className}`} {...props}>{children}</button>;
}

function Input({ className = '', ...props }: any) {
  return <input className={`w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue ${className}`} {...props} />;
}

function Badge({ children, className = '', variant = 'default', ...props }: any) {
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${variant === 'outline' ? 'border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300' : 'bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-neutral-200'} ${className}`} {...props}>{children}</span>;
}
import { FileText, Plus, CheckCircle2, ArrowLeft, Eye, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface TemplateManagerClientProps {
  initialTemplates: any[];
}

export function TemplateManagerClient({ initialTemplates }: TemplateManagerClientProps) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [event, setEvent] = useState('BOOKING_CREATED');
  const [channel, setChannel] = useState('WHATSAPP');
  const [languageCode, setLanguageCode] = useState('en');
  const [title, setTitle] = useState('');
  const [messageTemplate, setMessageTemplate] = useState('');
  const [variables, setVariables] = useState('receiverName, lrNumber, senderName, trackingUrl');

  // Preview State
  const [previewResult, setPreviewResult] = useState<any>(null);

  const handlePreview = async () => {
    const varMap: Record<string, string> = {};
    variables.split(',').forEach((v) => {
      const clean = v.trim();
      if (clean) varMap[clean] = `[${clean}_value]`;
    });

    const res = await testTemplateRenderAction({
      messageTemplate,
      title,
      variables: varMap,
      event: event as any,
    });
    setPreviewResult(res);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const varsArr = variables.split(',').map((v) => v.trim()).filter(Boolean);
      const res = await createTemplateVersionAction({
        name,
        event: event as any,
        channel: channel as any,
        languageCode,
        title,
        messageTemplate,
        variables: varsArr,
      });
      if (res.success) {
        setShowCreateModal(false);
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/notifications">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-6 w-6 text-brand-blue" /> Notification Templates Engine
            </h1>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Versioned, Multi-language (English, Hindi, UP) Message Templates
            </p>
          </div>
        </div>

        <Button onClick={() => setShowCreateModal(true)} className="gap-2 bg-brand-blue hover:bg-brand-darkBlue text-white">
          <Plus className="h-4 w-4" /> Create / New Version
        </Button>
      </div>

      {/* Templates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            className={`rounded-2xl border bg-white dark:bg-neutral-900 p-5 shadow-sm space-y-3 relative transition-all ${
              tmpl.isActive
                ? 'border-brand-blue/40 shadow-brand-blue/5'
                : 'border-slate-200 dark:border-neutral-800 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{tmpl.name}</h3>
                  <Badge variant="outline" className="text-[10px] uppercase font-mono">
                    v{tmpl.version}
                  </Badge>
                </div>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">{tmpl.event}</p>
              </div>

              <div className="flex items-center gap-1.5">
                <Badge className="bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-neutral-200 font-mono text-[10px]">
                  {tmpl.languageCode}
                </Badge>
                <Badge className={tmpl.channel === 'WHATSAPP' ? 'bg-emerald-500' : 'bg-blue-500'}>
                  {tmpl.channel}
                </Badge>
              </div>
            </div>

            {tmpl.title && (
              <p className="text-xs font-semibold text-slate-800 dark:text-neutral-200 bg-slate-50 dark:bg-neutral-950 p-2 rounded-md">
                Title: {tmpl.title}
              </p>
            )}

            <p className="text-xs text-slate-600 dark:text-neutral-300 font-mono bg-slate-50 dark:bg-neutral-950 p-3 rounded-lg border border-slate-100 dark:border-neutral-800 leading-relaxed">
              {tmpl.messageTemplate}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Variables: {tmpl.variables ? JSON.parse(tmpl.variables).join(', ') : 'None'}</span>
              {tmpl.isActive && (
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 className="h-3 w-3" /> Active
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create / New Version Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-blue" /> Create Template / Version
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-neutral-300">Template Display Name</label>
                <Input value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required placeholder="e.g. Ready for Collection Hindi v2" className="mt-1" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-neutral-300">Event</label>
                  <select value={event} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEvent(e.target.value)} className="w-full h-9 rounded-md border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2 mt-1">
                    <option value="BOOKING_CREATED">BOOKING_CREATED</option>
                    <option value="READY_FOR_COLLECTION">READY_FOR_COLLECTION</option>
                    <option value="DISPATCH_DEPARTED">DISPATCH_DEPARTED</option>
                    <option value="COLLECTED">COLLECTED</option>
                    <option value="BOOKING_CANCELLED">BOOKING_CANCELLED</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-neutral-300">Channel</label>
                  <select value={channel} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setChannel(e.target.value)} className="w-full h-9 rounded-md border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2 mt-1">
                    <option value="WHATSAPP">WHATSAPP</option>
                    <option value="SMS">SMS</option>
                    <option value="EMAIL">EMAIL</option>
                    <option value="PUSH">PUSH</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-neutral-300">Language</label>
                  <select value={languageCode} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLanguageCode(e.target.value)} className="w-full h-9 rounded-md border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2 mt-1">
                    <option value="en">English (en)</option>
                    <option value="hi">Hindi (hi)</option>
                    <option value="up">UP (up)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-neutral-300">Title (Optional)</label>
                <Input value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} placeholder="Notification Subject / Header" className="mt-1" />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-neutral-300">Message Template (Use {"{{varName}}"})</label>
                <textarea
                  rows={4}
                  value={messageTemplate}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessageTemplate(e.target.value)}
                  required
                  placeholder="Dear {{receiverName}}, your parcel (LR: {{lrNumber}}) is ready..."
                  className="w-full rounded-md border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-2.5 font-mono text-xs mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-neutral-300">Required Variables (Comma-separated)</label>
                <Input value={variables} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVariables(e.target.value)} placeholder="receiverName, lrNumber, origin" className="mt-1 font-mono" />
              </div>

              {previewResult && (
                <div className="p-3 bg-slate-50 dark:bg-neutral-950 rounded-lg border border-slate-200 dark:border-neutral-800 space-y-1">
                  <p className="font-bold text-slate-700 dark:text-neutral-300">Live Preview Output:</p>
                  <p className="font-mono text-slate-900 dark:text-white bg-white dark:bg-neutral-900 p-2 rounded">{previewResult.message}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <Button type="button" variant="outline" size="sm" onClick={handlePreview} className="gap-1">
                  <Eye className="h-4 w-4" /> Live Preview
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading} size="sm" className="bg-brand-blue text-white">
                    Publish Version
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
