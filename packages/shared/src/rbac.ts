import { z } from "zod";

export const RoleSchema = z.enum([
  "guest",
  "user",
  "support",
  "manager",
  "admin",
]);
export type Role = z.infer<typeof RoleSchema>;

export const PermissionSchema = z.enum([
  "catalog:read",
  "catalog:write",
  "orders:read",
  "orders:write",
  "orders:refund",
  "users:read",
  "users:write",
  "analytics:read",
  "settings:write",
]);
export type Permission = z.infer<typeof PermissionSchema>;

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  guest: ["catalog:read"],
  user: ["catalog:read", "orders:read", "orders:write"],
  support: [
    "catalog:read",
    "orders:read",
    "orders:write",
    "orders:refund",
    "users:read",
    "analytics:read",
  ],
  manager: [
    "catalog:read",
    "catalog:write",
    "orders:read",
    "orders:write",
    "orders:refund",
    "users:read",
    "analytics:read",
  ],
  admin: [
    "catalog:read",
    "catalog:write",
    "orders:read",
    "orders:write",
    "orders:refund",
    "users:read",
    "users:write",
    "analytics:read",
    "settings:write",
  ],
};

export function permissionsForRole(role: Role): Permission[] {
  return [...ROLE_PERMISSIONS[role]];
}

export function can(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
