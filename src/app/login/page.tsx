"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAction, registerCustomerAction } from "@/app/actions/auth";
import { Shield, Lock, Phone, User, Mail, ArrowRight, CheckCircle2, AlertCircle, Sparkles, UserPlus, LogIn } from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectToParam = searchParams.get("redirectTo");

  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sign In state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign Up / Register state
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (regPassword !== regConfirmPassword) {
      setLoading(false);
      setError("Passwords do not match. Please verify both password fields.");
      return;
    }

    if (!/^[0-9]{10}$/.test(regPhone)) {
      setLoading(false);
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    const res = await registerCustomerAction({
      name: regName,
      phone: regPhone,
      email: regEmail || undefined,
      password: regPassword,
      confirmPassword: regConfirmPassword,
    });

    setLoading(false);

    if (!res.success) {
      setError(res.error || "Customer registration failed");
    } else {
      setSuccessMsg("Account created successfully! Logging you in...");
      const targetUrl = redirectToParam || res.redirectTo || "/customer";
      window.location.href = targetUrl;
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("If your account is registered, password reset instructions have been dispatched.");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.18),rgba(255,255,255,0))]">
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
            CUSTOMER PORTAL & EXPRESS LOGISTICS
          </p>
        </div>

        {/* Auth Mode Tab Switcher */}
        {mode !== "forgot" && (
          <div className="grid grid-cols-2 p-1.5 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(null); setSuccessMsg(null); }}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                mode === "login"
                  ? "bg-amber-500 text-amber-950 shadow-lg shadow-amber-500/20"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setError(null); setSuccessMsg(null); }}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                mode === "register"
                  ? "bg-amber-500 text-amber-950 shadow-lg shadow-amber-500/20"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        )}

        {/* Portal Container */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="border-b border-neutral-800 pb-4 text-center space-y-1">
            <h2 className="text-base font-bold text-white flex items-center justify-center space-x-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>
                {mode === "login"
                  ? "Customer Sign In"
                  : mode === "register"
                  ? "New Customer Registration"
                  : "Reset Password"}
              </span>
            </h2>
            <p className="text-xs text-neutral-400">
              {mode === "login"
                ? "Enter your mobile or email to track & manage parcel bookings"
                : mode === "register"
                ? "Register your mobile number to instantly book & track shipments"
                : "Reset your customer portal access password"}
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="flex items-center space-x-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-400 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center space-x-2 rounded-xl bg-green-500/10 border border-green-500/20 p-3.5 text-xs text-green-400 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Email Address or Mobile Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter 10-digit Mobile or Email"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-2.5 pl-10 pr-4 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-neutral-300">Password</label>
                  <button
                    type="button"
                    onClick={() => { setMode("forgot"); setError(null); setSuccessMsg(null); }}
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
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-2.5 pl-10 pr-4 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-amber-500 py-3 text-xs font-extrabold text-amber-950 shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all active:scale-95 disabled:opacity-50"
              >
                <span>{loading ? "Verifying Credentials..." : "Sign In to Customer Portal"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* SIGN UP / REGISTER FORM */}
          {mode === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-2.5 pl-10 pr-4 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Mobile Number (Primary Login ID)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 9829012345"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-2.5 pl-10 pr-4 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Email Address (Optional)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="ramesh@gmail.com"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-2.5 pl-10 pr-4 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-2.5 px-3 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-2.5 px-3 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-amber-500 py-3 text-xs font-extrabold text-amber-950 shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all active:scale-95 disabled:opacity-50"
              >
                <span>{loading ? "Creating Account..." : "Create Free Customer Account"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === "forgot" && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <p className="text-xs text-neutral-400 leading-relaxed">
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
                className="w-full rounded-xl bg-amber-500 py-3 text-xs font-extrabold text-amber-950 shadow-lg hover:bg-amber-400 transition-colors"
              >
                Request Reset
              </button>
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setMode("login"); setError(null); setSuccessMsg(null); }}
                  className="text-xs text-neutral-400 hover:text-amber-400 font-medium"
                >
                  &larr; Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* Footer note */}
          <div className="pt-2 border-t border-neutral-800 text-center">
            <p className="text-[11px] text-neutral-500">
              {mode === "register" ? (
                <>Already have an account? <button type="button" onClick={() => setMode("login")} className="text-amber-400 font-bold hover:underline">Sign In here</button></>
              ) : (
                <>Need an account? <button type="button" onClick={() => setMode("register")} className="text-amber-400 font-bold hover:underline">Register now</button></>
              )}
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

