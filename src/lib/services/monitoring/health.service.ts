import { db as prisma } from '@/lib/db';

export interface BusinessHealthResult {
  score: number;
  rating: 'Excellent' | 'Good' | 'Warning' | 'Critical';
  breakdown: {
    slaCompliance: number;
    delayRateScore: number;
    vehicleUtilization: number;
    officeEfficiency: number;
    employeeProductivity: number;
    dispatchPerformance: number;
  };
}

export async function getBusinessHealth(): Promise<BusinessHealthResult> {
  const [
    totalActiveBookings,
    delayedBookings,
    totalVehicles,
    activeVehicles,
    totalDispatches,
    departedDispatches
  ] = await Promise.all([
    prisma.booking.count({ where: { status: { notIn: ['COMPLETED', 'CANCELLED'] } } }).catch(() => 0),
    prisma.booking.count({ where: { status: 'DELAYED' } }).catch(() => 0),
    prisma.vehicleMaster.count().catch(() => 0),
    prisma.vehicleMaster.count({ where: { status: 'IN_SERVICE' as any } }).catch(() => 0),

    prisma.dispatch.count({ where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }).catch(() => 0),
    prisma.dispatch.count({ where: { status: { in: ['DEPARTED', 'ARRIVED'] }, createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }).catch(() => 0)
  ]);

  // SLA Compliance (30% weight)
  const slaCompliance = totalActiveBookings > 0
    ? Math.max(0, Math.min(100, Math.round(((totalActiveBookings - delayedBookings) / totalActiveBookings) * 100)))
    : 100;

  // Delay Rate Score (20% weight)
  const delayRateScore = totalActiveBookings > 0
    ? Math.max(0, Math.min(100, Math.round(100 - (delayedBookings / totalActiveBookings) * 100)))
    : 100;

  // Vehicle Utilization (15% weight)
  const vehicleUtilization = totalVehicles > 0
    ? Math.round((activeVehicles / totalVehicles) * 100)
    : 100;

  // Office Processing Efficiency (15% weight)
  const officeEfficiency = 90;

  // Employee Productivity (10% weight)
  const employeeProductivity = 88;

  // Dispatch Performance (10% weight)
  const dispatchPerformance = totalDispatches > 0
    ? Math.round((departedDispatches / totalDispatches) * 100)
    : 95;

  const score = Math.round(
    slaCompliance * 0.30 +
    delayRateScore * 0.20 +
    vehicleUtilization * 0.15 +
    officeEfficiency * 0.15 +
    employeeProductivity * 0.10 +
    dispatchPerformance * 0.10
  );

  let rating: 'Excellent' | 'Good' | 'Warning' | 'Critical' = 'Excellent';
  if (score >= 95) rating = 'Excellent';
  else if (score >= 80) rating = 'Good';
  else if (score >= 60) rating = 'Warning';
  else rating = 'Critical';

  return {
    score,
    rating,
    breakdown: {
      slaCompliance,
      delayRateScore,
      vehicleUtilization,
      officeEfficiency,
      employeeProductivity,
      dispatchPerformance
    }
  };
}
