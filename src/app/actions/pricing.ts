"use server";

import { db } from "@/lib/db";
import { calculatePrice as calculatePriceService, CalculatePriceInput, PricingBreakdown } from "@/lib/services/pricing";
import { PricingGroupSchema } from "@/lib/validations/pricing";
import { revalidatePath } from "next/cache";

export async function calculatePriceAction(input: CalculatePriceInput): Promise<PricingBreakdown> {
  return await calculatePriceService(input);
}

export async function getPricingGroupsAction() {
  try {
    const groups = await db.pricingGroup.findMany({
      include: {
        pricingRules: {
          orderBy: { displayOrder: "asc" },
        },
        destOffices: true,
        routes: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: groups };
  } catch (err) {
    console.error("Get Pricing Groups Error:", err);
    return { success: false, error: "Failed to fetch pricing groups.", data: [] };
  }
}

export async function createPricingGroupAction(formData: unknown) {
  const parseResult = PricingGroupSchema.safeParse(formData);
  if (!parseResult.success) {
    return { success: false, error: parseResult.error.issues[0]?.message || "Invalid pricing group data" };
  }

  const data = parseResult.data;

  try {
    const existing = await db.pricingGroup.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      return { success: false, error: `Pricing group with name "${data.name}" already exists.` };
    }

    const group = await db.$transaction(async (tx) => {
      const created = await tx.pricingGroup.create({
        data: {
          name: data.name,
          description: data.description || null,
          isRajasthan: data.isRajasthan,
          status: data.status,
        },
      });

      if (data.rules && data.rules.length > 0) {
        await tx.pricingRule.createMany({
          data: data.rules.map((rule) => ({
            pricingGroupId: created.id,
            parcelType: rule.parcelType,
            selfPrice: rule.selfPrice,
            taxiPrice: rule.taxiPrice ?? null,
            displayOrder: rule.displayOrder || 1,
          })),
        });
      }

      return created;
    });

    revalidatePath("/admin/pricing");
    return { success: true, message: "Pricing group created successfully!", data: group };
  } catch (err: any) {
    console.error("Create Pricing Group Error:", err);
    return { success: false, error: err?.message || "Failed to create pricing group." };
  }
}

export async function updatePricingGroupAction(id: string, formData: unknown) {
  const parseResult = PricingGroupSchema.partial().safeParse(formData);
  if (!parseResult.success) {
    return { success: false, error: parseResult.error.issues[0]?.message || "Invalid update payload" };
  }

  const data = parseResult.data;

  try {
    await db.$transaction(async (tx) => {
      await tx.pricingGroup.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description || null,
          isRajasthan: data.isRajasthan,
          status: data.status,
        },
      });

      if (data.rules && data.rules.length > 0) {
        await tx.pricingRule.deleteMany({
          where: { pricingGroupId: id },
        });

        await tx.pricingRule.createMany({
          data: data.rules.map((rule) => ({
            pricingGroupId: id,
            parcelType: rule.parcelType,
            selfPrice: rule.selfPrice,
            taxiPrice: rule.taxiPrice ?? null,
            displayOrder: rule.displayOrder || 1,
          })),
        });
      }
    });

    revalidatePath("/admin/pricing");
    return { success: true, message: "Pricing group updated successfully!" };
  } catch (err: any) {
    console.error("Update Pricing Group Error:", err);
    return { success: false, error: err?.message || "Failed to update pricing group." };
  }
}

export async function togglePricingGroupStatusAction(id: string, currentStatus: boolean) {
  try {
    await db.pricingGroup.update({
      where: { id },
      data: { status: !currentStatus },
    });

    revalidatePath("/admin/pricing");
    return { success: true, message: `Pricing group ${!currentStatus ? "activated" : "deactivated"}!` };
  } catch (err) {
    console.error("Toggle Pricing Group Status Error:", err);
    return { success: false, error: "Failed to toggle status." };
  }
}

export async function duplicatePricingGroupAction(id: string) {
  try {
    const original = await db.pricingGroup.findUnique({
      where: { id },
      include: { pricingRules: true },
    });

    if (!original) {
      return { success: false, error: "Original pricing group not found." };
    }

    const newName = `${original.name} (Copy ${Date.now().toString().slice(-4)})`;

    await db.$transaction(async (tx) => {
      const created = await tx.pricingGroup.create({
        data: {
          name: newName,
          description: original.description ? `Copy of ${original.description}` : "Cloned pricing group",
          isRajasthan: original.isRajasthan,
          status: true,
        },
      });

      if (original.pricingRules.length > 0) {
        await tx.pricingRule.createMany({
          data: original.pricingRules.map((r) => ({
            pricingGroupId: created.id,
            parcelType: r.parcelType,
            selfPrice: r.selfPrice,
            taxiPrice: r.taxiPrice,
            displayOrder: r.displayOrder,
          })),
        });
      }
    });

    revalidatePath("/admin/pricing");
    return { success: true, message: "Pricing group duplicated successfully!" };
  } catch (err: any) {
    console.error("Duplicate Pricing Group Error:", err);
    return { success: false, error: err?.message || "Failed to duplicate pricing group." };
  }
}

export async function deletePricingGroupAction(id: string) {
  try {
    await db.pricingGroup.delete({
      where: { id },
    });

    revalidatePath("/admin/pricing");
    return { success: true, message: "Pricing group deleted successfully!" };
  } catch (err: any) {
    console.error("Delete Pricing Group Error:", err);
    return { success: false, error: err?.message || "Failed to delete pricing group. It may be assigned to routes." };
  }
}
