"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Truck, Search, ShieldCheck, ArrowRight, CheckCircle, Package, Clock, MapPin, Handshake, Phone, Sparkles, PhoneCall } from "lucide-react";
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
      </section>

      {/* QUICK RATE CARDS */}
      <section className="py-16 bg-slate-100/60 dark:bg-neutral-900/50 border-b border-slate-200 dark:border-neutral-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Transparent Freight Pricing</h2>
            <p className="text-xs text-slate-600 dark:text-neutral-400">
              Standardized rate card for Rajasthan and Outside destinations. Amount of parcel may change depending upon the size and type.
            </p>
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

      {/* DELIVERY SLA GUARANTEE TIMELINES */}
      <section className="py-16 bg-white dark:bg-neutral-950 border-b border-slate-200 dark:border-neutral-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-widest">
              SUPER-FAST DISPATCH TIMELINES
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Estimated Delivery Timeframe</h2>
            <p className="text-xs text-slate-600 dark:text-neutral-400">
              Daily bus freight network ensures high-speed transit and express station office delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Within Rajasthan */}
            <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-white to-amber-500/10 dark:from-amber-500/10 dark:via-neutral-900 dark:to-amber-500/5 p-7 space-y-4 shadow-xl group hover:border-amber-500/60 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-2xl bg-amber-500 text-amber-950 shadow-md flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-amber-950 fill-amber-950/20" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Within Rajasthan</h3>
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400">Express Local Transit</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black border border-emerald-500/20">
                  90% Next-Day
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed font-medium">
                In Rajasthan, <strong className="text-amber-600 dark:text-amber-400 font-extrabold">90% of parcels are delivered just the next day</strong> of booking via our direct overnight bus cargo network.
              </p>

              <div className="pt-2 flex items-center text-[11px] font-bold text-slate-500 dark:text-neutral-400 space-x-2 border-t border-amber-500/10">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Next-Day Arrival Guaranteed at Branch Office</span>
              </div>
            </div>

            {/* Outside Rajasthan */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-neutral-800 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 p-7 space-y-4 shadow-xl group hover:border-slate-400 dark:hover:border-neutral-700 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black shadow-md">
                    🚛
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Outside Rajasthan</h3>
                    <p className="text-xs font-bold text-slate-500 dark:text-neutral-400">Interstate Cargo Route</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-black border border-blue-500/20">
                  2 Days Transit
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed font-medium">
                Outside Rajasthan, parcels take <strong className="text-slate-900 dark:text-white font-extrabold">2 days after booking</strong> to reach the destination branch office safely.
              </p>

              <div className="pt-2 flex items-center text-[11px] font-bold text-slate-500 dark:text-neutral-400 space-x-2 border-t border-slate-200 dark:border-neutral-800">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span>2-Day Delivery Commitment to Destination Branch</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RAJASTHAN SERVICE COVERAGE MAP SECTION */}
      <section className="py-20 bg-slate-100/80 dark:bg-neutral-950 border-b border-slate-200 dark:border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 rounded-lg bg-amber-500 text-amber-950 px-4 py-1.5 text-xs font-black tracking-widest uppercase shadow-sm">
              <MapPin className="h-4 w-4" />
              <span>LOGISTICS NETWORK COVERAGE</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl lg:text-5xl leading-tight">
              Currently Serving Here in <span className="bg-amber-500/20 dark:bg-amber-500/30 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-xl inline-block border border-amber-500/40">Rajasthan</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 leading-relaxed font-semibold max-w-xl mx-auto">
              Connecting major commercial hubs, industrial centers, and all district branch offices with guaranteed daily express overnight bus cargo transit.
            </p>
          </div>

          {/* Grid: Map & Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-6xl mx-auto">
            {/* Map Image Display Card */}
            <div className="lg:col-span-7">
              <div className="group relative rounded-3xl border-2 border-amber-500/40 bg-white dark:bg-neutral-900 p-3 sm:p-4 shadow-xl transition-all duration-300 hover:border-amber-500">
                <div className="relative overflow-hidden rounded-2xl bg-slate-200 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-800">
                  <Image
                    src="/rajasthanmap.jpeg"
                    alt="Currently Serving Here in Rajasthan - ShipKart Network Map"
                    width={1200}
                    height={900}
                    className="w-full h-auto object-cover rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                    priority
                  />
                  {/* Floating Badges on Map (No Blurs) */}
                  <div className="absolute top-4 left-4 bg-slate-900 text-amber-400 border border-amber-500/50 text-xs font-black px-3.5 py-1.5 rounded-lg flex items-center space-x-2 shadow-md">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                    <span>100% Active Direct Routes</span>
                  </div>

                  <div className="absolute bottom-4 right-4 bg-amber-500 text-amber-950 text-[11px] font-black px-3 py-1.5 rounded-lg shadow-md flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Overnight Express Transit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Network Highlights */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Statewide Direct Bus Cargo Network
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 leading-relaxed font-medium">
                  Pooja Travels & Cargo operates daily express routes across all key districts in Rajasthan, guaranteeing 90% next-day parcel delivery straight to destination branch offices.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start space-x-4 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-sm">
                  <div className="p-3 rounded-xl bg-amber-500 text-amber-950 shrink-0 font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">Overnight Express Bus Transit</h4>
                    <p className="text-xs text-slate-600 dark:text-neutral-400 mt-0.5">Daily dispatches ensuring 90% next-day delivery across Rajasthan.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-sm">
                  <div className="p-3 rounded-xl bg-emerald-500 text-emerald-950 shrink-0 font-bold">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">Branch Terminal Pickups</h4>
                    <p className="text-xs text-slate-600 dark:text-neutral-400 mt-0.5">Safe OTP-verified pickup directly from partner branch terminals.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-sm">
                  <div className="p-3 rounded-xl bg-blue-500 text-white shrink-0 font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">Interstate Cargo Route</h4>
                    <p className="text-xs text-slate-600 dark:text-neutral-400 mt-0.5">2-day transit commitment for routes extending outside Rajasthan (UP & Interstate).</p>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <Link
                  href="/offices"
                  className="inline-flex items-center space-x-2 text-xs font-black text-amber-600 dark:text-amber-400 hover:underline group"
                >
                  <span>View All Branch Offices & Station Locations</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* SOLID CRISP CARGO OWNER COLLABORATION BANNER (NO BLURS) */}
          <div className="mt-12 rounded-3xl border-2 border-amber-500 bg-amber-500/10 dark:bg-neutral-900 p-6 sm:p-8 shadow-xl max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-5">
              <div className="p-4 rounded-2xl bg-amber-500 text-amber-950 font-black shrink-0 shadow-md">
                <Handshake className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 rounded-md bg-amber-500 text-amber-950 px-3 py-1 text-[11px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>PARTNER & CARGO COLLABORATION</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Own a Cargo Service in Rajasthan?
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-neutral-300 max-w-2xl leading-relaxed font-semibold">
                  If you own a cargo service in Rajasthan and want to collaborate and work with us, contact us today and become a proud family member of <span className="bg-amber-500 text-amber-950 px-2 py-0.5 rounded font-black">ShipKart</span>!
                </p>
              </div>
            </div>

            <div className="shrink-0 w-full sm:w-auto">
              <a
                href="tel:6350603414"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 px-8 py-4 text-sm font-black shadow-md hover:shadow-lg transition-transform active:scale-95"
              >
                <PhoneCall className="w-4.5 h-4.5 fill-amber-950" />
                <span>Contact Us Now</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
