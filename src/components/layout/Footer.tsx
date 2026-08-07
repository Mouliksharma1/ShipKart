"use client";

import React from "react";
import Link from "next/link";
import { Phone, MapPin, Truck, ShieldCheck, ArrowUpRight, Compass } from "lucide-react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useLanguage } from "@/components/i18n/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t border-slate-200 dark:border-neutral-800/80 bg-slate-100 dark:bg-neutral-950 text-slate-700 dark:text-neutral-300 text-sm mt-auto relative overflow-hidden transition-colors duration-300">
      {/* Subtle Amber Top Accent */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Col 1: Brand & Tagline (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-white p-0.5 shadow-md shadow-amber-500/10 dark:shadow-amber-500/20 border border-slate-200 dark:border-transparent">
                <img src="/shipkartLogo.png" alt="ShipKart Logo" className="h-full w-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  {t("common.brandName").substring(0, 4)}<span className="text-amber-600 dark:text-amber-400">{t("common.brandName").substring(4)}</span>
                </span>
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 tracking-widest uppercase">
                  Powered by {t("common.companyName")}
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed max-w-sm">
              {t("footer.tagline")}
            </p>

            <div className="pt-1">
              <div className="inline-flex items-center space-x-2 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 px-3 py-1.5 text-xs text-slate-800 dark:text-neutral-300 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>{t("footer.stationOnly")}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Helplines & Portals (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">{t("footer.helplines")}</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="tel:6350603414" className="flex items-center space-x-2 text-slate-800 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  <Phone className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="font-semibold">6350603414</span>
                  <span className="text-[10px] text-slate-500 dark:text-neutral-500">({t("footer.headOffice")})</span>
                </a>
              </li>
              <li>
                <a href="tel:7852091119" className="flex items-center space-x-2 text-slate-800 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  <Phone className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="font-semibold">7852091119</span>
                  <span className="text-[10px] text-slate-500 dark:text-neutral-500">({t("footer.dispatches")})</span>
                </a>
              </li>
              <li>
                <a href="tel:02912651955" className="flex items-center space-x-2 text-slate-800 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  <Phone className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="font-semibold">0291-2651955</span>
                  <span className="text-[10px] text-slate-500 dark:text-neutral-500">({t("footer.landline")})</span>
                </a>
              </li>
            </ul>

            <div className="pt-3 border-t border-slate-200 dark:border-neutral-900">
              <h5 className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-2">{t("footer.staffPortals")}</h5>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link href="/employee/login" className="text-slate-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center space-x-1">
                  <span>{t("footer.employeeLogin")}</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
                <span className="text-slate-400 dark:text-neutral-700">•</span>
                <Link href="/partner" className="text-slate-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center space-x-1">
                  <span>{t("footer.partnerOffice")}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Col 3: Address & Interactive Google Map (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">{t("footer.headOfficeLocation")}</h4>
              <Link href="/offices" className="text-xs text-slate-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center space-x-1">
                <Compass className="h-3.5 w-3.5" />
                <span>{t("footer.allOffices")}</span>
              </Link>
            </div>

            <div className="flex items-start space-x-2 text-xs text-slate-700 dark:text-neutral-400 bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl shadow-sm">
              <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{t("footer.address")}</span>
            </div>

            {/* Embedded Google Map Frame */}
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-neutral-800/90 shadow-xl h-44 w-full bg-slate-200 dark:bg-neutral-900 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14309.061188247451!2d73.00178508715818!3d26.285498299999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39418da8481efa59%3A0x86303ce101608fd5!2sPooja%20Travels!5e0!3m2!1sen!2sus!4v1785928789191!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Pooja Travels Head Office Map"
              />
            </div>
          </div>

        </div>

        {/* Bottom Rights Bar */}
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-neutral-500 gap-3">
          <div>
            © {new Date().getFullYear()} <span className="text-slate-800 dark:text-neutral-300 font-semibold">{t("common.companyName")}</span>. {t("footer.rightsReserved")}
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <LanguageSwitcher />
            <span>{t("footer.lrEngine")}</span>
            <span>•</span>
            <span>{t("footer.nextReady")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

