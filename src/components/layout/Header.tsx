"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MapPin, Shield, Search, PackageCheck, User, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useLanguage } from "@/components/i18n/LanguageContext";
import { LogoutButton } from "@/components/auth/LogoutButton";

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || "";
  return "";
}

export function Header() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string>("");
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check login status on mount & route change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const custPhone = localStorage.getItem("shipkart_customer_phone") || getCookie("shipkart_customer_phone") || getCookie("shipkart_customer_id");
      const staffId = getCookie("shipkart_staff_id");
      const loggedInState = Boolean(custPhone || staffId);
      setIsLoggedIn(loggedInState);

      if (custPhone && loggedInState) {
        const cachedImg = localStorage.getItem(`shipkart_avatar_${custPhone}`);
        if (cachedImg) setUserAvatar(cachedImg);
        else setUserAvatar("");
      } else {
        setUserAvatar("");
      }
      setIsHydrated(true);
    }
  }, [pathname]);

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
                <span className="hidden sm:block text-[11px] font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase">
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
              {isLoggedIn ? (
                <>
                  <LogoutButton />
                  <Link
                    href="/customer/profile"
                    className="flex items-center justify-center p-0.5 rounded-full hover:scale-105 active:scale-95 transition-all group"
                    title="Account Profile & Settings"
                  >
                    {/* Insta/YouTube style story ring avatar */}
                    <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-md shadow-rose-500/20">
                      <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center border-2 border-white dark:border-neutral-900 overflow-hidden">
                        {userAvatar ? (
                          <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-4.5 w-4.5 text-white stroke-[2.5]" />
                        )}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-neutral-900 rounded-full" />
                    </div>
                  </Link>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 shadow-md shadow-amber-500/20 active:scale-95 transition-all text-xs font-black"
                >
                  <span>{t("common.customerLogin")}</span>
                </Link>
              )}
            </div>

            {/* Mobile Controls: Theme Toggle, Language Switcher & Hamburger Button */}
            <div className="flex md:hidden items-center space-x-1.5">
              <LanguageSwitcher />
              <ThemeToggle />
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

              {/* Portal & Login / Profile Buttons */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-neutral-800/60 space-y-2">
                {isLoggedIn ? (
                  <>
                    <div className="pt-1">
                      <LogoutButton
                        showText={true}
                        className="w-full py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-600 border border-red-500/20 text-red-600 dark:text-red-400 hover:text-white font-black text-xs transition-all flex items-center justify-center space-x-2 shadow-xs active:scale-95 cursor-pointer mb-2"
                      />
                    </div>
                    <Link
                      href="/customer/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all w-full"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-amber-300 via-rose-400 to-purple-500">
                          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center border-2 border-white">
                            <User className="h-4 w-4 text-white stroke-[2.5]" />
                          </div>
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
                        </div>
                        <div className="text-left leading-tight">
                          <div className="text-xs font-black">My Profile</div>
                          <div className="text-[10px] text-amber-100 font-medium">Manage account & settings</div>
                        </div>
                      </div>
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 px-3 py-2.5 text-xs font-black shadow-md active:scale-95 transition-all text-center w-full"
                  >
                    <span>{t("common.customerLogin")}</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
