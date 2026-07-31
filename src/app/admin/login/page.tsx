"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminLoginAction } from "@/app/actions/auth";
import { ShieldAlert, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

function AdminLoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectToParam = searchParams.get("redirectTo");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form state
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
      setSuccessMsg("Admin privileges verified! Opening Enterprise Hub...");
      const targetUrl = redirectToParam || res.redirectTo || "/admin";
      window.location.href = targetUrl;
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(220,38,38,0.2),rgba(0,0,0,0))] transition-colors">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 shadow-xl shadow-red-500/20 border border-neutral-800">
            <img src="/logo.png" alt="ShipKart Logo" className="h-full w-full object-contain" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Ship<span className="text-red-500">Kart</span> Enterprise Admin
          </h1>
          <p className="text-xs font-bold text-red-400 uppercase tracking-widest">
            MASTER ENTERPRISE ADMINISTRATION CONTROL
          </p>
        </div>

        {/* Portal Box */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="border-b border-neutral-800 pb-4 text-center space-y-1">
            <h2 className="text-base font-bold text-white flex items-center justify-center space-x-2">
              <ShieldAlert className="h-4 w-4 text-red-500" />
              <span>Master Admin Portal Login</span>
            </h2>
            <p className="text-xs text-neutral-400">
              Enter your Master Admin email address & security credentials
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="flex items-center space-x-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 font-bold">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center space-x-2 rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-xs text-green-400 font-bold">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Admin Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shipkart.com"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-2.5 px-4 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Admin Security Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-2.5 px-4 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 font-mono transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-extrabold transition shadow-lg shadow-red-600/20 flex items-center justify-center space-x-2 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? "Verifying Master Credentials..." : "Authenticate Admin Portal"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="pt-2 text-center border-t border-neutral-800 flex justify-between text-xs text-neutral-400 font-medium">
            <Link href="/employee/login" className="hover:text-amber-400">
              ← Counter Staff Terminal
            </Link>
            <Link href="/login" className="hover:text-amber-400">
              Customer Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center text-xs">Loading Admin Portal...</div>}>
      <AdminLoginFormContent />
    </Suspense>
  );
}
