import type { Role } from "@react-shop/shared";

const staffRoles = new Set<Role>(["support", "manager", "admin"]);

export function homeForRole(role: Role): string {
  if (role === "user" || role === "guest") return "/app";
  return "/dashboard";
}

export function isStaffRole(role: Role): boolean {
  return staffRoles.has(role);
}
