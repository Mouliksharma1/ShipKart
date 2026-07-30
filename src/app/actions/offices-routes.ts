"use server";

import { db } from "@/lib/db";
import { OfficeSchema, RouteSchema } from "@/lib/validations/office";
import { revalidatePath } from "next/cache";

export type ActionResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
};

// ==================== OFFICE SERVER ACTIONS ====================

export async function getOfficesAction(query?: string, activeOnly = false) {
  try {
    const offices = await db.officeMaster.findMany({
      where: {
        AND: [
          activeOnly ? { status: true } : {},
          query ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { city: { contains: query, mode: "insensitive" } },
              { phone: { contains: query, mode: "insensitive" } },
              { managerName: { contains: query, mode: "insensitive" } },
            ],
          } : {},
        ],
      },
      orderBy: { name: "asc" },
    });
    return { success: true, data: offices };
  } catch (err) {
    console.warn("Database offline or not reachable. Serving empty office list.", err);
    return { success: false, error: "Database offline. Please check your Supabase connection string in .env.", data: [] };
  }
}

export async function createOfficeAction(formData: unknown): Promise<ActionResponse> {
  const parseResult = OfficeSchema.safeParse(formData);
  if (!parseResult.success) {
    return { success: false, error: parseResult.error.issues[0]?.message || "Invalid office data" };
  }

  const data = parseResult.data;

  try {
    const existing = await db.officeMaster.findFirst({
      where: {
        OR: [
          { name: data.name },
          ...(data.code ? [{ code: data.code }] : []),
        ],
      },
    });

    if (existing) {
      return { success: false, error: "An office with this name or code already exists." };
    }

    const officeTiming = `${data.openingTime} - ${data.closingTime}`;

    const newOffice = await db.officeMaster.create({
      data: {
        ...data,
        officeTiming,
        code: data.code || null,
        altPhone: data.altPhone || null,
        managerName: data.managerName || null,
        managerPhone: data.managerPhone || null,
        googleMapsUrl: data.googleMapsUrl || null,
      },
    });

    revalidatePath("/admin/offices");
    revalidatePath("/offices");
    return { success: true, message: "Office created successfully!", data: newOffice };
  } catch (err) {
    console.error("Create Office Error:", err);
    return { success: false, error: "Failed to create office." };
  }
}

export async function updateOfficeAction(id: string, formData: unknown): Promise<ActionResponse> {
  const parseResult = OfficeSchema.safeParse(formData);
  if (!parseResult.success) {
    return { success: false, error: parseResult.error.issues[0]?.message || "Invalid office data" };
  }

  const data = parseResult.data;

  try {
    const officeTiming = `${data.openingTime} - ${data.closingTime}`;

    // Check if another office with the exact same name already exists
    const existingOffice = await db.officeMaster.findFirst({
      where: {
        name: { equals: data.name, mode: "insensitive" },
        id: { not: id }
      }
    });

    if (existingOffice) {
      return { success: false, error: `An office with the name "${data.name}" already exists.` };
    }

    const updatedOffice = await db.officeMaster.update({
      where: { id },
      data: {
        ...data,
        officeTiming,
        code: data.code || null,
        altPhone: data.altPhone || null,
        managerName: data.managerName || null,
        managerPhone: data.managerPhone || null,
        googleMapsUrl: data.googleMapsUrl || null,
      },
    });

    revalidatePath("/admin/offices");
    revalidatePath("/offices");
    return { success: true, message: "Office updated successfully!", data: updatedOffice };
  } catch (err: any) {
    console.error("Update Office Error:", err);
    if (err?.code === 'P2002') {
      const field = err?.meta?.target ? err.meta.target.join(', ') : 'name or code';
      return { success: false, error: `An office with this ${field} already exists.` };
    }
    return { success: false, error: err?.message || "Failed to update office." };
  }
}

export async function toggleOfficeStatusAction(id: string, currentStatus: boolean): Promise<ActionResponse> {
  try {
    await db.officeMaster.update({
      where: { id },
      data: { status: !currentStatus },
    });
    revalidatePath("/admin/offices");
    revalidatePath("/offices");
    return { success: true, message: `Office ${!currentStatus ? "activated" : "disabled"} successfully!` };
  } catch (err) {
    console.error("Toggle Office Status Error:", err);
    return { success: false, error: "Failed to update status." };
  }
}

// ==================== ROUTE SERVER ACTIONS ====================

export async function getRoutesAction(query?: string) {
  try {
    const routes = await db.routeMaster.findMany({
      include: {
        originOffice: true,
        destinationOffice: true,
        pricingGroup: true,
      },
      where: query ? {
        OR: [
          { originOffice: { name: { contains: query, mode: "insensitive" } } },
          { destinationOffice: { name: { contains: query, mode: "insensitive" } } },
          { originOffice: { city: { contains: query, mode: "insensitive" } } },
          { destinationOffice: { city: { contains: query, mode: "insensitive" } } },
        ],
      } : {},
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: routes };
  } catch (err) {
    console.warn("Database offline or not reachable. Serving empty route list.", err);
    return { success: false, error: "Database offline. Please check your Supabase connection string in .env.", data: [] };
  }
}

export async function createRouteAction(formData: unknown): Promise<ActionResponse> {
  const parseResult = RouteSchema.safeParse(formData);
  if (!parseResult.success) {
    return { success: false, error: parseResult.error.issues[0]?.message || "Invalid route data" };
  }

  const data = parseResult.data;

  try {
    const origin = await db.officeMaster.findUnique({ where: { id: data.originOfficeId } });
    const dest = await db.officeMaster.findUnique({ where: { id: data.destinationOfficeId } });

    if (!origin || !dest) {
      return { success: false, error: "Selected origin or destination office does not exist." };
    }

    if (!origin.status || !dest.status) {
      return { success: false, error: "Cannot create route with inactive offices." };
    }

    const existing = await db.routeMaster.findUnique({
      where: {
        originOfficeId_destinationOfficeId: {
          originOfficeId: data.originOfficeId,
          destinationOfficeId: data.destinationOfficeId,
        },
      },
    });

    if (existing) {
      return { success: false, error: "A route between these two offices already exists." };
    }

    const newRoute = await db.routeMaster.create({
      data: {
        ...data,
        pricingGroupId: data.pricingGroupId || null,
      },
    });

    revalidatePath("/admin/routes");
    return { success: true, message: "Route created successfully!", data: newRoute };
  } catch (err) {
    console.error("Create Route Error:", err);
    return { success: false, error: "Failed to create route." };
  }
}

export async function updateRouteAction(id: string, formData: unknown): Promise<ActionResponse> {
  const parseResult = RouteSchema.safeParse(formData);
  if (!parseResult.success) {
    return { success: false, error: parseResult.error.issues[0]?.message || "Invalid route data" };
  }

  const data = parseResult.data;

  try {
    const updatedRoute = await db.routeMaster.update({
      where: { id },
      data: {
        ...data,
        pricingGroupId: data.pricingGroupId || null,
      },
    });

    revalidatePath("/admin/routes");
    return { success: true, message: "Route updated successfully!", data: updatedRoute };
  } catch (err) {
    console.error("Update Route Error:", err);
    return { success: false, error: "Failed to update route." };
  }
}

export async function toggleRouteStatusAction(id: string, currentStatus: boolean): Promise<ActionResponse> {
  try {
    await db.routeMaster.update({
      where: { id },
      data: {
        status: !currentStatus,
        routeStatus: !currentStatus ? "ACTIVE" : "CLOSED",
      },
    });
    revalidatePath("/admin/routes");
    return { success: true, message: `Route ${!currentStatus ? "activated" : "disabled"} successfully!` };
  } catch (err) {
    console.error("Toggle Route Status Error:", err);
    return { success: false, error: "Failed to update route status." };
  }
}
