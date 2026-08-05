"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import enMessages from "../../../messages/en.json";
import hiMessages from "../../../messages/hi.json";

export type Locale = "en" | "hi";

type Messages = typeof enMessages;

interface LanguageContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: (keyPath: string, vars?: Record<string, string | number>) => string;
}

const messagesMap: Record<Locale, Messages> = {
  en: enMessages,
  hi: hiMessages,
};

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  t: (keyPath: string) => keyPath,
});

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || "";
  return "";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("shipkart_lang") || getCookie("shipkart_lang");
      if (stored === "hi" || stored === "en") {
        setLocaleState(stored as Locale);
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("shipkart_lang", newLocale);
      document.cookie = `shipkart_lang=${newLocale}; path=/; max-age=31536000`;
    }
  };

  const t = (keyPath: string, vars?: Record<string, string | number>): string => {
    const keys = keyPath.split(".");
    let current: any = messagesMap[locale] || messagesMap["en"];

    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        // Fallback to English if key missing in current locale
        let fallback: any = messagesMap["en"];
        for (const fk of keys) {
          if (fallback && typeof fallback === "object" && fk in fallback) {
            fallback = fallback[fk];
          } else {
            return keyPath;
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current !== "string") {
      return keyPath;
    }

    let result = current;
    if (vars) {
      Object.entries(vars).forEach(([vk, vv]) => {
        result = result.replace(new RegExp(`\\{${vk}\\}`, "g"), String(vv));
      });
    }

    return result;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
