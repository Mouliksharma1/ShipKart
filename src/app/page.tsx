"use client";

import React from "react";
import Link from "next/link";
import { Truck, Search, ShieldCheck, ArrowRight, CheckCircle, Package } from "lucide-react";
import { Typewriter } from "@/components/ui/typewriter";
import { InstantTrackerForm } from "@/components/tracking/InstantTrackerForm";
import { useLanguage } from "@/components/i18n/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 transition-colors duration-300">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200 dark:border-neutral-800/80 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.18),rgba(0,0,0,0))]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                <Truck className="h-4 w-4" />
                <span>{t("hero.badge")}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {t("hero.titlePrefix")} <br />
                <span className="inline-block whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 dark:from-amber-400 dark:via-amber-200 dark:to-amber-500">
                  <Typewriter
                    words={[
                      t("hero.titleHighlight"),
                      t("common.sequentialLr"),
                      t("reports.rajasthanRoutes"),
                      t("common.trackLr")
                    ]}
                    speed={80}
                    delayBetweenWords={2000}
                  />
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                {t("hero.description")}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/customer/book"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-extrabold text-amber-950 shadow-xl shadow-amber-500/20 hover:bg-amber-400 transition-transform active:scale-95"
                >
                  <Package className="h-5 w-5" />
                  <span>{t("hero.ctaBook")}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 px-6 py-3.5 text-sm font-bold text-slate-800 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <span>{t("common.customerLogin")}</span>
                </Link>
              </div>

              {/* Badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-600 dark:text-neutral-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span>{t("common.stationPickupOnly")}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span>{t("common.sequentialLr")}</span>
                </div>
              </div>
            </div>

            {/* Right Card - Quick LR Tracker */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
                <InstantTrackerForm />

                <div className="rounded-xl bg-slate-100 dark:bg-neutral-950 p-4 border border-slate-200 dark:border-neutral-800/80 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-neutral-400">
                    <span>{t("hero.helplineLabel")}</span>
                    <a href="tel:6350603414" className="text-amber-600 dark:text-amber-400 font-bold">6350603414</a>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-neutral-400">
                    <span>{t("hero.operatingLabel")}</span>
                    <span className="text-slate-900 dark:text-neutral-200 font-semibold">{t("common.operatingHours")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>ion>

      {/* QUICK RATE CARDS */}
      <section className="py-16 bg-slate-100/60 dark:bg-neutral-900/50 border-b border-slate-200 dark:border-neutral-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Transparent Freight Pricing</h2>
            <p className="text-xs text-slate-600 dark:text-neutral-400">Standardized rate card for Rajasthan and Outside destinations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rajasthan Tariff */}
            <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-3">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">Rajasthan Route Tariffs</h3>
                <span className="text-[11px] text-slate-500 dark:text-neutral-400">Fixed Rate</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
                  <span className="text-[11px] text-slate-500 dark:text-neutral-400 block">Envelope</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">₹99</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
                  <span className="text-[11px] text-slate-500 dark:text-neutral-400 block">Box</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">₹149</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
                  <span className="text-[11px] text-slate-500 dark:text-neutral-400 block">Medium</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">₹199</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
                  <span className="text-[11px] text-slate-500 dark:text-neutral-400 block">Large Bundle</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">₹249</span>
                </div>
              </div>
            </div>

            {/* Outside Rajasthan Tariff */}
            <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-3">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">Outside Rajasthan Tariffs</h3>
                <span className="text-[11px] text-slate-500 dark:text-neutral-400">UP / Interstate</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
                  <span className="text-[11px] text-slate-500 dark:text-neutral-400 block">Envelope</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">₹199</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
                  <span className="text-[11px] text-slate-500 dark:text-neutral-400 block">Box</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">₹399</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
                  <span className="text-[11px] text-slate-500 dark:text-neutral-400 block">Medium</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">₹499</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
                  <span className="text-[11px] text-slate-500 dark:text-neutral-400 block">Large Bundle</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">Configurable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
