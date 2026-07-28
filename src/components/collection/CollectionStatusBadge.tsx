'use client';

import React from 'react';

interface CollectionStatusBadgeProps {
  status: string;
}

export const CollectionStatusBadge: React.FC<CollectionStatusBadgeProps> = ({ status }) => {
  const getStyle = (s: string) => {
    switch (s?.toUpperCase()) {
      case 'COLLECTED':
      case 'COMPLETED':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'READY':
      case 'READY_FOR_COLLECTION':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-zinc-400 border-slate-500/30';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border uppercase tracking-wider ${getStyle(status)}`}>
      {status === 'READY_FOR_COLLECTION' ? 'READY FOR PICKUP' : status}
    </span>
  );
};
