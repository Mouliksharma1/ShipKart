'use client';

import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AlertCardProps {
  alert: {
    id: string;
    alertNumber: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
    title: string;
    description: string;
    module: string;
    createdAt: Date | string;
  };
  onAcknowledge?: (id: string) => void;
  onResolve?: (id: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onAcknowledge, onResolve }) => {
  const getSeverityStyle = (s: string) => {
    switch (s) {
      case 'CRITICAL': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
      case 'HIGH': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30';
      default: return 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-zinc-950/50 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4 mb-3 flex items-start justify-between hover:border-amber-500/40 transition">
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1.5">
          <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border uppercase tracking-wider ${getSeverityStyle(alert.severity)}`}>
            {alert.severity}
          </span>
          <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono font-bold">{alert.alertNumber}</span>
          <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">· {alert.module}</span>
        </div>
        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{alert.title}</h4>
        <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 font-medium">{alert.description}</p>
        <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-2 block font-medium">
          Detected: {new Date(alert.createdAt).toLocaleTimeString()}
        </span>
      </div>

      <div className="flex flex-col space-y-1.5 ml-4 shrink-0">
        {alert.status === 'ACTIVE' && onAcknowledge && (
          <button
            onClick={() => onAcknowledge(alert.id)}
            className="px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-xl font-extrabold transition shadow-xs"
          >
            Acknowledge
          </button>
        )}
        {alert.status !== 'RESOLVED' && onResolve && (
          <button
            onClick={() => onResolve(alert.id)}
            className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-extrabold transition shadow-xs"
          >
            Resolve
          </button>
        )}
        {alert.status === 'RESOLVED' && (
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 px-2.5 py-1 bg-emerald-500/10 rounded-xl">Resolved</span>
        )}
      </div>
    </div>
  );
};

