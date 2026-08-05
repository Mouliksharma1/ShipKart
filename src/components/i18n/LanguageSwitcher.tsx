"use client";

import React from "react";
import { useLanguage, Locale } from "./LanguageContext";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  return (
    <div className={`inline-flex items-center space-x-1 bg-slate-100 dark:bg-neutral-800/80 p-1 rounded-xl border border-slate-200 dark:border-neutral-700/80 ${className}`}>
      <Globe className="w-3.5 h-3.5 text-amber-500 ml-1.5 mr-0.5 shrink-0" />
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`px-2 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
          locale === "en"
            ? "bg-amber-500 text-amber-950 shadow-xs"
            : "text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("hi")}
        className={`px-2 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
          locale === "hi"
            ? "bg-amber-500 text-amber-950 shadow-xs"
            : "text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        हिन्दी
      </button>
    </div>
  );
}
