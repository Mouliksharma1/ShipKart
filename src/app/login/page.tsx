"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAction } from "@/app/actions/auth";
import { Truck, Shield, Lock, Phone, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectToParam = searchParams.get("redirectTo");

  const [mode, setMode] = useState<"login" | "forgot">("login");
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

    const res = await loginAction({ email, password });
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Login failed");
    } else {
      setSuccessMsg("Authentication successful! Redirecting to dashboard...");
      const targetUrl = redirectToParam || res.redirectTo || "/customer";
      window.location.href = targetUrl;
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("If your email is registered, password reset instructions have been sent to your administrator.");
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
          <p className="text-xs font-semibold text-amber-300 uppercase tracking-widest">
            Powered by POOJA TRAVELS & CARGO
          </p>
        </div>

        {/* Portal Box */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="border-b border-neutral-800 pb-4 text-center space-y-1">
            <h2 className="text-base font-bold text-white flex items-center justify-center space-x-2">
              <Shield className="h-4 w-4 text-amber-400" />
              <span>Staff & User Authentication</span>
            </h2>
            <p className="text-xs text-neutral-400">
              Enter your official email and password to access your portal
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
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Email Address or Mobile Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email or 10-digit Mobile Number"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-2.5 px-4 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>


              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-neutral-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-2.5 pl-10 pr-4 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-amber-500 py-3 text-xs font-bold text-amber-950 shadow-lg hover:bg-amber-400 transition-colors disabled:opacity-50"
              >
                <span>{loading ? "Authenticating..." : "Sign In to Account"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === "forgot" && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <p className="text-xs text-neutral-400">
                Enter your registered mobile number or email address to contact your Admin for credential resets.
              </p>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Mobile or Email Address</label>
                <input
                  type="text"
                  required
                  placeholder="Enter phone or email"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-2.5 px-4 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-amber-500 py-3 text-xs font-bold text-amber-950 shadow-lg hover:bg-amber-400 transition-colors"
              >
                Request Reset
              </button>
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-xs text-neutral-400 hover:text-amber-400"
                >
                  &larr; Back to Sign In
                </button>
              </div>
            </form>
          )}

          <div className="pt-2 border-t border-neutral-800 text-center">
            <p className="text-[11px] text-neutral-500">
              New employees are provisioned by Admin under <span className="text-neutral-300">Employee Management</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[85vh] flex items-center justify-center text-amber-400 text-xs font-bold">
        Loading ShipKart Auth Portal...
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
