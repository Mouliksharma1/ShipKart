'use client';

import React, { useState } from 'react';
import {
  lockEmployeeAccountAction,
  unlockEmployeeAccountAction,
  forcePasswordResetAction,
  archiveEmployeeAction,
  restoreEmployeeAction,
} from '@/app/actions/admin/employee';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Unlock, KeyRound, CheckCircle2, AlertOctagon, Archive, RefreshCw, Loader2 } from 'lucide-react';

interface EmployeeSecurityControlsProps {
  employee: any;
}

export function EmployeeSecurityControls({ employee }: EmployeeSecurityControlsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAction = async (actionFn: () => Promise<{ success: boolean; error?: string }>, successText: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await actionFn();
      if (res.success) {
        setMessage({ type: 'success', text: successText });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: res.error || 'Action failed' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-6">
      <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
        <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Account Security Status</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Enterprise security & lockout controls</p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Security Status Badges */}
      <div className="space-y-3 text-xs">
        <div className="p-3.5 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-slate-500 dark:text-zinc-400 font-medium">Account Lockout:</span>
          {employee.accountLocked ? (
            <span className="flex items-center font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-800/60">
              <Lock className="w-3.5 h-3.5 mr-1" /> Locked ({employee.failedLoginAttempts} failed attempts)
            </span>
          ) : (
            <span className="flex items-center font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Unlocked
            </span>
          )}
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-slate-500 dark:text-zinc-400 font-medium">Password Flag:</span>
          {employee.passwordResetRequired ? (
            <span className="flex items-center font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800/60">
              <KeyRound className="w-3.5 h-3.5 mr-1" /> Reset Required
            </span>
          ) : (
            <span className="font-semibold text-slate-700 dark:text-zinc-300">Normal</span>
          )}
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-slate-500 dark:text-zinc-400 font-medium">Active Record:</span>
          {employee.isActive ? (
            <span className="font-bold text-emerald-600 dark:text-emerald-400">Active Staff</span>
          ) : (
            <span className="font-bold text-rose-600 dark:text-rose-400">Archived Record</span>
          )}
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-800 space-y-1 text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
          <div>Last Login: {employee.lastLoginAt ? new Date(employee.lastLoginAt).toLocaleString('en-IN') : 'Never logged in'}</div>
          <div>Password Changed: {employee.passwordChangedAt ? new Date(employee.passwordChangedAt).toLocaleString('en-IN') : 'Default'}</div>
        </div>
      </div>

      {/* Interactive Action Buttons */}
      <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-3">
        <h4 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-[11px]">Security Actions</h4>

        {employee.accountLocked ? (
          <button
            onClick={() => handleAction(() => unlockEmployeeAccountAction(employee.id), 'Employee account unlocked successfully.')}
            disabled={loading}
            className="w-full flex items-center justify-center p-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Unlock className="w-4 h-4 mr-2" />} Unlock Account
          </button>
        ) : (
          <button
            onClick={() => handleAction(() => lockEmployeeAccountAction(employee.id), 'Employee account locked successfully.')}
            disabled={loading}
            className="w-full flex items-center justify-center p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />} Lock Account
          </button>
        )}

        <button
          onClick={() => handleAction(() => forcePasswordResetAction(employee.id), 'Forced password reset flag enabled.')}
          disabled={loading}
          className="w-full flex items-center justify-center p-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-xl font-bold transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <KeyRound className="w-4 h-4 mr-2" />} Force Password Reset
        </button>

        {employee.isActive ? (
          <button
            onClick={() => handleAction(() => archiveEmployeeAction(employee.id), 'Employee record archived.')}
            disabled={loading}
            className="w-full flex items-center justify-center p-3 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Archive className="w-4 h-4 mr-2" />} Archive Staff Record
          </button>
        ) : (
          <button
            onClick={() => handleAction(() => restoreEmployeeAction(employee.id), 'Employee record restored.')}
            disabled={loading}
            className="w-full flex items-center justify-center p-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />} Restore Staff Record
          </button>
        )}
      </div>
    </div>
  );
}
