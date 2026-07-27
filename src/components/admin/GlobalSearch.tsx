'use client';

import React, { useState, useEffect, useRef } from 'react';
import { globalSearchAction } from '@/app/actions/admin/search';
import { Search, Loader2, Package, Truck, Users, Building, MapPin, Tag } from 'lucide-react';
import Link from 'next/link';

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setLoading(true);
        const res = await globalSearchAction(query);
        if (res.success) {
          setResults(res.results || []);
          setIsOpen(true);
        }
        setLoading(false);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'BOOKING': return <Package className="w-4 h-4 text-orange-500" />;
      case 'DISPATCH': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'EMPLOYEE': return <Users className="w-4 h-4 text-emerald-500" />;
      case 'OFFICE': return <Building className="w-4 h-4 text-purple-500" />;
      case 'VEHICLE': return <Truck className="w-4 h-4 text-amber-500" />;
      case 'ROUTE': return <MapPin className="w-4 h-4 text-rose-500" />;
      default: return <Tag className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Global search (LR, Phone, Vehicle, Staff, Office, Route)..."
          className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white dark:focus:bg-zinc-900 transition-all shadow-xs"
        />
        {loading && (
          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-amber-500" />
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xl overflow-hidden z-50 max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 dark:text-zinc-400">
              No matching entity found for "{query}"
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-zinc-800">
              {results.map((r, i) => (
                <Link
                  key={`${r.category}-${r.id}-${i}`}
                  href={r.url}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-100 dark:bg-zinc-800 rounded-lg">{getCategoryIcon(r.category)}</div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-zinc-100">{r.title}</div>
                      <div className="text-xs text-slate-500 dark:text-zinc-400">{r.subtitle}</div>
                    </div>
                  </div>
                  {r.badge && (
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                      {r.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
