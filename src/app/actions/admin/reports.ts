'use server';

import { getDashboardSummary } from '@/lib/services/analytics/dashboard.service';
import { getRevenueSummary } from '@/lib/services/analytics/revenue.service';
import { getBookingAnalytics } from '@/lib/services/analytics/booking.service';
import { getDispatchAnalytics } from '@/lib/services/analytics/dispatch.service';
import { getEmployeeAnalytics } from '@/lib/services/analytics/employee.service';
import { getCustomerAnalytics } from '@/lib/services/analytics/customer.service';
import { getRouteAnalytics } from '@/lib/services/analytics/route.service';
import { getChartDatasets } from '@/lib/services/analytics/chart.service';
import { generateCSV, formatExportFilename, ExportOptions } from '@/lib/services/analytics/export.service';
import { createActivityLog } from '@/lib/services/admin/activity.service';
import { ActivityType, ActivitySeverity } from '@prisma/client';

export async function getDashboardAnalyticsAction(filter?: any) {
  try {
    const data = await getDashboardSummary(filter);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getRevenueReportAction(filter?: any) {
  try {
    const data = await getRevenueSummary(filter);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getBookingReportAction(filter?: any) {
  try {
    const data = await getBookingAnalytics(filter);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getDispatchReportAction(filter?: any) {
  try {
    const data = await getDispatchAnalytics(filter);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getEmployeeReportAction(officeId?: string) {
  try {
    const data = await getEmployeeAnalytics(officeId);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getCustomerReportAction() {
  try {
    const data = await getCustomerAnalytics();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getRouteReportAction() {
  try {
    const data = await getRouteAnalytics();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getChartDataAction(officeId?: string) {
  try {
    const data = await getChartDatasets(officeId);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function exportReportCSVAction(options: ExportOptions, userId?: string) {
  try {
    const csvContent = generateCSV(options);
    const filename = formatExportFilename(options.reportName, 'csv');

    if (userId) {
      try {
        await createActivityLog({
          userId,
          module: 'REPORTS',
          entity: 'ReportExport',
          activityType: ActivityType.SYSTEM,
          severity: ActivitySeverity.INFO,
          action: `Exported ${options.reportName} report (${options.data.length} records)`,
        });
      } catch (logErr) {}
    }

    return { success: true, csvContent, filename };
  } catch (err: any) {
    return { success: false, error: err.message || 'Export failed' };
  }
}
