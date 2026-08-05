import React from "react";
import Link from "next/link";
import { Phone, MapPin, Truck, ShieldCheck, ArrowUpRight, Compass } from "lucide-react";

export function Footer() {
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
                  Ship<span className="text-amber-600 dark:text-amber-400">Kart</span>
                </span>
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 tracking-widest uppercase">
                  Powered by POOJA TRAVELS & CARGO
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed max-w-sm">
              Enterprise logistics & builty dispatch platform. Operating daily bus freight networks across Rajasthan and Interstate routes with zero home delivery delays.
            </p>

            <div className="pt-1">
              <div className="inline-flex items-center space-x-2 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 px-3 py-1.5 text-xs text-slate-800 dark:text-neutral-300 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>Station Pickup & Collection Only</span>
              </div>
            </div>
          </div>

          {/* Col 2: Helplines & Portals (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">Helpline Numbers</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="tel:6350603414" className="flex items-center space-x-2 text-slate-800 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  <Phone className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="font-semibold">6350603414</span>
                  <span className="text-[10px] text-slate-500 dark:text-neutral-500">(Head Office)</span>
                </a>
              </li>
              <li>
                <a href="tel:7852091119" className="flex items-center space-x-2 text-slate-800 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  <Phone className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="font-semibold">7852091119</span>
                  <span className="text-[10px] text-slate-500 dark:text-neutral-500">(Dispatches)</span>
                </a>
              </li>
              <li>
                <a href="tel:02912651955" className="flex items-center space-x-2 text-slate-800 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  <Phone className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="font-semibold">0291-2651955</span>
                  <span className="text-[10px] text-slate-500 dark:text-neutral-500">(Landline)</span>
                </a>
              </li>
            </ul>

            <div className="pt-3 border-t border-slate-200 dark:border-neutral-900">
              <h5 className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-2">Staff Portals</h5>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link href="/login" className="text-slate-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center space-x-1">
                  <span>Employee Login</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
                <span className="text-slate-400 dark:text-neutral-700">•</span>
                <Link href="/partner" className="text-slate-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center space-x-1">
                  <span>Partner Office</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Col 3: Address & Interactive Google Map (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">Head Office Location</h4>
              <Link href="/offices" className="text-xs text-slate-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center space-x-1">
                <Compass className="h-3.5 w-3.5" />
                <span>All Offices</span>
              </Link>
            </div>

            <div className="flex items-start space-x-2 text-xs text-slate-700 dark:text-neutral-400 bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl shadow-sm">
              <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span className="leading-snug">45, Jaswant Building, MG Hospital Rd, Sojati Gate, Rawaton Ka Bass, Jodhpur, Rajasthan 342001</span>
            </div>

            {/* Embedded Google Map Frame */}
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-neutral-800/90 shadow-xl h-44 w-full bg-slate-200 dark:bg-neutral-900">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3577.2652977703!2d73.01826457502641!3d26.285498277026598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39418da8481efa59%3A0x86303ce101608fd5!2sPooja%20Travels!5e0!3m2!1sen!2sin!4v1784798358807!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "contrast(1.05) saturate(1.1)" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Pooja Travels Head Office Map"
              />
            </div>
          </div>

        </div>

        {/* Bottom Rights Bar */}
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-neutral-500 gap-3">
          <div>
            © {new Date().getFullYear()} <span className="text-slate-800 dark:text-neutral-300 font-semibold">Pooja Travels & Cargo</span>. All rights reserved.
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>Sequential LR Engine</span>
            <span>•</span>
            <span>Next.js 16 Production Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
