import { prisma } from '@/lib/db';
import { Role } from '@prisma/client';

export const PERMISSION_CODES = {
  // Offices
  OFFICES_READ: 'offices:read',
  OFFICES_MANAGE: 'offices:manage',
  OFFICES_DELETE: 'offices:delete',
  
  // Employees
  EMPLOYEES_READ: 'employees:read',
  EMPLOYEES_MANAGE: 'employees:manage',
  EMPLOYEES_SECURITY: 'employees:security',
  
  // Vehicles
  VEHICLES_READ: 'vehicles:read',
  VEHICLES_MANAGE: 'vehicles:manage',
  
  // Routes
  ROUTES_READ: 'routes:read',
  ROUTES_MANAGE: 'routes:manage',
  
  // Pricing
  PRICING_READ: 'pricing:read',
  PRICING_MANAGE: 'pricing:manage',
  
  // Settings & System
  SETTINGS_MANAGE: 'settings:manage',
  SYSTEM_BACKUP: 'system:backup',
  ACTIVITY_READ: 'activity:read',
  SEARCH_GLOBAL: 'search:global',
} as const;

export type PermissionCode = typeof PERMISSION_CODES[keyof typeof PERMISSION_CODES];

/**
 * Validates whether a given user or role code has a specific permission code.
 * ADMIN and SUPER_ADMIN roles implicitly bypass permission checks.
 */
export async function hasPermission(userId: string, permissionCode: PermissionCode): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      userRoles: {
        include: {
          role: {
            include: {
              permissions: {
                include: { permission: true },
              },
            },
          },
        },
      },
    },
  });

  if (!user) return false;

  // Super Admin & Admin bypass explicit permission mappings
  if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
    return true;
  }

  // Check explicit assigned role permissions
  for (const userRole of user.userRoles) {
    for (const rp of userRole.role.permissions) {
      if (rp.permission.code === permissionCode) {
        return true;
      }
    }
  }

  return false;
}
