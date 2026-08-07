"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  const toggleLanguage = () => {
    setLocale(locale === "en" ? "hi" : "en");
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-200/90 dark:bg-neutral-800/90 text-slate-800 dark:text-neutral-100 hover:border-amber-500 border border-slate-300 dark:border-neutral-700 text-xs font-black shadow-sm transition-all cursor-pointer group active:scale-95 select-none ${className}`}
      title={locale === "en" ? "Switch to हिन्दी" : "Switch to English"}
      aria-label="Toggle language between English and Hindi"
    >
      <Globe className="w-3.5 h-3.5 text-amber-500 shrink-0 group-hover:rotate-45 transition-transform duration-300" />
      <div className="flex items-center space-x-1.5 text-xs">
        <span className={locale === "en" ? "text-amber-600 dark:text-amber-400 font-black" : "text-slate-500 dark:text-neutral-400 font-medium"}>
          EN
        </span>
        <span className="text-slate-400 dark:text-neutral-600 text-[10px]">•</span>
        <span className={locale === "hi" ? "text-amber-600 dark:text-amber-400 font-black" : "text-slate-500 dark:text-neutral-400 font-medium"}>
          हिन्दी
        </span>
      </div>
    </button>
  );
}
