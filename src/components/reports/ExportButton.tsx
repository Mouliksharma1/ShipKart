'use client';

import React, { useState } from 'react';
import { Download, FileSpreadsheet, Loader2 } from 'lucide-react';
import { exportReportCSVAction } from '@/app/actions/admin/reports';

interface ExportButtonProps {
  reportName: string;
  headers: string[];
  data: Record<string, any>[];
  filters?: Record<string, any>;
}

export function ExportButton({ reportName, headers, data, filters }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await exportReportCSVAction({
        reportName,
        headers,
        data,
        filters,
      });

      if (res.success && res.csvContent && res.filename) {
        const blob = new Blob([res.csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', res.filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(res.error || 'Export failed');
      }
    } catch (err: any) {
      alert(err.message || 'Export error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading || data.length === 0}
      className="flex items-center px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-extrabold transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Download className="w-3.5 h-3.5 mr-1.5" />}
      Export CSV ({data.length})
    </button>
  );
}
