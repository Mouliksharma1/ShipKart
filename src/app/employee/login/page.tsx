"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { employeeLoginAction } from "@/app/actions/auth";
import { Shield, KeyRound, User, ArrowRight, CheckCircle2, AlertCircle, Building2 } from "lucide-react";
import Link from "next/link";

function EmployeeLoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectToParam = searchParams.get("redirectTo");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const res = await employeeLoginAction({ username, password });
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Employee authentication failed");
    } else {
      setSuccessMsg("Employee authentication verified! Opening terminal...");
      const targetUrl = redirectToParam || res.redirectTo || "/employee";
      window.location.href = targetUrl;
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.15),rgba(255,255,255,0))]">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 shadow-xl shadow-amber-500/20">
            <img src="/logo.png" alt="ShipKart Logo" className="h-full w-full object-contain" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Ship<span className="text-amber-400">Kart</span>
          </h1>
          <p className="text-xs font-bold text-amber-300 uppercase tracking-widest">
            OFFICE STAFF & TERMINAL AUTHENTICATION
          </p>
        </div>

        {/* Portal Box */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="border-b border-neutral-800 pb-4 text-center space-y-1">
            <h2 className="text-base font-bold text-white flex items-center justify-center space-x-2">
              <Building2 className="h-4 w-4 text-amber-400" />
              <span>Counter & Staff Terminal Login</span>
            </h2>
            <p className="text-xs text-neutral-400">
              Enter your Admin-assigned Employee Code / Username & Password
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="flex items-center space-x-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center space-x-2 rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-xs text-green-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Employee Code / Phone / Username</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. EMP-1004 or 9829012345"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-2.5 px-4 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Staff Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-2.5 px-4 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-xl text-xs font-extrabold transition shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>{loading ? "Authenticating Terminal..." : "Access Staff Terminal"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="pt-2 text-center border-t border-neutral-800">
            <Link href="/login" className="text-xs text-neutral-400 hover:text-amber-400 font-medium">
              Customer Portal Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmployeeLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center text-xs">Loading Staff Terminal Login...</div>}>
      <EmployeeLoginFormContent />
    </Suspense>
  );
}
