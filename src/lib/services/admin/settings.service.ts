import { prisma } from '@/lib/db';

export async function getCategorizedSettings() {
  const [company, booking, branding, notification, finance, security, system] = await Promise.all([
    prisma.companySettings.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } }),
    prisma.bookingSettings.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } }),
    prisma.brandingSettings.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } }),
    prisma.notificationSettings.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } }),
    prisma.financeSettings.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } }),
    prisma.securitySettings.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } }),
    prisma.systemSettings.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } }),
  ]);

  return { company, booking, branding, notification, finance, security, system };
}

export async function updateCompanySettings(data: any) {
  return prisma.companySettings.update({ where: { id: 'default' }, data });
}

export async function updateBookingSettings(data: any) {
  return prisma.bookingSettings.update({ where: { id: 'default' }, data });
}

export async function updateBrandingSettings(data: any) {
  return prisma.brandingSettings.update({ where: { id: 'default' }, data });
}

export async function updateNotificationSettings(data: any) {
  return prisma.notificationSettings.update({ where: { id: 'default' }, data });
}

export async function updateFinanceSettings(data: any) {
  return prisma.financeSettings.update({ where: { id: 'default' }, data });
}

export async function updateSecuritySettings(data: any) {
  return prisma.securitySettings.update({ where: { id: 'default' }, data });
}

export async function updateSystemSettings(data: any) {
  return prisma.systemSettings.update({ where: { id: 'default' }, data });
}

export async function exportSettingsJSON() {
  const settings = await getCategorizedSettings();
  const flags = await prisma.featureFlag.findMany();
  return JSON.stringify({ settings, flags, exportedAt: new Date().toISOString() }, null, 2);
}

export async function importSettingsJSON(jsonString: string) {
  const parsed = JSON.parse(jsonString);
  if (parsed.settings) {
    const { company, booking, branding, notification, finance, security, system } = parsed.settings;
    if (company) await updateCompanySettings(company);
    if (booking) await updateBookingSettings(booking);
    if (branding) await updateBrandingSettings(branding);
    if (notification) await updateNotificationSettings(notification);
    if (finance) await updateFinanceSettings(finance);
    if (security) await updateSecuritySettings(security);
    if (system) await updateSystemSettings(system);
  }
  return true;
}
