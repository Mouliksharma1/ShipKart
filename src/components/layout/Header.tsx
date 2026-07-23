import React from "react";
import Link from "next/link";
import { Phone, MapPin, Shield, Search, PackageCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-amber-900/10 bg-white/95 dark:bg-gradient-to-r dark:from-amber-950 dark:via-neutral-900 dark:to-amber-950 text-slate-900 dark:text-amber-50 shadow-sm dark:shadow-md backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-white p-0.5 shadow-md shadow-amber-500/10 dark:shadow-amber-500/20 border border-slate-200 dark:border-transparent transition-transform group-hover:scale-105">
            <img src="/logo.png" alt="ShipKart Logo" className="h-full w-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
              Ship<span className="text-amber-600 dark:text-amber-400">Kart</span>
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-amber-700 dark:text-amber-300 uppercase">
              Powered by POOJA TRAVELS & CARGO
            </span>
          </div>
        </Link>

        {/* Quick Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/track" className="flex items-center space-x-1.5 text-slate-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            <Search className="h-4 w-4" />
            <span>Track LR</span>
          </Link>
          <Link href="/booking" className="flex items-center space-x-1.5 text-slate-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            <PackageCheck className="h-4 w-4" />
            <span>Book Parcel</span>
          </Link>
          <Link href="/offices" className="flex items-center space-x-1.5 text-slate-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            <MapPin className="h-4 w-4" />
            <span>Offices</span>
          </Link>
        </nav>

        {/* Action Button & Contact */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <a href="tel:6350603414" className="hidden sm:flex items-center space-x-2 text-xs text-amber-800 dark:text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 hover:bg-amber-500/20 transition-colors">
            <Phone className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span className="font-semibold">6350603414</span>
          </a>
          <Link
            href="/login"
            className="flex items-center space-x-1 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-amber-950 shadow-md hover:bg-amber-400 transition-all active:scale-95"
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Staff / Portal</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
