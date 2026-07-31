"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, MapPin, Shield, Search, PackageCheck, User } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 ease-out pointer-events-none">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8 py-2">
        <div
          className={`pointer-events-auto flex items-center justify-between px-4 py-3 sm:px-6 transition-all duration-300 ease-out ${
            scrolled
              ? "rounded-2xl bg-white/85 dark:bg-neutral-950/85 backdrop-blur-xl shadow-xl border border-slate-200/80 dark:border-neutral-800 scale-[0.99] mx-2 sm:mx-4 my-1.5"
              : "rounded-xl bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border border-slate-200/60 dark:border-neutral-800/80 shadow-xs"
          }`}
        >
          {/* Brand Logo & Tagline */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white p-0.5 shadow-md shadow-amber-500/10 dark:shadow-amber-500/20 border border-slate-200 dark:border-neutral-800 transition-transform group-hover:scale-105">
              <img src="/logo.png" alt="ShipKart Logo" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Ship<span className="text-amber-500">Kart</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase">
                POOJA TRAVELS & CARGO
              </span>
            </div>
          </Link>

          {/* Quick Nav */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold">
            <Link href="/employee/tracking" className="flex items-center space-x-1.5 text-slate-600 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              <Search className="h-4 w-4 text-amber-500" />
              <span>Track LR</span>
            </Link>
            <Link href="/customer/book" className="flex items-center space-x-1.5 text-slate-600 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              <PackageCheck className="h-4 w-4 text-amber-500" />
              <span>Book Parcel</span>
            </Link>
            <Link href="/offices" className="flex items-center space-x-1.5 text-slate-600 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              <MapPin className="h-4 w-4 text-amber-500" />
              <span>Offices</span>
            </Link>
          </nav>

          {/* Action Buttons & Contact */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <ThemeToggle />
            <a href="tel:6350603414" className="hidden lg:flex items-center space-x-2 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 hover:bg-amber-500/20 transition-colors">
              <Phone className="h-3.5 w-3.5" />
              <span>6350603414</span>
            </a>
            <Link
              href="/login"
              className="flex items-center space-x-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-3.5 py-2 text-xs font-black shadow-md hover:bg-slate-800 dark:hover:bg-slate-100 hover:shadow-amber-500/10 active:scale-95 transition-all border border-slate-800 dark:border-slate-200"
            >
              <User className="h-3.5 w-3.5 text-amber-400 dark:text-amber-600 stroke-[2.5]" />
              <span>Customer Login</span>
            </Link>
            <Link
              href="/employee/login"
              className="flex items-center space-x-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-black text-amber-950 shadow-md hover:bg-amber-400 active:scale-95 transition-all"
            >
              <Shield className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Staff Terminal</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
