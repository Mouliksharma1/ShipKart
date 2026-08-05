"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage, Locale } from "./LanguageContext";
import { Globe, ChevronDown, Check } from "lucide-react";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options: { code: Locale; short: string; label: string }[] = [
    { code: "en", short: "EN", label: "English" },
    { code: "hi", short: "HI", label: "हिन्दी" },
  ];

  const currentOption = options.find((o) => o.code === locale) || options[0];

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-neutral-800/90 text-slate-800 dark:text-neutral-100 hover:bg-slate-200 dark:hover:bg-neutral-700/90 border border-slate-200 dark:border-neutral-700/80 text-xs font-black shadow-xs transition-all cursor-pointer"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span className="font-black text-amber-600 dark:text-amber-400">{currentOption.short}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 dark:text-neutral-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-32 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-neutral-500 border-b border-slate-100 dark:border-neutral-800">
            Language
          </div>
          {options.map((opt) => (
            <button
              key={opt.code}
              type="button"
              onClick={() => {
                setLocale(opt.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-extrabold transition-colors cursor-pointer ${
                locale === opt.code
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "text-slate-700 dark:text-neutral-200 hover:bg-slate-50 dark:hover:bg-neutral-800/80"
              }`}
            >
              <span>{opt.label}</span>
              {locale === opt.code && <Check className="w-3.5 h-3.5 text-amber-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
