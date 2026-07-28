'use client';

import React, { useState } from 'react';
import { KeyRound, CheckCircle2, RefreshCw, X } from 'lucide-react';
import { generateOTPAction, collectParcelAction } from '@/app/actions/collection';

interface OTPDialogProps {
  bookingId: string;
  lrNumber: string;
  receiverName: string;
  receiverPhone: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const OTPDialog: React.FC<OTPDialogProps> = ({
  bookingId,
  lrNumber,
  receiverName,
  receiverPhone,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [collectedByName, setCollectedByName] = useState(receiverName);
  const [generatedOtpDisplay, setGeneratedOtpDisplay] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    const res = await generateOTPAction(bookingId);
    if (res.success && res.data) {
      setOtpSent(true);
      setGeneratedOtpDisplay(res.data.otp);
    } else {
      setError(res.error || 'Failed to generate OTP');
    }
    setLoading(false);
  };

  const handleVerifyAndCollect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setError('Please enter a 6-digit numeric OTP code.');
      return;
    }
    setLoading(true);
    setError(null);

    const res = await collectParcelAction(bookingId, otpCode, collectedByName || receiverName);
    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setError(res.error || 'Invalid OTP code');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-xl relative transition-all">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-500/20">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Parcel Handover & OTP Verification</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">LR #{lrNumber} · Receiver: {receiverName}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        {!otpSent ? (
          <div className="space-y-4 text-center py-4">
            <p className="text-xs text-slate-600 dark:text-zinc-400">
              Click below to send a 6-digit collection OTP code to the receiver&apos;s phone <strong className="text-slate-900 dark:text-white">{receiverPhone}</strong> via SMS / WhatsApp.
            </p>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-2xl text-xs font-extrabold transition shadow-xs"
            >
              {loading ? 'Sending OTP Code...' : 'Generate & Send Collection OTP'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerifyAndCollect} className="space-y-4">
            {generatedOtpDisplay && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center">
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-semibold uppercase block">System Demo OTP Code</span>
                <span className="text-2xl font-mono font-black text-emerald-600 dark:text-emerald-400 tracking-widest">{generatedOtpDisplay}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1">Received By (Name)</label>
              <input
                type="text"
                value={collectedByName}
                onChange={(e) => setCollectedByName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1">Enter 6-Digit OTP Code</label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="483921"
                required
                className="w-full px-3.5 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-center text-xl font-mono font-black tracking-widest text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="px-4 py-3 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-700 dark:text-zinc-300 rounded-2xl text-xs font-bold transition flex items-center"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Resend
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-extrabold transition shadow-xs flex items-center justify-center"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> {loading ? 'Verifying...' : 'Verify OTP & Complete Collection'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
