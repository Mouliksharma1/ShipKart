"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Dynamic breadcrumb navigation component.
 * The last item is rendered as plain text (current page).
 */
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 dark:text-neutral-400 overflow-x-auto whitespace-nowrap py-3"
    >
      <Link
        href="/"
        className="inline-flex items-center space-x-1 hover:text-amber-500 transition-colors shrink-0"
        aria-label="Home"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {items.map((item, i) => {
        const isLast = i === items.length - 1;

        return (
          <React.Fragment key={i}>
            <ChevronRight className="w-3 h-3 text-slate-300 dark:text-neutral-600 shrink-0" />
            {isLast || !item.href ? (
              <span
                className="text-slate-800 dark:text-neutral-200 font-bold truncate"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-amber-500 transition-colors truncate"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
