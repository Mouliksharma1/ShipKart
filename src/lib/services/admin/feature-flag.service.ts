import { prisma } from '@/lib/db';

export const DEFAULT_FLAGS = [
  { key: 'online_booking', name: 'Customer Online Booking', description: 'Enable online booking for customer portal', enabled: true },
  { key: 'notifications', name: 'Multi-Channel Notifications', description: 'Enable WhatsApp, SMS, Email, and Push alerts', enabled: true },
  { key: 'dispatch_module', name: 'Dispatch & Vehicle Management', description: 'Enable dispatch creation and manifest tracking', enabled: true },
  { key: 'gps_tracking', name: 'Live GPS Vehicle Tracking', description: 'Enable live location tracking for dispatches', enabled: true },
  { key: 'customer_portal', name: 'Customer Self-Service Portal', description: 'Allow customer login and booking management', enabled: true },
  { key: 'maintenance_mode', name: 'System Maintenance Mode', description: 'Restrict access for non-admin users', enabled: false },
];

export async function initFeatureFlags() {
  for (const flag of DEFAULT_FLAGS) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: {},
      create: flag,
    });
  }
}

export async function getFeatureFlags() {
  await initFeatureFlags();
  return prisma.featureFlag.findMany({ orderBy: { name: 'asc' } });
}

export async function isFeatureEnabled(key: string): Promise<boolean> {
  const flag = await prisma.featureFlag.findUnique({ where: { key } });
  return flag ? flag.enabled : true;
}

export async function toggleFeatureFlag(key: string, enabled: boolean) {
  return prisma.featureFlag.update({
    where: { key },
    data: { enabled },
  });
}
