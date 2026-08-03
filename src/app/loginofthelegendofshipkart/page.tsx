"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminLoginAction } from "@/app/actions/auth";
import { Shield, Lock, ArrowRight, CheckCircle2, AlertCircle, KeyRound } from "lucide-react";

function AdminLoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectToParam = searchParams.get("redirectTo");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const res = await adminLoginAction({ email, password });
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Admin authentication failed");
    } else {
      setSuccessMsg("Admin authentication verified! Loading Admin Console...");
      const targetUrl = redirectToParam || res.redirectTo || "/admin";
      window.location.href = targetUrl;
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.15),rgba(255,255,255,0))] transition-colors duration-300">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 shadow-xl shadow-amber-500/20 border border-slate-200 dark:border-neutral-800">
            <img src="/logo.png" alt="ShipKart Logo" className="h-full w-full object-contain" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Ship<span className="text-amber-500 dark:text-amber-400">Kart</span>
          </h1>
          <p className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center justify-center space-x-1">
            <Shield className="h-3.5 w-3.5 inline" />
            <span>ADMIN CONSOLE</span>
          </p>
        </div>

        {/* Portal Box */}
        <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 p-6 sm:p-8 shadow-xl dark:shadow-2xl backdrop-blur-xl space-y-6 transition-colors">
          <div className="border-b border-slate-200 dark:border-neutral-800 pb-4 text-center space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-center space-x-2">
              <KeyRound className="h-4 w-4 text-amber-500 dark:text-amber-400" />
              <span>Admin System Authentication</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Authorized Master Admin Credentials Only
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="flex items-center space-x-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center space-x-2 rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-xs text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">Admin Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shipKart.com"
                  className="w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2.5 px-4 text-xs text-slate-900 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1">Admin Security Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-neutral-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-xl text-xs font-extrabold transition shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? "Authenticating Admin..." : "Access Admin Console"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-white flex items-center justify-center text-xs">Loading Admin Portal...</div>}>
      <AdminLoginFormContent />
    </Suspense>
  );
}
