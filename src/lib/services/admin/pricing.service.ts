import { prisma } from '@/lib/db';
import { ParcelType } from '@prisma/client';
import { generateSequentialNumber } from './sequential-number';

export interface PricingRuleInput {
  parcelType: ParcelType;
  selfPrice: number;
  taxiPrice?: number | null;
  displayOrder?: number;
}

export interface CreatePricingVersionInput {
  name: string;
  description?: string;
  isRajasthan?: boolean;
  effectiveFrom?: Date;
  effectiveTill?: Date;
  rules: PricingRuleInput[];
}

export async function createPricingVersion(input: CreatePricingVersionInput) {
  const pricingCode = await generateSequentialNumber('PRICE');

  // Determine latest version number
  const latest = await prisma.pricingGroup.findFirst({
    orderBy: { version: 'desc' },
  });
  const version = (latest?.version || 0) + 1;

  return prisma.pricingGroup.create({
    data: {
      pricingCode,
      name: input.name,
      description: input.description,
      isRajasthan: input.isRajasthan ?? true,
      version,
      effectiveFrom: input.effectiveFrom || new Date(),
      effectiveTill: input.effectiveTill,
      status: false, // Created as draft/inactive by default
      isActive: true,
      pricingRules: {
        create: input.rules.map((r, index) => ({
          parcelType: r.parcelType,
          selfPrice: r.selfPrice,
          taxiPrice: r.taxiPrice !== undefined ? r.taxiPrice : null,
          displayOrder: r.displayOrder || index + 1,
        })),
      },
    },
    include: {
      pricingRules: true,
    },
  });
}

/**
 * Single Active Version Lock:
 * Deactivates all other pricing groups and activates target pricing group.
 */
export async function activatePricingVersion(id: string) {
  return prisma.$transaction(async (tx) => {
    // Check if targeted version is active
    const target = await tx.pricingGroup.findUnique({ where: { id } });
    if (!target) throw new Error('Pricing version not found');
    if (!target.isActive) throw new Error('Cannot activate an archived pricing version.');

    // Deactivate all pricing groups
    await tx.pricingGroup.updateMany({
      data: { status: false },
    });

    // Activate the targeted pricing version
    return tx.pricingGroup.update({
      where: { id },
      data: { status: true },
      include: { pricingRules: true },
    });
  });
}

export async function archivePricingVersion(id: string) {
  const group = await prisma.pricingGroup.findUnique({ where: { id } });
  if (!group) throw new Error('Pricing group not found');
  if (group.status) {
    throw new Error('Active pricing version cannot be archived. Activate another version first.');
  }

  return prisma.pricingGroup.update({
    where: { id },
    data: {
      isActive: false,
      deletedAt: new Date(),
    },
  });
}

export async function restorePricingVersion(id: string) {
  return prisma.pricingGroup.update({
    where: { id },
    data: {
      isActive: true,
      deletedAt: null,
    },
  });
}

export async function getPricingVersions() {
  return prisma.pricingGroup.findMany({
    include: {
      pricingRules: { orderBy: { displayOrder: 'asc' } },
      _count: { select: { routes: true } },
    },
    orderBy: { version: 'desc' },
  });
}

export async function getActivePricingGroup() {
  return prisma.pricingGroup.findFirst({
    where: { status: true, isActive: true },
    include: { pricingRules: { orderBy: { displayOrder: 'asc' } } },
  });
}
