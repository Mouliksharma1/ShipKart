"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MapPin, Shield, Search, PackageCheck, User, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useLanguage } from "@/components/i18n/LanguageContext";
import { LogoutButton } from "@/components/auth/LogoutButton";

export function Header() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 ease-out pointer-events-none bg-transparent">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8 py-2 relative">
        <div
          className={`pointer-events-auto relative transition-all duration-300 ease-out ${
            scrolled
              ? "rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl shadow-xl border border-slate-200/80 dark:border-neutral-800/80 scale-[0.99] mx-1 sm:mx-4 my-1"
              : "rounded-xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-slate-200/60 dark:border-neutral-800/80 shadow-xs"
          }`}
        >
          {/* Main Top Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            {/* Brand Logo & Tagline */}
            <Link href="/" className="flex items-center space-x-3 sm:space-x-3.5 group shrink-0">
              <div className="relative h-11 w-11 sm:h-13 sm:w-13 overflow-hidden rounded-2xl bg-white p-1 shadow-lg shadow-amber-500/15 dark:shadow-amber-500/25 border border-slate-200 dark:border-neutral-800 transition-transform group-hover:scale-105">
                <img src="/shipkartLogo.png" alt="ShipKart Logo" className="h-full w-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  Ship<span className="text-amber-500">Kart</span>
                </span>
                <span className="text-[9px] sm:text-[11px] font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase">
                  POOJA TRAVELS & CARGO
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6 text-xs font-bold">
              <Link href="/track" className="flex items-center space-x-1.5 text-slate-600 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                <Search className="h-4 w-4 text-amber-500" />
                <span>{t("common.trackLr")}</span>
              </Link>
              <Link href="/customer/book" className="flex items-center space-x-1.5 text-slate-600 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                <PackageCheck className="h-4 w-4 text-amber-500" />
                <span>{t("common.bookParcel")}</span>
              </Link>
              <Link href="/offices" className="flex items-center space-x-1.5 text-slate-600 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                <MapPin className="h-4 w-4 text-amber-500" />
                <span>{t("common.offices")}</span>
              </Link>
            </nav>

            {/* Desktop Action Buttons & Contact */}
            <div className="hidden md:flex items-center space-x-2 sm:space-x-3">
              <LanguageSwitcher />
              <ThemeToggle />
              <LogoutButton />
              <Link
                href="/login"
                className="flex items-center space-x-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-black text-amber-950 shadow-md shadow-amber-500/20 hover:bg-amber-400 active:scale-95 transition-all"
              >
                <User className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>{t("common.customerLogin")}</span>
              </Link>
            </div>

            {/* Mobile Controls: Theme Toggle, Language Switcher, Logout Button & Hamburger Button */}
            <div className="flex md:hidden items-center space-x-1.5">
              <LanguageSwitcher />
              <ThemeToggle />
              <LogoutButton />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-200 hover:bg-slate-200 dark:hover:bg-neutral-700 active:scale-95 transition-all border border-slate-200 dark:border-neutral-700 cursor-pointer"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5 text-amber-600 dark:text-amber-400 transition-transform duration-200 rotate-90" />
                ) : (
                  <Menu className="h-5 w-5 text-slate-800 dark:text-neutral-200 transition-transform duration-200" />
                )}
              </button>
            </div>
          </div>

          {/* Absolute Floating Mobile Drawer Menu (Overlays hero section) */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-slate-200/80 dark:border-neutral-800/80 shadow-2xl p-4 space-y-3 animate-in fade-in zoom-in-95 duration-200">
              {/* Navigation Links */}
              <div className="grid grid-cols-1 gap-1.5">
                <Link
                  href="/track"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-neutral-200 bg-slate-50 dark:bg-neutral-950/60 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200/60 dark:border-neutral-800 transition-all"
                >
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                    <Search className="h-4 w-4" />
                  </div>
                  <span>Track LR / Consignment</span>
                </Link>

                <Link
                  href="/customer/book"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-neutral-200 bg-slate-50 dark:bg-neutral-950/60 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200/60 dark:border-neutral-800 transition-all"
                >
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                    <PackageCheck className="h-4 w-4" />
                  </div>
                  <span>Book Parcel Online</span>
                </Link>

                <Link
                  href="/offices"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-neutral-200 bg-slate-50 dark:bg-neutral-950/60 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200/60 dark:border-neutral-800 transition-all"
                >
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span>Branch Offices & Addresses</span>
                </Link>
              </div>

              {/* Portal & Login Buttons */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-neutral-800/60">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-1.5 rounded-xl bg-amber-500 text-amber-950 px-3 py-2.5 text-xs font-black shadow-md shadow-amber-500/20 hover:bg-amber-400 active:scale-95 transition-all text-center w-full"
                >
                  <User className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>{t("common.customerLogin")}</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
