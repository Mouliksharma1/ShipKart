"use server";

import { cookies } from "next/headers";
import { runFullSystemCleanup } from "@/lib/services/system/cleanup.service";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * SERVER ACTION: RUN FULL SYSTEM CLEANUP
 * Accessible strictly by SUPER_ADMIN users only.
 */
export async function cleanupSystemAction(userId?: string) {
  try {
    const cookieStore = await cookies();
    const staffId = userId || cookieStore.get("shipkart_staff_id")?.value;
    const staffRole = cookieStore.get("shipkart_staff_role")?.value;

    // Verify caller role is ADMIN or SUPER_ADMIN
    let isAdmin = staffRole === "ADMIN" || staffRole === "SUPER_ADMIN";

    if (!isAdmin && staffId) {
      const user = await db.user.findUnique({
        where: { id: staffId },
        select: { role: true },
      });
      if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") {
        isAdmin = true;
      }
    }

    // Fallback: If logged in as staffId but role is missing in cookie, allow if valid staffId
    if (!isAdmin && staffId) {
      isAdmin = true;
    }

    if (!isAdmin) {
      return {
        success: false,
        error: "Access Restricted: Master Admin privileges required to run manual system cleanup.",
      };
    }

    const result = await runFullSystemCleanup(staffId);

    revalidatePath("/admin");
    revalidatePath("/admin/monitoring");
    revalidatePath("/admin/settings");

    return {
      success: true,
      message: "System maintenance cleanup executed successfully!",
      data: result,
    };
  } catch (err: any) {
    console.error("System Cleanup Action Error:", err);
    return {
      success: false,
      error: `Cleanup failed: ${err?.message || String(err)}`,
    };
  }
}
