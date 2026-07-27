'use server';

import {
  createRoute,
  updateRoute,
  archiveRoute,
  restoreRoute,
  getRoutes,
  CreateRouteInput,
} from '@/lib/services/admin/route.service';
import { createActivityLog } from '@/lib/services/admin/activity.service';
import { hasPermission, PERMISSION_CODES } from '@/lib/services/admin/rbac.service';
import { ActivityType, ActivitySeverity, RouteStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function createRouteAction(userId: string, input: CreateRouteInput) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.ROUTES_MANAGE);
  if (!allowed) return { success: false, error: 'Unauthorized: Missing routes:manage permission.' };

  try {
    const route = await createRoute(input);
    await createActivityLog({
      userId,
      module: 'ROUTE',
      entity: 'RouteMaster',
      entityId: route.id,
      activityType: ActivityType.CREATE,
      severity: ActivitySeverity.INFO,
      action: `Created route: ${route.routeCode}`,
      newData: route,
    });
    revalidatePath('/admin/routes');
    return { success: true, route };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateRouteAction(userId: string, id: string, input: Partial<CreateRouteInput>) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.ROUTES_MANAGE);
  if (!allowed) return { success: false, error: 'Unauthorized' };

  try {
    const route = await updateRoute(id, input);
    await createActivityLog({
      userId,
      module: 'ROUTE',
      entity: 'RouteMaster',
      entityId: route.id,
      activityType: ActivityType.UPDATE,
      severity: ActivitySeverity.INFO,
      action: `Updated route: ${route.routeCode || id}`,
    });
    revalidatePath('/admin/routes');
    return { success: true, route };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function archiveRouteAction(userId: string, id: string) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.ROUTES_MANAGE);
  if (!allowed) return { success: false, error: 'Unauthorized' };

  try {
    const route = await archiveRoute(id);
    await createActivityLog({
      userId,
      module: 'ROUTE',
      entity: 'RouteMaster',
      entityId: id,
      activityType: ActivityType.DELETE,
      severity: ActivitySeverity.WARNING,
      action: `Archived route: ${route.routeCode || id}`,
    });
    revalidatePath('/admin/routes');
    return { success: true, route };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function restoreRouteAction(userId: string, id: string) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.ROUTES_MANAGE);
  if (!allowed) return { success: false, error: 'Unauthorized' };

  try {
    const route = await restoreRoute(id);
    await createActivityLog({
      userId,
      module: 'ROUTE',
      entity: 'RouteMaster',
      entityId: id,
      activityType: ActivityType.UPDATE,
      severity: ActivitySeverity.INFO,
      action: `Restored route: ${route.routeCode || id}`,
    });
    revalidatePath('/admin/routes');
    return { success: true, route };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getRoutesAction(params?: { includeArchived?: boolean; search?: string; routeStatus?: RouteStatus }) {
  try {
    const routes = await getRoutes(params);
    return { success: true, routes };
  } catch (err: any) {
    return { success: false, error: err.message, routes: [] };
  }
}
