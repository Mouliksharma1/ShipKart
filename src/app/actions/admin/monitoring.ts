'use server';

import { getExecutiveSummary, getTodayOverview } from '@/lib/services/monitoring/dashboard.service';
import { getBusinessHealth } from '@/lib/services/monitoring/health.service';
import { getActiveAlerts, acknowledgeAlert, resolveAlert, getAlertStatistics, generateAlerts } from '@/lib/services/monitoring/alert.service';
import { getOfficeMonitoring } from '@/lib/services/monitoring/office-monitor.service';
import { getVehicleMonitoring } from '@/lib/services/monitoring/vehicle-monitor.service';
import { getEmployeeMonitoring } from '@/lib/services/monitoring/employee-monitor.service';
import { getDispatchMonitoring } from '@/lib/services/monitoring/dispatch-monitor.service';
import { getSLAReport } from '@/lib/services/monitoring/sla.service';
import { AlertSeverity } from '@prisma/client';

export async function getExecutiveDashboardAction() {
  try {
    await generateAlerts().catch(() => null);
    const summary = await getExecutiveSummary();
    const overview = await getTodayOverview();
    return { success: true, data: { ...summary, overview } };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getBusinessHealthAction() {
  try {
    const data = await getBusinessHealth();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getOperationalAlertsAction(filters?: { severity?: AlertSeverity; officeId?: string }) {
  try {
    const alerts = await getActiveAlerts(filters);
    const stats = await getAlertStatistics();
    return { success: true, data: { alerts, stats } };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function acknowledgeAlertAction(id: string, userId: string, userName?: string) {
  try {
    const alert = await acknowledgeAlert(id, userId, userName);
    return { success: true, data: alert };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function resolveAlertAction(id: string, userId: string, userName?: string) {
  try {
    const alert = await resolveAlert(id, userId, userName);
    return { success: true, data: alert };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getOfficeMonitoringAction() {
  try {
    const data = await getOfficeMonitoring();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getVehicleMonitoringAction() {
  try {
    const data = await getVehicleMonitoring();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getEmployeeMonitoringAction() {
  try {
    const data = await getEmployeeMonitoring();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getDispatchMonitoringAction() {
  try {
    const data = await getDispatchMonitoring();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getSLAReportAction() {
  try {
    const data = await getSLAReport();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
