"use server";

import { db } from "@/lib/db";
import { calculatePrice, CalculatePriceInput } from "@/lib/services/pricing";
import { PricingGroupSchema } from "@/lib/validations/pricing";
import { revalidatePath } from "next/cache";

export type ActionResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
};

// ==================== PRICING GROUP SERVER ACTIONS ====================

export async function getPricingGroupsAction(query?: string) {
  try {
    const groups = await db.pricingGroup.findMany({
      include: {
        pricingRules: {
          orderBy: { displayOrder: "asc" },
        },
        _count: {
          select: { routes: true, destOffices: true },
        },
      },
      where: query ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      } : {},
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: groups };
  } catch (err) {
    console.error("Get Pricing Groups Error:", err);
    return { success: false, error: "Failed to fetch pricing groups.", data: [] };
  }
}

export async function createPricingGroupAction(formData: unknown): Promise<ActionResponse> {
  const parseResult = PricingGroupSchema.safeParse(formData);
  if (!parseResult.success) {
    return { success: false, error: parseResult.error.issues[0]?.message || "Invalid pricing data" };
  }

  const { name, description, isRajasthan, status, rules } = parseResult.data;

  try {
    const existing = await db.pricingGroup.findUnique({ where: { name } });
    if (existing) {
      return { success: false, error: "A pricing group with this name already exists." };
    }

    const newGroup = await db.pricingGroup.create({
      data: {
        name,
        description: description || null,
        isRajasthan,
        status,
        pricingRules: {
          create: rules.map(r => ({
            parcelType: r.parcelType,
            selfPrice: r.selfPrice,
            taxiPrice: r.taxiPrice ?? null,
            displayOrder: r.displayOrder,
          })),
        },
      },
      include: { pricingRules: true },
    });

    revalidatePath("/admin/pricing");
    return { success: true, message: "Pricing group created successfully!", data: newGroup };
  } catch (err) {
    console.error("Create Pricing Group Error:", err);
    return { success: false, error: "Failed to create pricing group." };
  }
}

export async function updatePricingGroupAction(id: string, formData: unknown): Promise<ActionResponse> {
  const parseResult = PricingGroupSchema.safeParse(formData);
  if (!parseResult.success) {
    return { success: false, error: parseResult.error.issues[0]?.message || "Invalid pricing data" };
  }

  const { name, description, isRajasthan, status, rules } = parseResult.data;

  try {
    // Delete existing rules and re-create updated rules transactionally
    const updatedGroup = await db.$transaction(async (tx) => {
      await tx.pricingRule.deleteMany({ where: { pricingGroupId: id } });

      return await tx.pricingGroup.update({
        where: { id },
        data: {
          name,
          description: description || null,
          isRajasthan,
          status,
          pricingRules: {
            create: rules.map(r => ({
              parcelType: r.parcelType,
              selfPrice: r.selfPrice,
              taxiPrice: r.taxiPrice ?? null,
              displayOrder: r.displayOrder,
            })),
          },
        },
        include: { pricingRules: true },
      });
    });

    revalidatePath("/admin/pricing");
    revalidatePath("/admin/routes");
    return { success: true, message: "Pricing group updated successfully!", data: updatedGroup };
  } catch (err) {
    console.error("Update Pricing Group Error:", err);
    return { success: false, error: "Failed to update pricing group." };
  }
}

export async function togglePricingGroupStatusAction(id: string, currentStatus: boolean): Promise<ActionResponse> {
  try {
    await db.pricingGroup.update({
      where: { id },
      data: { status: !currentStatus },
    });
    revalidatePath("/admin/pricing");
    return { success: true, message: `Pricing group ${!currentStatus ? "enabled" : "disabled"} successfully!` };
  } catch (err) {
    console.error("Toggle Pricing Group Status Error:", err);
    return { success: false, error: "Failed to update pricing status." };
  }
}

export async function duplicatePricingGroupAction(id: string): Promise<ActionResponse> {
  try {
    const existing = await db.pricingGroup.findUnique({
      where: { id },
      include: { pricingRules: true },
    });

    if (!existing) {
      return { success: false, error: "Pricing group to duplicate was not found." };
    }

    const copyName = `${existing.name} (Copy ${Date.now().toString().slice(-4)})`;

    const duplicated = await db.pricingGroup.create({
      data: {
        name: copyName,
        description: existing.description ? `${existing.description} (Duplicate)` : "Cloned tariff group",
        isRajasthan: existing.isRajasthan,
        status: existing.status,
        pricingRules: {
          create: existing.pricingRules.map(r => ({
            parcelType: r.parcelType,
            selfPrice: r.selfPrice,
            taxiPrice: r.taxiPrice,
            displayOrder: r.displayOrder,
          })),
        },
      },
      include: { pricingRules: true },
    });

    revalidatePath("/admin/pricing");
    return { success: true, message: "Pricing group duplicated successfully!", data: duplicated };
  } catch (err) {
    console.error("Duplicate Pricing Group Error:", err);
    return { success: false, error: "Failed to duplicate pricing group." };
  }
}

export async function deletePricingGroupAction(id: string): Promise<ActionResponse> {
  try {
    const count = await db.routeMaster.count({ where: { pricingGroupId: id } });
    if (count > 0) {
      return { success: false, error: `Cannot delete pricing group. It is assigned to ${count} active routes.` };
    }

    await db.pricingGroup.delete({ where: { id } });
    revalidatePath("/admin/pricing");
    return { success: true, message: "Pricing group deleted successfully!" };
  } catch (err) {
    console.error("Delete Pricing Group Error:", err);
    return { success: false, error: "Failed to delete pricing group." };
  }
}

export async function calculatePriceAction(params: CalculatePriceInput) {
  return await calculatePrice(params);
}
